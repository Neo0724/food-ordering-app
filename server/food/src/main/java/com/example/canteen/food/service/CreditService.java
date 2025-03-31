package com.example.canteen.food.service;

import java.math.BigDecimal;
import java.util.Optional;

import com.example.canteen.food.model.entity.Credit;

public interface CreditService {

    void payWithCredit(BigDecimal totalPrice, String userId);

    void payWithPoint(BigDecimal totalPrice, String userId);

    void intializeUser(String userId);

    Credit getCreditList(String userId);

}
