package com.example.canteen.food.model.dto;

import java.time.LocalDateTime;

import com.example.canteen.food.model.dto.enums.CartStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class CartDTO {

    private Integer cartId;
    private Integer itemId;
    private Integer userId;
    private Integer sizeId;
    private Integer quantity;
    private CartStatus status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
