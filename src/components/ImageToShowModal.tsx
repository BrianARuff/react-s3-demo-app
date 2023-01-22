import appText from '../text.json';

export const ImageToShowModal = ({
    isLoadingImageToShow,
    imageToShow,
    imageKeyShowing,
    isFetching,
    setImageToShow,
    setIsLoadingImageToShow,
}: {
    isLoadingImageToShow: boolean,
    imageToShow: string,
    isFetching: boolean,
    imageKeyShowing: string,
    setImageToShow: (imageToShow: string) => void,
    setIsLoadingImageToShow: (isLoadingImageToShow: boolean) => void
}) => {
    if (!imageToShow || !imageKeyShowing || isLoadingImageToShow || isFetching) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-90 z-50">
            <div className="relative border-4 border-tomato rounded-lg relative">
                <button
                    className="absolute top-0 right-0 mr-4 mt-4 bg-white rounded-full p-2 hover:bg-gray-200 hover:scale-110 transition duration-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        setImageToShow("");
                        setIsLoadingImageToShow(false);
                    }}
                >
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
                <img className="object-cover object-center w-full h-full rounded-lg" src={imageToShow} alt="upload" />
                <p className="
                    absolute bottom-0 left-30 right-0 ml-4 mb-4 bg-white p-2 w-full text-center text-gray-700
                ">{appText.fileName} {imageKeyShowing}</p>
            </div>
        </div>
    );
}