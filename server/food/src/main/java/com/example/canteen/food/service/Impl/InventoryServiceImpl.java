package com.example.canteen.food.service.Impl;

import com.example.canteen.food.model.dto.ItemDTO;
import com.example.canteen.food.model.entity.Item;
import com.example.canteen.food.model.entity.Variant;
import com.example.canteen.food.model.vo.ItemVO;
import com.example.canteen.food.repository.ItemRepository;
import com.example.canteen.food.repository.VariantRepository;
import com.example.canteen.food.service.InventoryService;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
@Slf4j
@Service
@Transactional
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private VariantRepository variantRepository;

    @Override
    public List<ItemVO> getList() {
        return itemRepository.findAll();
    }

    @Override
    public void addNewItem(ItemDTO itemDTO) {
        Item item = new Item();
        item.setItemName(itemDTO.getItemName());
        item.setItemDescription(itemDTO.getItemDescription());
        item.setIngredient(itemDTO.getIngredient());

        List<Variant> variants = itemDTO.getList().stream()
        .map(variantDTO -> {
            Variant variant = new Variant();
            variant.setSize(variantDTO.getSize());
            variant.setPrice(variantDTO.getPrice());
            variant.setOnSale(variantDTO.getOnSale());
            variant.setQuantity(variantDTO.getQuantity());
            variant.setItem(item);
            return variant;
        })
        .collect(Collectors.toList());

        item.setList(variants);

        itemRepository.save(item);
    }

    @Override
    public void modifyItem(ItemDTO itemDTO) {
        Item item = new Item();
        item.setItemId(itemDTO.getItemId());
        item.setItemName(itemDTO.getItemName());
        item.setItemDescription(itemDTO.getItemDescription());
        item.setIngredient(itemDTO.getIngredient());

        List<Variant> variants = itemDTO.getList().stream()
        .map(variantDTO -> {
            Variant variant = new Variant();
            variant.setSize(variantDTO.getSize());
            variant.setPrice(variantDTO.getPrice());
            variant.setOnSale(variantDTO.getOnSale());
            variant.setQuantity(variant.getQuantity());
            variant.setItem(item);
            return variant;
        })
        .collect(Collectors.toList());

        item.setList(variants);

        itemRepository.save(item);
    }


@Override
public void deleteItem(Integer sizeId) {
    // Check if the Variant exists before trying to delete it
    Variant variant = variantRepository.findById(sizeId)
            .orElseThrow(() -> new NoSuchElementException("Variant not found with sizeId: " + sizeId));

    variantRepository.deleteById(variant.getSizeId());
    variantRepository.flush();  
    log.info("Variant with sizeId {} deleted successfully.", variant.getSizeId());
}

    
}


