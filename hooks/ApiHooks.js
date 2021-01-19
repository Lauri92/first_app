import {useEffect, useState} from 'react';

const baseUrl = 'http://media.mw.metropolia.fi/wbma/';

const useLoadMedia = () => {
  const [mediaArray, setmediaArray] = useState([]);

  const loadMedia = async (limit = 5) => {
    try {
      const listResponse = await fetch(baseUrl + 'media?limit=' + limit);
      const listJson = await listResponse.json();
      console.log('response json data: ', listJson);

      const media = await Promise.all(
        listJson.map(async (item) => {
          const fileResponse = await fetch(baseUrl + 'media/' + item.file_id);
          const fileJson = fileResponse.json();
          // console.log('media file data', json);
          return fileJson;
        })
      );
      console.log('media array data', media);

      setmediaArray(media);
    } catch (e) {
      console.error('loadMedia error', e);
    }
  };

  useEffect(() => {
    loadMedia(10);
  }, []);

  return mediaArray;
};

export {useLoadMedia};