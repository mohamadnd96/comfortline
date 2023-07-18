<template>
  <v-row v-if="uids != null">
    <v-col colls="12" lg="4">
      <v-form ref="form" @submit.prevent="validate" autocomplete>
        <div class="text-h4 pb-4 pt-2 color btext">Add new building</div>

        <div class="vs2"></div>
        <v-autocomplete
          variant="outlined"
          prepend-inner-icon="mdi-at"
          required
          label="Email"
          :rules="rules"
          v-model="email"
          :items="uids.emails"
        ></v-autocomplete>
        <!-- <v-select v-model="email" :items="uids.emails" label="Email"></v-select> -->
        <v-text-field
          variant="outlined"
          prepend-inner-icon="mdi-domain"
          v-model="name"
          type="email"
          name="company"
          :rules="rules"
          label="Company Name"
          required
        ></v-text-field>
        <v-text-field
          variant="outlined"
          prepend-inner-icon="mdi-map-marker"
          v-model="address"
          name="address"
          :rules="rules"
          label="Address"
          required
        ></v-text-field>
        <v-text-field
          variant="outlined"
          prepend-inner-icon="mdi-latitude"
          v-model="lat"
          type="number"
          name="latitude"
          :rules="rules"
          label="Latitude"
          required
        ></v-text-field>
        <v-text-field
          variant="outlined"
          prepend-inner-icon="mdi-longitude"
          v-model="long"
          type="number"
          name="longitude"
          :rules="rules"
          label="Longitude"
          required
        ></v-text-field>
        <div class="d-flex flex-column">
          <v-btn variant="tonal" class="mt-4 mainbtn" block type="submit">
            Save
          </v-btn>
        </div>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
export default {
  computed: {
    uids() {
      return this.$store.state.uidemails;
    },
  },
  data() {
    return {
      valid: false,
      name: "",
      address: "",
      lat: "",
      long: "",
      uid: "",
      rules: [(v) => !!v || "Required"],
      email: null,
    };
  },

  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate();
      if (valid) this.addBuilding();
    },

    addBuilding() {
      this.$store.dispatch("addbuilding", {
        companyName: this.name,
        emailOwner: this.email,
        address:this.address,
        lat: this.lat,
        long: this.long,
        uidOwner: this.uids.uids[this.uids.emails.indexOf(this.email)],
      });
    },
  },

  async mounted() {
    await this.$store.dispatch("getUidEmails");
  },
};
</script>