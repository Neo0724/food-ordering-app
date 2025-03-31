package com.example.canteen.food.controller;

import org.apache.el.stream.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.canteen.food.common.ResultCode;
import com.example.canteen.food.model.entity.Credit;
import com.example.canteen.food.service.CreditService;

import lombok.extern.slf4j.Slf4j;
//12 4ab 5b
//prac topic 3 lab 1 2 3  react navigation no sql W10 mt W11 prac
@RestController
@RequestMapping("/credits")
@Slf4j
public class CreditController {

    @Autowired
    private CreditService creditService;

    @GetMapping
    public ResultCode intializeUser(@RequestParam String userId) {
        creditService.intializeUser(userId);
        return ResultCode.success();
    }

    @GetMapping("/{userId}")
    public ResultCode getCreditList(@PathVariable String userId) {
        log.info("Query credit for {}" , userId);
         Credit user = creditService.getCreditList(userId);
        return ResultCode.success(user);

    }
}
