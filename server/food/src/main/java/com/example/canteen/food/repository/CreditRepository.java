package com.example.canteen.food.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.canteen.food.model.entity.Credit;

@Repository
public interface CreditRepository extends JpaRepository<Credit, String > {

}
