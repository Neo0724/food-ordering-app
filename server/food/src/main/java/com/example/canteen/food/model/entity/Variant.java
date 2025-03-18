package com.example.canteen.food.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "inventory_sizes")
public class Variant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sizeId;

    private String size;
    private BigDecimal price;
    private Integer onSale;

    // Many-to-One relationship: Many Variants belong to one Item
    @ManyToOne
    @JoinColumn(name = "itemId")
    @JsonBackReference
    private Item item;  // Make sure this points to your entity class 'Item'
}
