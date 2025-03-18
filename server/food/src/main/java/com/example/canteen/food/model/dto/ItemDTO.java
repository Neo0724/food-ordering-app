package com.example.canteen.food.model.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemDTO {

    private String itemName;

    private String itemDescription;

    private List<VariantDTO> list;
}
