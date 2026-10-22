import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, Mesh, ShaderMaterial } from 'three';
import { clusters, nodes } from '../data/portfolio';
import { focusNodeIds, lensNodeIds } from '../graph/presentation';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { telemetry } from '../debug/telemetry';
import type { Position } from '../graph/layout';

const glowVertex=`attribute vec3 aTint;attribute float aSize;varying vec3 vTint;void main(){vTint=aTint;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=aSize;}`;
const glowFragment=`uniform float uReveal;varying vec3 vTint;void main(){float r=length(gl_PointCoord-.5)*2.;float alpha=pow(max(0.,1.-r),2.8)*.65*uReveal;gl_FragColor=vec4(vTint,alpha);}`;
export function ConstellationAtmosphere({positions,activeId}:{positions:Map<string,Position>;activeId:string|null}){
  const lens=usePortfolioStore(s=>s.graphLens),paused=usePortfolioStore(s=>s.paused),query=usePortfolioStore(s=>s.queryResult);
  const material=useRef<ShaderMaterial>(null),remaining=useRef(0);
  const ring=useRef<Mesh>(null);
  const invalidate=useThree(s=>s.invalidate);
  const uniforms=useMemo(()=>({uReveal:{value:1}}),[]);
  const glow=useMemo(()=>{
    const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(nodes.flatMap(n=>positions.get(n.id)!),3));geometry.setAttribute('aTint',new Float32BufferAttribute(new Float32Array(nodes.length*3),3));geometry.setAttribute('aSize',new Float32BufferAttribute(new Float32Array(nodes.length),1));return geometry;
  },[positions]);
  const stars=useMemo(()=>{
    const vertices=[];let seed=159;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
    for(let i=0;i<180;i++)vertices.push((random()-.5)*18,(random()-.5)*14,-3-random()*3);
    const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(vertices,3));return geometry;
  },[]);
  useEffect(()=>()=>{glow.dispose();stars.dispose();},[glow,stars]);
  useEffect(()=>{
    const ids=activeId?focusNodeIds(activeId):query?.status==='matched'?new Set(query.nodeIds):lensNodeIds(lens);
    const color=new Color(),colors=glow.getAttribute('aTint'),sizes=glow.getAttribute('aSize');
    nodes.forEach((node,i)=>{color.set(clusters.find(c=>c.id===node.cluster)?.color??'#2cc6af');if(!ids.has(node.id))color.multiplyScalar(.06);colors.setXYZ(i,color.r,color.g,color.b);sizes.setX(i,node.kind==='cluster'?48:node.kind==='person'?0:node.kind==='project'||node.kind==='research'?32:node.cluster==='skills'?9:22);});
    colors.needsUpdate=true;sizes.needsUpdate=true;remaining.current=paused?0:1.2;uniforms.uReveal.value=paused?1:.3;invalidate();if(!paused)telemetry.animations.add('constellation');
    return()=>{telemetry.animations.delete('constellation');};
  },[activeId,lens,paused,query,glow,uniforms,invalidate]);
  useFrame(({camera},delta)=>{
    const attribute=glow.getAttribute('position');
    nodes.forEach((node,i)=>attribute.setXYZ(i,...positions.get(node.id)!));attribute.needsUpdate=true;
    if(ring.current&&activeId){ring.current.position.set(...positions.get(activeId)!);ring.current.quaternion.copy(camera.quaternion);ring.current.rotateZ(Math.PI/4);}
    if(remaining.current<=0)return;remaining.current=Math.max(0,remaining.current-Math.min(delta,.05));uniforms.uReveal.value=1-remaining.current/1.2*.7;invalidate();if(remaining.current===0)telemetry.animations.delete('constellation');
  },-1);
  const position=activeId?positions.get(activeId):undefined;
  return <>
    <points geometry={stars}><pointsMaterial color='#c4d8ce' size={.015} transparent opacity={.32} depthWrite={false} sizeAttenuation/></points>
    <points geometry={glow} raycast={()=>null}><shaderMaterial ref={material} uniforms={uniforms} vertexShader={glowVertex} fragmentShader={glowFragment} transparent blending={AdditiveBlending} depthWrite={false} toneMapped={false}/></points>
    {position&&<mesh ref={ring} position={position} rotation={[0,0,Math.PI/4]}><ringGeometry args={[.26,.275,4]}/><meshBasicMaterial color='#f6b85b' transparent opacity={.9} depthWrite={false}/></mesh>}
  </>;
}
