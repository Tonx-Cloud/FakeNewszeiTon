import crypto from 'crypto'

export function fingerprintText(text: string){
  return crypto.createHash('sha256').update(text || '').digest('hex')
}
