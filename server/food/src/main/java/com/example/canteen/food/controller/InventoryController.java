package com.example.canteen.food.controller;

import com.example.canteen.food.common.ResultCode;
import com.example.canteen.food.model.dto.ItemDTO;
import com.example.canteen.food.model.vo.ItemVO;
import com.example.canteen.food.service.InventoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/inventorys")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public ResultCode getList() {
        List<ItemVO> item = inventoryService.getList();
        return ResultCode.success(item);
    }

    @PostMapping
    public ResultCode addNewItem(@RequestBody ItemDTO item) {
        inventoryService.addNewItem(item);
        return  ResultCode.success();
    }
}
