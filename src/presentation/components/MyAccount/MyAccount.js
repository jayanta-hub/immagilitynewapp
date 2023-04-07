import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
// import {
//   getBeneficiaryUserID,
//   getAuthToken,
// } from '../../../Infrastructure/utils/storageUtility';
// import styles from './styles';
import {scale} from '../../../Infrastructure/utils/screenUtility';
import ProfileHeader from '../../../Infrastructure/component/ProfileHeader/ProfileHeader';
import {useNavigation} from '@react-navigation/native';
// import Toast from 'react-native-simple-toast';
import {useIsFocused} from '@react-navigation/native';
// import DocumentPicker from 'react-native-document-picker';
// import RNFS from 'react-native-fs';
// import {decode as atob, encode as btoa} from 'base-64';
import Loader from '../../../Infrastructure/component/Loader/Loader';
// import LifeCycleAccordion from '../../../Infrastructure/component/lifeCycleAccordion/LifeCycleAccordion';
// import PersonalDetails from './PersonalDetails/PersonalDetails';
// import {EmpTypeList} from '../../../application/store/actions/student';
// import {CurrList} from '../../../application/store/actions/student';
// import {
//   fetchCountryList,
//   fetchDegree,
//   getEducationInfo,
// } from '../../../application/store/actions/student';
import TimelineCard from '../../../Infrastructure/component/TimelineCards/TimelineCard';
// import {baseURL} from '../../../application/config';
// import {studentInformation} from '../../../application/store/actions/student';
const MyAccount = props => {
  const [status, setStatus] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const studentInfo = props?.studentInformation?.data;
  const PrimEmail = [];
  const [profilePic, setProfilePic] = useState('');
  const MyAccountData = [
    {
      id: 1,
      componentType: 'TimelineCard',
      title: 'Personal Details',
      navigation: 'PersonalDetailsComponent',
      iconImage: 'filetext1',
    },
    {
      id: 2,
      componentType: 'TimelineCard',
      title: 'Your life story in 3 timelines',
      navigation: 'YourLifeStoryComponent',
      iconImage: 'filetext1',
    },
    {
      id: 3,
      componentType: 'TimelineCard',
      title: 'Documents',
      navigation: 'DocumentComponent',
      iconImage: 'filetext1',
    },
  ];
  const renderItem = item => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(item.navigation);
          }}
          key={item.id}>
          <TimelineCard
            Title={item.title}
            iconName={item.iconImage}
            iconSize={{
              width: scale(18),
              height: scale(22),
              marginLeft: scale(1.5),
              resizeMode: 'contain',
            }}
            style={{
              titleContent: {
                marginLeft: scale(26),
              },
            }}
          />
        </TouchableOpacity>
      </>
    );
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={150}
      style={{flex: 1}}>
      <Loader status={status} />
      <View style={{flex: 1}}>
        <ProfileHeader
          profilePic={
            profilePic
              ? profilePic
              : studentInfo?.smallProfileImage
              ? studentInfo?.smallProfileImage
              : ''
          }
          name={
            studentInfo
              ? `${studentInfo.firstName} ${studentInfo.lastName}`
              : '--'
          }
          primaryEmail={PrimEmail[0]?.Primary ? PrimEmail[0].Primary : '--'}
          accStatus="Incomplete"
          editPic={() => {}}
          EditProfile="Edit Profile"
          Toggle={() => {}}
        />
      </View>
      <View style={{flex: 7, paddingHorizontal: scale(10)}}>
        {MyAccountData?.length > 0 &&
          MyAccountData.map(item => {
            return renderItem(item);
          })}
      </View>
    </KeyboardAvoidingView>
  );
};

// const mapStateToProps = ({
//   studentReducer: { studentInformation, CountryList, StateList },
// }) => ({
//   studentInformation,
//   CountryList,
//   StateList,
// });

// const mapDispatchToProps = {
//   getStudentInformation: (token, beneficiaryId) =>
//     studentInformation(token, beneficiaryId),
//   getCountry: () => fetchCountryList(),
//   getEmpList: (token) => EmpTypeList(token),
//   getCurrList: (token) => CurrList(token),
//   getDegree: (authToken) => fetchDegree(authToken),
//   getEducationData: (authToken,beneficiaryId) => getEducationInfo(authToken,beneficiaryId),
// };

export default connect(null, null)(MyAccount);
