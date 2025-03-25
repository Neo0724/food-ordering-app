package com.example.canteen.food.repository;

import com.example.canteen.food.model.entity.Cart;
import com.example.canteen.food.model.vo.CartVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

    @Query("SELECT new com.example.canteen.food.model.vo.CartVO( " +
    "c.userId, " +
    "c.cartId, " +
    "c.itemId, " +
    "v.size, " +
    "i.itemName, " +
    "c.sizeId, " +
    "c.quantity, " +
    "v.quantity, " +
    "c.status, " +
    "c.createTime, " +
    "c.updateTime, " +
    "v.price) " +
    "FROM Cart c " +
    "JOIN Item i ON c.itemId = i.itemId " +
    "JOIN Variant v ON c.sizeId = v.sizeId " +
    "WHERE c.userId = :userId AND c.status = com.example.canteen.food.model.dto.enums.CartStatus.ACTIVE")
List<CartVO> findCartsByUserId(@Param("userId") String userId);
}
