import { projectArchive } from './projectArchive.ts';
import { additionalEntries, additionalSkillGroups, additionalSkillLabels, withDocumentedSkills } from './profileAdditions.ts';
import type { Cluster, LocalizedString, PortfolioEdge, PortfolioNode, QueryIntent } from '../types/portfolio.ts';

// All portfolio facts and product copy live here. Translation review is per string.
// FR/AR are deliberately null until the later, user-reviewed i18n milestone.
const provided = (text: string): LocalizedString => ({
  en: { text, provenance: 'provided', reviewed: true }, fr: null, ar: null,
});
const written = (text: string): LocalizedString => ({
  en: { text, provenance: 'machine-written', reviewed: false }, fr: null, ar: null,
});

export const profile = {
  name: 'Mouad El Abbassi',
  initials: 'ME',
  photo: '/images/mouad-el-abbassi.png',
  title: provided('Data Science & AI Engineering Student'),
  location: provided('Casablanca, Morocco'),
  education: written('Final year · ENSA Khouribga, Morocco'),
  objective: written('Seeking an end-of-studies internship (PFE) in AI Engineering, Generative AI or Data Science.'),
  languages: [
    { label: 'Arabic', level: provided('Native') },
    { label: 'English', level: provided('Full professional') },
    { label: 'French', level: provided('Full professional') },
  ],
  links: { portfolio: '{{PORTFOLIO_URL}}', github: 'https://github.com/mouadelabbassi', linkedin: 'www.linkedin.com/in/mouad-el-abbassi-57580b251', email: 'elabbassimouaad0@gmail.com' },
};

export const seo = {
  title: written('Mouad El Abbassi — Data Science & AI Engineering'),
  description: written('Mouad El Abbassi, final-year Data Science & AI Engineering student at ENSA Khouribga. Explore evidence-grounded AI, Moroccan Darija LLMs, and microgrid optimization.'),
  ogTitle: written('Mouad El Abbassi — The Living Knowledge Graph'),
  ogDescription: written('AI systems that reason over structure and optimize real-world things. Explore Mouad’s work and technical connections.'),
};

