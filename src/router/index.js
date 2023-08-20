import {createRouter, createWebHistory} from 'vue-router'
import WorkspaceView from "@/views/WorkspaceView.vue";
import WorkspacePicker from "@/views/WorkspacePicker.vue";

const routes = [
  {
    path: '/workspace/:workspaceId',
    name: 'workspace',
    component: WorkspaceView,
    props: true
  },
  {
    path: '/',
    name: 'workspaces',
    component: WorkspacePicker,
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
