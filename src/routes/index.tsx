export function Index() {
  return (
    <div className="w-full max-w-[1240px] my-0 mx-auto pt-8 px-3 sm:px-6 md:px-12">
      <div className="p-2 flex flex-col items-center bg-zinc-100 rounded-md h-[85vh]">
        <iframe
          src="/embed.html"
          width="100%"
          allowFullScreen
          loading="eager"
          style={{ border: "0px", flexGrow: "1" }}
        /> 
      </div>
    </div>
  );
}
