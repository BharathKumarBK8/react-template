import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TABLE_DATA,
  TABLE_RESPONSE_MODEL,
  TABLE_COLUMN,
  TABLE_COLUMN_TYPE,
} from "../../../common/components/Table/Model";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { getData, deleteData } from "../../../api/dataAPI";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import {
  renderCell,
  filterByKeyOrLabel,
  filterDatetime,
} from "../../../common/components/Table/Helper";
import "./Table.css";
import { ToastRef, ToastSeverity } from "../../../common/components/Toast";
import {
  ERROR_MESSAGES,
  TOAST_SUMMARIES,
  TABLE_DEFAULT_STYLES,
} from "../../../common/utilities/constants";

interface FilterElement {
  value: string | null;
  matchMode: FilterMatchMode;
}

interface TableFilters {
  [key: string]: FilterElement;
}

const Table = forwardRef<any, TABLE_DATA>((props, ref) => {
  const toastRef = useRef<ToastRef>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef<Toast>(null);
  const [tableData, setTableData] = useState<TABLE_RESPONSE_MODEL[]>([]);
  const [recordOffset, setRecordOffset] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(8);
  const [filters, setFilters] = useState<TableFilters>({});
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const showToast = (
    title: string,
    detail?: string,
    severity?: ToastSeverity
  ) => {
    toastRef.current?.show(title, detail, severity);
  };

const exportToExcel = () => {
  if (!tableData.length || !props.options?.columns) return;
  
  const headers = props.options.columns.map(col => col.label).join(",");
  const rows = tableData.map(row => 
    props.options!.columns!.map(col => row[col.name] || "").join(",")
  ).join("\n");
  
  const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
  
  // Use table title or a default name
  const filename = props.options?.title?.text 
    ? `${props.options.title.text.replace(/\s+/g, '-')}.csv`
    : "table-export.csv";
  
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", filename);
  link.click();
};


  useImperativeHandle(ref, () => ({
    exportToExcel
  }));

  useEffect(() => {
    if (props.data?.url) {
      getData(props.data?.url)
        .then((data) => {
          console.log("Data Fetched:", data);
          if (data && Array.isArray(data)) {
            setTableData(data);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          showToast(
            TOAST_SUMMARIES.ERROR,
            ERROR_MESSAGES.FETCH_FAILED,
            ToastSeverity.ERROR
          );
        });
    }

    // Initialize filters based on column configuration
    if (props.options?.columns) {
      const initialFilters: TableFilters = {};
      props.options.columns.forEach((col: TABLE_COLUMN) => {
        if (col.showFilter) {
          initialFilters[col.name] = {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          };
        }
      });
      setFilters(initialFilters);
    }
  }, [props.data?.url, props.options?.columns]);

  const onPageChange = (event: { first: number; rows: number }) => {
    setRecordOffset(event.first);
    setRowsPerPage(event.rows);
  };

  const getUniqueValues = (
    column: TABLE_COLUMN,
    data: TABLE_RESPONSE_MODEL[]
  ) => {
    if (!data || !data.length) return [];

    const uniqueValues = Array.from(
      new Set(
        data
          .map((item) => item[column.name])
          .filter((value) => value != null && value !== "")
      )
    ).sort();

    return uniqueValues.map((value) => ({
      label: String(value),
      value: value,
    }));
  };

  const getDropdownOptions = (column: TABLE_COLUMN) => {
    if (column.filter?.dropdownData && column.filter.dropdownData.length > 0) {
      const options = column.filter.dropdownData.map((value) => ({
        label: String(value),
        value: value,
      }));
      return options;
    }
    const options = getUniqueValues(column, tableData);
    return options;
  };

  const renderColumnFilter = (options: ColumnFilterElementTemplateOptions) => {
    // Get the column name from the field property
    const columnName = options.field;

    // Find the column definition from props
    const column = props.options?.columns?.find(
      (col) => col.name === columnName
    );

    if (!column || !column.showFilter) return null;

    if (column.type === TABLE_COLUMN_TYPE.DATETIME) {
      return (
        <InputText
          className="column-filter"
          value={filters[column.name]?.value || ""}
          onChange={(e) => {
            const value = e.target.value;
            const updatedFilters: TableFilters = { ...filters };
            updatedFilters[column.name] = {
              value: value,
              matchMode: FilterMatchMode.CONTAINS,
            };
            setFilters(updatedFilters);
            options.filterApplyCallback(value);
          }}
          placeholder={`Search date (dd/mm/yyyy)`}
          style={mergedSearchInputStyle}
        />
      );
    }

    if (column.filter?.showDropdown) {
      const options = getDropdownOptions(column);

      return (
        <Dropdown
          value={filters[column.name]?.value || null}
          options={options}
          onChange={(e) => {
            const value = e.value;
            const updatedFilters: TableFilters = { ...filters };
            updatedFilters[column.name] = {
              value: value,
              matchMode: FilterMatchMode.EQUALS,
            };
            setFilters(updatedFilters);
          }}
          placeholder={`Select`}
          className="column-filter"
          showClear
          style={mergedDropdownStyle}
        />
      );
    }

    return (
      <InputText
        className="column-filter"
        value={filters[column.name]?.value || ""}
        onChange={(e) => {
          const value = e.target.value;
          const updatedFilters: TableFilters = { ...filters };
          updatedFilters[column.name] = {
            value: value,
            matchMode: FilterMatchMode.CONTAINS,
          };
          setFilters(updatedFilters);

          options.filterApplyCallback(value);
        }}
        placeholder={`Search`}
        style={mergedSearchInputStyle}
      />
    );
  };

  const getFilterFunction = (column: TABLE_COLUMN) => {
    if (column.type === TABLE_COLUMN_TYPE.ARRAY) {
      return filterByKeyOrLabel;
    }
    if (column.type === TABLE_COLUMN_TYPE.DATETIME) {
      return filterDatetime;
    }
    return undefined; // Use default PrimeReact filtering for other column types
  };
  
  const hasFilterableColumns = () => {
    if (!props.options?.columns) return false;
    return props.options.columns.some(
      (col: TABLE_COLUMN) => col.showFilter === true
    );
  };

  const mergedHeaderStyle = {
    ...TABLE_DEFAULT_STYLES.header,
    ...(props.options?.style?.header || {}),
  };

  const mergedHeaderCellStyle = {
    ...TABLE_DEFAULT_STYLES.headerCell,
    ...(props.options?.style?.headerCell || {}),
  };

  const mergedPaginatorStyle = {
    ...TABLE_DEFAULT_STYLES.paginator,
    ...(props.options?.style?.paginator || {}),
  };

  // Merge default table style with custom style from props
  const mergedTableStyle = {
    ...TABLE_DEFAULT_STYLES.table,
    ...(props.options?.style?.table || {}),
  };

  // Merge default search input style with custom style
  const mergedSearchInputStyle = {
    ...TABLE_DEFAULT_STYLES.searchInput,
    ...(props.options?.style?.searchInput || {}),
  };

  // Merge default dropdown style with custom style
  const mergedDropdownStyle = {
    ...TABLE_DEFAULT_STYLES.dropdown,
    ...(props.options?.style?.dropdown || {}),
  };

  const mergedBodyCellStyle = {
    ...TABLE_DEFAULT_STYLES.bodyCell,
    ...(props.options?.style?.bodyCell || {}),
  };
  
  const renderSearch = () => {
    return (
      <div className="table-header">
        <span className="search-box">
          <InputText
            type="search"
            onInput={(e) =>
              setGlobalFilter((e.target as HTMLInputElement).value)
            }
            placeholder="Global Search"
            className="global-search"
            style={mergedSearchInputStyle}
          />
        </span>
      </div>
    );
  };

  const onView = (rowData: TABLE_RESPONSE_MODEL) => {
    try {
      navigate(`${location.pathname}/${rowData.id}/view`, {
        state: { rowData, returnUrl: location.pathname, id: rowData.id },
      });
    } catch (error) {
      showToast(
        TOAST_SUMMARIES.ERROR,
        ERROR_MESSAGES.NAVIGATION_FAILD,
        ToastSeverity.ERROR
      );
    }
  };

  const onEdit = (rowData: TABLE_RESPONSE_MODEL) => {
    try {
      console.log("Edit clicked for row:", rowData);
      console.log("id", rowData.id);

      // Add setTimeout before navigation
      navigate(`${location.pathname}/${rowData.id}/edit`, {
        state: { rowData, returnUrl: location.pathname, id: rowData.id },
      });
    } catch (error) {
      showToast(
        TOAST_SUMMARIES.ERROR,
        ERROR_MESSAGES.NAVIGATION_FAILD,
        ToastSeverity.ERROR
      );
    }
  };

  const onDelete = async (rowData: TABLE_RESPONSE_MODEL) => {
    try {
      if (window.confirm("Are you sure you want to delete this record?")) {
        if (props.data?.url && rowData.id) {
          const deleteUrl = `${props.data.url}/${rowData.id}`;
          await deleteData(deleteUrl);

          setTableData(tableData.filter((item) => item.id !== rowData.id));
        } else {
          showToast(
            TOAST_SUMMARIES.ERROR,
            ERROR_MESSAGES.NO_NAVIGATION_URL,
            ToastSeverity.ERROR
          );
        }
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const actionBodyTemplate = (rowData: TABLE_RESPONSE_MODEL) => {
    const actions = props.options?.actions || {};

    // If no actions are configured or actions.show is false, don't render any buttons
    if (!actions || !actions.buttons || !actions.buttons.length) return null;

    return (
      <div className="action-buttons">
        {actions.buttons.includes("view") && (
          <Button
            label="View"
            className="view-action"
            onClick={() => onView(rowData)}
          />
        )}
        {actions.buttons.includes("edit") && (
          <Button
            label="Edit"
            className="edit-action"
            onClick={() => onEdit(rowData)}
          />
        )}
        {actions.buttons.includes("delete") && (
          <Button
            label="Delete"
            className="delete-action"
            onClick={() => onDelete(rowData)}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <div className="table-card">
        <div className="table-body">
          <DataTable
            value={tableData}
            paginator
            rows={rowsPerPage}
            first={recordOffset}
            onPage={onPageChange}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            sortMode="single"
            removableSort
            responsiveLayout="scroll"
            className="custom-datatable"
            style={mergedTableStyle}
            globalFilter={globalFilter}
            filters={filters}
            onFilter={(e) => {
              setFilters(e.filters as TableFilters);
            }}
            filterDisplay={hasFilterableColumns() ? "row" : "menu"}
            showGridlines
            header={renderSearch()}
          >
            {props.options?.columns?.map((col: TABLE_COLUMN, index) => (
              <Column
                key={index}
                field={col.name}
                header={col.label}
                sortable={col.showSort ?? false}
                body={(rowData) => renderCell(col, rowData[col.name])}
                headerClassName="custom-header"
                headerStyle={mergedHeaderStyle}
                className="custom-column"
                style={mergedBodyCellStyle}
                filter={col.showFilter ?? false}
                showFilterMenu={col.filter?.showMenu ?? false}
                filterElement={renderColumnFilter}
                filterPlaceholder={`Search ${col.label}`}
                filterFunction={getFilterFunction(col)}
              />
            ))}
            {props.options?.actions && (
              <Column
                header={props.options.actions.header}
                body={actionBodyTemplate}
                style={mergedBodyCellStyle}
                headerStyle={mergedHeaderStyle}
                className="custom-column"
                headerClassName="custom-header"
              />
            )}
          </DataTable>
        </div>
      </div>
    </>
  );
});

export default Table;
