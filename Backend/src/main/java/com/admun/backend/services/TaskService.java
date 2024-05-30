package com.admun.backend.services;


import com.admun.backend.mapper.TaskMapper;
import com.admun.backend.dto.TaskDTO;
import com.admun.backend.models.Task;
import com.admun.backend.models.TaskType;
import com.admun.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {


    TaskRepository taskRepository;
    UserService userService;

    @Autowired
    public TaskService(TaskRepository taskRepository,UserService userService) {
        this.taskRepository = taskRepository;
        this.userService = userService;
    }

    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    public Task findById(Integer id) {
        Optional<Task> result = taskRepository.findById(id);

        Task task = null;

        if (result.isPresent()) {
            task = result.get();
        }
        else {
            throw new RuntimeException("Did not find task " + id);
        }

        return task;
    }

    public void save(Task task ) {
        if(task.getCreationDate() == null)
            task.setCreationDate(LocalDate.now());

        taskRepository.save(task);
    }


    public void deleteById(Integer id) {
        taskRepository.deleteById(id);
    }

    public List<TaskDTO> getTasksByType(TaskType taskType) {
        List<Task> tasks = taskRepository.findByTaskType(taskType);
        return tasks.stream()
                .map(TaskMapper::toTaskDTO)
                .collect(Collectors.toList());
    }


    public List<TaskDTO> getTasksWithinRange(LocalDate startDate, LocalDate endDate) {
        List<Task> tasks = taskRepository.findByTaskDateBetween(startDate, endDate);
        return tasks.stream()
                .map(TaskMapper::toTaskDTO)
                .collect(Collectors.toList());
    }
    public List<TaskDTO> getTasksWithinRange(Integer userID, LocalDate startDate, LocalDate endDate) {
        List<Task> tasks = taskRepository.findTasksFromUserWithRange(userID,startDate, endDate);
        return tasks.stream()
                .map(TaskMapper::toTaskDTO)
                .collect(Collectors.toList());
    }


}
