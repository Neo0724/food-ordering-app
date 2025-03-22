package com.example.canteen.food.model.entity;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderId implements Serializable {
    private String orderId;
    private Integer cartId; // Changed from Long to Integer to match your Cart entity's cartId type

       @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderId orderId1 = (OrderId) o;
        return Objects.equals(orderId, orderId1.orderId) &&
                Objects.equals(cartId, orderId1.cartId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderId, cartId);
    }
}
