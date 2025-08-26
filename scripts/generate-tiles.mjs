import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "node:path";
const outDir=path.join("apps","web","public","tiles");
await fs.mkdir(outDir,{recursive:true});
const tiles=JSON.parse(await fs.readFile("assets/prompts.json","utf8"));
const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
const MAX=3; const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
async function genOne({name,prompt},attempt=1){
  try{
    const r=await client.images.generate({model:"gpt-image-1",prompt,size:"512x768",quality:"high",background:"transparent"});
    const b=r.data[0].b64_json;
    await fs.writeFile(path.join(outDir,`${name}.png`),Buffer.from(b,"base64"));
    return name;
  }catch(e){
    if(attempt<3){ await sleep(600*attempt); return genOne({name,prompt},attempt+1); }
    throw e;
  }
}
const q=[...tiles], run=[];
for(let i=0;i<Math.min(MAX,q.length);i++) run.push(genOne(q.shift()));
while(q.length){const idx=await Promise.race(run.map((p,i)=>p.then(()=>i))); run[idx]=genOne(q.shift());}
await Promise.all(run);
console.log(`Generated ${tiles.length} tiles -> ${outDir}`);
