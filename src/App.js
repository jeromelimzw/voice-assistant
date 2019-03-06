import React from "react";
import Artyom from "artyom.js";
import ArtyomCommandsManager from "./ArtyomCommands.js";

const Thursday = new Artyom();

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      artyomActive: false,
      textareaValue: "",
      artyomIsReading: false
    };

    let CommandsManager = new ArtyomCommandsManager(Thursday);
    CommandsManager.loadCommands();
  }

  startAssistant = () => {
    let _this = this;

    Thursday.initialize({
      lang: "en-GB",
      debug: true,
      continuous: true,
      soundex: true,
      listen: true
    })
      .then(() => {
        Thursday.say("Hello there, how are you?");

        _this.setState({
          artyomActive: true
        });
      })
      .catch(err => {
        console.error("Oopsy daisy, this shouldn't happen !", err);
      });
  };

  stopAssistant = () => {
    let _this = this;

    Thursday.fatality()
      .then(() => {
        console.log("Jarvis has been succesfully stopped");

        _this.setState({
          artyomActive: false
        });
      })
      .catch(err => {
        console.error("Oopsy daisy, this shouldn't happen neither!", err);

        _this.setState({
          artyomActive: false
        });
      });
  };

  render() {
    return (
      <div>
        <input
          type="button"
          value="Start Artyom"
          disabled={this.state.artyomActive}
          onClick={this.startAssistant}
        />
        <input
          type="button"
          value="Stop Artyom"
          disabled={!this.state.artyomActive}
          onClick={this.stopAssistant}
        />
      </div>
    );
  }
}
