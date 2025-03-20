package com.example.canteen.food.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.canteen.food.model.entity.Cart;
import com.example.canteen.food.model.entity.Item;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer>  {

}
