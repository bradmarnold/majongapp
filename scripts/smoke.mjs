import { execSync as x } from "node:child_process";
function sh(c){ return x(c,{stdio:"pipe"}).toString(); }
const api="https://majongapp.vercel.app/api/advice";
const tile="https://bradmarnold.github.io/majongapp/tiles/char_1.png";
try{
  const a=sh(`curl -sS -X POST ${api} -H 'content-type: application/json' --data '{"summary":"hello from smoke"}'`);
  if(!a || a.length<40) throw new Error("API response too short");
  const h=sh(`curl -sSI ${tile}`); if(!/200 OK/.test(h)) throw new Error("tile 404");
  console.log("SMOKE OK");
}catch(e){ console.error("SMOKE FAIL", e.message); process.exit(1); }
