import appText from '../text.json';
import { useRef } from 'react';

export const UploadButton = ({ handleFileUpload, progress, errorMessage, imageToShow }: { handleFileUpload: any, progress: number, errorMessage: string, imageToShow: string }) => {
    const ref = useRef<HTMLInputElement>(null);

    return (
        <div className={`${errorMessage ? 'mt-2' : ''}`}>
            <input
                tabIndex={imageToShow ? -1 : 0}
                style={{ display: "none" }}
                type="file"
                ref={ref}
                onChange={() => handleFileUpload(ref)}
                multiple={true}
            />
            <button
                tabIndex={imageToShow ? -1 : 0}
                onClick={() => ref.current?.click()}
                className="w-full bg-yellow-300 h-16"
            >
                <span className='text-2xl font-bold'>{appText.buttons.upload}</span>
            </button>
        </div>
    );
};
