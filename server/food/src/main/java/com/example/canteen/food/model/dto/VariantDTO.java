package com.example.canteen.food.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VariantDTO {
    private String size;
    private BigDecimal price;
    private Integer onSale;
}
