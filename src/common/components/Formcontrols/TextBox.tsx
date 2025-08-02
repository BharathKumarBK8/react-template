import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { InputMask, InputMaskChangeEvent } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import _ from "lodash";
import {
  ValidationType,
  InputType,
  PositionType,
  ErrorModel,
  Errposition,
} from "../../../models/pageModel";
import { FormFieldRef } from "./FormRenderer";
import { validateInput } from "../../utilities/validation";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";

export interface TEXTBOX_DATA {
  title: {
    text: string;
    icon?: string;
  };
  placeholder?: string;
  value?: string | boolean;
  validation?: Partial<typeof ValidationType>;
  inputType?: InputType;
  disabled?: boolean;
  position?: PositionType;
  error?: ErrorModel;
  name?: string;
  mask?: string;
  checked?: string;
}

export interface TextboxProps {
  data: TEXTBOX_DATA;
}

const TextArea = forwardRef<FormFieldRef, TextboxProps>(({ data }, ref) => {
  const [inputValue, setInputValue] = useState<string | boolean>("");
  const [error, setError] = useState<ErrorModel | null>(null);
  const [localKey, setLocalKey] = useState<string>("initial");

  // Expose methods to parent component using useImperativeHandle
  useImperativeHandle(ref, () => ({
    getValue: () => {
      if (data.inputType === "inputtoggle") {
        return inputValue === true ? "yes" : "no";
      }
      return inputValue;
    },
    setValue: (value: string | boolean) => {
      if (data.inputType === "inputtoggle") {
        setInputValue(value === true || value === "yes");
      } else {
        setInputValue(value);
      }
    },
    validate: () => {
      const validationError = validateInput(
        inputValue.toString(),
        data.validation!,
        data.inputType,
        data.error
      );
      setError(validationError);
      return validationError === null;
    },
    reset: () => {
      setInputValue("");
      setError(null);
    },
  }));

  // Initialize and update input value when data.value changes
  useEffect(() => {
    if (data.value !== undefined) {
      if (data.inputType === "inputtoggle") {
        setInputValue(data.value === true || data.value === "yes");
      } else if (data.inputType === "mask" && typeof data.value === "string") {
        setLocalKey(`${data.name}-${Date.now()}`);
        setInputValue(data.value);
      } else {
        setInputValue(data.value);
      }
    }
  }, [data.value, data.inputType]);
  const handleChange = (event: any) => {
    let newValue: string | boolean;

    if (data.inputType === "inputtoggle") {
      newValue = event.value;
    } else if (event.value !== undefined) {
      newValue = event.target.value || "";
    } else {
      newValue = event.target.value;
    }
    setInputValue(newValue);
    updateValue(newValue);
  };

  const updateValue = (newValue: string | boolean) => {
    if (error) {
      const validationError = validateInput(
        newValue.toString(),
        data.validation || {},
        data.inputType,
        data.error
      );
      setError(validationError);
    }
  };

  const handleBlur = () => {
    const validationError = validateInput(
      inputValue.toString(),
      data.validation!,
      data.inputType,
      data.error
    );
    setError(validationError);
  };

  return (
    <div className="form-group">
      <label>
        {data.title.icon && <i className={`bi ${data.title.icon} me-2`}></i>}
        {data.title.text}
        {data.validation?.required && <span className="text-danger"> *</span>}
      </label>

      {data.inputType === "mask" ? (
        <InputMask
          key={localKey}
          mask={data.mask}
          value={typeof inputValue === "string" ? inputValue : ""}
          onChange={(e: InputMaskChangeEvent) => {
            setInputValue(e.value || "");
          }}
          onComplete={(event) => {
            updateValue(event.value || "");
          }}
          onBlur={handleBlur}
          placeholder={data.placeholder}
          className={`form-control ${error ? "is-invalid" : ""}`}
          disabled={data.disabled ?? false}
          unmask={false} // keeps the mask intact
          autoClear={false}
        />
      ) : data.inputType === "inputtoggle" ? (
        <InputSwitch
          checked={inputValue === true}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${error ? "p-invalid" : ""}`}
        />
      ) : data.inputType === "description" ? (
        <InputTextarea
          autoResize
          className={`form-control ${error ? "is-invalid" : ""}`}
          placeholder={data.placeholder}
          value={typeof inputValue === "string" ? inputValue : ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      ) : (
        <InputText
          type={data.inputType ?? "text"}
          className={`form-control ${error ? "is-invalid" : ""}`}
          placeholder={data.placeholder}
          value={typeof inputValue === "string" ? inputValue : ""}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={data.disabled}
        />
      )}

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
  );
});

export default TextArea;
