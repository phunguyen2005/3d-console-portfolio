export default function Instructions({ onSettings }: { onSettings: () => void }) {
  return <aside className="instructions" aria-label="How to play">
    <div className="instructions-heading mono"><span>HOW TO PLAY</span><span aria-hidden="true">↙</span></div>
    <div className="instruction"><span className="instruction-symbol cross" aria-hidden="true">↑<br />← + →<br />↓</span><div><strong>Find your way</strong><small>D-pad or arrow keys</small></div></div>
    <div className="instruction"><span className="instruction-symbol circle" aria-hidden="true">A</span><div><strong>Take a look</strong><small>A button or Z key</small></div></div>
    <div className="instruction"><span className="instruction-symbol circle" aria-hidden="true">B</span><div><strong>Go back a little</strong><small>B button or X key</small></div></div>
    <div className="instruction"><span className="instruction-symbol pill" aria-hidden="true" /><div><strong>Make yourself at home</strong><small>Start or Enter key</small></div></div>
    <p className="instruction-note mono">NO HIGH SCORE REQUIRED.</p>
    <button className="settings-shortcut" onClick={onSettings}><kbd>SHIFT</kbd> Settings & little details</button>
  </aside>;
}
