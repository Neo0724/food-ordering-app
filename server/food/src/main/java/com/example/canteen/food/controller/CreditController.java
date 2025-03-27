package com.example.canteen.food.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.canteen.food.common.ResultCode;

import lombok.extern.slf4j.Slf4j;
//12 4ab 5b
//prac topic 3 lab 1 2 3  react navigation no sql W10 mt W11 prac
@RestController
@RequestMapping("/credits/{userId}")
@Slf4j
public class CreditController {

    @GetMapping
    public ResultCode getCreditList(@PathVariable String userId) {
        log.info("Query credit for {}" , userId);
        
        return ResultCode.success();

    }
}
