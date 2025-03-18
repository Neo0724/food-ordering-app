package com.example.canteen.food.repository;


import com.example.canteen.food.model.entity.Variant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VariantRepository extends JpaRepository<Variant, Integer> {
    // You can add custom query methods if needed
}
