import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist/assets');
const natural=new Intl.Collator('pt-BR',{numeric:true,sensitivity:'base'});
const projectFiles=fs.readdirSync(path.join(root,'projects')).filter(name=>/\.(jpe?g|png|webp)$/i.test(name)).sort(natural.compare);
const normalize=name=>name.replace(/\(1\)(?=\.[^.]+$)/,'').replace(/^Logos /i,'Logo ').replace(/\s+/g,' ').trim().toLocaleLowerCase('pt-BR');
const partnerFiles=[];const seen=new Set();
for(const name of fs.readdirSync(path.join(root,'partners')).sort(natural.compare)){if(!/\.(jpe?g|png|webp)$/i.test(name)||!/^Logos? /i.test(name)||/DLD|Du locu/i.test(name))continue;const key=normalize(name);if(seen.has(key))continue;seen.add(key);partnerFiles.push(name);if(partnerFiles.length===96)break;}
if(projectFiles.length<24)throw new Error(`Esperadas 24 artes de projetos; encontradas ${projectFiles.length}.`);
if(partnerFiles.length!==96)throw new Error(`Esperadas 96 logomarcas; encontradas ${partnerFiles.length}.`);
const keepPartners=new Set(partnerFiles);
for(const name of fs.readdirSync(path.join(root,'partners'))){if(name.includes('.openai-download-')||(/\.(jpe?g|png|webp)$/i.test(name)&&!keepPartners.has(name)))fs.unlinkSync(path.join(root,'partners',name));}
fs.writeFileSync('dist/assets/content.json',JSON.stringify({projects:projectFiles,partners:partnerFiles},null,2)+'\n');
console.log(`Conteúdo conferido: ${projectFiles.length} projetos e ${partnerFiles.length} parceiros.`);
