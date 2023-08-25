<template>
  <div style="height: calc(100vh - 120px); display: flex; align-items: center;"> 
    <v-card
      variant="outlined"
      max-width="500"
      color="var(--maincolor)"
      style="padding: 30px; flex-grow: 1;"
      class="mx-auto centers"
    > <!-- Outline of the login window (vuetify v-card)-->
      <v-form ref="form" @submit.prevent="validate" autocomplete>
        <div style="text-align: center">
          <div class="text-h4 pb-4 pt-2 color btext">Sign In</div>
          <v-icon
            icon="mdi-account-circle"
            color="var(--maincolor)"
            size="70"
          ></v-icon>
        </div>
        <div class="vs4"></div>
        <v-text-field
          variant="outlined"
          prepend-inner-icon="mdi-email"
          v-model="email"
          type="email"
          name="email"
          :rules="rules"
          label="Email address"
          required
        ></v-text-field>
        <v-text-field
          variant="outlined"
          prepend-inner-icon="mdi-lock"
          v-model="password"
          :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="rules"
          @click:append-inner="show = !show"
          name="password"
          label="Password"
          :type="show ? 'text' : 'password'"
          required
        ></v-text-field>
        <div class="d-flex flex-column">
          <v-btn variant="tonal" class="mt-4 mainbtn" block type="submit"> <!-- on submit, sign in-->
            Sign in
          </v-btn>
          <v-btn variant="tonal" class="mt-4 yellowbtn" block @click="signup">
            Create new account
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import router from "@/router";

export default {
  data: () => ({
    show: false,
    valid: false,
    email: "",
    password: "",
    rules: [(v) => !!v || "Required"], // if type then delete
  }),

  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate();

      if (valid)
        this.$store.dispatch("signin", {
          email: this.email,
          pass: this.password,
        });
    },
    signup() {
      router.push({ name: "signup" });
    },
  },
};
</script>

<style>


</style>