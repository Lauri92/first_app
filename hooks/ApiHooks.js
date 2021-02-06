import axios from 'axios';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {baseUrl, appIdentifier} from '../utils/variables';

// general function for fetching
const doFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (json.error) {
    // if API response contains error message
    throw new Error(json.message + ': ' + json.error);
  } else if (!response.ok) {
    // if API response does not contain error message
    throw new Error('doFetch failed');
  } else {
    // if all goes well
    return json;
  }
};

const useLoadMedia = (all = false, limit) => {
  const [mediaArray, setmediaArray] = useState([]);
  const {update} = useContext(MainContext);

  const loadMedia = async (limit = 5) => {
    try {
      let listJson;
      if (all) {
        listJson = await doFetch(baseUrl + 'media?limit=' + limit);
      } else {
        listJson = await doFetch(baseUrl + 'tags/' + appIdentifier);
      }
      const media = await Promise.all(
        listJson.map(async (item) => {
          const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
          return fileJson;
        })
      );
      setmediaArray(media);
    } catch (e) {
      console.error('loadMedia error', e);
    }
  };

  useEffect(() => {
    // loads everything
    // loadMedia(true, 10);
    // loads by app id
    loadMedia();
  }, [update]);

  return mediaArray;
};

const useLogin = () => {
  const postLogin = async (userCredentials) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userCredentials),
    };
    try {
      const userData = await doFetch(baseUrl + 'login', options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {postLogin};
};

const useUser = () => {
  const postRegister = async (inputs) => {
    console.log('trying to create user', inputs);
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    try {
      const json = await fetch(baseUrl + 'users', fetchOptions);
      console.log('register resp:', json);
      return json;
    } catch (e) {
      console.log('ApiHooks register', e.message);
      throw new Error(e.message);
    }
  };

  const checkToken = async (token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const userData = await fetch(baseUrl + 'users/user', options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const checkIsUserAvailable = async (username) => {
    try {
      const result = await doFetch(baseUrl + 'users/username/' + username);
      return result.available;
    } catch (error) {
      throw new Error('apihooks checkIsUserAvailable', error.message);
    }
  };

  return {postRegister, checkToken, checkIsUserAvailable};
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    try {
      const tagList = await doFetch(baseUrl + 'tags/' + tag);
      return tagList;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const postTag = async (tag, token) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify(tag),
    };
    try {
      const result = await doFetch(baseUrl + 'tags', options);
      return result;
    } catch (error) {
      throw new Error('postTag error: ' + error.message);
    }
  };

  return {getFilesByTag, postTag};
};

const useMedia = () => {
  const upload = async (fd, token) => {
    const options = {
      method: 'POST',
      headers: {'x-access-token': token},
      data: fd,
      url: baseUrl + 'media',
    };
    console.log('ApiHooks upload', options);
    try {
      const response = await axios(options);
      return response.data;
    } catch (e) {
      throw new Error(e.message);
    }
  };
  return {upload};
};

export {useLoadMedia, useLogin, useUser, useTag, useMedia};
