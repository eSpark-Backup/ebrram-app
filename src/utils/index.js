import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import {Platform} from 'react-native';
import * as Constant from '../constants/globalConstant';
import DeviceInfo from 'react-native-device-info';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
  if (Platform.OS == 'ios') await messaging().registerDeviceForRemoteMessages();
}

export const getFCMToken = async () => {
  await requestUserPermission();
  var token;
  if (Platform.OS == 'ios') {
    token = await messaging().getAPNSToken();
  } else {
    token = await messaging().getToken();
  }
  console.log(`${Platform.OS} token`, token);
  return token;
};

export const subscribeNotification = async device_token => {
  const device_uuid = await DeviceInfo.getUniqueId();
  axios
    .post(Constant.BaseUrl_FCM + 'subscribe', {
      rest_api_key: Constant.restApiKey,
      device_uuid: device_uuid,
      device_token: device_token,
      subscription: 'wowo',
    })
    .then(async response => {
      console.log('response.data', response.data);
      if (!response.data.error) {
        console.log('Subscribed', {
          rest_api_key: Constant.restApiKey,
          device_uuid: device_uuid,
          device_token: device_token,
          subscription: 'wowo',
        });
      } else {
        console.log('Subscribe Fail', {
          rest_api_key: Constant.restApiKey,
          device_uuid: device_uuid,
          device_token: device_token,
          subscription: 'wowo',
        });
      }
    })
    .catch(error => {
      console.log('subscribeNotification', error);
    });
};

export const unsubscribeNotification = async () => {
  const device_uuid = await DeviceInfo.getUniqueId();

  axios
    .post(Constant.BaseUrl_FCM + 'unsubscribe', {
      rest_api_key: Constant.restApiKey,
      device_uuid: device_uuid,
    })
    .then(async response => {
      console.log('response.data', response.data);
      if (!response.data.error) {
        console.log('UnSubscribed');
      } else {
        console.log('UnSubscribed Fail');
      }
    })
    .catch(error => {
      console.log(error);
    });
};
