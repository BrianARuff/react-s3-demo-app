import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef, useState } from 'react';
import { Amplify } from '@aws-amplify/core';
import { Storage } from '@aws-amplify/storage';

// Configure Amplify
Amplify.configure({
  Auth: {
    identityPoolId: process.env.REACT_APP_S3_identityPoolId,
    region: process.env.REACT_APP_S3_region,
  },
  Storage: {
    AWSS3: {
      bucket: process.env.REACT_APP_S3_bucket,
      region: process.env.REACT_APP_S3_region
    },
  }
});

function App() {
  const ref = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<any>([]);
  const [progress, setProgress] = useState<string>('');
  const [imageToShow, setImageToShow] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [imageList, setImageList] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleFileUpload = async () => {
    const file = ref.current?.files?.[0];

    if (!file) return;
    Storage.put(uuidv4(), file, {
      progressCallback(progress: any) {
        const percetnage = Math.round((progress.loaded / progress.total) * 100);
        setProgress(`Uploaded: ${percetnage}%`);
      }
    }).then(resp => {
      console.log('File uploaded: ', resp);
      setProgress('');
      fetchImages();
    }).catch(err => {
      setProgress('');
      console.log('Error uploading file: ', err);
    });
  };

  const fetchImages = async () => {
    try {
      const imageListFromS3 = await Storage.list('');
      setImages(imageListFromS3);
      await Promise.all(imageListFromS3?.results?.map(async (image: any) => {
        const url = await Storage.get(image.key);
        return url;
      })).then((imageUrls) => {
        setImageList(imageUrls);
      });
    } catch (error) {
      console.log('Error fetching images: ', error);
      setErrorMessage('Error fetching images');
    }
  }

  const getFileFromS3 = async (key: string) => {
    setIsFetching(true);
    try {
      const url = await Storage.get(key);
      setImageToShow(url);
      setIsFetching(false);
    } catch (error) {
      console.log('Error getting file from S3: ', error);
      setErrorMessage('Error getting file from S3');
      setIsFetching(false);
    }
  }

  const deleteFileFromS3 = async (key: string) => {
    try {
      await Storage.remove(key);
      await fetchImages();
    } catch (error) {
      console.log('Error deleting file from S3: ', error);
      setErrorMessage('Error deleting file from S3');
    }
  }

  useEffect(() => {

    fetchImages();
  }, []);

  return (
    <div style={{ width: '100%' }} >
      {
        errorMessage && <h4 style={{ color: 'tomato' }}>{errorMessage}</h4>
      }
      {
        progress && <h4 style={{ color: 'lightgreen' }}>{progress}</h4>
      }
      <h1>React S3 Demo App</h1>
      <input style={{ display: 'none' }} type="file" ref={ref} onChange={handleFileUpload} />
      <button style={{ width: '100%', background: '#ffd369', marginBottom: '16px' }} onClick={() => ref.current?.click()}>Upload</button>
      {
        isFetching ? <Spinner /> : imageToShow && <img src={imageToShow} alt="upload" height="300px" />
      }

      {
        <>
          <hr />
          {
            images?.results?.map((image: any, index: number) => (
              <table style={{ marginBottom: '16px' }} width={'100%'} key={image.key}>
                <thead>
                  <tr>
                    <th>Index</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{image.key}</td>
                    <td><button onClick={() => getFileFromS3(image.key)}>Show</button></td>
                    <td><button onClick={() => setImageToShow('')}>Hide</button></td>
                    <td><button onClick={() => deleteFileFromS3(image.key)}>Delete</button></td>
                  </tr>
                </tbody>
              </table>
            ))
          }
        </>
      }
      {
        imageList?.length > 0 && <>
          <hr />
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", width: '100%' }}>
            {
              imageList?.map((url: string) => (
                <img key={url} src={url} alt="upload" height="300px" style={{ padding: '0 16px 0 0' }} />
              ))
            }
          </div>
        </>
      }
    </div >
  )
}

export default App

const Spinner = () => {
  return (
    <div className="loader"></div>
  )
}