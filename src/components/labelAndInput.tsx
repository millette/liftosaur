import * as React from "react";
import { forwardRef } from "react";
import { inputClassName } from "./input";

interface ILabelAndInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  identifier: string;
  label: string;
  errorMessage?: string;
}

export const LabelAndInput = forwardRef(
  (props: ILabelAndInputProps, ref: React.Ref<HTMLInputElement>): JSX.Element => {
    const { identifier, label, errorMessage } = props;
    const id = [props.id, identifier].filter((r) => r).join(" ");
    return (
      <div className="mb-4">
        <label data-cy={`${identifier}-label`} htmlFor={identifier} className="block text-sm font-bold">
          {label}
        </label>
        <input ref={ref} data-cy={`${identifier}-input`} id={id} className={inputClassName} type="text" {...props} />
        {errorMessage && <div className="text-xs text-red-500">{errorMessage}</div>}
      </div>
    );
  }
);
