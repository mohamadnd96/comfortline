<template>
  <div>
    <canvas :id="id"></canvas>
    <!-- <canvas id="planet-chart"></canvas> -->
  </div>
</template>
  
<script>
// import Chart from "chart.js";
// import GetChart from "./chartdata";

export default {
  name: "Vchart",
  props: ["id"],
  //   data() {
  //     return {
  //       ChartData: GetChart(this.type, this.label, this.data),
  //     };
  //   },
  //   mounted() {
  //     // var ctx;
  //     // ctx = document.getElementById(this.id);
  //     // new Chart(ctx, this.ChartData);
  //   },
};
</script>
