<template>
  <!-- Loading Spinner -->
  <div v-if="loading">
    <div class="container">
      <div class="row">
        <div class="col">
          <LoadSpinner></LoadSpinner>
        </div>
      </div>
    </div>
  </div>

  <!-- Error message -->
  <div v-if="!loading && errorMessage">
    <div class="container m-5">
      <div class="row">
        <div class="col">
          <p class="h4 text-danger fw-bold text-center">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid yes" :class="workspace.color">
    <div class="row flex-nowrap task-list" ref="scrollContainer" @wheel.prevent="handleMouseWheel"
         :scrollLeft="scrollLeft">
      <div class="col-3" v-for="card of workspace.cards" :key="card.id">
        <TaskCard :cardTitle="card.name" :cardId="card.id" @card-deleted="handleCardDeleted"></TaskCard>
      </div>

      <div class="col-3">
        <div v-if="creatingNewCard">
          <div class="new-card w-100">
            <input type="text" v-model="cardName" placeholder="Enter new card name" class="rounded py-2 mt-2 cardInput">
            <br>
            <button class="btn btn-sm btn-success mt-2 mb-2" @click="saveNewCard">Save</button>
            <button class="btn btn-sm btn-danger mt-2 mb-2" @click="creatingNewCard=false">Cancel</button>
          </div>
        </div>
        <div v-else>
          <button class="btn btn-addCard w-100 text-white" @click="creatingNewCard=true">Create New Card</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TaskCard from "@/components/TaskCard.vue";
import LoadSpinner from "@/components/LoadingSpinner.vue";

export default {
  name: 'HomeView',
  inheritAttrs: false,
  components: {
    TaskCard,
    LoadSpinner,
  },
  data: function () {
    return {
      loading: false,
      scrollLeft: 0,
      workspace: [],
      errorMessage: null,
      workspaceId: this.$route.params.workspaceId,
      allTasks: [],
      creatingNewCard: false,
      cardName: '',
    };
  },

  created: async function () {
    try {
      this.loading = true;
      const response = await fetch(`http://localhost:9000/workspaces/${this.workspaceId}`);
      const workspaceData = await response.json();

      if (workspaceData.cards) {
        this.workspace = workspaceData;
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

    async saveNewCard() {
      try {
        // Create a new card with a name and empty tasks
        const newCard = {
          id: this.getNextCardId(), // Get the next available ID
          name: this.cardName,
          tasks: [],
        };

        // Send the new card to the server
        const response = await fetch(`http://localhost:9000/workspaces/${this.workspaceId}/cards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCard),
        });

        if (response.status === 201) {
          // If the card was successfully created, add it to the workspace
          this.workspace.cards.push(newCard);
          this.cardName = ''; // Clear the card name
          this.creatingNewCard = false; // Close the new card creation
        } else {
          const errorMessage = await response.text();
          this.errorMessage = errorMessage;
        }
      } catch (err) {
        this.errorMessage = err;
      }
    },

    getNextCardId() {
      const cards = this.workspace.cards;
      if (cards.length === 0) {
        return 1; // The first card ID is 1
      }
      const maxId = Math.max(...cards.map(card => card.id));
      return maxId + 1;
    },

    handleCardDeleted(deletedCardId) {
      this.workspace.cards = this.workspace.cards.filter(card => card.id !== deletedCardId);
    },
  },
};
</script>

<style scoped>
.task-list {
  overflow-x: auto;
  min-height: 95vh;
  max-height: 92vh;
  position: relative;
}

.col-3 {
  min-width: 300px;
}

.btn-addCard {
  background-color: rgba(1, 1, 1, 0.1);
}

.btn-addCard:hover {
  background-color: #2c4868;
  box-shadow: black 1px 1px;
}

.new-card {
  border-radius: 3px;
  background-color: lightgrey;
}

.cardInput {
}
.yes {
  padding-top: 1vh;
}
</style>
