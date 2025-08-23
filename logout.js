import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }, []);

  return <p>Logging out...</p>;
}