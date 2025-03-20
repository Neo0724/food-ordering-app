package com.example.canteen.food.repository;

import com.example.canteen.food.model.dto.ItemDTO;
import com.example.canteen.food.model.entity.Item;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ItemRepository extends JpaRepository<Item, Integer> {

    @Query("SELECT i FROM Item i LEFT JOIN FETCH i.list")
    List<Item> findAllWithVariants();

}

