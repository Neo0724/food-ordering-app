package com.example.canteen.food.model.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import jakarta.validation.constraints.NotNull;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemDTO {

    private Integer itemId;

    private String itemName;

    private String itemDescription;

    private String ingredient; 

    private List<VariantDTO> list;
}



