package com.example.canteen.food.model.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.canteen.food.model.dto.enums.CartStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orders")
@IdClass(OrderId.class)
public class Order {

    @Id
    @Column(name = "order_id")
    private String orderId;

    @Id
    @Column(name = "cart_id")
    private Integer cartId;

    @Column(name = "item_id", nullable = false)
    private Integer itemId;

    @Column(name = "size_id", nullable = false)
    private Integer sizeId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CartStatus status;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;
}
