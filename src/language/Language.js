import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  I18nManager,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import * as Constant from '../constants/globalConstant';
import {useSelector, useDispatch} from 'react-redux';
import Header from '../components/Header';
import axios from 'axios';
import Notification from '../components/Notification';
import HTML from 'react-native-render-html';
import Feather from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../styles/Style';
import FormButton from '../components/FormButton';
import Translation from '../constants/Translation';
import {updateCurrentLanguage} from '../redux/GlobalStateSlice';

const Language = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const language = useSelector(state => state.global.currentLanguage);

  const [openReason, setOpenReason] = useState(false);
  const [reasonValue, setReasonValue] = useState(language);
  const [reasonItems, setReasonItems] = useState([
    {id: 1, label: Translation.languageArabic, value: 'ar'},
    {id: 2, label: Translation.languageEnglish, value: 'en'},
  ]);
  const tagsStyles = {
    body: {
      fontFamily: 'OpenSans-Regular',
      fontSize: 15,
      lineHeight: 24,
      letterSpacing: 0.5,
      color: Constant.fontColor,
    },
  };
  const getVal = async val => {
    dispatch(updateCurrentLanguage(val()));
    Translation.setLanguage(val());
    setReasonValue(val());
    val() == 'ar'
      ? await I18nManager.forceRTL(true)
      : await I18nManager.forceRTL(false);
  };
  useEffect(() => {}, []);

  return (
    <SafeAreaView style={styles.globalContainer}>
      <Header
        backColor={Constant.whiteColor}
        iconColor={Constant.iconColor}
        heading={true}
        title={Translation.languageLangauge}
      />
      {/* <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
      /> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cardView}>
          <Text style={styles.inputHeading}>
            {Translation.languageChangeAppLanguage}
          </Text>
          <Text style={styles.inputHeading}>
            {Translation.languageSelectLanguage}
          </Text>
          <DropDownPicker
            style={styles.MultiselectmainView}
            textStyle={{
              color: Constant.fontColor,
              fontSize: 16,
            }}
            placeholderStyle={{
              color: Constant.lightGrayColor,
              fontWeight: '400',
            }}
            searchContainerStyle={{
              borderBottomColor: Constant.borderColor,
            }}
            searchTextInputStyle={{
              color: '#000',
              borderColor: Constant.whiteColor,
            }}
            dropDownContainerStyle={{
              borderColor: Constant.borderColor,
            }}
            open={openReason}
            value={reasonValue}
            searchPlaceholder={Translation.globalSearchHere}
            items={reasonItems}
            searchable={true}
            setOpen={setOpenReason}
            setValue={getVal}
            setItems={setReasonItems}
            listMode="MODAL"
            theme="LIGHT"
            multiple={false}
            mode="BADGE"
            zIndex={1000}
            disableBorderRadius={true}
            badgeDotColors={[Constant.primaryColor]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Language;
