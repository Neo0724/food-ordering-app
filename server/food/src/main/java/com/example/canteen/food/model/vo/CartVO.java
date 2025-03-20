package com.example.canteen.food.model.vo;

import java.time.LocalDateTime;

import com.example.canteen.food.model.dto.enums.CartStatus;

public class CartVO {
    private Integer cartId;
    private Integer itemId;
    private Integer sizeId;
    private Integer quantity;
    private CartStatus status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
