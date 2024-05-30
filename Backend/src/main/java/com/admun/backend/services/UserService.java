package com.admun.backend.services;
import com.admun.backend.mapper.TaskMapper;
import com.admun.backend.models.ApplicationUser;
import com.admun.backend.dto.UserDTO;
import com.admun.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("in the user details service");

        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("user is not valid"));
    }

    public UserDTO getUserByUsername(String username) {
        return TaskMapper.toUserDTO(userRepository.findByUsername(username).get());
    }


    public Set<UserDTO> getUserData(Set<ApplicationUser> users) {
        Set<UserDTO> userDTOS = new HashSet<>();
        for (ApplicationUser u: users) {
            userDTOS.add(new UserDTO(u.getUserId(),u.getUsername()));
        }
        return userDTOS;
    }

    public Optional<ApplicationUser> getApplicationUser(String username) {
        return userRepository.findByUsername(username);
    }


}
