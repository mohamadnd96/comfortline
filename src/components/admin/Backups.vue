<template>
  <div class="mx-4">
    <div class="text-h4 pb-3 pt-2 color btext">Backup Data</div>
    <v-btn v-if="!process.running" height="80" stacked prepend-icon="mdi-cloud-upload" class="bgdark" @click="backup"
      variant="tonal">
      Create Backup
    </v-btn>
    <div v-else>
      <div class="text-h6 pb-3 pt-2 color btext">Backup in progress
      </div>
      <div class="text-h7 pb-0 pt-2 color ntext">Archiving building <span class="btext">{{ process.building }}</span> of <span class="btext"> {{ process.tb }}</span>
      </div>
      <div class="text-h7 pb-0 pt-2 color ntext">Archiving file <span class="btext">{{ process.file }}</span> of <span class="btext"> {{ process.tf }}</span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  computed: {
    process() {
      return this.$store.state.backupprocess
    }
  },
  methods: {
    backup() {
      this.$store.dispatch('archiveAllData')
    },
  },
};
</script>


<style></style>