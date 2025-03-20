package com.example.canteen.food.service.Impl;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.canteen.food.model.dto.CartDTO;
import com.example.canteen.food.model.entity.Cart;
import com.example.canteen.food.repository.CartRepository;
import com.example.canteen.food.service.CartService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CartServiceImpl implements CartService {
    
    @Autowired
    private CartRepository cartRepository;

    @Override
    public void addToCart(CartDTO cartDTO) {

        Cart cart = new Cart();

        cart.setItemId(cartDTO.getItemId());
        cart.setSizeId(cartDTO.getSizeId());
        cart.setUserId(cartDTO.getUserId());
        cart.setQuantity(cartDTO.getQuantity());
        cart.setStatus(cartDTO.getStatus());
        cart.setCreateTime(LocalDateTime.now());
        cart.setUpdateTime(LocalDateTime.now());

        cartRepository.save((cart));
    }

    @Override
    public void modifyQuantity(Integer itemQuantity, Integer cartId) {

    
    Cart cart = cartRepository.findById(cartId)
    .orElseThrow(() -> new NoSuchElementException("Cart not found with id: " + cartId));

    cart.setQuantity(itemQuantity);

    cartRepository.save(cart);
    }

    @Override
    public void deleteCart(Integer cartId) {
       cartRepository.deleteById(cartId);
    }

    


    


    
    
}
