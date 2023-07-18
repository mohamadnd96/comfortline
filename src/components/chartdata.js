function getChart(type, label, data) {
  return {
    type: type,
    data: {
      labels: data.labels,
      datasets:
        type == "pie"
          ? [
              {
                label: label,
                data: data.data,
                backgroundColor: data.colors,
                borderWidth: 1,
              },
            ]
          : data.data,
    },
    options: {
      legend: {
        display: false,
      },
      responsive: true,
      lineTension: 1,
    },
  };
}
export default getChart;
