package com.example.canteen.food.common.exceptions;

public class CreditException extends  RuntimeException{

    public CreditException(String message) {
        super("Credit Service Error " + message);
    }
}
