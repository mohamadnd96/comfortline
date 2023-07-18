<template>
  <v-app>
    <Alert />
    <loading />
    <NavigationBar v-if="user" />
  </v-app>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue';
import Loading from './components/Loading.vue';
import Alert from './components/Alert.vue';
export default {
  components: { NavigationBar, Loading, Alert },
  name: 'App',

  data: () => ({
    loaded: false
  }),

  computed: {
    user() {
      return this.$store.state.user;
    }
  },

  async beforeMount() {
    this.$store.commit('load')
    await new Promise(resolve => setTimeout(resolve, 1100))
    await this.$store.commit('islogged')
    this.$store.commit('endload')
  }

}
</script>


<style>
:root {
  --maincolor: #375A64;
  --bordercolor: #375a649d;
  --yellowcolor: #FFC800;
  --redcolor: #f13838;
  --lightcolor: #EDF4F5;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0;
  /* <-- Apparently some margin are still there even though it's hidden */
}

input[type=number] {
  -moz-appearance: textfield;
  /* Firefox */
  appearance: textfield;
}


.v-input__control {
  background-color: var(--lightcolor);

}

/* .v-main{
  --v-layout-left:0 !important
} */
.btext {
  font-weight: bold;
}

.v-btn.mainbtn {
  background-color: var(--maincolor);
  color: white;
  height: 40px;
}

.v-btn.yellowbtn {
  background-color: var(--yellowcolor);
  color: white;
  height: 40px;
}

.v-btn.redbtn {
  background-color: var(--redcolor);
  color: white;
  height: 40px;
}

.v-btn.lightbtn {
  background-color: var(--lightcolor);
  color: var(--maincolor);
  height: 40px;
}

.v-field__prepend-inner {
  margin-right: 8px;
}

.color {
  color: var(--maincolor);
}

.bgdark {
  background-color: var(--maincolor);
  color: white;
}

.bglight {
  background-color: var(--lightcolor);
  color: var(--maincolor);
}

.bgdark .v-btn__content,
.bgdark i {
  color: white
}


.bglight .v-btn__content,
.bglight i {
  color: var(--maincolor);
}

.t-1 {
  font-size: 15px;
}

.t-2 {
  font-size: 14px;
}

.t-3 {
  font-size: 13px;
}

.t-4 {
  font-size: 12px;
}

.t-5 {
  font-size: 11px;
}

.grey {
  color: grey;
}

.red {
  color: var(--redcolor);
}

.black {
  color: black;
}

.yellow {
  color: var(--yellowcolor);
}

.vs1 {
  height: 5px;
}

.vs2 {
  height: 10px;
}

.vs3 {
  height: 15px;
}

.vs4 {
  height: 20px;
}

.hs1 {
  width: 5px;
}

.hs2 {
  width: 10px;
}

.hs3 {
  width: 15px;
}

.hs4 {
  width: 20px;
}

.v-alert-title {
  margin-bottom: 15px;
}

.row-s {
  display: flex;
}

.row-c {
  display: flex;
  justify-content: center;
}

.row-sp {
  display: flex;
  justify-content: space-between;
}

.row-sa {
  display: flex;
  justify-content: space-around;
}

.row-e {
  display: flex;
  justify-content: end;
}

.ae {
  align-items: end;
}

.as {
  align-items: start;
}

.ac {
  align-items: center;
}
</style>