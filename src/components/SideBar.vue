<template>
  <div class="container-fluid">
    <div class="row">
      <div
          class="position-absolute"
          :class="{ 'w-1': !expanded, 'w-15': expanded }"
          id="sticky-sidebar"
      >
        <button
            type="button"
            class="btn btn-circle w-100 expand-button position-absolute top-0 end-0 mt-2"
            @click="expanded = !expanded"
        >
          <i class="fa fa-solid fa-caret-down fa-rotate-270" style="color: #ffffff"></i>
        </button>
        <div class="nav sidebar flex-column flex-nowrap vh-100 overflow-auto text-white p-2 text-start">

          <a href="./" class="nav-link">Link</a>
          <a href="./" class="nav-link">Link</a>
        </div>
      </div>
      <div
          class="px-4"
          :style="mainColumnStyles"
          id="main"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>

// import ModalCreate from "@/components/ModalCreate.vue";

export default {

  name: "SideBar",
  // components: {ModalCreate},
  data() {
    return {
      expanded: false
    };
  },
  computed: {
    mainColumnStyles() {
      return {
        marginLeft: this.expanded ? '15%' : '1%',
        transition: 'margin-left 0.3s ease-in-out'
      };
    }
  }
};

</script>

<style scoped>

a {
  color: white;
}

a:hover, a:focus {
  color: white;
}

.w-1 {
  margin: 0;
  padding: 0;
  width: 1% !important;
  transition: width 0.3s ease-in-out;
}

.w-15 {
  margin: 0;
  padding: 0;
  width: 15% !important;
  transition: width 0.3s ease-in-out;
}

.expand-button {
  width: 40px !important;
  height: 40px;
  border-radius: 80px;
  background-color: rgba(29,53,87, 1);
  z-index: 1000;
  margin-left: 100px;
  transform: translate(20px);
}

.expand-button:hover {
  background-color: rgba(29,53,87, 0.9);
}

.sidebar {
  background-color: rgba(29,53,87, 0.8);
}

</style>
