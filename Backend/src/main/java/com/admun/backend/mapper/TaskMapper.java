package com.admun.backend.mapper;

import com.admun.backend.dto.TaskDTO;
import com.admun.backend.dto.UserDTO;
import com.admun.backend.models.Task;
import com.admun.backend.models.ApplicationUser;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Set;
import java.util.stream.Collectors;

public class TaskMapper {

    public static TaskDTO toTaskDTO(Task task) {
        Set<UserDTO> userDTOs = task.getUsers().stream()
                .map(TaskMapper::toUserDTO)
                .collect(Collectors.toSet());

        return new TaskDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getTaskType(),
                task.getCreationDate(),
                task.getTaskDate(),
                userDTOs
        );
    }
    public static UserDTO toUserDTO(ApplicationUser user) {
        return new UserDTO(user.getUserId(), user.getUsername());
    }
}
