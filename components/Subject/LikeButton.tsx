"use client";

import { favoriteSubjectsAtom } from "@/atom/favoriteSubjectsAtom";
import { useAtom } from "jotai";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";

export default function LikeButton({ subjectCode }: { subjectCode: string }) {
  const [favoriteSubjects, setFavoriteSubjects] = useAtom(favoriteSubjectsAtom);
  const isFavorite = favoriteSubjects.includes(subjectCode);

  return (
    <button
      className=""
      onClick={async () => {
        const newFavoriteSubjects = favoriteSubjects.includes(subjectCode)
          ? favoriteSubjects.filter((item) => item !== subjectCode)
          : [...favoriteSubjects, subjectCode];
        setFavoriteSubjects(newFavoriteSubjects);
      }}>
      {isFavorite ? (
        <div className="flex flex-row gap-2 items-center">
          <AiFillLike
            color={"#002706"}
            size={24}
          />
        </div>
      ) : (
        <div className="flex flex-row gap-2 items-center">
          <AiOutlineLike
            color={"#002706"}
            size={24}
          />
        </div>
      )}
    </button>
  );
}
