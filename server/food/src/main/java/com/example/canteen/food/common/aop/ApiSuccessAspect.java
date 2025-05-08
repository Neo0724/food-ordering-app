package com.example.canteen.food.common.aop;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class ApiSuccessAspect {

   String controllerName, methodName;

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void restControllerMethods() {}

        @Before("restControllerMethods()")
    public void logBeforeExecution(JoinPoint joinPoint) {
         controllerName = joinPoint.getTarget().getClass().getSimpleName();
         methodName = joinPoint.getSignature().getName();
        log.info("Executing API [{}] in Controller [{}]", methodName, controllerName);
    }

    @AfterReturning(pointcut = "restControllerMethods()")
    public void logApiSuccess(JoinPoint joinPoint) {
         controllerName = joinPoint.getTarget().getClass().getSimpleName();
         methodName = joinPoint.getSignature().getName();
        log.info("API [{}] executed successfully in Controller [{}].", methodName, controllerName);
    }

    
}