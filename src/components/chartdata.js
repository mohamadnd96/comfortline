export function getPieChart(type, label, data) {
  return {
    type: type,
    data: {
      labels: data.labels,
      datasets:
        type == ("pie")
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

export function getLineChart(data) {
  return {
    type: 'line',
    data: {
      labels: data.properties.labels["xAxis"],
      datasets: [
        {
          label: data.properties.labels["line"][0],
          data: data.data["a"],
          borderColor: data.properties.colors[0],
          fill: false,
          tension: 0
        },
        {
          label: data.properties.labels["line"][1],
          data: data.data["b"],
          borderColor: data.properties.colors[1],
          fill: false,
          tension: 0
        },
        {
          label: data.properties.labels["line"][2],
          data: data.data["c"],
          borderColor: data.properties.colors[2],
          fill: false,
          tension: 0
        },
        {
          label: data.properties.labels["line"][3],
          data: data.data["d"],
          borderColor: data.properties.colors[3],
          fill: false,
          tension: 0,
        }
      ]  
    },
    options: {
      
      responsive: true,
      aspectRatio: 4, 
      legend: {
          position: 'right',
      },
      scales: {
        yAxes: [{
          position: 'left',
          ticks: {
            min: 0,
            max: 2,
            callback: function(value) {
              if (value % 1 === 0) {
                switch(value) {
                  case 0:
                    return data.properties.labels["yAxis"][2]
                  case 1:
                    return data.properties.labels["yAxis"][1]
                  case 2:
                    return data.properties.labels["yAxis"][0]
                  default:
                    return "None"
                }
              }
            }
          }
        }]
      }
    }
  };
}