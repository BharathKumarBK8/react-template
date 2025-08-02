import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "../../app/App.css";

interface DialogBoxProps {
  visible: boolean;
  onHide: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
  showClose?: boolean;
  closable?: boolean;
  closeOnEscape?: boolean;
  position?:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
}

const DialogBox: React.FC<DialogBoxProps> = ({
  visible,
  onHide,
  title,
  children,
  footer,
  width = "50vw",
  showClose = true,
  closable = true,
  closeOnEscape = true,
  position = "center",
}) => {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={title}
      footer={footer}
      style={{ width }}
      showHeader={!!title}
      closable={showClose}
      closeOnEscape={closeOnEscape}
      position={position}
      className="custom-dialog"
    >
      {children}
    </Dialog>
  );
};

export default DialogBox;
