import {NavigationContainer} from '@react-navigation/native';
import RootLayout from './src/navigation/RootLayout';
import './global.css';
import {AuthProvider} from './src/context/AuthProvider';
import {CartProvider} from './src/context/CartProvider';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {OrderProvider} from './src/context/OrderProvider';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
import {PointAndCreditProvider} from './src/context/PointAndCreditProvider';
import RNFS from 'react-native-fs';
import {useEffect} from 'react';
import SearchFoodNameProvider from './src/context/SearchFoodProvider';

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

  useEffect(() => {
    const createSearchHistoryFile = async () => {
      const fileName = '/search-history.txt';
      const filePath = RNFS.DocumentDirectoryPath + fileName;

      try {
        const fileExists = await RNFS.exists(filePath);
        console.log(fileExists);

        if (!fileExists) {
          await RNFS.writeFile(filePath, '');
          console.log('Search history file is created');
        }
      } catch (error) {
        console.log('Error creating search history file: ' + error);
      }
    };

    createSearchHistoryFile();
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <SearchFoodNameProvider>
          <PointAndCreditProvider>
            <OrderProvider>
              <CartProvider>
                <PaperProvider theme={theme}>
                  <NavigationContainer>
                    <RootLayout />
                  </NavigationContainer>
                </PaperProvider>
              </CartProvider>
            </OrderProvider>
          </PointAndCreditProvider>
        </SearchFoodNameProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
