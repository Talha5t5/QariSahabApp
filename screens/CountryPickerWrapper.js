import React from 'react';
import CountryPicker from 'react-native-country-picker-modal';

const CountryPickerWrapper = ({ onSelect, withCallingCode = true, withFilter = true, withFlag = true, withCountryNameButton = true, visible = false }) => {
  return (
    <CountryPicker
      withFilter={withFilter}
      withCallingCode={withCallingCode}
      withFlag={withFlag}
      withCountryNameButton={withCountryNameButton}
      onSelect={onSelect}
      visible={visible}
    />
  );
};

export default CountryPickerWrapper;
