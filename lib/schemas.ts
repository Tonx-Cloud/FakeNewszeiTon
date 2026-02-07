import { z } from 'zod'

export const AnalyzeBody = z.object({ inputType: z.enum(['text','link','image','audio']), content: z.string() })
