// Helper.tsx
export const formatDate = (
  value: any,
  format: string = "dd/MM/yyyy"
): string => {
  if (!value) return "";

  try {
    const date = typeof value === "string" ? new Date(value) : value;

    if (isNaN(date.getTime())) {
      return String(value); // Return original value if it's not a valid date
    }

    // Extract date components
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Helper to pad with leading zeros
    const pad = (num: number): string => num.toString().padStart(2, "0");

    // Replace format tokens with actual values
    let result = format;

    // Year
    result = result.replace("yyyy", year.toString());
    result = result.replace("yy", year.toString().slice(-2));

    // Month
    result = result.replace("MM", pad(month));
    result = result.replace(/\bM\b/, month.toString());

    // Day
    result = result.replace("dd", pad(day));
    result = result.replace(/\bd\b/, day.toString());

    // Hours
    result = result.replace("HH", pad(hours));
    result = result.replace(/\bH\b/, hours.toString());

    // 12-hour format
    const hours12 = hours % 12 || 12;
    result = result.replace("hh", pad(hours12));
    result = result.replace(/\bh\b/, hours12.toString());

    // AM/PM
    result = result.replace("a", hours < 12 ? "am" : "pm");
    result = result.replace("A", hours < 12 ? "AM" : "PM");

    // Minutes
    result = result.replace("mm", pad(minutes));
    result = result.replace(/\bm\b/, minutes.toString());

    // Seconds
    result = result.replace("ss", pad(seconds));
    result = result.replace(/\bs\b/, seconds.toString());

    return result;
  } catch (e) {
    console.error("Error formatting date:", e);
    return String(value);
  }
};
export const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "status-tag status-success";
    case "pending":
      return "status-tag status-warning";
    case "failed":
      return "status-tag status-danger";
    case "fulfilled":
      return "status-tag status-success";
    case "processing":
      return "status-tag status-info";
    case "in progress":
      return "status-tag status-in progress";
    case "cancelled":
      return "status-tag status-danger";
    default:
      return "status-tag";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bi bi-square-fill";
    case "pending":
      return "bi bi-clock-fill";
    case "failed":
      return "bi bi-x-circle-fill";
    case "fulfilled":
      return "bi bi-box-seam-fill";
    case "in progress":
      return "bi bi-slash-square";
    case "processing":
      return "bi bi-arrow-repeat";
    case "cancelled":
      return "bi bi-slash-circle-fill";
    default:
      return "";
  }
};

export const filterByKeyOrLabel = (value: any, filter: string): boolean => {
  if (!filter || filter === "") return true;
  if (!value) return false;

  // If value is an array of objects with label property
  if (Array.isArray(value)) {
    return value.some((item) => {
      if (item && typeof item === "object" && "label" in item) {
        return String(item.label).toLowerCase().includes(filter.toLowerCase());
      }
      return false;
    });
  }

  // If value is a string (key), try to match it directly
  if (typeof value === "string") {
    return value.toLowerCase().includes(filter.toLowerCase());
  }

  return false;
};

export const filterDatetime = (value: any, filter: string): boolean => {
  if (!filter || filter === "") return true;
  if (!value) return false;

  try {
    // Convert both the cell value and filter value to Date objects
    const cellDate = new Date(value);

    // If the cell doesn't contain a valid date, use default string filtering
    if (isNaN(cellDate.getTime())) {
      return String(value).toLowerCase().includes(filter.toLowerCase());
    }

    // Format the cell date to a string for comparison
    const formattedCellDate = formatDate(cellDate);

    // Check if the formatted date contains the filter text
    return formattedCellDate.toLowerCase().includes(filter.toLowerCase());
  } catch (e) {
    console.error("Error filtering date:", e);
    return false;
  }
};

// In Helper.tsx - update the renderCell function
export const renderCell = (column: any, value: any) => {
  if (!value) return "";

  if (column.type === "array") {
    // Case 1: Array of objects with key/label properties
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      value[0] !== null &&
      typeof value[0] === "object" &&
      value[0] !== null &&
      "label" in value[0]
    ) {
      return (
        <div className="array-cell">
          {value.map((item, index) => (
            <span key={index} className="array-item">
              {item.label}
              {index < value.length - 1 && ","}
            </span>
          ))}
        </div>
      );
    }
    // Case 2: Array of string keys
    else if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "string"
    ) {
      return (
        <div className="array-cell">
          {value.map((key, index) => (
            <span key={index} className="array-item">
              {key}
              {index < value.length - 1 && ","}
            </span>
          ))}
        </div>
      );
    }
    // Case 3: Single string key
    else if (typeof value === "string") {
      return (
        <div className="array-cell">
          <span className="array-item">{value}</span>
        </div>
      );
    }
  }

  if (column.type === "status") {
    return (
      <span className={getStatusClass(value)}>
        <i className={getStatusIcon(value)}></i>
        <span className="status-text">{value}</span>
      </span>
    );
  }

  if (column.type === "date" || column.type === "datetime") {
    return (
      <span className="date-column">
        {formatDate(
          value,
          column.dataFormat ||
            (column.type === "datetime" ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy")
        )}
      </span>
    );
  }
  return value;
};

export const renderIcons = (iconProp: string | string[] | undefined) => {
  if (!iconProp) return null;

  if (Array.isArray(iconProp)) {
    return iconProp.map((icon, iconIndex) => (
      <i key={iconIndex} className={icon}></i>
    ));
  }
  return <i className={iconProp}></i>;
};
