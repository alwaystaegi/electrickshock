import { Bar, Doughnut, Line } from "react-chartjs-2";

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
};

export function show(graph: string) {
  const labels = ["123", "456", "789"];
  if ("선형" === graph) {
    return (
      <Line
        datasetIdKey="id"
        data={{
          labels,
          datasets: [
            {
              label: "공급능력",
              data: [1, 2, 3, 4, 5, 6],
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
              label: "부하량",
              data: [1, 2, 3, 4, 5],
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        }}
      />
    );
  } else if ("막대형" === graph) {
    return (
      <Bar
        options={options}
        datasetIdKey="id"
        data={{
          labels,
          datasets: [
            {
              label: "공급능력",
              data: [1, 2, 3, 4, 5, 6],
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
              label: "부하량",
              data: [1, 2, 3, 4, 5],
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        }}
      />
    );
  } else {
    return (
      <Doughnut
        datasetIdKey="id"
        data={{
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [
            {
              label: "# of Votes",
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        }}
      />
    );
  }
}