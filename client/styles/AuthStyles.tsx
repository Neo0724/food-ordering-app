import {StyleSheet} from 'react-native';

export const AuthStyles = StyleSheet.create({
  container: {
    padding: 25,
    gap: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
  },
});
