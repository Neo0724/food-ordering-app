package com.example.canteen.food.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.canteen.food.common.ResultCode;
import com.example.canteen.food.model.dto.CartDTO;
import com.example.canteen.food.service.CartService;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private CartService cartService;

    @PostMapping
    public ResultCode placeOrder(@RequestBody List<CartDTO> cartDTOs ) {
        cartService.placeOrder(cartDTOs);
        return ResultCode.success();
    }
}
