package com.example.canteen.food.controller;

import com.example.canteen.food.model.dto.ModifyQuantityDTO;
import com.example.canteen.food.model.vo.CartVO;
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

import java.util.List;

@RestController
@RequestMapping("/products")
@Slf4j
public class CartController {

        @Autowired
        private CartService cartService;

        //Get cart list
        @GetMapping
        public ResultCode getCartList(@RequestParam String userId) {
                log.info("Get cart list !");
                List<CartVO> cartVO = cartService.getCartList(userId);
                return ResultCode.success(cartVO);
        }

        //Add food into cart
        @PostMapping
        public ResultCode addToCart(@RequestBody CartDTO cartDTO) {
                log.info("Add food into cart !");
                cartService.addToCart(cartDTO);
                return ResultCode.success();
        }

        //Modify cart food quantity
        @PutMapping
        public ResultCode modifyQuantity(@RequestBody ModifyQuantityDTO modifyQuantityDTO) {
                log.info("Modify cart food quantity !");
                cartService.modifyQuantity(modifyQuantityDTO);
                return ResultCode.success();
        }

        //Delete cart
        @DeleteMapping
        public ResultCode deleteCart(@RequestParam Integer cartId) {
                log.info("Delete cart !");
                cartService.deleteCart(cartId);
                return ResultCode.success();
        }

}
