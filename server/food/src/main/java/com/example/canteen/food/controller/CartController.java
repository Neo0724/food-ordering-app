package com.example.canteen.food.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.canteen.food.common.ResultCode;
import com.example.canteen.food.model.dto.CartDTO;
import com.example.canteen.food.service.CartService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/products")
@Slf4j
public class CartController {

        @Autowired
        private CartService cartService;

//        {
//
//                "cartId": 1,
//                "itemId": 102,
//                "userId": 2,
//                "sizeId": 1,
//                "quantity": 10
//        }

        @GetMapping
        public ResultCode getCartList() {
                return null;
        }

        @PostMapping
        public ResultCode addToCart(@RequestBody CartDTO cartDTO ) {
                cartService.addToCart(cartDTO);
                return ResultCode.success();
        }

        @PutMapping
        public ResultCode modifyQuantity (@RequestBody Integer itemQuantity, @RequestBody Integer cartId) {
                cartService.modifyQuantity(itemQuantity, cartId);
                return ResultCode.success();
        }

        @DeleteMapping
        public ResultCode deleteCart(@RequestParam Integer cartId) {
                cartService.deleteCart(cartId);
                return ResultCode.success();
        }


}
