package com.admun.backend.student;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

import static java.time.Month.*;

@Configuration
public class StudentConfig {
    @Bean
    CommandLineRunner commandLineRunner(StudentRepository studentRepository) {
        return args -> {
            Student peter = new Student(
                    "peter",
                    "peter.meter@gmx.de",
                    LocalDate.of(2000,JANUARY,5)
            );
            Student alex = new Student(
                    "alex",
                    "alex.kaleb@gmx.de",
                    LocalDate.of(1995,FEBRUARY,5)
            );
            Student miriam = new Student(
                    "miriam",
                    "miriam.filian@gmx.de",
                    LocalDate.of(2003,APRIL,29)
            );
            studentRepository.saveAll(List.of(alex, peter,miriam));
        };
        
        
    }
}
