import appText from '../text.json';
import { useRef } from 'react';

export const UploadButton = ({ handleFileUpload, progress, errorMessage }: { handleFileUpload: any, progress: number, errorMessage: string }) => {
    const ref = useRef<HTMLInputElement>(null);

    return (
        <div className={`${errorMessage ? 'mt-2' : ''}`}>
            <input
                style={{ display: "none" }}
                type="file"
                ref={ref}
                onChange={() => handleFileUpload(ref)}
                multiple={true}
            />
            <button
                onClick={() => ref.current?.click()}
                className="w-full bg-yellow-300 h-16"
            >
                <span className='text-2xl font-bold'>{appText.buttons.upload}</span>
            </button>
        </div>
    );
};
