package com.example.canteen.food.service.Impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import org.springframework.boot.autoconfigure.web.reactive.function.client.WebClientAutoConfiguration;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.aspectj.weaver.ast.Or;
import org.springframework.http.MediaType;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import com.example.canteen.food.model.dto.enums.CartStatus;
import com.example.canteen.food.model.entity.Order;
import com.example.canteen.food.model.entity.OrderId;
import com.example.canteen.food.model.vo.Order.ItemPerOrder;
import com.example.canteen.food.model.vo.Order.OrderVO;
import com.example.canteen.food.repository.OrderRepository;
import com.example.canteen.food.service.OrderService;

import jakarta.persistence.IdClass;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Transactional
@Service
@Slf4j
public class OrderServiceImpl implements OrderService {
    private final WebClient webClient;
    @Autowired
    private OrderRepository orderRepository;

    public OrderServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:3000").build();
    }
    @Override
    public List<OrderVO> getOrderList(String userId) {
        
        // Map to group items by orderId
        Map<String, List<ItemPerOrder>> map = new LinkedHashMap<>();

        // Fetch all items related to the user from the repository
        orderRepository.findOrderItem(userId).forEach(order -> {
            log.info("order: {} " , order);
            String orderId = order.getOrderId();
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
                    String orderId = entry.getKey();
                    CartStatus status = items.get(0).getStatus();
                    return new OrderVO(items, orderId, status);
                })
                .collect(Collectors.toList());
    }

    @Override
    public void deleteOrder(String orderId) {
        orderRepository.updateCancelStatus(orderId);
    }
    @Override
    public void updateOrder(String orderId) {
        orderRepository.updateCompleteStatus(orderId);
        List<String> userIds = orderRepository.getUserIdsByOrderId(orderId);

        if(userIds.isEmpty()) {
            throw new RuntimeException("Order ID is not associated with any users");
        }

        String userId = userIds.get(0);

        OrderSocketMessage orderSocketMessage = new OrderSocketMessage();
        orderSocketMessage.setOrderId(orderId);
        orderSocketMessage.setUserId(userId);
        Mono<OrderSocketMessage> orderSocketMessageMono = Mono.just(orderSocketMessage);


        webClient.post()
                .uri("/update-order")
                .contentType(MediaType.APPLICATION_JSON)
                .body(orderSocketMessageMono, OrderSocketMessage.class)
                .retrieve()
                .bodyToMono(String.class)
                .subscribe(response -> log.info("Test socket: {}", response));
    }

    public void testSocket() {
//        List<ItemPerOrder> order = orderRepository.findOrderItem("A0i2YKDmUeQO4SbXAQntoIS7zAT2");

    }
    
    
    
    
    


    

}
