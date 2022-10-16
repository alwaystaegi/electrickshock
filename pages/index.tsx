import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [elecVal, setElecVal] = useState("");
  //!숫자만 입력받을 수 있는 함수
  function getElecVal(value: string) {
    if (!Number.isNaN(Number(value))) setElecVal(value);
  }

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

        {/* //!빠른 이동 */}
        <div>
          <div className="flex mx-2">
            <div>빠른 이동</div>
            <button>관리자 페이지</button>
          </div>
          <div className="flex flex-col mx-5">
            <div>
              <button className="btn">빠이1</button>
              <button className="btn">빠이2</button>
              <button className="btn">빠이3</button>
            </div>
            <div className="my-3">
              <button className="btn">빠이4</button>
              <button className="btn">빠이5</button>
              <button className="btn">빠이6</button>
            </div>
          </div>
        </div>
      </div>

      <div title="전력상태 박스" className="w-full border-2 border-black">
        {/* //!현재 전력상태 */}
        <div className="w-full text-center">현재 전력 상태</div>
        <div className="flex w-[1546px] h-12 border-4 border-black mx-auto">
          <div className="w-[300px] bg-gradient-to-r from-gray-500 to-gray-900">
            1
          </div>
          <div className="w-[300px] bg-gradient-to-r from-green-500 to-green-900">
            2
          </div>
          <div className="w-[300px] bg-gradient-to-r from-cyan-500 to-cyan-900">
            3
          </div>
          <div className="w-[300px] bg-gradient-to-r from-yellow-500 to-yellow-900">
            4
          </div>
          <div className="w-[300px] bg-gradient-to-r from-orange-500 to-orange-900">
            5
          </div>
          <div className="w-[300px] bg-gradient-to-r from-red-500 to-red-900">
            5
          </div>
        </div>
        <div className="flex justify-around">
          {/* 전력수급량 */}
          <div>
            <div className="mx-2">전력 수급량</div>
            <div className="mx-2 bg-white border-black border-2 rounded-lg w-20 text-center">
              1
            </div>
          </div>
          {/* 전력부하량 */}
          <div>
            <div className="mx-2">전력 부하량</div>
            <div className="mx-2 bg-white border-black border-2 rounded-lg w-20 text-center">
              1
            </div>
          </div>
          <div>
            <div className="mx-2">예비 전력</div>
            <div className="mx-2 bg-white border-black border-2 rounded-lg w-20 text-center">
              1
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
