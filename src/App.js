import React from "react";
import Artyom from "artyom.js";
import { getCatFact } from "./static/catfact";
import { getDogFact } from "./static/dogfact";
import { getJoke } from "./static/jokesIndex";
import { Table, Jumbotron } from "reactstrap";
import simpleReplies from "./simpleReplies";
const Thursday = new Artyom();

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      artyomActive: false,
      artyomIsReading: false,
      screentext: "",
      isBulbOn: true,
      status: "mic is off",
      recognizedText: ""
    };
  }

  startAssistant = () => {
    Thursday.initialize({
      lang: "en-US",
      debug: true,
      continuous: true,
      soundex: true,
      listen: true
    })
      .then(() => {
        Thursday.say("i am listening now...");

        this.setState({
          artyomActive: true,
          status: "mic is on",
          screentext: "i am listening now..."
        });
        Thursday.addCommands([
          {
            indexes: ["hear me"],
            action: () => {
              Thursday.redirectRecognizedTextOutput((recognized, isFinal) => {
                this.setState({ recognizedText: recognized });
              });
              Thursday.say("Yes, loud and clear");
              this.setState({
                screentext: "Yes, loud and clear"
              });
            }
          },

          {
            indexes: [
              "cat fact",
              "fact about cats",
              "facts about cats",
              "about cats"
            ],
            action: () => {
              const catfact = getCatFact();
              Thursday.say(catfact);
              this.setState({ screentext: catfact });
            }
          },
          {
            indexes: [
              "dog fact",
              "fact about dogs",
              "facts about dogs",
              "about dogs"
            ],
            action: () => {
              const dogfact = getDogFact();
              Thursday.say(dogfact);
              this.setState({ screentext: dogfact });
            }
          },
          {
            indexes: ["joke", "funny"],
            action: () => {
              const joke = getJoke();
              Thursday.say(joke.setup);
              this.setState({ screentext: joke.setup });
              setTimeout(() => {
                Thursday.say(joke.punchline);
                this.setState({ screentext: joke.punchline });
              }, 5000);
            }
          },

          {
            indexes: ["turn off"],
            action: () => {
              Thursday.say("turning the lights off now");
              this.setState({ isBulbOn: false });
              this.setState({ screentext: "turning the lights off now" });
            }
          },
          {
            indexes: ["turn on "],
            action: () => {
              Thursday.say("turning the lights on now");
              this.setState({ isBulbOn: true });
              this.setState({ screentext: "turning the lights on now" });
            }
          },
          {
            indexes: ["repeat after me"],
            action: () => {
              Thursday.say("ok i'll repeat what you say");
              this.setState({ screentext: "ok i'll repeat what you say" });
              setTimeout(() => {
                Thursday.say(this.state.recognizedText);
                this.setState({ screentext: this.state.recognizedText });
              }, 15000);
            }
          },

          {
            indexes: ["alone"],
            action: () => {
              Thursday.say("i'll stop listening now.");
              this.setState({
                artyomActive: false,
                status: "mic is off",
                screentext: "I'll stop listening now."
              });
              Thursday.fatality();
            }
          },
          {
            indexes: [this.state.recognizedText],
            action: () => {
              const search = simpleReplies.find(a =>
                a.command.find(a => a === this.state.recognizedText)
              );
              if (!search) {
                Thursday.say("sorry, I didn't get that");
                this.setState({
                  screentext: "sorry, I didn't get that"
                });
              } else {
                const reply = search.reply;
                Thursday.say(reply);
                this.setState({
                  screentext: reply
                });
              }
            }
          }
        ]);
      })
      .catch(err => {
        console.error("Oopsy daisy, this shouldn't happen !", err);
      });
  };

  render() {
    const {
      isBulbOn,
      artyomActive,
      status,
      screentext,
      recognizedText
    } = this.state;
    const { startAssistant } = this;
    return (
      <React.Fragment>
        <Jumbotron dark>
          {artyomActive ? (
            <h1>Say 'leave me alone!' to stop listening</h1>
          ) : (
            <h1>Click the microphone to begin!</h1>
          )}
          <hr />
          <i
            className={`fa-10x fas ${
              artyomActive
                ? "fa-microphone"
                : "fa-microphone-slash animated pulse infinite"
            } tc pointer blue grow-large`}
            disabled={artyomActive}
            onClick={startAssistant}
          />
        </Jumbotron>

        <Table dark className="tl f3">
          <tbody>
            <tr>
              <td>Current Status:</td>
              <td>{status}</td>
            </tr>
            <tr>
              <td>Recognized Speech:</td>
              <td>"{recognizedText}"</td>
            </tr>
            <tr>
              <td>Replies:</td>
              <td>"{screentext}"</td>
            </tr>
          </tbody>
        </Table>
        <img
          src={isBulbOn ? "img/bulb-on.png" : "img/bulb-off.png"}
          alt=""
          width="200"
        />
        <img src="img/fan.gif" alt="" />
      </React.Fragment>
    );
  }
}

export default App;
