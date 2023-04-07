import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import Accordion from '../../../../Infrastructure/component/Accordion/Accordion';
import styles from '../styles';
import {scale} from '../../../../Infrastructure/utils/screenUtility';
import {connect} from 'react-redux';
import {studentInformation} from '../../../../application/store/actions/student';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Switch} from 'react-native-switch';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  CustomInput,
  CustomButton,
  Labeltext,
} from '../../../../Infrastructure/component/Custom';
import PhoneInput from 'react-native-phone-input';
import {RadioButton, Checkbox, Button} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loader from '../../../../Infrastructure/component/Loader/Loader';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {fetchStateList} from '../../../../application/store/actions/student';
import {PersonalDetailsRight} from '../../../../Infrastructure/navigation/MyAccountNavigator';
import EditIcon from 'react-native-vector-icons/Octicons';
import EditCancel from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';
import {studentPesonalDetails} from '../../../../application/store/actions/student';
import {
  getAuthToken,
  getBeneficiaryUserID,
} from '../../../../Infrastructure/utils/storageUtility';
import {decode as atob, encode as btoa} from 'base-64';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {baseURL} from '../../../../application/config';
import {getProfileDocInfo} from '../../../../application/store/actions/student';
import {relatedDocDelete} from '../../../../application/store/actions/student';
const mailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,3})$/;
const loginValidationSchema = yup.object().shape({
  title: yup.string().required('Title Required').nullable(),
  firstName: yup.string().required('First Name Required'),
  lastName: yup.string().required('Last Name Required'),
  email: yup
    .string()
    .matches(/^\S*$/, 'Space is not allowed')
    .matches(mailRegex, 'Please enter valid Email')
    .required('Email is Required'),
  alterEmail: yup
    .string()
    .matches(/^\S*$/, 'Space is not allowed')
    .matches(mailRegex, 'Please enter valid Email'),
  phoneNumber: yup
    .string()
    .matches(/^\S*$/, 'Space is not allowed')
    .matches(
      /^[^!@#$%^&*()\"/?'=+{}; :,<.>]*$/,
      'Special character is not allowed',
    )
    .required('Phone number Required'),
  countryName: yup.string().required('Select Country'),
  TOEFLscore: yup
    .string()
    .required('TOEFL Score Required')
    .matches(/^[0-9]+$/, 'Enter a valid TOEFL Score'),
  GREscore: yup
    .string()
    .required('GRE Score Required')
    .matches(/^[0-9]+$/, 'Enter a valid GRE Score'),
  gender: yup.string().required('Gender Required'),
  dob: yup.string().required('Date of Birth Required'),
  LPRstatus: yup.string().required('LPR Status Required'),
  MaritalStatus: yup.string().required('Marital Status Required'),
  // MarriageState: yup.string().when("MaritalStatus", {
  //   is: (MaritalStatus) => MaritalStatus !== "Single, never married",
  //   then: yup.string().required("State Required"),
  // }),
  // MarriageCity: yup.string().when("MaritalStatus", {
  //   is: (MaritalStatus) => MaritalStatus !== "Single, never married",
  //   then: yup.string().required("City Required"),
  // }),
  // mrgDate: yup.string().when("MaritalStatus", {
  //   is: (MaritalStatus) => MaritalStatus !== "Single, never married",
  //   then: yup.string().required("Marriage Date Required"),
  // }),
  CurrentAddress1: yup.string().required('Address Required'),
  // CurrenttAddressState: yup.string().required("State Required"),
  CurrentZIP: yup.string().required('ZIP / Postal Code Required'),
  CurrentCity: yup.string().required('City Required'),
  CurrentLocality: yup.string().required('Locality Required'),
  PermanentAddress1: yup.string().required('Address Required'),
  PermanentAddressCity: yup.string().required('City Required'),
  // PermanentAddressState: yup.string().required('State Required'),
  PermanentAddressLocality: yup.string().required('Locality Required'),
  PermanentAddressZIP: yup.string().required('ZIP / Postal Code Required'),
  // BirthState: yup.string().required("State Required"),
  BirthCity: yup.string().required('City Required'),
  // BirthCitizenship: yup.string().required("Citizenship Required"),
  // BirthCitizenShipAcquired: yup.string().required("Details Required"),
  BirthCitizenShipAcquired: yup.string().when('BirthCitizenship', {
    is: BirthCitizenship => BirthCitizenship === 'US',
    then: yup.string().required('Details Required'),
  }),
  certificateNumber: yup.string().when('cirtCitizenshipStatus', {
    is: cirtCitizenshipStatus => cirtCitizenshipStatus === 'true',
    then: yup.string().required('certificate Number Required'),
  }),
  PlaceOfIssurance: yup.string().when('cirtCitizenshipStatus', {
    is: cirtCitizenshipStatus => cirtCitizenshipStatus === 'true',
    then: yup.string().required('Place details Required'),
  }),
  DateOfIssurance: yup.string().when('cirtCitizenshipStatus', {
    is: cirtCitizenshipStatus => cirtCitizenshipStatus === 'true',
    then: yup.string().required('Date of Issurance Required'),
  }),
  Ethnicity: yup.string().required('Ethnicity Required'),
  Race: yup.string().required('Race Required'),
  HairColour: yup.string().required('Hair Colour Required'),
  EyesColour: yup.string().required('Eyes Colour Required'),
  weight: yup.string().required('Weight Required'),
  Height: yup.string().required('Height Required'),
  PassportNumber: yup.string().required('Passport Number Required'),
  issuingAuthority: yup.string().required('Issuing Authority Required'),
  IssuedDate: yup.string().required('Issued Date Required'),
  ExpiryDate: yup.string().required('Expiry Date Required'),
});
const PersonalDetailsEdit = props => {
  const studentInfo = props.studentInformation.data || [];
  const phoneInput = useRef(null);
  const PrimEmail = [];
  const AltEmail = [];
  const personalPhone = [];
  const stateData = [];
  const [showdropDown, setshowDropdown] = useState(false);
  const [showPerStatedropDown, setshowPerStateDropdown] = useState(false);
  const [showForgnStatedropDown, setshowForgnStateDropdown] = useState(false);
  const [showmrgDropDown, setshowMrgStateDropdown] = useState(false);
  const [showBirthDropDown, setshowBirthDropdown] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const countryListData = props.CountryList.data || [];
  const [toggleCheckBox, setToggleCheckBox] = useState('');
  const [otherNameCheck, setOtherNameCheck] = useState(false);
  const [errorcountry, setErrorCountry] = useState('');
  const [errorcurrentState, setErrorCurrentCountry] = useState('');
  const [errorPermCountry, setErrorPermCountry] = useState('');
  const [errorpermState, setErrorpermState] = useState('');
  const [errorBirthCountry, setErrorBirthCountry] = useState('');
  const [errorBirthState, setErrorBirthState] = useState('');
  const [status, setStatus] = useState(false);
  const [passportDetails, setPasspoertDetails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deletePassID, setDeletePassID] = useState('');
  const [singnatureDoc, setSingnatureDoc] = useState(
    props.studentInformation.data.signImage
      ? props.studentInformation.data.signImage
      : '',
  );
  const ref = useRef(null);
  const changeRef = value => {
    ref.current = value;
  };
  const stateRef = useRef(null);
  const changeStateRef = value => {
    stateRef.current = value;
  };

  const perCountry = useRef(null);
  const perCountryValueHandler = value => {
    perCountry.current = value;
  };
  const permStateRef = useRef(null);
  const perStateValueHandler = value => {
    permStateRef.current = value;
  };

  const forgnCountry = useRef(null);
  const forgnCountryValueHandler = value => {
    forgnCountry.current = value;
  };
  const forgnStateRef = useRef(null);
  const forgnStateValueHandler = value => {
    forgnStateRef.current = value;
  };

  const birthCountry = useRef(null);
  const birthCountryValueHandler = value => {
    birthCountry.current = value;
  };
  const birthStateRef = useRef(null);
  const birthStateValueHandler = value => {
    birthStateRef.current = value;
  };

  const mrgCountry = useRef(null);
  const mrgCountryValueHandler = value => {
    mrgCountry.current = value;
  };
  const mrgStateRef = useRef(null);
  const mrgStateValueHandler = value => {
    mrgStateRef.current = value;
  };

  const currentVisaStatus = useRef(null);
  const visaStatusHandler = value => {
    currentVisaStatus.current = value;
  };
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
  const [currentStateList, setCurrentStateList] = useState([]);
  const getStateData = value => {
    props
      .getstate(value)
      .then(res => {
        setCurrentStateList(res.data);
        res.data.length > 0 ? setshowDropdown(true) : setshowDropdown(false);
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  currentStateList
    ? currentStateList.map(item => {
        stateData.push({
          label: item.stateProvinceName,
          value: item.stateProvinceCode,
          stateProvinceName: item.stateProvinceName,
          stateProvinceCode: item.stateProvinceCode,
        });
      })
    : null;
  const [permanentStateList, setPermanentStateList] = useState([]);
  const getPermStateData = value => {
    props
      .getstate(value)
      .then(res => {
        setPermanentStateList(res.data);
        res.data.length > 0
          ? setshowPerStateDropdown(true)
          : setshowPerStateDropdown(false);
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  const PermStateData = [];
  permanentStateList
    ? permanentStateList.map(item => {
        PermStateData.push({
          label: item.stateProvinceName,
          value: item.stateProvinceCode,
          stateProvinceName: item.stateProvinceName,
          stateProvinceCode: item.stateProvinceCode,
        });
      })
    : null;
  const formHandler = async formData => {
    const benID = await getBeneficiaryUserID();
    const phoneCountryData = formData?.countryName
      ? countryListData.filter(
          country =>
            country.shortCountryCode === formData.countryName.toUpperCase(),
        )
      : [];
    const currentCountryData = ref?.current?.value
      ? countryListData.filter(
          country => country.countryCode === ref?.current?.value,
        )
      : currAddressData[0]?.CURR?.countryCode?.countryCode
      ? countryListData.filter(
          country =>
            country.countryCode ===
            currAddressData[0]?.CURR?.countryCode?.countryCode,
        )
      : [];
    const permCountryData = perCountry?.current?.value
      ? countryListData.filter(
          country => country.countryCode === perCountry?.current?.value,
        )
      : perAddressData[0]?.PERM?.countryCode?.countryCode
      ? countryListData.filter(
          country =>
            country.countryCode ===
            perAddressData[0]?.PERM?.countryCode?.countryCode,
        )
      : [];
    const forgnCountryData = forgnCountry?.current?.value
      ? countryListData.filter(
          country => country.countryCode === forgnCountry?.current?.value,
        )
      : forgnAddressData[0]?.FORN?.countryCode?.countryCode
      ? countryListData.filter(
          country =>
            country.countryCode ===
            forgnAddressData[0]?.FORN?.countryCode?.countryCode,
        )
      : [];
    const birthCountryData = birthCountry?.current?.value
      ? countryListData.filter(
          country => country.countryCode === birthCountry?.current?.value,
        )
      : studentInfo?.countryCode?.countryCode
      ? countryListData.filter(
          country =>
            country.countryCode === studentInfo?.countryCode?.countryCode,
        )
      : [];
    const mrgCountryData = mrgCountry?.current?.value
      ? countryListData.filter(
          country => country.countryCode === mrgCountry?.current?.value,
        )
      : [];
    const passportCountryData = formData?.issuingAuthority
      ? countryListData.filter(
          country => country.countryCode === formData?.issuingAuthority,
        )
      : [];
    const citizenShipCountryData = formData?.BirthCitizenship
      ? countryListData.filter(
          country => country.shortCountryCode === formData?.BirthCitizenship,
        )
      : [];
    console.log('formData', formData);
    currentCountryData.length <= 0
      ? setErrorCountry('Please Select Country')
      : setErrorCountry('');
    formData.CurrenttAddressState === '' && stateRef.current === null
      ? setErrorCurrentCountry('State details required')
      : setErrorCurrentCountry('');
    permCountryData.length <= 0
      ? setErrorPermCountry('Please Select Country')
      : setErrorPermCountry('');
    formData.PermanentAddressState === '' && permStateRef.current === null
      ? setErrorpermState('State details required')
      : setErrorpermState('');
    birthCountryData.length <= 0
      ? setErrorBirthCountry('Please Select Country')
      : setErrorBirthCountry('');
    formData.BirthState === '' && birthStateRef.current === null
      ? setErrorBirthState('State details required')
      : setErrorBirthState('');

    const payload = {
      id: benID ? benID : '',
      fName: formData.firstName,
      mName: formData.middleName,
      lName: formData.lastName,
      greScore: formData.GREscore,
      toeflScore: formData.TOEFLscore,
      title: formData.title,
      aliasName: otherNameCheck
        ? [
            {
              fName: formData.aliasName ? formData.aliasName : '',
              title: formData.aliasTitle ? formData.aliasTitle : '',
            },
          ]
        : [],
      gender: {
        id:
          formData.gender === 'FEML'
            ? 7
            : formData.gender === 'MALE'
            ? 6
            : null,
        name: formData.gender,
      },
      dob: formData.dob
        ? moment(formData.dob).format('YYYY-MM-DD')
        : studentInfo?.dob
        ? studentInfo?.dob
        : '',
      ssn: formData.SocialSecurityNumber,
      emailContacts: [
        {
          email: formData.email,
          id: studentInfo?.emailContacts[0]?.id
            ? studentInfo?.emailContacts[0]?.id
            : '',
          type: {
            code: 'PRIM',
            id: 34,
          },
        },
      ],
      phoneContacts: [
        {
          phoneNo: formData.phoneNumber,
          id: studentInfo?.phoneContacts[0]?.id
            ? studentInfo?.phoneContacts[0]?.id
            : '',
          type: {
            code: 'MOBL',
            id: 31,
          },
          countryCode: {
            countryCode: phoneCountryData[0]?.countryCode
              ? phoneCountryData[0].countryCode
              : '',
            phoneCode: phoneCountryData[0]?.phoneCode
              ? phoneCountryData[0].phoneCode
              : '',
          },
        },
      ],
      address: [],
      identificationMark: formData.identification,
      height: formData.Height,
      hairColor: formData.HairColour,
      skinColor: null,
      eyeColor: formData.EyesColour,
      countryCode: {
        countryCode: birthCountryData[0]?.countryCode
          ? birthCountryData[0].countryCode
          : studentInfo.birthCountryCode
          ? studentInfo.birthCountryCode
          : '',
      },
      birthStateProvinceCode:
        showdropDown && birthStateRef.current
          ? birthStateRef?.current?.stateProvinceCode
          : studentInfo.birthStateProvinceCode
          ? studentInfo.birthStateProvinceCode
          : null,
      birthStateProvinceName:
        showdropDown && birthStateRef.current
          ? birthStateRef?.current?.stateProvinceName
          : formData.BirthState
          ? formData.BirthState
          : null,
      birthCity: formData.BirthCity,
      ctznshipCountryCode: {
        countryName: citizenShipCountryData[0]?.countryName
          ? citizenShipCountryData[0]?.countryName
          : studentInfo?.ctznshipCountryCode?.countryName
          ? studentInfo?.ctznshipCountryCode?.countryName
          : '',
        countryCode: citizenShipCountryData[0]?.countryCode
          ? citizenShipCountryData[0]?.countryCode
          : studentInfo?.ctznshipCountryCode?.countryCode
          ? studentInfo?.ctznshipCountryCode?.countryCode
          : '',
      },
      passport: [
        {
          id: studentInfo?.passport[0]?.id ? studentInfo?.passport[0]?.id : '',
          passportNo: formData.PassportNumber,
          issueDate: formData.IssuedDate
            ? moment(formData.IssuedDate).format('YYYY-MM-DD')
            : studentInfo?.passport[0]?.issueDate
            ? studentInfo?.passport[0]?.issueDate
            : '',
          expiryDate: formData.ExpiryDate
            ? moment(formData.ExpiryDate).format('YYYY-MM-DD')
            : studentInfo?.passport[0]?.expiryDate
            ? studentInfo?.passport[0]?.expiryDate
            : '',
          issueCountryCode: {
            countryCode: passportCountryData[0]?.countryCode
              ? passportCountryData[0]?.countryCode
              : studentInfo?.passport[0]?.issueCountryCode?.countryCode
              ? studentInfo?.passport[0]?.issueCountryCode?.countryCode
              : '',
          },
        },
      ],
      currentVisaStatus: null,
      profileImage: null,
      smallProfileImage: null,
      profilePic: null,
      smallProfilePic: null,
      firstAndLastName: `${formData.firstName} ${formData.lastName}`,
      maritalStatus: {
        id:
          formData.MaritalStatus === 'Divorced'
            ? 12
            : formData.MaritalStatus === 'Legally Separated'
            ? 932
            : formData.MaritalStatus === 'Marriage Annulled'
            ? 933
            : formData.MaritalStatus === 'Married'
            ? 9
            : formData.MaritalStatus === 'Single, never married'
            ? 10
            : formData.MaritalStatus === 'Married'
            ? 9
            : formData.MaritalStatus === 'Widowed'
            ? 11
            : '',
        name: formData.MaritalStatus,
      },
      countryOfMarriage: {
        countryCode:
          formData.MaritalStatus !== 'Single, never married'
            ? mrgCountryData[0]?.countryCode
              ? mrgCountryData[0]?.countryCode
              : studentInfo?.countryOfMarriage?.countryCode
              ? studentInfo?.countryOfMarriage?.countryCode
              : ''
            : '',
        countryName:
          formData.MaritalStatus !== 'Single, never married'
            ? mrgCountryData[0]?.countryName
              ? mrgCountryData[0]?.countryName
              : studentInfo?.countryOfMarriage?.countryName
              ? studentInfo?.countryOfMarriage?.countryName
              : ''
            : '',
      },
      marriageStateProvinceCode:
        formData.MaritalStatus !== 'Single, never married'
          ? mrgStateRef?.current?.stateProvinceCode
            ? mrgStateRef?.current?.stateProvinceCode
            : studentInfo.marriageStateProvinceCode
            ? studentInfo.marriageStateProvinceCode
            : null
          : null,
      marriageStateProvinceName:
        formData.MaritalStatus !== 'Single, never married'
          ? mrgStateRef?.current?.stateProvinceName
            ? mrgStateRef.current.stateProvinceName
            : formData.MarriageState
            ? formData.MarriageState
            : studentInfo.marriageStateProvinceName
            ? studentInfo.marriageStateProvinceName
            : ''
          : null,
      cityOfMarriage:
        formData.MaritalStatus !== 'Single, never married'
          ? formData.MarriageCity
            ? formData.MarriageCity
            : null
          : null,
      isLpr:
        formData.LPRstatus === 'Yes'
          ? 1
          : formData.LPRstatus === 'No'
          ? 0
          : studentInfo.isLpr === 0
          ? 0
          : studentInfo.isLpr === 1
          ? 1
          : null,
      lprThruMarriage: 1,
      greenCardNo: null,
      ethnicity: {
        id:
          formData.Ethnicity === 'Hispanic or Latino'
            ? 860
            : formData.Ethnicity === 'Not Hispanic or Latino'
            ? 861
            : 860,
        name: formData.Ethnicity ? formData.Ethnicity : null,
      },
      race: [
        {
          raceId: {
            id:
              formData.Race === 'American Indian or Alaska Native'
                ? 865
                : formData.Race === 'Asian'
                ? 863
                : formData.Race === 'Black or African American'
                ? 864
                : formData.Race === 'Native Hawaiian or Other Pacific Islander'
                ? 866
                : formData.Race === 'White'
                ? 862
                : null,
            name: formData.Race,
          },
          id: 0,
        },
      ],
      weight: formData.weight,
      ctznAcqrTypeId:
        citizenShipCountryData[0]?.countryCode === 'USA'
          ? {
              id:
                formData.BirthCitizenShipAcquired ===
                'Birth in the United States'
                  ? 892
                  : formData.BirthCitizenShipAcquired === 'Naturalization'
                  ? 893
                  : formData.BirthCitizenShipAcquired === 'Parents'
                  ? 894
                  : 894,
              name: formData.BirthCitizenShipAcquired
                ? formData.BirthCitizenShipAcquired
                : '',
            }
          : studentInfo?.ctznshipCountryCode?.countryCode === 'USA'
          ? {
              id:
                formData.BirthCitizenShipAcquired ===
                'Birth in the United States'
                  ? 892
                  : formData.BirthCitizenShipAcquired === 'Naturalization'
                  ? 893
                  : formData.BirthCitizenShipAcquired === 'Parents'
                  ? 894
                  : 894,
              name: formData.BirthCitizenShipAcquired
                ? formData.BirthCitizenShipAcquired
                : '',
            }
          : citizenShipCountryData[0]?.countryCode !== 'USA' ||
            studentInfo?.ctznshipCountryCode?.countryCode !== 'USA'
          ? null
          : null,
      hasCtznCrtfct:
        currentVisaStatus?.current !== null
          ? currentVisaStatus?.current === true
            ? 1
            : 0
          : citizenShipCountryData[0]?.countryCode !== 'USA'
          ? 0
          : studentInfo.hasCtznCrtfct,
      ctznCrtfctNo:
        currentVisaStatus?.current === true || studentInfo.hasCtznCrtfct === 1
          ? citizenShipCountryData[0]?.countryCode === 'USA' ||
            studentInfo?.ctznshipCountryCode?.countryCode === 'USA'
            ? formData.certificateNumber
            : ''
          : '',
      ctznCrtfctIssPlace:
        citizenShipCountryData[0]?.countryCode === 'USA' ||
        studentInfo?.ctznshipCountryCode?.countryCode === 'USA'
          ? currentVisaStatus?.current === true ||
            studentInfo?.hasCtznCrtfct === 1
            ? formData.PlaceOfIssurance
            : ''
          : '',
      ctznCrtfctIssDate:
        // currentVisaStatus?.current === true &&
        // citizenShipCountryData[0]?.countryCode === "USA"
        //   ? moment(formData.DateOfIssurance).format("YYYY-MM-DD")
        //   : studentInfo.hasCtznCrtfct === 1
        //   ? moment(formData.DateOfIssurance).format("YYYY-MM-DD")
        //   : "",

        // citizenShipCountryData[0]?.countryCode !== "USA"
        //   ? ""
        //   : currentVisaStatus?.current === true
        //   ? moment(formData.DateOfIssurance).format("YYYY-MM-DD")
        //   : studentInfo.hasCtznCrtfct === 1
        //   ? moment(formData.DateOfIssurance).format("YYYY-MM-DD")
        //   : "",

        citizenShipCountryData[0]?.countryCode === 'USA' ||
        studentInfo?.ctznshipCountryCode?.countryCode === 'USA'
          ? currentVisaStatus?.current === true ||
            studentInfo?.hasCtznCrtfct === 1
            ? moment(formData.DateOfIssurance).format('YYYY-MM-DD')
            : ''
          : '',
      marriageDate:
        formData.MaritalStatus !== 'Single, never married'
          ? moment(formData.mrgDate).format('YYYY-MM-DD')
          : null,
      birthCountryCode: {
        countryCode: birthCountryData[0]?.countryCode
          ? birthCountryData[0].countryCode
          : studentInfo.birthCountryCode
          ? studentInfo.birthCountryCode
          : '',
      },
    };
    const currAddress = {
      addressLine1: formData.CurrentAddress1,
      addressLine2: formData.CurrentAddress2,
      postCode: formData.CurrentZIP,
      doorNo: '',
      id: currAddressData[0]?.CURR?.id ? currAddressData[0]?.CURR?.id : '',
      streetNo: '',
      countryCode: {
        countryCode: currentCountryData[0]?.countryCode
          ? currentCountryData[0]?.countryCode
          : '',
      },
      stateProvinceCode: showdropDown
        ? stateRef?.current?.stateProvinceCode
          ? stateRef?.current?.stateProvinceCode
          : currAddressData[0]?.CURR?.stateProvinceCode
          ? currAddressData[0]?.CURR?.stateProvinceCode
          : ''
        : null,
      stateProvinceName: !showdropDown
        ? formData.CurrenttAddressState
        : stateRef?.current?.stateProvinceName
        ? stateRef.current.stateProvinceName
        : currAddressData[0]?.CURR?.stateProvinceName
        ? currAddressData[0]?.CURR?.stateProvinceName
        : '',
      city: formData.CurrentCity,
      locality: formData.CurrentLocality,
      type: {
        id: 1,
        code: 'CURR',
      },
    };
    const perrAddress = {
      addressLine1: formData.PermanentAddress1,
      addressLine2: formData.PermanentAddress2,
      postCode: formData.PermanentAddressZIP,
      doorNo: '',
      id: perAddressData[0]?.PERM?.id ? perAddressData[0]?.PERM?.id : '',
      streetNo: '',
      countryCode: {
        countryCode: permCountryData[0]?.countryCode
          ? permCountryData[0]?.countryCode
          : '',
      },
      stateProvinceCode: showPerStatedropDown
        ? permStateRef?.current?.stateProvinceCode
          ? permStateRef?.current?.stateProvinceCode
          : perAddressData[0]?.PERM?.stateProvinceCode
          ? perAddressData[0]?.PERM?.stateProvinceCode
          : ''
        : null,
      stateProvinceName: !showPerStatedropDown
        ? formData.PermanentAddressState
        : permStateRef?.current?.stateProvinceName
        ? permStateRef.current.stateProvinceName
        : perAddressData[0]?.PERM?.stateProvinceName
        ? perAddressData[0]?.PERM?.stateProvinceName
        : '',
      city: formData.PermanentAddressCity,
      locality: formData.PermanentAddressLocality,
      type: {
        id: 2,
        code: 'PERM',
      },
    };
    const forgAddress = {
      addressLine1: formData.ForeignAddress1,
      addressLine2: formData.ForeignAddress2,
      postCode: formData.ForeignAddressZIP,
      doorNo: '',
      id: forgnAddressData[0]?.FORN?.id ? forgnAddressData[0]?.FORN?.id : '',
      streetNo: '',
      countryCode: {
        countryCode: forgnCountryData[0]?.countryCode
          ? forgnCountryData[0]?.countryCode
          : '',
      },
      stateProvinceCode: showForgnStatedropDown
        ? forgnStateRef?.current?.stateProvinceCode
          ? forgnStateRef?.current?.stateProvinceCode
          : forgnAddressData[0]?.FORN?.stateProvinceCode
          ? forgnAddressData[0]?.FORN?.stateProvinceCode
          : ''
        : null,
      stateProvinceName: showForgnStatedropDown
        ? forgnStateRef?.current?.stateProvinceName
          ? forgnStateRef?.current?.stateProvinceName
          : forgnAddressData[0]?.FORN?.stateProvinceName
          ? forgnAddressData[0]?.FORN?.stateProvinceName
          : ''
        : formData.ForeignAddressState,
      city: formData.ForeignAddressCity,
      locality: formData.ForeignAddressLocality,
      type: {
        id: 232,
        code: 'FORN',
      },
    };
    let type = {code: 'FORN', id: 232};
    let id = forgnAddressData[0]?.FORN?.id ? forgnAddressData[0]?.FORN?.id : '';
    toggleCheckBox === ''
      ? formData.ForeignAddress1 === '' ||
        formData.ForeignAddress2 === '' ||
        formData.ForeignAddressCity === '' ||
        formData.ForeignAddressZIP === '' ||
        forgnCountryData?.[0]?.countryCode === undefined
        ? payload.address.push(currAddress, perrAddress)
        : payload.address.push(currAddress, perrAddress, forgAddress)
      : toggleCheckBox === 'Current'
      ? payload.address.push(currAddress, perrAddress, {
          ...currAddress,
          type,
          id,
        })
      : toggleCheckBox === 'Permanent'
      ? payload.address.push(currAddress, perrAddress, {
          ...perrAddress,
          type,
          id,
        })
      : null;

    const token = await getAuthToken();
    const beneficiaryId = await getBeneficiaryUserID();

    console.log('payload=>>', payload);
    if (
      permCountryData.length >= 1 &&
      birthCountryData.length >= 1 &&
      currentCountryData.length >= 1 &&
      (formData.CurrenttAddressState != '' || stateRef.current != null) &&
      (formData.PermanentAddressState != '' || permStateRef.current != null) &&
      (formData.BirthState != '' || birthStateRef.current != null)
    ) {
      setStatus(true);
      props
        .postPersonalDetails(token, payload)
        .then(async res => {
          const message = res.message;
          console.log('res', res);
          res.status === 200
            ? props
                .getStudentInformation(token, beneficiaryId)
                .then(async res => {
                  setStatus(false);
                  Toast.show(message, Toast.LONG);

                  res.status === 200
                    ? (props.editProfile(), setStatus(false))
                    : null;
                })
                .catch(e => {
                  console.log('e', e);
                  setStatus(false);
                })
            : null;
          res.status !== 200 ? setStatus(false) : setStatus(false);
        })
        .then(error => {
          setStatus(false);
          // Toast.show(error, Toast.LONG);
        })
        .catch(e => {
          console.log('error', e);
          setStatus(false);
        });
    } else {
      setStatus(false);
    }
  };
  const getPassportDetails = async () => {
    const authToken = await getAuthToken();
    const beneficiaryId = await getBeneficiaryUserID();
    setStatus(true);
    props
      .getProfileDoc(authToken, beneficiaryId)
      .then(async res => {
        setPasspoertDetails(res?.data?.Personal ? res?.data?.Personal : []);
        setStatus(false);
      })
      .catch(e => {
        console.log('error', e);
        setStatus(false);
      });
  };
  const selectOneFile = async () => {
    const authToken = await getAuthToken();
    const beneficiaryId = await getBeneficiaryUserID();
    const categoryName = `BENPASSDOC`;
    const fileCategory = 'PASSCOPY';

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      if (res[0].size >= 5000000) {
        Toast.show(
          'The file is too large to upload, please try a file with less than 5MB',
          Toast.LONG,
        );
      } else {
        setStatus(true);
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
              let resp = await fetch(
                `${baseURL}student/v1/document/beneficiary/${beneficiaryId}/category/${categoryName}/entity/${beneficiaryId}/fileCategory/${fileCategory}`,
                {
                  method: 'post',
                  body: formData,
                  headers: {
                    'Content-Type': 'multipart/form-data; ',
                    Authorization: `Bearer ${authToken}`,
                  },
                },
              );
              let responseJson = await resp.json();
              if (responseJson.status === 200) {
                // setStatus(false);
                getPassportDetails();
                Toast.show(responseJson.message, Toast.SHORT);
              } else {
                // setStatus(false);
                Toast.show('Failed to update Document', Toast.SHORT);
              }
            })
          : null;
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  const deleteHandler = async item => {
    const authToken = await getAuthToken();
    const beneficiaryId = await getBeneficiaryUserID();
    const categoryName = 'BENPASSDOC';
    const fileCategory = 'PASSCOPY';
    const fileId = deletePassID;
    setStatus(true);
    props
      .relatedDocDelete(
        authToken,
        beneficiaryId,
        categoryName,
        fileCategory,
        fileId,
      )
      .then(async res => {
        const message = res.message;
        // setStatus(false);
        getPassportDetails();
        setModalVisible(false);
        Toast.show(message, Toast.LONG);
      })
      .catch(e => {
        console.log('error', e);
        setModalVisible(false);

        // setStatus(false)
      });
    setModalVisible(false);
  };

  const UploadSingnature = async () => {
    const authToken = await getAuthToken();
    const beneficiaryId = await getBeneficiaryUserID();
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      let imageType = ['png'];
      if (imageType.includes(res[0].type.split('/').reverse()[0])) {
        if (res[0].size >= 1048576) {
          Toast.show(
            'The file is too large to upload, please try a file with less than 1MB',
            Toast.LONG,
          );
        } else {
          let uri = decodeURI(res[0].uri);
          uri
            ? RNFS.readFile(uri, 'base64')
                .then(async base64data => {
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
                    `${baseURL}student/v1/beneficiary/${beneficiaryId}/profile/signpic`,

                    {
                      method: 'post',
                      body: formData,
                      headers: {
                        'Content-Type': 'multipart/form-data; ',
                        Authorization: `Bearer ${authToken}`,
                      },
                    },
                  );
                  let responseJson = await resp.json();
                  console.log('responseJson', responseJson);
                  const mess = responseJson.message;
                  if (responseJson.status === 200) {
                    setSingnatureDoc(base64data),
                      // props.setSingnatureDoc(base64data),
                      setStatus(false);
                    setTimeout(() => {
                      Toast.show(mess, Toast.SHORT);
                    }, 1000);
                  } else {
                    setStatus(false);
                    setTimeout(() => {
                      Toast.show('Failed to update Document', Toast.SHORT);
                    }, 1);
                  }
                })
                .catch(e => {
                  Toast.show('Please Try With Png File.', Toast.LONG);
                })
            : (Toast.show('Please Try Again Later.', Toast.LONG),
              setStatus(false));
        }
      } else {
        Toast.show(
          'Unaccepted format!. Please upload a "png" format file.',
          Toast.LONG,
        );
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        setStatus(false);
      } else {
        //For Unknown Error
        setStatus(false);
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  useEffect(() => {
    getPassportDetails();
  }, []);
  const PersonalInfoEdit = (
    values,
    errors,
    handleChange,
    handleBlur,
    touched,
    isValid,
    setFieldValue,
  ) => {
    const [open, setOpen] = useState(false);
    const [titleValue, setTitleValue] = useState('');
    const [items, setItems] = useState([
      {label: 'Miss', value: 'Miss'},
      {label: 'Mrs.', value: 'Mrs.'},
      {label: 'Mr.', value: 'Mr.'},
      {label: 'Ms.', value: 'Ms.'},
    ]);
    const [openAlias, setOpenAlias] = useState(false);
    const [aliasValue, setAliasValue] = useState('');

    const [show, setShow] = useState(false);
    const [emptyDate, setEmptyDate] = useState('');
    const [date, setDate] = useState(new Date());
    let dateformat = moment(date).format('MM/DD/YYYY');
    const onChange = (event, selectedDate) => {
      Platform.OS === 'ios' ? null : setShow(false);
      const currentDate = selectedDate;
      setDate(currentDate);
      setFieldValue('dob', moment(selectedDate).format('MM/DD/YYYY'));
      setEmptyDate(currentDate);
    };
    const showDatepicker = () => {
      setShow(!show);
    };
    return (
      <>
        <View style={{marginLeft: scale(-10)}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: scale(5),
              zIndex: 100,
            }}>
            <View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.formInputTitle}>
                  Title<Text style={{color: 'red'}}>*</Text>
                </Text>
              </View>
              <DropDownPicker
                name="title"
                listMode="SCROLLVIEW"
                open={open}
                value={
                  titleValue
                    ? titleValue
                    : studentInfo.title
                    ? studentInfo.title
                    : ''
                }
                items={items}
                setOpen={setOpen}
                setItems={setItems}
                setValue={setTitleValue}
                onChangeValue={handleChange('title')}
                placeholder="Select"
                placeholderStyle={{
                  color: '#4D4F5C',
                }}
                maxHeight={scale(115)}
                style={styles.dropdown}
              />
              {touched.title && errors.title && (
                <Text style={styles.errorMessage}>{errors.title}</Text>
              )}
            </View>
            <View style={{flex: 1, marginLeft: scale(10)}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.formInputTitle}>
                  First Name<Text style={{color: 'red'}}>*</Text>
                </Text>
              </View>
              <CustomInput
                name="firstName"
                placeholder="Enter"
                placeholderTextColor="#4D4F5C"
                value={values.firstName}
                onBlur={handleBlur('firstName')}
                onChangeText={handleChange('firstName')}
                editable={true}
              />
              {touched.firstName && errors.firstName && (
                <Text style={styles.errorMessage}>{errors.firstName}</Text>
              )}
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
              <CustomInput
                name="middleName"
                placeholder="Enter"
                placeholderTextColor="#4D4F5C"
                value={values.middleName}
                onBlur={handleBlur('middleName')}
                onChangeText={handleChange('middleName')}
                onChangeValue={handleChange('middleName')}
                autoCorrect={false}
              />
              {touched.middleName && errors.middleName && (
                <Text style={styles.errorMessage}>{errors.middleName}</Text>
              )}
            </View>
            <View style={{flex: 1, marginLeft: 10}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.formInputTitle}>
                  Last Name<Text style={{color: 'red'}}>*</Text>
                </Text>
              </View>
              <CustomInput
                name="lastName"
                placeholder="Enter"
                placeholderTextColor="#4D4F5C"
                value={values.lastName}
                onBlur={handleBlur('lastName')}
                onChangeText={handleChange('lastName')}
                autoCorrect={false}
              />
              {touched.lastName && errors.lastName && (
                <Text style={styles.errorMessage}>{errors.lastName}</Text>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}>
            <Checkbox.Android
              name="checkbox"
              status={otherNameCheck ? 'checked' : 'unchecked'}
              color="#00A0DA"
              uncheckedColor="grey"
              onPress={() => {
                setOtherNameCheck(!otherNameCheck);
              }}
            />
            <Text
              style={{
                fontSize: scale(14),
                color: '#24262F',
                fontFamily: 'SourceSansPro-Regular',
              }}>
              Do you have any other name ?
            </Text>
          </View>
          {otherNameCheck ? (
            <View
              style={{
                flexDirection: 'row',
                zIndex: 100,
              }}>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.formInputTitle}>Title</Text>
                </View>
                <DropDownPicker
                  name="aliasTitle"
                  listMode="SCROLLVIEW"
                  open={openAlias}
                  value={aliasValue ? aliasValue : ''}
                  items={items}
                  setOpen={setOpenAlias}
                  setItems={setItems}
                  setValue={setAliasValue}
                  onChangeValue={handleChange('aliasTitle')}
                  placeholder="Select"
                  placeholderStyle={{
                    color: '#4D4F5C',
                  }}
                  style={styles.dropdown}
                  maxHeight={scale(115)}
                />
              </View>
              <View style={{flex: 1, marginLeft: scale(10)}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.formInputTitle}>Alias Name</Text>
                </View>
                <CustomInput
                  name="aliasName"
                  placeholder="Enter"
                  placeholderTextColor="#4D4F5C"
                  value={values.aliasName}
                  onBlur={handleBlur('aliasName')}
                  onChangeText={handleChange('aliasName')}
                  editable={true}
                />
              </View>
            </View>
          ) : null}
          <View>
            <View>
              <View>
                <Text style={styles.formInputTitle}>
                  Gender<Text style={{color: 'red'}}>*</Text>
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton.Group
                  onValueChange={handleChange('gender')}
                  value={values.gender}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <RadioButton.Android
                        value="MALE"
                        uncheckedColor="grey"
                        color="#0089CF"
                        label="Male"
                      />
                      <Text style={styles.radioTitle}>Male</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <RadioButton.Android
                        value="FEML"
                        uncheckedColor="grey"
                        color="#0089CF"
                        label="Female"
                      />
                      <Text style={styles.radioTitle}>Female</Text>
                    </View>
                  </View>
                </RadioButton.Group>
                {touched.gender && errors.gender && (
                  <Text style={{...styles.errorMessage, marginLeft: scale(5)}}>
                    {errors.gender}
                  </Text>
                )}
              </View>
            </View>
            <View>
              <Text style={styles.formInputTitle}>
                Date of Birth<Text style={{color: 'red'}}>*</Text>
              </Text>
              <TouchableOpacity
                onPress={() => {
                  showDatepicker();
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <CustomInput
                    name="date"
                    placeholder="Select"
                    placeholderTextColor="#4D4F5C"
                    value={
                      emptyDate === ''
                        ? studentInfo?.dob
                          ? moment(studentInfo?.dob).format('MM/DD/YYYY')
                          : ''
                        : dateformat
                    }
                    editable={false}
                    autoCorrect={false}
                    style={{marginTop: scale(6), flex: 1}}
                  />
                  <AntDesign
                    name="calendar"
                    size={20}
                    style={{
                      position: 'absolute',
                      right: scale(10),
                      color: 'grey',
                    }}
                  />
                </View>
                {touched.dob && errors.dob && (
                  <Text style={styles.errorMessage}>{errors.dob}</Text>
                )}
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  onChange={onChange}
                  maximumDate={new Date()}
                  style={{
                    accentColor: 'red',
                    textColor: 'red',
                  }}
                  themeVariant="dark"
                  textColor="blue"
                />
              )}
            </View>
          </View>
          <View style={{...styles.inputDis, marginBottom: scale(5)}}>
            <View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.formInputTitle}>
                  Phone No.<Text style={{color: 'red'}}>*</Text>
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  height: scale(37),
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 1,
                      height: 40,
                      borderWidth: 1,
                      borderColor: '#CCD5E6',
                      borderRadius: 4,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 5,
                    }}>
                    <PhoneInput
                      name="phoneNumber"
                      ref={phoneInput}
                      initialCountry={
                        personalPhone[0]?.shortCountryCode?.toLowerCase()
                          ? personalPhone[0]?.shortCountryCode?.toLowerCase()
                          : ''
                      }
                      keyboardType={'numeric'}
                      layout="first"
                      withShadow
                      autoFocus
                      countryCode={text => {}}
                      pickerBackgroundColor="#A2D3EA"
                      onChangeValue={value => {}}
                      onChangePhoneNumber={value => setphoneNumber(value)}
                      onSelectCountry={handleChange('countryName')}
                    />
                  </View>
                  <View style={{flex: 8}}>
                    <CustomInput
                      name="phoneNumber"
                      placeholder="Enter"
                      placeholderTextColor="#4D4F5C"
                      value={values.phoneNumber}
                      onBlur={handleBlur('phoneNumber')}
                      onChangeText={handleChange('phoneNumber')}
                      autoCorrect={false}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {touched.countryName && errors.countryName && (
                    <Text style={styles.errorMessage}>
                      {errors.countryName}
                    </Text>
                  )}
                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text
                      style={{
                        ...styles.errorMessage,
                        marginBottom: scale(5),
                      }}>
                      {errors.phoneNumber}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
          <View style={styles.inputDis}>
            <View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.formInputTitle}>
                  Email<Text style={{color: 'red'}}>*</Text>
                </Text>
              </View>
              <CustomInput
                name="email"
                placeholder="Enter"
                placeholderTextColor="#4D4F5C"
                value={values.email}
                onBlur={handleBlur('email')}
                onChangeText={handleChange('email')}
                autoCorrect={false}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorMessage}>{errors.email}</Text>
              )}
            </View>
          </View>
          <View>
            <Text style={styles.formInputTitle}>Social Security number</Text>
            <CustomInput
              name="SocialSecurityNumber"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={values.SocialSecurityNumber}
              onBlur={handleBlur('SocialSecurityNumber')}
              onChangeText={handleChange('SocialSecurityNumber')}
              autoCorrect={false}
            />
            {touched.SocialSecurityNumber && errors.SocialSecurityNumber && (
              <Text style={styles.errorMessage}>
                {errors.SocialSecurityNumber}
              </Text>
            )}
          </View>
          <View>
            <View>
              <Text style={styles.formInputTitle}>
                Are you a Lawful Permanent Residence?
                <Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton.Group
                onValueChange={handleChange('LPRstatus')}
                value={
                  values.LPRstatus
                    ? values.LPRstatus
                    : studentInfo.isLpr !== null
                    ? studentInfo.isLpr === 0
                      ? 'No'
                      : studentInfo.isLpr === 1
                      ? 'Yes'
                      : ''
                    : values.LPRstatus
                }>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <RadioButton.Android
                      value="Yes"
                      color="#0089CF"
                      uncheckedColor="grey"
                      label="Yes"
                    />
                    <Text style={styles.radioTitle}>Yes</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <RadioButton.Android
                      value="No"
                      color="#0089CF"
                      uncheckedColor="grey"
                      label="No"
                    />
                    <Text style={styles.radioTitle}>No</Text>
                  </View>
                </View>
              </RadioButton.Group>
              {touched.LPRstatus && errors.LPRstatus && (
                <Text style={{...styles.errorMessage, marginLeft: scale(5)}}>
                  {errors.LPRstatus}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.inputDis}>
            <View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.formInputTitle}>
                  GRE Score<Text style={{color: 'red'}}>*</Text>
                </Text>
              </View>
              <CustomInput
                name="GREscore"
                placeholder="Enter"
                placeholderTextColor="#4D4F5C"
                value={values.GREscore}
                onBlur={handleBlur('GREscore')}
                onChangeText={handleChange('GREscore')}
                autoCorrect={false}
                keyboardType="numeric"
              />
              {touched.GREscore && errors.GREscore && (
                <Text style={styles.errorMessage}>{errors.GREscore}</Text>
              )}
            </View>
            <View>
              <Text style={styles.formInputTitle}>
                TOEFL Score<Text style={{color: 'red'}}>*</Text>
              </Text>
              <CustomInput
                name="TOEFLscore"
                placeholder="Enter"
                placeholderTextColor="#4D4F5C"
                value={values.TOEFLscore}
                onBlur={handleBlur('TOEFLscore')}
                onChangeText={handleChange('TOEFLscore')}
                autoCorrect={false}
                keyboardType="numeric"
              />
              {touched.TOEFLscore && errors.TOEFLscore && (
                <Text style={styles.errorMessage}>{errors.TOEFLscore}</Text>
              )}
            </View>
          </View>

          <View style={styles.barLine} />
        </View>
      </>
    );
  };
  const MaritalStatusEdit = (
    values,
    errors,
    handleChange,
    handleBlur,
    touched,
    setFieldValue,
  ) => {
    const [dateOfMarriageShow, setDateOfMarriage] = useState(false);
    const [dateOnMarg, setDateOnMarg] = useState(new Date());
    const [EmptyDateOnMarg, setEmptyDateOnMarg] = useState('');
    let dateOfMarriageFormat = moment(dateOnMarg).format('MM/DD/YYYY');
    const onChangeDateOfMarriage = (event, selectedDate) => {
      Platform.OS === 'ios' ? null : setDateOfMarriage(false);
      const currentDate = selectedDate;
      setFieldValue('mrgDate', moment(selectedDate).format('MM/DD/YYYY'));
      setDateOnMarg(currentDate);
      setEmptyDateOnMarg(currentDate);
    };
    const showDateOfMarriage = () => {
      setDateOfMarriage(true);
    };

    const [getCountryList, setGetCounrtyList] = useState(
      props.CountryList.data,
    );
    const [openMrgCountry, setOpenMrgCountry] = useState(false);
    const [mrgCountry, setMrgCountry] = useState(null);
    const countryMargData = [];
    getCountryList
      ? getCountryList.map(item => {
          countryMargData.push({
            label: item.countryName,
            value: item.countryCode,
          });
        })
      : null;

    const [mrgStateList, setMrgStateList] = useState([]);
    const getMrgStateData = value => {
      props
        .getstate(value)
        .then(res => {
          setMrgStateList(res.data);
          res.data.length > 0
            ? setshowMrgStateDropdown(true)
            : setshowMrgStateDropdown(false);
        })
        .catch(error => {
          console.log('error', error);
        });
    };
    useEffect(() => {
      studentInfo?.countryOfMarriage?.countryCode
        ? getMrgStateData(
            studentInfo?.countryOfMarriage?.countryCode
              ? studentInfo?.countryOfMarriage?.countryCode
              : '',
          )
        : null;
    }, []);
    const mrgStateData = [];
    mrgStateList
      ? mrgStateList.map(item => {
          mrgStateData.push({
            label: item.stateProvinceName,
            value: item.stateProvinceCode,
            stateProvinceName: item.stateProvinceName,
            stateProvinceCode: item.stateProvinceCode,
          });
        })
      : null;
    const [openMrgstate, setOpenMrgState] = useState(false);
    const [mrgState, setMrgState] = useState(null);
    return (
      <>
        <View>
          <View>
            <Text style={styles.formInputTitle}>
              What is your current marital status ?
              <Text style={{color: 'red'}}>*</Text>
            </Text>
          </View>
          <View style={{flex: 1}}>
            <RadioButton.Group
              onValueChange={handleChange('MaritalStatus')}
              value={values.MaritalStatus}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <RadioButton.Android
                    value="Single, never married"
                    color="#0089CF"
                    uncheckedColor="grey"
                    label="Single, never married"
                  />
                  <Text
                    style={{
                      ...styles.radioTitle,
                    }}>
                    Single,never married
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <RadioButton.Android
                    value="Married"
                    color="#0089CF"
                    uncheckedColor="grey"
                    label="Married"
                  />
                  <Text style={styles.radioTitle}>Married</Text>
                </View>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <RadioButton.Android
                    value="Divorced"
                    color="#0089CF"
                    uncheckedColor="grey"
                    label="Divorced"
                  />
                  <Text style={styles.radioTitle}>Divorced</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <RadioButton.Android
                    value="Widowed"
                    color="#0089CF"
                    uncheckedColor="grey"
                    label="Widowed"
                  />
                  <Text style={styles.radioTitle}>Widowed</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <RadioButton.Android
                    value="Legally Separated"
                    color="#0089CF"
                    uncheckedColor="grey"
                    label="Legally Separated"
                  />
                  <Text style={styles.radioTitle}>Legally Separated</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <RadioButton.Android
                    value="Marriage Annulled"
                    color="#0089CF"
                    uncheckedColor="grey"
                    label="Marriage Annulled"
                  />
                  <Text style={styles.radioTitle}>Marraige Annualled</Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>
          {touched.MaritalStatus && errors.MaritalStatus && (
            <Text style={{...styles.errorMessage, marginLeft: scale(5)}}>
              {errors.MaritalStatus}
            </Text>
          )}
        </View>
        {values.MaritalStatus !== 'Single, never married' ? (
          <>
            <View>
              <Text style={styles.formInputTitle}>Date of Marriage</Text>
              <TouchableOpacity
                onPress={() => {
                  showDateOfMarriage();
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <CustomInput
                    name="date"
                    placeholder="Select"
                    placeholderTextColor="#4D4F5C"
                    value={
                      EmptyDateOnMarg === ''
                        ? studentInfo?.marriageDate
                          ? moment(studentInfo?.marriageDate).format(
                              'MM/DD/YYYY',
                            )
                          : ''
                        : dateOfMarriageFormat
                    }
                    editable={false}
                    autoCorrect={false}
                    style={{marginTop: scale(6), flex: 1}}
                  />
                  <AntDesign
                    name="calendar"
                    size={20}
                    style={{
                      position: 'absolute',
                      right: scale(10),
                      color: 'grey',
                    }}
                  />
                </View>
                {touched.mrgDate && errors.mrgDate && (
                  <Text style={styles.errorMessage}>{errors.mrgDate}</Text>
                )}
              </TouchableOpacity>
              {dateOfMarriageShow && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateOnMarg}
                  mode="date"
                  onChange={onChangeDateOfMarriage}
                  maximumDate={new Date()}
                  style={{
                    accentColor: 'red',
                    textColor: 'red',
                  }}
                  themeVariant="dark"
                  textColor="blue"
                />
              )}
            </View>
            <View style={{marginTop: scale(10)}}>
              <Text style={styles.formInputData}>Place of Marriage</Text>
            </View>
            <View style={{flex: 1}}>
              <View>
                <Text style={styles.formInputTitle}>
                  Country of Marriage<Text style={{color: 'red'}}>*</Text>
                </Text>
              </View>
              <DropDownPicker
                open={openMrgCountry}
                value={
                  mrgCountry
                    ? mrgCountry
                    : studentInfo?.countryOfMarriage?.countryCode
                    ? studentInfo?.countryOfMarriage?.countryCode
                    : mrgCountry
                }
                items={countryMargData}
                setOpen={setOpenMrgCountry}
                setValue={setMrgCountry}
                placeholder="Select"
                placeholderStyle={{
                  color: '#4D4F5C',
                }}
                style={styles.flexDropdown}
                onSelectItem={value => {
                  getMrgStateData(value.value);
                  setMrgState('');
                  mrgCountryValueHandler(value);
                }}
                listMode="MODAL"
                name="MarriageCountry"
              />
              {touched.MarriageCountry && errors.MarriageCountry && (
                <Text style={styles.errorMessage}>
                  {errors.MarriageCountry}
                </Text>
              )}
            </View>
            <View style={{flex: 1}}>
              <View>
                <Text style={styles.formInputTitle}>
                  State of Marriage<Text style={{color: 'red'}}>*</Text>
                </Text>
              </View>
              {showmrgDropDown ? (
                <DropDownPicker
                  open={openMrgstate}
                  value={
                    mrgState
                      ? mrgState
                      : studentInfo.marriageStateProvinceCode
                      ? studentInfo.marriageStateProvinceCode
                      : ''
                  }
                  items={mrgStateData}
                  setOpen={setOpenMrgState}
                  setValue={setMrgState}
                  placeholder="Select"
                  placeholderStyle={{
                    color: '#4D4F5C',
                  }}
                  style={styles.flexDropdown}
                  listMode="MODAL"
                  onSelectItem={value => {
                    mrgStateValueHandler(value);
                  }}
                />
              ) : (
                <CustomInput
                  name="MarriageState"
                  placeholder="Enter"
                  placeholderTextColor="#4D4F5C"
                  value={values.MarriageState}
                  onBlur={handleBlur('MarriageState')}
                  onChangeText={handleChange('MarriageState')}
                />
              )}
              {touched.MarriageState && errors.MarriageState && (
                <Text style={styles.errorMessage}>{errors.MarriageState}</Text>
              )}
            </View>
            <View style={{flex: 1}}>
              <View>
                <Text style={styles.formInputTitle}>
                  City of Marriage<Text style={{color: 'red'}}>*</Text>
                </Text>
              </View>
              <CustomInput
                name="MarriageCity"
                placeholder="Enter"
                placeholderTextColor="#4D4F5C"
                value={values.MarriageCity}
                onBlur={handleBlur('MarriageCity')}
                onChangeText={handleChange('MarriageCity')}
              />
              {touched.MarriageCity && errors.MarriageCity && (
                <Text style={styles.errorMessage}>{errors.MarriageCity}</Text>
              )}
            </View>
          </>
        ) : null}
      </>
    );
  };
  const CurrentAddressEdit = (
    values,
    errors,
    handleChange,
    handleBlur,
    touched,
  ) => {
    const [getCountryList, setGetCounrtyList] = useState(
      props.CountryList.data,
    );
    const [openCountry, setOpenCountry] = useState(false);
    const [valueCountry, setValueCountry] = useState(null);
    const countryData = [];
    getCountryList
      ? getCountryList.map(item => {
          countryData.push({
            label: item.countryName,
            value: item.countryCode,
          });
        })
      : null;
    const [openstate, setOpenState] = useState(false);
    const [valueState, setValueState] = useState(null);
    useEffect(() => {
      currAddressData[0]?.CURR?.stateProvinceName
        ? getStateData(
            currAddressData[0]?.CURR?.countryCode?.countryCode
              ? currAddressData[0]?.CURR?.countryCode?.countryCode
              : '',
          )
        : null;
    }, []);
    return (
      <>
        <View style={{marginLeft: scale(-10)}}>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>
                Address1<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <CustomInput
              multiline
              name="CurrentAddress1"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={values.CurrentAddress1}
              onBlur={handleBlur('CurrentAddress1')}
              onChangeText={handleChange('CurrentAddress1')}
              editable={true}
              style={{height: 60, marginTop: scale(6)}}
            />
            {touched.CurrentAddress1 && errors.CurrentAddress1 && (
              <Text style={styles.errorMessage}>{errors.CurrentAddress1}</Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>Address2</Text>
            </View>
            <CustomInput
              multiline
              name="CurrentAddress2"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={values.CurrentAddress2}
              onBlur={handleBlur('CurrentAddress2')}
              onChangeText={handleChange('CurrentAddress2')}
              editable={true}
              style={{height: 60, marginTop: scale(6)}}
            />
            {touched.CurrentAddress2 && errors.CurrentAddress2 && (
              <Text style={styles.errorMessage}>{errors.CurrentAddress2}</Text>
            )}
          </View>
          <View style={{flex: 1, zIndex: 100}}>
            <View>
              <Text style={styles.formInputTitle}>
                Country<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <DropDownPicker
              open={openCountry}
              value={
                valueCountry
                  ? valueCountry
                  : currAddressData[0]?.CURR?.countryCode?.countryCode
                  ? currAddressData[0]?.CURR?.countryCode?.countryCode
                  : valueCountry
              }
              items={countryData}
              setOpen={setOpenCountry}
              setValue={setValueCountry}
              placeholder="Select"
              placeholderStyle={{
                color: '#4D4F5C',
              }}
              style={styles.flexDropdown}
              textStyle={{
                color: '#3F3356',
              }}
              onSelectItem={value => {
                getStateData(value.value);
                setValueState('');
                changeRef(value);
                setErrorCountry('');
              }}
              listMode="MODAL"
              name="CurrenttAddressCountry"
            />
            {errorcountry !== '' && (
              <Text style={styles.errorMessage}>{errorcountry}</Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.formInputTitle}>
                State<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            {showdropDown ? (
              <DropDownPicker
                open={openstate}
                value={
                  valueState
                    ? valueState
                    : currAddressData[0]?.CURR?.stateProvinceCode
                    ? currAddressData[0]?.CURR?.stateProvinceCode
                    : valueState
                }
                items={stateData}
                setOpen={setOpenState}
                setValue={setValueState}
                placeholder="Select"
                placeholderStyle={{
                  color: '#4D4F5C',
                }}
                style={styles.flexDropdown}
                textStyle={{
                  color: '#3F3356',
                }}
                listMode="MODAL"
                onSelectItem={value => {
                  changeStateRef(value);
                  setErrorCurrentCountry('');
                }}
              />
            ) : (
              <CustomInput
                name="CurrenttAddressState"
                placeholder="Enter"
                placeholderTextColor="#4D4F5C"
                value={values.CurrenttAddressState}
                onBlur={handleBlur('CurrenttAddressState')}
                onChangeText={handleChange('CurrenttAddressState')}
              />
            )}
            {errorcurrentState !== '' && (
              <Text style={styles.errorMessage}>{errorcurrentState}</Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>
                City<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <CustomInput
              name="CurrentCity"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={values.CurrentCity}
              onBlur={handleBlur('CurrentCity')}
              onChangeText={handleChange('CurrentCity')}
            />
            {touched.CurrentCity && errors.CurrentCity && (
              <Text style={styles.errorMessage}>{errors.CurrentCity}</Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>
                Locality<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <CustomInput
              name="CurrentLocality"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={values.CurrentLocality}
              onBlur={handleBlur('CurrentLocality')}
              onChangeText={handleChange('CurrentLocality')}
            />
            {touched.CurrentLocality && errors.CurrentLocality && (
              <Text style={styles.errorMessage}>{errors.CurrentLocality}</Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>
                ZIP / Postal Code<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <CustomInput
              name="CurrentZIP"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={values.CurrentZIP}
              onBlur={handleBlur('CurrentZIP')}
              onChangeText={handleChange('CurrentZIP')}
            />
            {touched.CurrentZIP && errors.CurrentZIP && (
              <Text style={styles.errorMessage}>{errors.CurrentZIP}</Text>
            )}
          </View>
        </View>
      </>
    );
  };
  const PermanentAddressEdit = (
    values,
    errors,
    handleChange,
    handleBlur,
    touched,
  ) => {
    const [getCountryList, setGetCounrtyList] = useState(
      props.CountryList.data,
    );
    const [openPermCountry, setOpenPermCountry] = useState(false);
    const [valuePermCountry, setValuePermCountry] = useState(null);
    const countryPermData = [];
    getCountryList
      ? getCountryList.map(item => {
          countryPermData.push({
            label: item.countryName,
            value: item.countryCode,
          });
        })
      : null;
    const [openPermstate, setOpenPermState] = useState(false);
    const [PermState, setPermState] = useState(null);
    useEffect(() => {
      perAddressData[0]?.PERM?.stateProvinceName
        ? getPermStateData(
            perAddressData[0]?.PERM?.countryCode?.countryCode
              ? perAddressData[0]?.PERM?.countryCode?.countryCode
              : '',
          )
        : null;
    }, []);
    return (
      <>
        <View style={{marginLeft: scale(-10)}}>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>
                Address1<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <CustomInput
              multiline
              name="PermanentAddress1"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={values.PermanentAddress1}
              onBlur={handleBlur('PermanentAddress1')}
              onChangeText={handleChange('PermanentAddress1')}
              editable={true}
              style={{height: 60, marginTop: scale(6)}}
            />
            {touched.PermanentAddress1 && errors.PermanentAddress1 && (
              <Text style={styles.errorMessage}>
                {errors.PermanentAddress1}
              </Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>Address2</Text>
            </View>
            <CustomInput
              multiline
              name="PermanentAddress2"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={values.PermanentAddress2}
              onBlur={handleBlur('PermanentAddress2')}
              onChangeText={handleChange('PermanentAddress2')}
              editable={true}
              style={{height: 60, marginTop: scale(6)}}
            />
            {touched.PermanentAddress2 && errors.PermanentAddress2 && (
              <Text style={styles.errorMessage}>
                {errors.PermanentAddress2}
              </Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.formInputTitle}>
                Country<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <DropDownPicker
              open={openPermCountry}
              value={
                valuePermCountry
                  ? valuePermCountry
                  : perAddressData[0]?.PERM?.countryCode?.countryCode
                  ? perAddressData[0]?.PERM?.countryCode?.countryCode
                  : valuePermCountry
              }
              items={countryPermData}
              setOpen={setOpenPermCountry}
              setValue={setValuePermCountry}
              placeholder="Select"
              placeholderStyle={{
                color: '#4D4F5C',
              }}
              style={styles.flexDropdown}
              onSelectItem={value => {
                getPermStateData(value.value);
                setPermState('');
                perCountryValueHandler(value);
                setErrorPermCountry('');
              }}
              listMode="MODAL"
              name="PermanentAddressCountry"
            />
            {errorPermCountry !== '' && (
              <Text style={styles.errorMessage}>{errorPermCountry}</Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.formInputTitle}>
                State<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            {showPerStatedropDown ? (
              <DropDownPicker
                open={openPermstate}
                value={
                  PermState
                    ? PermState
                    : perAddressData[0]?.PERM?.stateProvinceCode
                    ? perAddressData[0]?.PERM?.stateProvinceCode
                    : PermState
                }
                items={PermStateData}
                setOpen={setOpenPermState}
                setValue={setPermState}
                placeholder="Select"
                placeholderStyle={{
                  color: '#4D4F5C',
                }}
                style={styles.flexDropdown}
                listMode="MODAL"
                onSelectItem={value => {
                  perStateValueHandler(value);
                  setErrorpermState('');
                }}
              />
            ) : (
              <CustomInput
                name="PermanentAddressState"
                placeholder="Enter"
                placeholderTextColor="#4D4F5C"
                value={values.PermanentAddressState}
                onBlur={handleBlur('PermanentAddressState')}
                onChangeText={handleChange('PermanentAddressState')}
              />
            )}
            {errorpermState !== '' && (
              <Text style={styles.errorMessage}>{errorpermState}</Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>
                City<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <CustomInput
              name="PermanentAddressCity"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={values.PermanentAddressCity}
              onBlur={handleBlur('PermanentAddressCity')}
              onChangeText={handleChange('PermanentAddressCity')}
            />
            {touched.PermanentAddressCity && errors.PermanentAddressCity && (
              <Text style={styles.errorMessage}>
                {errors.PermanentAddressCity}
              </Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>
                Locality<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <CustomInput
              name="PermanentAddressLocality"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={values.PermanentAddressLocality}
              onBlur={handleBlur('PermanentAddressLocality')}
              onChangeText={handleChange('PermanentAddressLocality')}
            />
            {touched.PermanentAddressLocality &&
              errors.PermanentAddressLocality && (
                <Text style={styles.errorMessage}>
                  {errors.PermanentAddressLocality}
                </Text>
              )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>
                ZIP / Postal Code<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <CustomInput
              name="PermanentAddressZIP"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={values.PermanentAddressZIP}
              onBlur={handleBlur('PermanentAddressZIP')}
              onChangeText={handleChange('PermanentAddressZIP')}
            />
            {touched.PermanentAddressZIP && errors.PermanentAddressZIP && (
              <Text style={styles.errorMessage}>
                {errors.PermanentAddressZIP}
              </Text>
            )}
          </View>
        </View>
      </>
    );
  };
  const ForeignAddressEdit = (
    values,
    errors,
    handleChange,
    handleBlur,
    touched,
  ) => {
    const [getCountryList, setGetCounrtyList] = useState(
      props.CountryList.data,
    );
    const [openForgnCountry, setOpenForgnCountry] = useState(false);
    const [ForgnCountry, setForgnCountry] = useState(null);
    const forgnCountryData = [];
    getCountryList
      ? getCountryList.map(item => {
          forgnCountryData.push({
            label: item.countryName,
            value: item.countryCode,
          });
        })
      : null;

    const [forgnStateList, setForgnStateList] = useState([]);
    const getForgnStateData = value => {
      props
        .getstate(value)
        .then(res => {
          setForgnStateList(res.data);
          res.data.length > 0
            ? setshowForgnStateDropdown(true)
            : setshowForgnStateDropdown(false);
        })
        .catch(error => {
          console.log('error', error);
        });
    };
    const forgnStateData = [];
    forgnStateList
      ? forgnStateList.map(item => {
          forgnStateData.push({
            label: item.stateProvinceName,
            value: item.stateProvinceCode,
            stateProvinceName: item.stateProvinceName,
            stateProvinceCode: item.stateProvinceCode,
          });
        })
      : null;
    const [openForgnstate, setOpenForgnState] = useState(false);
    const [forgnStateValue, setForgnStateValue] = useState(null);
    useEffect(() => {
      perAddressData[0]?.PERM?.stateProvinceName
        ? getForgnStateData(
            forgnAddressData[0]?.FORN?.countryCode?.countryCode
              ? forgnAddressData[0]?.FORN?.countryCode?.countryCode
              : '',
          )
        : null;
    }, []);
    return (
      <>
        <View style={{marginLeft: scale(-10)}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <RadioButton.Android
              name="checkbox"
              status={toggleCheckBox === 'Current' ? 'checked' : 'unchecked'}
              color="#00A0DA"
              uncheckedColor="grey"
              onPress={() => {
                setToggleCheckBox('Current');
              }}
            />
            <Text
              style={{
                fontSize: scale(14),
                color: '#24262F',
                fontFamily: 'SourceSansPro-Regular',
              }}>
              Use my current address
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <RadioButton.Android
              name="checkbox"
              status={toggleCheckBox === 'Permanent' ? 'checked' : 'unchecked'}
              color="#00A0DA"
              uncheckedColor="grey"
              onPress={() => {
                setToggleCheckBox('Permanent');
              }}
            />
            <Text
              style={{
                fontSize: scale(14),
                color: '#24262F',
                fontFamily: 'SourceSansPro-Regular',
              }}>
              Use my Permanent address
            </Text>
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>Address1</Text>
            </View>
            <TextInput
              multiline
              name="ForeignAddress1"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={
                toggleCheckBox === ''
                  ? values.ForeignAddress1
                  : toggleCheckBox === 'Current'
                  ? values.CurrentAddress1
                    ? values.CurrentAddress1
                    : ''
                  : toggleCheckBox === 'Permanent'
                  ? values.PermanentAddress1
                    ? values.PermanentAddress1
                    : ''
                  : ''
              }
              onChange={() => setToggleCheckBox('')}
              onBlur={handleBlur('ForeignAddress1')}
              onChangeText={handleChange('ForeignAddress1')}
              editable={true}
              style={styles.multilineTextInput}
            />
            {touched.ForeignAddress1 && errors.ForeignAddress1 && (
              <Text style={styles.errorMessage}>{errors.ForeignAddress1}</Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>Address2</Text>
            </View>
            <TextInput
              multiline
              name="ForeignAddress2"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={
                toggleCheckBox === ''
                  ? values.ForeignAddress2
                  : toggleCheckBox === 'Current'
                  ? values.CurrentAddress2
                    ? values.CurrentAddress2
                    : values.PermanentAddress2
                  : toggleCheckBox === 'Permanent'
                  ? values.PermanentAddress2
                    ? values.PermanentAddress2
                    : ''
                  : values.ForeignAddress2
              }
              onChange={() => setToggleCheckBox('')}
              onBlur={handleBlur('ForeignAddress2')}
              onChangeText={handleChange('ForeignAddress2')}
              editable={true}
              style={styles.multilineTextInput}
            />
            {touched.ForeignAddress2 && errors.ForeignAddress2 && (
              <Text style={styles.errorMessage}>{errors.ForeignAddress2}</Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.formInputTitle}>Country</Text>
            </View>
            <DropDownPicker
              open={openForgnCountry}
              value={
                toggleCheckBox === ''
                  ? ForgnCountry
                    ? ForgnCountry
                    : forgnAddressData[0]?.FORN?.countryCode?.countryCode
                  : toggleCheckBox === 'Current'
                  ? ref?.current?.value
                    ? ref?.current?.value
                    : currAddressData[0]?.CURR?.countryCode?.countryCode
                    ? currAddressData[0]?.CURR?.countryCode?.countryCode
                    : ''
                  : toggleCheckBox === 'Permanent'
                  ? perCountry?.current?.value
                    ? perCountry?.current?.value
                    : perAddressData[0]?.PERM?.countryCode?.countryCode
                    ? perAddressData[0]?.PERM?.countryCode?.countryCode
                    : ''
                  : ''
              }
              items={forgnCountryData}
              setOpen={setOpenForgnCountry}
              setValue={setForgnCountry}
              placeholder="Select"
              placeholderStyle={{
                color: '#4D4F5C',
              }}
              // textColor="#24262F"
              style={styles.flexDropdown}
              onSelectItem={value => {
                toggleCheckBox !== '' ? setToggleCheckBox('') : null;
                getForgnStateData(value.value);
                setForgnStateValue('');
                forgnCountryValueHandler(value);
              }}
              listMode="MODAL"
              name="ForeignAddressCountry"
            />
            {touched.ForeignAddressCountry && errors.ForeignAddressCountry && (
              <Text style={styles.errorMessage}>
                {errors.ForeignAddressCountry}
              </Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.formInputTitle}>State</Text>
            </View>
            {(
              toggleCheckBox === ''
                ? showForgnStatedropDown
                : toggleCheckBox === 'Current'
                ? showdropDown
                : toggleCheckBox === 'Permanent'
                ? showPerStatedropDown
                : showForgnStatedropDown
            ) ? (
              <DropDownPicker
                open={openForgnstate}
                value={
                  toggleCheckBox === ''
                    ? forgnAddressData[0]?.FORN?.stateProvinceCode
                      ? forgnAddressData[0]?.FORN?.stateProvinceCode
                      : forgnStateValue
                    : toggleCheckBox === 'Current'
                    ? stateRef?.current?.value
                      ? stateRef.current.value
                      : currAddressData[0]?.CURR?.stateProvinceCode
                      ? currAddressData[0]?.CURR?.stateProvinceCode
                      : ''
                    : toggleCheckBox === 'Permanent'
                    ? permStateRef?.current?.value
                      ? permStateRef.current.value
                      : perAddressData[0]?.PERM?.stateProvinceCode
                      ? perAddressData[0]?.PERM?.stateProvinceCode
                      : ''
                    : ''
                }
                items={
                  toggleCheckBox === ''
                    ? forgnStateData
                    : toggleCheckBox === 'Current'
                    ? stateData
                    : toggleCheckBox === 'Permanent'
                    ? PermStateData
                    : ''
                }
                setOpen={setOpenForgnState}
                setValue={setForgnStateValue}
                placeholder="Select"
                placeholderStyle={{
                  color: '#4D4F5C',
                }}
                style={styles.flexDropdown}
                // textColor="#24262F"
                listMode="MODAL"
                onSelectItem={value => {
                  toggleCheckBox !== '' ? setToggleCheckBox('') : null;
                  forgnStateValueHandler(value);
                }}
              />
            ) : (
              <CustomInput
                name="ForeignAddressState"
                placeholder="Enter"
                placeholderTextColor="#4D4F5C"
                value={
                  toggleCheckBox === ''
                    ? values.ForeignAddressState
                    : toggleCheckBox === 'Current'
                    ? values.CurrenttAddressState
                    : toggleCheckBox === 'Permanent'
                    ? values.PermanentAddressState
                    : ''
                }
                onChange={() => setToggleCheckBox('')}
                onBlur={handleBlur('ForeignAddressState')}
                onChangeText={handleChange('ForeignAddressState')}
                style={styles.singleLineTextInput}
              />
            )}
            {touched.ForeignAddressState && errors.ForeignAddressState && (
              <Text style={styles.errorMessage}>
                {errors.ForeignAddressState}
              </Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>City</Text>
            </View>
            <CustomInput
              name="ForeignAddressCity"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={
                toggleCheckBox === ''
                  ? values.ForeignAddressCity
                  : toggleCheckBox === 'Current'
                  ? values.CurrentCity
                  : toggleCheckBox === 'Permanent'
                  ? values.PermanentAddressCity
                  : ''
              }
              onChange={() => setToggleCheckBox('')}
              style={styles.singleLineTextInput}
              onBlur={handleBlur('ForeignAddressCity')}
              onChangeText={handleChange('ForeignAddressCity')}
            />
            {touched.ForeignAddressCity && errors.ForeignAddressCity && (
              <Text style={styles.errorMessage}>
                {errors.ForeignAddressCity}
              </Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>Locality</Text>
            </View>
            <CustomInput
              name="ForeignAddressLocality"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={
                toggleCheckBox === ''
                  ? values.ForeignAddressLocality
                  : toggleCheckBox === 'Current'
                  ? values.CurrentLocality
                  : toggleCheckBox === 'Permanent'
                  ? values.PermanentAddressLocality
                  : ''
              }
              onChange={() => setToggleCheckBox('')}
              style={styles.singleLineTextInput}
              onBlur={handleBlur('ForeignAddressLocality')}
              onChangeText={handleChange('ForeignAddressLocality')}
            />
            {touched.ForeignAddressLocality &&
              errors.ForeignAddressLocality && (
                <Text style={styles.errorMessage}>
                  {errors.ForeignAddressLocality}
                </Text>
              )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>ZIP / Postal Code</Text>
            </View>
            <CustomInput
              name="ForeignAddressZIP"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={
                toggleCheckBox === ''
                  ? values.ForeignAddressZIP
                  : toggleCheckBox === 'Current'
                  ? values.CurrentZIP
                  : toggleCheckBox === 'Permanent'
                  ? values.PermanentAddressZIP
                  : ''
              }
              onChange={() => setToggleCheckBox('')}
              style={styles.singleLineTextInput}
              onBlur={handleBlur('ForeignAddressZIP')}
              onChangeText={handleChange('ForeignAddressZIP')}
            />
            {touched.ForeignAddressZIP && errors.ForeignAddressZIP && (
              <Text style={styles.errorMessage}>
                {errors.ForeignAddressZIP}
              </Text>
            )}
          </View>
        </View>
      </>
    );
  };
  const PlaceOfBirthEdit = (
    values,
    errors,
    handleChange,
    handleBlur,
    touched,
    setFieldValue,
    isValid,
  ) => {
    const [dobCertfSwitch, setDOBCertfSwitch] = useState(
      studentInfo?.hasCtznCrtfct === 1
        ? // ||
          //   studentInfo?.ctznshipCountryCode?.countryCode !== "USA" ||
          //   valueCitizenCountry !== "US"
          true
        : false,
    );
    const [issuranceDateShow, setIssuranceDateShow] = useState(false);
    const [issuranceDate, setIssuranceDate] = useState(new Date());
    const [emptyIssuranceDate, setEmptyIssuranceDate] = useState('');
    let issuedDateFormat = moment(issuranceDate).format('MM/DD/YYYY');
    const onChangeIssued = (event, selectedDate) => {
      Platform.OS === 'ios' ? null : setIssuranceDateShow(false);
      const currentDate = selectedDate;
      setIssuranceDate(currentDate);
      setFieldValue(
        'DateOfIssurance',
        moment(selectedDate).format('MM/DD/YYYY'),
      );
      setEmptyIssuranceDate('hello');
    };

    const showIssuranceDatepicker = () => {
      setIssuranceDateShow(true);
    };

    const [getCountryList, setGetCounrtyList] = useState(
      props.CountryList.data,
    );
    const [openBirthCountry, setOpenBirthCountry] = useState(false);
    const [BirthCountry, setBirthCountry] = useState(null);
    const birthCountryData = [];
    getCountryList
      ? getCountryList.map(item => {
          birthCountryData.push({
            label: item.countryName,
            value: item.countryCode,
          });
        })
      : null;

    const [openCitizenCountry, setOpenCitizenCountry] = useState(false);
    const [valueCitizenCountry, setValueCitizenCountry] = useState(
      studentInfo?.ctznshipCountryCode?.countryCode === 'USA' ? 'US' : null,
    );
    const countryCitizenData = [];
    const [countryCitizenDataList, setCountryCitizenDataList] =
      useState(countryCitizenData);
    getCountryList
      ? getCountryList.map(item => {
          countryCitizenData.push({
            label: item.countryName,
            value: item.shortCountryCode,
          });
        })
      : null;

    const [birthStateList, setBirthStateList] = useState([]);
    const getBirthStateData = value => {
      props
        .getstate(value)
        .then(res => {
          setBirthStateList(res.data);
          res.data.length > 0
            ? setshowBirthDropdown(true)
            : setshowBirthDropdown(false);
        })
        .catch(error => {
          console.log('error', error);
        });
    };
    const birthStateData = [];
    birthStateList
      ? birthStateList.map(item => {
          birthStateData.push({
            label: item.stateProvinceName,
            value: item.stateProvinceCode,
            stateProvinceName: item.stateProvinceName,
            stateProvinceCode: item.stateProvinceCode,
          });
        })
      : null;
    const [openBirthstate, setOpenBirthState] = useState(false);
    const [birthStateValue, setBirthStateValue] = useState(null);
    useEffect(() => {
      studentInfo?.countryCode?.countryCode
        ? getBirthStateData(
            studentInfo?.countryCode?.countryCode
              ? studentInfo?.countryCode?.countryCode
              : '',
          )
        : null;
    }, []);
    return (
      <>
        <View style={{marginLeft: scale(-10)}}>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.formInputTitle}>
                Country<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <DropDownPicker
              open={openBirthCountry}
              value={
                BirthCountry
                  ? BirthCountry
                  : studentInfo?.countryCode?.countryCode
                  ? studentInfo?.countryCode?.countryCode
                  : ''
              }
              items={birthCountryData}
              setOpen={setOpenBirthCountry}
              setValue={setBirthCountry}
              // setItems={setCountryList}
              placeholder="Enter"
              style={styles.flexDropdown}
              onSelectItem={value => {
                getBirthStateData(value.value);
                setBirthStateValue('');
                birthCountryValueHandler(value);
                setErrorBirthCountry('');
              }}
              listMode="MODAL"
              name="BirthCountry"
              // {...getFieldProps("CurrenttAddressCountry")}
            />
            {errorBirthCountry !== '' && (
              <Text style={styles.errorMessage}>{errorBirthCountry}</Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.formInputTitle}>
                State<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            {showBirthDropDown ? (
              <DropDownPicker
                open={openBirthstate}
                value={
                  birthStateValue
                    ? birthStateValue
                    : studentInfo?.birthStateProvinceCode
                    ? studentInfo?.birthStateProvinceCode
                    : ''
                }
                items={birthStateData}
                setOpen={setOpenBirthState}
                setValue={setBirthStateValue}
                placeholder="Select"
                style={styles.flexDropdown}
                listMode="MODAL"
                placeholderStyle={{
                  color: '#4D4F5C',
                }}
                onSelectItem={value => {
                  birthStateValueHandler(value);
                  setErrorBirthState('');
                }}
              />
            ) : (
              <CustomInput
                name="BirthState"
                placeholder="Enter"
                placeholderTextColor="#4D4F5C"
                value={values.BirthState}
                onBlur={handleBlur('BirthState')}
                onChangeText={handleChange('BirthState')}
              />
            )}
            {errorBirthState !== '' && (
              <Text style={styles.errorMessage}>{errorBirthState}</Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>
                City<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <CustomInput
              name="BirthCity"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={values.BirthCity}
              onBlur={handleBlur('BirthCity')}
              onChangeText={handleChange('BirthCity')}
            />
            {touched.BirthCity && errors.BirthCity && (
              <Text style={styles.errorMessage}>{errors.BirthCity}</Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>
                Citizenship<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <DropDownPicker
              name="BirthCitizenship"
              listMode="MODAL"
              open={openCitizenCountry}
              value={
                valueCitizenCountry
                  ? valueCitizenCountry
                  : studentInfo?.ctznshipCountryCode?.shortCountryCode
                  ? studentInfo?.ctznshipCountryCode?.shortCountryCode
                  : ''
              }
              items={countryCitizenDataList}
              setOpen={setOpenCitizenCountry}
              setItems={setCountryCitizenDataList}
              setValue={setValueCitizenCountry}
              onChangeValue={handleChange('BirthCitizenship')}
              onChangeValue={value =>
                value === 'us'
                  ? setFieldValue('BirthCitizenship', 'us')
                  : (setFieldValue('cirtCitizenshipStatus', 'false'),
                    setFieldValue('BirthCitizenship', value))
              }
              placeholder="Select"
              placeholderStyle={{
                color: '#4D4F5C',
              }}
              // maxHeight={scale(115)}
              style={styles.flexDropdown}
            />
            {touched.BirthCitizenship && errors.BirthCitizenship && (
              <Text style={styles.errorMessage}>{errors.BirthCitizenship}</Text>
            )}
          </View>
        </View>
        {valueCitizenCountry === 'US' ? (
          <>
            <View style={{marginLeft: scale(-10)}}>
              <View>
                <Text style={styles.formInputTitle}>
                  My Citizenship was acquired through :
                  <Text style={{color: 'red'}}>*</Text>
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton.Group
                  onValueChange={handleChange('BirthCitizenShipAcquired')}
                  value={values.BirthCitizenShipAcquired}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <RadioButton.Android
                        value="Birth in the United States"
                        color="#0089CF"
                        uncheckedColor="grey"
                        label="Birth in the United States"
                      />
                      <Text style={styles.radioTitle}>
                        Birth in the United States
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <RadioButton.Android
                        value="Naturalization"
                        color="#0089CF"
                        uncheckedColor="grey"
                        label="Naturalization"
                      />
                      <Text style={styles.radioTitle}>Naturalization</Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <RadioButton.Android
                        value="Parents"
                        color="#0089CF"
                        uncheckedColor="grey"
                        label="Parents"
                      />
                      <Text style={styles.radioTitle}>Parents</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
              {touched.BirthCitizenShipAcquired &&
                errors.BirthCitizenShipAcquired && (
                  <Text style={{...styles.errorMessage, marginLeft: scale(5)}}>
                    {errors.BirthCitizenShipAcquired}
                  </Text>
                )}
            </View>
            <View
              style={{
                flex: 1,
                //   marginLeft: scale(-10),
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{flex: 3}}>
                <Text style={styles.formInputTitle}>
                  Have you obtained a Certification of Nauralization or
                  Certification of Citizenship?
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Switch
                  value={dobCertfSwitch}
                  onValueChange={value => {
                    setDOBCertfSwitch(!dobCertfSwitch);
                    visaStatusHandler(value);
                    setFieldValue('cirtCitizenshipStatus', value.toString());
                  }}
                  activeText={'Yes'}
                  inActiveText={'No'}
                  circleSize={28}
                  circleBorderActiveColor="#128BFF"
                  circleBorderInactiveColor="grey"
                  circleBorderWidth={1}
                  backgroundActive={'#128BFF'}
                  backgroundInactive={'grey'}
                  circleActiveColor={'#fff'}
                  circleInActiveColor={'#fff'}
                  changeValueImmediately={true}
                  innerCircleStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  outerCircleStyle={{marginRight: scale(5), color: '#128BFF'}}
                  renderActiveText={true}
                  renderInActiveText={true}
                  switchLeftPx={5}
                  switchRightPx={5}
                  switchWidthMultiplier={2}
                  switchBorderRadius={30}
                />
                {touched.cirtCitizenshipStatus &&
                  errors.cirtCitizenshipStatus && (
                    <Text style={styles.errorMessage}>
                      {errors.cirtCitizenshipStatus}
                    </Text>
                  )}
              </View>
            </View>
            {dobCertfSwitch ? (
              <>
                <View style={{flex: 1, marginLeft: scale(-10)}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.formInputTitle}>
                      Certificate Number<Text style={{color: 'red'}}>*</Text>
                    </Text>
                  </View>
                  <CustomInput
                    name="certificateNumber"
                    placeholder="Enter"
                    placeholderTextColor="#4D4F5C"
                    value={values.certificateNumber}
                    onBlur={handleBlur('certificateNumber')}
                    onChangeText={handleChange('certificateNumber')}
                    editable={true}
                  />
                  {touched.certificateNumber && errors.certificateNumber && (
                    <Text style={styles.errorMessage}>
                      {errors.certificateNumber}
                    </Text>
                  )}
                </View>
                <View style={{flex: 1, marginLeft: scale(-10)}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.formInputTitle}>
                      Place of Issurance<Text style={{color: 'red'}}>*</Text>
                    </Text>
                  </View>
                  <CustomInput
                    name="PlaceOfIssurance"
                    placeholder="Enter"
                    placeholderTextColor="#4D4F5C"
                    value={values.PlaceOfIssurance}
                    onBlur={handleBlur('PlaceOfIssurance')}
                    onChangeText={handleChange('PlaceOfIssurance')}
                    editable={true}
                  />
                  {touched.PlaceOfIssurance && errors.PlaceOfIssurance && (
                    <Text style={styles.errorMessage}>
                      {errors.PlaceOfIssurance}
                    </Text>
                  )}
                </View>
                <View style={{marginLeft: scale(-10)}}>
                  <Text style={styles.formInputTitle}>
                    Date of Issurance<Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      showIssuranceDatepicker();
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <CustomInput
                        name="DateOfIssurance"
                        placeholder="Select"
                        placeholderTextColor="#4D4F5C"
                        value={
                          emptyIssuranceDate === ''
                            ? studentInfo.hasCtznCrtfct === 0
                              ? ''
                              : studentInfo?.ctznCrtfctIssDate
                              ? moment(studentInfo?.ctznCrtfctIssDate).format(
                                  'MM/DD/YYYY',
                                )
                              : ''
                            : issuedDateFormat
                        }
                        editable={false}
                        autoCorrect={false}
                        style={{marginTop: scale(6), flex: 1}}
                      />
                      <AntDesign
                        name="calendar"
                        size={20}
                        style={{
                          position: 'absolute',
                          right: scale(10),
                          color: 'grey',
                        }}
                      />
                    </View>
                    {touched.DateOfIssurance && errors.DateOfIssurance && (
                      <Text style={styles.errorMessage}>
                        {errors.DateOfIssurance}
                      </Text>
                    )}
                  </TouchableOpacity>
                  {issuranceDateShow && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={issuranceDate}
                      mode="date"
                      onChange={onChangeIssued}
                      // style={{
                      //   accentColor: "red",
                      //   textColor: "red",
                      // }}
                      themeVariant="dark"
                      textColor="blue"
                    />
                  )}
                </View>
              </>
            ) : null}
          </>
        ) : null}
      </>
    );
  };
  const BiographicInformationEdit = (
    values,
    errors,
    handleChange,
    handleBlur,
    touched,
  ) => {
    const [openHairColour, setOpenHairColour] = useState(false);
    const [hairColourValue, setHairColourValue] = useState('');
    const [hairColourItem, setHairColourItems] = useState([
      {label: 'Bald(No Hair)', value: 'Bald No Hair'},
      {label: 'Black', value: 'Black'},
      {label: 'Blond', value: 'Blond'},
      {label: 'Gray', value: 'Gray'},
      {label: 'Red', value: 'Red'},
      {label: 'Sandy', value: 'Sandy'},
      {label: 'White', value: 'White'},
      {label: 'Unknown/Other', value: 'Unknown Other'},
    ]);
    const [openEyeColour, setOpenEyeColour] = useState(false);
    const [eyeColourValue, setEyeColourValue] = useState('');
    const [eyeColourItem, setEyeColourItems] = useState([
      {label: 'Black', value: 'Black'},
      {label: 'Blown', value: 'Blown'},
      {label: 'Blue', value: 'Blue'},
      {label: 'Gray', value: 'Gray'},
      {label: 'Green', value: 'Green'},
      {label: 'Hazel', value: 'Hazel'},
      {label: 'Maroon', value: 'Maroon'},
      {label: 'Pink', value: 'Pink'},
      {label: 'Unknown/Other', value: 'Unknown Other'},
    ]);
    return (
      <>
        <View style={{marginLeft: scale(-10)}}>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.formInputTitle}>
                Ethnicity<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton.Group
                onValueChange={handleChange('Ethnicity')}
                value={values.Ethnicity}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <RadioButton.Android
                      value="Hispanic or Latino"
                      color="#0089CF"
                      uncheckedColor="grey"
                      label="Hispanic or Latino"
                    />
                    <Text style={styles.radioTitle}>Hispanic or Latino</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <RadioButton.Android
                      value="Not Hispanic or Latino"
                      color="#0089CF"
                      uncheckedColor="grey"
                      label="Not Hispanic or Latino"
                    />
                    <Text style={styles.radioTitle}>
                      Not Hispanic or Latino
                    </Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
            {touched.Ethnicity && errors.Ethnicity && (
              <Text style={{...styles.errorMessage, marginLeft: scale(5)}}>
                {errors.Ethnicity}
              </Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.formInputTitle}>
                Race<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <RadioButton.Group
                onValueChange={handleChange('Race')}
                value={values.Race}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <RadioButton.Android
                      value="White"
                      color="#0089CF"
                      uncheckedColor="grey"
                      label="White"
                    />
                    <Text style={styles.radioTitle}>White</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <RadioButton.Android
                      value="Asian"
                      color="#0089CF"
                      uncheckedColor="grey"
                      label="Asian"
                    />
                    <Text style={styles.radioTitle}>Asian</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <RadioButton.Android
                      value="Black or African American"
                      color="#0089CF"
                      uncheckedColor="grey"
                      label="Black or African American"
                    />
                    <Text style={styles.radioTitle}>
                      Black or African American
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                      marginRight: scale(20),
                    }}>
                    <RadioButton.Android
                      value="Native Hawaiian or Other Pacific Islander"
                      color="#0089CF"
                      uncheckedColor="grey"
                      label="Native Hawaiian or Other Pacific Islander"
                    />
                    <Text style={{...styles.radioTitle}}>
                      Native Huwain or Other Pacific Islander
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <RadioButton.Android
                      value="American Indian or Alaska Native"
                      color="#0089CF"
                      uncheckedColor="grey"
                      label="American Indian or Alaska Native"
                    />
                    <Text style={styles.radioTitle}>
                      American Indian or Alaska Native
                    </Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
            {touched.Race && errors.Race && (
              <Text style={{...styles.errorMessage, marginLeft: scale(5)}}>
                {errors.Race}
              </Text>
            )}
          </View>
          <View style={{flex: 1, zIndex: 100}}>
            <View>
              <Text style={styles.formInputTitle}>
                Hair Colour<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <DropDownPicker
              name="HairColour"
              listMode="SCROLLVIEW"
              open={openHairColour}
              value={
                hairColourValue
                  ? hairColourValue
                  : studentInfo?.hairColor
                  ? studentInfo?.hairColor
                  : ''
              }
              items={hairColourItem}
              setOpen={setOpenHairColour}
              setItems={setHairColourItems}
              setValue={setHairColourValue}
              onChangeValue={handleChange('HairColour')}
              placeholder="Select"
              placeholderStyle={{
                color: '#4D4F5C',
              }}
              // maxHeight={scale(115)}
              style={styles.flexDropdown}
            />
            {touched.HairColour && errors.HairColour && (
              <Text style={styles.errorMessage}>{errors.HairColour}</Text>
            )}
          </View>
          <View style={{flex: 1, zIndex: 50}}>
            <View>
              <Text style={styles.formInputTitle}>
                Eyes Colour<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <DropDownPicker
              name="EyesColour"
              listMode="SCROLLVIEW"
              open={openEyeColour}
              value={
                eyeColourValue
                  ? eyeColourValue
                  : studentInfo?.eyeColor
                  ? studentInfo?.eyeColor
                  : ''
              }
              items={eyeColourItem}
              setOpen={setOpenEyeColour}
              setItems={setEyeColourItems}
              setValue={setEyeColourValue}
              onChangeValue={handleChange('EyesColour')}
              placeholder="Select"
              placeholderStyle={{
                color: '#4D4F5C',
              }}
              style={styles.flexDropdown}
            />
            {touched.EyesColour && errors.EyesColour && (
              <Text style={styles.errorMessage}>{errors.EyesColour}</Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>
                Weight (in Pounds)<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <CustomInput
              name="weight"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={values.weight}
              onBlur={handleBlur('weight')}
              onChangeText={handleChange('weight')}
            />
            {touched.weight && errors.weight && (
              <Text style={styles.errorMessage}>{errors.weight}</Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>
                Height (in Inches)<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <CustomInput
              name="Height"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={values.Height}
              onBlur={handleBlur('Height')}
              onChangeText={handleChange('Height')}
            />
            {touched.Height && errors.Height && (
              <Text style={styles.errorMessage}>{errors.Height}</Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.formInputTitle}>
                Any marks of identification ?
              </Text>
            </View>
            <CustomInput
              name="identification"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={values.identification}
              onBlur={handleBlur('identification')}
              onChangeText={handleChange('identification')}
            />
            {touched.identification && errors.identification && (
              <Text style={styles.errorMessage}>{errors.identification}</Text>
            )}
          </View>
        </View>
      </>
    );
  };
  const renderItem = item => {
    return (
      <>
        <View
          key={item.id}
          style={{
            flex: 1,
            flexDirection: 'row',
            height: scale(56),
          }}>
          <View
            style={{
              justifyContent: 'center',
              paddingLeft: scale(15),
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
              }}>
              <Text style={styles.formInputTitle}>Passport Copy</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              paddingLeft: scale(25),
            }}>
            <Text style={styles.formInputTitle}>{item.fileName}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true), setDeletePassID(item.id);
            }}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AntDesign
              name="delete"
              size={20}
              style={{
                color: '#00A8DB',
              }}
            />
          </TouchableOpacity>
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
                backgroundColor: '#0000000D',
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
                      Confirm Delete
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
                      fontSize: scale(16),
                      color: '#4D4F5C',
                      fontFamily: 'SourceSansPro-Regular',
                    }}>
                    Do you wish to Delete the Item?
                  </Text>
                  <View style={{flexDirection: 'row', marginTop: scale(30)}}>
                    <TouchableOpacity
                      onPress={() => deleteHandler()}
                      style={{
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
                        Confirm
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setModalVisible(!modalVisible)}
                      style={{
                        marginLeft: scale(30),
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
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </>
    );
  };
  const PassportDetailsEdit = (
    values,
    errors,
    handleChange,
    handleBlur,
    touched,
    setFieldValue,
  ) => {
    //Issued Date Code
    const [issuedDateShow, setIssuedDateShow] = useState(false);
    const [issuedDate, setIssuedDate] = useState(new Date());
    const [emptyIssuedDate, setEmptyIssuedDate] = useState('');
    let issuedDateFormat = moment(issuedDate).format('MM/DD/YYYY');
    const onChangeIssued = (event, selectedDate) => {
      Platform.OS === 'ios' ? null : setIssuedDateShow(false);
      const currentDate = selectedDate;
      setIssuedDate(currentDate);
      setEmptyIssuedDate(currentDate);
      setFieldValue('IssuedDate', moment(selectedDate).format('MM/DD/YYYY'));
    };
    const showIssuedDatepicker = () => {
      setIssuedDateShow(true);
    };
    //Expiry Date Code
    const [expiryDateShow, setExpiryDateShow] = useState(false);
    const [expiryDate, setExpiryDate] = useState(new Date());
    const [emptyExpiryDate, setEmptyExpiryDate] = useState('');
    let expiryDateFormat = moment(expiryDate).format('MM/DD/YYYY');
    const showExpiryDatepicker = () => {
      setExpiryDateShow(true);
    };
    const onChangeExpiry = (event, selectedDate) => {
      Platform.OS === 'ios' ? null : setExpiryDateShow(false);
      const currentDate = selectedDate;
      setExpiryDate(currentDate);
      setEmptyExpiryDate(currentDate);
      setFieldValue('ExpiryDate', moment(selectedDate).format('MM/DD/YYYY'));
    };

    const [getCountryList, setGetCounrtyList] = useState(
      props.CountryList.data,
    );
    const [openPassportCountry, setOpenPassportCountry] = useState(false);
    const [valuePassportCountry, setValuePassportCountry] = useState(null);
    const countryPassportData = [];
    const [countryPassportDataList, setCountryPassportDataList] =
      useState(countryPassportData);
    getCountryList
      ? getCountryList.map(item => {
          countryPassportData.push({
            label: item.countryName,
            value: item.countryCode,
          });
        })
      : null;

    return (
      <>
        <View style={{marginLeft: scale(-10)}}>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.formInputTitle}>
                Passport Number<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <CustomInput
              name="PassportNumber"
              placeholder="Enter"
              placeholderTextColor="#4D4F5C"
              value={values.PassportNumber}
              onBlur={handleBlur('PassportNumber')}
              onChangeText={handleChange('PassportNumber')}
            />
            {touched.PassportNumber && errors.PassportNumber && (
              <Text style={styles.errorMessage}>{errors.PassportNumber}</Text>
            )}
          </View>
          <View style={{flex: 1, zIndex: 100}}>
            <View>
              <Text style={styles.formInputTitle}>
                Issuing authority<Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <DropDownPicker
              name="issuingAuthority"
              listMode="MODAL"
              open={openPassportCountry}
              value={
                valuePassportCountry
                  ? valuePassportCountry
                  : studentInfo?.passport[0]?.issueCountryCode?.countryCode
                  ? studentInfo?.passport[0]?.issueCountryCode?.countryCode
                  : ''
              }
              items={countryPassportDataList}
              setOpen={setOpenPassportCountry}
              setItems={setCountryPassportDataList}
              setValue={setValuePassportCountry}
              onChangeValue={handleChange('issuingAuthority')}
              placeholder="Select"
              placeholderStyle={{
                color: '#4D4F5C',
              }}
              // maxHeight={scale(115)}
              style={styles.flexDropdown}
            />
            {touched.issuingAuthority && errors.issuingAuthority && (
              <Text style={styles.errorMessage}>{errors.issuingAuthority}</Text>
            )}
          </View>
          <View>
            <Text style={styles.formInputTitle}>
              Date of Issue<Text style={{color: 'red'}}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                showIssuedDatepicker();
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <CustomInput
                  name="date"
                  placeholder="Select"
                  placeholderTextColor="#4D4F5C"
                  value={
                    emptyIssuedDate === ''
                      ? studentInfo?.passport[0]?.issueDate
                        ? moment(studentInfo?.passport[0]?.issueDate).format(
                            'MM/DD/YYYY',
                          )
                        : ''
                      : issuedDateFormat
                  }
                  editable={false}
                  autoCorrect={false}
                  style={{marginTop: scale(6), flex: 1}}
                />
                <AntDesign
                  name="calendar"
                  size={20}
                  style={{
                    position: 'absolute',
                    right: scale(10),
                    color: 'grey',
                  }}
                />
              </View>
              {touched.IssuedDate && errors.IssuedDate && (
                <Text style={styles.errorMessage}>{errors.IssuedDate}</Text>
              )}
            </TouchableOpacity>
            {issuedDateShow && (
              <DateTimePicker
                testID="dateTimePicker"
                value={issuedDate}
                mode="date"
                onChange={onChangeIssued}
                maximumDate={new Date()}
                style={{
                  accentColor: 'red',
                  textColor: 'red',
                }}
                themeVariant="dark"
                textColor="blue"
              />
            )}
          </View>
          <View>
            <Text style={styles.formInputTitle}>
              Date of Expiry<Text style={{color: 'red'}}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                showExpiryDatepicker();
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <CustomInput
                  name="ExpiryDate"
                  placeholder="Select"
                  placeholderTextColor="#4D4F5C"
                  value={
                    emptyExpiryDate === ''
                      ? studentInfo?.passport[0]?.expiryDate
                        ? moment(studentInfo?.passport[0]?.expiryDate).format(
                            'MM/DD/YYYY',
                          )
                        : ''
                      : expiryDateFormat
                  }
                  editable={false}
                  autoCorrect={false}
                  style={{marginTop: scale(6), flex: 1}}
                />
                <AntDesign
                  name="calendar"
                  size={20}
                  style={{
                    position: 'absolute',
                    right: scale(10),
                    color: 'grey',
                  }}
                />
              </View>
              {touched.ExpiryDate && errors.ExpiryDate && (
                <Text style={styles.errorMessage}>{errors.ExpiryDate}</Text>
              )}
            </TouchableOpacity>
            {expiryDateShow && (
              <DateTimePicker
                testID="dateTimePicker"
                value={expiryDate}
                mode="date"
                onChange={onChangeExpiry}
                style={{
                  accentColor: 'red',
                  textColor: 'red',
                }}
                themeVariant="dark"
                textColor="blue"
              />
            )}
          </View>
          {/* <View style={{ justifyContent: "center" }}>
            <Text style={{ ...styles.formInputTitle }}>Signature</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <CustomButton
                bgcolor="#FFF"
                borderradius="4px"
                borderradiuscolor="#00A0DA"
                borderwidth="1px"
                width="40%"
                height="40px"
                marginTop="5px"
                marginLeft="10px"
                onPress={UploadSingnature}
              >
                <FontAwesome5
                  name="upload"
                  size={20}
                  style={{
                    right: scale(10),
                    color: "#00A0DA",
                  }}
                />
                <Text
                  style={{
                    color: "#00A0DA",
                    fontSize: scale(16),
                    fontFamily: "SourceSansPro-SemiBold",
                  }}
                >
                  Upload
                </Text>
              </CustomButton>
              {singnatureDoc !== "" ? (
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: scale(10),
                  }}
                >
                  <Image
                    style={{
                      height: scale(50),
                      resizeMode: "stretch",
                    }}
                    source={{
                      uri: `data:image/png;base64,${singnatureDoc}`,
                    }}
                  />
                </View>
              ) : null}
            </View>
          </View> */}
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.formInputTitle}>
                Add the photocopy of your passport
                {/* <Text style={{ color: "red" }}>*</Text> */}
              </Text>
            </View>
            <CustomButton
              bgcolor="#FFF"
              borderradius="4px"
              borderradiuscolor="#00A0DA"
              borderwidth="1px"
              width="40%"
              height="40px"
              marginTop="5px"
              marginLeft="10px"
              onPress={selectOneFile}>
              <FontAwesome5
                name="upload"
                size={20}
                style={{
                  right: scale(10),
                  color: '#00A0DA',
                }}
              />
              <Text
                style={{
                  color: '#00A0DA',
                  fontSize: scale(16),
                  fontFamily: 'SourceSansPro-SemiBold',
                }}>
                Upload
              </Text>
            </CustomButton>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              backgroundColor: '#EDF4FB',
              height: scale(56),
              marginTop: scale(20),
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                paddingLeft: scale(15),
                flexWrap: 'wrap',
              }}>
              <Text style={styles.formInputTitle}>Document Type</Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text style={styles.formInputTitle}>Document Name</Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.formInputTitle}>Actions</Text>
            </View>
          </View>
          {passportDetails?.length > 0 ? (
            passportDetails.map(item => {
              return renderItem(item);
            })
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: scale(10),
                marginTop: scale(10),
              }}>
              <Text
                style={{
                  color: '#505050',
                  fontSize: scale(14),
                  fontFamily: 'SourceSansPro-Regular',
                }}>
                {'No Document Added by you.'}
              </Text>
            </View>
          )}
        </View>
      </>
    );
  };
  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={100}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, backgroundColor: '#fff'}}>
          <Loader status={status} />
          <Formik
            initialValues={{
              title: studentInfo.title ? studentInfo.title : '',
              firstName: studentInfo.firstName ? studentInfo.firstName : '',
              middleName: studentInfo.middleName ? studentInfo.middleName : '',
              aliasTitle: '',
              aliasName: '',
              lastName: studentInfo.lastName ? studentInfo.lastName : '',
              email: PrimEmail[0].Primary ? PrimEmail[0].Primary : '',
              SocialSecurityNumber: studentInfo?.ssn ? studentInfo?.ssn : '',
              gender: studentInfo?.gender?.code
                ? studentInfo?.gender?.code
                : '',
              dob: studentInfo?.dob
                ? moment(studentInfo?.dob).format('MM/DD/YYYY')
                : '',
              phoneNumber: personalPhone[0]?.personalPhone
                ? personalPhone[0].personalPhone
                : '',
              countryName: personalPhone[0]?.shortCountryCode
                ? personalPhone[0].shortCountryCode.toLowerCase()
                : '',
              GREscore: studentInfo?.greScore
                ? studentInfo?.greScore.toString()
                : '',
              TOEFLscore: studentInfo?.toeflScore
                ? studentInfo?.toeflScore.toString()
                : '',
              LPRstatus:
                studentInfo.isLpr !== null
                  ? studentInfo.isLpr === 0
                    ? 'No'
                    : studentInfo.isLpr === 1
                    ? 'Yes'
                    : ''
                  : '',

              //Marraiage status
              MaritalStatus: studentInfo?.maritalStatus?.description
                ? studentInfo?.maritalStatus?.description
                : '',
              mrgDate: studentInfo?.marriageDate
                ? moment(studentInfo?.marriageDate).format('MM/DD/YYYY')
                : '',
              MarriageState: studentInfo.marriageStateProvinceName
                ? studentInfo.marriageStateProvinceName
                : '',
              MarriageCity: studentInfo.cityOfMarriage
                ? studentInfo.cityOfMarriage
                : '',

              //Current Address Details
              CurrentAddress1: currAddressData[0]?.CURR?.addressLine1
                ? currAddressData[0]?.CURR?.addressLine1
                : '',
              CurrentAddress2: currAddressData[0]?.CURR?.addressLine2
                ? currAddressData[0]?.CURR?.addressLine2
                : '',
              CurrenttAddressState: currAddressData[0]?.CURR?.stateProvinceName
                ? currAddressData[0]?.CURR?.stateProvinceName
                : '',
              CurrentCity: currAddressData[0]?.CURR?.city
                ? currAddressData[0]?.CURR?.city
                : '',
              CurrentLocality: currAddressData[0]?.CURR?.locality
                ? currAddressData[0]?.CURR?.locality
                : '',
              CurrentZIP: currAddressData[0]?.CURR?.postCode
                ? currAddressData[0]?.CURR?.postCode
                : '',

              //Pemanent Address Details
              PermanentAddress1: perAddressData[0]?.PERM?.addressLine1
                ? perAddressData[0]?.PERM?.addressLine1
                : '',
              PermanentAddress2: perAddressData[0]?.PERM?.addressLine2
                ? perAddressData[0]?.PERM?.addressLine2
                : '',
              PermanentAddressState: perAddressData[0]?.PERM?.stateProvinceName
                ? perAddressData[0]?.PERM?.stateProvinceName
                : '',
              PermanentAddressCity: perAddressData[0]?.PERM?.city
                ? perAddressData[0]?.PERM?.city
                : '',
              PermanentAddressLocality: perAddressData[0]?.PERM?.locality
                ? perAddressData[0]?.PERM?.locality
                : '',
              PermanentAddressZIP: perAddressData[0]?.PERM?.postCode
                ? perAddressData[0]?.PERM?.postCode
                : '',

              //Foreign Address Details
              ForeignAddress1: forgnAddressData[0]?.FORN?.addressLine1
                ? forgnAddressData[0]?.FORN?.addressLine1
                : '',
              ForeignAddress2: forgnAddressData[0]?.FORN?.addressLine2
                ? forgnAddressData[0]?.FORN?.addressLine2
                : '',
              ForeignAddressCountry: '',
              ForeignAddressState: forgnAddressData[0]?.FORN?.stateProvinceName
                ? forgnAddressData[0]?.FORN?.stateProvinceName
                : '',
              ForeignAddressCity: forgnAddressData[0]?.FORN?.city
                ? forgnAddressData[0]?.FORN?.city
                : '',
              ForeignAddressLocality: forgnAddressData[0]?.FORN?.locality
                ? forgnAddressData[0]?.FORN?.locality
                : '',
              ForeignAddressZIP: forgnAddressData[0]?.FORN?.postCode
                ? forgnAddressData[0]?.FORN?.postCode
                : '',

              //Place of Birth
              BirthState: studentInfo?.birthStateProvinceName
                ? studentInfo?.birthStateProvinceName
                : '',
              BirthCity: studentInfo?.birthCity ? studentInfo?.birthCity : '',
              BirthCitizenship: studentInfo?.ctznshipCountryCode
                ?.shortCountryCode
                ? studentInfo?.ctznshipCountryCode?.shortCountryCode.toLowerCase()
                : '',
              BirthCitizenShipAcquired:
                studentInfo?.ctznshipCountryCode?.countryCode !== 'USA'
                  ? ''
                  : studentInfo?.ctznAcqrTypeId?.name
                  ? studentInfo?.ctznAcqrTypeId?.name
                  : '',
              cirtCitizenshipStatus:
                studentInfo?.hasCtznCrtfct === 1 ? 'true' : 'false',
              certificateNumber:
                studentInfo.hasCtznCrtfct === 0
                  ? ''
                  : studentInfo.ctznCrtfctNo
                  ? studentInfo.ctznCrtfctNo
                  : '',
              PlaceOfIssurance:
                studentInfo.hasCtznCrtfct === 0
                  ? ''
                  : studentInfo.ctznCrtfctIssPlace
                  ? studentInfo.ctznCrtfctIssPlace
                  : '',
              DateOfIssurance:
                studentInfo.hasCtznCrtfct === 0
                  ? ''
                  : studentInfo?.ctznCrtfctIssDate
                  ? moment(studentInfo?.ctznCrtfctIssDate).format('MM/DD/YYYY')
                  : '',

              //Biographic Information
              Ethnicity: studentInfo?.ethnicity?.name
                ? studentInfo?.ethnicity?.name
                : '',
              Race: studentInfo?.race[0]?.raceId?.name
                ? studentInfo?.race[0]?.raceId?.name
                : '',
              HairColour: studentInfo?.hairColor ? studentInfo?.hairColor : '',
              EyesColour: studentInfo?.eyeColor ? studentInfo?.eyeColor : '',
              weight: studentInfo?.weight ? studentInfo?.weight.toString() : '',
              Height: studentInfo?.height ? studentInfo?.height : '',
              identification: studentInfo?.identificationMark
                ? studentInfo?.identificationMark
                : '',

              //Passport Details
              PassportNumber: studentInfo?.passport[0]?.passportNo
                ? studentInfo?.passport[0]?.passportNo
                : '',
              issuingAuthority: studentInfo?.passport[0]?.issueCountryCode
                ?.shortCountryCode
                ? studentInfo?.passport[0]?.issueCountryCode?.shortCountryCode
                : '',
              IssuedDate: studentInfo?.passport[0]?.issueDate
                ? moment(studentInfo?.passport[0]?.issueDate).format(
                    'MM/DD/YYYY',
                  )
                : '',
              ExpiryDate: studentInfo?.passport[0]?.expiryDate
                ? moment(studentInfo?.passport[0]?.expiryDate).format(
                    'MM/DD/YYYY',
                  )
                : '',
            }}
            enableReinitialize={true}
            validateOnBlur={true}
            validateOnChange={true}
            onSubmit={values => formHandler(values)}
            validationSchema={loginValidationSchema}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              errors,
              setFieldValue,
              isValid,
              getFieldProps,
            }) => (
              <>
                <View
                  style={{
                    marginHorizontal: scale(10),
                    // backgroundColor: "#fff",
                    flexGrow: 8,
                  }}>
                  <View style={{marginTop: scale(10), marginBottom: scale(10)}}>
                    <Accordion
                      title={'Personal Info'}
                      noMarginVertical={true}
                      data={PersonalInfoEdit(
                        values,
                        errors,
                        handleChange,
                        handleBlur,
                        touched,
                        isValid,
                        setFieldValue,
                      )}
                      expanded={true}
                      noMarginLeft={true}
                      backgroundColor={true}
                    />
                  </View>
                  <Accordion
                    title="Marital Status"
                    noMarginVertical={true}
                    data={MaritalStatusEdit(
                      values,
                      errors,
                      handleChange,
                      handleBlur,
                      touched,
                      setFieldValue,
                    )}
                    noMarginLeft={true}
                    backgroundColor={true}
                  />
                  <View style={{marginTop: scale(10), marginBottom: scale(10)}}>
                    <Accordion
                      title="Current Address Details"
                      noMarginVertical={true}
                      data={CurrentAddressEdit(
                        values,
                        errors,
                        handleChange,
                        handleBlur,
                        touched,
                        isValid,
                        setFieldValue,
                        getFieldProps,
                      )}
                      noMarginLeft={true}
                      backgroundColor={true}
                    />
                  </View>
                  <Accordion
                    title="Permanent Address Details"
                    noMarginVertical={true}
                    data={PermanentAddressEdit(
                      values,
                      errors,
                      handleChange,
                      handleBlur,
                      touched,
                    )}
                    noMarginLeft={true}
                    backgroundColor={true}
                  />
                  <View style={{marginTop: scale(10), marginBottom: scale(10)}}>
                    <Accordion
                      title="Foreign Address Details"
                      noMarginVertical={true}
                      data={ForeignAddressEdit(
                        values,
                        errors,
                        handleChange,
                        handleBlur,
                        touched,
                      )}
                      noMarginLeft={true}
                      backgroundColor={true}
                    />
                  </View>
                  <Accordion
                    title="Place of Birth"
                    noMarginVertical={true}
                    data={PlaceOfBirthEdit(
                      values,
                      errors,
                      handleChange,
                      handleBlur,
                      touched,
                      setFieldValue,
                      isValid,
                    )}
                    noMarginLeft={true}
                    backgroundColor={true}
                  />
                  <View style={{marginTop: scale(10), marginBottom: scale(10)}}>
                    <Accordion
                      title="Biographic Information"
                      noMarginVertical={true}
                      data={BiographicInformationEdit(
                        values,
                        errors,
                        handleChange,
                        handleBlur,
                        touched,
                        setFieldValue,
                      )}
                      noMarginLeft={true}
                      backgroundColor={true}
                    />
                  </View>
                  <Accordion
                    title="Passport Details"
                    noMarginVertical={true}
                    data={PassportDetailsEdit(
                      values,
                      errors,
                      handleChange,
                      handleBlur,
                      touched,
                      setFieldValue,
                    )}
                    noMarginLeft={true}
                    backgroundColor={true}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: scale(20),
                    justifyContent: 'space-between',
                    marginBottom: scale(10),
                    //   marginLeft: scale(-20),
                    marginHorizontal: scale(10),
                  }}>
                  <View style={{flex: 1}}>
                    <CustomButton
                      bgcolor="#CCD5E6"
                      onPress={() => props.resetEdit()}>
                      <Text style={{color: 'black'}}>CANCEL</Text>
                    </CustomButton>
                  </View>
                  <View>
                    <CustomButton onPress={handleSubmit}>
                      <Text style={styles.buttonText}>SAVE</Text>
                    </CustomButton>
                  </View>
                </View>
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const mapStateToProps = ({
  studentReducer: {
    studentInformation,
    CountryList,
    StateList,
    isLoading,
    getProfileDoc,
  },
}) => ({
  studentInformation,
  CountryList,
  StateList,
  isLoading,
  getProfileDoc,
});
const mapDispatchToProps = {
  getStudentInformation: (token, beneficiaryId) =>
    studentInformation(token, beneficiaryId),
  getstate: code => fetchStateList(code),
  postPersonalDetails: (token, payload) =>
    studentPesonalDetails(token, payload),
  getProfileDoc: (authToken, beneficiaryId) =>
    getProfileDocInfo(authToken, beneficiaryId),
  relatedDocDelete: (
    authToken,
    beneficiaryId,
    categoryName,
    fileCategory,
    fileId,
  ) =>
    relatedDocDelete(
      authToken,
      beneficiaryId,
      categoryName,
      fileCategory,
      fileId,
    ),
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonalDetailsEdit);
