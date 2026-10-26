const hex=(bytes:Uint8Array)=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
export function generateSalt():string {return hex(crypto.getRandomValues(new Uint8Array(16)))}
export async function hashPin(pin:string,salt:string):Promise<string> {
 if(!/^\d{4}$/.test(pin))throw new Error('Use four numbers.');
 if(!/^[a-f0-9]{32}$/i.test(salt))throw new Error('The PIN salt is not valid.');
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(pin),'PBKDF2',false,['deriveBits']);
 const saltBytes=Uint8Array.from(salt.match(/../g)!,s=>parseInt(s,16));
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:saltBytes,iterations:10000,hash:'SHA-256'},key,256);
 return hex(new Uint8Array(bits));
}
export async function verifyPin(pin:string,hash:string,salt:string):Promise<boolean> {
 if(!/^\d{4}$/.test(pin)||!/^[a-f0-9]{64}$/i.test(hash))return false;
 try {const candidate=await hashPin(pin,salt);let diff=0;for(let i=0;i<hash.length;i++)diff|=candidate.charCodeAt(i)^hash.charCodeAt(i);return diff===0}catch{return false}
}
