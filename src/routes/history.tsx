import { HistoryList } from "../components/history/history-list";

export function History() {
  return (
    <div className="max-w-[1240px] mx-auto py-4 px-8 flex flex-col gap-8">
      <Heading />
      <HistoryList />
    </div>
  );
}

function Heading() {
  return <h1 className="text-zinc-950 text-3xl font-bold">Історія</h1>;
}
