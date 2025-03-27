package com.example.canteen.food.service;

import java.math.BigDecimal;

public interface CreditService {

    void payWithCredit(BigDecimal totalPrice, String userId);

    void payWithPoint(BigDecimal totalPrice, String userId);

}
