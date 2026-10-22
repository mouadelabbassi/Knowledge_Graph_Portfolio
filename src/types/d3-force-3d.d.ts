// The upstream package has no DefinitelyTyped release. These declarations cover
// only the public 3D force APIs used by this project; no untyped escape hatches.
declare module 'd3-force-3d' {
  export interface SimulationNodeDatum { x?: number; y?: number; z?: number; vx?: number; vy?: number; vz?: number; fx?: number; fy?: number; fz?: number; index?: number }
  export interface Force<T> { (alpha: number): void; initialize?: (nodes: T[], random?: () => number, dimensions?: number) => void }
  export interface Simulation<T> {
    stop(): this;
    tick(iterations?: number): this;
    alpha(): number;
    alphaMin(): number;
    force(name: string, force: Force<T> | null): this;
    randomSource(source: () => number): this;
  }
  export interface AxisForce<T> extends Force<T> { strength(value: number): this }
  export interface ManyBodyForce<T> extends Force<T> { strength(value: number): this }
  export interface CollideForce<T> extends Force<T> { strength(value: number): this; iterations(value: number): this }
  export interface LinkDatum<T> { source: string | T; target: string | T }
  export interface LinkForce<T> extends Force<T> { id(accessor: (node: T) => string): this; distance(value: number): this; strength(value: number | ((link: LinkDatum<T>) => number)): this }
  export function forceSimulation<T extends SimulationNodeDatum>(nodes: T[], dimensions?: number): Simulation<T>;
  export function forceX<T>(position: number | ((node: T) => number)): AxisForce<T>;
  export function forceY<T>(position: number | ((node: T) => number)): AxisForce<T>;
  export function forceZ<T>(position: number | ((node: T) => number)): AxisForce<T>;
  export function forceManyBody<T>(): ManyBodyForce<T>;
  export function forceCollide<T>(radius: number | ((node: T) => number)): CollideForce<T>;
  export function forceLink<T>(links: LinkDatum<T>[]): LinkForce<T>;
}
