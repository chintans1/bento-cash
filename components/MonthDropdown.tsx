import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const dropdownStyles = StyleSheet.create({
  textWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconWrap: {
    marginTop: 2,
    marginLeft: 3,
  },
});

type MonthDropdownProps = {
  title: string;
};

function MonthDropdown({ title }: MonthDropdownProps) {
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  const toggleDropdownVisibility = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={toggleDropdownVisibility}>
      <View style={dropdownStyles.textWrap}>
        <Text style={dropdownStyles.text}>{title}</Text>
        <View style={dropdownStyles.iconWrap}>
          {/* TODO */}
          {/* <IonIcons
            name={isWalletDropdownVisible ? 'ios-arrow-up' : 'ios-arrow-down'}
            color={'rgba(255, 255, 255, 0.7)'}
            size={14}
          /> */}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default MonthDropdown;
