import { ButtonWidth, ButtonType } from "@/constants/enum";
import Button from "../Button";

export default function NextButton({
  currentPage,
  totalPage,
  onClick,
}: {
  currentPage: number;
  totalPage: number;
  onClick?: () => Promise<void>;
}) {
  return (
    <Button
      width={ButtonWidth.NotExpand}
      type={
        currentPage != null && totalPage != null && currentPage < totalPage
          ? ButtonType.Normal
          : ButtonType.Disable
      }
      text=">"
      onClick={onClick}
    />
  );
}
