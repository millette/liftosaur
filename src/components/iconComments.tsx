import * as React from "react";

interface IIconCommentsProps {
  size?: number;
  color?: string;
}

export function IconComments(props: IIconCommentsProps): JSX.Element {
  return (
    <svg className="inline-block" width={props.size || 20} height={props.size || 20} viewBox="0 0 15 15">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-7.000000, -2.000000)" fill={props.color || "#cbd5e0"}>
          <path d="M14,2 C17.8659932,2 21,5.13400675 21,9 C21,10.0877054 20.7519151,11.1174675 20.309242,12.0357895 L21.3126443,15.0477333 C21.5732303,15.8294913 20.8294913,16.5732303 20.0477333,16.3126443 L17.0357895,15.309242 C16.1174675,15.7519151 15.0877054,16 14,16 C10.1340068,16 7,12.8659932 7,9 C7,5.13400675 10.1340068,2 14,2 Z M11,8 C10.4477153,8 10,8.44771525 10,9 C10,9.55228475 10.4477153,10 11,10 C11.5522847,10 12,9.55228475 12,9 C12,8.44771525 11.5522847,8 11,8 Z M14,8 C13.4477153,8 13,8.44771525 13,9 C13,9.55228475 13.4477153,10 14,10 C14.5522847,10 15,9.55228475 15,9 C15,8.44771525 14.5522847,8 14,8 Z M17,8 C16.4477153,8 16,8.44771525 16,9 C16,9.55228475 16.4477153,10 17,10 C17.5522847,10 18,9.55228475 18,9 C18,8.44771525 17.5522847,8 17,8 Z"></path>
        </g>
      </g>
    </svg>
  );
}
