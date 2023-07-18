<template>
  <div class="text-h5 pb-6 pt-2">Notifications</div>
  <v-row>
    <v-col cols="12" lg="2">
      <div class="text-center">
        <v-select variant="outlined" v-model="selectedBuildingf" :items="buildingsf" label="Building" item-title="name"
          item-value="nr" return-object></v-select>
      </div>
    </v-col>
    <v-col cols="12" lg="2">
      <div class="text-center">
        <v-select variant="outlined" v-model="selectedFloorf" :items="floorsf" label="Floor" item-title="name"
          item-value="nr" return-object></v-select>
      </div>
    </v-col>
    <v-col cols="12" lg="2">
      <div class="text-center">
        <v-select variant="outlined" v-model="selectedSpacef" :items="spacesf" label="Space" item-title="name"
          item-value="nr" return-object></v-select>
      </div>
    </v-col>
  </v-row>

  <v-row justify="start">
    <SingleChart :title="'Answers'" :id="'answers'" :properties="answerschartdata.properties"
      :data="answerschartdata.data" :total="rateschartdata.voted" :notis="true" :hide="true" />
    <SingleChart :title="'Answers Rates'" :id="'arates'" :properties="rateschartdata.properties"
      :data="[rateschartdata.voted, rateschartdata.notvoted]" :total="rateschartdata.total" :notis="true" :hide="true" />
  </v-row>

  <div class="text-h7 pb-6 pt-6">Notify about tomorrow location</div>
  <v-row>
    <v-col cols="12" lg="2">
      <div class="text-center">
        <v-select variant="outlined" v-model="selectedBuilding" :items="buildings" label="Building"></v-select>
      </div>
    </v-col>
    <v-col cols="12" lg="2">
      <v-card variant="outlined" color="var(--maincolor)">
        <div class="text-overline mx-3 mt-3" style="white-space: nowrap">Floors</div>
        <div class="floors-spaces">

          <v-checkbox v-for="(floor, index) in floors" v-bind:key="index" hide-details v-on:change="addremovefloor(floor)"
            :label="floor" :model-value="selectedFloors.includes(floor)"></v-checkbox>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" lg="2">
      <v-card variant="outlined" color="var(--maincolor)">
        <div class="text-overline mx-3 mt-3" style="white-space: nowrap">Spaces</div>
        <div class="floors-spaces">
          <v-checkbox v-for="(space, index) in spaces" v-bind:key="index" hide-details v-on:change="addremovespace(space)"
            :label="space" :model-value="selectedSpaces.includes(space)"></v-checkbox>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" lg="6">
      <v-row>
        <v-col cols="12">
          <v-card variant="tonal" height="220" color="var(--maincolor)">
            <div class="text-overline mx-3 mt-3" style="white-space: nowrap">Notification Message</div>
            <div :class="text1 == '' ? 't-2 px-3 red' : 't-2 px-3 black'">
              {{ text1 == "" ? 'Please select one or more floors/spaces' : text1 }}
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" style="text-align: end;">
          <v-btn variant="flat" v-on:click="notify1" class="mainbtn">&nbsp; NOTIFY &nbsp;</v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>


  <div class="text-h7 pb-6 pt-10">Notify for feedback & coming tomorrow</div>
  <v-row>
    <v-col cols="12" lg="2">
      <div class="text-center">
        <v-select variant="outlined" v-model="selectedBuilding2" :items="buildings2" label="Building"></v-select>
      </div>
    </v-col>
    <v-col cols="12" lg="2">
      <v-card variant="outlined" color="var(--maincolor)">
        <div class="text-overline mx-3 mt-3" style="white-space: nowrap">Floors</div>
        <div class="floors-spaces">
          <v-checkbox v-for="(floor, index) in floors2" v-bind:key="index" hide-details
            v-on:change="addremovefloor2(floor)" :label="floor"
            :model-value="selectedFloors2.includes(floor)"></v-checkbox>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" lg="2">
      <v-card variant="outlined" color="var(--maincolor)">
        <div class="text-overline mx-3 mt-3" style="white-space: nowrap">Spaces</div>
        <div class="floors-spaces">
          <v-checkbox v-for="(space, index) in spaces2" v-bind:key="index" hide-details
            v-on:change="addremovespace2(space)" :label="space"
            :model-value="selectedSpaces2.includes(space)"></v-checkbox>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" lg="6">
      <v-row>
        <v-col cols="12">

          <v-card variant="tonal" height="125" color="var(--maincolor)">
            <div class="text-overline mx-3 mt-3" style="white-space: nowrap">Notification Message</div>
            <div :class="text2.text == '' ? 't-2 px-3 red' : 't-2 px-3 black'">
              {{ text2.text == "" ? 'Please choose one topic at least' : text2.text }}
            </div>
          </v-card>
        </v-col>
      </v-row>
      <div class="my-3">
        <div class="t-4 red">NOTE: Selecting no spaces and no floors means the whole building is selected</div>
      </div>
      <v-row>
        <v-col cols="12" lg="6">

          <v-checkbox hide-details label="Invite to answer about coming tomorrow" v-model="invite1"
            color="var(--maincolor)"></v-checkbox>

        </v-col>
        <v-col cols="12" lg="6">

          <v-checkbox hide-details label="Invite to answer feedback" v-model="invite2"
            color="var(--maincolor)"></v-checkbox>

        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" style="text-align: end;">
          <v-btn v-on:click="notify2" variant="flat" class="mainbtn">&nbsp; NOTIFY &nbsp;</v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import SingleChart from "../SingleChart.vue";
