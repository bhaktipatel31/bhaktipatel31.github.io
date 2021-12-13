let countResponses = 0;
const labels = [];
//    console.log("labels");
//    console.log(labels);

let superSector = {
  "00": "Total nonfarm",
  "05": "Total private",
  "06": "Goods-producing",
  "07": "Service-providing",
  "08": "Private service-providing",
  "10": "Mining and logging",
  "20": "Construction",
  "30": "Manufacturing",
  "31": "Durable Goods",
  "32": "Nondurable Goods",
  "40": "Trade, transportation, and utilities",
  "41": "Wholesale trade",
  "42": "Retail trade",
  "43": "Transportation and warehousing",
  "44": "Utilities",
  "50": "Information",
  "55": "Financial activities",
  "60": "Professional and business services",
  "65": "Education and health services",
  "70": "Leisure and hospitality",
  "80": "Other services",
  "90": "Government"
};

// These are colors from chart.js utils
const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)',
  pink: 'rgb(255,182,193)',
  black: 'rgb(0, 0, 0)',
  aqua: 'rgb(0,255,255)',
  crimson: 'rgb(220,20,60)',
  khaki: 'rgb(189,183,107)',
  yellowgreen: 'rgb(154,205,50)',
  lime: 'rgb(0,255,0)',
  aquamarine: 'rgb(127,255,212)',
  cornflowerblue: 'rgb(100,149,237)',
  plum: 'rgb(221,160,221)',
  chocolate: 'rgb(210,105,30)',
  rosybrown: 'rgb(188,143,143)',
  orchid: 'rgb(186,85,211)',
  violetred: 'rgb(219,112,147)',
  coral: 'rgb(240, 128, 128)',
  neonyellow: 'rgb(223, 255, 0)'
};
//    console.dir(CHART_COLORS);

//add the same colors here as above and add 0.5 at the end
let CHART_COLORS_array = Object.keys(CHART_COLORS);
const CHART_COLORS_50_Percent = {
  red: 'rgba(255, 99, 132, 0.5)',
  orange: 'rgba(255, 159, 64, 0.5)',
  yellow: 'rgba(255, 205, 86, 0.5)',
  green: 'rgba(75, 192, 192, 0.5)',
  blue: 'rgba(54, 162, 235, 0.5)',
  purple: 'rgba(153, 102, 255, 0.5)',
  grey: 'rgba(201, 203, 207, 0.5)',
  pink: 'rgb(255,182,193, 0.5)',
  black: 'rgb(0, 0, 0, 0.5)',
  aqua: 'rgb(0,255,255, 0.5)',
  crimson: 'rgb(220,20,60, 0.5)',
  khaki: 'rgb(189,183,107, 0.5)',
  yellowgreen: 'rgb(154,205,50, 0.5)',
  lime: 'rgb(0,255,0, 0.5)',
  aquamarine: 'rgb(127,255,212, 0.5)',
  cornflowerblue: 'rgb(100,149,237, 0.5)',
  plum: 'rgb(221,160,221, 0.5)',
  chocolate: 'rgb(210,105,30, 0.5)',
  rosybrown: 'rgb(188,143,143, 0.5)',
  orchid: 'rgb(186,85,211, 0.5)',
  violetred: 'rgb(219,112,147, 0.5)',
  coral: 'rgb(240, 128, 128, 0.5)',
  neonyellow: 'rgb(223, 255, 0, 0.5)'
};
//    console.log(CHART_COLORS_50_Percent);
//    end utils

const data = {
  labels: labels,
  datasets: []
};
//  console.dir(data);

const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Number of Employers in Thousands'
      }
    }
  }
};
//    console.log(config);
function drawChart() {
  const myChart = new Chart(
    document.getElementById('myChart'),
    config);
  //    console.dir(myChart);
  //    console.log("Ending");
}
function responseReceivedHandler() {
  if (this.status == 200) {
    console.log(this.response);
    let datasetElement = {
      label: 'Sample Label',
      data: [],
      borderColor: CHART_COLORS[CHART_COLORS_array[countResponses]],
      backgroundColor: CHART_COLORS_50_Percent[CHART_COLORS_array[countResponses]],
      hidden: true
    }
    console.log("here");
    console.log(this.response.Results);
    let superSectorID = this.response.Results.series[0].seriesID;
    datasetElement.label = superSector[superSectorID.substring(3, 5)];
    let dataArray = this.response.Results.series[0].data;
    for (let i = dataArray.length - 1; i >= 0; i--) {
      if (countResponses == 0) {
        labels.push(dataArray[i].periodName + " /" + dataArray[i].year);
      }
      datasetElement.data.push(dataArray[i].value);
    }
    countResponses++;
    data.datasets.push(datasetElement);
    if (countResponses == Object.keys(superSector).length) {
      drawChart();
    }

    console.log(this.response);
  } else {
    console.log("error");
  }
}

let SuperSectorKeys = Object.keys(superSector); // SuperSectorKeys is an array of all 2 digit codes for superSectors
// need a loop to send one request for each superSector code
for (let i = 0; i < SuperSectorKeys.length; i++) {
  let xhr = new XMLHttpRequest();
  xhr.responseType = "json"
  xhr.addEventListener("load", responseReceivedHandler);
  // construct the right query string by adding https through ceu on one string + the SuperSectorKey + everything after 65 to the end. 
  let startquery = "https://api.bls.gov/publicAPI/v2/timeseries/data/CEU";
  let endquery = "00000001?registrationkey=fd42e7d4b1014581bbca31ca538221db";
  xhr.open("GET", startquery + SuperSectorKeys[i] + endquery);
  xhr.send();
}
