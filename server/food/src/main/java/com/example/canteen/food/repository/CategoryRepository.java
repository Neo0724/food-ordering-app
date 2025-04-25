package com.example.canteen.food.repository;

import com.example.canteen.food.model.entity.Category;
import com.example.canteen.food.model.entity.Credit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer > {
}
