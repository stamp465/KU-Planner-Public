"use client";

import { ButtonType, ButtonWidth } from "@/constants/enum";
import clsx from "clsx";
import React, { useEffect, useState } from "react";

export interface ButtonInterface {
  children?: React.ReactNode;
  text?: string;
  width?: ButtonWidth;
  type?: ButtonType;
  bgColor?: string;
  onClick?: () => Promise<void>;
  isSubmit?: boolean;
  fullHeight?: boolean;
}

export default function Button({
  children,
  text = "",
  width = ButtonWidth.Short,
  type = ButtonType.Normal,
  bgColor,
  onClick,
  isSubmit,
  fullHeight = false,
}: ButtonInterface) {
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);

  const textColor = (buttonType: string) => {
    return clsx({
      "text-neutral-white":
        buttonType == ButtonType.Normal || buttonType == ButtonType.Disable,
      "text-primary-green-900":
        buttonType == ButtonType.Outline || buttonType == ButtonType.Blank,
    });
  };

  const buttonWidth = (buttonWidth: string) => {
    return clsx({
      "w-[120px]": buttonWidth == ButtonWidth.Short,
      "w-[180px]": buttonWidth == ButtonWidth.Medium,
      "w-[240px]": buttonWidth == ButtonWidth.Long,
      "w-full": buttonWidth == ButtonWidth.Expand,
      "": buttonWidth == ButtonWidth.NotExpand,
    });
  };

  const buttonColor = (buttonType: string) => {
    return (
      bgColor ??
      clsx({
        "bg-primary-green-900 hover:bg-primary-green-700":
          buttonType == ButtonType.Normal,
        "bg-neutral-grey-200": buttonType == ButtonType.Disable,
        "bg-nofill border-[3px] border-primary-green-900 hover:bg-neutral-grey-100 px-[9px] py-[3px]":
          buttonType == ButtonType.Outline,
        "active:bg-neutral-grey-100": buttonType == ButtonType.Blank,
      })
    );
  };

  //* set text style
  const defaultText = (
    <div className={clsx("text-base font-bold", textColor(type))}>{text}</div>
  );

  //* set loading text
  const nowLoading = (
    <span
      className={clsx(
        "loading loading-dots loading-md text-neutral-white",
        textColor(type)
      )}></span>
  );

  return (
    <button
      type={isSubmit ? "submit" : undefined}
      disabled={type == ButtonType.Disable || isLoadingBtn}
      className={clsx(
        "px-3 py-1 rounded flex justify-center items-center",
        " whitespace-nowrap",
        buttonColor(type),
        buttonWidth(width),
        {
          "h-full": fullHeight,
        }
      )}
      onClick={async () => {
        setIsLoadingBtn((prev) => true);
        await onClick?.();
        setIsLoadingBtn((prev) => false);
      }}>
      {isLoadingBtn ? nowLoading : children ?? defaultText}
    </button>
  );
}
