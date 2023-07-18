<template>
  <div class="mx-4">
    <div class="text-h4 pb-3 pt-2 color btext">Buildings</div>
    <v-btn
      height="80"
      stacked
      prepend-icon="mdi-table-large-plus"
      class="bgdark"
      @click="goToAdd"
      variant="tonal"
    >
      Add New Building
    </v-btn>
  </div>

  <v-row class="mt-10 mx-1">
    <v-col
      v-for="(building, key) in buildings"
      v-bind:key="key"
      colls="12"
      lg="3"
    >
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
              <span class="text-caption grey" style="margin-left: 5px"
                >lat:</span
              >
              {{ building.lat }}
            </div>
          </div>
        </v-card-item>
        <v-card-actions class="justify-end">
          <v-btn v-on:click="deleteBuilding(building.serialNumber)" prepend-icon="mdi-delete" color="var(--redcolor)">
            Delete
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
      email: "",
      password: "",
      rules: [(v) => !!v || "Required"],
      selectuid: "AA",
      uids: ["Building AZ", "AA", "BB"],
    };
  },
  computed: {
    buildings() {
      return this.$store.state.adminbuildings;
    },
  },
  methods: {
    goToAdd() {
      this.$router.push({ name: "addbuilding" });
    },
    deleteBuilding(code) {
      this.$store.dispatch("deleteBuilding", code);
    },
  },
  mounted() {
    this.$store.dispatch("getAdminBuildings");
  },
};
</script>


<style>
</style>