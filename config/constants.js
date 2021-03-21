"use strict";

/**
 * @module
 * @name Constants
 * @description - All hardcoded constant values are included in this object
 */

/**
 * @namespace Constants
 * 
 * @property {Object} APP_STATES - Defines various states for our app
 * @property {String} APP_STATES.START - app State : Start the app
 * @property {String} APP_STATES.DISPLAY - app State : Display the word definition, antonym, synonym
 * @property {String} APP_STATES.PLAY - app State : Prompt the user to play the app
 * @property {String} APP_STATES.QUIT - app State : Quit the app
 * @property {String} APP_STATES.CHOICE - app State : Prompt the user for choices
 * @property {String} APP_STATES.HINT - app State : Provide hint to the user
 * @property {String} APP_STATES.MENU - app State : Create the dataset at random
 */
const Constants = Object.freeze({
    APP_STATES : {
        START : "start",
        MAIN_MENU : "mainMenu",
        CREATE_USER: "createUser",
        LOGIN : "login",
        SEND : "send",
        POLL : "poll",
        CHAT : "chat",
        SELECT_FRIEND: "selectFriend",
        QUIT : "quit",
        ERROR : "error",
    },

    POLL : {
        DURATION : 1000
    },

    AUTH : {
        SESSION_TOKEN : undefined,
        USERNAME : undefined
    }
});

module.exports = Constants;