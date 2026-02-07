import React from 'react'

export default function UploadPanel({ onSubmit }:{ onSubmit:(payload:any)=>void }){
  return (
    <form onSubmit={(e)=>{e.preventDefault(); const fd=new FormData(e.currentTarget as HTMLFormElement); onSubmit({ inputType: fd.get('type'), content: fd.get('content') })}} className="space-y-3">
      <select name="type" defaultValue="text" className="border p-2">
        <option value="text">Texto</option>
        <option value="link">Link</option>
        <option value="image">Imagem (URL/base64)</option>
        <option value="audio">Áudio (URL/base64)</option>
      </select>
      <textarea name="content" placeholder="Cole o texto, link ou base64..." className="w-full border p-2 h-40"></textarea>
      <div><button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded">Analisar</button></div>
    </form>
  )
}
