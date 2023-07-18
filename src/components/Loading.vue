<template>
    <div v-if="loading" class="loading">
        <div class="loader-back">
            <div class="loader"></div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        loading() {
            return this.$store.state.loading
        }
    }
}
</script>

<style>
.loader {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        position: relative;
        animation: rotate 1s linear infinite
      }
      .loader::before , .loader::after {
        content: "";
        box-sizing: border-box;
        position: absolute;
        inset: 0px;
        border-radius: 50%;
        border: 5px solid var(--maincolor);
        animation: prixClipFix 2s linear infinite ;
      }
      .loader::after{
        transform: rotate3d(90, 90, 0, 180deg );
        border-color: var(--lightcolor);
      }

      @keyframes rotate {
        0%   {transform: rotate(0deg)}
        100%   {transform: rotate(360deg)}
      }

      @keyframes prixClipFix {
          0%   {clip-path:polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)}
          50%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)}
          75%, 100%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)}
      }

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.loader-back {
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: #375a6448;
    border-radius: 4px;
    padding-top: 8px;
    padding-right: 8px;
    padding-left: 8px;
    /* padding: 10px; */
}




.loading {

    background-color: #18344C11;
    z-index: 10000;
    position: fixed;
    /* position: absolute; */
    width: 100%;
    height: 100%;
}</style>