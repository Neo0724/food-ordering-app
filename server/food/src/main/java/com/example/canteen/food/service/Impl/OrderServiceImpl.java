package com.example.canteen.food.service.Impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.canteen.food.model.vo.Order.ItemPerOrder;
import com.example.canteen.food.model.vo.Order.OrderVO;
import com.example.canteen.food.repository.OrderRepository;
import com.example.canteen.food.service.OrderService;

import jakarta.transaction.Transactional;
@Transactional
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public List<OrderVO> getOrderList(Integer userId) {
        
        // Map to group items by orderId
        Map<UUID, List<ItemPerOrder>> map = new HashMap<UUID, List<ItemPerOrder>>();


        // Fetch all items related to the user from the repository
        orderRepository.findOrderItem(userId).forEach(order -> {
            UUID orderId = order.getOrderId();
            ItemPerOrder item = new ItemPerOrder(
                    orderId,
                    order.getCartId(),
                    order.getItemId(),
                    order.getItemName(),
                    order.getSizeId(),
                    order.getSize(),
                    order.getPrice(),
                    order.getQuantity(),
                    order.getStatus(),
                    order.getCreateTime(),
                    order.getUpdateTime()
            );
    
            // Grouping by orderId
            map.computeIfAbsent(orderId, k -> new ArrayList<>()).add(item);
        });
    
        // Convert map to List<OrderVO>
        return map.entrySet().stream()
                .map(entry -> {
                    List<ItemPerOrder> items = entry.getValue();
                    UUID orderId = entry.getKey();
                    String status = items.get(0).getStatus();
                    return new OrderVO(items, orderId, status);
                })
                .collect(Collectors.toList());
    }
    
    
    
    


    

}
