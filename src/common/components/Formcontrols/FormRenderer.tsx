import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";
import TextBox, { TEXTBOX_DATA } from "./TextBox";
import DropDown, { FORM_DROPDOWN_DATA } from "./DropDown";
import Radiobutton, { RADIO_BUTTON_DATA } from "./Radiobutton";
import CheckBox, { CHECK_BOX_DATA } from "./CheckBox";
import Buttons, { BUTTON_DATA } from "./Buttons";
import ImageUpload, { IMAGE_UPLOAD_DATA } from "./ImageUpload";
import { FORM_DATA } from "../../../models/pageModel";
import { postData, updateData, getData } from "../../../api/dataAPI";
import Loader from "../../components/Loader";
import _ from "lodash";
import { ComponentRendererRef } from "../../components/PageRenderer";
import { convertUrlParamsToValues } from "../../utilities/utils";
import { Toast } from "primereact/toast";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  TOAST_SUMMARIES,
} from "../../utilities/constants";
import { ToastRef, ToastSeverity } from "../../components/Toast";
import DateTime, { DATE_TIME_DATA } from "./Datetime";

export interface FormFieldRef {
  getValue: () => any;
  setValue: (value: any) => void;
  validate: () => boolean;
  reset: () => void;
}

interface FieldRefs {
  [key: string]: FormFieldRef | null;
}

