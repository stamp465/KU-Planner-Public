import { ButtonWidth, ButtonType } from "@/constants/enum";
import Button from "../Button";

export default function PreButton({
  currentPage,
  onClick,
}: {
  currentPage: number;
  onClick?: () => Promise<void>;
}) {
  return (
    <Button
      width={ButtonWidth.NotExpand}
      type={
        currentPage != null && currentPage > 1
          ? ButtonType.Normal
          : ButtonType.Disable
      }
      text="<"
      onClick={onClick}
    />
  );
}
