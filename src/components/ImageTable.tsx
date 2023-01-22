import appText from "../text.json";
import { ClockLoader } from "react-spinners";

export const ImageTable = ({
  images = [],
  errorMessage = "",
  isFetching = false,
  getFileFromS3 = (id: string) => {},
  setImageToShow = (id: string) => {},
  deleteFileFromS3 = (id: string) => {},
}) => {
  if (isFetching) {
    <ClockLoader color="#ffd369" size={33} loading={isFetching} />;
  }

  if (!errorMessage && images.length && !isFetching) {
    return (
      <>
        <hr />
        <table style={{ marginBottom: "16px", padding: "16px" }} width={"100%"}>
          <thead>
            <tr>
              <th>{appText.table.index}</th>
              <th>{appText.table.name}</th>
            </tr>
          </thead>
          {images?.map((image: any, index: number) => (
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
                    {appText.buttons.deleteImage}
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </>
    );
  }

  if (!errorMessage && !images.length && !isFetching) {
    return (
      <>
        <h3>{appText.noImagesFound}</h3>
        <p>{appText.haveYouTriedUploading}</p>
      </>
    );
  }

  return null;
};
