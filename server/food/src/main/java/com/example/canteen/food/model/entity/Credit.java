package com.example.canteen.food.model.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "credit")
public class Credit {

    @Id
    @Column(name = "user_id")
    private String userId;

    @Column(name = "balance")
    private BigDecimal balance;

    @Column(name = "point")
    private Integer point;

    
    
}