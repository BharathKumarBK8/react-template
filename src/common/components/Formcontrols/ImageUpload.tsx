import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  ChangeEvent,
} from "react";
import _ from "lodash";
import { FormFieldRef } from "./FormRenderer";
import {
  ValidationType,
  PositionType,
  ErrorModel,
  Errposition,
} from "../../../models/pageModel";
import { validateRequired } from "../../utilities/validation";

export interface IMAGE_UPLOAD_DATA {
  title: {
    text: string;
    icon?: string;
  };
  value?: string; // base64 or url
  validation?: Partial<typeof ValidationType>;
  position?: PositionType;
  error?: ErrorModel;
  name?: string;
  disabled?: boolean;
  placeholder?: string;
}

export interface ImageUploadProps {
  data: IMAGE_UPLOAD_DATA;
}

const ImageUpload = forwardRef<FormFieldRef, ImageUploadProps>(({ data }, ref) => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<ErrorModel | null>(null);

  useImperativeHandle(ref, () => ({
    getValue: () => image,
    setValue: (value: string) => setImage(value),
    validate: () => {
      if (data.validation?.required && !image) {
        const validationError = validateRequired("", data.error);
        setError(validationError);
        return false;
      }
      setError(null);
      return true;
    },
    reset: () => {
      setImage(null);
      setError(null);
    },
  }));

  useEffect(() => {
    if (data.value) setImage(data.value);
  }, [data.value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        if (error) setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlur = () => {
    if (data.validation?.required && !image) {
      setError(validateRequired("", data.error));
    }
  };

  const containerClassName = `form-group ${
    _.get(data, "position") === PositionType.VERTICAL
      ? "d-flex align-items-center"
      : ""
  }`;

  const labelContainerClassName = `${
    _.get(data, "position") === PositionType.VERTICAL
      ? "d-inline-flex align-items-center me-2"
      : "mb-2 d-block"
  }`;

  const inputContainerClassName = `${
    _.get(data, "position") === PositionType.VERTICAL
      ? "flex-grow-1"
      : "w-100"
  }`;

  return (
    <div className={containerClassName}>
      <div className={labelContainerClassName}>
        {_.get(data, "title.icon") && (
          <i className={`bi ${_.get(data, "title.icon")} me-2`}></i>
        )}
        <label>{_.get(data, "title.text")}</label>
        {_.get(data, "validation.required") && (
          <span className="text-danger ms-1">*</span>
        )}
      </div>
      <div className={inputContainerClassName}>
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={data.disabled}
          className={`form-control ${error ? "is-invalid" : ""}`}
        />
        {image && (
          <div className="mt-2">
            <img
              src={image}
              alt="Preview"
              style={{ maxWidth: "200px", maxHeight: "200px", border: "1px solid #ccc" }}
            />
          </div>
        )}
        {error && error.position === Errposition.BELOW && (
          <div className="text-danger mt-1">
            {_.get(error, "message.required")}
          </div>
        )}
        {error && error.position === Errposition.RIGHT && (
          <div className="text-danger ms-2">
            {_.get(error, "message.required")}
          </div>
        )}
      </div>
    </div>
  );
});

export default ImageUpload;