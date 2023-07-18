<template>
  <div v-if="this.$store.state.user.hasbuilding || this.$store.state.user.admin">
    <div v-if="buildings.length">
      <div class="text-h5 pb-6 pt-2">{{ pagetitle }}</div>
      <v-row>
        <v-col cols="12" lg="2">
          <div class="text-center">
            <v-select variant="outlined" v-model="selectedBuilding" :items="buildings" label="Building" item-title="name"
              item-value="nr" return-object></v-select>
          </div>
        </v-col>
        <v-col cols="12" lg="2">
          <div class="text-center">
            <v-select variant="outlined" v-model="selectedfloor" :items="floors" label="Floor" item-title="name"
              item-value="nr" return-object></v-select>
          </div>
        </v-col>
        <v-col cols="12" lg="2">
          <div class="text-center">
            <v-select variant="outlined" v-model="selectedSpace" :items="spaces" label="Space" item-title="name"
              item-value="nr" return-object></v-select>
          </div>
        </v-col>
        <v-col cols="12" lg="4" style="max-width: 500px">
          <div class="datepicker">
            <div class="formfield">
              <div class="d-col" style="width: 100%">
                <label>Date range</label>
                <div class="row-sp">
                  <div class="row-s">
                    <span>From</span>
                    <div class="hs1"></div>
                    <input type="date" v-model="dateinterval[0]" v-on:change="settimestamps(true)"
                      :max="dateinterval[1]" />
                  </div>
                  <div class="row-s">
                    <span>To</span>
                    <div class="hs1"></div>
                    <input type="date" v-model="dateinterval[1]" v-on:change="settimestamps(true)" :max="today" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <div v-if="ishome">
        <v-row justify="start">
          <SingleChart :hide="true" :title="'Voting Rates'" :id="'rates'" :q="'v'" :labels="chart2data.properties.labels"
            :colors="chart2data.properties.colors" :data="chart2data.all.data" :total="chart2data.total" />
        </v-row>
        <v-row justify="start">
          <SingleChart :title="'Air Quality'" :id="'chart1'" :q="'v'" :labels="chartdata.properties.labels.a.filter((item, index) => index !== 9)"
            :colors="chartdata.properties.colors" :data="chartdata.data.a.filter((item, index) => index !== 9)"
            :total="chartdata.totals.a" />
          <SingleChart :title="'Thermal Comfort'" :id="'chart2'" :q="'v'" :labels="chartdata.properties.labels.b.filter((item, index) => index !== 9)"
            :colors="chartdata.properties.colors" :data="chartdata.data.b.filter((item, index) => index !== 9)"
            :total="chartdata.totals.b" />
        </v-row>
        <v-row justify="start">
          <SingleChart :title="'Visual Comfort'" :id="'chart3'" :q="'v'" :labels="chartdata.properties.labels.c.filter((item, index) => index !== 9)"
            :colors="chartdata.properties.colors" :data="chartdata.data.c.filter((item, index) => index !== 9)"
            :total="chartdata.totals.c" />
          <SingleChart :title="'Acoustic Comfort'" :id="'chart4'" :q="'v'" :labels="chartdata.properties.labels.d.filter((item, index) => index !== 9)"
            :colors="chartdata.properties.colors" :data="chartdata.data.d.filter((item, index) => index !== 9)"
            :total="chartdata.totals.d" />
        </v-row>
      </div>
      <div v-else>
        <Details :chartdata="chartdata" :chart2data="chart2data" />
      </div>
    </div>
  </div>
  <div v-else>You Have no buildings!</div>
</template>

