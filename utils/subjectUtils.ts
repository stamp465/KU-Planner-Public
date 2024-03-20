import {
  DayType,
  FilterMode,
  GenEdType,
  SectionType,
  StdStatus,
  dayEngToEnum,
  dayThaiToEnum,
} from "@/constants/enum";
import { CourseDate } from "@/interface/CourseDate";
import { FilterSubject } from "@/interface/FilterSubject";
import { GenEd, GenEdList } from "@/interface/GenEd";
import { PaginationResponse } from "@/interface/PaginationResponse";
import { SectionGroupByStdStatus } from "@/interface/SectionGroupByStdStatus";
import { SetFilterParams } from "@/interface/SetFilterParams";
import { TimeRange } from "@/interface/TimeRange";
import { Section } from "@/model/section";
import { Subject } from "@/model/subject";
import { apiOpenSubjectForEnroll } from "@/service/api-open-subject-for-enroll";
import { apiSearchSubjectOpenEnr } from "@/service/api-search-subject-open-enr";
import { HttpStatusCode } from "axios";
import { Session } from "next-auth";

export function range(start: number, end: number) {
  return Array.apply(0, Array(end - start)).map(
    (element, index) => index + start
  );
}

export function isSubjectTimeRangeInTimeRange(
  subject: Subject,
  timeRange: TimeRange
) {
  const startTime =
    (timeRange.startHour ?? 0) * 100 + (timeRange.startMinute ?? 0);
  const endTime = (timeRange.endHour ?? 0) * 100 + (timeRange.endMinute ?? 0);
  for (let i = 0; i < subject.section.length; i++) {
    const subj = subject.section[i];
    if (subj.coursedate !== undefined) {
      for (let ii = 0; ii < subj.coursedate?.length; ii++) {
        const time = subj.coursedate[ii].timeRange;
        if (time !== undefined) {
          const startSubjectTime =
            (time?.startHour ?? 0) * 100 + (time?.startMinute ?? 0);
          const endSubjectTime =
            (time?.endHour ?? 0) * 100 + (time?.endMinute ?? 0);
          if (startSubjectTime >= startTime && endSubjectTime <= endTime) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

export function isSubjectsInSearchAndFilter(
  subject: Subject,
  filterSubject: FilterSubject,
  favoriteSubjects: Array<string>
) {
  const isFavoriteConditionDone =
    !filterSubject.favorite ||
    (filterSubject.favorite && favoriteSubjects.includes(subject.subjectCode));
  const isContainSubjectCode = subject.subjectCode.includes(
    filterSubject.searchInput
  );
  const isContainSubjectNameEN = subject.subjectNameEN?.includes(
    filterSubject.searchInput
  );
  const isContainSubjectNameTH = subject.subjectNameTH?.includes(
    filterSubject.searchInput
  );
  const isContainSubjectDay =
    filterSubject.setOfDay.length == 0 ||
    filterSubject.filterMode == FilterMode.And
      ? filterSubject.setOfDay.every((day) => subject.setOfDay.includes(day))
      : subject.setOfDay.filter((day) => filterSubject.setOfDay.includes(day))
          .length > 0;
  const isContainSubjectStdStatus =
    filterSubject.setOfStdStatus.length == 0 ||
    filterSubject.filterMode == FilterMode.And
      ? filterSubject.setOfStdStatus.every((std) =>
          subject.setOfStdStatus.includes(std)
        )
      : subject.setOfStdStatus.filter((std) =>
          filterSubject.setOfStdStatus.includes(std)
        ).length > 0;
  const isContainSubjectTimeRange =
    filterSubject.timeRange == null ||
    isSubjectTimeRangeInTimeRange(subject, filterSubject.timeRange);
  const isContainSubjectGenEdType =
    filterSubject.setOfGenEdType.length == 0 ||
    (subject.genEdType &&
      filterSubject.setOfGenEdType.includes(subject.genEdType));
  return (
    isFavoriteConditionDone &&
    (isContainSubjectCode ||
      isContainSubjectNameTH ||
      isContainSubjectNameEN) &&
    isContainSubjectDay &&
    isContainSubjectStdStatus &&
    isContainSubjectTimeRange &&
    isContainSubjectGenEdType
  );
}

export function getCourseDateListCSV(
  courseDateString: string,
  setDayType: Set<DayType>
) {
  // data[i][4] to CourseDate
  let courseDateList: Array<CourseDate> = [];
  // console.log(data[i][4] as string);
  if (
    courseDateString.includes("ยังไม่มีการกำหนดวัน-เวลาเรียน") ||
    courseDateString.includes("ติดต่อผู้สอน")
  ) {
    setDayType.add(DayType.None);
    courseDateList.push({
      day: DayType.None,
      timeRange: null,
    });
  } else {
    const courseDateStringList = courseDateString.split(",");
    // console.log(courseDateStringList);
    const courseDateDayAndTimeList = courseDateStringList.map((c) =>
      c.split("\n")
    );
    // console.log(courseDateDayAndTimeList);
    courseDateDayAndTimeList.forEach((c) => {
      const dayType = dayThaiToEnum(c[0]);
      let getTimeRange: TimeRange | null = null;
      if (dayType != DayType.None) {
        let time = c[1].split("-");
        if (time.length >= 2) {
          getTimeRange = {
            startHour: Number(time[0].split(":")[0]),
            startMinute: Number(time[0].split(":")[1]),
            endHour: Number(time[1].split(":")[0]),
            endMinute: Number(time[1].split(":")[1]),
          };
        }
      }
      setDayType.add(dayType);
      courseDateList.push({
        day: dayType,
        timeRange: getTimeRange,
      });
    });
    // console.log(courseDateList);
  }
  return courseDateList;
}

export function getCourseDateListApi(courseDateString: string | null) {
  if (courseDateString == null) return [{ day: DayType.None, timeRange: null }];
  else {
    // example
    // null
    // " 0:00 - 0:00"
    // "THU  9:30 - 11:00,TUE  9:30 - 11:00"
    const courseDateStringList = courseDateString.trim().split(",");
    // console.log(courseDateStringList);
    const courseDateDayAndTimeList = courseDateStringList.map((c) =>
      c.trim().split("  ")
    );
    // console.log(courseDateDayAndTimeList);

    let courseDateList: Array<CourseDate> = [];

    courseDateDayAndTimeList.forEach((c) => {
      const dayType = dayEngToEnum(c[0]);
      let getTimeRange: TimeRange | null = null;
      if (dayType != DayType.None) {
        let time = c[1].split("-");
        if (time.length >= 2) {
          getTimeRange = {
            startHour: Number(time[0].split(":")[0]),
            startMinute: Number(time[0].split(":")[1]),
            endHour: Number(time[1].split(":")[0]),
            endMinute: Number(time[1].split(":")[1]),
          };
        }
      } else if (c[0].split("-").length >= 2) {
        // "0:00 - 0:00"
        let time = c[0].split("-");
        if (time.length >= 2) {
          getTimeRange = {
            startHour: Number(time[0].split(":")[0]),
            startMinute: Number(time[0].split(":")[1]),
            endHour: Number(time[1].split(":")[0]),
            endMinute: Number(time[1].split(":")[1]),
          };
        }
      }
      courseDateList.push({
        day: dayType,
        timeRange: getTimeRange,
      });
    });

    // console.log(courseDateList);

    return courseDateList;
  }
}

export function getListOfSubjectForSearch(
  subjectForSearch: Array<Subject>,
  searchText: string,
  listOfAlreadySearchSubjectCode: Array<string>
) {
  if (searchText.length == 0) {
    return [];
  }
  return subjectForSearch
    .filter((subject) => {
      const isContainSubjectCode = subject.subjectCode.includes(searchText);
      const isContainSubjectNameTH =
        subject.subjectNameTH?.includes(searchText);
      const isContainSubjectNameEN =
        subject.subjectNameEN?.includes(searchText);
      const isAlreadySearch = listOfAlreadySearchSubjectCode.includes(
        subject.subjectCode
      );
      return (
        !isAlreadySearch &&
        (isContainSubjectCode ||
          isContainSubjectNameTH ||
          isContainSubjectNameEN)
      );
    })
    .slice(0, 5);
}

export function setFilterParams({
  value,
  searchParams,
  currentPage,
}: SetFilterParams) {
  // console.log("setFilterParams", value, searchParams, currentPage);
  const newSearchParams = new URLSearchParams(
    Array.from(searchParams.entries())
  );

  if (value.page < 1 || (currentPage && value.page === currentPage)) {
    newSearchParams.delete("page");
  } else {
    newSearchParams.set("page", value.page.toString());
  }

  if (value.searchInput.length == 0) {
    newSearchParams.delete("searchInput");
  } else {
    newSearchParams.set("searchInput", value.searchInput!);
  }

  if (value.timeRange == null) {
    newSearchParams.delete("startHour");
    newSearchParams.delete("endHour");
    newSearchParams.delete("startMinute");
    newSearchParams.delete("endMinute");
  } else {
    newSearchParams.set(
      "startHour",
      value.timeRange?.startHour.toString() ?? ""
    );
    newSearchParams.set("endHour", value.timeRange?.endHour.toString() ?? "");
    newSearchParams.set(
      "startMinute",
      value.timeRange?.startMinute.toString() ?? ""
    );
    newSearchParams.set(
      "endMinute",
      value.timeRange?.endMinute.toString() ?? ""
    );
  }

  if (value.setOfDay.length == 0) {
    newSearchParams.delete("setOfDay");
  } else {
    newSearchParams.set("setOfDay", JSON.stringify(value.setOfDay));
  }

  if (value.setOfStdStatus.length == 0) {
    newSearchParams.delete("setOfStdStatus");
  } else {
    newSearchParams.set("setOfStdStatus", JSON.stringify(value.setOfStdStatus));
  }

  if (value.setOfGenEdType.length == 0) {
    newSearchParams.delete("setOfGenEdType");
  } else {
    newSearchParams.set("setOfGenEdType", JSON.stringify(value.setOfGenEdType));
  }

  // if (value.filterMode.length == 0) {
  //   newSearchParams.delete("filterMode");
  // } else {
  //   newSearchParams.set("filterMode", value.filterMode!);
  // }

  if (value.favorite) {
    newSearchParams.set("favorite", value.favorite.toString());
  } else {
    newSearchParams.delete("favorite");
  }

  return newSearchParams;
}

export async function getCurrentSubjects({
  page,
  session,
  filterSubject,
  subjects,
  favoriteSubjects,
}: {
  page: number;
  session: Session | null;
  filterSubject: FilterSubject;
  subjects: Array<Subject>;
  favoriteSubjects: Array<string>;
}) {
  const resultSubjects = subjects
    .filter((subj) =>
      isSubjectsInSearchAndFilter(subj, filterSubject, favoriteSubjects)
    )
    .sort((a, b) => (a.subjectCode < b.subjectCode ? -1 : 1));

  const totalPage = Math.ceil(resultSubjects.length / 16);

  if (totalPage < page) {
    page = 1;
  }

  // console.log(page, totalPage);
  if (page >= totalPage && session?.user) {
    // console.log("run");
    const resultSubjectsCode = resultSubjects.map(
      (resultSubjects) => resultSubjects.subjectCode
    );

    // get fav that not in result
    const favPromises = async () => {
      // console.log("favPromises");
      await Promise.all(
        favoriteSubjects
          .filter(
            (fav) =>
              !resultSubjectsCode.includes(fav) &&
              fav.includes(filterSubject.searchInput)
          )
          .map(async (subjectName) => {
            // console.log("favPromises", subjectName);
            const { data, status } = await apiSearchSubjectOpenEnr({
              query: subjectName,
              accessToken: session?.token.accesstoken,
            });
            if (status == HttpStatusCode.Ok) {
              data.subjects.forEach((subject) => {
                if (!resultSubjectsCode.includes(subject.subjectCode)) {
                  // console.log("OH");
                  resultSubjects.push(new Subject(subject));
                }
              });
            }
          })
      );
    };

    // searchInput
    const searchPromises: Promise<void> = new Promise((resolve, reject) => {
      if (filterSubject.searchInput.length <= 0 || filterSubject.favorite) {
        resolve();
        return;
      }
      // console.log("searchPromises", filterSubject.searchInput);
      apiSearchSubjectOpenEnr({
        query: filterSubject.searchInput,
        accessToken: session?.token.accesstoken,
      }).then(({ data, status }) => {
        if (status === HttpStatusCode.Ok) {
          // console.log("searchPromises done");
          data.subjects.forEach((subject) => {
            if (!resultSubjectsCode.includes(subject.subjectCode)) {
              resultSubjects.push(new Subject(subject));
            }
          });
          resolve();
        } else {
          reject();
        }
      });
    });
    await Promise.all([favPromises(), searchPromises]);
    // console.log(resultSubjects);
  }

  return {
    message: "Success",
    data: {
      paginationData:
        page < totalPage
          ? resultSubjects.slice(16 * (page - 1), 16 * page)
          : resultSubjects.slice(16 * (page - 1), resultSubjects.length),
      pageSize: 16,
      currentPage: page,
      totalPage: totalPage,
    } as PaginationResponse<Subject>,
  };
}

export async function getCurrentGenEdSubjects({
  page,
  setOfGenEdType,
  allGenEd,
}: {
  page: number;
  setOfGenEdType: Array<GenEdType>;
  allGenEd: Map<string, GenEdList>;
}) {
  const genEdList = Array.from(allGenEd.keys()).map((genEdCode) => {
    const genEdList = allGenEd.get(genEdCode)!.genEdList;
    return genEdList.at(-1);
  });
  const resultGenEds = genEdList
    .filter((genEd) => genEd && setOfGenEdType.includes(genEd.genEdType))
    .sort((a, b) => (a!.genEdCode < b!.genEdCode ? -1 : 1));

  const totalPage = Math.ceil(resultGenEds.length / 16);

  if (totalPage < page) {
    page = 1;
  }

  return {
    message: "Success",
    data: {
      paginationData: resultGenEds.slice(16 * (page - 1), 16 * page),
      pageSize: 16,
      currentPage: page,
      totalPage: totalPage,
    } as PaginationResponse<GenEd>,
  };
}

export async function getSubjectLocal({
  sections,
}: {
  sections: Array<Section>;
}) {
  let sectionGroupByStdStatus: SectionGroupByStdStatus = {
    regular: {
      lecture: [],
      laboratory: [],
    },
    regularInternational: {
      lecture: [],
      laboratory: [],
    },
    special: {
      lecture: [],
      laboratory: [],
    },
    specialInternational: {
      lecture: [],
      laboratory: [],
    },
  };

  sections.forEach((section) => {
    if (section.stdStatus === StdStatus.Regular) {
      if (section.sectionType === SectionType.Laboratory) {
        sectionGroupByStdStatus.regular.laboratory.push(section);
      } else {
        sectionGroupByStdStatus.regular.lecture.push(section);
      }
    } else if (section.stdStatus === StdStatus.RegularInternational) {
      if (section.sectionType === SectionType.Laboratory) {
        sectionGroupByStdStatus.regularInternational.laboratory.push(section);
      } else {
        sectionGroupByStdStatus.regularInternational.lecture.push(section);
      }
    } else if (section.stdStatus === StdStatus.Special) {
      if (section.sectionType === SectionType.Laboratory) {
        sectionGroupByStdStatus.special.laboratory.push(section);
      } else {
        sectionGroupByStdStatus.special.lecture.push(section);
      }
    } else if (section.stdStatus === StdStatus.SpecialInternational) {
      if (section.sectionType === SectionType.Laboratory) {
        sectionGroupByStdStatus.specialInternational.laboratory.push(section);
      } else {
        sectionGroupByStdStatus.specialInternational.lecture.push(section);
      }
    }
  });

  return sectionGroupByStdStatus;
}

export async function getSubject({
  subject,
  session,
}: {
  subject: Subject;
  session: Session | null;
}) {
  const res = await apiOpenSubjectForEnroll({
    query: subject.subjectCode,
    accessToken: session?.token.accesstoken,
  });

  if (res != undefined) {
    const { data, status } = res;
    let sectionGroupByStdStatus: SectionGroupByStdStatus = {
      regular: {
        lecture: [],
        laboratory: [],
      },
      regularInternational: {
        lecture: [],
        laboratory: [],
      },
      special: {
        lecture: [],
        laboratory: [],
      },
      specialInternational: {
        lecture: [],
        laboratory: [],
      },
    };

    const sections = data.results.map((section) => new Section(section));

    for (const section of sections) {
      // const result = await getSectionDetail({ section: section });
      // section.addSectionDetail(result?.data.sectionDetail);

      if (section.stdStatus === StdStatus.Regular) {
        if (section.sectionType === SectionType.Laboratory) {
          sectionGroupByStdStatus.regular.laboratory.push(section);
        } else {
          sectionGroupByStdStatus.regular.lecture.push(section);
        }
      } else if (section.stdStatus === StdStatus.RegularInternational) {
        if (section.sectionType === SectionType.Laboratory) {
          sectionGroupByStdStatus.regularInternational.laboratory.push(section);
        } else {
          sectionGroupByStdStatus.regularInternational.lecture.push(section);
        }
      } else if (section.stdStatus === StdStatus.Special) {
        if (section.sectionType === SectionType.Laboratory) {
          sectionGroupByStdStatus.special.laboratory.push(section);
        } else {
          sectionGroupByStdStatus.special.lecture.push(section);
        }
      } else if (section.stdStatus === StdStatus.SpecialInternational) {
        if (section.sectionType === SectionType.Laboratory) {
          sectionGroupByStdStatus.specialInternational.laboratory.push(section);
        } else {
          sectionGroupByStdStatus.specialInternational.lecture.push(section);
        }
      }
    }

    return sectionGroupByStdStatus;
  }

  return null;
}

export function checkMajorCodeCanEnroll({
  section,
  session,
  stdStatus,
}: {
  section: Section;
  session: Session | null;
  stdStatus: StdStatus | null;
}) {
  // console.log(
  //   "checkMajorCodeCanEnroll",
  //   section.subjectCode,
  //   section.sectionCode,
  //   section.stdStatus,
  //   stdStatus
  // );
  if (section.stdStatus && stdStatus && section.stdStatus !== stdStatus) {
    // console.log("false");
    return false;
  } else if (
    session &&
    session.user.student.studentStatusCode !== section.studentStatusCode
  ) {
    return false;
  } else if (section.property && session) {
    const listOfMajorCode = section.property.split(",");
    if (listOfMajorCode.length !== 0) {
      const ownMajorCode = `${session.user.student.majorCode}-${session.user.student.studentYear}`; // E09-4
      const ownFacultyCodeMajorCode = `${session.user.student.facultyCode}-${session.user.student.studentYear}`; // E-4
      const ownAllFacultyCodeMajorCode = `${session.user.student.facultyCode}-All`; // E-All
      const ownAllWithYear = `All-${session.user.student.studentYear}`; // All-4
      const ownAllMajorCode = `${session.user.student.majorCode}-All`; // E09-All
      if (
        listOfMajorCode.includes(ownMajorCode) ||
        listOfMajorCode.includes(ownFacultyCodeMajorCode) ||
        listOfMajorCode.includes(ownAllFacultyCodeMajorCode) ||
        listOfMajorCode.includes(ownAllWithYear) ||
        listOfMajorCode.includes(ownAllMajorCode) ||
        listOfMajorCode.includes(session.user.student.majorCode) ||
        listOfMajorCode.includes("All") ||
        listOfMajorCode.includes(session.user.student.facultyCode)
      ) {
        // setCanEnroll(true);
      } else {
        return false;
      }
    }
  }
  return true;
}