import Chart from "chart.js";
import GetChart from "../chartdata";
export default {
  components: { SingleChart },
  props: [],
  data() {
    return {
      invite1: true,
      invite2: true,
      selectedBuildingf: { name: "", nr: 0 },
      selectedSpacef: { name: "All spaces", nr: 0 },
      selectedFloorf: { name: "All floors", nr: 0 },
      selectedBuilding: "",
      selectedSpaces: [],
      selectedFloors: [],
      selectedBuilding2: "",
      selectedSpaces2: [],
      selectedFloors2: [],
    }
  },
  computed: {
    rateschartdata() {
      if (this.$store.state.notificationsdata) {
        return this.$store.state.notificationsdata.voterates;
      } else {
        return {
          voted: 1,
          notvoted: 0,
          total: 1,
          properties: {
            colors: ["#375A64", "#dddddd"],
            labels: ["Answered", "Not answered"],
          }
        };
      }
    },
    answerschartdata() {
      if (this.$store.state.notificationsdata) {
        return this.$store.state.notificationsdata.answers;
      } else {
        return {
          data: [1, 1, 1],
          properties: {
            colors: [
              "#87bd45",
              "#eb5547",
              "#e9c131",

            ],
            labels: [
              "Coming tomorrow",
              "Not coming",
              "Maybe",
            ]
          }

        };
      }
    },

    buildingsf() {
      let buildings = []
      Object.values(this.$store.state.homefilters.buildings).forEach(building => {
        buildings.push(building.data)
      })
      return buildings;
    },
    floorsf() {
      if (this.$store.state.homefilters.buildings[this.selectedBuildingf.nr]) {
        return this.$store.state.homefilters.buildings[this.selectedBuildingf.nr].floors
      } else {
        return []
      }
    },

    spacesf() {
      if (this.$store.state.homefilters.buildings[this.selectedBuildingf.nr]) {

        return this.selectedFloorf.nr == 0 ? this.$store.state.homefilters.buildings[this.selectedBuildingf.nr].spaces : this.$store.state.homefilters.buildings[this.selectedBuildingf.nr].spaces.filter(space => space.nr.includes(this.selectedFloorf.nr))
      } else {
        return []
      }
    },

    text1() {
      let placestext = "Dear employees of building " + this.selectedBuilding + " tomorrow you will be working in";
      if (this.selectedSpaces.length == 0 && this.selectedFloors == 0) {
        placestext = ""
      } else if (this.selectedFloors.length != 0 && this.selectedSpaces.length == 0) {
        placestext += " floors " + this.selectedFloors.toString().replaceAll(",", ", ")
      } else if (this.selectedFloors.length == 0 && this.selectedSpaces.length != 0) {
        placestext += " spaces " + this.selectedSpaces.toString().replaceAll(",", ", ")
      } else {
        let wspaces = []
        this.selectedSpaces.forEach(space => {
          if (!this.selectedFloors.includes(space.toString().substring(0, 6))) {
            wspaces.push(space)
          }
        })
        if (wspaces.length == 0) {
          placestext += " floors " + this.selectedFloors.toString().replaceAll(",", ", ")
        } else {
          placestext += " floors " + this.selectedFloors.toString().replaceAll(",", ", ") + " and spaces " + wspaces.toString().replaceAll(",", ", ")
        }


      }
      return placestext
    },

    text2() {
      let placestext = "Dear employees of building " + this.selectedBuilding2;
      let invitetext = ""
      let wspaces = []
      let wfloors = []
      if (this.selectedSpaces2.length == 0 && this.selectedFloors2 == 0) {
        null
      } else if (this.selectedFloors2.length != 0 && this.selectedSpaces2.length == 0) {
        placestext += " especially employees of floors " + this.selectedFloors2.toString().replaceAll(",", ", ")
        wfloors = this.selectedFloors2
      } else if (this.selectedFloors2.length == 0 && this.selectedSpaces2.length != 0) {
        placestext += " especially users of spaces " + this.selectedSpaces2.toString().replaceAll(",", ", ")
        wspaces = this.selectedSpaces2
      } else {

        this.selectedSpaces2.forEach(space => {
          if (!this.selectedFloors2.includes(space.toString().substring(0, 6))) {
            wspaces.push(space)
          }
        })
        if (wspaces.length == 0) {
          placestext += " especially employees of floors " + this.selectedFloors2.toString().replaceAll(",", ", ")
        } else {
          placestext += " especially employees of floors " + this.selectedFloors2.toString().replaceAll(",", ", ") + " and users of spaces " + wspaces.toString().replaceAll(",", ", ")
        }
        wfloors = this.selectedFloors2
      }
      if (this.invite1 && this.invite2) {
        invitetext = " You are invited to give your feedback and answer if you are coming tomorrow"
      } else if (this.invite2) {
        invitetext = " You are invited to give your feedback"
      } else if (this.invite1) {
        invitetext = " You are invited answer if you are coming tomorrow"
      } else {
        placestext = ""
        invitetext = ""
      }
      return { spaces: wspaces, floors: wfloors, text: placestext + invitetext }
    },
    buildings() {
      return Object.keys(this.$store.state.notificationsEntries.buildings);
    },
    floors() {
      if (this.$store.state.notificationsEntries.filled && this.selectedBuilding != "") {
        return this.$store.state.notificationsEntries.buildings[this.selectedBuilding].floors;
      } else {
        return []
      }
    },
    spaces() {
      if (this.$store.state.notificationsEntries.filled && this.selectedBuilding != "") {
        return this.$store.state.notificationsEntries.buildings[this.selectedBuilding].spaces;
      } else {
        return []
      }
    },


    buildings2() {
      return Object.keys(this.$store.state.notificationsEntries.buildings);
    },
    floors2() {
      if (this.$store.state.notificationsEntries.filled && this.selectedBuilding2 != "") {
        return this.$store.state.notificationsEntries.buildings[this.selectedBuilding2].floors;
      } else {
        return []
      }

    },
    spaces2() {

      if (this.$store.state.notificationsEntries.filled && this.selectedBuilding2 != "") {
        return this.$store.state.notificationsEntries.buildings[this.selectedBuilding2].spaces;
      } else {
        return []
      }
    }
  },

  watch: {
    selectedBuilding: function () {
      this.clear()
    },
    selectedBuilding2: function () {
      this.clear2()
    },
    selectedFloorf: function () {
      this.selectedSpacef = { name: "All spaces", nr: 0 }
    },

    selectedBuildingf: function () {
      this.selectedSpacef = { name: "All spaces", nr: 0 }
      this.selectedFloorf = { name: "All floors", nr: 0 }
      this.updateChart()
    },
    selectedSpacef: function () {
      this.updateChart()
      // this.$store.dispatch("getnotificationsData", {
      //   building: this.selectedBuildingf,
      //   space: this.selectedSpacef,
      // });
    }
  },
  methods: {
    notify1() {
      this.$store.dispatch('notify', { targets: [this.selectedBuilding], title: "Comfortline", body: this.text1 })
    },
    notify2() {
      let targets = this.text2.floors.concat(this.text2.spaces)
      if (targets.length == 0) {
        targets = [this.selectedBuilding2]
      }
      this.$store.dispatch('notify', { targets: targets, title: "Comfortline", body: this.text2.text })
    },
    async updateChart() {
      await this.$store.dispatch("getnotificationsData", {
        building: this.selectedBuildingf.nr,
        space: this.selectedSpacef.nr,
      });
      new Chart(
        document.getElementById('answers'),
        GetChart("pie", "chart", {
          data: this.answerschartdata.data,
          colors: this.answerschartdata.properties.colors,
          labels: this.answerschartdata.properties.labels,
        })
      );

      new Chart(
        document.getElementById('arates'),
        GetChart("pie", "chart", {
          data: [this.rateschartdata.voted, this.rateschartdata.notvoted],
          colors: this.rateschartdata.properties.colors,
          labels: this.rateschartdata.properties.labels,
        })
      );


    },
    clear() {
      this.selectedSpaces = []
      this.selectedFloors = []
    },
    clear2() {
      this.selectedSpaces2 = []
      this.selectedFloors2 = []
    },

    addremovefloor(floor) {
      if (this.selectedFloors.includes(floor)) {
        // this.selectedSpaces = this.selectedSpaces.filter(item => !item.includes(floor))
        this.selectedFloors = this.selectedFloors.filter(item => item != floor)
      } else {
        this.selectedFloors.push(floor)
      }
    },
    addremovespace(space) {
      if (this.selectedSpaces.includes(space)) {

        this.selectedSpaces = this.selectedSpaces.filter(item => item != space)
      } else {
        this.selectedSpaces.push(space)
      }
    },
    addremovefloor2(floor) {
      if (this.selectedFloors2.includes(floor)) {
        // this.selectedSpaces2 = this.selectedSpaces2.filter(item => !item.includes(floor))
        this.selectedFloors2 = this.selectedFloors2.filter(item => item != floor)
      } else {
        this.selectedFloors2.push(floor)
      }
    },
    addremovespace2(space) {
      if (this.selectedSpaces2.includes(space)) {
        this.selectedSpaces2 = this.selectedSpaces2.filter(item => item != space)
      } else {
        this.selectedSpaces2.push(space)
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('getnotificationsEntries')
    await this.$store.dispatch("getHomeFilters");
    this.selectedBuildingf = Object.values(
      this.$store.state.homefilters.buildings
    ).at(0).data;

    this.selectedBuilding = Object.keys(
      this.$store.state.notificationsEntries.buildings
    ).at(0);
    this.selectedBuilding2 = Object.keys(
      this.$store.state.notificationsEntries.buildings
    ).at(0);




  },
  // unmounted() { this.$store.commit('clearnotificationsEntries') },
}
</script>
<style>
.floors-spaces {
  overflow-y: auto;
  height: 230px;
}

.floors-spaces .v-input__control {
  background-color: transparent;
}
</style>



