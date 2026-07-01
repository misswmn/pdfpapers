"use client";

import { useMemo, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import Link from "next/link";

export type PaperType = "grid" | "lined" | "dots" | "cornell" | "weekly" | "habit";
type SizeName = "A4" | "A5" | "Letter";
const sizes: Record<SizeName, { width: number; height: number }> = { A4: { width: 210, height: 297 }, A5: { width: 148, height: 210 }, Letter: { width: 215.9, height: 279.4 } };
const colors = ["#7897A7", "#35435D", "#6E9C85", "#C58C87", "#678BB8"];
const labels: Record<PaperType, string> = { grid: "Graph", lined: "Lined", dots: "Dot grid", cornell: "Cornell", weekly: "Weekly", habit: "Habit" };
const mmToPt = (mm: number) => mm * 72 / 25.4;
function hexToRgb(hex: string) { const n = Number.parseInt(hex.slice(1), 16); return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }; }

function PaperSvg({ type, size, spacing, weight, color }: { type: PaperType; size: SizeName; spacing: number; weight: number; color: string }) {
  const { width, height } = sizes[size], margin = 12;
  const lines: React.ReactNode[] = [];
  if (type === "grid") for (let x = margin; x <= width - margin; x += spacing) lines.push(<line key={`x${x}`} x1={x} y1={margin} x2={x} y2={height-margin} />);
  if (type === "grid") for (let y = margin; y <= height - margin; y += spacing) lines.push(<line key={`y${y}`} x1={margin} y1={y} x2={width-margin} y2={y} />);
  if (type === "lined" || type === "cornell") for (let y = margin + (type === "cornell" ? 14 : 0); y <= height - margin - (type === "cornell" ? 32 : 0); y += spacing) lines.push(<line key={y} x1={type === "cornell" ? margin + 42 : margin} y1={y} x2={width-margin} y2={y} />);
  if (type === "dots") for (let x=margin;x<=width-margin;x+=spacing) for(let y=margin;y<=height-margin;y+=spacing) lines.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={Math.max(.32,weight*.45)} fill={color}/>);
  return <svg className="paper-preview" style={{width:`min(100%, ${width/height*565}px)`,aspectRatio:`${width}/${height}`}} viewBox={`0 0 ${width} ${height}`} aria-label={`${labels[type]} paper preview`}>
    <rect width={width} height={height} fill="white"/><g stroke={color} strokeWidth={weight*.36} fill="none">{lines}</g>
    {type === "cornell" && <g stroke={color} strokeWidth={weight*.5} fill="none"><line x1={margin+42} y1={margin} x2={margin+42} y2={height-margin-30}/><line x1={margin} y1={height-margin-30} x2={width-margin} y2={height-margin-30}/></g>}
    {type === "weekly" && <g stroke={color} strokeWidth={weight*.45} fill="none">{Array.from({length:8},(_,i)=><line key={i} x1={margin+i*(width-margin*2)/7} y1={margin+17} x2={margin+i*(width-margin*2)/7} y2={height-margin}/>)}<line x1={margin} y1={margin+17} x2={width-margin} y2={margin+17}/>{["M","T","W","T","F","S","S"].map((d,i)=><text key={i} x={margin+(i+.5)*(width-margin*2)/7} y={margin+11} textAnchor="middle" fill={color} stroke="none" fontSize="5" fontFamily="sans-serif">{d}</text>)}</g>}
    {type === "habit" && <g stroke={color} strokeWidth={weight*.4} fill="none">{Array.from({length:11},(_,i)=><line key={`r${i}`} x1={margin} y1={margin+20+i*spacing} x2={width-margin} y2={margin+20+i*spacing}/>)}{Array.from({length:17},(_,i)=><line key={`c${i}`} x1={margin+38+i*(width-margin*2-38)/16} y1={margin+12} x2={margin+38+i*(width-margin*2-38)/16} y2={margin+20+10*spacing}/>)}</g>}
  </svg>;
}

