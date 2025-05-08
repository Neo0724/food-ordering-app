package com.example.canteen.food.service.Impl;

import java.math.BigDecimal;
import java.util.Optional;

import com.example.canteen.food.common.exceptions.CreditException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.canteen.food.common.exceptions.OrderException;
import com.example.canteen.food.common.exceptions.UserException;
import com.example.canteen.food.model.entity.Credit;
import com.example.canteen.food.repository.CreditRepository;
import com.example.canteen.food.service.CreditService;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
public class CreditServiceImpl implements CreditService {

    @Autowired
    private CreditRepository creditRepository;

    @Override
    public void payWithCredit(BigDecimal totalPrice, String userId) {
        Integer awardedPoints = totalPrice.compareTo(BigDecimal.TEN) > 0  
        ? totalPrice.divide(BigDecimal.TEN).intValue()  
        : 1;

        Credit credit = creditRepository.findById(userId)
                .orElseThrow(() -> new CreditException("User not Found"));

        credit.setBalance(credit.getBalance().subtract(totalPrice));
        if(credit.getBalance().compareTo(BigDecimal.ZERO) <= 0) {
            throw new CreditException("Not enough balance ! ");
        }
        credit.setPoint(credit.getPoint() + awardedPoints);
        creditRepository.save(credit);
    }

    @Override
    public void payWithPoint(BigDecimal totalPrice, String userId) {
        Credit credit = creditRepository.findById(userId)
                .orElseThrow(() -> new CreditException("User not Found"));

        credit.setPoint(credit.getPoint() - totalPrice.multiply(BigDecimal.valueOf(BigDecimal.TEN.intValue())).intValue());

            if(credit.getPoint() < 0 ) {
                throw new CreditException("Credit not enough");
            }
            creditRepository.save(credit);
    }

    @Override
    public Credit getCreditList(String userId) {
        Credit credit = creditRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not Found"));
        return credit;
    }

    @Override
    public void intializeUser(String userId) {
        Credit credit = new Credit(userId, BigDecimal.ZERO, 0);
        log.info(credit.getUserId().toString());
       creditRepository.save(credit);
        
    }

    @Override
    public void addBalance(String userId, BigDecimal balance) {
        Credit userCredit = creditRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not Found"));

            userCredit.setBalance(userCredit.getBalance().add(balance));
            creditRepository.save(userCredit);
        }
        
    }

    

    

    
    

