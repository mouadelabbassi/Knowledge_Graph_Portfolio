import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { BufferGeometry, Float32BufferAttribute, Mesh, Vector3 } from 'three';
import { edges } from '../data/portfolio';
import type { Position } from '../graph/layout';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { countRender, telemetry } from '../debug/telemetry';
import { edgeFragment, edgeVertex } from '../shaders/edgeSignal';

export function QueryPath({ positions }: { positions: Map<string,Position> }) {
  countRender('QueryPath');
  const query = usePortfolioStore(state=>state.queryResult);
  const running = usePortfolioStore(state=>state.replayRunning);
  const index = usePortfolioStore(state=>state.replayIndex);
  const paused = usePortfolioStore(state=>state.paused);
  const invalidate = useThree(state=>state.invalidate);
  const packet = useRef<Mesh>(null);
  const uniforms = useMemo(()=>({uTime:{value:0},uRunning:{value:0}}),[]);
  const activeStep = query && index!==null ? query.steps[index] : undefined;
  const endpoints = useMemo(()=>activeStep?.edgeId && activeStep.sourceId && activeStep.targetId ? [new Vector3(...positions.get(activeStep.sourceId)!),new Vector3(...positions.get(activeStep.targetId)!)] as const : null,[activeStep,positions]);
  const geometry = useMemo(()=>{
    if (!query?.edgeIds.length) return null;
    const vertices:number[]=[];
    const along:number[]=[];
    for(const id of query.edgeIds) {
      const edge=edges.find(edge=>edge.id===id)!;
      vertices.push(...positions.get(edge.source)!,...positions.get(edge.target)!); along.push(0,1);
    }
    const geometry=new BufferGeometry();
    geometry.setAttribute('position',new Float32BufferAttribute(vertices,3));
    geometry.setAttribute('aAlong',new Float32BufferAttribute(along,1));
    geometry.computeBoundingSphere();
    return geometry;
  },[query,positions]);
  useEffect(()=>()=>geometry?.dispose(),[geometry]);
  useEffect(()=>{
    uniforms.uRunning.value=running && !paused ? 1 : 0;
    if(running && !paused) telemetry.animations.add('replay'); else telemetry.animations.delete('replay');
    invalidate();
    return ()=>{telemetry.animations.delete('replay');};
  },[running,paused,invalidate,uniforms]);
  useEffect(()=>{uniforms.uTime.value=0;invalidate();},[index,invalidate,uniforms]);
  useFrame((_,delta)=>{
    if(geometry&&query){
      const vertices=geometry.getAttribute('position');
      query.edgeIds.forEach((id,i)=>{const edge=edges.find(e=>e.id===id)!;vertices.setXYZ(i*2,...positions.get(edge.source)!);vertices.setXYZ(i*2+1,...positions.get(edge.target)!);});
      vertices.needsUpdate=true;
    }
    if(endpoints&&activeStep?.sourceId&&activeStep.targetId){endpoints[0].set(...positions.get(activeStep.sourceId)!);endpoints[1].set(...positions.get(activeStep.targetId)!);}
    if (!running || paused) return;
    uniforms.uTime.value += Math.min(delta,.05);
    if(packet.current && endpoints) packet.current.position.lerpVectors(endpoints[0],endpoints[1],Math.min(1,uniforms.uTime.value/1.4));
    invalidate();
  },-1);
  if(!geometry) return null;
  return <><lineSegments geometry={geometry}><shaderMaterial uniforms={uniforms} vertexShader={edgeVertex} fragmentShader={edgeFragment} transparent depthWrite={false} toneMapped={false} /></lineSegments>{running && endpoints && <mesh ref={packet} position={endpoints[0]}><sphereGeometry args={[.065,8,6]} /><meshBasicMaterial color="#f6b85b" toneMapped={false} /></mesh>}</>;
}
