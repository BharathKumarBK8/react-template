import React from "react";
import "./App.css";

export function App(props) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const appData = {
      target: "samplepage",
      data: {
        hostURL: formData.get("hostURL"),
        Path: formData.get("path"),
        tokenURL: formData.get("tokenURL"),
        clientID: formData.get("clientID"),
        clientSecret: formData.get("clientSecret"),
        grantType: formData.get("grantType"),
      },
    };

    if (props.onSave) {
      props.onSave(appData);
    } else {
      console.warn("onSave callback is not available");
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="hostURL">Host URL:</label>
          <input type="text" id="hostURL" name="hostURL" defaultValue="" />
        </div>

        <div className="form-group">
          <label htmlFor="path">Path:</label>
          <input type="text" id="path" name="path" defaultValue="" />
        </div>

        <div className="form-group">
          <label htmlFor="tokenURL">Token URL:</label>
          <input type="text" id="tokenURL" name="tokenURL" defaultValue="" />
        </div>

        <div className="form-group">
          <label htmlFor="clientID">Client ID:</label>
          <input type="text" id="clientID" name="clientID" defaultValue="" />
        </div>

        <div className="form-group">
          <label htmlFor="clientSecret">Client Secret:</label>
          <input
            type="password"
            id="clientSecret"
            name="clientSecret"
            defaultValue=""
          />
        </div>

        <div className="form-group">
          <label htmlFor="grantType">Grant Type:</label>
          <input type="text" id="grantType" name="grantType" defaultValue="" />
        </div>
        <div className="form-footer">
          <button type="reset" className="reset-button">
            Clear
          </button>
          <button type="submit" className="submit-button ml-10">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
