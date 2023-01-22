import { Image } from "./Image";

export const ImageList = ({
  imageList,
  isFetching,
  images,
  imageToShow,
  getFileFromS3,
  setImageToShow,
  setIsLoadingImageToShow,
  setImageKeyShowing,
  deleteFileFromS3,
  setIsFetching,
}: {
  setIsFetching: (isFetching: boolean) => void;
  imageList: string[];
  isFetching: boolean;
  imageToShow: string;
  images: [];
  setIsLoadingImageToShow: (isLoading: boolean) => void;
  getFileFromS3: (key: string) => Promise<string | Error>;
  setImageToShow: (url: string) => void;
  setImageKeyShowing: (key: string) => void;
  deleteFileFromS3: (key: string) => void;
}) => {

  if (imageList?.length > 0 && !isFetching) {
    return (
      <div className="flex flex-wrap justify-center">
        {images?.map((image: any, index) => {
          return (
            <div
              key={index}
              className="flex flex-col justify-center items-center"
            >
              <Image
                setIsFetching={setIsFetching}
                setIsLoadingImageToShow={setIsLoadingImageToShow}
                getFileFromS3={getFileFromS3}
                setImageKeyShowing={setImageKeyShowing}
                setImageToShow={setImageToShow}
                deleteFileFromS3={deleteFileFromS3}
                imageList={imageList}
                image={image}
                index={index}
                imageToShow={imageToShow}
              />
            </div>
          );
        })}
      </div >
    );
  }

  return null;
};
