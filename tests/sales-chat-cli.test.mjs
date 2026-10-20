import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

test('Maya CLI exports private context and stores an explicit-send receipt without logging customer text or credentials', async () => {
  const directory = await mkdtemp(join(tmpdir(),'wuus-chat-cli-'));
  const id=randomUUID(), messageId=randomUUID(), responseId=randomUUID(), marker='PRIVATE CUSTOMER TEXT';
  let writes=0;
  const server=createServer(async (req,res) => {
    const path=new URL(req.url,'http://localhost').pathname;
    res.setHeader('content-type','application/json');
    if (path==='/rest/v1/rpc/wuus_chat_readiness') return res.end(JSON.stringify({ready:true}));
    if (path==='/rest/v1/wuus_chat_conversations') { if(req.method==='HEAD') {res.setHeader('content-range','0-0/2');return res.end();} return res.end(JSON.stringify([{id,version:1,status:'waiting'}])); }
    if (path==='/rest/v1/rpc/admin_read_wuus_chat') return res.end(JSON.stringify({conversation:{id,version:1,status:'waiting'},messages:[{id:messageId,role:'visitor',body:marker}]}));
    if (path==='/rest/v1/rpc/reply_wuus_chat') {writes++;let body='';for await(const data of req)body+=data;assert.equal(JSON.parse(body).p_body,'Boleh ceritakan kebutuhan Anda?');return res.end(JSON.stringify({outcome:'saved',messageId:responseId}));}
    res.statusCode=404;res.end('{}');
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url=`http://127.0.0.1:${server.address().port}`;
  const run=args=>new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,[fileURLToPath(new URL('../scripts/sales-chat-inbox.mjs',import.meta.url)),...args],{env:{...process.env,NEXT_PUBLIC_SUPABASE_URL:url,SUPABASE_SERVICE_ROLE_KEY:'not-a-real-key-unit-test-only'},stdio:['ignore','pipe','pipe']});
    let stdout='',stderr='';child.stdout.on('data',chunk=>stdout+=chunk);child.stderr.on('data',chunk=>stderr+=chunk);child.on('error',reject);child.on('close',code=>resolve({code,stdout,stderr}));
  });
  try {
    const status=await run(['status']); assert.equal(status.code,0);assert.equal(JSON.parse(status.stdout).waiting,2);
    const output=join(directory,'context.json'), exported=await run(['export',id,output]);assert.equal(exported.code,0);
    assert.equal((await readFile(output,'utf8')).includes(marker),true);assert.equal(exported.stdout.includes(marker),false);
    const draft=join(directory,'reply.json'); await writeFile(draft,JSON.stringify({conversationId:id,requestId:randomUUID(),replyTo:messageId,expectedVersion:1,body:'Boleh ceritakan kebutuhan Anda?'}));
    const denied=await run(['reply',draft]);assert.equal(denied.code,1);assert.equal(writes,0);
    const sent=await run(['reply',draft,'--send']); assert.equal(sent.code,0);assert.equal(writes,1);assert.equal(sent.stdout.includes('not-a-real-key'),false);
    assert.equal(JSON.parse(await readFile(draft+'.receipt.json','utf8')).messageId,responseId);
    assert.equal(JSON.parse(sent.stdout).delivery,'stored-in-website-chat; read-not-confirmed');
  } finally { server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await rm(directory,{recursive:true,force:true}); }
});
