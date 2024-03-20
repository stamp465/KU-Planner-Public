"use client";

import { Subject } from "@/model/subject";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Section } from "@/model/section";
import PureModal from "@/plugins/pureModal/react-pure-modal";
import SectionComponent from "./SectionComponent";
import { SectionGroupByStdStatus } from "@/interface/SectionGroupByStdStatus";
import { getSubject, getSubjectLocal } from "@/utils/subjectUtils";
import { useAtom } from "jotai";
import { favoriteSubjectsAtom } from "@/atom/favoriteSubjectsAtom";
import LikeButton from "../Subject/LikeButton";
import { MdFindInPage } from "react-icons/md";

export default function SectionModal({ subject }: { subject: Subject }) {
  const locale = useLocale();
  const tSubjectsAndSections = useTranslations("SubjectsAndSections");
  const tCommon = useTranslations("Common");

  const { data: session, update } = useSession();
  const [sections, setSections] = useState<SectionGroupByStdStatus | null>();
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteSubjects, setFavoriteSubjects] = useAtom(favoriteSubjectsAtom);

  function setSectionGroup(
    lectureSection: Array<Section>,
    laboratorySection: Array<Section>
  ) {
    if (lectureSection.length == laboratorySection.length) {
      return lectureSection.map((section, index) => (
        <div
          className="flex flex-col gap-y-2"
          key={`SectionGroup${section.subjectCode}${section.sectionCode}`}>
          <SectionComponent
            key={`${section.subjectCode}${section.sectionCode}${section.sectionType}`}
            isLocalData={session?.user ? false : true}
            section={section}
            havePair={true}
            pairSectionCode={laboratorySection[index].sectionCode ?? ""}
            checkTable={false}></SectionComponent>
          <SectionComponent
            key={`${laboratorySection[index].subjectCode}${laboratorySection[index].sectionCode}${laboratorySection[index].sectionType}`}
            isLocalData={session?.user ? false : true}
            section={laboratorySection[index]}
            havePair={true}
            pairSectionCode={section.sectionCode ?? ""}
            checkTable={false}></SectionComponent>
        </div>
      ));
    }
    return (
      <div className="flex flex-col gap-y-2">
        {lectureSection.map((section) => (
          <SectionComponent
            isLocalData={session?.user ? false : true}
            key={`${section.subjectCode}${section.sectionCode}${section.sectionType}`}
            section={section}
            havePair={false}
            pairSectionCode={"1"}
            checkTable={false}></SectionComponent>
        ))}
        {laboratorySection.map((section) => (
          <SectionComponent
            isLocalData={session?.user ? false : true}
            key={`${section.subjectCode}${section.sectionCode}${section.sectionType}`}
            section={section}
            havePair={false}
            pairSectionCode={"1"}
            checkTable={false}></SectionComponent>
        ))}
      </div>
    );
  }

  useEffect(() => {
    if (modal == true) {
      if (session?.user) {
        getSubject({ subject: subject, session: session }).then(
          (sectionsMyKU) => {
            setSections(sectionsMyKU);
            setIsLoading(false);
          }
        );
      } else {
        getSubjectLocal({ sections: subject.section }).then((sectionsMyKU) => {
          setSections(sectionsMyKU);
          setIsLoading(false);
        });
      }
    }
    if (modal == false) {
      setIsLoading(true);
    }
  }, [modal]);

  return (
    <>
      <button
        className="text-sm font-bold text-primary-green-900 hover:underline self-end bg-primary-green-50 rounded py-1 px-2"
        onClick={() => setModal(true)}>
        {tSubjectsAndSections("SeeSections")}
      </button>
      <PureModal
        isOpen={modal}
        closeButton={
          <button className="btn btn-sm btn-circle btn-ghost">✕</button>
        }
        onClose={() => {
          setModal(false);
          return true;
        }}
        maxWidth="1024px"
        width="100%">
        <div className="text-primary-green-90 flex flex-col gap-3 justify-between max-h-[80vh]">
          <div className="font-bold text-sm xs:text-base md:text-xl flex flex-col sm:flex-row gap-x-2  sm:items-center">
            <div className="flex gap-x-2 ">
              <LikeButton subjectCode={subject.subjectCode} />
              <div className="text-base xs:text-xl">{subject.subjectCode}</div>
            </div>
            <div>
              {locale === "en" ? subject.subjectNameEN : subject.subjectNameTH}
            </div>
          </div>

          <div className="max-h-full overflow-y-auto">
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <span className="loading loading-dots loading-md"></span>
              </div>
            ) : (
              <div className=" flex flex-col gap-y-2">
                {sections != null &&
                (sections.regular.lecture.length > 0 ||
                  sections.regular.laboratory.length > 0 ||
                  sections.regularInternational.lecture.length > 0 ||
                  sections.regularInternational.laboratory.length > 0 ||
                  sections.special.lecture.length > 0 ||
                  sections.special.laboratory.length > 0 ||
                  sections.specialInternational.lecture.length > 0 ||
                  sections.specialInternational.laboratory.length > 0) ? (
                  <>
                    {setSectionGroup(
                      sections.regular.lecture,
                      sections.regular.laboratory
                    )}
                    {setSectionGroup(
                      sections.regularInternational.lecture,
                      sections.regularInternational.laboratory
                    )}
                    {setSectionGroup(
                      sections.special.lecture,
                      sections.special.laboratory
                    )}
                    {setSectionGroup(
                      sections.specialInternational.lecture,
                      sections.specialInternational.laboratory
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col w-full justify-center items-center gap-2 py-20">
                      <MdFindInPage size={48} />
                      <div className="text-xl font-bold text-primary-green-900">
                        {tCommon("NotFound")}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </PureModal>
    </>
  );
}