export const ui = {
  brand: written('THE LIVING KNOWLEDGE GRAPH'),
  brandShort: written('M / E'),
  headerLocation: provided('CASABLANCA / MA'),
  centralNode: written('CENTRAL NODE'),
  educationLabel: provided('Education'),
  certificationLabel: provided('Certifications'),
  diagnosticsLabel: written('Scene performance diagnostics'),
  diagnosticsMeasuring: written('Measuring rendered frames…'),
  navigationLabel: written('Main navigation'),
  graph: written('Graph'),
  work: written('All work'),
  about: written('About Mouad'),
  askNav: written('Ask'),
  recruiterMode: written('Recruiter mode'),
  recruiterShort: written('CV view'),
  graphMode: written('Graph view'),
  askKicker: written('QUERY / FOLLOW THE EVIDENCE'),
  askTitle: written('Ask about Mouad.'),
  askDescription: written('Find the work behind a skill. Follow the evidence through the graph.'),
  askInput: written('Your question about Mouad'),
  askPlaceholder: written('Which projects used reinforcement learning?'),
  askSubmit: written('Find connections'),
  askClear: written('Clear results'),
  askClose: written('Close Ask explorer'),
  askResults: written('Documented matches'),
  askUnknown: written('No documented match for that question.'),
  askUnknownDetail: written('Try one of the suggested questions, or the name of a project or skill. The answer stays within the supplied portfolio facts.'),
  askQuery: written('Cypher-style query preview'),
  askLocalNote: written('Matched locally against this portfolio. The query is a preview of the selected relationships.'),
  askMatchedTerms: written('Matched terms'),
  askReplay: written('Replay the reasoning'),
  askPauseReplay: written('Pause replay'),
  askResumeReplay: written('Continue replay'),
  askPrevious: written('Previous step'),
  askNext: written('Next step'),
  askSteps: written('Reasoning steps'),
  askStep: written('Step {current} of {total}'),
  askMatchStep: written('Matched “{terms}” against the portfolio’s local aliases.'),
  askEvidenceStep: written('Read the documented evidence for {node}.'),
  askRelatedEvidence: written('Documented project and experience connections are listed below.'),
  askReducedReplay: written('Reduced motion: review the steps using Previous and Next.'),
  cvKicker: written('PROFILE / RECRUITER VIEW'),
  cvPrint: written('Print this profile'),
  cvExperience: provided('Experience'),
  cvProjects: provided('Projects'),
  cvSkills: provided('Skills'),
  cvEducation: provided('Education'),
  cvCertifications: provided('Certifications'),
  cvContact: written('Contact & links'),
  cvMissingLinks: written('Contact links are awaiting details.'),
  cvOpenAsk: written('Ask about a project or skill'),
  cvEmail: written('Email'),
  cvGithub: provided('GitHub'),
  availability: written('OPEN TO PFE INTERNSHIPS'),
  heroKicker: written('DATA → KNOWLEDGE → INTELLIGENCE'),
  heroLineOne: written('Reason over structure.'),
  heroLineTwo: written('Optimize the real world.'),
  heroDescription: written('From evidence-grounded LLMs to intelligent energy systems. Explore the work, and the ideas that connect it.'),
  explore: written('Explore my work'),
  viewProfile: written('Meet the central node'),
  scroll: written('SCROLL TO EXPLORE'),
  graphKicker: written('A MAP OF CONNECTED IDEAS'),
  graphTitle: written('Everything is connected.'),
  graphDescription: written('Select a node to follow the connection. Each path leads to a real project, experience, or skill.'),
  graphCanvasLabel: written('Interactive 3D knowledge graph. Equivalent node buttons and full text are available below.'),
  graphRegionLabel: written('Knowledge graph explorer'),
  graphHint: written('DRAG TO ROTATE · SCROLL TO ZOOM · RIGHT-DRAG TO PAN'),
  graphCaption: written('STRUCTURE WITH A PURPOSE'),
  resetView: written('Reset view'),
  pause: written('Pause motion'),
  resume: written('Resume motion'),
  switchToText: written('Text view'),
  switchToGraph: written('3D view'),
  loading: written('Connecting the graph…'),
  fallback: written('Explore every connection in text view.'),
  fallbackDetail: written('The complete portfolio is available through the node directory below.'),
  directory: written('Node directory'),
  allNodes: written('All nodes'),
  related: written('Connected nodes'),
  technology: written('Technologies & methods'),
  story: written('The work'),
  evidence: written('Documented evidence'),
  close: written('Close detail panel'),
  backToGraph: written('Back to the graph'),
  selectNode: written('Explore'),
  selectionAnnounced: written('Selected node:'),
  featuredKicker: written('THE PROJECT ARCHIVE'),
  featuredTitle: written('Every project. A new connection.'),
  featuredDescription: written('From a first booking platform to language models and distributed data systems. Explore the work, the experiments, and what each one taught me.'),
  experienceKicker: written('EXPERIENCE / IN THE FIELD'),
  experienceTitle: written('Grounded in real work.'),
  skillsKicker: written('TOOLKIT / THE CONNECTIONS'),
  skillsTitle: written('The building blocks.'),
  skillsDescription: written('A toolkit built through projects. Select a skill to follow it back to the work, from statistical analysis to applications and AI systems.'),
  educationKicker: written('FOUNDATIONS / STILL LEARNING'),
  educationTitle: written('Learning with intent.'),
  languages: written('Languages'),
  footerLine: written('Good intelligence starts with good connections.'),
  footerNote: written('AI Engineering · Generative AI · Data Science'),
  skip: written('Skip to portfolio content'),
  noConnections: written('Listed in the supplied skills. No project-specific use is documented in this brief.'),
  skillSummary: written('Explore the connected projects to see this skill in practice.'),
  technologySummary: written('A technology or method explicitly documented in the connected work.'),
  sourceLabel: written('Based on supplied project reports and portfolio descriptions.'),
  connectionCount: written('connections'),
  readStory: written('Explore the story'),
  skillCategories: [
    ...additionalSkillGroups.map(group => ({ name: written(group.name), ids: group.labels.map(([id]) => id) })),
    { name: written('Models & learning'), ids: ['pytorch','tensorflow','scikit-learn','xgboost','random-forest','transformers','bert','distilbert','bilstm','tfidf','svm','logistic-regression','ppo','hugging-face','peft-lora','qlora','trl','knn','collaborative-filtering','model-evaluation'] },
    { name: written('Language & retrieval'), ids: ['knowledge-graph','langgraph','graphrag','langchain','elasticsearch','chromadb','cypher','sentence-transformers','nltk','ollama','mistral','gemma'] },
    { name: written('Data & business intelligence'), ids: ['sparse-matrices','pandas','numpy','scipy','statsmodels','matplotlib','seaborn','plotly','power-bi','mongodb-charts','streamlit','data-cleaning','eda','statistical-testing','feature-engineering','data-visualization','dashboard-design','web-scraping','beautifulsoup'] },
    { name: written('Applications & interfaces'), ids: ['java','javafx','jdbc','spring-boot','spring-security','jpa','react','angular','typescript','javascript','html','css','scss','tailwind','bootstrap','chartjs','recharts','responsive-design','component-design','authentication','rbac'] },
    { name: written('Engineering & infrastructure'), ids: ['python','fastapi','flask','pydantic','rest-api','docker','git','mlflow','postgresql','mysql','sql','sqlite','mongodb','pymongo','watchdog','elt','data-validation','data-modeling','hadoop','hdfs','yarn','mapreduce','linux','bash','apache','php','networking','server-security','distributed-systems'] },
    { name: written('Simulation & optimization'), ids: ['operations-research','linear-programming','constraint-modeling','genetic-algorithms','simulated-annealing','iterated-local-search','llm-algorithm-design','digital-twins'] },
  ],
};

