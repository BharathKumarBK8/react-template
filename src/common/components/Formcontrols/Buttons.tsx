import react from "react";
import _ from "lodash";
import { Button } from "primereact/button";

export interface BUTTON_DATA {
  title: {
    text: string;
    icon?: string;
    click: string;
  };
  label?: string;
  icon?: string;
  iconPos?: IconPostionType;
  size?: string;
  badge?: string;
  outlined?: boolean;
  severity?: string;
  text?: boolean;
  raised?: boolean;
  rounded?: boolean;
  disable?: boolean;
  loading?: boolean;
  buttonPos?: PositionTypes;
  onClick?: () => void;
}
export interface Category {
  label: string;
  key: string;
}

export enum PositionTypes {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

export enum IconPostionType {
  TOP = "top",
  BOTTOM = "bottom",
  LEFT = "left",
  RIGHT = "right",
}

function Buttons(props: BUTTON_DATA) {
  const inputContainerClassName = `${
    _.get(props, "buttonPos") === PositionTypes.VERTICAL
      ? "flex-grow-1"
      : "w-100"
  }`;
  const containerClassName = `form-group ${
    _.get(props, "buttonPos") === PositionTypes.VERTICAL
      ? "d-flex align-items-center"
      : ""
  }`;

  const labelContainerClassName = `${
    _.get(props, "buttonPos") === PositionTypes.VERTICAL
      ? "d-inline-flex align-items-center me-2"
      : "mb-2 d-block"
  }`;

  return (
    <div className={containerClassName}>
      <div className={labelContainerClassName}>
        {_.get(props, "title.icon") && (
          <i className={`bi ${_.get(props, "title.icon")} me-2`}></i>
        )}
        <label>{_.get(props, "title.text")}</label>
      </div>
      <div className={inputContainerClassName}>
        <Button
          className={`p-button_${_.get(props, "label")}`}
          label={_.get(props, "label")}
          icon={_.get(props, "icon")}
          iconPos={_.get(props, "iconPos", "left")}
          onClick={_.get(props, "onClick")}
          raised={_.get(props, "raised}")}
          rounded={_.get(props, "raised}")}
          loading={_.get(props, "loading")}
          outlined={_.get(props, "outline")}
        />
      </div>
    </div>
  );
}

export default Buttons;
