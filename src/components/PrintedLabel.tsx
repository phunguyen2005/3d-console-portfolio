import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
export default function PrintedLabel({text,width=.8,height=.1,position=[0,0,.4],color='#5c6659',font='500 36px monospace',rotation=0}:{text:string;width?:number;height?:number;position?:[number,number,number];color?:string;font?:string;rotation?:number}) {
  const texture=useMemo(()=>{const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d')!;ctx.fillStyle=color;ctx.font=font;ctx.textAlign='center';ctx.textBaseline='middle';const measure=ctx.measureText(text);ctx.translate(256,64);ctx.scale(490/Math.max(1,measure.width),88/Math.max(1,measure.actualBoundingBoxAscent+measure.actualBoundingBoxDescent));ctx.fillText(text,0,0);const tex=new CanvasTexture(c);tex.colorSpace=SRGBColorSpace;return tex;},[text,color,font]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <mesh position={position} rotation={[0,0,rotation]}><planeGeometry args={[width,height]}/><meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false}/></mesh>;
}
