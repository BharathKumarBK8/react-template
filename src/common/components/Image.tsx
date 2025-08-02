import React from "react";

export interface IMAGE_DATA {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
}

function Image(props:IMAGE_DATA) {
  return (
    <img
      src={props.src}
      alt={props.alt}
      style={props.style}
    />
  );
};

export default Image;
