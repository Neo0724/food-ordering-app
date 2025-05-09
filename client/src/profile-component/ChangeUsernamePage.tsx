import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackType} from '../navigation/ProfileStack';
import {TextInput, Button} from 'react-native-paper';

type ChangeUsernamePageProps = NativeStackScreenProps<
  ProfileStackType,
  'ChangeUsernamePage'
>;

const ChangeUsernamePage = ({route, navigation}: ChangeUsernamePageProps) => {
  const {currentUsername, handleChangeUsername} = route.params;

  const [newUsername, setNewUsername] = useState<string>(currentUsername);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <View style={styles.parentContainer}>
      <Text style={styles.label}>Enter your new username</Text>
      <TextInput
        value={newUsername}
        onChangeText={newUn => setNewUsername(newUn)}
        mode="outlined"
        placeholder="New username"
        style={styles.usernameInput}
      />

      <Button
        mode="contained"
        onPress={async () => {
          try {
            setIsLoading(true);
            await handleChangeUsername(newUsername);
            navigation.goBack();
          } catch (error) {
            console.log(error);
          } finally {
            setIsLoading(false);
          }
        }}
        style={styles.submitBtn}
        contentStyle={styles.buttonContent}
        disabled={isLoading}>
        {isLoading ? (
          <View className="flex-row">
            <Text>Saving changes</Text>
            <ActivityIndicator size="small" color="black" />
          </View>
        ) : (
          'Save changes'
        )}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  usernameInput: {
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,.1)',
  },
  submitBtn: {
    alignSelf: 'center',
    width: '60%',
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default ChangeUsernamePage;
