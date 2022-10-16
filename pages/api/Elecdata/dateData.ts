// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { DateData } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import dateData from "../../../Dataset/DateData.json";
// type Data = {
//   name: string;
// };
interface Data {
  ok: Boolean;
  error?: String;
  result?: DateData[];
}
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<Data>
) {
  try {
    // const result = await client.regionData.findMany({});

    // ? where=== 필터링 ... sencing 안의 요소가 있는 것 들만 검사함
    //   ? orderBy 정렬하기 desc 오름차순 asc내림차순
    // console.log(result);

    response
      .status(200)
      .json({ ok: true, result: JSON.parse(JSON.stringify(dateData)) });
  } catch (err) {
    response.status(200).json({
      ok: false,
      error: `${err}`,
    });
  }
}
