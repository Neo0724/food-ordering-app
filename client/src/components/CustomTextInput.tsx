import React, {useState} from 'react';
import {TextInput} from 'react-native';
import {AuthStyles} from '../../styles/AuthStyles';

export default function CustomTextInput(props: any) {
  const [focus, setFocus] = useState<boolean>(false);

  return (
    <TextInput
      {...props}
      style={[AuthStyles.input, focus && AuthStyles.focusedInput]}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    />
  );
}
