package com.example.canteen.food.model.vo.Order;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

import com.example.canteen.food.model.dto.enums.CartStatus;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderVO {
    private List<ItemPerOrder> itemPerOrders;
    private String orderId;
    private CartStatus status;

}