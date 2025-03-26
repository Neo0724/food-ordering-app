import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import {useCardContext} from '../context/CartProvider';
import {Variant} from './FoodPage';
import {ShadowStyle} from '../../styles/ShadowStyle';
import {ButtonStyle} from '../../styles/ButtonStyles';
import {FoodStackParamList} from '../navigation/RootLayout';

type FoodDetailPageProps = NativeStackScreenProps<
  FoodStackParamList,
  'EachFoodPage'
>;

export default function FoodDetailsPage({
  route,
  navigation,
}: FoodDetailPageProps) {
  const food = route.params.food;
  const [selectedSize, setSelectedSize] = useState<number>(-1);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const {addToCartMutation, updateCartQuantityMutation, foodsInCart} =
    useCardContext();
  const [exceedQuantity, setExceedQuantity] = useState<boolean>(false);

  // Variant map for faster lookup
  const variantMap = new Map(
    food.list.map(variant => [variant.sizeId, variant]),
  );

  const handleAddToCart = () => {
    if (selectedSize === -1) {
      Alert.alert('Invalid option', 'Please select one variant');
      return;
    }

    const foodExistsInCart = foodsInCart?.find(
      foodInCart =>
        foodInCart.itemId === food.itemId &&
        foodInCart.sizeId === variantMap.get(selectedSize)?.sizeId,
    );

    /* Food already in cart, hence update the quantity */
    if (foodExistsInCart) {
      updateCartQuantityMutation.mutate({
        cartId: foodExistsInCart.cartId,
        newQuantity: foodExistsInCart.quantity + selectedQuantity,
        prevQuantity: foodExistsInCart.quantity,
        unitPrice: foodExistsInCart.price,
      });
    } else {
      /* Food not in cart, hence add the food into the cart */
      addToCartMutation.mutate({
        itemId: food.itemId,
        selectedQuantity: selectedQuantity,
        selectedVariant: variantMap.get(selectedSize) as Variant,
      });
    }
  };

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
        <Text className="text-4xl">{food.itemName}</Text>
        <Text>{food.itemDescription}</Text>
        <Text>Ingredients: {food.ingredient}</Text>

        {/* Container to show all variants */}
        <View className="justify-between gap-3 flex-row flex-wrap">
          {food.list.map(variant => (
            <TouchableOpacity
              key={variant.sizeId}
              style={[
                styles.variantContainer,
                selectedSize === variant.sizeId && styles.selectedVariant,
              ]}
              onPress={() => {
                exceedQuantity && setExceedQuantity(false);
                setSelectedQuantity(1);
                setSelectedSize(variant.sizeId);
              }}>
              <Text
                style={[
                  styles.variantText,
                  selectedSize === variant.sizeId && styles.selectedVariantText,
                ]}>
                Size: {variant.size}
              </Text>
              <Text
                style={[
                  styles.variantText,
                  selectedSize === variant.sizeId && styles.selectedVariantText,
                ]}>
                Left: {variant.quantity}
              </Text>
              <Text
                style={[
                  styles.variantText,
                  selectedSize === variant.sizeId && styles.selectedVariantText,
                ]}>
                $: RM{variant.price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Container to show the quantity and the plus minus button */}
        <View className="flex-row gap-3 items-center mt-3">
          <Text>Quantity: </Text>
          <TouchableOpacity
            style={ButtonStyle.plusMinusButton}
            onPress={() =>
              setSelectedQuantity(prev => {
                // Reset the exceed quantity message
                exceedQuantity && setExceedQuantity(false);
                return prev === 1 ? prev : prev - 1;
              })
            }>
            <Text style={ButtonStyle.plusMinusText}>-</Text>
          </TouchableOpacity>
          <Text>{selectedQuantity}</Text>
          <TouchableOpacity
            style={ButtonStyle.plusMinusButton}
            onPress={() => {
              setSelectedQuantity(prev => {
                // Reset the exceed quantity message
                exceedQuantity && setExceedQuantity(false);
                const exceeded =
                  prev >= (variantMap.get(selectedSize)?.quantity ?? 0);
                if (exceeded) {
                  setExceedQuantity(true);
                }
                return exceeded ? prev : prev + 1;
              });
            }}>
            <Text style={ButtonStyle.plusMinusText}>+</Text>
          </TouchableOpacity>
        </View>
        {/* Button to add to cart */}
        <TouchableOpacity
          className="mt-4"
          style={ButtonStyle.generalButton}
          onPress={handleAddToCart}>
          <Text style={ButtonStyle.generalButtonText}>Add to cart</Text>
        </TouchableOpacity>
        {/* Error message then user selects over the max quantity */}
        {exceedQuantity && (
          <Text className="font-bold text-red-500 text-center">
            You have reached the maximum quantity
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  variantContainer: {
    ...ShadowStyle.shadowBox,
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  selectedVariant: {
    backgroundColor: 'rgb(238,167,52)',
  },
  selectedVariantText: {
    color: 'white',
  },
  variantText: {
    fontWeight: 'bold',
    color: 'black',
  },
});
