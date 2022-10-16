// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ElecData, DayStatis } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { useState } from "react";
import client from "../../../libs/server/client";

// type Data = {
//   name: string;
// };
interface Data {
  ok: Boolean;
  error?: String;
  result?: DayStatis[] | DayStatis | null;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<Data>
) {
  if (request.method === "GET") {
    try {
      const result = await client.dayStatis.findFirst({
        // ? where=== 필터링 ... sencing 안의 요소가 있는 것 들만 검사함
        //   ? orderBy 정렬하기 desc 오름차순 asc내림차순
      });
      console.log(result);
      // console.log(result);
      client.$disconnect();
      response.status(200).json({ ok: true, result });
    } catch (err) {
      response.status(200).json({ ok: false, error: `${err}` });
    }
  }
  if (request.method === "POST") {
    const value = request.body;
    console.log(value);

    const date = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${
      value == "오늘의 전력통계"
        ? new Date().getDate()
        : new Date().getDate() - 1
    }`;
    const ids = ["전 체 ", "가로등", "교육용"];

    try {
      const result = await client.dayStatis.findMany({
        // ? where=== 필터링 ... sencing 안의 요소가 있는 것 들만 검사함
        where: { date },
        //   ? orderBy 정렬하기 desc 오름차순 asc내림차순
      });
      console.log(result);
      // console.log(result);
      client.$disconnect();
      response.status(200).json({ ok: true, result });
    } catch (err) {
      response.status(200).json({ ok: false, error: `${err}` });
    }
  }
}
