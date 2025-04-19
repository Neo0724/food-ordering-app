import {createContext, SetStateAction, useContext, useState} from 'react';

type SearchFoodContextType = {
  searchFoodName: string;
  setSearchFoodName: React.Dispatch<SetStateAction<string>>;
};

const SearchFoodNameContext = createContext<SearchFoodContextType>(
  {} as SearchFoodContextType,
);

export default function SearchFoodNameProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchFoodName, setSearchFoodName] = useState<string>('');

  return (
    <SearchFoodNameContext.Provider value={{searchFoodName, setSearchFoodName}}>
      {children}
    </SearchFoodNameContext.Provider>
  );
}

export const useSearchFoodContext = () => useContext(SearchFoodNameContext);
