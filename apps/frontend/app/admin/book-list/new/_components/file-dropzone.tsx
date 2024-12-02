"use-client";

import React, { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";

import { CSSProperties } from "react";
import { Button } from "@/components/ui/button";

const baseStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  // backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function Dropzone(props: {
  required: boolean;
  name: string;
  selectedFiles: File[];
  setFiles: (files: File[]) => void;
}) {
  const { required, name, selectedFiles, setFiles } = props;

  const [errors, setErrors] = React.useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (selectedFiles.length === 1) {
        setErrors(["You can only upload one file."]);
        return;
      }
      setFiles([...selectedFiles, ...acceptedFiles]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFiles]
  );

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { "text/*": [".txt"] },
      maxFiles: 1,
      maxSize: 5242880, // 5MB
      onDrop,
    });

  const removeFile = (file: File) => () => {
    const newFiles = [...selectedFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    if (errors.length > 0) {
      setErrors([]);
    }
    setFiles(newFiles);
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const files = selectedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes{" "}
      <Button onClick={removeFile(file)}>Remove File</Button>
    </li>
  ));

  return (
    <div className="container">
      <h1>
        {name} {required && <span className=" text-red-500">*</span>}
      </h1>

      {files.length === 0 && (
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p>
            Drag &apos;n&apos; drop some files here, or click to select files
          </p>
        </div>
      )}
      <aside>
        <ul>{files}</ul>
        <p className="text-red-500">{errors.join(", ")}</p>
      </aside>
    </div>
  );
}
