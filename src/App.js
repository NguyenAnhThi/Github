import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { TabList, Tab } from "./Tabs";

const { clientId } = require("./env.json");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [],
      token: null
    };
  }

  componentWillMount() {
    const existingToken = sessionStorage.getItem("token");
    const accessToken =
      window.location.search.split("=")[0] === "?code"
        ? window.location.search.split("=")[1]
        : null;

    if (!accessToken && !existingToken) {
      window.location.replace(
        `https://github.com/login/oauth/authorize?scope=user:email,repo&client_id=${
          clientId
        }`
      );
    }

    if (accessToken) {
      console.log(`New accessToken: ${accessToken}`);

      sessionStorage.setItem("token", accessToken);
      this.setState({
        token: accessToken
      });
    }

    if (existingToken) {
      this.setState({
        token: existingToken
      });
    }
  }

  componentDidMount() {
    console.log(this.state.token);
    fetch(`https://api.github.com/user/repos?access_token=${this.state.token}`)
      .then(data => data.json())
      .then(json => console.log(json));

    this.setState({
      tabs: [
        ["a", ["A1", "A2", "A3"]],
        ["b", ["B1", "B2", "B3"]],
        ["c", ["C1", "C2", "c3"]]
      ]
    });
  }

  render() {
    const tabs = this.state.tabs.map(t => {
      const [k, h] = t;
      const inner = h.map(k2 => {
        return (
          <Tab name={k2} key={k2}>
            <h1>{k2}</h1>
          </Tab>
        );
      });

      return (
        <Tab name={k} key={k}>
          <TabList vertical key={k}>
            {inner}
          </TabList>
        </Tab>
      );
    });
    return (
      <TabList horizontal key="root">
        {tabs}
      </TabList>
    );
  }
}

export default App;
