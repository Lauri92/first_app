import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Text, ListItem, Avatar} from 'react-native-elements';
import {ActivityIndicator} from 'react-native';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';

const Profile = ({navigation}) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(MainContext);
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const {getFilesByTag} = useTag();
  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    if (!isLoggedIn) {
      // this is to make sure isLoggedIn has changed, will be removed later
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const avatarList = await getFilesByTag('avatar_' + user.user_id);
        console.log(avatarList);
        if (avatarList.length > 0) {
          setAvatar(uploadsUrl + avatarList.pop().filename);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchAvatar();
  }, []);

  return (
    <Card>
      <Card.Title>
        <Text h1>{user.username}</Text>
      </Card.Title>
      <Card.Image
        source={{uri: avatar}}
        style={styles.image}
        PlaceholderContent={<ActivityIndicator />}
      />
      <ListItem>
        <Avatar icon={{name: 'email', color: 'black'}} />
        <Text>{user.email}</Text>
      </ListItem>
      <ListItem>
        <Avatar icon={{name: 'user', type: 'font-awesome', color: 'black'}} />
        <Text>{user.full_name}</Text>
      </ListItem>
      <ListItem bottomDivider onPress={() => navigation.push('My Files')}>
        <Avatar icon={{name: 'perm-media', color: 'black'}} />
        <ListItem.Content>
          <ListItem.Title>My Files</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      <ListItem bottomDivider onPress={logout}>
        <Avatar icon={{name: 'logout', color: 'black'}} />
        <ListItem.Content>
          <ListItem.Title>Logout</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
