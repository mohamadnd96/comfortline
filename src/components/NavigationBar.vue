<template>
  <v-navigation-drawer :class="rail ? 'd-none d-lg-block' : 'd-block'" v-model="drawer" :rail="rail"
    color="var(--maincolor)" permanent @click="rail = false"> <!-- puts in main color, permanent means the navbar isn't going to dissapear-->
    <v-list-item color="white" :prepend-avatar=" 
      user
        ? 'https://svgshare.com/i/qdg.svg'
        : 'https://svgshare.com/i/qeL.svg'
    " :title="user ? user.email : 'Comfortline'" nav> <!-- user avatar -->
      <template v-slot:append>
        <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn> <!-- changes the arrow when navbar collapses-->
      </template>
    </v-list-item>
    <!-- <v-btn  @click.stop="update">ddd</v-btn> -->
    <v-divider></v-divider>

    <v-list density="compact" nav> <!-- items displayed on the navbar-->
      <router-link style="text-decoration: none" v-for="(item, index) in items" v-bind:key="index" :to="item.route"
        @click.stop="update">
        <v-list-item :prepend-icon="item.icon" :active="this.$route.path.split('/').at(1) == item.route.name"
          :title="item.title" :value="item.title" style="color: white" />
      </router-link>
    </v-list>
  </v-navigation-drawer>

  <v-main :style="rail ? '--v-layout-left:0px;' : '--v-layout-left:256px;'"> <!-- shifts the main site (white part) when the navbar shifts (with a margin)-->
    <v-btn variant="text" color="var(--maincolor)" style="margin-left: 20px; margin-top: 15px;" icon="mdi-menu"
      :class="rail ? 'd-lg-none' : 'd-none'" v-on:click="rail = !rail"></v-btn> <!-- button with 3 lines showing when the website is shrinked-->
    <v-container :class="rail ? 'd-block' : 'd-none d-lg-block'"> <router-view /></v-container> <!-- current route is shown (white/main area)-->
  </v-main>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      rail: true,                             // is navbar expanded
    };
  },
  methods: {
    update() {
      if (window.innerWidth < 1280) {
        this.rail = true
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    items() {                           // displayed items in the navbar (depending on the logged in status and user status)
      if (this.user.user) {             // if user is logged in
        if (this.user.admin) {          // if user is admin
          return [
            { title: "Home", icon: "mdi-home-circle", route: { name: "home" } },
            {
              title: "Buildings",
              icon: "mdi-office-building",
              route: { name: "buildingsadmin" },
            },
            {
              title: "Backup data",
              icon: "mdi-cloud-upload",
              route: { name: "backup" },
            },
            { title: "Log out", icon: "mdi-logout", route: { name: "logout" } },
          ];
        } else {                        // if user is owner
          return [
            { title: "Home", icon: "mdi-home-circle", route: { name: "home" } },
            {
              title: "Notifications",
              icon: "mdi-bell",
              route: { name: "notifications" },
            },
            {
              title: "Buildings",
              icon: "mdi-office-building",
              route: { name: "buildings" },
            },
            {
              title: "Contact us",
              icon: "mdi-phone-message-outline",
              route: { name: "contactus" },
            },
            { title: "Log out", icon: "mdi-logout", route: { name: "logout" } },
          ];
        }
      } else {
        return [
          { title: "Login", icon: "mdi-login", route: { name: "login" } },
          {
            title: "Sign up",
            icon: "mdi-account-plus",
            route: { name: "signup" },
          },
          {
            title: "Contact us",
            icon: "mdi-phone-message-outline",
            route: { name: "contactus" },
          },
        ];
      }
    },
  },

  async beforeMount() { },
};
</script>