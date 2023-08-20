import axios from 'axios'
export class TaskService {
    static serverURL = "http://localhost:9000";

    static getAllCardsAndTasks(workspaceId) {
        let dataUrl = `${this.serverURL}/workspaces/${workspaceId}`;
        return axios.get(dataUrl);
    }

    static getAllWorkspaces() {
        let dataUrl = `${this.serverURL}/workspaces/`;
        return axios.get(dataUrl);
    }

    static createTask(task, workspaceId, cardId) {
        let dataURL = `${this.serverURL}/workspace/${workspaceId}/cards/${cardId}`;
        return axios.post(dataURL, task);
    }
}