import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import {useTheme} from 'react-native-paper';
export default function CustomDrawerComponent(props: any) {
  const theme = useTheme();
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
      <View
        style={[
          styles.profile,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}>
        <MaterialCommunityIcons name="account" size={40} color="white" />
        <Text style={styles.headerText}>{auth().currentUser?.displayName}</Text>
      </View>

      <View style={styles.drawerList}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: theme.colors.primary,
            },
          ]}
          onPress={() => auth().signOut()}>
          <MaterialCommunityIcons name="logout" size={22} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  profile: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginHorizontal: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
    fontWeight: '600',
  },
  drawerList: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
  },
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.2)',
    backgroundColor: '#fff',
  },
  logoutButton: {
    height: 50,
    color: 'white',
    borderRadius: 20,
    backgroundColor: 'lightblue',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  logoutText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 10,
    fontWeight: '500',
  },
});