const FormRenderer = forwardRef<ComponentRendererRef, FORM_DATA>(
  ({ fields, formApi }, ref) => {
    const toastRef = useRef<ToastRef>(null);
    const location = useLocation();
    const fieldRefs = useRef<FieldRefs>({});
    const toast = useRef<Toast>(null);
    const [formFields, setFormFields] = useState(fields);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const { rowData } = location.state || {};

    const showToast = (
      title: string,
      detail?: string,
      severity?: ToastSeverity
    ) => {
      toastRef.current?.show(title, detail, severity);
    };

    const setFieldValues = (data: Record<string, any>) => {
      Object.keys(fieldRefs.current).forEach((key) => {
        if (data[key] !== undefined && fieldRefs.current[key]?.setValue) {
          const field = formFields.find((field) => field.content.name === key);

          if (field) {
            const fieldType = _.get(field, "content.type");
            if (fieldType === "checkbox" || fieldType === "radiobutton") {
              if (Array.isArray(data[key])) {
                _.invoke(fieldRefs.current[key], "setValue", data[key]);
              }
            }
          } else {
            _.invoke(fieldRefs.current[key], "setValue", data[key]);
          }
        }
      });
    };

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const getUrl = _.get(formApi, "getUrl");

        if (getUrl) {
          const response = await getData(getUrl);

          if (response) {
            setFieldValues(response);
          }
        }
      } catch {
        showToast(
          TOAST_SUMMARIES.ERROR,
          ERROR_MESSAGES.FETCH_FAILED,
          ToastSeverity.ERROR
        );
      } finally {
        setIsLoading(false);
      }
    };

    const validateForm = (): boolean => {
      let isValid = true;
      Object.keys(fieldRefs.current).forEach((key) => {
        if (!_.invoke(fieldRefs.current[key], "validate")) {
          isValid = false;
        }
      });
      return isValid;
    };

    const getFormData = (): Record<string, any> => {
      return formFields.reduce((acc, field) => {
        const fieldName = _.get(field, "content.name");
        const fieldRef = fieldName && fieldRefs.current[fieldName];
        const value = _.invoke(fieldRef, "getValue");
        if (value !== undefined) {
          acc[fieldName] = value;
        }
        return acc;
      }, {} as Record<string, any>);
    };

    const submitForm = async (): Promise<boolean> => {
      try {
        if (!validateForm()) {
          return false;
        }

        setIsLoading(true);
        setError(null);

        const formData = getFormData();
        if (isEditMode) {
          const updateUrl = _.get(formApi, "updateUrl");
          if (updateUrl) {
            const processedUrl = convertUrlParamsToValues(updateUrl, rowData);
            await updateData(processedUrl, formData);
          } else {
            showToast(
              TOAST_SUMMARIES.ERROR,
              ERROR_MESSAGES.NO_UPDATE_URL,
              ToastSeverity.ERROR
            );
          }
        } else {
          const postUrl = _.get(formApi, "postUrl");

          if (postUrl) {
            await postData(postUrl, formData);
            showToast(
              TOAST_SUMMARIES.SUCCESS,
              SUCCESS_MESSAGES.FORM_SUBMITTED,
              ToastSeverity.SUCCESS
            );
          } else {
            showToast(
              TOAST_SUMMARIES.ERROR,
              ERROR_MESSAGES.NO_UPDATE_URL,
              ToastSeverity.ERROR
            );
          }
        }

        return true;
      } catch {
        showToast(
          TOAST_SUMMARIES.ERROR,
          ERROR_MESSAGES.SUBMIT_FAILED,
          ToastSeverity.ERROR
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    };

    const clearForm = () => {
      Object.values(fieldRefs.current).forEach((fieldRef) =>
        _.invoke(fieldRef, "reset")
      );
      setError(null);
    };

    useEffect(() => {
      if (_.get(formApi, "getUrl") && !rowData) {
        fetchData();
      }
    }, []);

    useEffect(() => {
      setIsEditMode(location.pathname.includes("edit"));
    }, [location.pathname]);

    useEffect(() => {
      if (rowData) {
        setFormFields(
          fields.map((field) => {
            if (!field.content?.name) return field;
            const fieldValue = rowData[field.content.name];
            return fieldValue != null
              ? {
                  ...field,
                  content: { ...field.content, value: fieldValue },
                }
              : field;
          })
        );
      }
    }, [rowData]);

    useImperativeHandle(ref, () => ({
      submitForm,
      clearForm,
    }));

    if (isLoading) {
      return (
        <div className="form-loader-overlay">
          <Loader size={50} animationDuration="1.5s" fullScreen={true} />
        </div>
      );
    }

    return (
      <div className="form-container">
        <Toast ref={toast} position="top-right" />
        {error && <div className="error-message">Error: {error}</div>}
        <div className="row row-gap-4">
          {formFields.map((field, index) => (
            <div
              key={index}
              className={`col-xl-${field.size?.xl || 12} col-lg-${
                field.size?.lg || 12
              } col-md-${field.size?.md || 12} col-sm-${field.size?.sm || 12}`}
            >
              {field.type === "textbox" && field.content && (
                <TextBox
                  data={field.content as TEXTBOX_DATA}
                  ref={(el) =>
                    field.content?.name &&
                    (fieldRefs.current[field.content.name] = el)
                  }
                />
              )}
              {field.type === "dropdown" && field.content && (
                <DropDown
                  data={field.content as FORM_DROPDOWN_DATA}
                  ref={(el) =>
                    field.content?.name &&
                    (fieldRefs.current[field.content.name] = el)
                  }
                />
              )}
              {field.type === "radiobutton" && field.content && (
                <Radiobutton
                  data={field.content as RADIO_BUTTON_DATA}
                  ref={(el) =>
                    field.content?.name &&
                    (fieldRefs.current[field.content.name] = el)
                  }
                />
              )}
              {field.type === "checkbox" && field.content && (
                <CheckBox
                  {...(field.content as CHECK_BOX_DATA)}
                  data={field.content as CHECK_BOX_DATA}
                  ref={(el) =>
                    field.content?.name &&
                    (fieldRefs.current[field.content.name] = el)
                  }
                />
              )}
              {field.type === "datetime" && field.content && (
                <DateTime
                  data={field.content as DATE_TIME_DATA}
                  ref={(el) =>
                    field.content?.name &&
                    (fieldRefs.current[field.content.name] = el)
                  }
                />
              )}
              {field.type === "imageupload" && field.content && (
                <ImageUpload
                  data={field.content as IMAGE_UPLOAD_DATA}
                  ref={(el) =>
                    field.content?.name &&
                    (fieldRefs.current[field.content.name] = el)
                  }
                />
              )}
              {field.type === "buttons" && field.content && (
                <Buttons {...(field.content as BUTTON_DATA)} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default FormRenderer;
