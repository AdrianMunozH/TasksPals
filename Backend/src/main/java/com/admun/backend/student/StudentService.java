package com.admun.backend.student;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    private final StudentRepository studentRepository;
    @Autowired
    StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }
    @GetMapping
    public List<Student> getStudents() {
        return studentRepository.findAll();
    }
    @PostMapping
    public void addNewStudent(Student student) {
        Optional<Student> curr = studentRepository.findStudentByEmail(student.getEmail());
        if (curr.isPresent()) {
            throw new IllegalStateException("email taken");
        }
        // email validation

        studentRepository.save(student);
    }
    @DeleteMapping
    public void deleteStudent(Long studentId) {
         if(!studentRepository.existsById(studentId)){
             throw new IllegalStateException("student not found");
         }

         studentRepository.deleteById(studentId);
    }

    @Transactional
    public void updateStudent(Long studentId, String name, String email) {
        Student student = studentRepository.findById(studentId).orElseThrow( () -> new IllegalStateException(
                "student with id " + studentId + " not found"));
        if(name != null && !name.isEmpty()) {
            student.setName(name);
        }
        //email validation
        if(email != null && !email.isEmpty() && !studentRepository.findStudentByEmail(email).isPresent()) {
            student.setEmail(email);
        }
    }

}
