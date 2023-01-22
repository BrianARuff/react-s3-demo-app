import { useEffect, useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { Amplify } from "@aws-amplify/core";
import { ClockLoader } from "react-spinners";
import { Storage } from "@aws-amplify/storage";

import "./App.css";
import appText from "./text.json";
import { ImageTable, ImageList } from "./components";

// Configure Amplify
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
  const ref = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<any>([]);
  const [progress, setProgress] = useState<string>("");
  const [imageToShow, setImageToShow] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [imageList, setImageList] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

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
    Storage.put(`${file.name}-${uuidv4()}`, file, {
      progressCallback(progress: any) {
        const percetnage = Math.round((progress.loaded / progress.total) * 100);
        setProgress(`Uploaded: ${percetnage}%`);
      },
    })
      .then((_) => {
        setProgress("");
        fetchImages();
      })
      .catch((err) => {
        setProgress("");
        console.log("Error uploading file: ", err);
      });
  };

  const handleFileUpload = async () => {
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
    } catch (error) {
      console.log("Error getting file from S3: ", error);
      setErrorMessage("Error getting file from S3");
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

  useEffect(() => {
    fetchImages();
  }, []);

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
        <h1 style={{ marginBottom: "16px" }}>{appText.title}</h1>
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
        style={{
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          margin: "16px",
        }}
      >
        {errorMessage && (
          <h4
            style={{
              color: "tomato",
              fontSize: "24px",
              background: "#000",
              position: "fixed",
              top: "22px",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            {errorMessage}
          </h4>
        )}
        {progress && (
          <h4
            style={{
              color: "#fff",
              background: "lightgreen",
              fontWeight: "bold",
              fontSize: "24px",
              position: "fixed",
              top: "22px",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            {progress}
          </h4>
        )}
        <h1 style={{ marginTop: errorMessage || progress ? "101px" : "51px" }}>
          {appText.title}
        </h1>
        <input
          style={{ display: "none" }}
          type="file"
          ref={ref}
          onChange={handleFileUpload}
          multiple={true}
        />
        <button
          style={{
            width: "100%",
            background: "#ffd369",
            marginBottom: "16px",
            padding: "16px",
            fontWeight: "bold",
            fontSize: "16px",
            letterSpacing: "0.125rem",
            position: "fixed",
            top: 0,
            left: 0,
          }}
          onClick={() => ref.current?.click()}
        >
          {appText.buttons.upload}
        </button>
        {isFetching ? (
          <Spinner />
        ) : (
          imageToShow && <img src={imageToShow} alt="upload" height="300px" />
        )}
        <ImageTable
          images={images?.results ?? []}
          isFetching={isFetching}
          errorMessage={errorMessage ?? ""}
          getFileFromS3={getFileFromS3}
          setImageToShow={setImageToShow}
          deleteFileFromS3={deleteFileFromS3}
        />
        <ImageList imageList={imageList ?? []} isFetching={isFetching} />
      </div>
    );
  }
}

export default App;

const Spinner = () => {
  return <div className="loader"></div>;
};
