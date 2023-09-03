<template>
  <!--  Spinner-->
  <div v-if="loading">
    <div class="row">
      <div class="col">
        <LoadSpinner></LoadSpinner>
      </div>
    </div>
  </div>

  <!--  Error message-->
  <div v-if="!loading && errorMessage">
    <div class="row">
      <div class="col">
        <p class="h4 text-danger fw-bold text-center">{{ errorMessage }}</p>
      </div>
    </div>
  </div>


  <div v-if="workspaces.length > 0" class="row mx-3">
    <div v-for="workspace of workspaces" :key="workspace.id" class="col-3 my-3">
      <WorkSpace :backgroundColor="workspace.color"
                 :workspaceId="workspace.id"
                 :workspaceTitle="workspace.name"
                 @remove-workspace="removeWorkspace(workspace.id)"
      ></WorkSpace>
    </div>
  </div>

</template>

<script>
import WorkSpace from "@/components/WorkSpace.vue";
import LoadSpinner from "@/components/LoadingSpinner.vue";
import { ref, onBeforeMount } from 'vue';

export default {
  name: "WorkspacePicker",
  inheritAttrs: false,
  components: {
    WorkSpace,
    LoadSpinner
  },
  setup() {
    const loading = ref(false);
    const errorMessage = ref(null);
    const workspaces = ref([]);

    onBeforeMount(async () => {
      try {
        loading.value = true;

        const response = await fetch('http://localhost:9000/workspaces');
        const workspacesData = await response.json();

        if (workspacesData.workspaces) {
          workspaces.value = workspacesData.workspaces;
        }

        loading.value = false;
      } catch (err) {
        errorMessage.value = err;
        loading.value = false;
      }
    });

    const removeWorkspace = async (workspaceId) => {
      try {
        // Zavoláme API pre odstránenie workspaceu
        await fetch(`http://localhost:9000/workspaces/${workspaceId}`, {
          method: "DELETE",
        });

        // Odstránime workspace zo zoznamu
        const indexToRemove = workspaces.value.findIndex((w) => w.id === workspaceId);
        if (indexToRemove !== -1) {
          workspaces.value.splice(indexToRemove, 1);
        }
      } catch (err) {
        errorMessage.value = "Chyba pri odstraňovaní workspaceu.";
        console.error(err);
      }
    };

    return {
      loading,
      errorMessage,
      workspaces,
      removeWorkspace
    };
  },


}
</script>


<style>

body {
  background-color: rgba(69,123,157, 0.8) !important;
}

.ws-card {
  background-color: rgba(69,123,157, 0.1) !important;
}

</style>