export const clusters: Cluster[] = [
  { id: 'experience', label: provided('Experience & community'), description: written('Evidence-grounded intelligence, built in practice.'), color: '#2cc6af', anchor: [0.4, 3.8, -0.3], number: '01' },
  { id: 'projects', label: provided('Projects'), description: written('Applications, data systems, language models, and optimization research.'), color: '#f6b85b', anchor: [4.0, 0.4, 0], number: '02' },
  { id: 'skills', label: provided('Skills'), description: written('The tools and methods behind the systems.'), color: '#2cc6af', anchor: [-3.7, 1.5, -0.7], number: '03' },
  { id: 'certifications', label: provided('Certifications'), description: written('Professional learning in AI and generative models.'), color: '#a997e8', anchor: [-2.5, -3.1, -0.3], number: '04' },
  { id: 'education', label: provided('Education'), description: provided('Final year at ENSA Khouribga, Morocco.'), color: '#a997e8', anchor: [2.0, -3.4, -0.5], number: '05' },
];

const baseEntries: PortfolioNode[] = [
  {
    id: 'leyton', label: 'Leyton CognitX', shortLabel: 'Leyton CognitX', kind: 'experience', cluster: 'experience',
    eyebrow: provided('AI Engineer / Data Science Intern'), role: 'AI Engineer / Data Science Intern', period: 'Jun–Sep 2026',
    summary: written('An evidence-grounded LLM intelligence layer over transcribed business calls.'),
    details: [
      written('Benchmarked long-context extraction pipelines using adaptive chunking, structured outputs, Pydantic, and Elasticsearch. Information capture improved from 67.5% to 81.7%.'),
      written('Explored entity-graph organization; the retained call-intelligence implementation uses structured Elasticsearch documents with traceable evidence.'),
      written('Built an agentic QA workflow with intent classification, typed planning and routing, DAG execution, Elasticsearch retrieval, and FastAPI.'),
    ],
    technologies: ['pydantic','elasticsearch','fastapi','adaptive-chunking','structured-outputs','knowledge-graph','dag'],
    metrics: [{ label: provided('Information capture'), value: '67.5% → 81.7%', before: '67.5%', after: '81.7%', context: written('Equal-weight mean across two evaluated calls in the supplied internship report. This is a limited benchmark, not a general production estimate.') }],
    aliases: ['agentic qa','extraction','business calls','dag','knowledge graph','evidence'], nameAliases: ['leyton','cognitx'], featured: true,
  },
  {
    id: 'ensa-internship', label: 'ENSA Khouribga internship', shortLabel: 'ENSA internship', kind: 'experience', cluster: 'experience',
    eyebrow: provided('Internship'), period: 'Jun–Oct 2025',
    summary: written('A scraping and cleaning pipeline, parameter-efficient LLM fine-tuning, and retrieval-augmented generation.'),
    details: [written('Built a scraping and cleaning pipeline.'), written('Fine-tuned Llama 3.1 8B with parameter-efficient training.'), written('Implemented RAG with ChromaDB.')],
    technologies: ['python','beautifulsoup','web-scraping','data-cleaning','llama-3-1','parameter-efficient-training','peft-lora','qlora','transformers','chromadb','sentence-transformers'], aliases: ['rag','fine-tuning','scraping','llama'], nameAliases: ['ensa','ensa internship'],
  },
  ...projectArchive,
  ...additionalEntries,
  {
    id: 'datacamp', label: 'AI Engineer for Data Scientists', shortLabel: 'DataCamp', kind: 'certification', cluster: 'certifications',
    period: 'Feb 2026', eyebrow: provided('DataCamp'), summary: written('AI Engineer for Data Scientists credential from DataCamp.'), details: [], technologies: [], aliases: ['datacamp','certificate'],
  },
  {
    id: 'ibm', label: 'Generative AI Engineering', shortLabel: 'IBM Generative AI', kind: 'certification', cluster: 'certifications',
    eyebrow: provided('IBM'), summary: written('Generative AI Engineering credential from IBM, with skills spanning language models, agents, and applied AI development.'), details: [], technologies: [], aliases: ['ibm','generative ai','certificate'], nameAliases: ['generative ai engineering'],
  },
  {
    id: 'ensa', label: 'ENSA Khouribga', shortLabel: 'ENSA Khouribga', kind: 'education', cluster: 'education',
    eyebrow: provided('Final year · Morocco'), summary: written('Final-year Data Science & AI Engineering student at ENSA Khouribga, Morocco.'),
    details: [profile.objective], technologies: [], aliases: ['education','ensa','student','pfe'],
  },
];
export const entries: PortfolioNode[] = baseEntries.map(withDocumentedSkills);

