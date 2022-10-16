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
  let [startYy, startMm] = json.start.split("-");
  const [endYy, endMm] = json.end?.split("-");
  let range = "{{";
  let sidoNm;
  let sigunguNm;
  if (json.region.indexOf("　") == 0) {
    sigunguNm = json.region.replace("　", "");
  } else if ("전국" !== json.region) {
    sidoNm = json.region;
  }
  let result;
  try {
    console.log(startMm, endMm);
    if (Number(startMm) !== Number(endMm) + 1) console.log("다르다");
    while (
      Number(startYy) * 12 + Number(startMm) <
      Number(endYy) * 12 + Number(endMm) + 1
    ) {
      if (range.length != 2) {
        range += ",{";
      }
      range += "useYy:" + startYy + ",useMm:" + startMm.padStart(2, "0") + "}";

      startMm = (Number(startMm) + 1).toString();
      if (startMm === "13") {
        startYy = (Number(startYy) + 1).toString();
        startMm = "1";
      }
    }
    range += "}";
    const rangej = JSON.parse(JSON.stringify(range));
    // console.log(range);
    if (sidoNm) {
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
      console.log("hi");
      result = await client.elecData.findMany({
        // ? where=== 필터링 ... sencing 안의 요소가 있는 것 들만 검사함
        take: 100,
        where: {
          OR: rangej,
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

    client.$disconnect();

    //response.status(200).json({ ok: true, result });
    response.status(200).json({ ok: true, result });
  } catch (err) {
    console.log(result);
    response.status(200).json({ ok: false, error: `${err}` });
  }
}
