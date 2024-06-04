package com.admun.backend;

import com.admun.backend.models.ApplicationUser;
import com.admun.backend.models.Role;
import com.admun.backend.models.Task;
import com.admun.backend.models.TaskType;
import com.admun.backend.repository.RoleRepository;
import com.admun.backend.repository.TaskRepository;
import com.admun.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.*;

@SpringBootApplication
@RestController
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);

	}

	@Bean
	CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, TaskRepository taskRepository) {
		return args -> {
			if (roleRepository.findByAuthority("ADMIN").isPresent()) return;

			Role adminRole = roleRepository.save(new Role("ADMIN"));
			Role userRole =  roleRepository.save(new Role("USER"));

			Set<Role> adminRoles = new HashSet<>();
			adminRoles.add(adminRole);

			Set<Role> userRoles = new HashSet<>();
			userRoles.add(userRole);

			ApplicationUser admin = new ApplicationUser("admin",passwordEncoder.encode("password"),adminRoles);
			ApplicationUser user1 =  new ApplicationUser("test.user@gmx.de",passwordEncoder.encode("password"), userRoles);
			userRepository.save(admin);
			userRepository.save(user1);

			addTask("test task", "hier muss man gar nichts machen", TaskType.ONCE,
					LocalDate.now().plusDays(3),new HashSet<>(Arrays.asList(1,2)),false,userRepository,taskRepository);
			addTask("rep","wiederholend", TaskType.DAILY, LocalDate.now().plusDays(4),
					new HashSet<>(List.of(2,3,4)),false,userRepository,taskRepository);
			addTask("kalareore", "wiederholend", TaskType.MONTHLY, LocalDate.now().plusDays(12),
					new HashSet<>(List.of(3,4)),false,userRepository,taskRepository);
			addTask("laufen und so", "5km", TaskType.WEEKLY, LocalDate.now().plusDays(1),
					new HashSet<>(List.of(5)),false,userRepository,taskRepository);



		};
	}

	private void addTask(String title, String description, TaskType taskType, LocalDate localDate, Set<Integer> ids,boolean isCompleted, UserRepository userRepository, TaskRepository taskRepository) {
		Set<ApplicationUser> users = new HashSet<>();

		for (Integer id: ids) {
			Optional<ApplicationUser> user = userRepository.findById(id);
			user.ifPresent(users::add);
		}

		Task task = new Task(title,description,taskType,localDate,isCompleted,users);
		taskRepository.save(task);
	}

}

