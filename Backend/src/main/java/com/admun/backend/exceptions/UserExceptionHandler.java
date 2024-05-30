package com.admun.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class UserExceptionHandler {
    @ExceptionHandler
    public ResponseEntity<UserErrorResponse> handleException(UserNotFoundException e) {
        UserErrorResponse err = new UserErrorResponse();

        err.setStatus(HttpStatus.NOT_FOUND.value());
        err.setMessage(e.getMessage());
        err.setTimeStamp(System.currentTimeMillis());

        return new ResponseEntity<>(err,HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler
    public ResponseEntity<UserErrorResponse> handleException(Exception e) {
        UserErrorResponse err = new UserErrorResponse();

        err.setStatus(HttpStatus.BAD_REQUEST.value());
        err.setMessage(e.getMessage());
        err.setTimeStamp(System.currentTimeMillis());

        return new ResponseEntity<>(err,HttpStatus.NOT_FOUND);
    }
}
