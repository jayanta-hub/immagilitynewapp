import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import Accordion from '../../../../Infrastructure/component/Accordion/Accordion';
import styles from '../styles';
import {scale} from '../../../../Infrastructure/utils/screenUtility';
import {connect} from 'react-redux';
import {studentInformation} from '../../../../application/store/actions/student';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {fetchStateList} from '../../../../application/store/actions/student';
import EditIcon from 'react-native-vector-icons/Octicons';
import EditCancel from 'react-native-vector-icons/AntDesign';
import PersonalDetailsEdit from './PersonalDetailsEdit';
const mailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,3})$/;
const PersonalDetails = props => {
  const studentInfo = props.studentInformation.data || [];
  const PrimEmail = [];
  const AltEmail = [];
  const personalPhone = [];
  const [editProfile, setEditProfile] = useState(false);
  const countryListData = props.CountryList.data || [];
  const currAddressData = [];
  const perAddressData = [];
  const forgnAddressData = [];
  studentInfo
    ? studentInfo?.address?.filter(items => {
        if (items.type.code === 'CURR') {
          currAddressData.push({CURR: items});
        }
        if (items.type.code === 'PERM') {
          perAddressData.push({PERM: items});
        }
        if (items.type.code === 'FORN') {
          forgnAddressData.push({FORN: items});
        }
      })
    : null;
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // setEditProfile(!editProfile);
            // setModalVisible(!modalVisible);
            editProfile === true
              ? setModalVisible(!modalVisible)
              : setEditProfile(!editProfile);
          }}>
          {!editProfile ? (
            <EditIcon
              name="pencil"
              size={scale(17)}
              color="#10A0DA"
              style={{marginRight: scale(25)}}
            />
          ) : (
            <EditCancel
              name="close"
              size={scale(20)}
              color="#10A0DA"
              style={{marginRight: scale(25)}}
            />
          )}
        </TouchableOpacity>
      ),
    });
  });

  const [currentStateList, setCurrentStateList] = useState([]);
  const stateData = [];
  currentStateList
    ? currentStateList.map(item => {
        stateData.push({
          label: item.stateProvinceName,
          value: item.stateProvinceName,
          stateProvinceName: item.stateProvinceName,
          stateProvinceCode: item.stateProvinceCode,
        });
      })
    : null;

  const getCountryList = useState(props.CountryList.data);
  const countryData = [];
  getCountryList
    ? getCountryList.map(item => {
        countryData.push({
          label: item.countryName,
          value: item.countryCode,
        });
      })
    : null;

  studentInfo
    ? studentInfo?.emailContacts?.filter(items => {
        if (items.type.description === 'Primary') {
          PrimEmail.push({Primary: items.email});
        }
        if (items.type.description === 'Alternate') {
          AltEmail.push({Alternate: items.email});
        }
      })
    : null;

  studentInfo
    ? studentInfo?.phoneContacts?.filter(items => {
        if (items.type.description === 'Mobile') {
          personalPhone.push({
            personalPhone: items.phoneNo,
            phoneCode: items.countryCode.phoneCode,
            shortCountryCode: items.countryCode.shortCountryCode,
          });
        }
      })
    : null;
  console.log('props', props);

  const PersonalInfo = () => {
    return (
      <>
        <View>
          <Text style={{...styles.formInputTitle, marginTop: 0}}>Title</Text>
          <Text style={styles.formInputData}>
            {studentInfo?.title ? studentInfo?.title : '--'}
          </Text>
        </View>
        <View
          style={{
            ...styles.inputDis,
            flexDirection: 'row',
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.formInputTitle}>First Name</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.firstName ? studentInfo?.firstName : '--'}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.formInputTitle}>Last Name</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.lastName ? studentInfo?.lastName : '--'}
            </Text>
          </View>
        </View>
        <View
          style={{
            ...styles.inputDis,
            flexDirection: 'row',
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.formInputTitle}>Middle Name</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.middleName ? studentInfo?.middleName : '--'}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.formInputTitle}>Gender Name</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.gender?.description
                ? studentInfo?.gender?.description
                : '--'}
            </Text>
          </View>
        </View>
        <View
          style={{
            ...styles.inputDis,
            flexDirection: 'row',
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.formInputTitle}>Date of Birth</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.dob ? studentInfo?.dob : '--'}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.formInputTitle}>Mobile No.</Text>
            <Text style={styles.formInputData}>
              {`${
                personalPhone[0]?.phoneCode
                  ? `+${personalPhone[0].phoneCode}-`
                  : '--'
              }${
                personalPhone[0]?.personalPhone
                  ? personalPhone[0].personalPhone
                  : '--'
              }`}
            </Text>
          </View>
        </View>
        <View
          style={{
            ...styles.inputDis,
            flexDirection: 'row',
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.formInputTitle}>Email ID</Text>
            <Text style={styles.formInputData}>
              {PrimEmail[0]?.Primary ? PrimEmail[0]?.Primary : '--'}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.formInputTitle}>Social Security number</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.ssn ? studentInfo?.ssn : '--'}
            </Text>
          </View>
        </View>
        <View>
          <Text style={styles.formInputTitle}>
            Are you a Lawful Permanent Residence?
          </Text>
          <Text style={styles.formInputData}>
            {studentInfo?.isLpr === 1
              ? 'Yes'
              : studentInfo?.isLpr === 0
              ? 'No'
              : '--'}
          </Text>
        </View>
        <View
          style={{
            ...styles.inputDis,
            flexDirection: 'row',
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.formInputTitle}>GRE Score</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.greScore ? studentInfo?.greScore : '--'}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.formInputTitle}>TOEFL Score</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.toeflScore ? studentInfo?.toeflScore : '--'}
            </Text>
          </View>
        </View>
      </>
    );
  };
  const MaritalStatus = () => {
    return (
      <>
        <View style={{flex: 1, marginTop: scale(-10)}}>
          <Text style={styles.formInputTitle}>
            What is your current marital status ?
          </Text>
          <Text style={styles.formInputData}>
            {studentInfo?.maritalStatus?.description
              ? studentInfo?.maritalStatus?.description
              : '--'}
          </Text>
        </View>
      </>
    );
  };
  const CurrentAddressDetails = () => {
    return (
      <>
        <View>
          <View style={{flex: 1}}>
            <Text style={{...styles.formInputTitle, marginTop: 0}}>
              Address1
            </Text>
            <Text style={styles.formInputData}>
              {currAddressData?.[0]?.CURR?.addressLine1
                ? currAddressData?.[0]?.CURR?.addressLine1
                : '--'}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.formInputTitle}>Address2</Text>
            <Text style={styles.formInputData}>
              {currAddressData?.[0]?.CURR?.addressLine2
                ? currAddressData?.[0]?.CURR?.addressLine2
                : '--'}
            </Text>
          </View>
          <View
            style={{
              ...styles.inputDis,
              flexDirection: 'row',
              flex: 1,
            }}>
            <View style={{flex: 1}}>
              <Text style={styles.formInputTitle}>Country</Text>
              <Text style={styles.formInputData}>
                {currAddressData?.[0]?.CURR?.countryCode?.countryName
                  ? currAddressData?.[0]?.CURR?.countryCode?.countryName
                  : '--'}
              </Text>
            </View>
            <View style={{flex: 1, marginLeft: 10}}>
              <Text style={styles.formInputTitle}>State</Text>
              <Text style={styles.formInputData}>
                {currAddressData?.[0]?.CURR?.stateProvinceName
                  ? currAddressData?.[0]?.CURR?.stateProvinceName
                  : '--'}
              </Text>
            </View>
          </View>
          <View
            style={{
              ...styles.inputDis,
              flexDirection: 'row',
              flex: 1,
            }}>
            <View style={{flex: 1}}>
              <Text style={styles.formInputTitle}>City</Text>
              <Text style={styles.formInputData}>
                {currAddressData?.[0]?.CURR?.city
                  ? currAddressData?.[0]?.CURR?.city
                  : '--'}
              </Text>
            </View>
            <View style={{flex: 1, marginLeft: 10}}>
              <Text style={styles.formInputTitle}>Locality</Text>
              <Text style={styles.formInputData}>
                {currAddressData?.[0]?.CURR?.locality
                  ? currAddressData?.[0]?.CURR?.locality
                  : '--'}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.formInputTitle}>ZIP / Postal Code</Text>
            <Text style={styles.formInputData}>
              {currAddressData?.[0]?.CURR?.postCode
                ? currAddressData?.[0]?.CURR?.postCode
                : '--'}
            </Text>
          </View>
        </View>
      </>
    );
  };
  const PermanentAddressDetails = () => {
    return (
      <>
        <View style={{flex: 1}}>
          <Text style={{...styles.formInputTitle, marginTop: 0}}>Address1</Text>
          <Text style={styles.formInputData}>
            {perAddressData?.[0]?.PERM?.addressLine1
              ? perAddressData?.[0]?.PERM?.addressLine1
              : '--'}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.formInputTitle}>Address2</Text>
          <Text style={styles.formInputData}>
            {perAddressData?.[0]?.PERM?.addressLine2
              ? perAddressData?.[0]?.PERM?.addressLine2
              : '--'}
          </Text>
        </View>
        <View
          style={{
            ...styles.inputDis,
            flexDirection: 'row',
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.formInputTitle}>Country</Text>
            <Text style={styles.formInputData}>
              {perAddressData?.[0]?.PERM?.countryCode?.countryName
                ? perAddressData?.[0]?.PERM?.countryCode?.countryName
                : '--'}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.formInputTitle}>State</Text>
            <Text style={styles.formInputData}>
              {perAddressData?.[0]?.PERM?.stateProvinceName
                ? perAddressData?.[0]?.PERM?.stateProvinceName
                : '--'}
            </Text>
          </View>
        </View>
        <View
          style={{
            ...styles.inputDis,
            flexDirection: 'row',
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.formInputTitle}>City</Text>
            <Text style={styles.formInputData}>
              {perAddressData?.[0]?.PERM?.city
                ? perAddressData?.[0]?.PERM?.city
                : '--'}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.formInputTitle}>Locality</Text>
            <Text style={styles.formInputData}>
              {perAddressData?.[0]?.PERM?.locality
                ? perAddressData?.[0]?.PERM?.locality
                : '--'}
            </Text>
          </View>
        </View>
        <View>
          <Text style={styles.formInputTitle}>ZIP / Postal Code</Text>
          <Text style={styles.formInputData}>
            {perAddressData?.[0]?.PERM?.postCode
              ? perAddressData?.[0]?.PERM?.postCode
              : '--'}
          </Text>
        </View>
      </>
    );
  };
  const ForeignAddressDetails = () => {
    return (
      <>
        <View style={{flex: 1}}>
          <Text style={{...styles.formInputTitle, marginTop: 0}}>Address1</Text>
          <Text style={styles.formInputData}>
            {forgnAddressData?.[0]?.FORN?.addressLine1
              ? forgnAddressData?.[0]?.FORN?.addressLine1
              : '--'}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.formInputTitle}>Address2</Text>
          <Text style={styles.formInputData}>
            {forgnAddressData?.[0]?.FORN?.addressLine2
              ? forgnAddressData?.[0]?.FORN?.addressLine2
              : '--'}
          </Text>
        </View>
        <View
          style={{
            ...styles.inputDis,
            flexDirection: 'row',
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.formInputTitle}>Country</Text>
            <Text style={styles.formInputData}>
              {forgnAddressData?.[0]?.FORN?.countryCode?.countryName
                ? forgnAddressData?.[0]?.FORN?.countryCode?.countryName
                : '--'}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.formInputTitle}>State</Text>
            <Text style={styles.formInputData}>
              {forgnAddressData?.[0]?.FORN?.stateProvinceName
                ? forgnAddressData?.[0]?.FORN?.stateProvinceName
                : '--'}
            </Text>
          </View>
        </View>
        <View
          style={{
            ...styles.inputDis,
            flexDirection: 'row',
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.formInputTitle}>City</Text>
            <Text style={styles.formInputData}>
              {forgnAddressData?.[0]?.FORN?.city
                ? forgnAddressData?.[0]?.FORN?.city
                : '--'}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.formInputTitle}>Locality</Text>
            <Text style={styles.formInputData}>
              {forgnAddressData?.[0]?.FORN?.locality
                ? forgnAddressData?.[0]?.FORN?.locality
                : '--'}
            </Text>
          </View>
        </View>
        <View>
          <Text style={styles.formInputTitle}>ZIP / Postal Code</Text>
          <Text style={styles.formInputData}>
            {forgnAddressData?.[0]?.FORN?.postCode
              ? forgnAddressData?.[0]?.FORN?.postCode
              : '--'}
          </Text>
        </View>
      </>
    );
  };
  const PlaceofBirth = () => {
    return (
      <>
        <View
          style={{
            ...styles.inputDis,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: scale(-10),
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Text style={{...styles.formInputTitle}}>Country</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.countryCode?.countryName
                ? studentInfo?.countryCode?.countryName
                : '--'}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.formInputTitle}>State</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.birthStateProvinceName
                ? studentInfo?.birthStateProvinceName
                : '--'}
            </Text>
          </View>
        </View>
        <View
          style={{
            ...styles.inputDis,
            flexDirection: 'row',
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.formInputTitle}>City</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.birthCity ? studentInfo?.birthCity : '--'}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.formInputTitle}>Citizenship</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.ctznshipCountryCode?.countryName
                ? studentInfo?.ctznshipCountryCode?.countryName
                : '--'}
            </Text>
          </View>
        </View>
      </>
    );
  };
  const BiographicInformation = () => {
    return (
      <>
        <View
          style={{
            ...styles.inputDis,
            flexDirection: 'row',
            flex: 1,
            marginTop: scale(-10),
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.formInputTitle}>Ethnicity</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.ethnicity?.name
                ? studentInfo?.ethnicity?.name
                : '--'}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.formInputTitle}>Race</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.race?.[0]?.raceId?.name
                ? studentInfo?.race?.[0]?.raceId?.name
                : '--'}
            </Text>
          </View>
        </View>
        <View
          style={{
            ...styles.inputDis,
            flexDirection: 'row',
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.formInputTitle}>Hair Colour</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.hairColor ? studentInfo?.hairColor : '--'}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.formInputTitle}>Eyes Colour</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.eyeColor ? studentInfo?.eyeColor : '--'}
            </Text>
          </View>
        </View>
        <View
          style={{
            ...styles.inputDis,
            flexDirection: 'row',
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.formInputTitle}>Weight</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.weight ? studentInfo?.weight : '--'}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.formInputTitle}>Height</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.height ? studentInfo?.height : '--'}
            </Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.formInputTitle}>
            Any marks of identification?
          </Text>
          <Text style={styles.formInputData}>
            {studentInfo?.identificationMark
              ? studentInfo?.identificationMark
              : '--'}
          </Text>
        </View>
      </>
    );
  };
  const PassportDetails = () => {
    return (
      <>
        <View
          style={{
            ...styles.inputDis,
            flexDirection: 'row',
            flex: 1,
            marginTop: scale(-10),
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.formInputTitle}>Passport Number</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.passport?.[0]?.passportNo
                ? studentInfo?.passport?.[0]?.passportNo
                : '--'}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.formInputTitle}>Issuing authority</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.passport?.[0]?.issueCountryCode?.countryName
                ? studentInfo?.passport?.[0]?.issueCountryCode?.countryName
                : '--'}
            </Text>
          </View>
        </View>
        <View
          style={{
            ...styles.inputDis,
            flexDirection: 'row',
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.formInputTitle}>Date of Issue</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.passport?.[0]?.issueDate
                ? studentInfo?.passport?.[0]?.issueDate
                : '--'}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.formInputTitle}>Date of Expiry</Text>
            <Text style={styles.formInputData}>
              {studentInfo?.passport?.[0]?.expiryDate
                ? studentInfo?.passport?.[0]?.expiryDate
                : '--'}
            </Text>
          </View>
        </View>
        {/* <View style={{ flex: 1 }}>
          <Text style={styles.formInputTitle}>Photoopy of Passport</Text>
          <Text style={styles.formInputData}>--</Text>
        </View> */}
      </>
    );
  };
  const PersonalDetailsData = [
    {
      id: '01',
      title: 'Personal Info',
      data: PersonalInfo(),
    },
    {
      id: '02',
      title: 'Marital Status',
      data: MaritalStatus(),
    },
    {
      id: '03',
      title: 'Current Address Details',
      data: CurrentAddressDetails(),
    },
    {
      id: '04',
      title: 'Permanent Address Details',
      data: PermanentAddressDetails(),
    },
    {
      id: '05',
      title: 'Foreign Address Details',
      data: ForeignAddressDetails(),
    },
    {
      id: '06',
      title: 'Place of Birth',
      data: PlaceofBirth(),
    },
    {
      id: '07',
      title: 'Biographic Information',
      data: BiographicInformation(),
    },
    {
      id: '08',
      title: 'Passport Details',
      data: PassportDetails(),
    },
  ];
  const PersonalDetailsRenderItem = ({item}) => (
    <View
      style={{
        marginHorizontal: scale(10),
        marginTop: scale(10),
        backgroundColor: '#fff',
      }}>
      <Accordion
        title={item.title}
        noMarginVertical={true}
        data={item.data}
        noMarginLeft={true}
        // removeBorder={true}
        backgroundColor={true}
      />
    </View>
  );
  const resetEdit = () => {
    console.log('fire');

    editProfile === true
      ? setModalVisible(!modalVisible)
      : setEditProfile(!editProfile);
  };
  const editHnadler = () => {
    setEditProfile(!editProfile);
  };
  return (
    <View style={{flexGrow: 10}}>
      {editProfile ? (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: '#00000040',
            }}>
            <View
              style={{
                margin: scale(20),
                backgroundColor: '#FFFFFF',
                padding: scale(20),
                shadowOpacity: 0.25,
                elevation: 5,
                height: scale(213),
                width: scale(328),
              }}>
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: scale(18),
                      color: '#4D4F5C',
                      fontFamily: 'SourceSansPro-Semibold',
                    }}>
                    Unsaved changes!
                  </Text>
                  <Pressable onPress={() => setModalVisible(!modalVisible)}>
                    <AntDesign
                      name="close"
                      size={23}
                      style={{
                        color: 'grey',
                        marginBottom: scale(10),
                      }}
                    />
                  </Pressable>
                </View>
                <View
                  style={{
                    marginVertical: scale(10),
                    borderBottomWidth: scale(1),
                    borderBottomColor: '#00000029',
                  }}
                />
                <Text
                  style={{
                    fontSize: scale(14),
                    color: '#4D4F5C',
                    fontFamily: 'SourceSansPro-Regular',
                  }}>
                  If you leave before saving, all changes made on the page will
                  be lost. Do you wish to continue ?
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: scale(30),
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: scale(12),
                      borderRadius: scale(5),
                      backgroundColor: '#EFEFEF',
                      width: '30%',
                    }}
                    disabled={false}>
                    <Text
                      style={{
                        fontSize: scale(14),
                        fontFamily: 'SourceSansPro-SemiBold',
                        color: '#656565',
                      }}>
                      No
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setEditProfile(!editProfile),
                        setModalVisible(!modalVisible);
                    }}
                    style={{
                      marginLeft: scale(30),
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: scale(12),
                      borderRadius: scale(5),
                      backgroundColor: '#00A0DA',
                      width: '30%',
                    }}
                    disabled={false}>
                    <Text
                      style={{
                        fontSize: scale(14),
                        fontFamily: 'SourceSansPro-SemiBold',
                        color: '#FFFFFF',
                      }}>
                      Yes
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
      {editProfile ? (
        <PersonalDetailsEdit resetEdit={resetEdit} editProfile={editHnadler} />
      ) : (
        <View style={{backgroundColor: '#fff', flex: 1}}>
          <FlatList
            data={PersonalDetailsData}
            renderItem={PersonalDetailsRenderItem}
            keyExtractor={item => item.id}
          />
        </View>
      )}
    </View>
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
  getstate: code => fetchStateList(code),
};
export default connect(mapStateToProps, mapDispatchToProps)(PersonalDetails);
