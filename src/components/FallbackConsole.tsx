import { useEffect, useRef, useState } from 'react';
import { getHitAreas, renderScreen } from '../screens/renderScreen';
import type { ConsoleController } from '../hooks/useConsoleControls';
import type { Control } from '../store/consoleStore';
import { screenDescription } from '../screens/screenDescription';
export default function FallbackConsole({controller}:{controller:ConsoleController}){
 const ref=useRef<HTMLCanvasElement>(null);const [avatar,setAvatar]=useState<HTMLImageElement|null>(null);
  useEffect(() => {
    controller.powerOn();
  }, [controller]);
 useEffect(()=>{const img=new Image();img.onload=()=>setAvatar(img);img.src='/pixel-avatar.png';return()=>{img.onload=null;};},[]);
 useEffect(()=>{if(ref.current)renderScreen(ref.current,controller.state,avatar);},[controller.state,avatar]);
 return <div className="fallback-shell" data-renderer="2d"><canvas ref={ref} width={240} height={208} aria-label={`Portfolio screen: ${controller.state.screen}`} onClick={e=>{const box=e.currentTarget.getBoundingClientRect();const x=(e.clientX-box.left-16)/(box.width-32)*240,y=(e.clientY-box.top-16)/(box.height-32)*208;const hit=getHitAreas(controller.state).find(h=>x>=h.x&&x<h.x+h.width&&y>=h.y&&y<h.y+h.height);if(hit){if(hit.back)controller.press('b');else controller.activate(hit.index);}}}/><p className="fallback-label">FOLIO / 01 · TEXTURE EDITION</p><div className="fallback-controls">{(['up','down','a','b','start','select'] as Control[]).map(key=><button key={key} aria-label={`Console ${key}`} onClick={()=>controller.press(key)}>{key==='up'?'↑':key==='down'?'↓':key.toUpperCase()}</button>)}</div><div className="sr-only" aria-live="polite">{screenDescription(controller.state)}</div><p style={{fontSize:12,textAlign:'center'}}>Your little world, in 2D.<br/>Use the controls, keyboard, or text edition.</p></div>;
}
