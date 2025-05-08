package com.example.canteen.food.common.exceptions;

import com.example.canteen.food.model.dto.CartDTO;

public class CartException extends  RuntimeException{
    public CartException(String message) {
        super("Cart Service Error "  +message);
    }
}
