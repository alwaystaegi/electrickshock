import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { SidoData, DateData, ElecData } from "@prisma/client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface LayoutProps {
  select?: string;
}

export default function Particular({ select }: LayoutProps) {
  const [x, setX] = useState("월별");
  const [purpose, setPurpose] = useState("전 체 ");
  const [region, setRegion] = useState("전국");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [regionlist, setRegionlist] = useState<SidoData[]>([]);
  const [purposelist, setPurposelist] = useState<String[]>([]);
  const [datelist, setDatelist] = useState<String[]>([]);
  const [elecdata, setElecdata] = useState<ElecData[]>([]);
  const [labels, setLabels] = useState<String[]>([]);
  const [supply, setSupply] = useState<number[]>([]);
  const [sale, setSale] = useState<number[]>([]);
  const [max, setMax] = useState(0);
  const options = {
    responsive: true,
    Plugin: {
      Legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "gus",
      },
    },
    scale: { y: { max } },
  };

  function getPurpose() {
    fetch("/api/Elecdata/listData")
      .then((res) => res.json())
      .then(({ result }) => {
        setPurposelist(result[0].cntrKndNmList);
      });
  }
  function getRegion() {
    setRegionlist([]);
    fetch("/api/Elecdata/regionData")
      .then((res) => res.json())
      .then(({ result }) => {
        result.map((ele: SidoData) => {
          setRegionlist((prevlist) => {
            return [...prevlist, ele];
          });
        });
      });
  }
  function getDate() {
    setDatelist([]);
    fetch("/api/Elecdata/dateData")
      .then((res) => res.json())
      .then(({ result }) => {
        result.forEach((ele: DateData) => {
          ele.month.forEach((month) => {
            setDatelist((prevlist) => [
              ...prevlist,
              `${ele.year}-${month.toString().padStart(2, "0")}`,
            ]);
          });
        });
      });
  }

  function loadData() {
    let data;
    let url;
    setMax(0);
    if (!start) {
      alert("기간을 선택해주세요");
    }
    if (x === "월별") {
      data = { purpose, region, start, end };
      url = "/api/Elecdata/getDataM";
      let [startYy, startMm] = start.split("-");
      const [endYy, endMm] = end.split("-");
      if (region === "전국") {
        const yy = Number(endYy) - Number(startYy);
        const mm = Number(endMm) - Number(startMm);
        if (mm + yy * 12 > 3)
          alert("지역이 전국일 경우 3개월 이하의 범위만 확인할 수 있습니다.");
      }

      if (!end) {
        alert("기간을 선택해주세요");
      }
      if (startYy > endYy || (startYy == endYy && startMm > endMm)) {
        alert("시작범위가 종료범위보다 작을 수 없습니다.");
        return;
      }
    } else if (x == "용도별") {
      data = { region, start };
      url = "/api/Elecdata/getDataP";
    } else {
      data = { purpose, region, start };
      url = "/api/Elecdata/getDataR";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(({ result }) => {
        setElecdata(result);
      });
    if (elecdata) {
      document.querySelector("#graph")?.classList.remove("invisible");
    }
    setLabels([]);
    if (x === "월별") {
      //todo

      setLabels(() => {
        let label: String[] = [];
        let [startYy, startMm] = start.split("-");
        const [endYy, endMm] = end.split("-");
        while (
          Number(startYy) * 12 + Number(startMm) <
          Number(endYy) * 12 + Number(endMm) + 1
        ) {
          label = [...label, `${startYy}-${startMm}`];
          startMm = (Number(startMm) + 1).toString();
          if (startMm === "13") {
            startYy = (Number(startYy) + 1).toString();
            startMm = "1";
          }
        }

        return label;
      });

      elecdata
        ? elecdata.forEach((ele) => {
            setSale((prev) => [...prev, ele.salekwh]);
            setSupply((prev) => [...prev, ele.cntrPwr]);
            if (ele.cntrPwr > max) setMax(ele.cntrPwr);
          })
        : null;
    } else if (x === "용도별") {
      setLabels([
        "가로등",
        "교육용",
        "농사용",
        "산업용",
        "심 야",
        "일반용",
        "전 체 ",
        "주택용",
      ]);
      setSale([0, 0, 0, 0, 0, 0, 0, 0]);
      setSupply([0, 0, 0, 0, 0, 0, 0, 0]);

      elecdata.forEach((ele) => {
        labels.forEach((elel, idx) => {
          if (elel === ele.cntrKndNm) {
            setSale((sale) => {
              sale[idx] = sale[idx] + ele.salekwh;
              return sale;
            });
            setSupply((supply) => {
              supply[idx] = supply[idx] + ele.cntrPwr;
              return supply;
            });
            if (ele.cntrPwr > max) setMax(ele.cntrPwr);
          }
        });
      });
    } else {
      setLabels(() => {
        let label: String[] = [];
        elecdata.map((data) => {
          if ("전국" === region && -1 === label.indexOf(data.sidoNm)) {
            label.push(data.sidoNm);
          } else if ("전국" !== region && -1 === label.indexOf(data.sigunguNm))
            label.push(data.sigunguNm);
        });

        return label;
      });
      setSale([]);
      setSupply([]);
      for (let i = 0; i < labels.length; i++) {
        setSale((prev) => {
          prev.push(0);
          return prev;
        });
        setSupply((prev) => {
          prev.push(0);
          return prev;
        });
      }
      elecdata.forEach((ele) => {
        labels.forEach((elel, idx) => {
          if (elel === ele.sidoNm || elel === ele.sigunguNm) {
            setSale((sale) => {
              sale[idx] = sale[idx] + ele.salekwh;
              return sale;
            });
            setSupply((supply) => {
              supply[idx] = supply[idx] + ele.cntrPwr;
              return supply;
            });
            if (ele.cntrPwr > max) setMax(ele.cntrPwr);
          }
        });
      });
    }
    console.log(max);
  }
  useEffect(() => {
    getPurpose();
    getRegion();
    getDate();
  }, [select]);
  function show() {
    return (
      <Line
        datasetIdKey="id"
        data={{
          labels,
          datasets: [
            {
              label: "공급능력",
              data: supply,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
              label: "부하량",
              data: sale,
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        }}
      />
    );
  }

  function search() {
    if ("월별" === x) {
      return (
        <div className="flex">
          {/* //!용도옵션 */}
          <div className="flex h-10">
            <div>용도</div>
            <select
              title="용도"
              className="mx-2 ring-2 ring-black"
              defaultValue={"전 체 "}
              onChange={(event) => {
                setPurpose(event.currentTarget.value);
              }}
            >
              <option value="전 체 " hidden>
                전 체{" "}
              </option>
              {purposelist
                ? purposelist.map((purpose, idx) => {
                    if ("전 체 " === purpose) {
                      return (
                        <option
                          key={idx}
                          value={purpose.toString()}
                          defaultChecked
                        >
                          {purpose}
                        </option>
                      );
                    }

                    return (
                      <option key={idx} value={purpose.toString()}>
                        {purpose}
                      </option>
                    );
                  })
                : null}
            </select>
          </div>

          {/* //!지역옵션 */}
          <div className="flex h-10">
            <div>지역</div>
            <select
              title="지역"
              className="mx-2 ring-2 ring-black w-24"
              onChange={(event) => {
                setRegion(event.currentTarget.value);
              }}
            >
              <option defaultChecked>전국</option>
              {regionlist
                ? regionlist.map((region, idx) => {
                    if (region.sidoNm == undefined) {
                      return region.sigunguNmList.map((sigungu, idx) => {
                        return (
                          <option key={idx} value={"　" + sigungu}>
                            {"　" + sigungu.toString()}
                          </option>
                        );
                      });
                    } else {
                      return (
                        <option
                          key={idx}
                          className="font-bold bg-gray-200"
                          value={region.sidoNm}
                        >
                          {region.sidoNm}
                        </option>
                      );
                    }
                  })
                : null}
            </select>
          </div>

          {/* //!탐색범위 시작 */}
          <div className="flex h-10">
            <div>탐색범위</div>
            <select
              title="시작"
              className="mx-2 ring-2 ring-black "
              onChange={(event) => {
                setStart(event.currentTarget.value);
              }}
            >
              <option hidden>시작범위</option>
              {datelist.map((ele, idx) => {
                return <option key={idx}>{ele}</option>;
              })}
            </select>
          </div>

          {/* //!탐색범위 끝  */}
          <div className="flex h-10">
            <div>~</div>
            <select
              title="지역"
              className="mx-2 ring-2 ring-black "
              onChange={(event) => {
                setEnd(event.currentTarget.value);
              }}
            >
              <option hidden>종료범위</option>
              {datelist.map((ele, idx) => {
                return <option key={idx}>{ele}</option>;
              })}
            </select>
          </div>
        </div>
      );
    } else if ("용도별" === x) {
      return (
        <div className="flex">
          {/* //!용도옵션 */}

          {/* //!지역옵션 */}
          <div className="flex h-10">
            <div>지역</div>
            <select
              title="지역"
              className="mx-2 ring-2 ring-black w-24"
              onChange={(event) => {
                setRegion(event.currentTarget.value);
              }}
            >
              <option defaultChecked>전국</option>
              {regionlist
                ? regionlist.map((region, idx) => {
                    if (region.sidoNm == undefined) {
                      return region.sigunguNmList.map((sigungu, idx) => {
                        return (
                          <option key={idx} value={"　" + sigungu}>
                            {"　" + sigungu.toString()}
                          </option>
                        );
                      });
                    } else {
                      return (
                        <option
                          key={idx}
                          className="font-bold bg-gray-200"
                          value={region.sidoNm}
                        >
                          {region.sidoNm}
                        </option>
                      );
                    }
                  })
                : null}
            </select>
          </div>

          {/* //!탐색 월 */}
          <div className="flex h-10">
            <div>탐색년월</div>
            <select
              title="시작"
              className="mx-2 ring-2 ring-black "
              onChange={(event) => {
                setStart(event.currentTarget.value);
              }}
            >
              <option hidden>기간선택</option>
              {datelist.map((ele, idx) => {
                return <option key={idx}>{ele}</option>;
              })}
            </select>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex">
          {/* //!용도옵션 */}
          <div className="flex h-10">
            <div>용도</div>
            <select
              title="용도"
              className="mx-2 ring-2 ring-black"
              defaultValue={"전 체 "}
              onChange={(event) => {
                setPurpose(event.currentTarget.value);
              }}
            >
              <option value="전 체 " hidden>
                전 체{" "}
              </option>
              {purposelist
                ? purposelist.map((purpose, idx) => {
                    if ("전 체 " === purpose) {
                      return (
                        <option
                          key={idx}
                          value={purpose.toString()}
                          defaultChecked
                        >
                          {purpose}
                        </option>
                      );
                    }

                    return (
                      <option key={idx} value={purpose.toString()}>
                        {purpose}
                      </option>
                    );
                  })
                : null}
            </select>
          </div>

          {/* //!지역옵션 */}
          <div className="flex h-10">
            <div>지역</div>
            <select
              title="지역"
              className="mx-2 ring-2 ring-black w-24"
              onChange={(event) => {
                setRegion(event.currentTarget.value);
              }}
            >
              <option defaultChecked>전국</option>
              {regionlist
                ? regionlist.map((region, idx) => {
                    if (region.sidoNm !== undefined) {
                      return (
                        <option
                          key={idx}
                          className="font-bold"
                          value={region.sidoNm?.toString()}
                        >
                          {region.sidoNm}
                        </option>
                      );
                    }
                  })
                : null}
            </select>
          </div>

          {/* //!탐색범위 시작 */}
          <div className="flex h-10">
            <div>탐색연월</div>
            <select
              title="시작"
              className="mx-2 ring-2 ring-black "
              onChange={(event) => {
                setStart(event.currentTarget.value);
              }}
            >
              <option hidden>기간입력</option>
              {datelist.map((ele, idx) => {
                return <option key={idx}>{ele}</option>;
              })}
            </select>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="absolute  top-40 left-[600px]  flex flex-col w-[720px] h-[700px] items-center justify-center">
      {/* //!옵션 박스 */}
      <div className="flex flex-col border-4 h-[80px] w-[1024px] ">
        <div className=" justify-center flex">검색옵션</div>
        <div className="flex w-full justify-center">
          <div className="flex h-10">
            <div>검색방식</div>
            <select
              title="지역"
              className="mx-2 ring-2 ring-black"
              onChange={(event) => {
                setX(event.currentTarget.value);
                setPurpose("전 체 ");
                setRegion("전국");
                setStart("");
                setEnd("");
              }}
            >
              <option value={"월별"}>월별</option>
              <option value={"용도별"}>용도별</option>
              <option value={"지역별"}>지역별</option>
            </select>
          </div>
          {search()}
          <button className="bg-slate-400 rounded-md h-10" onClick={loadData}>
            검색하기
          </button>
        </div>
      </div>

      {/* //!그래프 */}
      <div id="graph" className="w-[1024px] border-2 h-[800px] invisible">
        {show()}
      </div>
    </div>
  );
}
