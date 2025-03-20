package com.example.canteen.food.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.example.canteen.food.model.dto.enums.CartStatus;

@Entity
@Table(name = "cart")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Integer cartId;

    @Column(name = "item_id", nullable = false, insertable = false, updatable = false)
    private Integer itemId;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    @Column(name = "size_id", insertable = false, updatable = false)
    private Integer sizeId;

    @ManyToOne
    @JoinColumn(name = "size_id")
    private Variant variant;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CartStatus status;

    @Column(name = "create_time", nullable = false)
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;
}

