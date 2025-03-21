package com.example.canteen.food.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.canteen.food.model.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Integer> {

}
