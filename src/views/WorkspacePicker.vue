<template>

  <!--  Spinner-->
  <div v-if="loading">
    <div class="container">
      <div class="row">
        <div class="col">
          <LoadSpinner></LoadSpinner>
        </div>
      </div>
    </div>
  </div>

  <!--  Error message-->
  <div v-if="!loading && errorMessage">
    <div class="container m-5">
      <div class="row">
        <div class="col">
          <p class="h4 text-danger fw-bold text-center">{{errorMessage}}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="row" v-if="workspaces.length > 0">
      <div class="col-3 my-3" v-for="workspace of workspaces" :key="workspace.id">
        <WorkSpace :workspaceTitle="workspace.name"
                   :backgroundColor="workspace.color"
                   :workspaceId="workspace.id"
        ></WorkSpace>
      </div>
    </div>
  </div>

</template>

<script>
import WorkSpace from "@/components/WorkSpace.vue";
import LoadSpinner from "@/components/LoadingSpinner.vue";
import {TaskService} from "../../services/TaskService";

export default {
  name: "WorkspacePicker",
  inheritAttrs: false,
  components: {
    WorkSpace,
    LoadSpinner
  },
  data() {
    return {
      loading: false,
      errorMessage: null,
      workspaces: []
    }
  },

  created: async function(){
    try {
      this.loading = true;
      let response = await TaskService.getAllWorkspaces();
      this.workspaces = response.data;
      this.loading = false;
    } catch (err) {
      this.errorMessage = err;
      this.loading = false;
    }
  },
  methods: {
  }
}
</script>



<style scoped>

</style>