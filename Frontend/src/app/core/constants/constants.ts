export const constants = {
  CURRENT_TOKEN: 'CURRENT_TOKEN',
  CURRENT_USER: 'CURRENT_USER',
};

const apiurl = 'http://localhost:8000';

export const apiEndpoint = {
  AuthEndpoint: {
    login: `${apiurl}/auth/login`,
    logout: `${apiurl}/logout`,
    loggedUser: `${apiurl}/api/v1/user`,
  },
  TodoEndpoint: {
    getAllTodo: `${apiurl}/api/v1/tasks`,
    addTodo: `${apiurl}/api/v1/tasks`,
    updateTodo: `${apiurl}/api/v1/tasks`,
    getWeeklyTasksByUserId: `${apiurl}/api/v1/tasks/weekly`,
    isCompleted: `${apiurl}/api/v1/tasks`,

  },
};
