import { useState } from 'react';
import { useRouter } from 'next/router';
import { api, setToken } from '../lib/api';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function onSubmit(e){
    e.preventDefault();
    setMsg('...');
    try{
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      setMsg('Logged in');
      router.push('/dashboard');
    }catch(err){
      setMsg('Login failed');
    }
  }

  return (
    <main style={{padding:20,fontFamily:'sans-serif'}}>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{display:'grid',gap:8,maxWidth:320}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <p>{msg}</p>
    </main>
  );
  }
