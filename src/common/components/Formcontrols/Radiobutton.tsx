import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import _ from "lodash";
import {
  ValidationType,
  PositionType,
  ErrorModel,
  Errposition,
} from "../../../models/pageModel";
import { FormFieldRef } from "./FormRenderer";
import { validateRequired } from "../../utilities/validation";

export interface RADIO_BUTTON_DATA {
  title: {
    text: string;
    icon?: string;
    click: string;
  };
  options: Category[];
  label: string;
  value: string;
  position?: PositionType;
  validation?: Partial<typeof ValidationType>;
  error?: ErrorModel;
  name?: string;
  disabled?: boolean;
}

export interface Category {
  label: string;
  key: string;
}

export interface RadioButtonProps {
  data: RADIO_BUTTON_DATA;
}

const Radiobutton = forwardRef<FormFieldRef, RadioButtonProps>(
  ({ data }, ref) => {
    const [selected, setSelected] = useState<Category[] | null>(null);
    const [error, setError] = useState<ErrorModel | null>(null);

    // Initialize with pre-existing values if available
    useEffect(() => {
      if (data.value) {
        // If value is already an array of Category objects
        if (Array.isArray(data.value) && data.value.length > 0) {
          setSelected(data.value);
        }
        // If value is a string (key)
        else if (typeof data.value === "string") {
          const category = data.options.find((opt) => opt.key === data.value);
          if (category) {
            setSelected([category]);
          }
        }
      }
    }, [data.value, data.options]);

    // Expose methods to parent component using useImperativeHandle
    useImperativeHandle(ref, () => ({
      getValue: () => {
        // Return only the key for storage
        return Array.isArray(selected) && selected.length > 0
          ? selected[0].key
          : null;
      }, // Return only the key
      setValue: (value: any) => {
        if (Array.isArray(value)) {
          setSelected(value);
        } else if (typeof value === "string") {
          // Handle string value (key)
          const category = data.options.find((opt) => opt.key === value);
          if (category) {
            setSelected([category]);
          }
        }
      },
      validate: () => {
        const validationError = validateRequired(
          Array.isArray(selected) ? selected[0]?.key : "",
          data.error
        );
        setError(validationError);
        return validationError === null;
      },
      reset: () => {
        setSelected(null);
        setError(null);
      },
    }));

    const handleChange = (e: RadioButtonChangeEvent) => {
      const newValue = e.value;

      setSelected([newValue]);

      if (error) {
        const validationError = validateRequired(newValue.key, data.error);
        setError(validationError);
      }
    };

    const handleBlur = () => {
      setError(
        validateRequired(
          Array.isArray(selected) ? selected[0]?.key : "",
          data.error
        )
      );
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
      <div className="form-group">
        <div className={containerClassName}>
          <div className={labelContainerClassName}>
            {_.get(data, "title.icon") && (
              <i className={`bi ${_.get(data, "title.icon")} me-2`}></i>
            )}
            <label>{_.get(data, "title.text")}</label>
            {_.get(data, `validation.includes`, ValidationType.required) && (
              <span className="text-danger ms-1">*</span>
            )}
          </div>
          <div className={inputContainerClassName}>
            {data.options.map((category) => {
              return (
                <div
                  key={category.key}
                  className="d-flex align-items-center mb-2"
                >
                  <RadioButton
                    inputId={category.key}
                    name={data.name}
                    value={category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    checked={selected?.some(
                      (item) => item.key === category.key
                    )}
                    disabled={data.disabled}
                    className={error ? "is-invalid" : ""}
                  />
                  <label htmlFor={category.key} className="ms-2">
                    {category.label}
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
  }
);

export default Radiobutton;
