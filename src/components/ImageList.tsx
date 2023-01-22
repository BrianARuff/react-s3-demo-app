export const ImageList = ({
  imageList,
  isFetching,
}: {
  imageList: string[];
  isFetching: boolean;
}) => {
  if (imageList?.length > 0) {
    return (
      <div className="flex flex-wrap justify-center">
        {imageList.map((image, index) => {
          return (
            <div
              key={index}
              className="flex flex-col justify-center items-center"
            >
              <img
                src={image}
                alt="upload"
                className="w-64 h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};
