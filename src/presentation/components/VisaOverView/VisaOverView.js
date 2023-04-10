import {View, Text} from 'react-native';
import React, {useEffect} from 'react';

const VisaOverView = props => {
  const {title} = props.route.params;
  useEffect(() => {
    props.navigation.setParams({
      title: title,
    });
  }, []);
  return (
    <View>
      <Text>VisaoverView</Text>
    </View>
  );
};

export default VisaOverView;
