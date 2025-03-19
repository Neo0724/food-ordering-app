package com.example.canteen.food.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemVO {

    private Integer itemId;

    private String itemName;

    private String itemDescription;
    
    private String ingredient;

    private List<VariantVO> list;








}
