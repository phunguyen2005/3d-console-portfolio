import { useEffect, useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { DataTexture, RGBAFormat, RepeatWrapping } from 'three';
import PrintedLabel from './PrintedLabel';
export default function ConsoleBody() {
  const grain=useMemo(()=>{const data=new Uint8Array(64*64*4);let seed=7;for(let i=0;i<data.length;i+=4){seed=(seed*16807)%2147483647;const v=110+(seed%40);data[i]=data[i+1]=data[i+2]=v;data[i+3]=255;}const t=new DataTexture(data,64,64,RGBAFormat);t.wrapS=t.wrapT=RepeatWrapping;t.repeat.set(9,14);t.needsUpdate=true;return t;},[]);
  useEffect(()=>()=>grain.dispose(),[grain]);
  return <group>
    <RoundedBox args={[3.55,5.75,.52]} radius={.24} smoothness={4} position={[0,0,-.04]} castShadow receiveShadow><meshStandardMaterial color="#b8bdad" roughness={.82}/></RoundedBox>
    <RoundedBox args={[3.53,5.72,.27]} radius={.23} smoothness={5} position={[0,0,.175]} castShadow receiveShadow><meshStandardMaterial color="#e1e3d7" roughness={.74} bumpMap={grain} bumpScale={.008}/></RoundedBox>
    <RoundedBox args={[3.49,.025,.48]} radius={.01} position={[0,2.46,.06]}><meshStandardMaterial color="#c5caba" roughness={.9}/></RoundedBox>
    <RoundedBox args={[3.11,2.83,.105]} radius={.2} smoothness={4} position={[.04,1.1,.34]} castShadow><meshStandardMaterial color="#697365" roughness={.82}/></RoundedBox>
    <RoundedBox args={[2.77,2.42,.07]} radius={.045} smoothness={2} position={[.08,1.06,.389]}><meshStandardMaterial color="#35442f" roughness={.76}/></RoundedBox>
    <PrintedLabel text="DOT FIELD / PERSONAL SYSTEM" width={2.35} height={.14} position={[.02,2.39,.402]} color="#c9cebe"/>
    <PrintedLabel text="FOLIO" width={1.17} height={.35} position={[-.91,-.6,.321]} color="#495949" font="bold 96px Arial"/>
    <PrintedLabel text="01 / POCKET EDITION" width={1.31} height={.11} position={[.52,-.65,.322]} color="#6c7564"/>
    <mesh position={[-1.51,1.15,.414]}><sphereGeometry args={[.027,12,8]}/><meshStandardMaterial color="#dc7654" emissive="#e77b50" emissiveIntensity={.35} roughness={.4}/></mesh>
    <PrintedLabel text="PWR" width={.22} height={.055} position={[-1.51,1.02,.402]} color="#c6cebb"/>
    <PrintedLabel text="ON  /  01" width={.47} height={.08} position={[-.85,2.64,.322]}/>
    <RoundedBox args={[.4,.095,.26]} radius={.027} position={[-.84,2.886,-.01]}><meshStandardMaterial color="#66745e" roughness={.9}/></RoundedBox>
    {Array.from({length:6},(_,i)=><mesh key={`switch${i}`} position={[-1.005+i*.064,2.934,.04]}><boxGeometry args={[.018,.008,.16]}/><meshStandardMaterial color="#8b957d"/></mesh>)}
    <group position={[1.04,-2.25,.322]} rotation={[0,0,-.25]}>{Array.from({length:5},(_,i)=><RoundedBox key={i} args={[.06,.52+i%2*.09,.035]} radius={.027} position={[(i-2)*.15,0,0]}><meshStandardMaterial color="#8a947e" roughness={.95}/></RoundedBox>)}</group>
    <PrintedLabel text="FM—001" width={.42} height={.055} position={[-1.16,-2.57,.322]} color="#939b83"/>
    {[-1,1].map(side=><group key={side} position={[side*1.58,side===1?-2.56:2.64,.324]}><mesh><circleGeometry args={[.037,12]}/><meshStandardMaterial color="#b4bbaa" metalness={.2} roughness={.6}/></mesh><mesh position={[0,0,.001]} rotation={[0,0,.5]}><planeGeometry args={[.033,.006]}/><meshBasicMaterial color="#8f9981"/></mesh></group>)}
    {[0,1,2].map(i=><RoundedBox key={`vent${i}`} args={[.028,.28,.07]} radius={.013} position={[-1.779,1.58-i*.34,-.035]}><meshStandardMaterial color="#7f8975"/></RoundedBox>)}
  </group>;
}
