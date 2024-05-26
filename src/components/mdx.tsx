import Markdown from "react-markdown";

function LinkRenderer(props: any) {
  return(
    <a href={props.href} target="_blank" rel="noreferrer">
      {props.children}
    </a>
  )
}

export function MDXContent({
  children,
}: {
  children: string | null | undefined;
}) {
  return <Markdown components={{a: LinkRenderer}}>{children}</Markdown>;
}
