import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OwnCardPage from '../components/own-card-component/OwnCardPage';
import TopUpCardPage from '../components/own-card-component/TopUpCardPage';
import {UseMutationResult} from '@tanstack/react-query';

export type OwnCardStackParamList = {
  OwnCardPage: undefined;
  TopUpCardPage: {
    topUpCredit: UseMutationResult<void, Error, number, unknown>;
  };
};

const CardStack = createNativeStackNavigator<OwnCardStackParamList>();

export default function OwnCardStack() {
  return (
    <CardStack.Navigator screenOptions={{headerShown: false}}>
      <CardStack.Screen name="OwnCardPage" component={OwnCardPage} />
      <CardStack.Screen name="TopUpCardPage" component={TopUpCardPage} />
    </CardStack.Navigator>
  );
}
