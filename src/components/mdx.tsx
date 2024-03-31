import Markdown from "react-markdown";

export function MDXContent({
  children,
}: {
  children: string | null | undefined;
}) {
  return <Markdown>{children}</Markdown>;
}
