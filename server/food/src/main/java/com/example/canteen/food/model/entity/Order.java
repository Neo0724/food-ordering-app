package com.example.canteen.food.model.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orders")
<<<<<<< HEAD
@IdClass(OrderId.class)
=======

>>>>>>> 6cddcafce020e3019f4719bde2d720e3759e2150
public class Order {

    @Id
    @Column(name = "order_id", columnDefinition = "BINARY(16)")
    private UUID orderId;

    @Id
    @Column(name = "cart_id")
    private Integer cartId;

    @Column(name = "item_id", nullable = false)
    private Integer itemId;

    @Column(name = "size_id", nullable = false)
    private Integer sizeId;

    private String userId;

    private String status;

    private Integer quantity;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;
<<<<<<< HEAD
}
=======
}
>>>>>>> 6cddcafce020e3019f4719bde2d720e3759e2150
