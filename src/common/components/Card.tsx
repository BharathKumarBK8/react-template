import React, { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { CARD_DATA } from "../../models/pageModel";

function Card(props: CARD_DATA) {
  const defaultStyles = {
    card: {
      border: "1px solid black",
      borderRadius: "20px 0px",
      overflow: "hidden",
    },
    cardBody: {
      padding: "15px",
      display: "flex",
      flexDirection: "column" as "column",
      height: "100%",
    },
    title: {
      fontWeight: "bold",
      fontSize: "25px",
      color: "#333",
      marginBottom: "10px",
      justifyItems: "center",
    },
    description: {
      fontSize: "14px",
      whiteSpace: "pre-wrap",
      marginBottom: "10px",
    },
    image: {
      maxWidth: "100%",
      maxHeight: "100%",
      height: "auto",
      display: "block",
      marginBottom: "10px",
      objectFit: "contain" as "contain",
    },
    button: {
      padding: "8px 16px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-block",
      alignSelf: "flex-start",
    },
    contentWrapper: {
      display: "flex",
      flexDirection: "row" as "row",
      alignItems: "flex-start",
      gap: "15px",
      flex: 1,
      overflow: "hidden",
    },
    textContent: {
      flex: "1",
    },
    imageWrapper: {
      flex: "1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      maxHeight: "100%",
    },
  };

  const styles = {
    card: { ...defaultStyles.card, ...props.styles?.card },
    image: { ...defaultStyles.image, ...props.styles?.image },
    cardBody: { ...defaultStyles.cardBody, ...props.styles?.cardBody },
    title: { ...defaultStyles.title, ...props.styles?.title },
    description: { ...defaultStyles.description, ...props.styles?.description },
    button: { ...defaultStyles.button, ...props.styles?.button },
    contentWrapper: defaultStyles.contentWrapper,
    textContent: defaultStyles.textContent,
    imageWrapper: defaultStyles.imageWrapper,
  };

  const renderButton = () => {
    if (!props.button) return null;

    if (props.button.link) {
      return (
        <Link to={props.button.link} style={styles.button}>
          {props.button.text}
        </Link>
      );
    }

    return (
      <button onClick={props.button.onClick} style={styles.button}>
        {props.button.text}
      </button>
    );
  };

  const renderContent = () => {
    // If there's no image or no position specified, render the default layout
    if (!props.image || !props.image.position) {
      return (
        <>
          <Link
            to={props.title.click}
            className="card-body-title"
            style={styles.title}
          >
            {props.title.text}
          </Link>

          {props.description && (
            <div style={styles.description}>{props.description}</div>
          )}

          {props.image && (
            <img
              src={props.image.src}
              alt={props.image.alt || props.title.text}
              style={styles.image}
            />
          )}
          {renderButton()}
        </>
      );
    }

    // If position is specified, use a flex layout
    const flexDirection =
      props.image.position === "left" ? "row" : "row-reverse";
    return (
      <>
        <Link
          to={props.title.click}
          className="card-body-title"
          style={styles.title}
        >
          {props.title.text}
        </Link>

        <div style={{ ...styles.contentWrapper, flexDirection }}>
          <div style={styles.imageWrapper}>
            <img
              src={props.image.src}
              alt={props.image.alt || props.title.text}
              style={styles.image}
            />
          </div>

          <div style={styles.textContent}>
            {props.description && (
              <div style={styles.description}>{props.description}</div>
            )}
            {renderButton()}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="card" style={styles.card}>
      <div className="card-body" style={styles.cardBody}>
        {renderContent()}
      </div>
    </div>
  );
}

export default Card;
