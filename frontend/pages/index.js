import Link from 'next/link';
export default function Home(){
  return (
    <main style={{padding:20,fontFamily:'sans-serif'}}>
      <h1>Arvyax Wellness</h1>
      <p>Welcome! Please login or register.</p>
      <p>
        <Link href="/login">Login</Link> | <Link href="/register">Register</Link> |
        <Link href="/dashboard"> Dashboard</Link>
      </p>
    </main>
  );
  }
