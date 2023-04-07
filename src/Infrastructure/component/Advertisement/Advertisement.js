import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, Platform} from 'react-native';
import AdvertisingCard from './AdvertisingCard';
import {scale} from '../../utils/screenUtility';
import styles from './styles';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import NoDataFound from '../NoDataFound/NoDataFound';
import {MobileAppData} from '../../Data/OtherSupportingData';
const Advertisement = props => {
  const [OtherSuptAppData, setOtherSuptAppData] = useState(MobileAppData);
  const isFocused = useIsFocused();
  // const init = () => {
  //   const getOtherSuptAppData = props?.getOtherSupportingAppData?.data
  //     ? props.getOtherSupportingAppData.data.filter(
  //         item =>
  //           item.appName !== 'ImmigrationHub' &&
  //           (item.androidAppLink !== '' || item.iosAppLink !== ''),
  //       )
  //     : [];
  //   setOtherSuptAppData(getOtherSuptAppData);
  // };
  // console.log('first', MobileAppData);
  // useEffect(() => {
  //   isFocused === true && setOtherSuptAppData(MobileAppData);
  // }, [isFocused]);

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.titleText}>Other supporting apps</Text>
      </View>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          marginHorizontal: scale(10),
          paddingRight: scale(20),
          flexGrow: 1,
        }}>
        {OtherSuptAppData?.length > 0 ? (
          OtherSuptAppData.map(item => {
            return Platform.OS == 'ios' && item.iosAppLink !== '' ? (
              <AdvertisingCard
                key={item.id}
                image={item.appImage}
                appName={item.appName}
                iosLink={item.iosAppLink}
                androidLink={item.androidAppLink}
              />
            ) : Platform.OS == 'android' && item.androidAppLink !== '' ? (
              <AdvertisingCard
                key={item.id}
                image={item.appImage}
                appName={item.appName}
                iosLink={item.iosAppLink}
                androidLink={item.androidAppLink}
              />
            ) : null;
          })
        ) : (
          <NoDataFound Text={'Please Wait...'} />
        )}
      </ScrollView>
    </View>
  );
};
const mapStateToProps = ({timeLine: {getOtherSupportingAppData}}) => ({
  getOtherSupportingAppData,
});
export default connect(mapStateToProps, null)(Advertisement);
