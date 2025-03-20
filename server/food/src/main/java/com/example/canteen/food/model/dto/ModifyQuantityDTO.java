package com.example.canteen.food.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModifyQuantityDTO {
    private Integer itemQuantity;
    private Integer cartId;
}
