import React from 'react'

export default function ReportView({ report }: { report: any }){
  return (
    <div className="border rounded p-4">
      <h2 className="font-semibold">{report?.summary?.headline || 'Resumo'}</h2>
      <p className="mt-2 text-sm">{report?.summary?.oneParagraph}</p>
      <div className="mt-3">
        <strong>Veredito:</strong> {report?.summary?.verdict}
      </div>
    </div>
  )
}
