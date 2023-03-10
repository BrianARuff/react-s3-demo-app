import { isImage } from '../App';
import { useRef } from 'react';

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
    const closeModalButtonRef = useRef<HTMLButtonElement>(null);

    closeModalButtonRef.current?.focus();

    if (!imageToShow || !imageKeyShowing || isLoadingImageToShow || isFetching) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-90 z-50">
            <div className="relative rounded-lg relative w-full p-4 flex justify-center items-center">
                <button
                    ref={closeModalButtonRef}
                    className="fixed top-10 mb-5 right-0 mr-4 mt-4 p-0 bg-white rounded-full p-1 hover:bg-gray-200 hover:scale-110 transition duration-200"
                    style={{
                        zIndex: 9999,
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setImageToShow("");
                        setIsLoadingImageToShow(false);
                    }}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === "Escape" || e.keyCode === 27) {
                            setImageToShow("");
                            setIsLoadingImageToShow(false);
                        }
                        if (e.key === " " || e.keyCode === 32) {
                            setImageToShow("");
                            setIsLoadingImageToShow(false);
                        }

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
                {
                    isImage(imageKeyShowing.split('.')[1].split('-')[0]) ?
                        <img
                            src={imageToShow} alt="upload"
                            className='rounded'
                        />
                        : <video
                            controls
                            muted
                            style={{
                                height: '90vh',
                            }}
                            className="rounded"
                            src={imageToShow} />
                }
            </div>
        </div>
    );
}