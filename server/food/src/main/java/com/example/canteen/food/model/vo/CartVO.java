package com.example.canteen.food.model.vo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.canteen.food.model.dto.enums.CartStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartVO {
    private Integer userId;
    private Integer cartId;
    private Integer itemId;
    private String size;
    private String itemName;
    private Integer sizeId;
    private Integer quantity;
    private Integer availableQuantity;
    private CartStatus status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private BigDecimal price;
}