const skillLabels = [
  ['sparse-matrices','Sparse Matrices'], ['knowledge-graph','Knowledge Graphs'],
  ['pytorch','PyTorch'], ['tensorflow','TensorFlow'], ['scikit-learn','Scikit-learn'], ['xgboost','XGBoost'], ['random-forest','Random Forest'], ['transformers','Transformers'], ['bert','BERT'], ['distilbert','DistilBERT'], ['bilstm','BiLSTM'], ['tfidf','TF-IDF'], ['svm','Support Vector Machines'], ['logistic-regression','Logistic Regression'], ['ppo','PPO'], ['hugging-face','Hugging Face'], ['peft-lora','PEFT/LoRA'], ['qlora','QLoRA'], ['trl','TRL'], ['knn','K-Nearest Neighbors'], ['collaborative-filtering','Collaborative Filtering'], ['model-evaluation','Model Evaluation'],
  ['langgraph','LangGraph'], ['graphrag','GraphRAG'], ['langchain','LangChain'], ['elasticsearch','Elasticsearch'], ['chromadb','ChromaDB'], ['cypher','Cypher'], ['sentence-transformers','Sentence Transformers'], ['nltk','NLTK / WordNet'], ['ollama','Ollama'], ['mistral','Mistral'], ['gemma','Gemma'],
  ['pandas','Pandas'], ['numpy','NumPy'], ['scipy','SciPy'], ['statsmodels','Statsmodels'], ['matplotlib','Matplotlib'], ['seaborn','Seaborn'], ['plotly','Plotly'], ['power-bi','Power BI'], ['mongodb-charts','MongoDB Charts'], ['streamlit','Streamlit'], ['data-cleaning','Data Cleaning'], ['eda','Exploratory Data Analysis'], ['statistical-testing','Statistical Analysis & Testing'], ['feature-engineering','Feature Engineering'], ['data-visualization','Data Visualization'], ['dashboard-design','Dashboard Design'], ['web-scraping','Web Scraping'], ['beautifulsoup','BeautifulSoup'],
  ['java','Java'], ['javafx','JavaFX'], ['jdbc','JDBC'], ['spring-boot','Spring Boot'], ['spring-security','Spring Security'], ['jpa','Spring Data JPA'], ['react','React'], ['angular','Angular'], ['typescript','TypeScript'], ['javascript','JavaScript'], ['html','HTML'], ['css','CSS'], ['scss','SCSS'], ['tailwind','Tailwind CSS'], ['bootstrap','Bootstrap'], ['chartjs','Chart.js'], ['recharts','Recharts'], ['responsive-design','Responsive Design'], ['component-design','Component Design'], ['authentication','User Authentication'], ['rbac','Role-based Access Control'],
  ['python','Python'], ['fastapi','FastAPI'], ['flask','Flask'], ['pydantic','Pydantic'], ['rest-api','REST APIs'], ['docker','Docker'], ['git','Git'], ['mlflow','MLflow'], ['postgresql','PostgreSQL'], ['mysql','MySQL'], ['sql','SQL'], ['sqlite','SQLite'], ['mongodb','MongoDB'], ['pymongo','PyMongo'], ['watchdog','Watchdog'], ['elt','ELT Pipelines'], ['data-validation','Data Validation'], ['data-modeling','Database Design & Data Modeling'], ['hadoop','Hadoop'], ['hdfs','HDFS'], ['yarn','YARN'], ['mapreduce','MapReduce'], ['linux','Linux'], ['bash','Bash'], ['apache','Apache'], ['php','PHP'], ['networking','Network Administration / DHCP'], ['server-security','Server Security'], ['distributed-systems','Distributed Systems'],
  ['operations-research','Operations Research'], ['linear-programming','Linear Programming'], ['constraint-modeling','Constraint Modeling'], ['genetic-algorithms','Genetic Algorithms'], ['simulated-annealing','Simulated Annealing'], ['iterated-local-search','Iterated Local Search'], ['llm-algorithm-design','LLM-Augmented Algorithm Design'], ['digital-twins','Digital Twins'],
] as const;

