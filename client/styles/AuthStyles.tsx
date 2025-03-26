import {StyleSheet} from 'react-native';

export const AuthStyles = StyleSheet.create({
  container: {
    padding: 25,
    gap: 5,
  },
  input: {
    height: 50,
    marginBottom: 10,
    borderColor: 'lightgrey',
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  focusedInput: {
    borderColor: 'rgb(238,137,52)',
  },
  error: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
  },
});
