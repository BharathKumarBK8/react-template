import React from "react";

export enum TABLE_COLUMN_TYPE {
  TEXT = "text",
  NUMBER = "number",
  DATETIME = "datetime",
  STATUS = "status",
  CURRENCY = "currency",
  ARRAY = "array",
}

export interface TABLE_COLUMN {
  type: TABLE_COLUMN_TYPE;
  label: string;
  name: string;
  showSort?: boolean;
  showFilter?: boolean;
  filter?: TABLE_FILTER;
  dataFormat?: string;
}

export interface TABLE_FILTER {
  showMenu: boolean;
  showDropdown: boolean;
  dropdownData: string[];
  useDataFormat?: boolean;
}

export interface TABLE_DATA {
  id: string;
  options?: {
    title?: {
      text?: string;
      icon?: string;
      click?: string;
    };
    columns: TABLE_COLUMN[];
    style?: {
      table?: React.CSSProperties;
      searchInput?: React.CSSProperties;
      dropdown?: React.CSSProperties;
      header?: React.CSSProperties;
      headerCell?: React.CSSProperties;
      bodyCell?: React.CSSProperties;
      paginator?: React.CSSProperties;
    };
    actions?: {
      header?: string;
      buttons?: Array<"edit" | "delete">;
    };
  };
  data?: {
    result: TABLE_RESPONSE_MODEL[];
    url?: string;
  };
}

export type TABLE_RESPONSE_MODEL = Record<string, string | number | null>;
