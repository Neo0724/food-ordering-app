package com.example.canteen.food.common.exceptions;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.canteen.food.common.ResultCode;

@RestControllerAdvice
public class GlobalException {
@ExceptionHandler(OrderException.class)

    public ResultCode handleOrderException(OrderException ex) {
        return ResultCode.error(ex.toString());
    }
}
