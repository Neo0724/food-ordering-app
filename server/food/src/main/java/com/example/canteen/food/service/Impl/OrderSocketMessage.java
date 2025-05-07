package com.example.canteen.food.service.Impl;

import lombok.Data;

@Data
public class OrderSocketMessage {
    private String orderId;
    private String userId;
}
