import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { RouteType } from "./interfaces";

export function createRoutesFrom(modules: any) {
  const routes = Object.keys(modules)
    .reduce<RouteType[]>((acc, path: string) => {
      const name = path.match(/\.\/pages\/(.*)\.tsx$/)![1];

      acc.push({
        name,
        path: `/${name}`
          .replace("index", "/")
          .replace("//", "/")
          /** Replaces [param] with :param */
          .replace(/\[([^\/]+)\]/gi, ":$1"),
        Component: modules[path].default,
      });
      return acc;
    }, [])
    .reverse()
    /** Fix os specific routes sort */
    .sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

  return () => {
    return (
      <>
        <RouteScrollTop />
        <Routes>
          {routes.map(({ path, Component }) => {
            return <Route key={path} path={path} element={<Component />} />;
          })}
          <Route path="/" />
        </Routes>
      </>
    );
  };
}

function RouteScrollTop() {
  const { pathname, state } = useLocation();
  const shouldScroll = (state && state.scrollTop) ?? true;

  useEffect(() => {
    if (shouldScroll) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [pathname]);

  return null;
}
