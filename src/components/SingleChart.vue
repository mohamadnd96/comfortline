<template>
    <v-col cols="12" lg="3" style="margin-right: -15px">

        <v-card min-height="260" variant="tonal" color="var(--maincolor)">
     
            <v-card-item>
                <div class="text-overline mb-1" style="white-space: nowrap">{{ title }}</div>
                <div v-if="notis ? this.$store.state.notificationsdata : this.$store.state.feedbackresult">
                    <div v-for="(key, index) in  q == 'v' ? labels : labels[q]" v-bind:key="index">
                        <div v-if="data.at(index) != 0" style="font-size: 13px; display: flex; align-items: center">
                            <div :style="'width: 10px; height: 10px; background-color:' +
                                colors.at(index)
                                "></div>
                            <div>
                                &nbsp; {{ key.toString().replaceAll("_", " ") }}
                            </div>
                            <div style="flex-grow: 1;"></div>
                            <div>
                                {{
                                    (
                                        (data.at(index) / total) *
                                        100
                                    ).toFixed(
                                        ((data.at(index) / total) * 100)
                                            .toString()
                                            .includes(".")
                                            ? 2
                                            : 0
                                    )
                                }}%
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="hide != true" class="moredetails">
                    <router-link style="text-decoration: none;"
                        :to="'/home/' + title.toString().replaceAll(' ', '').toLowerCase()">
                        <div class="color" style="font-size: 13px;">More details</div>
                    </router-link>
                </div>
            </v-card-item>
        </v-card>
    </v-col>
    <v-col cols="12" lg="3">
        <v-card min-height="260" variant="tonal" color="var(--maincolor)">
            <v-card-item>
                <div>
                    <div class="text-overline mb-1">{{ title }} chart</div>
                    <Vchart v-if="notis ? this.$store.state.notificationsdata : this.$store.state.feedbackresult"
                        :id="id" />
                </div>
            </v-card-item>
        </v-card>
    </v-col>
</template>


<script>
import Vchart from "./Chart.vue";
export default {
    components: { Vchart },
    props: ['data', 'labels','colors', 'id', 'title', 'switchview', 'hide', 'notis', 'q'],
    computed: {
        total() {
            return this.data.reduce((a, b) => a + b, 0);
        },
    },
    methods: {

    }
}
</script>



<style>
.moredetails {
    bottom: 8px;
    right: 8px;
    position: absolute;
    border: 1px solid var(--maincolor);
    padding-left: 4px;
    padding-right: 4px;
    border-radius: 4px;
}
</style>



