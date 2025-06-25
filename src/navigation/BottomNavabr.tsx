import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Platform,
  SafeAreaView 
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomNavbar: React.FC<BottomTabBarProps> = ({ 
  state, 
  descriptors, 
  navigation 
}) => {
  const insets = useSafeAreaInsets();
  const windowWidth = Dimensions.get('window').width;

  // iPhone specific padding
  const bottomPadding = Platform.select({
    ios: insets.bottom > 0 ? insets.bottom : 20,
    android: 8
  });

  const tabs = [
    { name: 'Home', icon: 'home', label: 'Home' },
    { name: 'Customers', icon: 'users', label: 'Customers' },
    { name: 'Bills', icon: 'file-invoice-dollar', label: 'Bills' },
    { name: 'Profile', icon: 'user', label: 'Profile' }
  ];

  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#FFFFFF' }}>
      <View style={[styles.container, { paddingBottom: bottomPadding }]}>
        {tabs.map((tab, index) => {
          const route = state.routes.find(r => r.name === tab.name) || state.routes[0];
          const { options } = descriptors[route.key];
          const isFocused = state.index === state.routes.findIndex(r => r.name === tab.name);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.name);
            }
          };

          const getIcon = () => {
            const iconColor = isFocused ? '#4F46E5' : '#64748B';
            const iconSize = windowWidth * 0.07;

            switch (tab.name) {
              case 'Home':
                return <MaterialIcons name="home-filled" size={iconSize} color={iconColor} />;
              case 'Customers':
                return <FontAwesome5 name="users" size={iconSize - 2} color={iconColor} />;
              case 'Bills':
                return <FontAwesome5 name="file-invoice-dollar" size={iconSize - 2} color={iconColor} />;
              case 'Profile':
                return <Ionicons name="person" size={iconSize} color={iconColor} />;
              default:
                return <MaterialIcons name="home-filled" size={iconSize} color={iconColor} />;
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options?.tabBarAccessibilityLabel || tab.label}
              testID={options?.tabBarTestID}
              onPress={onPress}
              style={styles.tab}
              activeOpacity={0.7}
            >
              {getIcon()}
              {tab.label ? (
                <Text style={[
                  styles.label, 
                  { color: isFocused ? '#4F46E5' : '#64748B' }
                ]}>
                  {tab.label}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Platform.select({
      ios: 80,
      android: 70
    }),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    position: 'relative',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: Platform.select({
      ios: 12,
      android: 11
    }),
    marginTop: 4,
    fontWeight: '500',
  },
});

export default BottomNavbar;