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
  const [selectedSize, setSelectedSize] = useState<string>('S');
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

  return (
    <View>
      <Image
        source={require('../../assets/img/friedchicken.jpeg')}
        className="w-full h-[20em]"
      />
      <View className="m-5 gap-3">
        <Text className="text-4xl">{food.name}</Text>
        <Text>{food.description}</Text>
        <Text>{food.calories}</Text>
        <Text>{food.ingredients}</Text>
        <View className="gap-5 flex-row">
          {Object.keys(food.sizeWithPrice).map(variant => (
            <TouchableOpacity
              key={variant + food.sizeWithPrice[variant].toString()}
              className={`border p-2 rounded-md flex-1 ${
                variant === selectedSize && 'bg-blue-500'
              }`}
              onPress={() => setSelectedSize(variant)}>
              <Text>Size: {variant}</Text>
              <Text>Price: {food.sizeWithPrice[variant]}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text>Left {food.quantity}</Text>
        <View className="flex-row gap-3">
          <Text>Quantity: </Text>
          <TouchableOpacity
            className="bg-red-400 w-10 h-8 items-center justify-center"
            onPress={() => setQuantity(prev => (prev === 1 ? prev : prev - 1))}>
            <Text className="text-white font-bold">-</Text>
          </TouchableOpacity>
          <Text>{quantity}</Text>
          <TouchableOpacity
            className="bg-blue-400 w-10 h-8 items-center justify-center"
            onPress={() =>
              setQuantity(prev => (prev >= food.quantity ? prev : prev + 1))
            }>
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
