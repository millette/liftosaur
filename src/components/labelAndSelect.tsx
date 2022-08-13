import * as React from "react";
import { forwardRef } from "react";
import { inputClassName } from "./input";

interface ILabelAndSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  identifier: string;
  label: string;
  children: React.ReactNode | undefined;
}

export const LabelAndSelect = forwardRef(
  (props: ILabelAndSelectProps, ref: React.Ref<HTMLSelectElement>): JSX.Element => {
    const { identifier, label, children, ...restProps } = props;
    const id = [props.id, identifier].filter((r) => r).join(" ");
    return (
      <div className="mb-4">
        <label data-cy={`${identifier}-label`} htmlFor={identifier} className="block text-sm font-bold">
          {label}
        </label>
        <select ref={ref} data-cy={`${identifier}-select`} id={id} className={inputClassName} {...restProps}>
          {children}
        </select>
      </div>
    );
  }
);
