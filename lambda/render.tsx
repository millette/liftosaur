import * as ReactDOMServer from "react-dom/server";

export function renderPage(page: JSX.Element): string {
  return "<!DOCTYPE html>" + ReactDOMServer.renderToString(page);
}
