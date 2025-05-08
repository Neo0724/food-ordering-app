import {createContext, ReactNode, useContext, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Button, Dialog, Portal, Text, useTheme} from 'react-native-paper';

type CustomDialogContextType = {
  showDialog: (
    title: string,
    message: string,
    onDismissFunction?: () => void,
  ) => void;
};

const CustomDialogContext = createContext<CustomDialogContextType>(
  {} as CustomDialogContextType,
);

export const useCustomDialog = () => useContext(CustomDialogContext);

export const CustomDialogProvider = ({children}: {children: ReactNode}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState<boolean>(false);
  const [title, setTitle] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [onCloseFunction, setOnCloseFunction] = useState<() => void>(
    () => () => {},
  );

  const showDialog = (
    displayTitle: string,
    displayMessage: string,
    closeFunction?: () => void,
  ) => {
    setVisible(true);
    setTitle(displayTitle);
    setMessage(displayMessage);
    setOnCloseFunction(() =>
      closeFunction === undefined ? () => {} : closeFunction,
    );
  };

  return (
    <CustomDialogContext.Provider value={{showDialog}}>
      <Portal>
        <Dialog
          theme={{
            colors: {elevation: {level3: theme.colors.background}},
          }}
          visible={visible}
          onDismiss={() => {
            setVisible(false);
            setOnCloseFunction(() => () => {});
          }}>
          <Dialog.Title style={styles.dialogText}>{title}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>{message}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setVisible(false);
                onCloseFunction();
              }}>
              <Text style={styles.dialogText}>Close</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {children}
    </CustomDialogContext.Provider>
  );
};

const styles = StyleSheet.create({
  dialogText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
