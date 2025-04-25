package com.example.canteen.food.repository;

import com.example.canteen.food.model.entity.Category;
import com.example.canteen.food.model.entity.Credit;
import com.example.canteen.food.model.entity.Item;
import com.example.canteen.food.model.vo.CategoryVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer > {

    @Query(value = """
    SELECT c.category_id, c.category_name
    FROM category c
    WHERE LOWER(c.category_name) LIKE LOWER(CONCAT('%', :categoryName, '%'))
    LIMIT 1
    """, nativeQuery = true)
    CategoryVO checkIfCategoryAlreadyExists(String categoryName);
}
