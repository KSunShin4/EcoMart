// src/components/Input.tsx
import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

type InputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: (e?: any) => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  secureTextEntry?: boolean;
  disabled?: boolean;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
  multiline?: boolean;
  numberOfLines?: number;
};

export const Input = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  touched,
  ...props
}: InputProps) => {
  const isError = touched && error;
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isError && styles.inputError, props.multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        textAlignVertical={props.multiline ? 'top' : 'center'}
        {...props}
      />
      {isError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    minHeight: 48,
  },
  inputMultiline: {
    minHeight: 100,
    paddingTop: 14,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});