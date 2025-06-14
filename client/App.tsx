import {NavigationContainer} from '@react-navigation/native';
import RootLayout from './src/navigation/RootLayout';
import './global.css';
import {AuthProvider} from './src/context/AuthProvider';
import {CartProvider} from './src/context/CartProvider';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {OrderProvider} from './src/context/OrderProvider';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
import {PointAndCreditProvider} from './src/context/PointAndCreditProvider';
import SearchFoodNameProvider from './src/context/SearchFoodProvider';
import {CustomDialogProvider} from './src/context/CustomDialogContext';
import WebSocketConnection from './src/context/WebSocketProvider';
import {NotifierWrapper} from 'react-native-notifier';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default function App() {
  const queryClient = new QueryClient();

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgb(238,167,52)',
      secondary: 'white',
      background: 'rgb(255,120,50)',
    },
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthProvider>
        <NotifierWrapper>
          <QueryClientProvider client={queryClient}>
            <SearchFoodNameProvider>
              <PointAndCreditProvider>
                <OrderProvider>
                  <CartProvider>
                    <PaperProvider theme={theme}>
                      <CustomDialogProvider>
                        <NavigationContainer>
                          <WebSocketConnection>
                            <RootLayout />
                          </WebSocketConnection>
                        </NavigationContainer>
                      </CustomDialogProvider>
                    </PaperProvider>
                  </CartProvider>
                </OrderProvider>
              </PointAndCreditProvider>
            </SearchFoodNameProvider>
          </QueryClientProvider>
        </NotifierWrapper>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
