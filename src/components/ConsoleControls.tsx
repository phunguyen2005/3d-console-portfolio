import { useEffect, useMemo, useRef, useState } from 'react';
import { Html, RoundedBox } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { ExtrudeGeometry, Shape, type Group } from 'three';
import { gsap } from 'gsap';
import PrintedLabel from './PrintedLabel';
import type { Control } from '../store/consoleStore';
import type { ConsoleController } from '../hooks/useConsoleControls';

function ActionButton({id,x,y,pill=false,controller}:{id:Control;x:number;y:number;pill?:boolean;controller:ConsoleController}) {
 const ref=useRef<Group>(null);const {invalidate}=useThree();const [hover,setHover]=useState(false);const down=controller.pressed===id;
 useEffect(()=>{if(!ref.current)return;const tween=gsap.to(ref.current.position,{z:down?.34:.40,duration:down?.06:.3,ease:down?'power2.out':'back.out(2.4)',onUpdate:invalidate});return()=>{tween.kill();};},[down,invalidate]);
 return <group position={[x,y,0]} rotation={[0,0,pill?.13:0]}>
   {pill?<RoundedBox args={[.55,.17,.08]} radius={.08} position={[0,0,.31]}><meshStandardMaterial color="#a7b29a"/></RoundedBox>:<mesh position={[0,0,.319]}><circleGeometry args={[.316,32]}/><meshStandardMaterial color="#b0b8a4" roughness={.85}/></mesh>}
   <group ref={ref} position={[0,0,.4]}>{pill?<RoundedBox args={[.46,.112,.105]} radius={.05}><meshStandardMaterial color={hover?'#91a17d':'#7c8a6b'} roughness={.78}/></RoundedBox>:<mesh rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[.255,.275,.13,40,1]}/><meshStandardMaterial color={hover?'#8c5964':'#754550'} roughness={.62}/></mesh>}
     <Html transform position={[0,0,.079]} scale={.45} zIndexRange={[9,1]}><div style={{width:pill?55:58,height:pill?38:58}}><button className="device-hit" aria-label={id==='a'?'A — confirm':id==='b'?'B — back':`${id} button`} data-control={id} onPointerEnter={()=>setHover(true)} onPointerLeave={()=>{setHover(false);controller.release();}} onPointerDown={e=>{e.stopPropagation();controller.press(id,true);}} onPointerCancel={controller.release} onPointerUp={controller.release} onClick={e=>{if(e.detail===0)controller.press(id);}}/></div></Html>
   </group><PrintedLabel text={id.toUpperCase()} width={pill?.55:.22} height={pill?.09:.14} position={[0,pill?-.17:-.42,.322]} color="#627259" font={pill?'500 34px monospace':'bold 90px Arial'}/>
 </group>;
}
export default function ConsoleControls({controller}:{controller:ConsoleController}) {
 const ref=useRef<Group>(null);const {invalidate}=useThree();
 const geometry=useMemo(()=>{const s=new Shape();const a=.17,b=.51;s.moveTo(-a,b);s.lineTo(a,b);s.lineTo(a,a);s.lineTo(b,a);s.lineTo(b,-a);s.lineTo(a,-a);s.lineTo(a,-b);s.lineTo(-a,-b);s.lineTo(-a,-a);s.lineTo(-b,-a);s.lineTo(-b,a);s.lineTo(-a,a);s.closePath();return new ExtrudeGeometry(s,{depth:.1,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:2,steps:1});},[]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 useEffect(()=>{if(!ref.current)return;const p=controller.pressed;const tween=gsap.to(ref.current.rotation,{x:p==='up'?-.08:p==='down'?.08:0,y:p==='left'?-.08:p==='right'?.08:0,duration:.16,ease:'back.out(2)',onUpdate:invalidate});const z=gsap.to(ref.current.position,{z:['up','down','left','right'].includes(p||'')?.335:.365,duration:.12,onUpdate:invalidate});return()=>{tween.kill();z.kill();};},[controller.pressed,invalidate]);
 return <group>
  <group position={[-.99,-1.47,0]}><mesh position={[0,0,.319]}><circleGeometry args={[.62,48]}/><meshStandardMaterial color="#cad0be" roughness={.9}/></mesh>
   <group ref={ref} position={[0,0,.365]}><mesh geometry={geometry} castShadow><meshStandardMaterial color="#343d30" roughness={.7}/></mesh><mesh position={[0,0,.129]}><circleGeometry args={[.13,28]}/><meshStandardMaterial color="#2d3629" roughness={.8}/></mesh>
   {([{id:'up',x:0,y:.33,s:'▲'},{id:'down',x:0,y:-.33,s:'▼'},{id:'left',x:-.33,y:0,s:'◀'},{id:'right',x:.33,y:0,s:'▶'}] as const).map(({id,x,y,s})=><group key={id} position={[x,y,.131]}><PrintedLabel text={s} width={.14} height={.12} position={[0,0,.002]} color="#20291e" font="60px Arial"/><Html transform position={[0,0,.01]} scale={.42} zIndexRange={[10,1]}><div style={{width:42,height:42}}><button className="device-hit" aria-label={`D-pad ${id}`} data-control={id} onPointerDown={e=>{e.stopPropagation();controller.press(id,true);}} onPointerCancel={controller.release} onPointerUp={controller.release} onPointerLeave={controller.release} onClick={e=>{if(e.detail===0)controller.press(id);}}/></div></Html></group>)}
   </group></group>
  <ActionButton id="b" x={.68} y={-1.53} controller={controller}/><ActionButton id="a" x={1.28} y={-1.17} controller={controller}/>
  <ActionButton id="select" x={-.55} y={-2.27} pill controller={controller}/><ActionButton id="start" x={.12} y={-2.12} pill controller={controller}/>
 </group>;
}

