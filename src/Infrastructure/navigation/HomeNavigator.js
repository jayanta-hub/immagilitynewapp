import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import Back from '../component/back/Back';
import {useNavigation} from '@react-navigation/native';
import LOGOSVG from '../../Infrastructure/assets/images/splashScreenLogo.svg';
import ComingSoon from '../component/ComingSoon/ComingSoon';
import TimeLine from '../../presentation/components/TimeLine/TimeLine';
import {scale} from '../utils/screenUtility';
import VisaOverView from '../../presentation/components/VisaOverView/VisaOverView';
const HomeStack = createStackNavigator();
const HeaderLeft = props => {
  return (
    <View style={{marginLeft: 20}}>
      <Ionicons color="#4D4F5C" name="menu" size={30} />
    </View>
  );
};
const HearderTitle = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <LOGOSVG width="140px" />
      </View>
    </View>
  );
};
const HomeNavigator = props => {
  const navigation = useNavigation();
  return (
    <>
      <HomeStack.Navigator initialRouteName="Dashboard">
        <>
          <HomeStack.Screen
            name="Dashboard"
            component={TimeLine}
            options={{
              headerStyle: {
                borderBottomWidth: 1,
                borderColor: '#00000029',
              },
              headerLeft: props => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.toggleDrawer();
                  }}>
                  <HeaderLeft {...props} />
                </TouchableOpacity>
              ),
              // headerTitle: props => <HearderTitle {...props} />,
            }}
          />
          <HomeStack.Screen
            name="ComingSoon"
            component={ComingSoon}
            options={{
              headerLeft: () => <Back />,
              headerStyle: {borderBottomWidth: 1, borderColor: '#00000029'},
              headerBackTitleVisible: false,
              headerTitleStyle: {
                fontSize: scale(16),
                color: '#4D4F5C',
                fontFamily: 'SourceSansPro-SemiBold',
              },
            }}
          />
          <HomeStack.Screen
            name="Resources"
            component={ComingSoon}
            options={{
              headerLeft: () => <Back />,
              headerStyle: {borderBottomWidth: 1, borderColor: '#00000029'},
              headerBackTitleVisible: false,
              headerTitleStyle: {
                fontSize: scale(16),
                color: '#4D4F5C',
                fontFamily: 'SourceSansPro-SemiBold',
              },
            }}
          />
          <HomeStack.Screen
            name="Find University"
            component={ComingSoon}
            options={{
              headerLeft: () => <Back />,
              headerStyle: {borderBottomWidth: 1, borderColor: '#00000029'},
              headerBackTitleVisible: false,
              headerTitleStyle: {
                fontSize: scale(16),
                color: '#4D4F5C',
                fontFamily: 'SourceSansPro-SemiBold',
              },
            }}
          />
          <HomeStack.Screen
            name="Next Steps in your Journey"
            component={ComingSoon}
            options={{
              headerLeft: () => <Back />,
              headerStyle: {borderBottomWidth: 1, borderColor: '#00000029'},
              headerBackTitleVisible: false,
              headerTitleStyle: {
                fontSize: scale(16),
                color: '#4D4F5C',
                fontFamily: 'SourceSansPro-SemiBold',
              },
            }}
          />
          <HomeStack.Screen
            name="Student Visa Overview"
            component={ComingSoon}
            options={{
              headerLeft: () => <Back />,
              headerStyle: {borderBottomWidth: 1, borderColor: '#00000029'},
              headerBackTitleVisible: false,
              headerTitleStyle: {
                fontSize: scale(16),
                color: '#4D4F5C',
                fontFamily: 'SourceSansPro-SemiBold',
              },
            }}
          />
          <HomeStack.Screen
            name="VisaOverView"
            component={VisaOverView}
            options={({route}) => ({
              headerLeft: () => <Back />,
              headerStyle: {borderBottomWidth: 1, borderColor: '#00000029'},
              headerBackTitleVisible: false,
              headerTitleStyle: {
                fontSize: scale(16),
                color: '#4D4F5C',
                fontFamily: 'SourceSansPro-SemiBold',
              },
              title: route.params.title,
            })}
          />
        </>
      </HomeStack.Navigator>
    </>
  );
};
const mapStateToProps = ({notificationReducer: {notificationStatus}}) => ({
  notificationStatus,
});
export default connect(mapStateToProps, null)(HomeNavigator);
