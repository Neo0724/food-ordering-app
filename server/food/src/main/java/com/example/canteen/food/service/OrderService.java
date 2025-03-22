package com.example.canteen.food.service;

import java.util.List;

import com.example.canteen.food.model.vo.Order.OrderVO;

public interface OrderService {

    List<OrderVO> getOrderList(Integer userId);

}
