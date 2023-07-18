<template>
    <div>
        <div class="text-h4 pb-4 mt-5 color btext">
            Qr Codes For {{ this.$route.params.id }} Building
        </div>
        <div class="buildings mt-2" id="editbuildings">
            <div v-for="(floor, index) in structure.formula" v-bind:key="index" class="mb-5">
                <div>{{ structure.formula[index].floorName }}</div>
                <v-row class="mt-3 mr-7 ml-2">
                    <v-col class="newsection" cols="12" lg="3" v-for="(space, index1) in floor.spaces" v-bind:key="index1">
                        <v-card variant="outlined" color="var(--maincolor)" style="text-align: center;">
                            <div :id="index + 'f' + index1" style="
                                                          padding: 15px;
                                                                ">
                                <div class="b-top" id="header" style="display: flex; justify-content: space-between;">
                                    <div> {{ structure.formula[index].spaces[index1].spaceName }}</div>
                                    <v-icon v-on:click="printQr(index, index1)" icon="mdi-printer"></v-icon>
                                </div>
                                <div id="qrcode">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" xmlns:xlink="http://www.w3.org/1999/xlink">
                                        <image width="100%" height="100%"
                                            :xlink:href="structure.formula[index].spaces[index1].qrCode" />
                                    </svg>
                                </div>
                                <div>{{ structure.formula[index].spaces[index1].spaceID }}
                                </div>

                            </div>
                        </v-card>
                    </v-col>

                </v-row>
            </div>

        </div>

    </div>
</template>
  
<script>


import jsPdf from 'jspdf'
export default {

    computed: {
    },
    data() {
        return {

            structure: {
                buildingID: this.$route.params.id,
                formula: [
                ],
            },

        };
    },

    methods: {
        async printQr(index, index1) {

            let spacename = this.structure.formula[index].spaces[index1].spaceName
            let spaceid = this.structure.formula[index].spaces[index1].spaceID
            let qrcode = this.structure.formula[index].spaces[index1].qrCode
            const pdf = new jsPdf();
            pdf.setFontSize(20);
            pdf.text(spacename, 90, 70);
            pdf.addImage(qrcode, 'png', 45, 75, 120, 120);
            pdf.setFontSize(20);
            pdf.text(spaceid, 90, 205);
            pdf.output('dataurlnewwindow', spacename)

            // const domElement = document.createElement("div")
            // domElement.innerText="askdasdasdk"


            // html2canvas(domElement, {
            //     onclone: (document) => {
            //         console.log(document)
            //         let header = document.getElementById('header');
            //         document.getElementById('qrcode').style.width="600px"
            //         header.style.display = 'block'
            //         header.removeChild(header.children[1])
            //     }
            // })
            //     .then((canvas) => {
            //         const img = canvas.toDataURL('image/png')
            //         const pdf = new jsPdf()
            //         pdf.addImage(img, 'png', 0, 0)
            //         pdf.output('dataurlnewwindow', space)
            //     })

        },



    },

    async mounted() {
        this.structure.formula = this.$store.state.buildingstructure
    },
};
</script>
  
  
<style>
@media print {

    .page-title,
    .page-time {
        display: none;
    }
}
</style>


