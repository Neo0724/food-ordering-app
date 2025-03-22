package com.example.canteen.food.model.entity;

import java.io.Serializable;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderId implements Serializable {
    private UUID orderId;
    private Integer cartId; // Changed from Long to Integer to match your Cart entity's cartId type
}
