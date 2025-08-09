// components/PageRenderer.tsx
import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PageModel,
  CARD_DATA,
  CARD_WITH_LINE_DATA,
  BAR_DATA,
  DATA_DISPLAY_TYPE,
  FORM_DATA,
  BUTTON_MODEL,
  COLUMNS,
  LayoutRowNew,
  LayoutColumn,
} from "../../models/pageModel";
import FormRenderer from "./Formcontrols/FormRenderer";
import Bar from "../components/Bar";
import Card from "../components/Card";
import CardWithLine from "../components/CardWithLine";
import Pie, { PIE_DATA } from "../components/Pie";
import { TABLE_DATA } from "../components/Table/Model";
import Table from "../components/Table/Table";
import handleEvents from "../utilities/eventHandle";
import { Toast } from "primereact/toast";
import Image, { IMAGE_DATA } from "../components/Image";

export interface ComponentRendererRef {
  submitForm: () => Promise<boolean>;
  clearForm: () => void;
  exportToExcel: () => void;
}

export interface ComponentRefsMap {
  [key: string]: ComponentRendererRef | null;
}

function PageRenderer(config: PageModel) {
  const compRefs = useRef<ComponentRefsMap>({});
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "";

  const currentMode = location.pathname.includes('/view') ? 'view' 
  : location.pathname.includes('/edit') ? 'edit' 
  : location.pathname.includes('/add') ? 'add' 
  : 'list';

const filteredButtons = config?.buttons?.filter(button => 
  !button.modes || button.modes.includes(currentMode)
) || [];


  const getTableDataUrl = () => {
    const allColumns: COLUMNS[] = [];

    config.rowLayouts?.forEach((row) =>
      row.columns.forEach((col) => {
        col.elements.forEach((elements) => allColumns.push(elements));
      })
    );

    config.columnLayouts?.forEach((row) =>
      row.columns.forEach((col) => {
        col.elements.forEach((elements) => allColumns.push(elements));
      })
    );

    const tableColumn = allColumns.find(
      (column) => column.type === DATA_DISPLAY_TYPE.TABLE
    );

    return (tableColumn?.content as TABLE_DATA)?.data?.url || "";
  };

  const defaultButtonStyle = () => ({
    background: "#303030 linear-gradient(#303030 70%, #484848)",
    color: "#fff",
    border: "1px solid #484848",
    boxShadow: "0 1px 0 1px #000, 0 -1px 0 0px #000",
  });

  const buttonStyle = (customStyle?: any) => {
    const defaultStyle = defaultButtonStyle();
    return customStyle ? { ...defaultStyle, ...customStyle } : defaultStyle;
  };

  const handleBack = () => navigate(-1);

  const handleButtonClick = async (item: BUTTON_MODEL) => {
    const tableUrls = getTableDataUrl();
    handleEvents(item, navigate, compRefs, toast, tableUrls);
  };

  const renderComponent = (item: COLUMNS) => {
    switch (item.type) {
      case DATA_DISPLAY_TYPE.CARD_WITH_LINE:
        return <CardWithLine {...(item.content as CARD_WITH_LINE_DATA)} />;
      case DATA_DISPLAY_TYPE.CARD:
        return <Card {...(item.content as CARD_DATA)} />;
      case DATA_DISPLAY_TYPE.TABLE:
        return (
                <Table 
                ref={(el) => {
                if (item.name) compRefs.current[item.name] = el;
                    }}
                {...(item.content as TABLE_DATA)} 
                />
                );
      case DATA_DISPLAY_TYPE.PIE:
        return <Pie {...(item.content as PIE_DATA)} />;
      case DATA_DISPLAY_TYPE.IMAGE:
        return <Image {...(item.content as IMAGE_DATA)} />;
      case DATA_DISPLAY_TYPE.BAR:
        return <Bar {...(item.content as BAR_DATA)} />;
      case DATA_DISPLAY_TYPE.FORM:
        return (
          <FormRenderer
            ref={(el) => {
              if (item.name) compRefs.current[item.name] = el;
            }}
            {...(item.content as FORM_DATA)}
          />
        );
      default:
        return null;
    }
  };

  const renderLayout = (layout: LayoutRowNew[], layoutType: string) => {
    return (
      layout?.map((row, rowIndex) => (
        <div key={`${layoutType}-row-${rowIndex}`} className="row mb-3">
          {row.columns.map((column, colIndex) => (
            <div
              key={`${layoutType}-col-${rowIndex}-${colIndex}`}
              className={`col-sm-${column.size.sm} col-md-${column.size.md} col-lg-${column.size.lg} col-xl-${column.size.xl} mb-3`}
            >
              {column.elements.map((component, compIndex) => (
                <div key={`component-${compIndex}`} className="mb-3">
                  {renderComponent(component)}
                </div>
              ))}
            </div>
          ))}
        </div>
      )) || null
    );
  };

  return (
    <div id="main_page" className="container-fluid">
      <Toast ref={toast} position="top-right" />
      <div className="d-flex align-middle justify-content-between">
        <div className="main_head">
          {!isHomePage && (
            <i
              className="bi bi-arrow-left me-3"
              style={{
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "20px",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "grey")}
              onMouseOut={(e) => (e.currentTarget.style.color = "")}
              onClick={handleBack}
            ></i>
          )}
          {config?.title}
        </div>
        <div className="btn_group">
          {filteredButtons?.map((item, index) => (
            <button
              key={index}
              className="btn"
              onClick={() => handleButtonClick(item)}
              style={buttonStyle(item.style)}
            >
              {item.text || <i className={"bi " + item.icon}></i>}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {renderLayout(config.rowLayouts || [], "row")}
        {renderLayout(config.columnLayouts || [], "column")}
      </div>
    </div>
  );
}

export default PageRenderer;
