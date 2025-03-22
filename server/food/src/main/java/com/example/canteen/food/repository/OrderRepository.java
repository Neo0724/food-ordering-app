package com.example.canteen.food.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.canteen.food.model.entity.Order;
import com.example.canteen.food.model.entity.OrderId;
import com.example.canteen.food.model.vo.Order.ItemPerOrder;


@Repository
public interface OrderRepository extends JpaRepository<Order, OrderId> {

    @Query("SELECT new com.example.canteen.food.model.vo.Order.ItemPerOrder( " +
    "o.orderId, " +
    "o.cartId, " +
    "o.itemId, " +
    "i.itemName, " +
    "o.sizeId, " +
    "v.size, " +
    "v.price, " +
    "o.quantity, " +
    "o.status, " +
    "o.createTime, " +
    "o.updateTime) " +
    "FROM Order o " +
    "JOIN Item i ON o.itemId = i.itemId " +
    "JOIN Variant v ON o.sizeId = v.sizeId " +
    "WHERE o.userId = :userId")
List<ItemPerOrder> findOrderItem(@Param("userId") String userId);

    @Modifying
    @Query("DELETE FROM Order o WHERE o.orderId = :orderId")    
    void deleteByOrderId(String orderId);
}

