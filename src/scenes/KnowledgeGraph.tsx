import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh, ShaderMaterial } from 'three';
import { createFloatingGraph } from '../graph/motion';
import { GraphMotion } from './GraphMotion';
import { NeuralSignals } from './NeuralSignals';
import { getGraphLayout } from '../graph/layout';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { GraphEdges } from './GraphEdges';
import { GraphNodes } from './GraphNodes';
import { GraphLabels, GraphProjection } from './GraphLabels';
import type { LabelRegistry } from './GraphLabels';
import { GraphCamera } from './GraphCamera';
import { GraphOrnaments } from './GraphOrnaments';
import { nodeFragment, nodeVertex } from '../shaders/nodePulse';
import { countRender, debugEnabled, telemetry } from '../debug/telemetry';
import { SceneTelemetry } from '../debug/SceneTelemetry';
import { QueryPath } from './QueryPath';
import { ConstellationAtmosphere } from './ConstellationAtmosphere';

function CentralGlyph({ paused }: { paused: boolean }) {
  const material = useRef<ShaderMaterial>(null);
  const mesh = useRef<Mesh>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useEffect(() => {
    if (paused) return;
    telemetry.animations.add('intro');
    const timer = setTimeout(() => telemetry.animations.delete('intro'), 1800);
    return () => { clearTimeout(timer); telemetry.animations.delete('intro'); };
  }, [paused]);
  useFrame(({ invalidate, camera }, delta) => {
    mesh.current?.quaternion.copy(camera.quaternion);
    if (!paused && telemetry.animations.size && material.current) {
      material.current.uniforms.uTime!.value += Math.min(delta, 0.05);
      invalidate();
    }
  });
  return <mesh ref={mesh} position={[0, 0, 2.1]}><planeGeometry args={[2.4, 2.4]} /><shaderMaterial ref={material} uniforms={uniforms} vertexShader={nodeVertex} fragmentShader={nodeFragment} transparent depthWrite={false} /></mesh>;
}

export default function KnowledgeGraph({ mobile, onFailure }: {
  mobile: boolean; onFailure: () => void;
}) {
  countRender('KnowledgeGraph');
  const graph = useMemo(() => createFloatingGraph(getGraphLayout()), []);
  const positions = graph.positions;
  const labels = useMemo<LabelRegistry>(() => ({ elements: new Map(), revision: 0 }), []);
  const selectedId = usePortfolioStore(state => state.selectedId);
  const hoveredId = usePortfolioStore(state => state.hoveredId);
  const focusId = usePortfolioStore(state=>state.graphFocusId);
  const paused = usePortfolioStore(state => state.paused);
  const dpr = mobile ? 1 : Math.min(window.devicePixelRatio, 1.5);
  const activeId = hoveredId ?? selectedId ?? focusId;
  return <><Canvas camera={{ position: [0, 0, mobile ? 22 : 17.4], fov: 40, near: 0.1, far: 140 }}
    dpr={dpr} frameloop="demand"
    gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
    onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', onFailure, { once: true }); }}
    fallback={null}>
    <GraphMotion graph={graph} />
    <GraphCamera positions={positions} mobile={mobile} />
    {debugEnabled && <SceneTelemetry />}
    <GraphOrnaments />
    <ConstellationAtmosphere positions={positions} activeId={activeId}/>
    <GraphEdges positions={positions} activeId={activeId} />
    <GraphNodes positions={positions} activeId={activeId} />
    <NeuralSignals graph={graph} activeId={activeId} />
    <QueryPath positions={positions} />
    <CentralGlyph paused={paused} />
    <GraphProjection positions={positions} registry={labels} graph={graph} />
  </Canvas><GraphLabels registry={labels} activeId={activeId} /></>;
}
