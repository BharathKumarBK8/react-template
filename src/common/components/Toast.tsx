import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { Toast } from "primereact/toast";

export enum ToastSeverity {
  SUCCESS = "success",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface ToastRef {
  show: (
    title: string,
    detail?: string,
    severity?: ToastSeverity, // title , detail, severity, life
    life?: number
  ) => void;
  clear: () => void;
}

const ToastComponent = forwardRef<ToastRef>((_, ref) => {
  const toast = useRef<Toast>(null);

  useImperativeHandle(ref, () => ({
    show: (
      title: string,
      detail?: string,
      severity?: ToastSeverity,
      life: number = 3000
    ) => {
      toast.current?.show({
        summary: title,
        detail,
        severity,
        life,
      });
    },
    clear: () => {
      toast.current?.clear();
    },
  }));

  return <Toast ref={toast} position="top-right" />;
});

export default ToastComponent;
