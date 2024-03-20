import clsx from "clsx";
import { HTMLInputTypeAttribute } from "react";

export interface TextFieldInterface {
  defaultValue?: string;
  placeholder?: string;
  width?: string;
  type?: HTMLInputTypeAttribute;
  labelText?: string;
  labelColor?: string;
  labelErrorText?: string;
  onChange: (value: string) => void;
  onClick?: () => void;
}

export default function TextField({
  defaultValue = "",
  placeholder,
  width,
  type,
  labelText,
  labelColor,
  labelErrorText,
  onChange,
  onClick,
}: TextFieldInterface) {
  const border = clsx("rounded border-neutral-grey-400 ");
  const background = clsx("bg-neutral-white");
  const textColor = clsx("text-base text-neutral-black");
  const labelTextColor = clsx(labelColor ?? "text-primary-green-900");
  const textFieldWidth = width ?? "w-full";

  return (
    <div className={clsx("flex flex-col", textFieldWidth)}>
      <label className={clsx("text-base", labelTextColor)}>{labelText}</label>
      <input
        type={type ?? "text"}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={clsx(
          "input input-bordered input-md h-9 ",
          border,
          background,
          textColor,
          textFieldWidth
        )}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onClick={(e) => {
          if (onClick != undefined) {
            onClick();
          }
        }}
      />
      <label className="text-xs text-accent-error self-end">
        {labelErrorText}
      </label>
    </div>
  );
}