export const skills: PortfolioNode[] = [...skillLabels, ...additionalSkillLabels].map(([id, label]) => ({
  id, label, shortLabel: label, kind: 'skill', cluster: 'skills', eyebrow: provided('Skill'),
  summary: ui.skillSummary, details: [], technologies: [], aliases: [label.toLowerCase()],
}));

const technologyLabels = [
  ['gymnasium','Gymnasium'], ['stable-baselines3','Stable-Baselines3'], ['nasa-power','NASA POWER API'], ['label-studio','Label Studio'], 
  ['jwt','JWT'], ['llama-3-1','Llama 3.1 8B'], ['parameter-efficient-training','Parameter-efficient training'],
  ['adaptive-chunking','Adaptive chunking'], ['structured-outputs','Structured outputs'],
  ['dag','DAG execution'],
] as const;

export const technologies: PortfolioNode[] = technologyLabels.map(([id, label]) => ({
  id, label, shortLabel: label, kind: 'technology', cluster: 'skills', eyebrow: written('Documented method'),
  summary: ui.technologySummary, details: [], technologies: [], aliases: [label.toLowerCase()],
}));

const person: PortfolioNode = {
  id: 'mouad', label: profile.name, shortLabel: 'Mouad', kind: 'person', cluster: null,
  eyebrow: profile.title, summary: profile.objective,
  details: [profile.education, profile.location, written('Arabic (native), English and French (full professional).')],
  technologies: [], aliases: ['mouad','about','profile'],
};

export const nodes: PortfolioNode[] = [
  person,
  ...clusters.map((cluster): PortfolioNode => ({
    id: cluster.id, label: cluster.label.en.text, shortLabel: cluster.label.en.text, kind: 'cluster', cluster: cluster.id,
    eyebrow: ui.brand, summary: cluster.description, details: [], technologies: [], aliases: [cluster.id],
  })),
  ...entries, ...skills, ...technologies,
];
export const nodeById = new Map(nodes.map(node => [node.id, node]));

const edge = (source: string, target: string, relation: PortfolioEdge['relation'], evidence: PortfolioEdge['evidence'] = 'provided'): PortfolioEdge => ({
  id: `${source}:${relation}:${target}`, source, target, relation, evidence,
});
export const edges: PortfolioEdge[] = [
  ...clusters.map(cluster => edge('mouad', cluster.id, 'CONNECTS_TO', 'navigation')),
  ...nodes.filter(node => node.cluster && node.kind !== 'cluster').map(node => edge(node.cluster!, node.id, 'CONTAINS', 'navigation')),
  ...entries.map(node => edge('mouad', node.id, node.kind === 'experience' ? 'WORKED_AT' : node.kind === 'volunteering' ? 'VOLUNTEERED_AT' : node.kind === 'project' ? 'BUILT' : node.kind === 'research' ? 'RESEARCHED' : node.kind === 'education' ? 'STUDIES_AT' : 'EARNED')),
  ...skills.map(node => edge('mouad', node.id, 'HAS_SKILL')),
  edge('leyton', 'call-intelligence', 'BUILT'),
  edge('ensa-internship', 'ensakh-chatbot', 'BUILT'),
  edge('darija', 'mira-interface', 'CONNECTS_TO'),
  ...entries.flatMap(node => node.technologies.map(target => edge(node.id, target, node.kind === 'certification' ? 'COVERS' : target === 'ppo' && node.id === 'microgrid' ? 'TRAINED' : target === 'label-studio' ? 'VALIDATED_WITH' : target === 'langchain' ? 'BUILT_WITH' : 'USED'))),
];

