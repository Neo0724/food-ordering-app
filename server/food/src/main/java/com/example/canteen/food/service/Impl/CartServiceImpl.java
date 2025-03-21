package com.example.canteen.food.service.Impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import com.example.canteen.food.model.dto.ModifyQuantityDTO;
import com.example.canteen.food.model.dto.enums.CartStatus;
import com.example.canteen.food.model.entity.Item;
import com.example.canteen.food.model.entity.Variant;
import com.example.canteen.food.model.vo.CartVO;
import com.example.canteen.food.repository.ItemRepository;
import com.example.canteen.food.repository.VariantRepository;
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

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private VariantRepository variantRepository;

    public List<CartVO> getCartList(Integer userId) {
        return cartRepository.findCartsByUserId(userId);
    }

    @Override
    public void addToCart(CartDTO cartDTO) {

        // itemRepository.findById(cartDTO.getItemId())
        // .orElseThrow(() -> new IllegalArgumentException("Item with ID " +
        // cartDTO.getItemId() + " not found"));
        // variantRepository.findById(cartDTO.getSizeId())
        // .orElseThrow(() -> new IllegalArgumentException("Variant with ID " +
        // cartDTO.getSizeId() + " not found"));

        Cart cart = new Cart();

        Item item = new Item();
        item.setItemId(cartDTO.getItemId());
        cart.setItem(item);

        Variant variant = new Variant();
        variant.setSizeId(cartDTO.getSizeId());
        cart.setVariant(variant);

        cart.setUserId(cartDTO.getUserId());
        cart.setQuantity(cartDTO.getQuantity());
        cart.setStatus(CartStatus.ACTIVE);
        cart.setCreateTime(LocalDateTime.now());
        cart.setUpdateTime(LocalDateTime.now());

        cartRepository.save(cart);
    }

    @Override
    public void modifyQuantity(ModifyQuantityDTO modifyQuantityDTO) {

        Cart cart = cartRepository.findById(modifyQuantityDTO.getCartId())
                .orElseThrow(
                        () -> new NoSuchElementException("Cart not found with id: " + modifyQuantityDTO.getCartId()));

        cart.setQuantity(modifyQuantityDTO.getItemQuantity());

        cartRepository.save(cart);
    }

    @Override
    public void deleteCart(Integer cartId) {
        cartRepository.deleteById(cartId);
    }

}
