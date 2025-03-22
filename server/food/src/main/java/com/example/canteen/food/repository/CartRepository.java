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
            "c.item.itemId, " +
            "c.variant.size, " +
            "c.item.itemName, " +
            "c.variant.sizeId, " +
            "c.quantity, " +
            "v.quantity as availableQuantity, " +
            "c.status, " +
            "c.createTime, " +
            "c.updateTime, " +
            "c.variant.price) " +
            "FROM Cart c " +
            "JOIN c.item i " +
            "JOIN c.variant v " +
            "WHERE c.userId = :userId " +
            "ORDER BY c.createTime DESC")
    List<CartVO> findCartsByUserId(@Param("userId") String userId);
}
