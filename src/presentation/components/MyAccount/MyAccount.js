import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {
  getBeneficiaryUserID,
  getAuthToken,
} from '../../../Infrastructure/utils/storageUtility';
import styles from './styles';
import {scale} from '../../../Infrastructure/utils/screenUtility';
import ProfileHeader from '../../../Infrastructure/component/ProfileHeader/ProfileHeader';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {useIsFocused} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {decode as atob, encode as btoa} from 'base-64';
import Loader from '../../../Infrastructure/component/Loader/Loader';
import LifeCycleAccordion from '../../../Infrastructure/component/lifeCycleAccordion/LifeCycleAccordion';
import PersonalDetails from './PersonalDetails/PersonalDetails';
import {EmpTypeList} from '../../../application/store/actions/student';
import {CurrList} from '../../../application/store/actions/student';
import {
  fetchCountryList,
  fetchDegree,
  getEducationInfo,
} from '../../../application/store/actions/student';
import TimelineCard from '../../../Infrastructure/component/TimelineCards/TimelineCard';
import {baseURL} from '../../../application/config';
import {studentInformation} from '../../../application/store/actions/student';
const MyAccount = props => {
  const [status, setStatus] = useState(false);
  const [singleFile, setSingleFile] = useState('');
  const [beneficiaryDetails, setBeneficiaryDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [country, setCountry] = useState('');
  const [edit, setEdit] = React.useState(false);
  const countryList = [];
  const [userID, setUserID] = useState(setUserID);
  const isFocused = useIsFocused();
  const studentInfo = props.studentInformation.data;
  const [newProfilePic, setNewProfilePic] = useState('');
  const PrimEmail = [];
  const AltEmail = [];
  const personalPhone = [];
  const [profilePic, setProfilePic] = useState('');
  const [profilePicToastMsg, setProfilePicToastMsg] = useState('');
  studentInfo
    ? studentInfo.emailContacts.filter(items => {
        if (items.type.description === 'Primary') {
          PrimEmail.push({Primary: items.email});
        }
        if (items.type.description === 'Alternate') {
          AltEmail.push({Alternate: items.email});
        }
      })
    : null;

  studentInfo
    ? studentInfo.phoneContacts.filter(items => {
        if (items.type.description === 'Mobile') {
          personalPhone.push({
            personalPhone: items.phoneNo,
            phoneCode: items.countryCode.phoneCode,
            shortCountryCode: items.countryCode.shortCountryCode,
          });
        }
      })
    : null;

  country
    ? country.map(item => {
        countryList.push({
          name: item.countryName,
          iso2: item.countryCode,
          dialCode: item.phoneCode,
          shortCountryCode: item.shortCountryCode,
        });
      })
    : null;

  const init = async () => {
    let token = await getAuthToken();
    let beneficiaryID = await getBeneficiaryUserID();
    setStatus(true);
    await props
      .getCountry()
      .then(async res => {
        console.log('countryList', res.data);
        setStatus(false);
      })
      .catch(e => {
        console.log('error', e);
        setStatus(false);
      });
    props
      .getEmpList(token)
      .then(async res => {
        console.log('EmployeeList', res.data);
        setStatus(false);
      })
      .catch(e => {
        console.log('error', e);
        setStatus(false);
      });
    props
      .getCurrList(token)
      .then(async res => {
        console.log('CurrList', res.data);
        setStatus(false);
      })
      .catch(e => {
        console.log('error', e);
        setStatus(false);
      });
    await props
      .getDegree(token)
      .then(async res => {
        console.log('getDegree', res);
      })
      .catch(e => {
        console.log('getDegree-error', e);
      });
    // await props
    //   .getEducationData(token, beneficiaryID)
    //   .then((res) => {
    //     console.log("education---res", res.data);
    //   })
    //   .catch((e) => {
    //     console.log("get-education-erro", e);
    //   });
  };

  const EditProfilePic = async () => {
    const token = await getAuthToken();
    const beneficiaryId = await getBeneficiaryUserID();

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      let imageType = ['jpeg', 'png', 'jpg'];
      if (imageType.includes(res[0].type.split('/').reverse()[0])) {
        if (res[0].size >= 1048576) {
          Toast.show(
            'The file is too large to upload, please try a file with less than 1MB',
            Toast.LONG,
          );
        } else {
          let uri = decodeURI(res[0].uri);
          uri
            ? RNFS.readFile(uri, 'base64').then(async base64data => {
                const binary = atob(base64data);
                let formData = new FormData();
                formData.append('file', {
                  uri: uri,
                  type: res[0].type,
                  name: res[0].name,
                  data: binary,
                });
                setStatus(true);
                let resp = await fetch(
                  `${baseURL}student/v1/profile/self/profileimage`,
                  {
                    method: 'post',
                    body: formData,
                    headers: {
                      'Content-Type': 'multipart/form-data; ',
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );
                let responseJson = resp;
                console.log('responseJson-----------', responseJson);
                if (responseJson.status === 200) {
                  props
                    .getStudentInformation(token, beneficiaryId)
                    .then(async res => {
                      console.log('res', res);
                      setStatus(false);
                      setTimeout(() => {
                        Toast.show(
                          'Profile image is saved successfully',
                          Toast.LONG,
                        );
                      }, 1);
                    })
                    .catch(err => {
                      console.log('error', err);
                      setStatus(false);
                    });
                  // setStatus(false);
                  // console.log("res pic", responseJson);
                  // setProfilePic(responseJson.data.profilePic);
                  // setProfilePicToastMsg(responseJson.message);
                } else {
                  setStatus(false);
                  setTimeout(() => {
                    Toast.show('Failed to update profile Picture', Toast.SHORT);
                  }, 1);
                }
              })
            : null;
        }
      } else {
        Toast.show(
          `Unaccepted format!. Please upload a 'jpeg/png/jpg' format file`,
          Toast.LONG,
        );
      }
    } catch (err) {
      setStatus(false);
      if (DocumentPicker.isCancel(err)) {
      } else {
        //For Unknown Error
        // alert('Unknown Error: ' + JSON.stringify(err));

        throw err;
      }
    }
  };

  const toggleHandler = () => {
    setEdit(!edit);
  };
  useEffect(() => {
    isFocused === true && init();
  }, [isFocused]);
  console.log('props', props);
  console.log('profilePic', profilePic);
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
          editPic={EditProfilePic}
          EditProfile="Edit Profile"
          Toggle={toggleHandler}
        />
      </View>
      <View style={{flex: 7, paddingHorizontal: scale(10)}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('PersonalDetailsComponent')}>
          <TimelineCard
            Title="Personal Details"
            iconName="filetext1"
            iconSize={{
              width: scale(25),
              height: scale(25),
              marginLeft: scale(1.5),
            }}
            style={{
              titleContent: {
                marginLeft: scale(15),
              },
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('YourLifeStoryComponent')}>
          <TimelineCard
            Title="Your life story in 3 timelines"
            iconName="filetext1"
            iconSize={{
              width: scale(25),
              height: scale(25),
              marginLeft: scale(1.5),
            }}
            style={{
              titleContent: {
                marginLeft: scale(15),
              },
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('DocumentComponent')}>
          <TimelineCard
            Title="Documents"
            iconName="filetext1"
            iconSize={{
              width: scale(25),
              height: scale(25),
              marginLeft: scale(1.5),
            }}
            style={{
              titleContent: {
                marginLeft: scale(15),
              },
            }}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = ({
  studentReducer: {studentInformation, CountryList, StateList},
}) => ({
  studentInformation,
  CountryList,
  StateList,
});

const mapDispatchToProps = {
  getStudentInformation: (token, beneficiaryId) =>
    studentInformation(token, beneficiaryId),
  getCountry: () => fetchCountryList(),
  getEmpList: token => EmpTypeList(token),
  getCurrList: token => CurrList(token),
  getDegree: authToken => fetchDegree(authToken),
  // getEducationData: (authToken,beneficiaryId) => getEducationInfo(authToken,beneficiaryId),
};

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
