package com.example.canteen.food.service.Impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

import com.example.canteen.food.model.dto.ModifyQuantityDTO;
import com.example.canteen.food.model.dto.enums.CartStatus;
import com.example.canteen.food.model.entity.Item;
import com.example.canteen.food.model.entity.Order;
import com.example.canteen.food.model.entity.Variant;
import com.example.canteen.food.model.vo.CartVO;
import com.example.canteen.food.repository.ItemRepository;
import com.example.canteen.food.repository.OrderRepository;
import com.example.canteen.food.repository.VariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.canteen.food.common.exceptions.OrderException;
import com.example.canteen.food.model.dto.CartDTO;
import com.example.canteen.food.model.entity.Cart;
import com.example.canteen.food.repository.CartRepository;
import com.example.canteen.food.service.CartService;
import org.springframework.beans.BeanUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private VariantRepository variantRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<CartVO> getCartList(String userId) {
        return cartRepository.findCartsByUserId(userId);
    }

    @Override
    public void addToCart(CartDTO cartDTO) {

        Cart cart = new Cart();

        cart.setStatus(CartStatus.ACTIVE);
        cart.setCreateTime(LocalDateTime.now());
        cart.setUpdateTime(LocalDateTime.now());
        BeanUtils.copyProperties(cartDTO, cart);
        cartRepository.save(cart);
    }

    @Override
    public void modifyQuantity(ModifyQuantityDTO modifyQuantityDTO) {

        Cart cart = cartRepository.findById(modifyQuantityDTO.getCartId())
                .orElseThrow(
                        () -> new OrderException("Cart not found with id: " + modifyQuantityDTO.getCartId()));

        cart.setQuantity(modifyQuantityDTO.getItemQuantity());
        log.info("Current cart quantity: " + modifyQuantityDTO.getItemQuantity().toString());

        cartRepository.save(cart);
    }

    @Override
    public void deleteCart(Integer cartId) {
        cartRepository.deleteById(cartId);
    }

    public void placeOrder(List<CartDTO> cartDTOs) {
        String uuid = UUID.randomUUID().toString();
        cartDTOs.forEach(x ->  x.setOrderId(uuid));

        cartDTOs.forEach(cartDTO -> {
            Order order = new Order();
            BeanUtils.copyProperties(cartDTO, order);
            orderRepository.save(order);
        });

//
//        List<Order> orders = cartDTOs.stream().map(dto -> {
//
//
//          order.setItemId(dto.getItemId());
//          order.setSizeId(dto.getSizeId());
//          order.setCartId(dto.getCartId());
//            order.setOrderId(dto.getOrderId());
//            order.setUserId(dto.getUserId());
//            order.setStatus(CartStatus.ORDERED);
//            order.setQuantity(dto.getQuantity());
//            order.setCreateTime(LocalDateTime.now());
//            order.setUpdateTime(LocalDateTime.now());
//
//            return order;
//        }).collect(Collectors.toList());



//        orderRepository.saveAll(orders);
    }
    

}
