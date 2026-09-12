'use client';
import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CanvasTexture, PCFShadowMap, type Group, type OrthographicCamera } from 'three';
import { gsap } from 'gsap';
import ConsoleBody from './ConsoleBody';
import ConsoleControls from './ConsoleControls';
import ConsoleScreen from './ConsoleScreen';
import FallbackConsole from './FallbackConsole';
import type { ConsoleController } from '../hooks/useConsoleControls';

class SceneBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?this.props.fallback:this.props.children;}}
function Device({controller,rotation}:{controller:ConsoleController;rotation:{x:number;y:number;dragging:boolean}}){
 const group=useRef<Group>(null);const {camera,size,invalidate}=useThree();const intro=useRef({amount:controller.reducedMotion?1:0});
 useEffect(()=>{const c=camera as OrthographicCamera;c.zoom=Math.min(size.height/(size.width<500?6.1:6.72),size.width/(size.width<500?4.05:4.8));c.updateProjectionMatrix();invalidate();},[camera,size,invalidate]);
 useEffect(()=>{if(controller.reducedMotion){intro.current.amount=1;invalidate();return;}const tween=gsap.to(intro.current,{amount:1,duration:1.3,ease:'power3.out',onUpdate:invalidate});return()=>{tween.kill();};},[controller.reducedMotion,invalidate]);
 useFrame((_,delta)=>{if(!group.current)return;const targetX=.04+(controller.reducedMotion?0:rotation.x);const targetY=-.14+(controller.reducedMotion?0:rotation.y);const targetZ=.055;
 const rate=1-Math.exp(-Math.min(delta,.05)*9);const g=group.current;g.rotation.x+=(targetX-g.rotation.x)*rate;g.rotation.y+=(targetY-g.rotation.y)*rate;g.rotation.z=targetZ+(1-intro.current.amount)*.1;g.position.y=-(1-intro.current.amount)*.35;
 if(Math.abs(targetX-g.rotation.x)+Math.abs(targetY-g.rotation.y)>.0001||intro.current.amount<1)invalidate();
 });
 useEffect(invalidate,[rotation.x,rotation.y,invalidate]);
 return <group ref={group} rotation={[.04,-.14,.055]}><ConsoleBody/><ConsoleScreen controller={controller}/><ConsoleControls controller={controller}/></group>;
}
function SoftShadow(){
 const texture=useMemo(()=>{const c=document.createElement('canvas');c.width=128;c.height=128;const ctx=c.getContext('2d')!;const g=ctx.createRadialGradient(64,64,5,64,64,63);g.addColorStop(0,'#41493164');g.addColorStop(.65,'#41493120');g.addColorStop(1,'#41493100');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);return new CanvasTexture(c);},[]);
 useEffect(()=>()=>texture.dispose(),[texture]);return <mesh position={[.2,-.34,-.52]}><planeGeometry args={[5.6,7.15]}/><meshBasicMaterial map={texture} transparent depthWrite={false}/></mesh>;
}
export default function Console3D({controller}:{controller:ConsoleController}) {
  const [supported, setSupported] = useState<boolean | null>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const test = document.createElement('canvas');
      const gl = test.getContext('webgl2');
      const ok = !!gl;
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      return ok;
    } catch {
      return false;
    }
  });
  const [rotation, setRotation] = useState({ x: 0, y: 0, dragging: false });
  const drag = useRef<{ x: number; y: number } | null>(null);
 const fallback=<FallbackConsole controller={controller}/>;
 if(supported===false)return fallback;
 return <div className="console-viewport" data-renderer="three" onPointerMove={e=>{if(controller.reducedMotion)return;const box=e.currentTarget.getBoundingClientRect();if(drag.current){setRotation({x:Math.max(-.15,Math.min(.15,(e.clientY-drag.current.y)*.002)),y:Math.max(-.25,Math.min(.25,(e.clientX-drag.current.x)*.002)),dragging:true});}else if(e.pointerType==='mouse')setRotation({x:-(e.clientY-box.top-box.height/2)/box.height*.055,y:(e.clientX-box.left-box.width/2)/box.width*.09,dragging:false});}} onPointerDown={e=>{if((e.target as HTMLElement).closest('button'))return;drag.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);e.currentTarget.style.cursor='grabbing';}} onPointerUp={e=>{drag.current=null;e.currentTarget.style.cursor='grab';setRotation({x:0,y:0,dragging:false});}} onPointerCancel={()=>{drag.current=null;setRotation({x:0,y:0,dragging:false});}} onPointerLeave={()=>{if(!drag.current)setRotation({x:0,y:0,dragging:false});}} style={{cursor:'grab'}}>
 {supported && <SceneBoundary fallback={fallback}><Canvas orthographic camera={{position:[0,0,16],near:.1,far:50,zoom:100}} dpr={[1,2.5]} frameloop="demand" shadows={{type:PCFShadowMap}} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.domElement.addEventListener('webglcontextlost',()=>setSupported(false),{once:true});}}><ambientLight intensity={1.7}/><directionalLight position={[-3,7,8]} intensity={2.6} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-normalBias={.025} shadow-radius={5}/><directionalLight position={[4,-1,5]} intensity={.65}/><SoftShadow/><Device controller={controller} rotation={rotation}/></Canvas></SceneBoundary>}
 </div>;
}
