<template>
    <v-col cols="12" lg="6" style="padding-right:1.5%; margin-right: -15px;">
        <v-card height=260 variant="tonal" color="var(--maincolor)">
            <v-card-item>
                <div>
                    <div class="text-overline mb-1">
                        {{ title }} chart
                    </div>
                    <div>
                        <canvas v-if="notis ? this.$store.state.notificationsdata : this.$store.state.feedbackresult" :id="id"></canvas>
                    </div>
                </div>
            </v-card-item>
        </v-card> 
    </v-col>
</template>

<script>
export default {
    props: ['id', 'title'],  // parameters
}
</script>