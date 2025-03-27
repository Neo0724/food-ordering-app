package com.example.canteen.food.common.exceptions;


public class OrderException extends RuntimeException {
    public OrderException(String message) {
        super(message);
    }
}