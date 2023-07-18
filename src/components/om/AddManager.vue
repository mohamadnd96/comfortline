<template>
  <v-row v-if="emails != null">
    <v-col colls="12" lg="4">
      <v-form ref="form" @submit.prevent="validate" autocomplete>
        <div class="text-h4 pb-4 pt-2 color btext">
          Add Manager to the building {{ this.$route.params.id }}
        </div>

        <div class="vs2"></div>
        <v-autocomplete
          variant="outlined"
          prepend-inner-icon="mdi-at"
          required
          label="Manager Email"
          :rules="rules"
          v-model="email"
          :items="emails.emails"
        ></v-autocomplete>

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
    emails() {
      return this.$store.state.uidemails;
    },
  },
  data() {
    return {
      valid: false,
      rules: [(v) => !!v || "Required"],
      email: null,
    };
  },

  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate();
      if (valid) this.addManager();
    },

    addManager() {
      this.$store.dispatch("addmanager", {
        buildingID: this.$route.params.id,
        managerEmail: this.email,
      });
    },
  },

  mounted() {
    this.$store.dispatch("getUidEmails");
  },
  unmounted() {
    this.$store.commit("clearuidemails");
  },
};
</script>