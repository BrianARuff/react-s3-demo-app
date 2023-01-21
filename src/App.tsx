import "./App.css";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef, useState } from "react";
import { Amplify } from "@aws-amplify/core";
import { Storage } from "@aws-amplify/storage";
import appText from "./text.json";

// Configure Amplify...
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
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleFileUpload = async () => {
    const file = ref.current?.files?.[0];

    if (!file) return;
    Storage.put(uuidv4(), file, {
      progressCallback(progress: any) {
        const percetnage = Math.round((progress.loaded / progress.total) * 100);
        setProgress(`Uploaded: ${percetnage}%`);
      },
    })
      .then((resp) => {
        console.log("File uploaded: ", resp);
        setProgress("");
        fetchImages();
      })
      .catch((err) => {
        setProgress("");
        console.log("Error uploading file: ", err);
      });
  };

  const fetchImages = async () => {
    try {
      const imageListFromS3 = await Storage.list("");
      setImages(imageListFromS3);
      await Promise.all(
        imageListFromS3?.results?.map(async (image: any) => {
          const url = await Storage.get(image.key);
          return url;
        })
      ).then((imageUrls) => {
        setImageList(imageUrls);
      });
    } catch (error) {
      console.log("Error fetching images: ", error);
      setErrorMessage("Error fetching images");
    }
  };

  const getFileFromS3 = async (key: string) => {
    setIsFetching(true);
    try {
      const url = await Storage.get(key);
      setImageToShow(url);
      setIsFetching(false);
    } catch (error) {
      console.log("Error getting file from S3: ", error);
      setErrorMessage("Error getting file from S3");
      setIsFetching(false);
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

      {
        <>
          <hr />
          <table
            style={{ marginBottom: "16px", padding: "16px" }}
            width={"100%"}
          >
            <thead>
              <tr>
                <th>{appText.table.index}</th>
                <th>{appText.table.name}</th>
              </tr>
            </thead>
            {images?.results?.map((image: any, index: number) => (
              <tbody>
                <tr>
                  <td>{index + 1}</td>
                  <td>{image.key}</td>
                  <td>
                    <button
                      style={{ width: "100%" }}
                      onClick={() => getFileFromS3(image.key)}
                    >
                      {appText.buttons.showImage}
                    </button>
                  </td>
                  <td>
                    <button
                      style={{ width: "100%" }}
                      onClick={() => setImageToShow("")}
                    >
                      Hide
                    </button>
                  </td>
                  <td>
                    <button
                      style={{ width: "100%" }}
                      onClick={() => deleteFileFromS3(image.key)}
                    >
                      {appText.buttons.showImage}
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </>
      }
      {imageList?.length > 0 && (
        <>
          <hr />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
            }}
          >
            {imageList?.map((url: string) => (
              <img
                key={url}
                src={url}
                alt="upload"
                height="300px"
                style={{ padding: "0px 16px 16px 0px" }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;

const Spinner = () => {
  return <div className="loader"></div>;
};
