import type { ReactNode } from 'react';

export function additionalGlyph(project: string): ReactNode {
  const shapes: Record<string, ReactNode> = {
    'grand-heaven': <g stroke="currentColor"><path d="M70 125h160M90 125V50l60-25 60 25v75M135 125V95h30v30M90 55h120" /><path d="M110 70h15v12h-15zm65 0h15v12h-15zm-65 27h15v12h-15zm65 0h15v12h-15z" opacity=".6" /><path d="m150 30 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z" fill="currentColor" opacity=".6" /></g>,
    'call-intelligence': <g stroke="currentColor"><rect x="58" y="38" width="76" height="85" rx="5" opacity=".5" /><path d="M73 57h44M73 69h33M73 81h40M73 93h26M134 80h31m-8-5 8 5-8 5" /><circle cx="196" cy="80" r="23" /><circle cx="196" cy="80" r="5" fill="currentColor" /><path d="m196 57 22-21m0 0h17m-39 67 20 20h19M219 80h28m-62-19-13-22" opacity=".55" /><circle cx="242" cy="36" r="5" /><circle cx="242" cy="123" r="5" /><circle cx="253" cy="80" r="5" /></g>,
    'ensakh-chatbot': <g stroke="currentColor"><path d="m60 55 80-28 80 28-80 28Zm28 11v37q52 27 104 0V66m28-11v43" /><path d="M171 112h66v-38h-44m-22 38v14l17-14" fill="#0e1c1e" /><path d="M183 88h42m-42 10h28" opacity=".6" /></g>,
    'hadoop-movielens': <g stroke="currentColor"><path d="M150 57v24m-78 0h156M72 81v18m78-18v18m78-18v18" opacity=".55" /><rect x="119" y="27" width="62" height="30" rx="3" /><path d="M129 37h8m5 0h28m-41 10h41" opacity=".5" />{[45,123,201].map(x=><g key={x}><rect x={x} y="99" width="54" height="34" rx="3" /><path d={`M${x+9} 110h36m-36 11h36`} opacity=".5" /><circle cx={x+11} cy="110" r="1.6" fill="currentColor" /></g>)}</g>,
    'laptop-analysis': <g stroke="currentColor"><rect x="72" y="30" width="156" height="91" rx="4" /><path d="m72 121-16 13h188l-16-13M90 101h120M90 101V49" opacity=".5" /><path d="M105 90V73h15v17m15 0V58h15v32m15 0V68h15v22m15 0V47h15v43" /><path d="M131 127h38" /></g>,
    'webhost': <g stroke="currentColor"><rect x="66" y="31" width="103" height="100" rx="4" /><path d="M66 57h103M66 83h103M66 109h103m-89-65h37M80 70h37M80 96h37" opacity=".5" /><circle cx="154" cy="44" r="3" fill="currentColor" /><circle cx="154" cy="70" r="3" fill="currentColor" /><circle cx="154" cy="96" r="3" fill="currentColor" /><path d="m211 63 32 13v25q0 21-32 34-32-13-32-34V76Z" fill="#0e1c1e" /><path d="m197 97 10 10 20-24" /></g>,
    'sales-analysis': <g stroke="currentColor"><rect x="54" y="30" width="192" height="104" rx="5" /><path d="M54 53h192m-134 0v81M67 68h31m-31 14h25m-25 14h31" opacity=".5" /><circle cx="68" cy="42" r="2" fill="currentColor" /><circle cx="78" cy="42" r="2" fill="currentColor" /><path d="M128 118h98m-86-7V91h15v20m13 0V77h15v34m13 0V64h15v47" /></g>,
  };
  return shapes[project] ?? null;
}
