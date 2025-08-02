import _ from "lodash";
import { InputType, Errposition, ErrorModel } from "../../models/pageModel";

export const validateRequired = (
  value: string,
  errorModel?: ErrorModel
): ErrorModel | null => {
  const genericRequired = "This field is required.";
  if (!value) {
    return {
      message: {
        required: _.get(errorModel, "message.required", genericRequired),
      },
      position: _.get(errorModel, "position", Errposition.BELOW),
    };
  }
  return null;
};

export const validateTypeCheck = (
  value: string,
  inputType?: InputType,
  errorModel?: ErrorModel
): ErrorModel | null => {
  const genericTypecheck = `Invalid ${inputType} format.`;
  if (inputType === InputType.EMAIL) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      return {
        message: {
          type_check: _.get(errorModel, "message.type_check", genericTypecheck),
        },
        position: _.get(errorModel, "position", Errposition.BELOW),
      };
    }
  }

  if (inputType === InputType.NUMBER) {
    if (isNaN(Number(value))) {
      return {
        message: {
          type_check: _.get(errorModel, "message.type_check", genericTypecheck),
        },
        position: _.get(errorModel, "position", Errposition.BELOW),
      };
    }
  }
  return null;
};

export const validateRegExp = (
  value: string,
  errorModel?: ErrorModel
): ErrorModel | null => {
  const genericRegExp =
    "Invalid format. Only alphanumeric and underscores allowed.";
  if (!/^[a-zA-Z0-9_]*$/.test(value)) {
    return {
      message: {
        reg_exp: _.get(errorModel, "message.reg_exp", genericRegExp),
      },
      position: _.get(errorModel, "position", Errposition.BELOW),
    };
  }
  return null;
};

export const validateInput = (
  value: string,
  validation: Partial<typeof import("../../models/pageModel").ValidationType>,
  inputType?: InputType,
  errorModel?: ErrorModel
): ErrorModel | null => {
  let error: ErrorModel | null = null;

  if (_.get(validation, "required")) {
    error = validateRequired(value, errorModel);
  }

  if (!error && _.get(validation, "type_check")) {
    error = validateTypeCheck(value, inputType, errorModel);
  }

  if (!error && _.get(validation, "reg_exp")) {
    error = validateRegExp(value, errorModel);
  }

  return error;
};
