import { useEffect, useMemo } from 'react';
import { BufferGeometry, Float32BufferAttribute } from 'three';
import { clusters } from '../data/portfolio';

export function GraphOrnaments() {
  const geometry = useMemo(() => {
    const lines: number[] = [];
    for(const cluster of clusters){
      const radius=cluster.id==='skills'?2.2:cluster.id==='projects'?2.3:cluster.id==='education'?1.15:1.8;
      for(let i=0;i<120;i++){
        const a=i/120*Math.PI*2,b=(i+1)/120*Math.PI*2;
        const point=(t:number,r=radius)=>[cluster.anchor[0]+Math.cos(t)*r,cluster.anchor[1]+Math.sin(t)*r*.7,cluster.anchor[2]-.7+Math.sin(t)*r*.5];
        if(i%5!==0)lines.push(...point(a),...point(b));
        if(i%10===0)lines.push(...point(a,radius+.08),...point(a,radius+.22));
      }
    }
    for(let i=0;i<200;i++){const a=i/200*Math.PI*2,b=(i+1)/200*Math.PI*2;if(i%4!==0)lines.push(Math.cos(a)*6.8,Math.sin(a)*5.4,-2.6,Math.cos(b)*6.8,Math.sin(b)*5.4,-2.6);}
    const result = new BufferGeometry();
    result.setAttribute('position', new Float32BufferAttribute(lines, 3));
    return result;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <lineSegments geometry={geometry}><lineBasicMaterial color="#73988c" transparent opacity={0.17} /></lineSegments>;
}
