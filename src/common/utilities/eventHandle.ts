import { BUTTON_MODEL } from "../../models/pageModel";
import { NavigateFunction } from "react-router-dom";
import { ComponentRefsMap } from "../../common/components/PageRenderer";
import { Toast } from "primereact/toast";
import {
  TOAST_SUMMARIES,
  SUCCESS_MESSAGES,
} from "../../common/utilities/constants";
import { getData } from "../../api/dataAPI";

export enum EVENT_TYPE {
  FORM_SAVE = "form_save",
  FORM_CLEAR = "form_clear",
  NAVIGATE = "navigate",
}

const getPushConfigData = async () => {
  try {
    const response = await getData("pushconfig-data");
    const hostURL = response.appData.data.hostURL;
    const path = response.appData.data.Path;
    return { hostURL, path };
  } catch (error) {
    console.error("Error fetching push config data:", error);
    throw error;
  }
};

const saveToExternalData = async (
  hostURL: string,
  path: string,
  toast: React.RefObject<Toast> | null,
  targetdataurl: string
) => {
  try {
    const completeUrl = `${hostURL}${path}`; // Ensure path has no leading slash issue

    // Fetch data from targetUrl
    const fetchedData = await getData(targetdataurl);

    const dataToSave = {
      data: fetchedData,
    };

    // Directly POST the data
    const response = await fetch(completeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSave),
    });

    if (!response.ok) {
      const errorText = `Failed to save data: ${response.status}`;
      console.error(errorText);
      toast?.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorText,
        life: 3000,
      });
      throw new Error(errorText);
    }

    const result = await response.json();
    toast?.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Data Pushed successfully",
      life: 3000,
    });
    return result;
  } catch (error) {
    console.error("Error in saveToExternalData:", error);
    toast?.current?.show({
      severity: "error",
      summary: "Error",
      detail: "Failed to save data to external server",
      life: 3000,
    });
    throw error;
  }
};

const handleEvents = async (
  item: BUTTON_MODEL,
  navigate: NavigateFunction,
  compRefs: React.MutableRefObject<ComponentRefsMap>,
  toast: React.RefObject<Toast> | null,
  tableUrl: string
): Promise<boolean> => {
  for (const Key of Object.keys(compRefs.current)) {
    const compRef = compRefs.current[Key];

    if (compRef) {
      if (item.id === EVENT_TYPE.FORM_SAVE) {
        const success = await compRef.submitForm();
        if (success && item.path) {
          toast?.current?.show({
            severity: "success",
            summary: TOAST_SUMMARIES.SUCCESS,
            detail: SUCCESS_MESSAGES.FORM_SUBMITTED,
          });
          navigate(item.path);
        }
        return success;
      }
      if (item.id === EVENT_TYPE.FORM_CLEAR) {
        compRef.clearForm();
        return true;
      }
    }
  }
  if (item.id === EVENT_TYPE.NAVIGATE && item.path) {
    navigate(item.path);
    return true;
  }
  if (item.id === "pushconfig") {
    try {
      const configData = await getPushConfigData();
      const saveResponse = await saveToExternalData(
        configData.hostURL,
        configData.path,
        toast,
        tableUrl
      );
    } catch (error) {
      // Handle any errors and show error message using toast
      if (toast?.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch configuration data",
          life: 3000,
        });
      }
      console.error("Error fetching push config data:", error);
    }
  }

  return false;
};

export default handleEvents;
