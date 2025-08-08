import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import _ from "lodash";
import { FormFieldRef } from "./FormRenderer";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import {
  PositionType,
  ValidationType,
  ErrorModel,
  Errposition,
} from "../../../models/pageModel";
import { validateRequired } from "../../utilities/validation";

export interface CHECK_BOX_DATA {
  title: {
    text: string;
    icon?: string;
    click: string;
  };
  options: Category[];
  label: string;
  value: string;
  name: string;
  position?: PositionType;
  validation?: Partial<typeof ValidationType>;
  error?: ErrorModel;
  disabled?: boolean;
  onChange: (value: any) => void;
}

export interface Category {
  label: string;
  key: string;
}
export interface CheckboxProps {
  data: CHECK_BOX_DATA;
}

const CheckBox = forwardRef<FormFieldRef, CheckboxProps>(({ data }, ref) => {
  const [selected, setSelected] = useState<Category[]>([]);
  const [error, setError] = useState<ErrorModel | null>(null);

  useEffect(() => {
    // If data contains pre-selected values (for editing mode)
    if (data.value) {
      if (Array.isArray(data.value)) {
        // If array of objects with key/label
        if (
          data.value.length > 0 &&
          typeof data.value[0] === "object" &&
          "key" in data.value[0]
        ) {
          setSelected(data.value);
        }
        // If array of string keys
        else if (data.value.length > 0 && typeof data.value[0] === "string") {
          const selectedOptions = data.value.map((key: string) => {
            const option = data.options.find((opt) => opt.key === key);
            return option || { key, label: key };
          });
          setSelected(selectedOptions);
        }
      }
    }
  }, [data.value, data.options]);

  // Expose methods to parent component through ref
  useImperativeHandle(ref, () => ({
    getValue: () => {
      // Return only the keys for storage
      return selected.map((item) => item.key);
    }, // Return only the keys
    setValue: (value: any) => {
      if (Array.isArray(value)) {
        // Handle array of objects with key/label
        if (
          value.length > 0 &&
          typeof value[0] === "object" &&
          "key" in value[0]
        ) {
          setSelected(value);
        }
        // Handle array of string keys
        else {
          const selectedCategories = value.map((key) => {
            const option = data.options.find((opt) => opt.key === key);
            return option || { key, label: key };
          });
          setSelected(selectedCategories);
        }
      } else {
        console.log("CheckBox setValue expected array but received:", value);
        setSelected([]);
      }
    },
    reset: () => {
      setSelected([]);
      setError(null);
    },
    validate: () => {
      if (data.validation?.required && selected.length === 0) {
        const validationError = validateRequired("", data.error);
        setError(validationError);
        return false;
      }
      setError(null);
      return true;
    },
  }));

  const handleChange = (e: CheckboxChangeEvent) => {
    let selectedCategories = [...selected];

    if (e.checked) {
      selectedCategories.push(e.value);
    } else {
      selectedCategories = selectedCategories.filter(
        (category) => category.key !== e.value.key
      );
    }
    setSelected(selectedCategories);

    if (data.validation?.required) {
      if (selectedCategories.length === 0) {
        setError(validateRequired("", data.error));
      } else {
        setError(null);
      }
    }

    // Call the onChange handler if provided
    if (data.onChange) {
      data.onChange(selectedCategories);
    }
  };

  const handleBlur = () => {
    if (data.validation?.required && selected.length === 0) {
      setError(validateRequired("", data.error));
    }
  };

  const inputContainerClassName = `${
    _.get(data, "position") === PositionType.VERTICAL
      ? "flex-grow-1"
      : "w-100 mb-2"
  }`;
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

  return (
    <div className="form-group">
      <div className={containerClassName}>
        <div className={labelContainerClassName}>
          <label>
            {_.get(data, "title.icon") && (
              <i className={`bi ${_.get(data, "title.icon")} me-2`}></i>
            )}
            {data.title.text}
            {_.get(data, "validation.required") && (
              <span className="text-danger"> *</span>
            )}
          </label>
        </div>
        <div className={inputContainerClassName}>
          {data.options.map((category) => {
            return (
              <div
                key={_.get(category, "key")}
                className={inputContainerClassName}
              >
                <Checkbox
                  inputId={_.get(category, "key")}
                  name="category"
                  value={category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  checked={selected.some(
                    (item: { key: string }) =>
                      _.get(item, "key") === _.get(category, "key")
                  )}
                  disabled={_.get(category, "disabled")}
                  className={error ? "is-invalid" : ""}
                />
                <label htmlFor={_.get(category, "key")} className="ms-2">
                  {_.get(category, "label")}
                </label>
              </div>
            );
          })}
          {error && error.position === Errposition.BELOW && (
            <div className="text-danger mt-1">
              {_.get(error, "message.required") ||
                _.get(error, "message.type_check") ||
                _.get(error, "message.reg_exp")}
            </div>
          )}
          {error && error.position === Errposition.RIGHT && (
            <div className="text-danger ms-2">
              {_.get(error, "message.required") ||
                _.get(error, "message.type_check") ||
                _.get(error, "message.reg_exp")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default CheckBox;
