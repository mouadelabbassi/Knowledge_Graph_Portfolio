import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { connectionPoint } from '../graph/motion';
import { clusters, edges, nodeById } from '../data/portfolio';
import { lensNodeIds } from '../graph/presentation';
import type { Position } from '../graph/layout';
import { usePortfolioStore } from '../state/usePortfolioStore';

export function GraphEdges({ positions, activeId }: { positions: Map<string, Position>; activeId: string | null }) {
  const invalidate = useThree(state => state.invalidate);
  const query = usePortfolioStore(state=>state.queryResult);
  const lens=usePortfolioStore(state=>state.graphLens);
  const neural=usePortfolioStore(state=>state.neuralLinks);
  const visibleEdges=useRef<number[]>([]);
  const segments=10;
  const geometry = useMemo(() => {
    const vertices = new Float32Array(edges.length * segments * 6);
    const result = new BufferGeometry();
    result.setAttribute('position', new BufferAttribute(vertices, 3));
    result.setAttribute('color', new BufferAttribute(new Float32Array(edges.length * segments * 6), 3));
    result.computeBoundingSphere();
    return result;
  }, [positions]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => {
    const colors = geometry.getAttribute('color') as BufferAttribute;
    const vertices = geometry.getAttribute('position') as BufferAttribute;
    const color = new Color();
    const queryEdges = new Set(query?.edgeIds ?? []);
    const lensIds=lensNodeIds(lens);
    visibleEdges.current=[];
    edges.forEach((edge, index) => {
      const active = activeId ? edge.source === activeId || edge.target === activeId : queryEdges.has(edge.id);
      const sourceNode=nodeById.get(edge.source)!;
      const edgeColor=clusters.find(c=>c.id===sourceNode.cluster)?.color??'#2cc6af';
      color.set(active||edge.evidence==='provided'?edgeColor:'#42645a');
      const visible=activeId?active:query?.status==='matched'?queryEdges.has(edge.id):lens!=='all'?lensIds.has(edge.source)&&lensIds.has(edge.target):neural||edge.evidence==='navigation'&&(edge.source!=='skills'||index%21===0);
      if(visible)visibleEdges.current.push(index);
      const strength=active?.85:lens!=='all'?.25:edge.source==='mouad'?.48:edge.evidence==='provided'?.035:.13;
      color.multiplyScalar(strength);
      for(let s=0;s<segments;s++){
        const v=(index*segments+s)*2;
        if(!visible){vertices.setXYZ(v,0,0,0);vertices.setXYZ(v+1,0,0,0);}
        colors.setXYZ(v,color.r,color.g,color.b);colors.setXYZ(v+1,color.r,color.g,color.b);
      }
    });
    colors.needsUpdate = true;
    vertices.needsUpdate = true;
    invalidate();
  }, [activeId, query, lens, neural, geometry, invalidate, positions]);
  useFrame(()=>{
    const vertices=geometry.getAttribute('position') as BufferAttribute;
    for(const index of visibleEdges.current){
      const edge=edges[index]!,source=positions.get(edge.source)!,target=positions.get(edge.target)!;
      let previous=source;
      for(let s=0;s<segments;s++){
        const next=connectionPoint(source,target,(s+1)/segments,edge.evidence==='navigation',edge.source==='mouad');
        const v=(index*segments+s)*2;
        vertices.setXYZ(v,...previous);vertices.setXYZ(v+1,...next);previous=next;
      }
    }
    vertices.needsUpdate=true;
  },-1);
  return <lineSegments geometry={geometry} frustumCulled={false}><lineBasicMaterial vertexColors transparent opacity={0.22} blending={AdditiveBlending} depthWrite={false} /></lineSegments>;
}
