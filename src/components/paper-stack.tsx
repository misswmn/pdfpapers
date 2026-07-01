export function PaperStack() {
  return <div className="paper-stage" aria-label="A stack of graph, lined, dot grid, and Cornell paper previews">
    <div className="orbit orbit-one" /><div className="orbit orbit-two" />
    <div className="paper paper-cornell"><span className="paper-tag">CORNELL</span><div className="cornell-cue" /><div className="cornell-notes" /><div className="cornell-summary" /></div>
    <div className="paper paper-lined"><span className="paper-tag">LINED / 7 MM</span></div>
    <div className="paper paper-grid"><span className="paper-tag">GRID / 5 MM</span><b>01</b></div>
    <div className="paper paper-dots"><span className="paper-tag">DOT / 5 MM</span></div>
    <div className="pencil" />
    <div className="paper-badge"><strong>4</strong><span>paper<br />systems</span></div>
  </div>;
}
