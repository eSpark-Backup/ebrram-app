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
  // try {
  //   if (Platform.OS == 'ios')
  //     console.log('registerDeviceForRemoteMessages IOS');
  //   // await messaging().registerDeviceForRemoteMessages();
  // } catch (error) {
  //   console.log('registerDeviceForRemoteMessages error', error);
  // }
}

export const getFCMToken = async () => {
  try {
    await requestUserPermission();
    var token;
    if (Platform.OS == 'ios') {
      try {
        await messaging().registerDeviceForRemoteMessages();
        messaging().setAutoInitEnabled(true);
        const apns = await messaging().getAPNSToken();
        await messaging().setAPNSToken(apns);
        let tokenRefreshListenerUnsubscriber = messaging().onTokenRefresh(
          token => {
            console.log(
              'we have a refreshed token and should do something with it: ' +
                token,
            );
          },
        );
        token = await messaging().getToken();
        console.log('sx', apns, 'token \n', token);
      } catch (e) {
        console.log('err', e);
      }
    } else {
      token = await messaging().getToken();
    }
    console.log(`${Platform.OS} token`, token);
    return token;
  } catch (error) {
    console.log('catch error', error);
  }
};

export const subscribeNotification = async device_token => {
  const device_uuid = await DeviceInfo.getUniqueId();
  axios
    .post(Constant.BaseUrl_FCM + 'subscribe', {
      rest_api_key: Constant.restApiKey,
      device_uuid: device_uuid,
      device_token: device_token,
      subscription: 'sub1',
    })
    .then(async response => {
      console.log('response.data', response.data, device_token);
      if (!response.data.error) {
        console.log('Subscribed');
      } else {
        console.log('Subscribe Fail');
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
