package com.example.canteen.food.service;

import com.example.canteen.food.model.dto.CartDTO;
import com.example.canteen.food.model.dto.ModifyQuantityDTO;
import com.example.canteen.food.model.vo.CartVO;
import com.example.canteen.food.model.vo.Order.OrderVO;

import java.util.List;

public interface CartService {

    void addToCart(CartDTO cartDTO);

    void modifyQuantity(ModifyQuantityDTO modifyQuantityDTO);

    void deleteCart(Integer cartId);

    List<CartVO> getCartList(Integer userId);

    void placeOrder(List<CartDTO> cartDTOs);
}
