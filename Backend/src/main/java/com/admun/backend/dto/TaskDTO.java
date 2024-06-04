package com.admun.backend.dto;

import com.admun.backend.models.TaskType;

import java.time.LocalDate;
import java.util.Set;

public class TaskDTO {
    private Integer id;
    private String title;
    private String description;
    private TaskType taskType;
    private LocalDate creationDate;
    private LocalDate taskDate;
    private Set<UserDTO> userIds;
    private boolean completed;

    public TaskDTO() {
    }

    public TaskDTO(Integer id, String title, String description, TaskType taskType, LocalDate creationDate, LocalDate taskDate, Set<UserDTO> userIds, boolean completed) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.taskType = taskType;
        this.creationDate = creationDate;
        this.taskDate = taskDate;
        this.userIds = userIds;
        this.completed = completed;
    }

    public Set<UserDTO> getUserIds() {
        return userIds;
    }

    public void setUserIds(Set<UserDTO> userIds) {
        this.userIds = userIds;
    }

    // Getter und Setter

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskType getTaskType() {
        return taskType;
    }

    public void setTaskType(TaskType taskType) {
        this.taskType = taskType;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDate getTaskDate() {
        return taskDate;
    }

    public void setTaskDate(LocalDate taskDate) {
        this.taskDate = taskDate;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
