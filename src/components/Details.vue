<template>
    <div class="mb-3">
        <v-btn variant="tonal" v-on:click="this.$router.push('/home')" prepend-icon="mdi-arrow-left-circle"
            color="var(--maincolor)" class="mt-3 mb-3">
            back
        </v-btn>
    </div>
    <v-row v-if="this.$store.state.feedbackresult">
        <SingleChart :title="path[1] + 'From All users'" :id="'chart1'" :q="'v'" :labels="chartdata.properties.labels[path[0]]" :colors="chartdata.properties.colors"
            :data="chartdata.data[path[0]]"  :hide="true" />
        <SingleChart :title="'Voting rates'" :id="'rates'" :q="'v'" :labels="chart2data.properties.labels" :colors="chart2data.properties.colors"
            :data="chart2data[path[0]].data"  :hide="true" />
    </v-row>
    <v-row v-if="this.$store.state.feedbackresult">
        <SingleChart :title="path[1] +'From voted users'" :id="'chart11'" :q="'v'" :labels="chartdata.properties.labels[path[0]].filter((item, index) => index !== 9)" :colors="chartdata.properties.colors"
            :data="chartdata.data[path[0]].filter((item, index) => index !== 9)" :hide="true" />

    </v-row>
    <v-row v-if="this.$store.state.feedbackresult" justify="start">
        <v-col cols="12" lg="7">
            <v-card min-height="260" variant="tonal" color="var(--maincolor)">
                <v-card-item>
                    <div>
                        <div class="text-overline mb-1">Voted users</div>
                        <div>
                            <canvas height="100" id="detailschart"></canvas>
                            <!-- <canvas id="planet-chart"></canvas> -->
                        </div>

                        <!-- <Vchart  id="chart3" /> -->
                    </div>
                </v-card-item>
            </v-card>
        </v-col>


    </v-row>
</template>


<script>
// import Vchart from "./Chart.vue";
import SingleChart from "./SingleChart.vue";
import Chart from "chart.js";
import {getPieChart} from "./chartdata";
export default {
    components: { SingleChart },
    props: ['chartdata', 'chart2data', 'texts'],
    data() {
        return {
            load: false,
            title: '',

        }
    },
    computed: {

        path() {
            if (this.$route.params.question.includes('air')) {
                return ['a', 'Air quality ']
            } else if (this.$route.params.question.includes('thermal')) {
                return ['b', 'Thermal comfor']
            } else if (this.$route.params.question.includes('visual')) {
                return ['c', 'Visual Comfort']
            } else {
                return ['d', 'Acoustic Comfort']
            }
        },
    },
    methods: {
        setChart() {
            console.log(this.path)
            let path = ''
            if (this.$route.params.question.includes('air')) {
                path = 'a'
                this.path = 'a'
                this.title = 'Air quality answers details'
            } else if (this.$route.params.question.includes('thermal')) {
                this.path = 'b'
                path = 'b'
                this.title = 'Thermal Comfort answers details'
            } else if (this.$route.params.question.includes('visual')) {
                this.path = 'c'
                path = 'c'
                this.title = 'Visual Comfort answers details'
            } else {
                this.path = 'd'
                path = 'd'
                this.title = 'Acoustic Comfort answers details'
            }
            new Chart(
                document.getElementById('chart1'),
                getPieChart("pie", "chart", {
                    labels: this.chartdata.properties.labels[path],
                    colors: this.chartdata.properties.colors,
                    data: this.chartdata.data[path]
                })
            );
            new Chart(
                document.getElementById('chart11'),
                getPieChart("pie", "chart", {
                    labels: this.chartdata.properties.labels[path],
                    colors: this.chartdata.properties.colors,
                    data: this.chartdata.data[path].filter((item, index) => index !== 9)
                })
            );
            new Chart(
                document.getElementById('detailschart'),
                getPieChart("bar", "chart", {
                    labels: this.$store.state.feedbackresult.labels,
                    data: this.$store.state.feedbackresult.details[path]
                })
            );
            new Chart(
                document.getElementById('rates'),
                getPieChart("pie", "chart", {
                    labels: this.chart2data.properties.labels,
                    colors: this.chart2data.properties.colors,
                    data: this.chart2data[path].data
                })
            );


        }
    },
    mounted() {
        this.setChart()
    }




}

</script>