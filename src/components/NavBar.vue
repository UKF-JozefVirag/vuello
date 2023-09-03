<template>
  <nav class="navbar navbar-dark navbar-custom fixed">


  </nav>


  <nav class="navbar navbar-expand-lg navbar-dark navbar-custom fixed">
    <div class="nav-list">
      <router-link to="/" class="navbar-brand mx-5">Vuello</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
    <div class="nav-item">
      <ModalCreate>Create new workspace</ModalCreate>
    </div>

  </nav>


</template>
<script>

import ModalCreate from "@/components/ModalCreate.vue";

export default {
  name: "NavBar",
  components: {ModalCreate}
}
</script>


<style scoped>

.navbar-custom{
  margin: 0 !important;
  padding: 2px 4px 4px 2px !important;
  background-color: rgba(29,53,87, 0.8);
}

</style>