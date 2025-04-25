package com.example.canteen.food.controller;

import com.example.canteen.food.common.ResultCode;
import com.example.canteen.food.model.dto.ItemDTO;
import com.example.canteen.food.model.entity.Item;
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
    public ResultCode getList(@RequestParam String searchCriteria) {
        List<ItemVO> item = inventoryService.getList(searchCriteria);
        return ResultCode.success(item);
    }

    @PostMapping
    public ResultCode addNewItem(@RequestBody List<ItemDTO> item) {
        for (ItemDTO itemDTO : item) {
            inventoryService.addNewItem(itemDTO);
        }
        return  ResultCode.success();
    }

    @PutMapping
    public ResultCode modifyItem(@RequestBody ItemDTO item) {
        inventoryService.modifyItem(item);
        return ResultCode.success();
    }

    @DeleteMapping
    public ResultCode deleteItem(@RequestParam Integer sizeId) {
        log.info("Size id is : {}" , sizeId);
        inventoryService.deleteItem(sizeId);
        return ResultCode.success();
    }
}
