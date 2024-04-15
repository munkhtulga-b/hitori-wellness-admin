import Image from "next/image";
import { message } from "antd";

const FileUploader = ({ currentFile, onFileChange }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const handleFileChange = (files) => {
    const file = files[0];
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      messageApi.info("Only png and jpeg images are allowed");
    } else {
      onFileChange(file);
    }
  };
  const onFileBrowse = () => {
    const input = document.getElementById("input-file-upload");
    if (input) {
      input.click();
    }
  };
  return (
    <>
      {contextHolder}
      <div className="tw-inline-flex tw-flex-col tw-items-center tw-gap-2">
        <input
          id="input-file-upload"
          type="file"
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(e.target.files)}
          multiple={false}
          accept="image/png, image/jpeg"
        />
        <section
          onClick={() => onFileBrowse()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileChange(e.dataTransfer.files);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
          onDragLeave={(e) => e.preventDefault()}
          className={`${
            currentFile ? "tw-bg-white" : "tw-bg-gray-300"
          } tw-cursor-pointer tw-size-[150px] tw-overflow-hidden tw-border tw-border-primary tw-p-4 tw-rounded-xl tw-grid tw-place-items-center hover:tw-scale-105 tw-transition-all tw-duration-200`}
        >
          {currentFile ? (
            <Image
              src={URL.createObjectURL(currentFile)}
              alt="upload"
              width={0}
              height={0}
              style={{ objectFit: "contain", height: "auto", width: "auto" }}
            />
          ) : null}
        </section>
        <section>
          <span
            className="tw-text-sm tw-text-support tw-tracking-[0.12px] tw-cursor-pointer"
            onClick={() => onFileBrowse()}
          >
            アップロード
          </span>
        </section>
      </div>
    </>
  );
};

export default FileUploader;
