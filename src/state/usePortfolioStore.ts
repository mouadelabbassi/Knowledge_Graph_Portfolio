import { create } from 'zustand';
import { nodeById } from '../data/portfolio';
import { matchQuestion } from '../graph/intentMatcher';
import type { QueryResult } from '../types/query';
import type { GraphLens } from '../graph/presentation';

interface PortfolioState {
  cameraCommand: { id: number; zoom: number };
  zoomGraph: (factor: number) => void;
  neuralLinks: boolean;
  toggleNeuralLinks: () => void;
  graphLens: GraphLens;
  graphFocusId: string | null;
  setGraphLens: (lens: GraphLens) => void;
  focusGraph: (id: string | null) => void;
  selectedId: string | null;
  hoveredId: string | null;
  paused: boolean;
  textView: boolean;
  cameraRevision: number;
  recruiterMode: boolean;
  askFocused: boolean;
  setAskFocused: (focused: boolean) => void;
  queryResult: QueryResult | null;
  replayIndex: number | null;
  replayRunning: boolean;
  toggleRecruiterMode: () => void;
  ask: (question: string) => void;
  clearQuery: () => void;
  startReplay: (animate: boolean) => void;
  pauseReplay: () => void;
  continueReplay: () => void;
  stepReplay: (direction: number) => void;
  select: (id: string | null) => void;
  hover: (id: string | null) => void;
  togglePaused: () => void;
  toggleTextView: () => void;
  resetCamera: () => void;
}

export const usePortfolioStore = create<PortfolioState>(set => ({
  cameraCommand: { id: 0, zoom: 1 },
  zoomGraph: zoom => set(state => ({ cameraCommand: { id: state.cameraCommand.id + 1, zoom } })),
  neuralLinks: true,
  toggleNeuralLinks: () => set(state => ({ neuralLinks: !state.neuralLinks })),
  graphLens: 'all',
  graphFocusId: null,
  setGraphLens: graphLens => set({graphLens,graphFocusId:null,hoveredId:null,queryResult:null,replayIndex:null,replayRunning:false}),
  focusGraph: id => set({graphFocusId:id&&nodeById.has(id)?id:null,hoveredId:null}),
  selectedId: null,
  hoveredId: null,
  paused: false,
  textView: false,
  cameraRevision: 0,
  recruiterMode: false,
  askFocused: false,
  setAskFocused: focused=>set(focused ? {askFocused:true} : {askFocused:false,replayRunning:false,replayIndex:null}),
  queryResult: null,
  replayIndex: null,
  replayRunning: false,
  toggleRecruiterMode: () => set(state=>({recruiterMode:!state.recruiterMode,askFocused:false,selectedId:null,hoveredId:null,replayRunning:false,replayIndex:null})),
  ask: question=>set(state=>({queryResult:matchQuestion(question),askFocused:!state.recruiterMode,selectedId:null,hoveredId:null,replayIndex:null,replayRunning:false})),
  clearQuery: ()=>set({queryResult:null,replayIndex:null,replayRunning:false,hoveredId:null}),
  startReplay: animate=>set({replayIndex:0,replayRunning:animate}),
  pauseReplay: ()=>set({replayRunning:false}),
  continueReplay: ()=>set(state=>({replayRunning:true,replayIndex:state.replayIndex === null || state.replayIndex >= (state.queryResult?.steps.length ?? 0)-1 ? 0 : state.replayIndex})),
  stepReplay: direction=>set(state=>{
    const total=state.queryResult?.steps.length ?? 0;
    if (!total) return state;
    const next=Math.max(0,Math.min(total-1,(state.replayIndex ?? -1)+direction));
    return {replayIndex:next,replayRunning:state.replayRunning && next<total-1};
  }),
  select: id => set(state=>({ selectedId: id && nodeById.has(id) ? id : null, hoveredId: null, replayRunning:id ? false : state.replayRunning })),
  hover: id => set(state => state.hoveredId === id ? state : { hoveredId: id }),
  togglePaused: () => set(state => ({ paused: !state.paused })),
  toggleTextView: () => set(state => ({ textView: !state.textView })),
  resetCamera: () => set(state => ({ cameraRevision: state.cameraRevision + 1, hoveredId: null,graphFocusId:null,graphLens:'all',queryResult:null,replayIndex:null,replayRunning:false })),
}));
