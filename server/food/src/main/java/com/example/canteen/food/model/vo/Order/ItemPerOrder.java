package com.example.canteen.food.model.vo.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.example.canteen.food.model.dto.enums.CartStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemPerOrder {
    private String orderId;
    private Integer cartId;
    private Integer itemId;
    private String itemName;
    private Integer sizeId; 
    private String size;
    private BigDecimal price;
    private Integer quantity;
    private CartStatus status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
