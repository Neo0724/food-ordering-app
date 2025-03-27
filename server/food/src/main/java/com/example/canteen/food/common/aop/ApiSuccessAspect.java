package com.example.canteen.food.common.aop;
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
public class ApiSuccessAspect {

    private static final Logger logger = LoggerFactory.getLogger(ApiSuccessAspect.class);

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void restControllerMethods() {}

        @Before("restControllerMethods()")
    public void logBeforeExecution(JoinPoint joinPoint) {
        String controllerName = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        logger.info("🔄 Executing API [{}] in Controller [{}]", methodName, controllerName);
    }

    @AfterReturning(pointcut = "restControllerMethods()")
    public void logApiSuccess(JoinPoint joinPoint) {
        String controllerName = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        logger.info("✅ API [{}] executed successfully in Controller [{}].", methodName, controllerName);
    }

    
}