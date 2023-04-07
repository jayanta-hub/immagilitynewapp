import {View, Text, ScrollView} from 'react-native';
import React, {useState, useRef} from 'react';
import {
  CustomInput,
  CustomButton,
  CustomCheckBox,
  CustomDropdownPicker,
  CustomRadioButton,
} from '../../../Infrastructure/CommonComponents/index';
import PhoneInput from 'react-native-phone-number-input';
import {
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {scale} from '../../../Infrastructure/utils/screenUtility';
import {useFormik} from 'formik';
import * as yup from 'yup';

const RegistrationScreen = () => {
  const [FormFields, setFormFieldValue] = useState({
    title: '',
    logo: true,
    fields: [
      {
        id: 1,
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'Enter first name',
        multiline: false,
        required: true,
        titleRequired: true,
        titleLabel: 'Title',
        titleName: 'title',
        titleData: [
          {
            id: 1,
            value: 'Mr.',
            label: 'Mr.',
          },
          {
            id: 2,
            value: 'Mrs.',
            label: 'Mrs.',
          },
          {
            id: 3,
            value: 'Ms',
            label: 'Ms',
          },
          {
            id: 4,
            value: 'Others',
            label: 'Others',
          },
        ],
        // value: 'ggg',
        secureTextEntry: false,
        style: {
          backgroundColor: 'white',
          borderColor: '#C3D0DE',
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          height: scale(40),
        },
      },

      {
        id: 2,
        name: 'middleName',
        label: 'Middle Name',
        type: 'text',
        placeholder: 'Enter middle name',
        secureTextEntry: false,
        required: true,
        style: {
          backgroundColor: 'white',
          borderColor: '#C3D0DE',
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        },
      },
      {
        id: 3,
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Enter last name',
        secureTextEntry: false,
        required: true,
        style: {
          backgroundColor: 'white',
          borderColor: '#C3D0DE',
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        },
      },

      {
        id: 4,
        name: 'PhoneNumber',
        countryName: 'countryName',
        type: 'phoneInput',
        label: 'Phone Number',
        required: true,
      },
      {
        id: 5,
        name: 'email',
        label: 'Email',
        type: 'text',
        placeholder: 'Enter email',
        secureTextEntry: false,
        required: true,
        style: {
          backgroundColor: 'white',
          borderColor: '#C3D0DE',
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        },
      },

      {
        id: 6,
        name: 'userId',
        label: 'User Name / ID',
        type: 'text',
        placeholder: 'Enter user name / Id',
        secureTextEntry: false,
        required: true,
        style: {
          backgroundColor: 'white',
          borderColor: '#C3D0DE',
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        },
      },

      {
        id: 7,
        name: 'password',
        label: 'Password',
        type: 'passowrd',
        placeholder: 'Enter your password',
        secureTextEntry: true,
        required: true,
        style: {
          backgroundColor: 'white',
          borderColor: '#C3D0DE',
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        },
      },
      {
        id: 8,
        name: 'confirmpassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: 'Enter to confirm password',
        secureTextEntry: true,
        required: true,
        style: {
          backgroundColor: 'white',
          borderColor: '#C3D0DE',
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        },
      },
      {
        id: 9,
        name: 'terms',
        label: 'I have read & accepted Terms and Conditions',
        type: 'checkbox',
        required: true,
        style: {
          backgroundColor: 'white',
          borderColor: 'gray',
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        },
      },
      {
        id: 10,
        type: 'button',
        text: 'Submit',
        name: 'Submit',
        required: false,
        label: 'PROCEED',

        navigation: () => {},
        nextApi: '',
        style: {
          backgroundColor: '#349beb',
          height: scale(40),
          borderRadius: 4,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: scale(20),
        },
      },
    ],
  });
  // const [FormFields, setFormFieldValue] = useState({
  //   title: 'Login Form',
  //   logo: true,
  //   fields: [
  //     {
  //       id: 1,
  //       name: 'userId',
  //       label: 'User Name / Id',
  //       type: 'text',
  //       placeholder: 'Enter user name / Id',
  //       secureTextEntry: false,
  //       required: true,
  //       style: {
  //         backgroundColor: 'white',
  //         borderColor: '#C3D0DE',
  //         borderWidth: 1,
  //         borderRadius: 5,
  //         padding: 10,
  //         marginBottom: 10,
  //       },
  //     },
  //     {
  //       id: 2,
  //       name: 'Password',
  //       label: 'Password',
  //       type: 'text',
  //       placeholder: 'Enter your password',
  //       secureTextEntry: true,
  //       required: true,
  //       style: {
  //         backgroundColor: 'white',
  //         borderColor: '#C3D0DE',
  //         borderWidth: 1,
  //         borderRadius: 5,
  //         padding: 10,
  //         marginBottom: 10,
  //       },
  //     },

  //     {
  //       id: 3,
  //       type: 'button',
  //       text: 'Submit',
  //       name: 'Submit',
  //       label: 'Log In',
  //       required: false,
  //       navigation: () => {},
  //       nextApi: '',
  //       style: {
  //         backgroundColor: '#349beb',
  //         height: scale(40),
  //         borderRadius: 4,
  //         alignItems: 'center',
  //         flexDirection: 'row',
  //         justifyContent: 'center',
  //         marginTop: scale(20),
  //       },
  //     },
  //   ],
  // });
  console.log('FormFields', FormFields);

  const [selectedValue, setSelectedValue] = useState('');
  const [titleValue, setTitleValue] = useState('');
  const [titleIsOpen, setTitleIsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const phoneInput = useRef(null);
  let initialValue = {};

  FormFields?.fields?.forEach(property => {
    // console.log('property', property);
    switch (property.type) {
      case 'text':
        initialValue[property.name] = '';
        property.type === 'text' && property.titleRequired
          ? (initialValue[property.titleName] = '')
          : null;
        break;
      case 'radio':
        initialValue[property.name] = '';
        break;
      case 'dropdown':
        initialValue[property.name] = '';
        break;
      case 'checkbox':
        initialValue[property.name] = false;
        break;
      case 'phoneInput':
        initialValue[property.name] = '';
        break;
      // Add cases for other data types as needed
      default:
        // initialValue[property.name] = '';
        break;
    }
  });

  const createValidationSchema = fields => {
    const schema = {};
    const phoneRegExp =
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    fields?.forEach(field => {
      switch (field.type) {
        case 'text':
          schema[field?.name] = field?.required
            ? yup.string().required(`${field?.label} is required`)
            : yup.string();
          field?.titleRequired
            ? (schema[field?.titleName] = field?.titleRequired
                ? yup.string().required(`${field?.titleLabel} is required`)
                : yup.string())
            : null;
          break;
        case 'password':
          schema[field?.name] = field?.required
            ? yup.string().required(`${field?.label} is required`)
            : yup.string();
          break;
        case 'dropdown':
          schema[field?.name] = field?.required
            ? yup.string().required(`${field?.label} is required`)
            : yup.string();
          break;
        case 'phoneInput':
          schema[field?.name] = field?.required
            ? yup
                .string()
                // .phone()
                .matches(/^[6-9]\d{9}$/, {
                  message: 'Please enter valid number.',
                  excludeEmptyString: false,
                })
                .typeError("That doesn't look like a phone number")
                .required(`${field?.label} is required`)
            : yup.number();
          break;
        case 'radio':
          schema[field?.name] = field?.required
            ? yup.string().required(`${field?.label} is required`)
            : yup.string().nullable();
          break;
        case 'checkbox':
          schema[field?.name] = field?.required
            ? yup.boolean().oneOf([true], `You must accept ${field?.label}`)
            : yup.boolean();
          break;
        default:
          break;
      }
    });

    return yup.object().shape(schema);
  };

  const validationSchema = createValidationSchema(FormFields?.fields);
  const formHnadler = value => {
    console.log('fianl submit handler =>>>>>', value);
  };
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    values,
    touched,
    errors,
  } = useFormik({
    // initialValues: {
    //   UserName: '',
    //   Gender: '',
    //   Password: '',
    //   ConfirmPassword: '',
    //   Message: '',
    //   checkbox: false,
    //   MaritalStatus: '',
    //   countryName: '',
    //   phoneNumber: '',
    // },
    initialValues: initialValue,
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: value => formHnadler(value),
    validationSchema,
  });

  console.log('initialValue', initialValue);

  return (
    <KeyboardAvoidingView
      style={{flexGrow: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? scale(0) : scale(135)}>
      <SafeAreaView
        style={{
          backgroundColor: '#fff',
          flexGrow: 1,
        }}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, paddingHorizontal: scale(10)}}>
          {FormFields?.logo ? (
            <View
              style={{
                marginVertical: scale(10),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  height: scale(50),
                  width: scale(200),
                  resizeMode: 'contain',
                }}
                source={require('../../../Infrastructure/assets/images/ImagilityLogo.png')}
              />
            </View>
          ) : null}
          <View>
            <Text
              style={{
                fontSize: scale(20),
                fontFamily: 'SourceSansPro-Regular',
                color: '#4D4F5C',
                marginVertical: scale(10),
              }}>
              {FormFields?.title}
            </Text>
          </View>
          <View>
            {FormFields?.fields?.map((item, index) => {
              if (item.type === 'text') {
                return (
                  <View
                    style={
                      item.type === 'text' &&
                      item.name === 'firstName' &&
                      item.titleRequired
                        ? {
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            zIndex: 100,
                          }
                        : {}
                    }>
                    {item.type === 'text' &&
                    item.name === 'firstName' &&
                    item.titleRequired ? (
                      <View>
                        <Text
                          style={{
                            marginBottom: scale(5),
                            fontSize: scale(14),
                            fontFamily: 'SourceSansPro-Regular',
                            color: '#24262F',
                            marginTop: scale(5),
                          }}>
                          {item.titleLabel}
                          {item.titleRequired ? (
                            <Text style={{color: 'red'}}>*</Text>
                          ) : null}
                        </Text>
                        <CustomDropdownPicker
                          listMode={
                            Platform.OS == 'ios' ? 'SCROLLVIEW' : 'MODAL'
                          }
                          open={titleIsOpen}
                          value={titleValue}
                          items={item.titleData}
                          setOpen={setTitleIsOpen}
                          setValue={setTitleValue}
                          // setItems={item.data}
                          onChangeValue={handleChange(`${item?.titleName}`)}
                          placeholder={'Select'}
                          placeholderStyle={
                            item.placeholderStyle || {
                              color: '#4D4F5C',
                            }
                          }
                          maxHeight={scale(250)}
                          style={{
                            minHeight: scale(40),
                            borderRadius: scale(5),
                            borderColor: '#C3D0DE',
                            paddingVertical: -20,
                            width: scale(90),
                          }}
                        />
                        {touched[item?.titleName] &&
                          errors[item?.titleName] && (
                            <Text
                              style={{
                                fontSize: scale(10),
                                fontFamily: 'SourceSansPro-Regular',
                                color: 'red',
                                marginLeft: scale(5),
                                marginBottom: scale(5),
                              }}>
                              {errors[item?.titleName]}
                            </Text>
                          )}
                      </View>
                    ) : null}

                    <View key={item.id} style={{flex: 1}}>
                      <Text
                        style={{
                          marginBottom: scale(5),
                          fontSize: scale(14),
                          fontFamily: 'SourceSansPro-Regular',
                          color: '#24262F',
                          marginTop: scale(5),
                        }}>
                        {item.label}
                        {item.required ? (
                          <Text style={{color: 'red'}}>*</Text>
                        ) : null}
                      </Text>
                      <CustomInput
                        name={item.name}
                        placeholder={item.placeholder}
                        placeholderTextColor={
                          item.placeholderTextColor || '#4D4F5C'
                        }
                        // value={item.value}
                        onBlur={handleBlur(`${item?.name}`)}
                        onChangeText={handleChange(`${item?.name}`)}
                        autoCorrect={false}
                        style={item.style ? item.style : {}}
                        multiline={item.multiline}
                        secureTextEntry={item.secureTextEntry}
                      />
                      {touched[item?.name] && errors[item?.name] && (
                        <Text
                          style={{
                            fontSize: scale(10),
                            fontFamily: 'SourceSansPro-Regular',
                            color: 'red',
                            marginLeft: scale(5),
                            marginBottom: scale(5),
                          }}>
                          {errors[item?.name]}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              }
              if (item.type === 'dropdown') {
                return (
                  <View
                    key={item.id}
                    style={{zIndex: 100, marginBottom: scale(5)}}>
                    <Text
                      style={{
                        marginBottom: scale(5),
                        fontSize: scale(14),
                        fontFamily: 'SourceSansPro-Regular',
                        color: '#24262F',
                        marginTop: scale(5),
                      }}>
                      {item.label}
                      {item.required ? (
                        <Text style={{color: 'red'}}>*</Text>
                      ) : null}
                    </Text>
                    <CustomDropdownPicker
                      listMode={Platform.OS == 'ios' ? 'SCROLLVIEW' : 'MODAL'}
                      open={isOpen}
                      value={selectedValue}
                      items={item.data}
                      setOpen={setIsOpen}
                      setValue={setSelectedValue}
                      // setItems={item.data}
                      onChangeValue={handleChange(`${item?.name}`)}
                      placeholder={item.placeholder || 'Select'}
                      placeholderStyle={
                        item.placeholderStyle || {
                          color: '#4D4F5C',
                        }
                      }
                      maxHeight={scale(250)}
                      style={
                        item.style || {
                          marginTop: scale(5),
                          minHeight: scale(40),
                          borderRadius: scale(5),
                          borderColor: '#C3D0DE',
                          paddingVertical: -20,
                          width: '100%',
                        }
                      }
                    />
                    {touched[item?.name] && errors[item?.name] && (
                      <Text
                        style={{
                          fontSize: scale(10),
                          fontFamily: 'SourceSansPro-Regular',
                          color: 'red',
                          marginLeft: scale(5),
                          marginBottom: scale(5),
                        }}>
                        {errors[item?.name]}
                      </Text>
                    )}
                  </View>
                );
              }
              if (item.type === 'radio') {
                return (
                  <View key={item.id} style={{marginBottom: scale(5)}}>
                    <Text
                      style={{
                        marginBottom: scale(5),
                        fontSize: scale(14),
                        fontFamily: 'SourceSansPro-Regular',
                        color: '#24262F',
                        marginTop: scale(5),
                      }}>
                      {item.label}
                      {item.required ? (
                        <Text style={{color: 'red'}}>*</Text>
                      ) : null}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <CustomRadioButton
                        onValueChange={handleChange(`${item?.name}`)}
                        value={values[item?.name]}
                        itemList={item?.oneOf}
                        uncheckedColor="grey"
                        color="#0089CF"
                      />
                    </View>
                    {errors[item?.name] && (
                      <Text
                        style={{
                          fontSize: scale(10),
                          fontFamily: 'SourceSansPro-Regular',
                          color: 'red',
                          marginLeft: scale(5),
                          marginBottom: scale(5),
                        }}>
                        {errors[item?.name]}
                      </Text>
                    )}
                  </View>
                );
              }
              if (item.type === 'phoneInput') {
                return (
                  <View key={item.id} style={{marginBottom: scale(5)}}>
                    <Text
                      style={{
                        marginBottom: scale(5),
                        fontSize: scale(14),
                        fontFamily: 'SourceSansPro-Regular',
                        color: '#24262F',
                        marginTop: scale(5),
                      }}>
                      {item.label}
                      {item.required ? (
                        <Text style={{color: 'red'}}>*</Text>
                      ) : null}
                    </Text>
                    <View>
                      <PhoneInput
                        ref={phoneInput}
                        defaultValue={values.phoneNumber}
                        defaultCode={values.countryName}
                        // layout="second"
                        layout="first"
                        onChangeText={text => {
                          setFieldValue(`${item?.name}`, text);
                          console.log('phone number', text);
                          console.log('values', values);
                        }}
                        // onChangeFormattedText={text => {
                        //   console.log('onChangeFormattedText', text);
                        // }}
                        onChangeCountry={value => {
                          console.log('selected country', value);
                          setFieldValue(`${item?.countryName}`, value.cca2);
                        }}
                        // withDarkTheme
                        // withShadow
                        // autoFocus55
                        // disableArrowIcon
                        containerStyle={{
                          width: '100%',
                          backgroundColor: 'white',
                          borderColor: '#C3D0DE',
                          borderWidth: 1,
                          borderRadius: 3,
                          height: scale(40),
                        }}
                        textContainerStyle={{
                          backgroundColor: 'white',
                          justifyContent: 'center',
                          alignContent: 'center',
                        }}
                        textInputStyle={{
                          height: scale(40),
                          fontSize: scale(14),
                          fontFamily: 'SourceSansPro-Regular',
                          color: '#24262F',
                        }}
                        codeTextStyle={{
                          paddingVertical: scale(10),
                          height: scale(35),
                          fontSize: scale(14),
                          fontFamily: 'SourceSansPro-Regular',
                          color: '#4D4F5C',
                        }}
                        flagButtonStyle={{
                          height: scale(40),
                          // backgroundColor: 'white',
                        }}
                        countryPickerButtonStyle={{}}
                      />
                    </View>
                    {errors[item?.name] && (
                      <Text
                        style={{
                          fontSize: scale(10),
                          fontFamily: 'SourceSansPro-Regular',
                          color: 'red',
                          marginLeft: scale(5),
                          marginBottom: scale(5),
                        }}>
                        {errors[item?.name]}
                      </Text>
                    )}
                  </View>
                );
              }
              if (item.type === 'checkbox') {
                return (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: scale(5),
                      }}>
                      <CustomCheckBox
                        name={item.label}
                        status={values.checkbox}
                        color={'#00A0DA'}
                        uncheckedColor={'#00A0DA'}
                        onPressHandler={() =>
                          setFieldValue('checkbox', !values.checkbox)
                        }
                      />
                      <Text
                        style={{
                          fontSize: scale(12),
                          fontFamily: 'SourceSansPro-Regular',
                          color: '#24262F',
                        }}>
                        {item.label}
                      </Text>
                    </View>
                    {touched[item?.name] && errors[item?.name] && (
                      <Text
                        style={{
                          fontSize: scale(10),
                          fontFamily: 'SourceSansPro-Regular',
                          color: 'red',
                          marginLeft: scale(5),
                          marginBottom: scale(5),
                        }}>
                        {errors[item?.name]}
                      </Text>
                    )}
                  </>
                );
              }
              if (item.type === 'button') {
                return (
                  <View key={item.id}>
                    <CustomButton
                      buttonText={item.label}
                      buttonTextStyle={{
                        fontSize: scale(18),
                        fontFamily: 'SourceSansPro-SemiBold',
                        color: '#fff',
                      }}
                      buttonStyle={item.style}
                      onPressHandler={handleSubmit}
                    />
                  </View>
                );
              }
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default RegistrationScreen;
