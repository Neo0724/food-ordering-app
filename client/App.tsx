import {NavigationContainer} from '@react-navigation/native';
import RootLayout from './src/navigation/RootLayout';
import './global.css';
import {AuthProvider} from './src/context/AuthProvider';
import {CartProvider} from './src/context/CartProvider';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {OrderProvider} from './src/context/OrderProvider';
import {DefaultTheme, PaperProvider} from 'react-native-paper';

export default function App() {
  const queryClient = new QueryClient();

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgb(238,167,52)',
      secondary: 'white',
      background: 'rgb(238,200,52)',
    },
  };

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <OrderProvider>
          <CartProvider>
            <NavigationContainer>
              <PaperProvider theme={theme}>
                <RootLayout />
              </PaperProvider>
            </NavigationContainer>
          </CartProvider>
        </OrderProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
