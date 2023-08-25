<template>
   <div style="height: calc(90vh ); display: flex; align-items: center;"> 
    <v-card
      max-width="500"
      color="var(--maincolor)"
      style="padding: 30px; margin-top: 20px; flex-grow: 1;"
      variant="outlined"
      class="mx-auto"
    >
      <v-form ref="form" @submit.prevent="validate">
        <!-- <div class="vs2"></div> -->
        <div style="text-align: center">
          <div class="text-h4 pb-4 pt-2 color btext">Sign up</div>
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
          :rules="rules"
          label="Email address"
          required
        ></v-text-field>
        <div class="vs1"></div>
        <v-text-field
          variant="outlined"
          prepend-inner-icon="mdi-lock"
          v-model="password"
          :rules="rules"
          label="Password"
          :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
          @click:append-inner="show1 = !show1"
          required
        ></v-text-field>
        <div class="vs1"></div>
        <v-text-field
          variant="outlined"
          prepend-inner-icon="mdi-lock"
          v-model="repassword"
          :rules="rules"
          label="Repeat password"
          :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show2 ? 'text' : 'password'"
          @click:append-inner="show2 = !show2"
          required
        ></v-text-field>
        <div class="d-flex flex-column">
          <v-btn variant="tonal" class="mt-4 mainbtn" block type="submit">
            Create account
          </v-btn>
          <v-btn variant="tonal" class="mt-4 yellowbtn" block @click="login">
            Already have account
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
    show1: false,
    show2: false,
    valid: false,
    email: "",
    password: "",
    repassword: "",
    rules: [(v) => !!v || "Required"],                        // rule applied to the text fields (red with required when deleted text)
  }),

  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate();

      if (valid)                                              // if form is validated, sign up
        this.$store.dispatch("signup", {
          email: this.email,
          pass: this.password,
          repass: this.repassword,
        });
    },
    login() {
      router.push({ name: "login" });
    },
  },
};
</script>