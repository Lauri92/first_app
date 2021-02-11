import React from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Card, Avatar, ListItem, Text} from 'react-native-elements';
import moment from 'moment';
import {Video} from 'expo-av';

const Single = ({route}) => {
  const {file} = route.params;
  return (
    <Card>
      <Card.Title h4>{file.title}</Card.Title>
      <Card.Title>{moment(file.time_added).format('LLL')}</Card.Title>
      <Card.Divider />
      <>
        {file.media_type === 'image' ? (
          <Card.Image
            source={{uri: uploadsUrl + file.filename}}
            style={StyleSheet.image}
            PlaceholderContent={<ActivityIndicator />}
          />
        ) : (
          <Video
            source={{uri: uploadsUrl + file.filename}}
            style={StyleSheet.image}
            useNativeControls={true}
          />
        )}
      </>
      <Card.Divider />
      <Text style={styles.description}>{file.description}</Text>
      <ListItem>
        <Avatar source={{uri: 'http://placekitten.com/180'}} />
        <Text>Ownername</Text>
      </ListItem>
    </Card>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  description: {
    marginBottom: 10,
  },
});

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
