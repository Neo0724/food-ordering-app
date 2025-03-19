package com.example.canteen.food.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VariantVO {
    private Integer sizeId;
    private Integer itemId;
    private String size;
    private BigDecimal price;
    private Integer onSale;
    private Integer quantity;
}
