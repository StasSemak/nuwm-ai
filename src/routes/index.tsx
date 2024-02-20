export function Index() {
  return (
    <main className="w-full max-w-[1240px] mx-auto pt-8 px-12">
      <div className="p-2 flex flex-col items-center bg-zinc-100 rounded-md min-h-[85vh]">
        <iframe
          src="/embed"
          width="100%"
          className="flex-grow"
          allowFullScreen
          loading="lazy"
          style={{ border: "0px" }}
        />
      </div>
    </main>
  );
}
