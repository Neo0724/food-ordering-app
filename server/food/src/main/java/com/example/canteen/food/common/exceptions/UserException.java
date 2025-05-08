package com.example.canteen.food.common.exceptions;

import org.apache.catalina.User;

public class UserException extends RuntimeException {
    public UserException(String message) {
        super("User Service Error " + message);
    }
}
