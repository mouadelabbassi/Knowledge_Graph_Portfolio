import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute } from 'three';
import { clusters, edges, nodeById } from '../data/portfolio';
import { connectionPoint } from '../graph/motion';
import type { FloatingGraph } from '../graph/motion';
import { lensNodeIds } from '../graph/presentation';
import { usePortfolioStore } from '../state/usePortfolioStore';

// Light impulses trace existing graph relations. No decorative or invented links.
export function NeuralSignals({ graph, activeId }: { graph: FloatingGraph; activeId: string | null }) {
  const neural = usePortfolioStore(s => s.neuralLinks);
  const lens = usePortfolioStore(s => s.graphLens);
  const query = usePortfolioStore(s => s.queryResult);
  const paths = useMemo(() => {
    const ids = lensNodeIds(lens);
    const candidates = edges.filter(edge => activeId ? edge.source === activeId || edge.target === activeId : query?.status === 'matched' ? query.edgeIds.includes(edge.id) : lens !== 'all' ? ids.has(edge.source) && ids.has(edge.target) : edge.evidence === 'provided');
    const stride = Math.max(1, Math.ceil(candidates.length / 48));
    return candidates.filter((_, i) => i % stride === 0).slice(0, 48);
  }, [activeId, lens, query]);
  const geometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(new Float32Array(paths.length * 3), 3));
    const color = new Color();
    geometry.setAttribute('color', new Float32BufferAttribute(paths.flatMap(edge => {
      color.set(clusters.find(c => c.id === nodeById.get(edge.source)?.cluster)?.color ?? '#2cc6af');
      return color.toArray();
    }), 3));
    return geometry;
  }, [paths]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame(() => {
    if (!neural) return;
    const vertices = geometry.getAttribute('position');
    paths.forEach((edge, i) => {
      const t = (graph.time * (.12 + i % 3 * .025) + i * .618033) % 1;
      vertices.setXYZ(i, ...connectionPoint(graph.positions.get(edge.source)!, graph.positions.get(edge.target)!, t, edge.evidence === 'navigation', edge.source === 'mouad'));
    });
    vertices.needsUpdate = true;
  }, -1);
  return neural ? <points geometry={geometry} frustumCulled={false} raycast={() => null}>
    <shaderMaterial vertexColors transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false}
      vertexShader="varying vec3 vColor;void main(){vColor=color;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=5.;}"
      fragmentShader="varying vec3 vColor;void main(){float r=length(gl_PointCoord-.5)*2.;gl_FragColor=vec4(vColor,pow(max(0.,1.-r),1.5)*.85);}" />
  </points> : null;
}
