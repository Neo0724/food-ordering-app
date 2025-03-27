import {StyleSheet} from 'react-native';
import {Button, Portal, Dialog, useTheme, Text} from 'react-native-paper';

type CustomDialogProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  message: string;
};

export default function CustomDialog({
  title,
  message,
  visible,
  setVisible,
}: CustomDialogProps) {
  const theme = useTheme();
  return (
    <Portal>
      <Dialog
        theme={{
          colors: {elevation: {level3: theme.colors.primary}},
        }}
        visible={visible}
        onDismiss={() => setVisible(false)}>
        <Dialog.Title style={styles.dialogText}>{title}</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.dialogText}>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setVisible(false)}>
            <Text style={styles.dialogText}>Close</Text>
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialogText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
