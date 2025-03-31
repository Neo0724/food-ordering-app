package com.example.canteen.food.service.Impl;

import java.math.BigDecimal;
import java.util.Optional;

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
        
        Integer awardedPoints = totalPrice.divide(BigDecimal.valueOf(BigDecimal.TEN.intValue())).intValue();

        Optional<Credit> optionalCredit = creditRepository.findById(userId);

     if(optionalCredit.isPresent()){
        Credit credit = optionalCredit.get();

        credit.setBalance(credit.getBalance().subtract(totalPrice));
        if(credit.getBalance().compareTo(BigDecimal.ZERO) <= 0) {
            throw new OrderException("Not enough balance ! ");
            
        }
        credit.setPoint(credit.getPoint() + awardedPoints);

        creditRepository.save(credit);
     }else {
        log.info("User not found");
        throw new OrderException("User not found! ");
     }
    }

    @Override
    public void payWithPoint(BigDecimal totalPrice, String userId) {
        Optional<Credit> optionalCredit = creditRepository.findById(userId);
        if (optionalCredit.isPresent()) {
            Credit credit = optionalCredit.get();
            credit.setPoint(credit.getPoint() - totalPrice.multiply(BigDecimal.valueOf(BigDecimal.TEN.intValue())).intValue());

            if(credit.getPoint() < 0 ) {
                throw new OrderException("Credit not enough");
            }
            
            creditRepository.save(credit);

        } else {
            throw new OrderException("User not found !");
        }

        
    }

    @Override
    public Credit getCreditList(String userId) {
        Optional<Credit> credit = creditRepository.findById(userId);
        if (credit.isPresent()) {
            return credit.get();  
        } else {
            throw new UserException("User not found");
        }
    }

    @Override
    public void intializeUser(String userId) {
        Credit credit = new Credit(userId, BigDecimal.ZERO, 0);
        log.info(credit.getUserId().toString());
       creditRepository.save(credit);
        
    }

    

    
    
}
