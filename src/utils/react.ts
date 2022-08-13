import * as React from "react";

export namespace ReactUtils {
  export function useStateWithCallback<S>(
    initialState: S | (() => S),
    callback: (state: S) => void
  ): [S, React.Dispatch<React.SetStateAction<S>>] {
    const [state, setState] = React.useState<S>(initialState);
    const didMount = React.useRef(false);
    React.useEffect(() => {
      if (!didMount.current) {
        didMount.current = true;
      } else {
        callback(state);
      }
    }, [state]);
    return [state, setState];
  }
}
