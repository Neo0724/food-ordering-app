package com.example.canteen.food.service.Impl;

import com.example.canteen.food.common.exceptions.OrderException;
import com.example.canteen.food.model.dto.ItemDTO;
import com.example.canteen.food.model.dto.VariantDTO;
import com.example.canteen.food.model.entity.Item;
import com.example.canteen.food.model.entity.Order;
import com.example.canteen.food.model.entity.Variant;
import com.example.canteen.food.model.vo.ItemVO;
import com.example.canteen.food.model.vo.VariantVO;
import com.example.canteen.food.repository.ItemRepository;
import com.example.canteen.food.repository.VariantRepository;
import com.example.canteen.food.service.InventoryService;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
    // Retrieve all Items from the database
    List<Item> items = itemRepository.findAllWithVariants();
    if(items.isEmpty()) {
        throw new OrderException("No items found ");
    }
    
    // Convert each Item to ItemVO and return the list
    return items.stream().map(item -> {
        ItemVO itemVO = new ItemVO();
        itemVO.setItemId(item.getItemId());
        itemVO.setItemName(item.getItemName());
        itemVO.setItemDescription(item.getItemDescription());
        itemVO.setIngredient(item.getIngredient());
        
        // Map variants if needed
        itemVO.setList(item.getList().stream().map(variant -> {
            VariantVO variantVO = new VariantVO();
            variantVO.setSizeId(variant.getSizeId());
            variantVO.setItemId(variant.getItem().getItemId());
            variantVO.setSize(variant.getSize());
            variantVO.setPrice(variant.getPrice());
            variantVO.setOnSale(variant.getOnSale());
            variantVO.setQuantity(variant.getQuantity());
            return variantVO;
        }).collect(Collectors.toList()));

        return itemVO;
    }).collect(Collectors.toList());
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
    //return exisitng item with id
    Item item = itemRepository.findById(itemDTO.getItemId())
            .orElseThrow(() -> new OrderException("Item not found with ID: " + itemDTO.getItemId()));


    item.setItemName(itemDTO.getItemName());
    item.setItemDescription(itemDTO.getItemDescription());
    item.setIngredient(itemDTO.getIngredient());


    Map<Integer, Variant> existingVariantsMap = item.getList().stream()
            .collect(Collectors.toMap(Variant::getSizeId, variant -> variant));

    List<Variant> updatedVariants = new ArrayList<>();


    for (VariantDTO variantDTO : itemDTO.getList()) {
        Variant variant = existingVariantsMap.get(variantDTO.getSizeId());

        if (variant != null) {

            variant.setPrice(variantDTO.getPrice());
            variant.setOnSale(variantDTO.getOnSale());
            variant.setQuantity(variantDTO.getQuantity());
            updatedVariants.add(variant);
        } else {

            Variant newVariant = new Variant();
            newVariant.setSize(variantDTO.getSize());
            newVariant.setPrice(variantDTO.getPrice());
            newVariant.setOnSale(variantDTO.getOnSale());
            newVariant.setQuantity(variantDTO.getQuantity());
            newVariant.setItem(item);
            updatedVariants.add(newVariant);
        }
    }

    item.setList(updatedVariants);

    itemRepository.save(item);
}

    

@Override
public void deleteItem(Integer sizeId) {
    // Check if the Variant exists before trying to delete it
    Variant variant = variantRepository.findById(sizeId)
            .orElseThrow(() -> new NoSuchElementException("Variant not found with sizeId: " + sizeId));
    
    variantRepository.delete(variant);
    variantRepository.flush();  
    log.info("Variant with sizeId {} deleted successfully.", variant.getSizeId());
}

    
}


