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


  <div class="container-fluid mt-3">
    <div class="row flex-nowrap task-list" ref="scrollContainer" @wheel.prevent="handleMouseWheel"
         :scrollLeft="scrollLeft" v-if="workspace && workspace.cards && workspace.cards.length > 0">
      <div class="col-3" v-for="card of workspace.cards" :key="card.id">
        <TaskCard :cardTitle="card.name">
          <li class="list-group-item list-group-item-action" v-for="task of card.tasks" :key="task.id">
            {{ task.name }}
          </li>
        </TaskCard>
      </div>

    </div>
  </div>


</template>

<script>
import TaskCard from "@/components/TaskCard.vue";
import {TaskService} from "../../services/TaskService";
import LoadSpinner from "@/components/LoadingSpinner.vue";


export default {
  name: 'HomeView',
  inheritAttrs: false,
  components: {
    TaskCard,
    LoadSpinner,
  },
  data: function() {
    return {
      loading: false,
      scrollLeft: 0,
      workspace: [],
      errorMessage: null,
      workspaceId: this.$route.params.workspaceId,
    }
  },

  created: async function() {
      try {
        this.loading = true;
        let response = await TaskService.getAllCardsAndTasks(this.workspaceId);
        if (response.data && response.data.cards) {
          this.workspace = response.data;
        }
        this.loading = false;
      } catch (err) {
        this.errorMessage = err;
        this.loading = false;
      }
  },

  methods: {
    handleMouseWheel(e) {
      this.scrollLeft += e.deltaY;
      this.scrollLeft = Math.min(
          this.scrollLeft = Math.min(
              this.$refs.scrollContainer.scrollWidth - this.$refs.scrollContainer.clientWidth,
              Math.max(0, this.scrollLeft)
        )
      );
    },
  },
}
</script>

<style scoped>

.task-list {
  overflow-x: auto;
  min-height: 92vh;
  max-height: 92vh;
  position: relative;
}

.col-3 {
  min-width: 300px;
}
</style>