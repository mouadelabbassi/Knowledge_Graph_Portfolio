import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, forceZ } from 'd3-force-3d';
import type { SimulationNodeDatum } from 'd3-force-3d';
import { clusters, edges, nodes } from '../data/portfolio';
import { telemetry } from '../debug/telemetry';

export type Position = [number, number, number];
interface LayoutNode extends SimulationNodeDatum {
  id: string;
  target: Position;
  radius: number;
}

function seededRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

// Authored cluster anchors preserve legibility; d3 resolves the smaller nodes.
// The simulation runs once, never in the render loop, and never mutates content.
export function createGraphLayout(): Map<string, Position> {
  const start = performance.now();
  const indices = new Map<string, number>();
  const layoutNodes: LayoutNode[] = nodes.map(node => {
    let target: Position = [0, 0, 1];
    const cluster = clusters.find(cluster => cluster.id === node.cluster);
    if (node.kind === 'cluster' && cluster) target = [...cluster.anchor];
    else if (cluster) {
      const index = indices.get(cluster.id) ?? 0;
      indices.set(cluster.id, index + 1);
      const angle = index * 2.399963 + (cluster.id === 'projects' ? 0.5 : 1.2);
      const radius = cluster.id === 'skills' ? 0.5 + Math.sqrt(index) * 0.115 : 1.05 + Math.sqrt(index) * 0.25;
      target = [cluster.anchor[0] + Math.cos(angle) * radius, cluster.anchor[1] + Math.sin(angle) * radius, cluster.anchor[2] + Math.sin(index * 1.7) * (cluster.id==='skills'?1.1:0.7)];
    }
    const fixed = node.kind === 'person' || node.kind === 'cluster';
    return {
      id: node.id, target, x: target[0], y: target[1], z: target[2],
      radius: node.kind === 'cluster' ? 0.42 : node.kind === 'person' ? 0.65 : node.kind === 'skill' || node.kind === 'technology' ? 0.1 : 0.28,
      ...(fixed ? { fx: target[0], fy: target[1], fz: target[2] } : {}),
    };
  });
  const navigationLinks = edges.filter(edge => edge.evidence === 'navigation').map(edge => ({ source: edge.source, target: edge.target }));
  const simulation = forceSimulation(layoutNodes, 3)
    .randomSource(seededRandom(2026))
    .force('x', forceX<LayoutNode>(node => node.target[0]).strength(0.8))
    .force('y', forceY<LayoutNode>(node => node.target[1]).strength(0.8))
    .force('z', forceZ<LayoutNode>(node => node.target[2]).strength(0.6))
    .force('charge', forceManyBody<LayoutNode>().strength(-0.025))
    .force('collide', forceCollide<LayoutNode>(node => node.radius).strength(0.9).iterations(2))
    .force('links', forceLink<LayoutNode>(navigationLinks).id(node => node.id).distance(1.3).strength(0.012))
    .stop();
  let ticks = 0;
  // Bake to d3's convergence threshold. Never leave its timer running.
  while (simulation.alpha() > simulation.alphaMin() && ticks < 600) { simulation.tick(); ticks++; }
  simulation.stop();
  telemetry.layout = { runs: telemetry.layout.runs + 1, ticks, ms: performance.now() - start, alpha: simulation.alpha(), maxSpeed: Math.max(...layoutNodes.map(node => Math.hypot(node.vx ?? 0, node.vy ?? 0, node.vz ?? 0))), stopped: true };
  return new Map(layoutNodes.map(node => [node.id, [node.x ?? 0, node.y ?? 0, node.z ?? 0]]));
}

let cachedLayout: Map<string, Position> | undefined;
export function getGraphLayout(): Map<string, Position> {
  cachedLayout ??= createGraphLayout();
  return cachedLayout;
}
