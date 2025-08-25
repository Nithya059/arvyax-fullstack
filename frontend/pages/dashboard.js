import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Dashboard(){
  const [items, setItems] = useState([]);

  useEffect(()=>{ api.get('/api/sessions').then(r=>setItems(r.data)); },[]);

  return (
    <main style={{padding:20,fontFamily:'sans-serif'}}>
      <h2>Dashboard (Published Sessions)</h2>
      {items.length===0 && <p>No published sessions yet.</p>}
      <ul>
        {items.map(s=> (
          <li key={s._id}>
            <b>{s.title || '(untitled)'}</b> — {Array.isArray(s.tags)? s.tags.join(', '): ''}
          </li>
        ))}
      </ul>
    </main>
  );
}
