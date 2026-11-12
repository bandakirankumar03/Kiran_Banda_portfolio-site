// Run npm install once, then npm run build after editing the JSX sources.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),Babel=require('@babel/standalone');
const root=path.join(__dirname,'deploy_v02'),scripts=require('./source-scripts.json');
const source=scripts.map(f=>'\n// '+f+'\n'+fs.readFileSync(path.join(root,f),'utf8')).join('\n');
const code=Babel.transform(source,{presets:['react'],comments:false,compact:true,minified:true,sourceType:'script'}).code;
const filename='assets/site-'+crypto.createHash('sha256').update(code).digest('hex').slice(0,12)+'.js';
fs.writeFileSync(path.join(root,filename),code);
const index=path.join(root,'index.html'),html=fs.readFileSync(index,'utf8');
fs.writeFileSync(index,html.replace(/assets\/site-[a-f0-9]+\.js/g,filename));
console.log('Built '+filename);
