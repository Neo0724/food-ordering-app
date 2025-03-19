package com.example.canteen.food.service;
import com.example.canteen.food.model.dto.ItemDTO;
import com.example.canteen.food.model.vo.ItemVO;
import org.springframework.stereotype.Service;

import java.util.List;


public interface InventoryService {
    List<ItemVO> getList();

    void addNewItem(ItemDTO item);

    void modifyItem(ItemDTO item);

    void deleteItem(Integer sizeId);
}
