import { useState } from "react";
import Layout from "../components/Layout";
import Graph from "../components/Graph";

export default function statistics() {
  const [select, setSelect] = useState("상세전력통계");

  function clickselect(value?: string) {
    setSelect(value ? value : "");
  }

  return (
    <Layout>
      <div className="h-[95vh]">
        <div className="flex w-full h-full ">
          {/* //!그래프 선택박스 */}
          <div className="flex flex-col justify-center w-[200px]">
            <div
              className={`flex justify-center items-center border-2 h-14 hover:cursor-pointer hover:bg-slate-200 ${
                select === "상세전력통계" ? "bg-slate-300" : ""
              }`}
              onClick={(event) =>
                clickselect(event.currentTarget.textContent?.toString())
              }
            >
              상세전력통계
            </div>
            <div
              className={`flex justify-center items-center border-2 h-14 hover:cursor-pointer hover:bg-slate-200 ${
                select === "오늘의 전력통계" ? "bg-slate-300" : ""
              }`}
              onClick={(event) =>
                clickselect(event.currentTarget.textContent?.toString())
              }
            >
              오늘의 전력통계
            </div>
            <div
              className={`flex justify-center items-center border-2 h-14 hover:cursor-pointer hover:bg-slate-200 ${
                select === "어제의 전력통계" ? "bg-slate-300" : ""
              }`}
              onClick={(event) =>
                clickselect(event.currentTarget.textContent?.toString())
              }
            >
              어제의 전력통계
            </div>
          </div>

          <div className=" w-[1500px]">
            {/* //!옵션 박스  */}

            <Graph select={select}></Graph>
          </div>
        </div>
      </div>
    </Layout>
  );
}
