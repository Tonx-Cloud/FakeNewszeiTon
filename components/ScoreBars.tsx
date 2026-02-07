import React from 'react'

export default function ScoreBars({ scores }:{ scores:any }){
  return (
    <div className="space-y-2">
      {['fakeProbability','verifiableTruth','biasFraming','manipulationRisk'].map((k:any)=> (
        <div key={k}>
          <div className="text-sm">{k} — {scores?.[k] ?? 0}%</div>
          <div className="h-2 bg-slate-100 rounded"><div className="h-2 bg-slate-800 rounded" style={{width:`${scores?.[k]??0}%`}}></div></div>
        </div>
      ))}
    </div>
  )
}
