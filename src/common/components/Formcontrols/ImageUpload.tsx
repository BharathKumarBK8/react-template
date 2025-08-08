import {
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
  value?: string | string[];
  validation?: Partial<typeof ValidationType>;
  position?: PositionType;
  error?: ErrorModel;
  name?: string;
  disabled?: boolean;
  placeholder?: string;
  multiple?: boolean;
}

export interface ImageUploadProps {
  data: IMAGE_UPLOAD_DATA;
}

const ImageUpload = forwardRef<FormFieldRef, ImageUploadProps>(({ data }, ref) => {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<ErrorModel | null>(null);

  useImperativeHandle(ref, () => ({
    getValue: () => data.multiple ? images : images[0] || null,
    setValue: (value: string | string[]) => {
      if (Array.isArray(value)) {
        setImages(value);
      } else {
        setImages(value ? [value] : []);
      }
    },
    validate: () => {
      if (data.validation?.required && images.length === 0) {
        const validationError = validateRequired("", data.error);
        setError(validationError);
        return false;
      }
      setError(null);
      return true;
    },
    reset: () => {
      setImages([]);
      setError(null);
    },
  }));

  useEffect(() => {
    if (data.value) {
      if (Array.isArray(data.value)) {
        setImages(data.value);
      } else {
        setImages([data.value]);
      }
    }
  }, [data.value]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const formData = new FormData();
    
    if (data.multiple) {
      files.forEach(file => {
        formData.append("images", file);
      });

      try {
        const response = await fetch("http://localhost:5002/upload-images", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        
        if (result.paths && result.paths.length > 0) {
          setImages(prev => [...prev, ...result.paths]);
          if (error) setError(null);
        } else {
          setError({ message: { required: "Upload failed" }, position: Errposition.BELOW });
        }
      } catch (err) {
        setError({ message: { required: "Upload failed" }, position: Errposition.BELOW });
      }
    } else {
      formData.append("image", files[0]);

      try {
        const response = await fetch("http://localhost:5002/upload-image", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        
        if (result.path) {
          setImages([result.path]);
          if (error) setError(null);
        } else {
          setError({ message: { required: "Upload failed" }, position: Errposition.BELOW });
        }
      } catch (err) {
        setError({ message: { required: "Upload failed" }, position: Errposition.BELOW });
      }
    }
  };

  const handleBlur = () => {
    if (data.validation?.required && images.length === 0) {
      setError(validateRequired("", data.error));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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
          multiple={data.multiple}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={data.disabled}
          className={`form-control ${error ? "is-invalid" : ""}`}
        />
        {images.length > 0 && (
          <div className="mt-2 d-flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div key={index} className="position-relative">
                <img
                  src={image.startsWith("http") ? image : `http://localhost:5002${image}`}
                  alt={`Preview ${index + 1}`}
                  style={{ maxWidth: "150px", maxHeight: "150px", border: "1px solid #ccc" }}
                />
                {data.multiple && (
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    style={{ transform: "translate(50%, -50%)" }}
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
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