<script>
// import Vchart from "./Chart.vue";
import SingleChart from "./SingleChart.vue";
import Chart from "chart.js";
import GetChart from "./chartdata";
import Details from "./Details.vue";
export default {
  name: "HelloWorld",


  components: { SingleChart, Details },

  computed: {
    ishome() {
      return this.$route.params.question == '' || typeof this.$route.params.question == "undefined"
    },
    pagetitle() {

      if (typeof this.$route.params.question != "undefined") {
        if (this.$route.params.question.includes('air')) {
          return 'Air quality answers details'
        } else if (this.$route.params.question.includes('thermal')) {
          return 'Thermal Comfort answers details'
        } else if (this.$route.params.question.includes('visual')) {
          return 'Visual Comfort answers details'
        } else if (this.$route.params.question.includes('acoustic')) {
          return 'Acoustic Comfort answers details'
        } else {
          return 'Home'
        }
      } else {
        return 'Home'
      }
    },
    today() {
      const today = new Date();
      return today.toISOString().split("T")[0];
    },
    buildings() {
      let buildings = []
      Object.values(this.$store.state.homefilters.buildings).forEach(building => {
        buildings.push(building.data)
      })
      return buildings;
    },
    floors() {
      if (this.$store.state.homefilters.buildings[this.selectedBuilding.nr]) {
        return this.$store.state.homefilters.buildings[this.selectedBuilding.nr].floors
      } else {
        return []
      }
    },

    spaces() {
      if (this.$store.state.homefilters.buildings[this.selectedBuilding.nr]) {

        return this.selectedfloor.nr == 0 ? this.$store.state.homefilters.buildings[this.selectedBuilding.nr].spaces : this.$store.state.homefilters.buildings[this.selectedBuilding.nr].spaces.filter(space => space.nr.includes(this.selectedfloor.nr))
      } else {
        return []
      }
    },

    // spaces() {
    //   return this.$store.state.homefilters.buildings[this.selectedBuilding] ? this.$store.state.homefilters.buildings[this.selectedBuilding].spaces : [];
    // },

    chartdata() {
      if (this.$store.state.feedbackresult) {
        return this.$store.state.feedbackresult.data1;
      } else {
        return this.ichartdata;
      }
    },
    // chartdata2() {
    //   if (this.$store.state.feedbackresult) {
    //     return this.$store.state.feedbackresult.data1;
    //   } else {
    //     return this.ichartdata;
    //   }
    // },
    chart2data() {
      if (this.$store.state.feedbackresult) {

        return this.$store.state.feedbackresult.voterates;
      } else {
        return {
          all: {
            data: [40, 55],
          },
          total: 95,
          properties: {
            colors: ["#375A64", "#dddddd"],
            labels: ["Voted", "Not voted"],
          }

        };
      }
    },
    chart3data() {
      if (this.$store.state.feedbackresult) {
        return this.$store.state.feedbackresult.data3;
      } else {
        return {
          labels: ["data1", "data2", "data3", "data4"],
          data: [
            {
              label: "Sad A2",
              data: [5, 8, 16, 20],
              backgroundColor: "#86F46A",
            },
            {
              label: "Sad A3",
              data: [3, 7, 14, 22],
              backgroundColor: "#f46a9b",
            },
          ],
        };
      }
    },
  },

  updated() {
    if ((this.$route.params.question == '' || typeof this.$route.params.question == "undefined") && this.$store.state.feedbackresult) {
      this.updateChart()
    }
  },
  async mounted() {
    // console.log(this.$route.params)
    // alert("mount");
    if (this.$store.state.user.hasbuilding || this.$store.state.user.admin) {
      await this.$store.dispatch("getHomeFilters");
      this.dateinterval = [this.today, this.today];
      this.settimestamps(false);
      this.selectedBuilding = Object.values(
        this.$store.state.homefilters.buildings
      ).at(0).data;
      await this.$store.dispatch("getHomeData", {
        building: this.selectedBuilding.nr,
        space: this.selectedSpace.nr,
        interval: this.datesarray,
        rcase: this.rcase
      });
    }

  },
  data: () => ({
    ichartdata: {
      properties: {
        colors: [
          "#87bd45",
          "#a5cf33",
          "#becf33",
          "#ede05b",
          "#e9c131",
          "#efa61f",
          "#ef9b1f",
          "#f46a9b",
          "#eb5547"
        ],
        labels: {
          "a": [
            "Happy",
            "Neutral A0",
            "Neutral A1",
            "Neutral A2",
            "Neutral A3",
            "Sad A0",
            "Sad A1",
            "Sad A2",
            "Sad A3"
          ],
          "b": [
            "Happy",
            "Neutral A0",
            "Neutral A1",
            "Neutral A2",
            "Neutral A3",
            "Sad A0",
            "Sad A1",
            "Sad A2",
            "Sad A3"
          ],
          "c": [
            "Happy",
            "Neutral A0",
            "Neutral A1",
            "Neutral A2",
            "Neutral A3",
            "Sad A0",
            "Sad A1",
            "Sad A2",
            "Sad A3"
          ],
          "d": [
            "Happy",
            "Neutral A0",
            "Neutral A1",
            "Neutral A2",
            "Neutral A3",
            "Sad A0",
            "Sad A1",
            "Sad A2",
            "Sad A3"
          ]
        }

      },
      data: {
        "a": [0, 0, 0, 0, 0, 0, 0, 0, 0],
        "b": [0, 3, 0, 0, 0, 1, 4, 5, 0],
        "c": [0, 0, 4, 0, 1, 0, 0, 0, 0],
        "d": [0, 0, 0, 5, 0, 0, 0, 0, 0],
      },
      totals: {
        "a": 0,
        "b": 0,
        "c": 0,
        "d": 0,
      }
    },
    selectedBuilding: { name: "", nr: 0 },
    selectedfloor: { name: "All floors", nr: 0 },
    selectedSpace: { name: "All spaces", nr: 0 },
    dateinterval: [],
    datesarray: [],
    rcase: 1,
    title: 'Home',
    routed: false,
    location: "end",
  }),
  watch: {
    selectedBuilding: function () {
      this.settimestamps(true)
    },
    selectedfloor: function () {
      this.selectedSpace = { name: "All spaces", nr: 0 }
    },
    selectedSpace: function () {
      this.settimestamps(true)

    },
  },
  methods: {
    updateChart() {
      if (this.$route.params.question == '' || typeof this.$route.params.question == "undefined") {
        let cdata = {
          "a": "chart1",
          "b": "chart2",
          "c": "chart3",
          "d": "chart4"
        }

        for (const key in cdata) {
          new Chart(
            document.getElementById(cdata[key]),
            GetChart("pie", "chart", {
              labels: this.chartdata.properties.labels[key].filter((item, index) => index !== 9),
              colors: this.chartdata.properties.colors,
              data: this.chartdata.data[key].filter((item, index) => index !== 9)
            })
          );
        }
        new Chart(
          document.getElementById('rates'),
          GetChart("pie", "chart", {
            labels: this.chart2data.properties.labels,
            colors: this.chart2data.properties.colors,
            data: this.chart2data.all.data
          })
        );

      } else {
        let path = ''
        if (this.$route.params.question.includes('air')) {
          path = 'a'
          this.title = 'Air quality answers details'
        } else if (this.$route.params.question.includes('thermal')) {
          path = 'b'
          this.title = 'Thermal Comfort answers details'
        } else if (this.$route.params.question.includes('visual')) {
          path = 'c'
          this.title = 'Visual Comfort answers details'
        } else {
          path = 'd'
          this.title = 'Acoustic Comfort answers details'
        }

        new Chart(
          document.getElementById('chart1'),

          GetChart("pie", "chart", {
            labels: this.chartdata.properties.labels[path],
            colors: this.chartdata.properties.colors,
            data: this.chartdata.data[path]
          })
        );
        new Chart(
          document.getElementById('chart11'),
          GetChart("pie", "chart", {
            labels: this.chartdata.properties.labels[path],
            colors: this.chartdata.properties.colors,
            data: this.chartdata.data[path].filter((item, index) => index !== 9)
          })
        );
        new Chart(
          document.getElementById('rates'),
          GetChart("pie", "chart", {
            labels: this.chart2data.properties.labels,
            colors: this.chart2data.properties.colors,
            data: this.chart2data[path].data
          })
        );
        new Chart(
          document.getElementById('detailschart'),
          GetChart("bar", "chart", {
            labels: this.$store.state.feedbackresult.labels,
            data: this.$store.state.feedbackresult.details[path]
          })
        );

      }
    },
    archiveAllData() {
      this.$store.dispatch("archiveAllData");
    },
    async settimestamps(reload) {
      if (this.dateinterval[1] < this.dateinterval[0]) {
        this.dateinterval[0] = this.dateinterval[1];
      }
      let timestamps = [];
      this.dateinterval.forEach((myDate) => {
        myDate = myDate.split("-");
        var newDate = Date.UTC(myDate[0], myDate[1] - 1, myDate[2]);
        timestamps.push(newDate);
      });
      if (timestamps[1] - timestamps[0] != 86400000) {
        let start = timestamps[0];
        let end = timestamps[1];
        timestamps = [];
        for (let index = start; index <= end; index += 86400000) {
          timestamps.push(index);
        }
      }
      this.datesarray = timestamps;
      if (new Date().toISOString().split("T")[0] == this.dateinterval[0] && this.datesarray.length == 1) {
        this.rcase = 1
      } else if (new Date().toISOString().split("T")[0] == this.dateinterval[1] && this.datesarray.length > 1) {
        this.rcase = 2
      } else {
        this.rcase = 3
      }
      if (reload) {
        await this.$store.dispatch("getHomeData", {
          building: this.selectedBuilding.nr,
          space: this.selectedSpace.nr,
          interval: this.datesarray,
          rcase: this.rcase
        });
        if (this.$store.state.feedbackresult) {

          this.updateChart();
        }
      }
    },
  },

  unmounted() {
    this.$store.commit('clearhomefilters');
    this.$store.commit('clearfeedbackresult')
  }
};
</script>


<style>
.datepicker {
  display: flex;
  box-sizing: border-box;
  font-family: sans-serif;
}

.d-col {
  display: flex;
  flex-direction: column;
}

.datepicker form {
  display: inline-flex;
  flex-direction: column;
}

.area {
  flex-grow: 1;
}

.datepicker .formfield {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  height: 56px;

  border-radius: 4px;
  /* width: 320px; */
  background-color: var(--lightcolor);
  border: 1px solid var(--bordercolor);
  padding: 4px 12px;
}

.datepicker label {
  color: var(--maincolor);
  font-size: 12px;
}

.datepicker span {
  color: var(--maincolor);
  font-size: 15px;
}

.datepicker input {
  color: var(--maincolor);
  font-size: 15px;
  border: none;
  font-weight: bold;
}

.datepicker input:focus {
  outline: 1px solid var(--maincolor);
  border-radius: 4px;
}

/* .datepicker input{
  background: none;
  border: none;
  outline: none;
  font-size: 1rem;
  accent-color: red;
} */
</style>