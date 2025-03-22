package com.example.canteen.food.service;

import java.util.List;

import org.springframework.web.bind.annotation.RequestParam;

import com.example.canteen.food.model.vo.Order.OrderVO;

public interface OrderService {

    List<OrderVO> getOrderList(String userId);

    void deleteOrder(String orderId);

}
