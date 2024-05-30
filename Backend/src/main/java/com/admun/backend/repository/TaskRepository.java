package com.admun.backend.repository;

import com.admun.backend.models.Task;
import com.admun.backend.models.TaskType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByTaskType(TaskType taskType);

    List<Task> findByTaskDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT t FROM Task t JOIN t.users u WHERE u.id = :userId AND t.taskDate BETWEEN :startDate AND :endDate")
    List<Task> findTasksFromUserWithRange(@Param("userId") Integer userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

}
