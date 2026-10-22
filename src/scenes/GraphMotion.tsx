import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { advanceFloatingGraph } from '../graph/motion';
import type { FloatingGraph } from '../graph/motion';
import { usePortfolioStore } from '../state/usePortfolioStore';

export function GraphMotion({ graph }: { graph: FloatingGraph }) {
  const { gl, invalidate } = useThree();
  const paused = usePortfolioStore(s => s.paused);
  const visible = useRef(true);
  useEffect(() => {
    let intersecting = true;
    const refresh = () => { visible.current = intersecting && !document.hidden; if (visible.current) invalidate(); };
    const observer = new IntersectionObserver(([entry]) => { intersecting = Boolean(entry?.isIntersecting); refresh(); });
    observer.observe(gl.domElement);
    document.addEventListener('visibilitychange', refresh);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', refresh); };
  }, [gl, invalidate]);
  useEffect(() => { invalidate(); }, [paused, invalidate]);
  useFrame((_, delta) => {
    if (paused || !visible.current) return;
    advanceFloatingGraph(graph, delta);
    invalidate();
  }, -4);
  return null;
}
