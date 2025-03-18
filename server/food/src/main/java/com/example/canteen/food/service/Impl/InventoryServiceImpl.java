package com.example.canteen.food.service.Impl;

import com.example.canteen.food.model.dto.ItemDTO;
import com.example.canteen.food.model.entity.Item;
import com.example.canteen.food.model.entity.Variant;
import com.example.canteen.food.model.vo.ItemVO;
import com.example.canteen.food.repository.ItemRepository;
import com.example.canteen.food.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Transactional
@Service
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    private ItemRepository itemRepository;

    @Override
    public List<ItemVO> getList() {
        return itemRepository.findAll();
    }

    @Override
    public void addNewItem(ItemDTO itemDTO) {
        Item item = new Item();
        item.setItemName(itemDTO.getItemName());
        item.setItemDescription(itemDTO.getItemDescription());

        // Convert Variants
        List<Variant> variants = itemDTO.getList().stream().map(variantDTO -> {
            Variant variant = new Variant();
            variant.setSize(variantDTO.getSize());
            variant.setPrice(variantDTO.getPrice());
            variant.setOnSale(variantDTO.getOnSale());
            variant.setItem(item);
            return variant;
        }).toList();

        item.setList(variants);

        itemRepository.save(item);
    }
}
