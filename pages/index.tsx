import { DayStatis } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";

interface response {
  ok: boolean;
  result: DayStatis;
}
const Home: NextPage = () => {
  const [elecVal, setElecVal] = useState("");
  const [supply, setSupply] = useState(0);
  const [now, setNow] = useState(0);
  const [location, setLocation] = useState("");
  const [remain, setRemain] = useState(0);
  //!숫자만 입력받을 수 있는 함수
  function getElecVal(value: string) {
    if (!Number.isNaN(Number(value))) setElecVal(value);
  }

  useEffect(() => {
    fetch("/api/Elecdata/todayData", {
      method: "GET",
    })
      .then((res) => res.json())
      .then(({ result }: response) => {
        setSupply(result.supplydemand);
        setNow(result.nowValue);
      });
    setRemain(supply - now);
    const str = ((7000 - remain) / 7000) * 100;
    console.log(str.toFixed(0), "str");
    if (supply - now > 7000) setLocation("-left-2");
    else {
      setLocation(`left-[${str.toFixed(0)}%]`);
      console.log(location);
    }
  }, []);
  return (
    <Layout>
      <div className="w-full h-20 border-4">Electric shock</div>
      {/* //!빠른 자가진단 */}
      <div title="middle" className="flex justify-around">
        <div>
          <div>가정용 전력 사용량 자가진단</div>
          {/* //!진단용 박스?*/}
          <div className="border-2 flex flex-col w-[500px] h-[100px]">
            <div>
              <input
                type="text"
                value={elecVal}
                onChange={(event) => {
                  getElecVal(event.currentTarget.value);
                }}
                placeholder="사용한 전력량을 입력해주세요"
                className="ring-2 ring-black w-60"
              />
              <button className="mx-2 rounded-md bg-blue-300 h-10">
                진단하기
              </button>
            </div>
            <div>1가구당 평균사용량 대비 100%입니다.</div>
          </div>
        </div>
      </div>

      <div title="전력상태 박스" className="w-full border-2 border-black">
        {/* //!현재 전력상태 */}
        <div className="w-full text-center">현재 전력 상태</div>
        <div className="relative flex w-[1546px] h-12 border-4 border-black mx-auto">
          <div
            className={`absolute w-[4px] bg-red-500 h-full mx-[1vh]  ${location}`}
          ></div>
          <div className="w-[300px] bg-gradient-to-r from-gray-500 to-gray-900"></div>
          <div className="w-[300px] bg-gradient-to-r from-green-500 to-green-900"></div>
          <div className="w-[300px] bg-gradient-to-r from-cyan-500 to-cyan-900"></div>
          <div className="w-[300px] bg-gradient-to-r from-yellow-500 to-yellow-900"></div>
          <div className="w-[300px] bg-gradient-to-r from-orange-500 to-orange-900"></div>
          <div className="w-[300px] bg-gradient-to-r from-red-500 to-red-900"></div>
        </div>
        <div className="flex justify-around">
          {/* 전력수급량 */}
          <div>
            <div className="mx-2">전력 수급량</div>
            <div className="mx-2 bg-white border-black border-2 rounded-lg w-20 text-center">
              {supply}
            </div>
          </div>
          {/* 전력부하량 */}
          <div>
            <div className="mx-2">전력 부하량</div>
            <div className="mx-2 bg-white border-black border-2 rounded-lg w-20 text-center">
              {now}
            </div>
          </div>
          <div>
            <div className="mx-2">예비 전력</div>
            <div className="mx-2 bg-white border-black border-2 rounded-lg w-20 text-center">
              {remain}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
