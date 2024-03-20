import { SavePlanRequest, SavePlanResponse } from "@/interface/SavePlanRequest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function isUserCreate(savePlanRequest: SavePlanRequest) {
  const user = await prisma.user.findFirst({
    where: {
      loginName: savePlanRequest.loginName,
    },
  });
  if (user) {
    return true;
  } else {
    return false;
  }
}

export async function writeUser(savePlanRequest: SavePlanRequest) {
  await prisma.user.create({
    data: {
      loginName: savePlanRequest.loginName,
      searchSubjects: savePlanRequest.searchSubjects,
      orderSubjects: savePlanRequest.orderSubjects,
      favoriteSubjects: savePlanRequest.favoriteSubjects,
      choiceOfSection: null,
    },
  });
}

export async function updateUser(savePlanRequest: SavePlanRequest) {
  const userPlan = readUser(savePlanRequest.loginName);

  interface UpdateUserRequest {
    searchSubjects: string[];
    orderSubjects: string[];
    favoriteSubjects: string[];
    choiceOfSection?: string | null;
  }
  let data: UpdateUserRequest = {
    searchSubjects: savePlanRequest.searchSubjects,
    orderSubjects: savePlanRequest.orderSubjects,
    favoriteSubjects: savePlanRequest.favoriteSubjects,
  };
  if (
    (await userPlan).orderSubjects.join(",") !==
    savePlanRequest.orderSubjects.join(",")
  ) {
    data = {
      ...data,
      choiceOfSection: null,
    };
  } else if (savePlanRequest.choiceOfSection) {
    data = {
      ...data,
      choiceOfSection: JSON.stringify(savePlanRequest.choiceOfSection),
    };
  }
  await prisma.user.update({
    where: {
      loginName: savePlanRequest.loginName,
    },
    data: data,
  });
}

export async function readUser(loginName: string) {
  const user = await prisma.user.findFirst({
    where: {
      loginName: loginName,
    },
  });
  const userPlanResponse = user != null ? (user as SavePlanResponse) : null;
  const userPlan: SavePlanRequest = {
    loginName: userPlanResponse?.loginName ?? "",
    searchSubjects: userPlanResponse?.searchSubjects ?? [],
    orderSubjects: userPlanResponse?.orderSubjects ?? [],
    favoriteSubjects: userPlanResponse?.favoriteSubjects ?? [],
    choiceOfSection: userPlanResponse?.choiceOfSection
      ? JSON.parse(userPlanResponse?.choiceOfSection)
      : undefined,
  };
  return userPlan;
}
