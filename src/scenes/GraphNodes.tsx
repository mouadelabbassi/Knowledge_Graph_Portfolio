import { useEffect, useMemo, useRef } from 'react';
import { Color, InstancedMesh, Object3D } from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { useFrame, useThree } from '@react-three/fiber';
import { clusters, nodes } from '../data/portfolio';
import { focusNodeIds, lensNodeIds } from '../graph/presentation';
import type { Position } from '../graph/layout';
import { usePortfolioStore } from '../state/usePortfolioStore';

export function GraphNodes({ positions, activeId }: { positions: Map<string, Position>; activeId: string | null }) {
  const invalidate = useThree(state => state.invalidate);
  const query = usePortfolioStore(state=>state.queryResult);
  const lens=usePortfolioStore(state=>state.graphLens);
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);
  const focus = usePortfolioStore(state => state.focusGraph);
  const hover = usePortfolioStore(state => state.hover);
  useFrame(()=>{
    if(!mesh.current)return;
    nodes.forEach((node,index)=>{
      dummy.position.set(...positions.get(node.id)!);
      const size=node.kind==='person'?.04:node.kind==='cluster'?.13:node.kind==='skill'||node.kind==='technology'?.042:node.kind==='project'||node.kind==='research'?.105:.075;
      dummy.scale.setScalar(size*(activeId===node.id?1.5:1));
      dummy.updateMatrix();mesh.current!.setMatrixAt(index,dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate=true;
  },-1);
  useEffect(() => {
    if (!mesh.current) return;
    const highlighted = activeId ? focusNodeIds(activeId) : query?.status==='matched' ? new Set(query.nodeIds) : lensNodeIds(lens);
    nodes.forEach((node, index) => {
      dummy.position.set(...positions.get(node.id)!);
      const size = node.kind === 'person' ? 0.04 : node.kind === 'cluster' ? 0.13 : node.kind === 'skill' || node.kind === 'technology' ? 0.032 : node.kind==='project'||node.kind==='research'?0.105:0.075;
      dummy.scale.setScalar(size * (activeId === node.id ? 1.5 : 1));
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(index, dummy.matrix);
      color.set(clusters.find(cluster => cluster.id === node.cluster)?.color ?? '#f2ebdd');
      if (!highlighted.has(node.id)) color.multiplyScalar(0.14);
      else if(!activeId&&lens==='all'&&node.cluster==='skills')color.multiplyScalar(.65);
      mesh.current!.setColorAt(index, color);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    mesh.current.computeBoundingSphere();
    // Include the full swimming envelope in the raycaster's broad phase.
    if(mesh.current.boundingSphere)mesh.current.boundingSphere.radius+=1.5;
    invalidate();
  }, [positions, activeId, query, lens, dummy, color, invalidate]);
  const handleHover = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if(event.buttons)return;
    const node = event.instanceId === undefined ? undefined : nodes[event.instanceId];
    hover(node?.id ?? null);
  };
  return <instancedMesh ref={mesh} args={[undefined, undefined, nodes.length]} frustumCulled={false}
    onPointerOver={handleHover} onPointerOut={() => hover(null)}
    onClick={event => {
      event.stopPropagation();
      if(event.delta>5)return;
      const node = event.instanceId === undefined ? undefined : nodes[event.instanceId];
      if (node) focus(node.id);
    }}>
    <octahedronGeometry args={[1, 0]} />
    <meshBasicMaterial toneMapped={false} />
  </instancedMesh>;
}
