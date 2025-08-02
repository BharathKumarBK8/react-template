import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Calendar } from "primereact/calendar";
import _ from "lodash";
import {
  ValidationType,
  PositionType,
  ErrorModel,
  Errposition,
} from "../../../models/pageModel";
import { FormFieldRef } from "./FormRenderer";
import { validateInput } from "../../utilities/validation";

export interface DATE_TIME_DATA {
  title: {
    text: string;
    icon?: string;
  };
  placeholder?: string;
  value?: Date | string;
  validation?: Partial<typeof ValidationType>;
  disabled?: boolean;
  position?: PositionType;
  error?: ErrorModel;
  name?: string;
  showTime?: boolean;
  timeOnly?: boolean;
  dateFormat?: string;
  showIcon?: boolean;
  showButtonBar?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export interface DateTimeProps {
  data: DATE_TIME_DATA;
}

const DateTime = forwardRef<FormFieldRef, DateTimeProps>(({ data }, ref) => {
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [error, setError] = useState<ErrorModel | null>(null);
  const getDateValueForValidation = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString();
  };
  // Expose methods to parent component using useImperativeHandle
  useImperativeHandle(ref, () => ({
    getValue: () => {
      // If there's no date value, return null or empty string
      if (!dateValue) return null;
      // If it's a time-only picker, return only the time portion
      if (data.timeOnly) {
        return dateValue.toTimeString().split(" ")[0]; // Returns "HH:MM:SS"
      }
      // If it's a date-only picker (no time), return only the date portion
      if (!data.showTime) {
        // Create a new date with the local year, month, and day
        const year = dateValue.getFullYear();
        const month = dateValue.getMonth();
        const day = dateValue.getDate();
        // Format as YYYY-MM-DD to avoid timezone issues
        return `${year}-${String(month + 1).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;
      }

      // If it's a date and time picker, return the full ISO string
      return dateValue;
    },
    // Rest of your code remains the same
    setValue: (value: Date | string) => {
      if (typeof value === "string") {
        setDateValue(new Date(value));
      } else {
        setDateValue(value);
      }
    },
    validate: () => {
      const validationError = validateInput(
        getDateValueForValidation(dateValue),
        data.validation!,
        undefined,
        data.error
      );
      setError(validationError);
      return validationError === null;
    },
    reset: () => {
      setDateValue(null);
      setError(null);
    },
  }));

  useEffect(() => {
    if (data.value) {
      if (typeof data.value === "string") {
        setDateValue(new Date(data.value));
      } else {
        setDateValue(data.value);
      }
    } else {
      setDateValue(null);
    }
  }, [data.value]);

  const handleChange = (e: any) => {
    const newValue = e.value;
    console.log("DateTime - Value changing:", {
      name: data.name,
      oldValue: dateValue,
      newValue: newValue,
    });

    setDateValue(newValue);
    if (error) {
      const validationError = validateInput(
        getDateValueForValidation(newValue),
        data.validation || {},
        undefined,
        data.error
      );
      setError(validationError);
    }
  };

  const handleBlur = () => {
    console.log("DateTime - Blur event:", {
      name: data.name,
      value: dateValue,
    });

    const validationError = validateInput(
      getDateValueForValidation(dateValue),
      data.validation!,
      undefined,
      data.error
    );
    setError(validationError);
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

  return (
    <div className={containerClassName}>
      <div className={labelContainerClassName}>
        {_.get(data, "title.icon") && (
          <i className={`bi ${_.get(data, "title.icon")} me-2`}></i>
        )}

        <label>{data.title.text} </label>
        {_.get(data, "validation.required") && (
          <span className="text-danger"> *</span>
        )}
      </div>
      <div className={inputContainerClassName}>
        <Calendar
          value={dateValue}
          onChange={handleChange}
          onBlur={handleBlur}
          showTime={data.showTime}
          timeOnly={data.timeOnly}
          dateFormat={data.dateFormat || "mm/dd/yy"}
          showIcon={data.showIcon !== false}
          showButtonBar={data.showButtonBar}
          minDate={data.minDate}
          maxDate={data.maxDate}
          placeholder={_.get(data, "placeholder")}
          className={`form-control ${error ? "is-invalid" : ""} clr-black rmpd`}
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

export default DateTime;
