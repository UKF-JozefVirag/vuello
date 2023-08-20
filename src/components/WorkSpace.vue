<template>
  <div class="card ws-card shadow-lg" :class="backgroundColor">
    <div class="card-body">
      <p class="card-text">{{ workspaceTitle }}</p>
      <img src="" alt="" class="card-img-bottom">
      <router-link :to='`/workspace/${workspaceId}`' class="stretched-link"></router-link>
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
  }
}
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