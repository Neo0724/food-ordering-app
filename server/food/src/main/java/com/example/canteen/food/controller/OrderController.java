package com.example.canteen.food.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.canteen.food.common.ResultCode;
import com.example.canteen.food.model.dto.CartDTO;
import com.example.canteen.food.model.dto.enums.CartStatus;
import com.example.canteen.food.model.vo.Order.OrderVO;
import com.example.canteen.food.service.CartService;
import com.example.canteen.food.service.CreditService;
import com.example.canteen.food.service.OrderService;

import lombok.extern.slf4j.Slf4j;


@RestController
@Slf4j
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private CreditService creditService;

    @GetMapping
    public ResultCode getOrderList(@RequestParam String userId) {
        log.info("User id : {}", userId);
        List<OrderVO> orderVO = orderService.getOrderList(userId);
        return ResultCode.success(orderVO);
    }

    @PostMapping
    public ResultCode placeOrder(@RequestParam BigDecimal totalPrice, @RequestParam Boolean isPoint, @RequestBody List<CartDTO> cartDTOs) {
        String userId = cartDTOs.get(0).getUserId();
        if (isPoint == true) {
            creditService.payWithPoint(totalPrice, userId);
        } else if (totalPrice != null) {
            creditService.payWithCredit(totalPrice, userId);
        }

        cartDTOs.forEach((cartDTO -> cartDTO.setStatus(CartStatus.ORDERED)));
        cartService.placeOrder(cartDTOs);
        return ResultCode.success();
    }

    @PutMapping
    public void updateOrder(@RequestParam String orderId) {
        orderService.updateOrder(orderId);
    }

    @DeleteMapping
    public ResultCode deleteOrder(@RequestParam String orderId) {
        orderService.deleteOrder(orderId);
        return ResultCode.success();
    }
}
