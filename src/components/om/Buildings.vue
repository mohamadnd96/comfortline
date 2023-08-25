<template>
  <div class="mx-lg-10">
    <div class="text-h4 pt-2 color btext">Buildings</div>
  </div>
  <v-tabs class="mx-lg-10 mt-5" fixed-tabs v-model="tab" bg-color="var(--lightcolor)">
    <v-tab :key="'owned'">Owned</v-tab>
    <v-tab :key="'managed'">Managed</v-tab>
  </v-tabs>
  <v-row class="mt-5 mx-lg-7">
    <v-col v-for="(building, key) in buildings" v-bind:key="key" colls="12" lg="3">
      <v-card variant="tonal" color="var(--maincolor)">
        <v-card-item>
          <div>
            <div class="row-s ae" style="font-weight: bold">
              <v-icon icon="mdi-domain" size="30"></v-icon>
              <div class="hs1"></div>
              <div style="font-size: 14px; font-weight: 700">
                {{ building.serialNumber }}
              </div>
            </div>
            <div class="text-h6 mb-1">{{ building.emailOwner }}</div>
            <div class="text-caption">
              {{ building.companyName }}
            </div>
            <div class="vs1"></div>
            <div class="text-caption">
              <span class="text-caption grey">long:</span>
              {{ building.long }}
              <span class="text-caption grey" style="margin-left: 5px">lat:</span>
              {{ building.lat }}
            </div>
          </div>
        </v-card-item>
        <v-card-actions class="justify-end">
          <v-btn v-if="this.tab == 0" v-on:click="goToPage(
              building.spacesID,
              building.serialNumber,
              'qrcodes'
            )
            " prepend-icon="mdi-qrcode-scan" color="var(--maincolor)">
          </v-btn>
          <v-btn v-if="this.tab == 0" v-on:click="goToPage(
              building.spacesID,
              building.serialNumber,
              'editbuilding'
            )
            " prepend-icon="mdi-pencil" color="var(--maincolor)">
            Edit
          </v-btn>
          <v-btn v-if="this.tab == 0" v-on:click="goToAdd(building.serialNumber)" prepend-icon=" mdi-plus"
            color="var(--yellowcolor)">
            Add manager
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      tab: null,
      email: "",
      password: "",
      rules: [(v) => !!v || "Required"],
      selectuid: "AA",
      uids: ["Building AZ", "AA", "BB"],
    };
  },
  computed: {
    buildings() {
      if (this.$store.state.omb) {
        if (this.tab == 0) {
          return this.$store.state.omb["owned"];
        } else {
          return this.$store.state.omb["managed"];
        }
      } else {
        return {};
      }
    },
  },
  methods: {
    goToAdd(man) {
      this.$router.push({ name: "addmanager", params: { id: man }, })
    },
    async goToPage(sid, id, page) {
      let spaces = this.buildings[id].spacesID
      let mystr = {}
      for (const key in spaces) {
        let space = spaces[key]
        let currentfloor = key.substring(0, 6)
        let spaceData = {
          spaceName: space.spaceName,
          squareMeters: space.squareMeters,
          workingStations: space.workingStations
        }
        if (page == 'qrcodes') {
          var QRCode = require('qrcode')
          await QRCode.toDataURL("www.comfortline.com/votes/" + key, {
            rendererOpts: {
              quality: 0.5// Set the image quality to 0.8 (80%)
            }
          }).then(url => {
            spaceData.spaceID = key
            spaceData.qrCode = url
          });
        }
        if (mystr[currentfloor] == null) {
          mystr[currentfloor] = {
            floorName: space.floorName ? space.floorName : "undefinedFloorName"
          }
          mystr[currentfloor].spaces = [spaceData]
        } else {
          mystr[currentfloor].spaces.push(spaceData)
        }
      }
      this.$store.state.buildingstructure = Object.values(mystr)
      this.$router.push({
        name: page,
        params: { id: id },
      });
    },
  },
  mounted() {
    this.$store.dispatch("gomb");
  },
  unmounted() { },
};
</script>


<style></style>