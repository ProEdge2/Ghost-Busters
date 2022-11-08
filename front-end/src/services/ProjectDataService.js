import http from "../http-common/http-common.projects";


// This class contains all the functions that make API calls and return info from the calls.
class ProjectDataService {
    getAllProjects() {
        return http.get('/');
    }

    createProject(data) {
        return http.post('/', data);
    }

    get(id) {
        return http.get(`/id/${id}`);
    }


    find(query, by = "name") {
        return http.get(`?${by}=${query}`);
    }

    deleteProject(project_name) {
        return http.delete('/', {data:{project_name: project_name}});
    }
}

export default new ProjectDataService();
