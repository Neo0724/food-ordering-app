package com.example.canteen.food.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.canteen.food.common.ResultCode;
import com.example.canteen.food.model.dto.CartDTO;
import com.example.canteen.food.model.vo.Order.OrderVO;
import com.example.canteen.food.service.CartService;
import com.example.canteen.food.service.OrderService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@Slf4j
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResultCode getOrderList(@RequestParam Integer userId) {
        log.info("User id : {}", userId);
        List<OrderVO> orderVO = orderService.getOrderList(userId);
        return ResultCode.success(orderVO);
    }
    

    @PostMapping
    public ResultCode placeOrder(@RequestBody List<CartDTO> cartDTOs ) {
        cartService.placeOrder(cartDTOs);
        return ResultCode.success();
    }
}
