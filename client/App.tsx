import {NavigationContainer} from '@react-navigation/native';
import RootLayout from './src/components/RootLayout';
import './global.css';
import {AuthProvider} from './src/context/AuthProvider';
import {CartProvider} from './src/context/CartProvider';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <RootLayout />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}
