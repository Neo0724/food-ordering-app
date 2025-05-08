package com.example.canteen.food.common.exceptions;

public class FoodException  extends  RuntimeException{
    public FoodException(String message) {
        super("Food Service Error " + message);
    }
}
