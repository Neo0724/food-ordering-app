package com.example.canteen.food.common.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class SQLiteConfig {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Bean
    public ApplicationRunner initializeForeignKeys() {
        return args -> {
            jdbcTemplate.execute("PRAGMA foreign_keys = ON;");
            System.out.println("Foreign keys enabled.");
        };
    }
}
