import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Amplify } from "@aws-amplify/core";
import { ClockLoader } from "react-spinners";
import { Storage } from "@aws-amplify/storage";

import appText from "./text.json";
import {
  ImageList,
  ConfirmModal,
  UploadButton,
  ImageToShowModal,
} from "./components";
import "./App.css";
import { Button, Progress } from "@chakra-ui/react";

export const commonImageTypes = ["jpg", "png", "gif", "svg", "webp", "bmp", "ico", "cur", "tif", "tiff", "jfif", "pjpeg", "pjp", "avif", "apng"];

export const isImage = (mediaType: string) => {

  return commonImageTypes.includes(mediaType);
}

Amplify.configure({
  Auth: {
    identityPoolId: process.env.REACT_APP_S3_identityPoolId,
    region: process.env.REACT_APP_S3_region,
  },
  Storage: {
    AWSS3: {
      bucket: process.env.REACT_APP_S3_bucket,
      region: process.env.REACT_APP_S3_region,
    },
  },
});

function App() {
  const [images, setImages] = useState<any>([]);
  const [imageToShow, setImageToShow] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [imageList, setImageList] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isLoadingImageToShow, setIsLoadingImageToShow] = useState<boolean>(false);
  const [imageKeyShowing, setImageKeyShowing] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const fetchImages = async () => {
    try {
      setIsFetching(true);
      const imageListFromS3 = await Storage.list("");
      setImages(imageListFromS3);
      await Promise.all(
        imageListFromS3?.results?.map(async (image: any) => {
          const url = await Storage.get(image.key);
          return url;
        })
      )
        .then((imageUrls) => {
          setImageList(imageUrls);
        })
        .catch((err) => {
          console.log("Error setting image list", err);
        })
        .finally(() => {
          setIsFetching(false);
        });
    } catch (error) {
      console.log("Error fetching images: ", error);
      setErrorMessage("Error fetching images");
      setIsFetching(false);

    }
  };

  const storeFile = (file: any) => {
    Storage.put(`${uuidv4()}-${file?.name}`, file, {
      progressCallback(progress: any) {
        const percetnage = Math.round((progress.loaded / progress.total) * 100);
        setProgress(percetnage);
      },
    }).catch(() => {
      console.log("Error uploading file");
    }).finally(() => {
      setProgress(0);
      fetchImages();
    });
  };

  const handleFileUpload = async (ref: any) => {
    const files = ref.current?.files || [];

    if (!files.length) {
      return;
    }

    if (files.length === 1) {
      const file = ref.current?.files?.[0];

      if (file?.name) {
        storeFile(file);
      }
    }

    if (files.length > 1) {
      for (let i = 0; i < files.length; i++) {
        const file = files?.[i];
        if (file) {
          storeFile(file);
        }
      }
    }
  };

  const getFileFromS3 = async (key: string) => {
    try {
      const url = await Storage.get(key);
      setImageToShow(url);
      return url;
    } catch (error) {
      console.log("Error getting file from S3: ", error);
      setErrorMessage("Error getting file from S3");
      return new Error("Error getting file from S3");
    }
  };

  const deleteFileFromS3 = async (key: string) => {
    setImageToShow("");

    try {
      await Storage.remove(key);
      await fetchImages();
    } catch (error) {
      console.log("Error deleting file from S3: ", error);
      setErrorMessage("Error deleting file from S3");
    }
  };

  const deleteAllFilesFromS3 = async () => {
    setImageToShow("");

    try {
      await Promise.all(
        images?.results?.map(async (image: any) => {
          await Storage.remove(image.key);
        })
      );
      await fetchImages();
    } catch (error) {
      console.log("Error deleting all files from S3: ", error);
      setErrorMessage("Error deleting all files from S3");
    }
    setProgress(0);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const isDeleteAllDisabled = isFetching || !images?.results?.length || isConfirmModalOpen || imageList?.length === 0;

  if (isFetching) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
          flexDirection: "column",
        }}
      >
        <h1 className="text-4xl font-bold text-center text-black mb-8">{appText.title}</h1>
        <ClockLoader
          color="#FFDD39"
          size={250}
          cssOverride={{ marginBottom: "16px" }}
        />
      </div>
    );
  } else {
    return (
      <div
        className={`container mx-auto px-4 ${errorMessage ? 'mt-0' : '  mt-8'}`}
      >
        {errorMessage && (
          <h4
            className="bg-black text-tomato text-2xl font-bold p-4 flex fixed left-0 right-0 top-0 justify-center text-red-500"
          >
            {errorMessage}
          </h4>
        )}
        <div className="flex justify-between items-center flex-wrap">
          <h1 className="text-4xl font-bold mb-4">{appText.title}</h1>
          <ConfirmModal
            title={appText.modals.deleteImage.title}
            message={appText.modals.deleteImage.body}
            onConfirm={() => {
              deleteAllFilesFromS3();
              setIsConfirmModalOpen(false);
            }}
            onCancel={() => setIsConfirmModalOpen(false)}
            isOpen={isConfirmModalOpen}
          >
            <Button
              tabIndex={imageToShow ? -1 : 0}
              _focus={{ outline: "1px solid black" }}
              isDisabled={isDeleteAllDisabled}
              opacity={isDeleteAllDisabled ? 0.5 : 1}
              cursor={isDeleteAllDisabled ? "not-allowed" : "pointer"}
              className="bg-red-500 hover:bg-red-700 mr-8 text-white font-bold py-2 px-4 rounded mb-4 cursor-pointer"
              onClick={() => setIsConfirmModalOpen(true)}
            >
              {appText.buttons.deleteAllImages}
            </Button>
          </ConfirmModal>
        </div>
        <UploadButton imageToShow={imageToShow} errorMessage={errorMessage} progress={progress} handleFileUpload={handleFileUpload} />
        <Progress value={progress} size={'sm'} bg="blue.500" />
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{
            width: `${progress}%`
          }}></div>
        </div>
        {
          !isFetching && <ImageToShowModal isFetching={isFetching} isLoadingImageToShow={isLoadingImageToShow} imageKeyShowing={imageKeyShowing} imageToShow={imageToShow} setImageToShow={setImageToShow} setIsLoadingImageToShow={setIsLoadingImageToShow} />
        }
        <ImageList
          isFetching={isFetching}
          imageToShow={imageToShow}
          imageList={imageList ?? []}
          images={images?.results ?? []}
          setIsFetching={setIsFetching}
          getFileFromS3={getFileFromS3}
          setImageToShow={setImageToShow}
          deleteFileFromS3={deleteFileFromS3}
          setImageKeyShowing={setImageKeyShowing}
          setIsLoadingImageToShow={setIsLoadingImageToShow}
        />
      </div>
    );
  }
}

export default App;
