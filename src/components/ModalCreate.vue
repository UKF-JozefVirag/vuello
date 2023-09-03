<template>
  <div class="container shadow-lg">
    <div v-if="isOpenned" class="modal custom-backdrop" style="display: block;" tabindex="-1" aria-labelledby="modal" aria-modal="true" role="dialog" data-backdrop="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header m-auto row">
            <h5 style="color: black;">New Workspace</h5>
          </div>
          <form @submit.prevent="createWorkspace()">
            <div class="modal-body mx-0">
              <div class="row">
                <label style="color:black;">Workspace title<span style="color:red">*</span></label>
              </div>
              <div class="row">
                <input type="text" name="workspaceName" id="workspaceName" required v-model="workspaceTitle">
              </div>
              <div class="row">
                <label style="color:black;">Background</label>
              </div>
              <div class="row">
                <input type="radio" name="backgroundSelect" class="col bg-1 bgPicker" value="bg-1" v-model="pickedBackground" />
                <input type="radio" name="backgroundSelect" class="col bg-2 bgPicker" value="bg-2" v-model="pickedBackground" />
                <input type="radio" name="backgroundSelect" class="col bg-3 bgPicker" value="bg-3" v-model="pickedBackground" />
                <input type="radio" name="backgroundSelect" class="col bg-4 bgPicker" value="bg-4" v-model="pickedBackground" />
                <input type="radio" name="backgroundSelect" class="col bg-5 bgPicker" value="bg-5" v-model="pickedBackground" />
                <input type="radio" name="backgroundSelect" class="col bg-6 bgPicker" value="bg-6" v-model="pickedBackground" />
              </div>
              <br>

            </div>
            <div class="modal-footer m-auto">
              <button type="submit" class="btn btn-custom" >Submit</button>
              <button type="button" @click="OpenClose()" :class="'btn btn-custom'" >Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <button type="button" @click="OpenClose()" style="text-align: start; color: white;" :class="'btn btn-custom'" ><i :class="'fa fa-'+icon" style="color: white"></i><slot></slot></button>
</template>

<script>
export default {
  name: "ModalCreate",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    icon: String
  },
  data() {
    return {
      isOpenned: this.visible,
      workspaceTitle: '',
      pickedBackground: ''
    };
  },
  methods: {
    OpenClose() {
      this.isOpenned = !this.isOpenned;
    },
    async createWorkspace() {
      try {
        document.getElementById("workspaceName").value = "";
        const response = await fetch('http://localhost:9000/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.workspaceTitle,
            color: this.pickedBackground
          })
        });
        if (response.status === 201) {
          this.isOpenned = false;
          console.log(this.pickedBackground + "    " + this.workspaceTitle);
          this.$emit('workspace-created', {
            id: response.id,
            name: this.workspaceTitle,
            color: this.pickedBackground
          });
        } else {
          console.error("failed to create workspace: " + response.statusText);
        }
      } catch (err) {
        console.error('An error occurred:', err);
      }
    },
  },
  watch: {
    visible: function (newVal) {
      this.isOpenned = newVal;
    },
  },
};
</script>

<style scoped>

.bgPicker {
  min-width: 50px;
  min-height: 50px;
}

.myModal {
  max-width: 90%;
}

.custom-backdrop {
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
