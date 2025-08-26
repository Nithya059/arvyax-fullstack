// lib/api.js

// Replace this with your actual Render backend URL
const BASE_URL = "https://arvyax-fullstack.onrender.com/";

export async function getData() {
  try {
    const res = await fetch(`${BASE_URL}/api/data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // prevents caching issues
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
