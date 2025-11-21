import DictionarySearch from "./components/DictionarySearch";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <main className="container mx-auto py-8 px-4">
        <DictionarySearch />
      </main>
    </div>
  );
}
