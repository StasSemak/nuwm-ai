import { Link } from "react-router-dom";

export function Index() {
  return (
    <div className="w-full max-w-[1240px] my-0 mx-auto pt-8 px-3 sm:px-6 md:px-12 flex flex-col gap-5">
      <div className="p-2 flex flex-col items-center bg-zinc-100 rounded-md h-[85vh]">
        <iframe
          src="/embed.html"
          width="100%"
          allowFullScreen
          loading="eager"
          style={{ border: "0px", flexGrow: "1" }}
        /> 
      </div>
      <Footer/>
    </div>
  );
}

function Footer() {
  return(
    <div className="flex flex-col gap-3 w-full text-zinc-700 text-sm mb-2">
      <p>Чат-бот Національного університету водного господарства та природокористування на основі генеративного штучного інтелекту. Надає відповіді на запитання щодо вступної кампанії.</p>
      <div className="flex gap-12 items-center">
        <a href="https://nuwm.edu.ua" target="_blank" rel="noreferrer">Веб-сайт НУВГП</a>
        <a href="https://t.me/NUWEEAI_bot" target="_blank" rel="noreferrer">Чат-бот у Telegram</a>
        <Link to="/admin" target="_blank" rel="noreferrer">
          Для адміністратора
        </Link>
      </div>
    </div>
  )
}