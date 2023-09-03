<template>
  <div class="card ws-card shadow-lg" :class="backgroundColor">
    <div class="text-end">
      <button @click.prevent="removeWorkspace" class="btn btn-delete" style="z-index: 1;"><i class="fa fa-trash"></i></button>
    </div>
    <div class="card-body" style="position: relative;">
      <p class="card-text">{{ workspaceTitle }}</p>
      <img src="" alt="" class="card-img-bottom">
      <!-- Router link -->
      <router-link :to='`/workspace/${workspaceId}`' class="stretched-link" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;"></router-link>
    </div>
  </div>
</template>


<script>
export default {
  name: "WorkSpace",
  props: {
    workspaceTitle: String,
    backgroundColor: String,
    workspaceId: Number,
  },
  methods: {
    removeWorkspace() {
      this.$emit("remove-workspace", this.workspaceId);
    },
  },
};
</script>

<style scoped>

.ws-card {
  display: flex;
  flex-direction: column;
  text-align: left;
  color: white;
  font-weight: bold;
}

.card-text {
  text-align: left !important;
  overflow-wrap: break-word;
}

</style>
