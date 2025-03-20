package com.example.canteen.food.common;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.NoSuchElementException;

@Slf4j
public class Exception {

    @ExceptionHandler(NoSuchElementException.class)
    public ResultCode handleNoSuchElementException(NoSuchElementException e) {
        log.error(e.getMessage());
        return ResultCode.error(e.getMessage());
    }

    @ExceptionHandler
    public ResultCode handleException (Exception e) {
        log.error("System error", e);
        return ResultCode.error("System error, Please contact developer or refresh Page");
    }

}
