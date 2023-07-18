<template>
    <v-alert :style="backColor" v-if="alert" class="alert-box" :type="alert.type" :title="title" max-width="500"
        color="white" border="top" transition="scale-transition" :text="alert.text" variant="tonal">
        <v-col style="padding: 0;">
            <div v-if="alert.type" class="row-e" style="margin-top: 15px;">
                <v-btn :style="backColor" v-on:click="action">Ok</v-btn>
            </div>
            <div v-else class="row-e" style="margin-top: 15px;">
                <v-btn :style="backColor" v-on:click="close">Back</v-btn>
                <div class="hs2"></div>
                <v-btn :style="backColor" v-on:click="action">Yes</v-btn>
            </div>
        </v-col>

    </v-alert>
</template>


<script>
export default {
    computed: {
        alert() {
            return this.$store.state.alert
        },
        backColor() {
            if (this.alert.type == 'error') {
                return 'background-color: rgb(253 56 56);'
            } else if (this.alert.type == 'success') {
                return 'background-color: rgb(50 177 75);'
            } else {
                return 'background-color: var(--maincolor);'
            }
        },
        title() {
            if (this.alert.type == 'success') {
                return 'Success'
            } else if (this.alert.type == 'error') {
                return 'Error'
            } else if (this.alert.title == null) {
                return 'Comfortline'
            } else {
                return this.alert.title
            }
        }
    },
    methods: {
        action() {

            if (this.alert.action) {
              
                return   this.alert.action()
            } else {

                return this.close()
            }
        },
        close() {
            this.$store.commit('closealert')
        }
    }
}
</script>


<style>
.alert-box {


    border-radius: 6px;
    position: absolute;
    z-index: 90000;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    animation: slideDown 200ms;
    -webkit-animation: slideDown 200ms;
    -moz-animation: slideDown 200ms;
    -o-animation: slideDown 200ms;
    -ms-animation: slideDown 200ms;
}

@keyframes slideDown {
    0% {
        top: 40%;
    }

    100% {
        top: 50%;
    }
}

@-moz-keyframes slideDown {
    0% {
        top: 40%;
    }

    100% {
        top: 50%;
    }
}

@-webkit-keyframes slideDown {
    0% {
        top: 40%;
    }

    100% {
        top: 50%;
    }
}

@-o-keyframes slideDown {
    0% {
        top: 40%;
    }

    100% {
        top: 50%;
    }
}

@-ms-keyframes slideDown {
    0% {
        top: 40%;
    }

    100% {
        top: 50%;
    }
}
</style>