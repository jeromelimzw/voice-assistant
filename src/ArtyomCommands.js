export default class ArtyomCommandsManager {
  constructor(ArtyomInstance) {
    this._artyom = ArtyomInstance;
  }

  loadCommands = () => {
    let Artyom = this._artyom;

    return Artyom.addCommands([
      {
        indexes: ["Hello", "Hi", "Hey There"],
        action: () => {
          console.log("Howdy Stranger!");
        }
      },
      {
        indexes: [/How are you/, /Regular expressions supported/],
        smart: true,
        action: () => {
          console.log("I'm fine, thanks for asking !");
        }
      },
      {
        indexes: ["left"],
        action: () => {
          console.log(`moving left `);
        }
      },
      {
        indexes: ["right", "lights", "light", "like"],
        action: () => {
          console.log(`moving right `);
        }
      },
      {
        indexes: ["up"],
        action: () => {
          console.log(`moving up `);
        }
      }
    ]);
  };
}
