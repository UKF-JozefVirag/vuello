<template>
  <div class="card list-container rounded p-2">
    <div class="row">
      <div class="col-10">
        <h5 class="list-title mt-2 text-start">{{ cardTitle }}</h5>
      </div>
      <div class="col-2">
        <button class="btn" @click="deleteCard"><i class="fa fa-trash"></i></button>
      </div>
    </div>

    <div class="list-items list-group" v-if="tasksForCurrentCard.length > 0">
      <div
          class="list-group-item list-group-item-action mt-1 d-flex justify-content-between align-items-center"
          v-for="task of tasksForCurrentCard"
          :key="task.id"
      >
        <div v-if="task.id !== editingTaskId">{{ task.name }}</div>
        <div v-else>
          <input v-model="editingTaskName" @keydown.enter="saveEditedTask(task.id)" v-bind="editingTaskInput" />
          <button class="btn btn-success btn-sm" @click="saveEditedTask(task.id)">Submit</button>
          <button class="btn btn-secondary btn-sm" @click="cancelEditTask">Cancel</button>
        </div>
        <div class="btn-group" v-if="task.id !== editingTaskId">
          <button class="btn btn-sm btn-success" @click="editTask(task)"><i class="fa fa-pencil"></i></button>
          <button class="btn btn-sm btn-danger" @click="deleteTask(task.id)"><i class="fa fa-trash"></i></button>
        </div>
      </div>

    </div>

    <button
        v-if="!addingTask"
        @click="startAddingTask"
        type="button"
        class="btn list-group-item add-task-btn m-1"
    >
      <i class="fa fa-plus-circle"></i> Add new task
    </button>
    <div v-else>
      <form @submit.prevent="submitTask">
        <textarea
            ref="taskTextarea"
            class="list-group-item add-task-textarea rounded mt-2"
            v-model="task"
            id="taskText"
        ></textarea>
        <button type="submit" class="btn btn-sm btn-success mt-2  mx-2">Submit</button>
        <button type="button" class="btn btn-sm btn-danger mt-2" @click="addingTask=false">Cancel</button>
      </form>
    </div>
  </div>
</template>


<script setup>
import {
  ref,
  nextTick,
  defineProps,
  onBeforeMount,
  computed,
  defineEmits
} from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  cardTitle: String,
  cardId: Number,
});

const addingTask = ref(false);
const task = ref('');
const workspaceId = ref('');
const tasks = ref([]);
const taskTextarea = ref(null);
const { params } = useRoute();
workspaceId.value = params.workspaceId;

const editingTaskId = ref(null);
const editingTaskName = ref('');
const editingTaskInput = ref(null);

const emit = defineEmits(['card-deleted']);

const deleteCard = async () => {
  try {
    const response = await fetch(
        `http://localhost:9000/workspaces/${workspaceId.value}/cards/${props.cardId}`,
        {
          method: 'DELETE',
        }
    );

    if (response.status === 200) {
      // emits event to workspace view
      emit('card-deleted', props.cardId);
    } else {
      console.error(response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
};

const editTask = (task) => {
  editingTaskId.value = task.id;
  editingTaskName.value = task.name;
  nextTick(() => {
    if (editingTaskInput.value) {
      editingTaskInput.value.focus();
    }
  });
};

const saveEditedTask = async (taskId) => {
  try {
    const response = await fetch(
        `http://localhost:9000/workspaces/${workspaceId.value}/cards/${props.cardId}/tasks/${taskId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: taskId, // Include the ID property
            name: editingTaskName.value,
          }),
        }
    );

    if (response.status === 200) {
      tasks.value = tasks.value.map(task =>
          task.id === taskId ? { ...task, name: editingTaskName.value } : task
      );
      editingTaskId.value = null;
    } else {
      console.error('Nepodarilo sa upraviť úlohu:', response.statusText);
    }
  } catch (error) {
    console.error('Vyskytla sa chyba:', error);
  }
};

const cancelEditTask = () => {
  editingTaskId.value = null;
  editingTaskName.value = '';
};

const startAddingTask = () => {
  addingTask.value = true;
  nextTick(() => {
    taskTextarea.value.focus();
    document.getElementById('taskText').value = '';
  });
};

const stopAddingTask = () => {
  addingTask.value = false;
};

const submitTask = async () => {
  try {
    const response = await fetch(
        `http://localhost:9000/workspaces/${workspaceId.value}/cards/${props.cardId}/tasks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: task.value,
          }),
        }
    );

    if (response.status === 201) {
      tasks.value.push({ name: task.value, cardId: props.cardId });
      stopAddingTask();
    } else {
      console.error('Nepodarilo sa vytvoriť úlohu:', response.statusText);
    }
  } catch (error) {
    console.error('Vyskytla sa chyba:', error);
  }
};

const tasksForCurrentCard = computed(() => {
  return tasks.value.filter((task) => task.cardId === props.cardId);
});

const deleteTask = async (taskId) => {
  try {
    const response = await fetch(
        `http://localhost:9000/workspaces/${workspaceId.value}/cards/${props.cardId}/tasks/${taskId}`,
        {
          method: 'DELETE',
        }
    );

    if (response.status === 200) {
      tasks.value = tasks.value.filter(task => task.id !== taskId);
    } else {
      console.error('Nepodarilo sa odstrániť úlohu:', response.statusText);
    }
  } catch (error) {
    console.error('Vyskytla sa chyba:', error);
  }
};


onBeforeMount(async () => {
  try {
    const response = await fetch(
        `http://localhost:9000/workspaces/${workspaceId.value}`
    );
    const workspaceData = await response.json();

    if (workspaceData.cards) {
      tasks.value = workspaceData.cards.reduce((tasks, card) => {
        const tasksWithCardId = card.tasks.map((task) => ({
          ...task,
          cardId: card.id,
        }));
        return tasks.concat(tasksWithCardId);
      }, []);
    }
  } catch (err) {
    console.log(err);
  }
});

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
