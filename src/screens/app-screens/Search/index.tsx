import {
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import useTheme from '../../../theme/hooks/useTheme';
import {useTranslation} from 'react-i18next';
import {SEARCH} from '../../../assets/icons/svg';
import TextField from '../../../components/TextField';
import LOCALES from '../../../localization/constants';
import Back from '../../../assets/icons/svg/Back';
import {SearchScreenProps} from '../../../types/navigation/appTypes';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import All from './All';
import Feeds from './Feeds';
import Users from './Users';
import {useAppDispatch} from '../../../store';
import {setSearch} from '../../../store/slice/homeSlice';
import {useDebounce} from '../../../hooks/useDebounce';

const Tab = createMaterialTopTabNavigator();

const Search = ({navigation}: SearchScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = React.useState('');

  const debouncedSearch = useDebounce(searchText, 500);

  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 0) {
      dispatch(setSearch(debouncedSearch.trim()));
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (searchText.length === 0) {
      dispatch(setSearch(''));
    }
  }, [searchText]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.APP_BACKGROUND_COLOR,
      }}>
      <StatusBar
        backgroundColor={COLORS.STATUS_BAR_COLOR}
        barStyle={BAR_STYLE}
      />
      <View style={styles.container}>
        <View style={[styles.section, styles.row]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.back}>
            <Back />
          </Pressable>
          <TextField
            placeholder={t(LOCALES.SEARCH.LBL_SEARCH)}
            leftIcon={<SEARCH />}
            onChangeText={setSearchText}
            value={searchText}
            customLeftIconStyle={{marginRight: 8}}
            parentStyle={{
              marginBottom: 0,
              width: '90%',
              borderRadius: 9,
            }}
          />
        </View>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarStyle: {
              backgroundColor: COLORS.PRIMARY_COLOR,
              borderBottomWidth: 1,
              borderColor: COLORS.CHIP_INACTIVE_BORDER_COLOR,
            },
            tabBarIndicatorStyle: {
              borderBottomColor: COLORS.TERTIARY_COLOR,
              borderWidth: 1,
            },
            tabBarActiveTintColor: COLORS.TERTIARY_COLOR,
            tabBarShowIcon: false,
          })}>
          <Tab.Screen name="All" component={All} />
          <Tab.Screen name="Feeds" component={Feeds} />
          <Tab.Screen name="Users" component={Users} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginRight: 20,
    marginLeft: 10,
    marginTop: Platform.OS === 'android' ? 10 : 0,
  },
  back: {
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
