import { getData } from "../lib/api";

export default async function Home() {
  const data = await getData();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Arvyax Wellness Frontend</h1>
      <p className="mt-4">Data from backend:</p>
      <pre className="bg-gray-100 p-4 mt-2 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
