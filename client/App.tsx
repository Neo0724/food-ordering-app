import {NavigationContainer} from '@react-navigation/native';
import RootLayout from './src/components/RootLayout';
import './global.css';
import {AuthProvider} from './src/context/AuthProvider';
import {CartProvider} from './src/context/CartProvider';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

export default function App() {
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <NavigationContainer>
            <RootLayout />
          </NavigationContainer>
        </CartProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
