"use strict";

const BaseClient = require('../baseClient');
const chatAppClientConfig = require('../../../config').chatAppClient;

/**
 * @class
 * @extends BaseClient
 */
class Messaging extends BaseClient {
    /**
     * 
     * Constructor for our Messaging class. This class is meant to call messaging apis for chat app backend server. It expects following parameters :
     * 
     * @param {Object} [options = {}] - Following are supported and may be passed as options :
     * 
     * @param {...any} [options.args] - Any arguments which needs to be passed as options to the parent class' constructor. For more details, refer to parent class' documentation.
     *
     * @see BaseClient
     */
    constructor({
        ...args //jshint ignore:line
    } = {}) {
        super({
            ENDPOINT : chatAppClientConfig.HTTP_OPTS.HOST,
            TIMEOUT : chatAppClientConfig.HTTP_OPTS.TIMEOUT,
            CLIENT_NAME : "MESSAGING-CLIENT",
            LOGTAG : "[service/client/chatAppClient/messaging]",
            ...args //jshint ignore:line
        });
    }

    /**
     * Function which calls the send api.
     * 
     * @returns {Promise.<Object|Error>} Returns a promise which either resolves to the required 
     * response body or rejects with the corresponding error.
     */
    async send(userName, message, friendName, sessionToken) {
        return super.with('/messaging/send', {
            method : 'POST',
            body : {
                userName,
                message,
                friendName,
                sessionToken
            },
            json : true,
        });
    }

    /**
     * Function which calls the poll api.
     * 
     * @param {String} word - Word whose definition needs to be fetched
     * 
     * @returns {Promise.<Object|Error>} Returns a promise which either resolves to the required 
     * response body or rejects with the corresponding error.
     */
    async poll(userName, sessionToken) {
        return super.with(`/messaging/${userName}/poll`, {
            method : 'GET',
            json : true,
            headers : {
                'session-token' : sessionToken
            }
        });
    }
}

module.exports = Messaging;