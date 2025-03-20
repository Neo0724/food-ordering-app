import {Button, Image, Text, TouchableOpacity, View} from 'react-native';
import {FoodStackParamList} from './RootLayout';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import {useCardContext} from '../context/CartProvider';

type FoodDetailPageProps = NativeStackScreenProps<
  FoodStackParamList,
  'FoodDetailPage'
>;

export default function FoodDetailsPage({
  route,
  navigation,
}: FoodDetailPageProps) {
  const food = route.params.food;
  const [selectedSize, setSelectedSize] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const {addToCart} = useCardContext();
  const [exceedQuantity, setExceedQuantity] = useState<boolean>(false);

  useEffect(() => {
    if (exceedQuantity) {
      const exceedQuantityTimeout = setTimeout(() => {
        setExceedQuantity(false);
      }, 2000);

      return () => clearTimeout(exceedQuantityTimeout);
    }
  }, [exceedQuantity]);

  const quantityMap = new Map();
  food.list.forEach(variant => {
    quantityMap.set(variant.sizeId, variant.quantity);
  });

  return (
    <View>
      <Image
        source={require('../../assets/img/friedchicken.jpeg')}
        className="w-full h-[20em]"
      />
      <View className="m-5 gap-3">
        <Text className="text-4xl">{food.itemName}</Text>
        <Text>{food.itemDescription}</Text>
        <Text>{food.ingredient}</Text>
        <View className="justify-between gap-3 flex-row flex-wrap">
          {food.list.map(variant => (
            <TouchableOpacity
              key={variant.sizeId}
              className={`border p-1 flex-1 rounded-lg ${
                selectedSize === variant.sizeId && 'bg-blue-500'
              }`}
              onPress={() => {
                setQuantity(1);
                setSelectedSize(variant.sizeId);
              }}>
              <Text>Size: {variant.size}</Text>
              <Text>Left: {variant.quantity}</Text>
              <Text>Price: {variant.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row gap-3 items-center">
          <Text>Quantity: </Text>
          <TouchableOpacity
            className="bg-blue-400 w-10 h-8 items-center justify-center"
            onPress={() =>
              setQuantity(prev => {
                // Reset the exceed quantity message
                exceedQuantity && setExceedQuantity(false);
                return prev === 1 ? prev : prev - 1;
              })
            }>
            <Text className="text-white font-bold">-</Text>
          </TouchableOpacity>
          <Text>{quantity}</Text>
          <TouchableOpacity
            className="bg-blue-400 w-10 h-8 items-center justify-center"
            onPress={() => {
              setQuantity(prev => {
                // Reset the exceed quantity message
                exceedQuantity && setExceedQuantity(false);
                const exceeded = prev >= quantityMap.get(selectedSize);
                if (exceeded) {
                  setExceedQuantity(true);
                }
                return exceeded ? prev : prev + 1;
              });
            }}>
            <Text className="text-white font-bold">+</Text>
          </TouchableOpacity>
        </View>
        <Button
          title="Add to cart"
          onPress={() =>
            addToCart(
              {
                id: food.id,
                quantity,
                size: selectedSize,
                price: food.sizeWithPrice[selectedSize],
                availableQuantity: food.quantity,
                name: food.name,
              },
              setExceedQuantity,
            )
          }
        />
        {exceedQuantity && (
          <Text className="font-bold text-red-500 text-center">
            You have reached the maximum quantity
          </Text>
        )}
      </View>
    </View>
  );
}
