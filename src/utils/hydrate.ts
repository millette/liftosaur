import RB from "rollbar";
import * as ReactDOMClient from "react-dom/client";

declare let Rollbar: RB;
declare let __ENV__: string;

export namespace HydrateUtils {
  export function hydratePage<T>(cb: (data: T) => JSX.Element): void {
    Rollbar.configure({ payload: { environment: __ENV__ } });

    const escapedRawData = document.querySelector("#data")?.innerHTML || "{}";
    const parser = new DOMParser();
    const unescapedRawData = parser.parseFromString(escapedRawData, "text/html").documentElement.textContent || "{}";
    const data = JSON.parse(unescapedRawData) as T;
    ReactDOMClient.hydrateRoot(document.getElementById("app")!, cb(data));
  }
}
