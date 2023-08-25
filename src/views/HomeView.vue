<template>
  <DashboardVue/>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import DashboardVue from '../components/Dashboard.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    DashboardVue,
  },
});
</script>
