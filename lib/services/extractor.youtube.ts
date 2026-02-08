import 'server-only'
import type { ExtractionResult } from './extractor.web'

const YOUTUBE_ID_REGEX = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/

/**
 * Extract transcript/captions from a YouTube video.
 * Uses the youtube-transcript package (no browser automation).
 */
export async function extractYouTubeTranscript(url: string): Promise<ExtractionResult> {
  const warnings: string[] = []
  const match = url.match(YOUTUBE_ID_REGEX)

  if (!match || !match[1]) {
    console.error('[yt-extractor] Could not extract videoId from URL:', url)
    return {
      ok: false,
      error: 'Não foi possível identificar o ID do vídeo no link do YouTube.',
      warnings,
    }
  }

  const videoId = match[1]
  console.log(`[yt-extractor] Detected YouTube video: ${videoId} from URL: ${url}`)

  try {
    // Dynamic import to avoid bundling issues
    const { YoutubeTranscript } = await import('youtube-transcript')

    console.log(`[yt-extractor] Fetching transcript for ${videoId} (lang: pt)...`)
    let transcriptItems: any[] | null = null
    let usedFallbackLang = false

    try {
      transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'pt' })
    } catch (ptErr: any) {
      console.log(`[yt-extractor] PT transcript failed: ${ptErr?.message}. Trying without lang...`)
    }

    // Fallback: try without language preference
    if (!transcriptItems || transcriptItems.length === 0) {
      try {
        transcriptItems = await YoutubeTranscript.fetchTranscript(videoId)
        usedFallbackLang = true
      } catch (fallbackErr: any) {
        console.error(`[yt-extractor] Fallback transcript also failed: ${fallbackErr?.message}`)
        transcriptItems = null
      }
    }

    if (!transcriptItems || transcriptItems.length === 0) {
      console.warn(`[yt-extractor] No transcript available for ${videoId}`)
      return {
        ok: false,
        error: 'Este vídeo não possui legendas públicas disponíveis. Não é possível analisar sem texto.',
        warnings: ['youtube_no_public_transcript'],
      }
    }

    if (usedFallbackLang) {
      warnings.push('Transcrição obtida em idioma alternativo (não pt-BR).')
    }

    const text = transcriptItems.map((item: any) => item.text).join(' ').trim()
    console.log(`[yt-extractor] Transcript obtained: ${text.length} chars, ${transcriptItems.length} segments`)

    return buildTranscriptResult(text, videoId, url, warnings)
  } catch (err: any) {
    const msg = err?.message || String(err)
    console.error(`[yt-extractor] Fatal error for ${videoId}:`, msg)

    // Distinguish between "no captions" vs "technical error"
    const noCaptionPatterns = ['disabled', 'not available', 'Could not', 'Transcript is disabled', 'No transcript']
    const isNoCaptions = noCaptionPatterns.some(p => msg.toLowerCase().includes(p.toLowerCase()))

    if (isNoCaptions) {
      return {
        ok: false,
        error: 'Este vídeo não possui legendas públicas disponíveis. Não é possível analisar sem texto.',
        warnings: ['youtube_no_public_transcript'],
      }
    }

    return {
      ok: false,
      error: `Erro técnico ao obter transcrição do YouTube (${msg.slice(0, 100)}). Tente novamente em instantes.`,
      warnings: ['youtube_extraction_error'],
    }
  }
}

function buildTranscriptResult(
  text: string,
  videoId: string,
  url: string,
  warnings: string[],
): ExtractionResult {
  // Normalize whitespace
  let cleaned = text
    .replace(/\s+/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim()

  if (cleaned.length < 200) {
    console.warn(`[yt-extractor] Transcript too short: ${cleaned.length} chars for ${videoId}`)
    return {
      ok: false,
      error: 'Este vídeo possui legenda muito curta para uma análise confiável.',
      warnings: [...warnings, 'youtube_transcript_too_short'],
    }
  }

  // Cap at 10k chars
  if (cleaned.length > 10_000) {
    cleaned = cleaned.slice(0, 10_000)
    warnings.push('Transcrição truncada em 10.000 caracteres.')
  }

  return {
    ok: true,
    text: `[Transcrição do vídeo YouTube: ${videoId}]\n\n${cleaned}`,
    title: `Vídeo YouTube: ${videoId}`,
    sourceUrl: url,
    warnings,
  }
}
