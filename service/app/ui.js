"use strict";

const readline = require("readline");
const EventEmitter = require("events");
const L = require("../../lib").logger;
const constants = require("../../config").constants;
const AuthApi = require("../api").auth;
const MessagingApi = require("../api").messaging;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const rlQuestionPromisified = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

/**
 * @module
 * @name UI
 * @description - Module which contains console client's user interface.
 */

/**
 * @class
 */
class AppState extends EventEmitter {
  constructor(...args) {
    super(...args);
  }
}

/**
 * @class
 */
class Ui {
  constructor() {
    this.appState = new AppState();
  }

  render() {
    let promise = new Promise((resolve, reject) => {
      this.appState
        .on(constants.APP_STATES.START, async () => {
          await this._gracefulErrorHandler(this._start.bind(this));
        })
        .on(constants.APP_STATES.MAIN_MENU, async () => {
          await this._gracefulErrorHandler(this._mainMenu.bind(this));
        })
        .on(constants.APP_STATES.CREATE_USER, async () => {
          await this._gracefulErrorHandler(this._create.bind(this));
        })
        .on(constants.APP_STATES.LOGIN, async () => {
          await this._gracefulErrorHandler(this._login.bind(this));
        })
        .on(constants.APP_STATES.SELECT_FRIEND, async () => {
          await this._gracefulErrorHandler(this._selectFriend.bind(this));
        })
        .on(constants.APP_STATES.CHAT, async (friendName) => {
          await this._gracefulErrorHandler(this._chat.bind(this, friendName));
        })
        .on(constants.APP_STATES.SEND, async (message, friendName) => {
          await this._gracefulErrorHandler(
            this._send.bind(this, message, friendName)
          );
        })
        .on(constants.APP_STATES.POLL, async (friendName) => {
          await this._gracefulErrorHandler(this._poll.bind(this, friendName));
        })
        .on(constants.APP_STATES.QUIT, resolve)
        .on(constants.APP_STATES.ERROR, reject);
    });

    this.appState.emit(constants.APP_STATES.START);
    return promise;
  }

  async _start() {
    console.clear();
    L.info(`\n---------------- CHAT APP ----------------\n`);
    await rlQuestionPromisified(`\n\nWelcome to chat app console client.`);
    L.info(`\nLoading data... Please wait for a few seconds\n`);
    return this.appState.emit(constants.APP_STATES.MAIN_MENU);
  }

  async _mainMenu() {
    console.clear();
    L.info(
      `------------------------MAIN MENU-----------------------------------\n`
    );
    L.info(`1 : Register\n2 : Login\n3 : Quit`);
    const choice = await rlQuestionPromisified(
      `Select an option to proceed : `
    );
    L.info(``);

    switch (choice) {
      case "1":
        return this.appState.emit(constants.APP_STATES.CREATE_USER);
      case "2":
        return this.appState.emit(constants.APP_STATES.LOGIN);
      case "3":
        return this.appState.emit(constants.APP_STATES.QUIT);
      default:
        L.info(`Incorrect choice : ${choice}. Please try again!\n`);
        return this.appState.emit(constants.APP_STATES.MAIN_MENU);
    }
  }

  async _create() {
    console.clear();
    L.info(
      `---------------------------CREATE USER-------------------------------\n`
    );
    const userName = await rlQuestionPromisified(`Enter user name : `);
    const password = await rlQuestionPromisified(`Enter password : `);
    const yn = await rlQuestionPromisified(
      `\nName : ${userName}, Pass : ****.\nPress 'y' to confirm, any other key to re-enter : `
    );
    switch (yn) {
      case "y":
        try {
          const message = await AuthApi.createUser(userName, password);
          L.info(`\n${message}\n`);
        } catch (err) {
          L.info(
            `\nError occurred while creating user : ${
              (err && err.error) || err
            }\n`
          );
        }
        await rlQuestionPromisified("Press any key to continue....");
        return this.appState.emit(constants.APP_STATES.MAIN_MENU);
      default:
        return this.appState.emit(constants.APP_STATES.CREATE_USER);
    }
  }

  async _login() {
    console.clear();
    L.info(
      `-------------------------LOGIN----------------------------------\n`
    );
    const userName = await rlQuestionPromisified(`Enter user name : `);
    const password = await rlQuestionPromisified(`Enter password : `);
    const yn = await rlQuestionPromisified(
      `Name : ${userName}, Pass : ****.\nPress 'y' to confirm, any other key to re-enter : `
    );
    switch (yn) {
      case "y":
        try {
          const message = await AuthApi.loginUser(userName, password);
          L.info(`${message}\n`);
          return this.appState.emit(constants.APP_STATES.SELECT_FRIEND);
        } catch (err) {
          L.info(
            `Error occurred while logging in user : ${
              (err && err.error) || err
            }`
          );
          await rlQuestionPromisified("Press any key to continue....");
          return this.appState.emit(constants.APP_STATES.MAIN_MENU);
        }
        break;
      default:
        return this.appState.emit(constants.APP_STATES.LOGIN);
    }
  }

  async _selectFriend() {
    console.clear();
    L.info(
      `-------------------------FRIEND MENU----------------------------------\n`
    );
    const friendName = await rlQuestionPromisified(
      `Enter name of user you want to chat with : `
    );

    try {
      await AuthApi.checkUserExists(friendName);
      await rlQuestionPromisified(
        `You are now chatting with ${friendName}....\n\nPress enter to continue....`
      );
      console.clear();
      this.appState.emit(constants.APP_STATES.POLL, friendName);
      this.appState.emit(constants.APP_STATES.CHAT, friendName);
    } catch (err) {
      await rlQuestionPromisified(
        `User : ${friendName} does not exist. Press enter to continue.....`
      );
      return this.appState.emit(constants.APP_STATES.SELECT_FRIEND);
    }
  }

  async _chat(friendName) {
    const message = await rlQuestionPromisified(`You : `);
    this.appState.emit(constants.APP_STATES.SEND, message, friendName);
  }

  async _send(message, friendName) {
    try {
      await MessagingApi.sendMessage(message, friendName);
    } catch (err) {
      L.info(
        `Error occurred while sending message : ${(err && err.error) || err}`
      );
    }
    return this.appState.emit(constants.APP_STATES.CHAT, friendName);
  }

  async _poll(friendName) {
    setInterval(async () => {
      const messages = await MessagingApi.poll();

      for(let m of messages) {
        if(m.sentFrom === friendName) {
            L.info(`\n${friendName} : ${m.message}`);
        }
      }

      if(messages.filter(m => (m.sentFrom === friendName)).length > 0) {
        this.appState.emit(constants.APP_STATES.CHAT, friendName);
      }
    }, constants.POLL.DURATION);
  }

  async _gracefulErrorHandler(promiseFunc, ...args) {
    try {
      if (typeof promiseFunc !== "function") {
        throw new TypeError(`Provided function is not of valid type`);
      }

      return await promiseFunc(...args);
    } catch (err) {
      return this.appState.emit(constants.APP_STATES.ERROR, err);
    }
  }
}

/**
 * @class
 */
class AppUi {
  static async start() {
    try {
      let ui = new Ui();
      await ui.render();
    } catch (err) {
      throw err;
    }
  }
}

module.exports = AppUi;
