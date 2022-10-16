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
  let sidoNm;
  let sigunguNm;
  startMm = startMm.padStart(2, "0");
  console.log(startMm);
  if ("전국" !== json.region) {
    sidoNm = json.region;
  }
  let result;
  try {
    console.log(json);
    console.log(sigunguNm, startYy, startMm);
    if (sidoNm) {
      result = await client.elecData.findMany({
        // ? where=== 필터링 ... sencing 안의 요소가 있는 것 들만 검사함
        take: 100,
        where: {
          cntrKndNm: json.purpose,
          sidoNm: sidoNm,
          useYy: startYy,
          useMm: startMm,
        },
        //   ? orderBy 정렬하기 desc 오름차순 asc내림차순
      });
    } else {
      result = await client.elecData.findMany({
        // ? where=== 필터링 ... sencing 안의 요소가 있는 것 들만 검사함
        take: 100,
        where: {
          cntrKndNm: json.purpose,
          useYy: startYy,
          useMm: startMm,
        },
        //   ? orderBy 정렬하기 desc 오름차순 asc내림차순
      });
    }
    console.log(json.purpose, startYy, startMm);
    client.$disconnect();
    console.log(result);
    console.log("123");
    //response.status(200).json({ ok: true, result });
    response.status(200).json({ ok: true, result });
  } catch (err) {
    console.log(result);
    response.status(200).json({ ok: false, error: `${err}` });
  }
}
