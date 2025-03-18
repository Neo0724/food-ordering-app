package com.example.canteen.food.repository;

import com.example.canteen.food.model.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository<S extends Item, ID> extends JpaRepository<S, ID> { }
