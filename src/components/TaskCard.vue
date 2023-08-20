<template>
  <div class="card list-container rounded p-2">
    <div class="row">
      <h5 class="list-title mt-2 text-center">{{ cardTitle }}</h5>
    </div>
    <ul class="list-items list-group">
      <slot></slot>
    </ul>
    <button
        v-if="!addingTask"
        @click="startAddingTask"
        type="button"
        class="btn list-group-item add-task-btn m-1"
    >
      <i class="fa fa-plus-circle"></i> Add a task
    </button>
    <div v-else>
      <form @submit.prevent="submitTask()">
        <textarea
            ref="taskTextarea"
            class="list-group-item add-task-textarea m-1"
            v-model="task"
        ></textarea>
        <button
            type="submit"
            class="btn btn-primary m-1"
        >
          Submit
        </button>
      </form>
    </div>

<!--    <div class="dropdown">-->
<!--      <button-->
<!--          class="btn add-task-btn mb-2"-->
<!--          type="button"-->
<!--          :id="dropdownId"-->
<!--          data-toggle="dropdown"-->
<!--          aria-haspopup="true"-->
<!--          aria-expanded="false"-->
<!--      >-->
<!--        <i class="fa fa-ellipsis-v"></i>-->
<!--      </button>-->
<!--      <div-->
<!--          class="dropdown-menu"-->
<!--          :aria-labelledby="dropdownId"-->
<!--      >-->
<!--        <a class="dropdown-item" href="#">Edit</a>-->
<!--        <a class="dropdown-item" href="#">Delete</a>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
import {TaskService} from "../../services/TaskService";

export default {
  name: "TaskCard",
  props: {
    cardTitle: String,
  },
  data() {
    return {
      addingTask: false,
      task: '',
      workspaceId: this.$route.params.workspaceId
    }
  },
  computed: {
    dropdownId() {
      return `dropdown-${this._uid}`;
    },
  },
  methods: {
    startAddingTask() {
      this.addingTask = true;
      this.$nextTick(() => {
        this.$refs.taskTextarea.focus();
      });
    },
    stopAddingTask() {
      this.addingTask = false;
    },
    submitTask : async function () {
      try {
        let response = await TaskService.createTask(this.task, 1, 1);
        if (response) {
          return this.$router.push('/');
        } else {
          console.log("ayaa");
        }
      }catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style scoped>
.list-container {
  background-color: lightgrey;
  max-width: 500px;
}

.add-task-btn {
  display: block;
  width: 100%;
  text-align: left;
  background-color: lightgrey;
  color: grey;
}

.add-task-textarea {
  display: block;
  width: 100%;
  background-color: white;
  resize: none;
}
</style>
