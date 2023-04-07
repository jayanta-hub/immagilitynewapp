import React from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Avatar} from 'react-native-paper';
import {scale} from '../../utils/screenUtility';
import styles from './styles';
import {connect} from 'react-redux';

const ProfileHeader = props => {
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: '#fff',
        height: scale(80),
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {false ? (
          <View>
            <Image
              style={{
                width: scale(40),
                height: scale(40),
                borderRadius: scale(4),
              }}
              source={{
                uri: `data:image/png;base64,${props.profilePic}`,
              }}
            />
          </View>
        ) : (
          <View>
            <Avatar.Image
              size={scale(50)}
              source={require('../../assets/images/avatar.png')}
            />
          </View>
        )}

        <View style={styles.profilePic}>
          <MaterialIcons name="verified-user" size={20} color="#08C299" />
        </View>
        <View>
          <View style={{marginLeft: 10, justifyContent: 'space-between'}}>
            <Text style={styles.userName}>
              {props.name ? props.name : '--'}
            </Text>
            <Text style={styles.email}>
              {props.primaryEmail ? props.primaryEmail : '--'}
            </Text>
          </View>
        </View>
      </View>
      <View style={{alignItems: 'center', right: scale(5)}}>
        <TouchableOpacity
          style={styles.editContainer}
          onPress={() => {
            // signOut();
            props.onAction();
          }}>
          <MaterialIcons name="person-outline" size={25} color="#00A8DB" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = ({timeLine: {profileInfo, getProfileStatus}}) => ({
  profileInfo,
  getProfileStatus,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileHeader);
