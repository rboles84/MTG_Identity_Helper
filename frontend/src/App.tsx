import MTGColorArchetypeQuiz from './components/MTGColorArchetypeQuiz';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            MTG Identity Helper
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Discover your ideal Commander color identity through playstyle-driven questions.
          </p>
        </header>
        <MTGColorArchetypeQuiz />
      </main>
    </div>
  );
}

export default App;
