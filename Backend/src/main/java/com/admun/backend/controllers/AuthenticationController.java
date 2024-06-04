package com.admun.backend.controllers;

import com.admun.backend.dto.UserDTO;
import com.admun.backend.mapper.TaskMapper;
import com.admun.backend.models.ApplicationUser;
import com.admun.backend.dto.LoginResponseDTO;
import com.admun.backend.dto.RegistrationDTO;
import com.admun.backend.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/register")
    public UserDTO registerUser(@RequestBody RegistrationDTO body) {
        return TaskMapper.toUserDTO(authenticationService.registerUser(body.getUsername(), body.getPassword()));
    }

    // TODO LoginDTO
    @PostMapping("/login")
    public LoginResponseDTO loginUser(@RequestBody RegistrationDTO body){
        return authenticationService.loginUser(body.getUsername(), body.getPassword());
    }
}