export function GeneratorWorkspace({ initialType = "grid" }: { initialType?: PaperType }) {
  const [type,setType]=useState<PaperType>(initialType), [size,setSize]=useState<SizeName>("A4"), [spacing,setSpacing]=useState(7), [weight,setWeight]=useState(.7), [color,setColor]=useState(colors[0]), [busy,setBusy]=useState(false), [error,setError]=useState("");
  const title = useMemo(()=>`${labels[type]} paper`,[type]);
  async function downloadPdf(){
    setBusy(true); setError("");
    try {
      const doc=await PDFDocument.create(), s=sizes[size], page=doc.addPage([mmToPt(s.width),mmToPt(s.height)]), c=hexToRgb(color), ink=rgb(c.r,c.g,c.b), margin=mmToPt(12), w=page.getWidth(),h=page.getHeight(),step=mmToPt(spacing),thickness=Math.max(.25,weight*.55);
      const line=(x1:number,y1:number,x2:number,y2:number)=>page.drawLine({start:{x:x1,y:y1},end:{x:x2,y:y2},thickness,color:ink,opacity:.82});
      if(type==="grid"){for(let x=margin;x<=w-margin;x+=step)line(x,margin,x,h-margin);for(let y=margin;y<=h-margin;y+=step)line(margin,y,w-margin,y);}
      if(type==="lined"||type==="cornell"){const left=type==="cornell"?margin+mmToPt(42):margin, bottom=type==="cornell"?margin+mmToPt(30):margin;for(let y=bottom;y<=h-margin-(type==="cornell"?mmToPt(14):0);y+=step)line(left,y,w-margin,y);if(type==="cornell"){line(left,bottom,left,h-margin);line(margin,bottom,w-margin,bottom);}}
      if(type==="dots")for(let x=margin;x<=w-margin;x+=step)for(let y=margin;y<=h-margin;y+=step)page.drawCircle({x,y,size:Math.max(.6,weight),color:ink,opacity:.85});
      if(type==="weekly"){const top=h-margin-mmToPt(17),col=(w-margin*2)/7;line(margin,top,w-margin,top);for(let i=0;i<=7;i++)line(margin+i*col,margin,margin+i*col,top);}
      if(type==="habit"){const label=mmToPt(38),row=step,top=h-margin-mmToPt(20);for(let i=0;i<=10;i++)line(margin,top-i*row,w-margin,top-i*row);for(let i=0;i<=16;i++){const x=margin+label+i*(w-margin*2-label)/16;line(x,top+mmToPt(8),x,top-10*row);}}
      doc.setTitle(`Custom ${labels[type]} Paper`); doc.setCreator("pdfpapers.com");
      const bytes=await doc.save(), blob=new Blob([new Uint8Array(bytes)],{type:"application/pdf"}), url=URL.createObjectURL(blob), a=document.createElement("a");
      a.href=url; a.download=`pdfpapers-${type}-${size.toLowerCase()}.pdf`; a.style.display="none"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
    } catch { setError("The PDF could not be created. Please try again."); } finally { setBusy(false); }
  }
  return <><div className="generator-top"><div><h1>{title}, your way.</h1><p>Adjust every detail. The preview updates as you go.</p></div><div className="privacy-label">● MADE LOCALLY IN YOUR BROWSER</div></div>
    <div className="workspace"><aside className="control-panel"><h2>Paper settings</h2>
      <div className="control-group"><span className="control-label">Format</span><div className="type-grid">{(Object.keys(labels) as PaperType[]).map(t=><button className={`type-button ${type===t?"active":""}`} onClick={()=>setType(t)} key={t}>{labels[t]}</button>)}</div></div>
      <div className="control-group"><span className="control-label">Paper size</span><div className="segmented">{(Object.keys(sizes) as SizeName[]).map(s=><button className={size===s?"active":""} onClick={()=>setSize(s)} key={s}>{s}</button>)}</div></div>
      <div className="control-group"><label htmlFor="spacing">Spacing</label><div className="range-row"><input id="spacing" type="range" min="4" max="14" step="1" value={spacing} onChange={e=>setSpacing(+e.target.value)}/><span className="range-value">{spacing} mm</span></div></div>
      <div className="control-group"><label htmlFor="weight">Line weight</label><div className="range-row"><input id="weight" type="range" min="0.4" max="1.6" step="0.1" value={weight} onChange={e=>setWeight(+e.target.value)}/><span className="range-value">{weight.toFixed(1)} pt</span></div></div>
      <div className="control-group"><span className="control-label">Ink color</span><div className="swatches">{colors.map(c=><button key={c} aria-label={`Use ${c}`} className={`swatch ${color===c?"active":""}`} style={{background:c}} onClick={()=>setColor(c)}/>)}</div></div>
      <button className="download-button" disabled={busy} onClick={downloadPdf}>{busy?"Creating your PDF…":"Download free PDF  ↗"}</button><p className="download-note">Vector sharp · Print-ready · No watermark</p>{error&&<p className="generator-error">{error}</p>}
    </aside><div className="preview-stage"><PaperSvg type={type} size={size} spacing={spacing} weight={weight} color={color}/></div></div>
    <aside className="upsell"><div className="upsell-art"/><div><h3>Need a complete system?</h3><p>The Academic Field Kit has 50+ coordinated study pages.</p></div><Link href="/#premium">See the $9 kit ↗</Link></aside></>;
}
