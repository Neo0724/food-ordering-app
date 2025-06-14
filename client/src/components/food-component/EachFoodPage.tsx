import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import {useCartContext} from '../../context/CartProvider';
import {ShadowStyle} from '../../../styles/ShadowStyle';
import {ButtonStyle} from '../../../styles/ButtonStyles';
import {FoodStackParamList} from '../../navigation/FoodStack';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useCustomDialog} from '../../context/CustomDialogContext';
import {Variant} from './FoodMenuPage';

type FoodDetailPageProps = NativeStackScreenProps<
  FoodStackParamList,
  'EachFoodPage'
>;

export default function FoodDetailsPage({
  route,
  navigation,
}: FoodDetailPageProps) {
  const food = route.params.food;
  const [selectedSize, setSelectedSize] = useState<number>(food.list[0].sizeId);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const {addToCartMutation, updateCartQuantityMutation, foodsInCart} =
    useCartContext();
  const [exceedQuantity, setExceedQuantity] = useState<boolean>(false);

  /* Custom dialog function */
  const {showDialog} = useCustomDialog();

  // Variant map for faster lookup
  const variantMap = new Map(
    food.list.map(variant => [variant.sizeId, variant]),
  );

  const handleAddToCart = async () => {
    if (selectedSize === -1) {
      showDialog('Invalid option', 'Please select one variant');
      return;
    }

    const foodExistsInCart = foodsInCart?.find(
      foodInCart =>
        foodInCart.itemId === food.itemId &&
        foodInCart.sizeId === variantMap.get(selectedSize)?.sizeId,
    );

    /* Food already in cart, hence update the quantity */
    if (foodExistsInCart) {
      const exceededQuantity =
        foodExistsInCart.quantity + selectedQuantity >
        foodExistsInCart.availableQuantity;

      if (exceededQuantity) {
        showDialog('Invalid option', 'You have exceeded the maximum quantity');
        return;
      }
      try {
        await updateCartQuantityMutation.mutateAsync({
          cartId: foodExistsInCart.cartId,
          newQuantity: foodExistsInCart.quantity + selectedQuantity,
        });
        showDialog('Success', 'Updated cart successfully');
      } catch (error) {
        showDialog('Server error', 'Please try again later');
      }
    } else {
      /* Food not in cart, hence add the food into the cart */

      const exceededQuantity =
        selectedQuantity > (variantMap.get(selectedSize)?.quantity ?? Infinity);

      if (exceededQuantity) {
        showDialog('Invalid option', 'You have exceeded the maximum quantity');
        return;
      }

      try {
        await addToCartMutation.mutateAsync({
          itemId: food.itemId,
          selectedQuantity: selectedQuantity,
          selectedVariant: variantMap.get(selectedSize) as Variant,
        });
        showDialog('Success', 'Food added to cart');
      } catch (error) {
        showDialog('Server error', 'Please try again later');
      }
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
    <ScrollView contentContainerStyle={{paddingBottom: 25}}>
      {/* Food image */}
      <Image
        source={{
          uri: `https://res.cloudinary.com/dnhcz4fi7/image/upload/v1746775641/${food.itemName}`,
        }}
        className="w-full h-[20em]"
      />
      {/* Food details container */}
      <View className="m-5 gap-3">
        <Text className="text-4xl">{food.itemName}</Text>
        <Text style={styles.description}>{food.itemDescription}</Text>
        <Text style={styles.ingredients}>Ingredients: {food.ingredient}</Text>
        <Text style={styles.category}>
          Category:{' '}
          {food.categoryName
            .substring(0, 1)
            .toLocaleUpperCase()
            .concat(food.categoryName.substring(1).toLowerCase())}
        </Text>

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
                RM{variant.price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Container to show the quantity and the plus minus button */}
        <View className="flex-row gap-3 items-center mt-3">
          <Text>Quantity: </Text>
          <TouchableOpacity
            disabled={selectedSize === -1}
            style={ButtonStyle.plusMinusButton}
            onPress={() => {
              // Reset the exceed quantity message
              exceedQuantity && setExceedQuantity(false);

              setSelectedQuantity(prev => {
                return prev === 1 ? prev : prev - 1;
              });
            }}>
            <Text style={ButtonStyle.plusMinusText}>-</Text>
          </TouchableOpacity>
          <Text>{selectedQuantity}</Text>
          <TouchableOpacity
            disabled={selectedSize === -1}
            style={ButtonStyle.plusMinusButton}
            onPress={() => {
              // Reset the exceed quantity message
              exceedQuantity && setExceedQuantity(false);
              /* Check if exceeded the available quantity */
              const exceeded =
                selectedQuantity + 1 >
                (variantMap.get(selectedSize)?.quantity ?? 0);

              exceeded && setExceedQuantity(true);
              !exceeded &&
                setSelectedQuantity(prev => {
                  return prev + 1;
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  variantContainer: {
    ...ShadowStyle.shadowBox,
    padding: 10,
    borderRadius: 10,
    minWidth: 110,
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
  description: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  ingredients: {
    fontSize: 14,
  },
  category: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e65c00',
  },
});
