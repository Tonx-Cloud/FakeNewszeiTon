import { openai } from './openai'
import crypto from 'crypto'

export async function analyzePipeline(inputType: string, content: string) {
  // For image/audio/link, in MVP we expect content to be text or a transcribed/extracted representation.
  const normalized = (content || '').slice(0, 20000)
  const fingerprint = crypto.createHash('sha256').update(normalized).digest('hex')

  // Build a prompt to ask OpenAI to return structured JSON matching the required schema
  const prompt = `You are an assistant that analyzes content for disinformation. Return only JSON with fields: meta, scores, summary, claims, similar, reportMarkdown. Content: ${normalized}`

  const resp = await openai.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    input: prompt,
    max_output_tokens: 800
  })

  // Try to parse JSON from output
  const txt = String((resp as any).output_text || JSON.stringify(resp))
  let parsed: any = null
  try { parsed = JSON.parse(txt) } catch (e) {
    // fallback: build a minimal response
    parsed = {
      meta: { id: crypto.randomUUID(), createdAt: new Date().toISOString(), inputType, language: 'pt-BR', mode: 'mvp_no_external_sources', warnings: [] },
      scores: { fakeProbability: 50, verifiableTruth: 20, biasFraming: 40, manipulationRisk: 30 },
      summary: { headline: 'Resumo (MVP)', oneParagraph: normalized.slice(0, 300), verdict: 'Inconclusivo' },
      claims: [],
      similar: { searchQueries: [], externalChecks: [] },
      reportMarkdown: `# Relatório\n\n${normalized}`
    }
  }

  // Ensure required fields exist
  parsed.meta = parsed.meta || { id: crypto.randomUUID(), createdAt: new Date().toISOString(), inputType, language: 'pt-BR', mode: 'mvp_no_external_sources', warnings: [] }
  parsed.scores = parsed.scores || { fakeProbability: 0, verifiableTruth: 0, biasFraming: 0, manipulationRisk: 0 }
  parsed.reportMarkdown = parsed.reportMarkdown || ''

  // attach fingerprint
  parsed.meta.fingerprint = fingerprint

  return parsed
}
