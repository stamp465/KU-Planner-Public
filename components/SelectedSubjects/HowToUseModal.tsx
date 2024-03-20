"use client";

import { useState } from "react";
import Button from "../Button";
import { ButtonType, ButtonWidth } from "@/constants/enum";
import PureModal from "@/plugins/pureModal/react-pure-modal";
import { FaCircleQuestion } from "react-icons/fa6";
import selectedSubjects from "../../public/guide/selected_subjects.svg";
import Image from "next/image";

export default function HowToUseModal() {
  const [modal, setModal] = useState(false);

  // console.log(arrayOfChoiceOfSection);
  return (
    <>
      <Button
        type={ButtonType.Normal}
        width={ButtonWidth.NotExpand}
        bgColor="bg-secondary-blue-100 hover:bg-secondary-blue-500"
        onClick={async () => {
          setModal(true);
        }}>
        <div className="flex gap-1 text-primary-green-900 hover:text-neutral-white font-bold items-center">
          <div>{`วิธีใช้`}</div> <FaCircleQuestion />
        </div>
      </Button>
      <PureModal
        isOpen={modal}
        closeButton={
          <button className="btn btn-sm btn-circle btn-ghost">✕</button>
        }
        onClose={() => {
          setModal(false);
          return true;
        }}
        width="100%"
        maxWidth="1024px">
        <div
          className="text-primary-green-900 flex flex-col gap-3 justify-between max-h-[90vh] max-w-[1024px]"
          id={`plan_modal`}>
          <h3 className="flex gap-1 items-center font-bold text-xl">
            <div>{`วิธีใช้`}</div> <FaCircleQuestion />
          </h3>
          <Image
            src={selectedSubjects}
            width={1024}
            height={0}
            alt="selectedSubjects"
            className=""
          />
        </div>
      </PureModal>
    </>
  );
}
