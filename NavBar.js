import { useState, useEffect } from "react";
import Link from "next/link";

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Run only in browser
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="p-4 bg-gray-200 flex justify-between">
      <div>
        <Link href="/">Home</Link>
      </div>
      <div>
        {isLoggedIn ? (
          <>
            <Link href="/dashboard" className="mr-4">Dashboard</Link>
            <Link href="/sessions" className="mr-4">Sessions</Link>
            <Link href="/logout">
              <button className="bg-red-500 text-white px-3 py-1 rounded">
                Logout
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/login" className="mr-4">Login</Link>
            <Link href="/register">
              <button className="bg-blue-500 text-white px-3 py-1 rounded">
                Register
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}