import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import _ from "lodash";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { FormFieldRef } from "./FormRenderer";
import { validateRequired } from "../../utilities/validation";
import {
  PositionType,
  ValidationType,
  ErrorModel,
  Errposition,
} from "../../../models/pageModel";

export interface FORM_DROPDOWN_DATA {
  title: {
    text: string;
    icon?: string;
    click?: string;
  };
  type: string;
  placeholder?: string;
  options: Array<{ label: string; value: string }>;
  optionLabel?: string;
  disabled?: boolean;
  classname?: string;
  position?: PositionType;
  validation?: Partial<typeof ValidationType>;
  value?: string;
  error?: ErrorModel;
  name?: string;
}

export interface DropDownProps {
  data: FORM_DROPDOWN_DATA;
}

const DropDown = forwardRef<FormFieldRef, DropDownProps>(({ data }, ref) => {
  const [selected, setSelected] = useState("");
  const [error, setError] = useState<ErrorModel | null>(null);

  // Expose methods to parent component using useImperativeHandle
  useImperativeHandle(ref, () => ({
    getValue: () => selected,
    setValue: (value: string) => {
      setSelected(value);
    },
    validate: () => {
      const validationError = validateRequired(selected, data.error);
      setError(validationError);
      return validationError === null;
    },
    reset: () => {
      setSelected("");
      setError(null);
    },
  }));

  useEffect(() => {
    setSelected(data.value || "");
  }, [data.value]);

  const handleChange = (e: DropdownChangeEvent) => {
    const newValue = e.value;
    console.log("Dropdown - Value changing:", {
      name: data.name,
      oldValue: selected,
      newValue: newValue,
    });

    setSelected(newValue);

    if (error) {
      const validationError = validateRequired(newValue, data.error);
      setError(validationError);
    }
  };

  const inputContainerClassName = `${
    _.get(data, "position") === PositionType.VERTICAL ? "flex-grow-1" : "w-100"
  }`;

  const containerClassName = `form-group ${
    _.get(data, "position") === PositionType.VERTICAL
      ? "d-flex align-items-center"
      : ""
  }`;

  const labelContainerClassName = `${
    _.get(data, "position") === PositionType.VERTICAL
      ? "d-inline-flex align-items-center me-2"
      : "d-block"
  }`;

  const handleBlur = () => {
    console.log("Dropdown - Blur event:", {
      name: data.name,
      value: selected,
    });
    setError(validateRequired(selected, data.error));
  };

  return (
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
        <Dropdown
          value={selected}
          onChange={handleChange}
          options={_.get(data, "options")}
          optionLabel={_.get(data, "optionLabel")}
          placeholder={_.get(data, "placeholder")}
          className={`form-control ${error ? "is-invalid" : ""} rm-pd `}
          invalid={error ? true : undefined}
          onBlur={handleBlur}
          disabled={data.disabled}
        />
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
  );
});

export default DropDown;
