package com.example.canteen.food.common;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
@Slf4j
public class Exception {
    @ExceptionHandler
    public ResultCode handleException (Exception e) {
        log.error("System error", e);
        return ResultCode.error("System error, Please contact developer or refresh Page");
    }

}
