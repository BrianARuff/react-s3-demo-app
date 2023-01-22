// using tailwind, make a progress bar banner component in react that sits 22px from top of page
export const ProgressBarBanner = ({
  progress,
}: {
  progress: number | string;
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "22px",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div className="bg-gray-200 rounded-full h-4 w-96">
        <div
          className="bg-blue-500 rounded-full h-4"
          style={{
            width: `${50}%`,
            transition: "width 1s ease-in-out",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {50}%
        </div>
      </div>
    </div>
  );
};
