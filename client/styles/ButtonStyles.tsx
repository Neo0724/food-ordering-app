import {StyleSheet} from 'react-native';

export const ButtonStyle = StyleSheet.create({
  generalButton: {
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(238,167,52)',
    height: 45,
    borderRadius: 7,
  },
  generalButtonText: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: 'white',
  },
  plusMinusButton: {
    borderRadius: 10,
    width: 23,
    height: 23,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(238,167,52)',
  },
  plusMinusText: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    color: 'white',
  },
});
