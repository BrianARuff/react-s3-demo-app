export const ImageList = ({
  imageList,
  isFetching,
}: {
  imageList: string[];
  isFetching: boolean;
}) => {
  if (imageList?.length > 0) {
    return (
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
            <>
              <img
                key={url}
                src={url}
                alt="upload"
                height="300px"
                style={{ padding: "0px 16px 16px 0px" }}
              />
              <hr />
            </>
          ))}
        </div>
      </>
    );
  }

  return null;
};
