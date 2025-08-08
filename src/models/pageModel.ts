// models/pageModel.ts
import { PIE_DATA } from "../common/components/Pie";
import { TABLE_DATA } from "../common/components/Table/Model";
import { TEXTBOX_DATA } from "../common/components/Formcontrols/TextBox";
import { FORM_DROPDOWN_DATA } from "../common/components/Formcontrols/DropDown";
import { RADIO_BUTTON_DATA } from "../common/components/Formcontrols/Radiobutton";
import { CHECK_BOX_DATA } from "../common/components/Formcontrols/CheckBox";
import { BUTTON_DATA } from "../common/components/Formcontrols/Buttons";
import { DATE_TIME_DATA } from "../common/components/Formcontrols/Datetime";
import { IMAGE_UPLOAD_DATA } from "../common/components/Formcontrols/ImageUpload";
import { IMAGE_DATA } from "../common/components/Image";

export interface PageModel {
  title?: string;
  buttons?: BUTTON_MODEL[];
  rowLayouts?: LayoutRowNew[];
  columnLayouts?: LayoutRowNew[];
  containerSizes?: {
    xl: number;
    lg: number;
    md: number;
    sm: number;
  };
}
export interface LayoutRowNew {
  columns: LayoutColumn[];
}

export interface LayoutColumn {
  size: {
    xl: number;
    lg: number;
    md: number;
    sm: number;
  };
  elements: COLUMNS[];
}

export interface BUTTON_MODEL {
  id: string;
  name?: string;
  type: BUTTON_TYPE;
  text?: string;
  icon?: string;
  style: BUTTON_STYLE;
  data?: DROPDOWN_DATA[];
  path?: string;
  modes?: string[];
  onClick?: () => void;
}

enum BUTTON_TYPE {
  BUTTON = "button",
  DROPDOWN = "dropdown",
}

interface BUTTON_STYLE {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  boxShadow: string;
  gradient: string;
}

interface DROPDOWN_DATA {
  text?: string;
  icon?: string;
}

export interface COLUMNS {
  type: DATA_DISPLAY_TYPE;
  name: string;
  content:
    | TEXTBOX_DATA
    | TABLE_DATA
    | LINE_DATA
    | BAR_DATA
    | PIE_DATA
    | CARD_WITH_LINE_DATA
    | CARD_DATA
    | FORM_DATA
    | FORM_DROPDOWN_DATA
    | RADIO_BUTTON_DATA
    | CHECK_BOX_DATA
    | BUTTON_DATA
    | DATE_TIME_DATA
    | IMAGE_DATA
    | IMAGE_UPLOAD_DATA;
}

export enum DATA_DISPLAY_TYPE {
  TABLE = "table",
  PIE = "pie",
  LINE = "line",
  BAR = "bar",
  CARD_WITH_LINE = "card_with_line",
  CARD = "card",
  FORM = "form",
  TEXTBOX_DATA = "textbox",
  FORM_DROPDOWN_DATA = "dropdown",
  RADIO_BUTTON_DATA = "radiobutton",
  CHECK_BOX_DATA = "checkbox",
  SEARCH_DATA = "search",
  BUTTON_DATA = "buttons",
  DATE_TIME_DATA = "datetime",
  IMAGE = "image",
  IMAGE_UPLOAD = "imageupload",
}

export interface FORM_DATA {
  fields: Array<{ 
    type: string;
    content: any;
    size: {
      xl: number;
      lg: number;
      md: number;
      sm: number;
    };
  }>;
  formApi: {
    getUrl?: string;
    postUrl?: string;
    updateUrl?: string;
  };
}

export interface LINE_DATA {
  title: string;
  columns: string[];
}

export interface BAR_DATA {
  title: {
    text: string;
    icon?: string;
    click: string;
  };
  columns: string[];
}

export interface CARD_WITH_LINE_DATA {
  id: string;
  options?: {
    title: {
      text: string;
      icon?: string;
      click: string;
    };
    chart: {
      displayLegend: boolean;
    };
    chartStyles?: {
      borderDash?: number[];
      tension?: number;
      borderColor?: string;
      borderWidth?: number;
      pointStyle?: boolean;
      secondaryBorderColor?: string;
      secondaryBorderWidth?: number;
      secondaryPointStyle?: boolean;
      aspectRatio?: number;
      tooltipEnabled?: boolean;
    };
    styles?: {
      card?: React.CSSProperties;
      cardBody?: React.CSSProperties;
      title?: React.CSSProperties;
      value?: React.CSSProperties;
      percentage?: React.CSSProperties;
      valueSection?: React.CSSProperties;
      chartSection?: React.CSSProperties;
    };
    bgcolor: string[];
  };
  data?: {
    apiUrl?: string;
    chart: CWL_API_RESPONSE_MODEL;
  };
}

export interface CWL_API_RESPONSE_MODEL {
  value?: string;
  percentage?: string;
  data: number[];
}

export interface CARD_DATA {
  title: {
    text: string;
    icon?: string;
    click: string;
  };
  description?: string;
  styles?: {
    card?: React.CSSProperties;
    cardBody?: React.CSSProperties;
    title?: React.CSSProperties;
    description?: React.CSSProperties;
    image?: React.CSSProperties;
    button?: React.CSSProperties;
  };
  image?: {
    src: string;
    alt?: string;
    position?: "left" | "right";
  };
  button?: {
    text: string;
    onClick?: () => void;
    link?: string;
  };
}

export const ValidationType = {
  required: "required",
  type_check: "type_check",
  reg_exp: "reg_exp",
};

export enum InputType {
  TEXT = "text",
  NUMBER = "number",
  EMAIL = "email",
  PASSWORD = "password",
  TEL = "tel",
  URL = "url",
  DATETIME = "datetime",
  DESCRIPTION = "description",
  MASK = "mask",
  INPUTTOGGLE = "inputtoggle",
}

export enum PositionType {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}
export enum Errposition {
  BELOW = "below",
  RIGHT = "right",
}

export interface ErrorModel {
  message: {
    required?: string;
    type_check?: string;
    reg_exp?: string;
  };
  position: Errposition;
}
