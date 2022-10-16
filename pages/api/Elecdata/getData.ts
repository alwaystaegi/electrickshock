// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ElecData, Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { useState } from "react";
import client from "../../../libs/server/client";

// type Data = {
//   name: string;
// };
interface Data {
  ok: Boolean;
  error?: String;
  result?: ElecData[] | null;
}
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<Data>
) {
  const json = JSON.parse(request.body);
  const [startYy, startMm] = json.start.split("-");
  const [endYy, endMm] = json.end?.split("-");
  let sidoNm;
  let sigunguNm;
  if (json.region.indexOf("　") == 0) {
    sigunguNm = json.region.replace("　", "");
  } else if ("전국" !== json.region) {
    sidoNm = json.region;
  }
  let result;
  try {
    if (sidoNm) {
      console.log(sidoNm);
      result = await client.elecData.findMany({
        // ? where=== 필터링 ... sencing 안의 요소가 있는 것 들만 검사함
        take: 100,
        where: {
          cntrKndNm: json.purpose,
          sidoNm: sidoNm,
        },
        //   ? orderBy 정렬하기 desc 오름차순 asc내림차순
      });
    } else if (sigunguNm) {
      result = await client.elecData.findMany({
        // ? where=== 필터링 ... sencing 안의 요소가 있는 것 들만 검사함
        take: 100,
        where: {
          cntrKndNm: json.purpose,
          sigunguNm: sigunguNm,
        },
        //   ? orderBy 정렬하기 desc 오름차순 asc내림차순
      });
    } else {
      result = await client.elecData.findMany({
        // ? where=== 필터링 ... sencing 안의 요소가 있는 것 들만 검사함
        take: 100,
        where: {
          cntrKndNm: json.purpose,
        },
        //   ? orderBy 정렬하기 desc 오름차순 asc내림차순
      });
    }
    console.log(result);
    client.$disconnect();
    //response.status(200).json({ ok: true, result });
    response.status(200).json({ ok: true, result });
  } catch (err) {
    response.status(200).json({ ok: false, error: `${err}` });
  }
}
