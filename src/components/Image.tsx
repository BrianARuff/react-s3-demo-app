import { useState } from "react";
import { isImage } from "../App";

export const Image = (props: any) => {
    const { setIsLoadingImageToShow,
        image,
        index,
        imageList,
        imageToShow,
        setIsFetching,
        getFileFromS3,
        setImageToShow,
        deleteFileFromS3,
        setImageKeyShowing
    } = props;

    const [styles, setStyles] = useState({});

    return <div
        onClick={async (e) => {
            e.preventDefault();
            getFileFromS3(image.key)

            new Promise((resolve) => {
                setIsLoadingImageToShow(true);
                setIsFetching(true);
                resolve(image.key);
            }).then((imageKey) => {
                setImageKeyShowing(imageKey as string);
                setImageToShow(imageList[index]);
            }).finally(() => {
                setIsLoadingImageToShow(false);
                setIsFetching(false);
            })
        }}
        onMouseEnter={() => {
            setStyles({
                border: "2px solid #000",
                boxShadow: "0 0 10px #000",
            });
        }}
        onMouseLeave={() => {
            setStyles({});
        }} className="relative flex flex-col items-center justify-center">
        {
            isImage(image?.key.split('.')[1].split('-')[0]) ? <img
                style={styles}
                src={imageList[index]}
                alt="upload"
                className="w-64 h-64 object-cover rounded-lg shadow-lg p-2 m-2 cursor-pointer"
            /> : <video
                muted
                autoPlay
                style={styles}
                src={imageList[index]}
                className="w-64 h-64 object-cover rounded-lg shadow-lg p-2 m-2 cursor-pointer"
            />
        }
        <button tabIndex={imageToShow ? -1 : 0} onClick={(e) => {
            e.preventDefault();
            deleteFileFromS3(image.key);
        }} className="absolute bottom-0 right-0 mr-4 mb-4 bg-white rounded-full p-2 hover:bg-gray-200 hover:scale-110 transition duration-200">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>
    </div>
}