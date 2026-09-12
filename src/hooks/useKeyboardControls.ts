import { useEffect } from 'react';
import type { Control } from '../store/consoleStore';
const keys: Record<string, Control> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', z: 'a', Z: 'a', x: 'b', X: 'b', Backspace: 'b', Enter: 'start', Shift: 'select' };
export function useKeyboardControls(press: (key: Control, hold?: boolean) => void, release: () => void) {
  useEffect(() => {
    let shiftOnly = false;
    const down = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable=true], .text-edition') || event.ctrlKey || event.metaKey || event.altKey) return;
      if(event.key==='Shift'){shiftOnly=true;return;}
      if(event.shiftKey)shiftOnly=false;
      if (event.key === 'Enter' && target?.closest('button, a')) return;
      const key = keys[event.key]; if (!key) return; event.preventDefault();
      if (event.repeat && !['up', 'down', 'left', 'right'].includes(key)) return;
      press(key,true);
    };
    const up = (event: KeyboardEvent) => { if(event.key==='Shift'&&shiftOnly){shiftOnly=false;press('select');}else if (keys[event.key]) release(); };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', release);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', release); };
  }, [press, release]);
}
