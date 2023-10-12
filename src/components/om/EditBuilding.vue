<template>
  <v-form ref="form" @submit.prevent="validate" autocomplete class="editbuilding mx-lg-10">
    <div class="text-h4 pb-4 mt-5 color btext">
      Edit {{ this.$route.params.id }} Building
    </div>
    <div class="buildings mt-2" id="editbuildings">
      <div v-for="(floor, index) in structure.formula" v-bind:key="index" class="mb-5">
        <v-text-field class="floor" variant="outlined" color="var(--maincolor)" :rules="rules"
          v-model="structure.formula[index].floorName" placeholder="Floor Name" append-inner-icon="mdi-delete"
          @click:append-inner="removeFloor(index)" @click:append="expandCollapse(index)" :append-icon="expanded[index] == true ? 'mdi-chevron-down' : 'mdi-chevron-left'
            " required></v-text-field>
        <!-- <div class="divider"></div> -->
        <v-row class="mt-3 mr-7 ml-2" v-if="expanded[index] == true">
          <v-col class="newsection" cols="12" lg="3" v-for="(space, index1) in floor.spaces" v-bind:key="index1"
            :id="index + 'f' + index1">
            <v-card variant="outlined" color="var(--maincolor)">
              <div class="b-top">
                <div> {{ structure.formula[index].spaces[index1].spaceName }}</div> <v-icon
                  v-on:click="removeSection(index, index1)" icon="mdi-delete"></v-icon>
              </div>
              <div class="space" style="
                                                                padding-left: 20px;
                                                                padding-right: 20px;
                                                                padding-top: 15px;
                                                              ">
                <v-text-field variant="outlined" color="var(--maincolor)" :rules="rules"
                  v-model="structure.formula[index].spaces[index1].spaceName" placeholder="Section Name"
                  required></v-text-field>
                <v-text-field type="number" variant="outlined" color="var(--maincolor)" :rules="rules"
                  v-model="structure.formula[index].spaces[index1].squareMeters" placeholder="Square Meters"
                  required></v-text-field>
                <v-text-field type="number" variant="outlined" color="var(--maincolor)" :rules="rules" v-model="structure.formula[index].spaces[index1].workingStations
                  " placeholder="Working Stations" required></v-text-field>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" lg="3">
            <v-btn v-on:click="addSection(index)" variant="tonal" color="var(--maincolor)" stacked
              prepend-icon="mdi-plus">Add section</v-btn>
          </v-col>
        </v-row>
      </div>
      <v-btn v-on:click="addFloor" variant="tonal" color="var(--maincolor)" prepend-icon="mdi-plus" class="mt-5">Add
        Floor</v-btn>
    </div>

    <div class="row-e">
      <div style="width: 200px;">
        <v-btn variant="tonal" class="mt-10 mb-10 mainbtn" block type="submit">
          Save
        </v-btn>
      </div>
    </div>

  </v-form>
</template>

<script>
export default {
  computed: {
  },
  data() {
    return {
      expanded: [],
      structure: {
        buildingID: this.$route.params.id,
        formula: [
        ],
      },
      valid: false,

      rules: [(v) => !!v || "Required"],
    };
  },

  methods: {
    expandCollapse(index) {
      this.expanded[index] = !this.expanded[index];
    },
    addFloor() {
      this.structure.formula.push({
        floorName: "",
        spaces: [],
      });
      this.expanded.push(true);
    },

    addSection(index) {
      this.structure.formula[index].spaces.push({
        spaceName: "",
        squareMeters: "",
        workingStations: "",
      });
    },
    removeSection(index, index1) {
      if (this.structure.formula[index].spaces.length == 1) {
        this.structure.formula[index].spaces = []
      } else {
        if (index1 == 0) {
          this.structure.formula[index].spaces.shift()
        } else {
          this.structure.formula[index].spaces.splice(index1, index1)
        }
      }

    },

    removeFloor(index) {
      if (this.structure.formula.length == 1) {
        this.structure.formula = []
        this.expanded = []
      } else {
        if (index == 0) {
          this.structure.formula.shift()
          this.expanded.shift()
        } else {
          this.structure.formula.splice(index, index)
          this.expanded.splice(index, index)
        }
      }

    },
    async validate() {

      const { valid } = await this.$refs.form.validate();
      if (valid) this.editBuilding();
    },

    editBuilding() {
     
     this.$store.dispatch("editbuilding", this.structure);
    },
  },

  async mounted() {
    this.structure.formula = this.$store.state.buildingstructure
    this.structure.formula.forEach((element) => {
      this.expanded.push(true);
    });
    setTimeout(() => {
      document.getElementById('editbuildings').addEventListener('DOMNodeInserted', function (e) {
        if (typeof (e.target.className) != "undefined") {
          if (e.target.className.includes('newsection')) {
            var el =
              document.getElementById(e.target.id).getElementsByTagName('input')
            el[1].onkeydown = function (e) {
              if (e.key == '-' || e.key == 'e' || e.key == 'E') {
                return false;
              }
            }
            el[2].onkeydown = function (e) {
              if (e.key == '-' || e.key == 'e' || e.key == 'E') {
                return false;
              }
            }
          }
        }
      })
    }, 1000);

  },
};
</script>


<style>
.editbuilding .space input {
  height: 10px !important;
  padding-bottom: 35px;
  font-size: 14px;
  /* font-size: 9px; */
}

.editbuilding .space .v-field__field {
  height: 35px;
}

.editbuilding .space .v-field__append-inner {
  display: block;
  padding-top: 5px;
}

.editbuilding .v-input__append {
  display: block;
  padding-top: 8px;
}

.editbuilding .floor input {
  height: 15px !important;
  padding-bottom: 30px;
  font-size: 15px;
  font-weight: bold;
  /* font-size: 9px; */
}

.editbuilding .b-top {
  display: flex;
  font-weight: bold;
  padding: 7px;
  font-size: 15px;
  color: white;
  padding-left: 10px;
  justify-content: space-between;

  background-color: var(--maincolor);
  border-bottom: 1px solid var(--maincolor);
}

.editbuilding .b-top i {
  color: white;
}

.floor .v-input__details {
  display: none;
}

.editbuilding .floor .v-field__field {
  height: 40px;
}

.editbuilding .floor .v-field__append-inner {
  display: block;
  padding-top: 8px;
}

.editbuilding .floor .v-field__append-inner i {
  color: var(--redcolor);
}
</style>