// Prepared data for Milestone 2; no Ask UI or matching engine is implemented in M1.
export const queryIntents: QueryIntent[] = [
  { id: 'research', question: written('What is his research about?'), aliases: ['research','llamea','evoler','timetabling'], nodes: ['llm-optimization','operations-research','genetic-algorithms','simulated-annealing','llm-algorithm-design'], explanation: written('Mouad studies LLM-augmented evolutionary algorithms for automated metaheuristic design and university timetabling. The work covers constraint models, hybrid GA/SA/ILS search, and sandboxed evaluation of generated Python heuristics.'), query: "MATCH (n {id: 'llm-optimization'})-[:USED]->(method) RETURN n, method" },
  { id: 'community', question: written('Where did he volunteer?'), aliases: ['volunteer','volunteering','community'], nodes: ['ensakh-forum','dataverse','communication','teamwork','logistics'], explanation: written('Mouad volunteered as a Forum Organizer with CODEX ENSAKH Club from September to November 2024 and as a Logistics Assistant with DATAVERSE from September to December 2024.'), query: "MATCH (m {id: 'mouad'})-[:VOLUNTEERED_AT]->(organization) RETURN organization" },
  { id: 'rl', question: written('Which projects used RL?'), aliases: ['rl','reinforcement learning','ppo','thermal peak shaving'], nodes: ['microgrid','ppo','gymnasium'], explanation: written('The microgrid project used a custom Gymnasium environment and a PPO agent for thermal peak shaving.'), query: "MATCH (p:Project)-[:TRAINED]->(s:Skill {name: 'PPO'}) RETURN p, s" },
  { id: 'rag', question: written('Show me his RAG work'), aliases: ['rag','retrieval augmented generation','retrieval-augmented generation'], nodes: ['ensa-internship','ensakh-chatbot','chromadb','darija','langchain'], explanation: written('The ENSA internship and ENSAKH assistant use ChromaDB retrieval. The earlier Darija project brief records LangChain RAG; the newer Mira report documents retrieval as a next integration stage.'), query: "MATCH (n)-[:USED|BUILT_WITH]->(t) WHERE n.id IN ['ensa-internship', 'darija'] AND t.id IN ['chromadb', 'langchain'] RETURN n, t" },
  { id: 'extraction', question: written('How did he improve extraction?'), aliases: ['extraction','capture','business calls','structured outputs'], nodes: ['leyton','pydantic','elasticsearch','adaptive-chunking','structured-outputs'], explanation: written('At Leyton CognitX, adaptive chunking and structured extraction improved mean common-information capture from 67.5% to 81.7% on two evaluated calls. The limited benchmark does not establish a general production estimate.'), query: "MATCH (n {id: 'leyton'})-[:USED]->(t) RETURN n, t" },
  { id: 'agents', question: written('Show me his agentic QA work'), aliases: ['agentic qa','agentic','agents','agent','dag','planning','routing'], nodes: ['leyton','dag','fastapi','elasticsearch','pydantic'], explanation: written('At Leyton CognitX, Mouad built an agentic QA workflow with intent classification, typed planning and routing, DAG execution, Elasticsearch retrieval, and FastAPI.'), query: "MATCH (n {id: 'leyton'})-[:USED]->(t) WHERE t.id IN ['dag', 'fastapi', 'elasticsearch', 'pydantic'] RETURN n, t" },
];

export const relationLabels: Record<PortfolioEdge['relation'], LocalizedString> = {
  VOLUNTEERED_AT: written('volunteered at'), COVERS: written('covers'), RESEARCHED: written('researched'), CONNECTS_TO: written('connects to'), WORKED_AT: written('worked at'), BUILT: written('built'), HAS_SKILL: written('lists skill'),
  EARNED: written('earned'), STUDIES_AT: written('studies at'), CONTAINS: written('contains'), USED: written('used'),
  BUILT_WITH: written('built with'), TRAINED: written('trained'), VALIDATED_WITH: written('validated with'),
};

export const translationReview = {
  activeLocale: 'en' as const,
  policy: 'All generated translations must have provenance: machine-translation and reviewed: false until Mouad reviews them.',
  status: { en: 'Provided facts and machine-written editorial copy are individually flagged.', fr: 'Deferred; no translations written.', ar: 'Deferred; no translations written.' },
};
