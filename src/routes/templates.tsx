import { Outlet, Route } from "react-router-dom";

type ListWithViewsProps = {
  baseSlug: string;
  listComponent: React.ReactNode;
  viewComponent: React.ReactNode;
};
export function ListWithViews(props: ListWithViewsProps) {
  return (
    <Route path={props.baseSlug} element={<Outlet />}>
      <Route index element={props.listComponent} />
      <Route path="view/:id" element={props.viewComponent} />
    </Route>
  );
}

type BaseRouteProps = {
  slug: string;
  component: React.ReactNode;
};
export function BaseRoute(props: BaseRouteProps) {
  return <Route path={props.slug} element={props.component} />;
}
