package com.admun.backend.controllers;

import com.admun.backend.dto.TaskDTO;
import com.admun.backend.mapper.TaskMapper;
import com.admun.backend.models.ApplicationUser;
import com.admun.backend.models.Task;
import com.admun.backend.models.TaskType;
import com.admun.backend.services.TaskService;
import com.admun.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@RestController
@RequestMapping("/api/v1")
@CrossOrigin("*")
public class TaskController {

    private TaskService taskService;
    private UserService userService;


    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/tasks")
    public List<Task> findAll() {
        return taskService.findAll();
    }


    @GetMapping("/tasks/{taskId}")
    public TaskDTO getTask(@PathVariable int taskId) {

        Task task = taskService.findById(taskId);

        if (task == null) {
            throw new RuntimeException("Task id not found - " + taskId);
        }

        return TaskMapper.toTaskDTO(task);
    }



    @PostMapping("/tasks")
    public TaskDTO addTask(@RequestBody Task task) {


        Set<ApplicationUser> users = new HashSet<>();

        System.out.println(task.toString());
        // TODO Sollte nicht die Lösung sein
        for(ApplicationUser u: task.getUsers()) {
            System.out.println(u.toString());
            users.add(this.userService.getApplicationUser(u.getUsername()).get());
        }
        task.setUsers(users);

        taskService.save(task);

        return TaskMapper.toTaskDTO(task);
    }


    @PutMapping("/tasks")
    public TaskDTO updateTask(@RequestBody Task task) {

        taskService.save(task);

        return TaskMapper.toTaskDTO(task);
    }


    @DeleteMapping("/tasks/{taskId}")
    public String deleteTask(@PathVariable int taskId) {

        Task tempTask = taskService.findById(taskId);

        // throw exception if null

        if (tempTask == null) {
            throw new RuntimeException("Task id not found - " + taskId);
        }

        taskService.deleteById(taskId);

        return "Deleted task id - " + taskId;
    }

    @GetMapping("/tasks/type")
    public List<TaskDTO> getTasksByType(@RequestParam TaskType type) {
        return  taskService.getTasksByType(type);
    }


    // api/v1/tasks/at?start=2024-05-25&end=2024-05-27
    @GetMapping("/tasks/at")
    public ResponseEntity<List<TaskDTO>> getTasksWithinRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<TaskDTO> tasks = taskService.getTasksWithinRange(startDate, endDate);
        return ResponseEntity.ok().body(tasks);
    }

    // api/v1/tasks/weekly/1?start=2024-05-23&end=2024-05-30
    @GetMapping("/tasks/weekly/{userId}")
    public ResponseEntity<List<TaskDTO>> getWeeklyTasksByUserId(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate, @PathVariable("userId") Integer userId){
        List<TaskDTO> weeklyTasks = taskService.getTasksWithinRange(userId,startDate,endDate);
        return ResponseEntity.ok().body(weeklyTasks);
    }


}
