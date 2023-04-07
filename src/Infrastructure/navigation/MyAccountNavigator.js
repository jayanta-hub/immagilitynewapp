import React from 'react';
import {TouchableOpacity, View, Alert} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';
import {AuthContext} from '../utils/context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Menu, Provider} from 'react-native-paper';
import {scale} from '../utils/screenUtility';
import EditIcon from 'react-native-vector-icons/Octicons';
import ComingSoon from '../component/ComingSoon/ComingSoon';
import MyAccount from '../../presentation/components/MyAccount/MyAccount';
import Back from '../component/back/Back';
const HomeStack = createStackNavigator();

const MyAccountHeaderLeft = props => {
  return (
    <View style={{marginLeft: 10}}>
      <Ionicons color="#687C93" name="chevron-back" size={25} />
    </View>
  );
};
const MyAccountHeaderRight = props => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const {signOut} = React.useContext(AuthContext);
  const navigation = useNavigation();

  const showAlert = () => {
    Alert.alert(
      'ImagilityStudent',
      'Would you like to Logout',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => signOut()},
      ],
      {cancelable: false},
    );
  };
  return (
    <TouchableOpacity>
      <View
        style={{
          marginRight: scale(20),
        }}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          style={{
            zIndex: 100,
            marginTop: scale(32),
          }}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <Entypo color="#687C93" name="dots-three-vertical" size={20} />
            </TouchableOpacity>
          }>
          {/* <Menu.Item
            onPress={() => {
              navigation.navigate('ChangePassword');
            }}
            title="Change Password"
            style={{height: scale(25)}}
          /> */}
          <View style={{borderWidth: 0.2, borderColor: '#707070'}} />
          <Menu.Item
            onPress={() => {
              showAlert();

              // signOut();
            }}
            title="Logout"
            style={{height: scale(25)}}
          />
        </Menu>
      </View>
    </TouchableOpacity>
  );
};
export const PersonalDetailsRight = props => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const {EditPersonalDetailsField} = React.useContext(AuthContext);
  return (
    <TouchableOpacity>
      <View
        style={{
          marginRight: scale(20),
        }}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          style={{
            zIndex: 100,
            marginTop: scale(32),
          }}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <EditIcon name="pencil" size={scale(17)} color="#10A0DA" />
            </TouchableOpacity>
          }>
          {/* <Divider /> */}
          <Menu.Item
            onPress={() => {
              props.editHandler();
            }}
            title="Edit"
            style={{height: scale(25)}}
          />
        </Menu>
      </View>
    </TouchableOpacity>
  );
};

const MyAccountNavigator = props => {
  const navigation = useNavigation();
  return (
    <Provider>
      <HomeStack.Navigator initialRouteName="MYACCOUNT">
        <HomeStack.Screen
          name="MYACCOUNT"
          component={MyAccount}
          options={{
            title: 'MY ACCOUNT',
            headerShown: true,
            headerStyle: {borderBottomWidth: 1, borderColor: '#00000029'},
            headerLeft: props => (
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <MyAccountHeaderLeft {...props} />
              </TouchableOpacity>
            ),
            headerRight: props => <MyAccountHeaderRight />,
          }}
        />

        <HomeStack.Screen
          name="PersonalDetailsComponent"
          component={ComingSoon}
          // component={PersonalDetails}
          options={{
            title: 'Personal Details',
            headerShown: true,
            headerLeft: () => <Back />,
            // headerRight: props => <PersonalDetailsRight />,

            headerStyle: {borderBottomWidth: 1, borderColor: '#00000029'},
            headerBackTitleVisible: false,
            headerTitleStyle: {
              fontSize: scale(18),
              color: '#4D4F5C',
              fontFamily: 'SourceSansPro-SemiBold',
            },
          }}
        />
        <HomeStack.Screen
          name="YourLifeStoryComponent"
          component={ComingSoon}
          options={{
            title: 'Your life story in 3 timelines',
            headerShown: true,
            headerLeft: () => <Back />,
            headerStyle: {borderBottomWidth: 1, borderColor: '#00000029'},
            headerBackTitleVisible: false,
            headerTitleStyle: {
              fontSize: scale(18),
              color: '#4D4F5C',
              fontFamily: 'SourceSansPro-SemiBold',
            },
          }}
        />
        <HomeStack.Screen
          name="DocumentComponent"
          component={ComingSoon}
          options={{
            title: 'Documents',
            headerShown: true,
            headerLeft: () => <Back />,
            headerStyle: {borderBottomWidth: 1, borderColor: '#00000029'},
            headerBackTitleVisible: false,
            headerTitleStyle: {
              fontSize: scale(18),
              color: '#4D4F5C',
              fontFamily: 'SourceSansPro-SemiBold',
            },
          }}
        />
      </HomeStack.Navigator>
    </Provider>
  );
};
// const mapStateToProps = ({studentReducer: {editPersonalDetails}}) => ({
//   editPersonalDetails,
// });

// const mapDispatchToProps = {
//   EditPersonalDetailHandler: () => EditPersonalDetailField(),
// };

export default connect(null, null)(MyAccountNavigator);
