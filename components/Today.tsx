import { DayStatis } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Scale,
} from "chart.js";
import { Chart, Line } from "react-chartjs-2";
interface LayoutProps {
  select?: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function Today({ select }: LayoutProps) {
  const [statistics, setStatistics] = useState<DayStatis[]>([]);
  const [maxSupply, setMaxSupply] = useState(0);
  const [maxNow, setMaxNow] = useState(0);
  const [labels, setLabels] = useState<String[]>([]);

  useEffect(() => {
    setLabels([]);
    setMaxSupply(0);
    fetch("/api/Elecdata/todayData", {
      method: "POST",
      body: select,
    })
      .then((res) => res.json())
      .then((json) => {
        setStatistics(json.result);
      });
    setLabels(() => {
      let str = ["00:00"];
      let hour = 0;
      let min = 0;
      while (str.length !== 96) {
        min += 15;
        if (min === 60) {
          min = 0;
          hour += 1;
        }
        str.push(
          `${hour.toString().padStart(2, "0")}:${min
            .toString()
            .padStart(2, "0")}`
        );
      }
      return str;
    });
    statistics.forEach((statis) => {
      if (maxSupply < statis.supplydemand) {
        setMaxSupply(statis.supplydemand);
      }
    });
  }, [select]);

  function show() {
    return (
      <Line
        options={{
          scales: {
            y: {
              min: 0,
              max: 100000,
            },
          },
        }}
        datasetIdKey="id"
        data={{
          labels,
          datasets: [
            {
              label: "공급능력",
              data: statistics.map((statis) => {
                return statis.supplydemand;
              }),
              // [
              //   ...statistics.map((statis) => {
              //     return statis.supplydemand;
              //   }),
              //   maxSupply + 10000,
              //   0,
              // ],
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
              label: "현재부하",
              data: statistics.map((statis) => {
                return statis.nowValue;
              }),
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        }}
      />
    );
  }
  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <div className="flex bg-red-200 w-[720px] h-[630px]">
        <div>{select}</div>
        {show()}
      </div>
    </div>
  );
}
