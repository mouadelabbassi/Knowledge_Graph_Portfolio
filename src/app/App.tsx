import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { NodeDirectory } from '../components/NodeDirectory';
import { Research, SelectedWork } from '../components/ProjectArchive';
import { PortfolioContent } from '../components/PortfolioContent';
import { DetailPanel } from '../components/DetailPanel';
import { ui } from '../data/portfolio';
import { copy } from '../types/portfolio';
import { AskMouad } from '../components/AskMouad';
import { RecruiterView } from '../components/RecruiterView';
import { usePortfolioStore } from '../state/usePortfolioStore';

export default function App() {
  const recruiterMode = usePortfolioStore(state=>state.recruiterMode);
  const askFocused = usePortfolioStore(state=>state.askFocused);
  return <div className={(recruiterMode ? 'recruiter-page' : 'portfolio-page')+(askFocused ? ' has-ask' : '')}><a className="skip-link" href={recruiterMode ? '#cv-experience' : askFocused ? '#ask-question' : '#work'}>{copy(ui.skip)}</a><Header /><main>{recruiterMode ? <RecruiterView /> : <><Hero /><NodeDirectory /><SelectedWork /><Research /><AskMouad /><PortfolioContent /></>}</main><DetailPanel /></div>;
}
