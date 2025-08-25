import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../lib/api';

export default function Register(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function onSubmit(e){
    e.preventDefault();
    setMsg('...');
    try{
      await api.post('/auth/register', { email, password });
      setMsg('Registered! Redirecting to login...');
      setTimeout(()=>router.push('/login'), 800);
    }catch(err){ setMsg('Register failed'); }
  }

  return (
    <main style={{padding:20,fontFamily:'sans-serif'}}>
      <h2>Register</h2>
      <form onSubmit={onSubmit} style={{display:'grid',gap:8,maxWidth:320}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Create Account</button>
      </form>
      <p>{msg}</p>
    </main>
  );
}
