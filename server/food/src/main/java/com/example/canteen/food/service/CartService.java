package com.example.canteen.food.service;

import com.example.canteen.food.model.dto.CartDTO;

public interface CartService {

    void addToCart(CartDTO cartDTO);

    void modifyQuantity(Integer itemQuantity, Integer cartId);

    void deleteCart(Integer cartId);

}
