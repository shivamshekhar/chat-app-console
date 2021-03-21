"use strict";

const constants = require('../../config').constants;
const cryptUtils = require('../../lib').cryptUtils;
const MessagingClient = require('../client').chatAppClient.messaging;
const messagingClient = new MessagingClient();
const L = require('../../lib').logger;
const logtag = '[service/api/auth]';

/**
 * @class
 */
class Auth {
    static async sendMessage(message, friendName) {
        try {
            const encryptedUserName = cryptUtils.encryptUserName(constants.AUTH.USERNAME);
            const encryptedFriendName = cryptUtils.encryptUserName(friendName);
            await messagingClient.send(encryptedUserName, message, encryptedFriendName, constants.AUTH.SESSION_TOKEN);
        } catch (err) {
            throw err;
        }
    }

    static async poll() {
        let messages = [];
        try {
            const encryptedUserName = cryptUtils.encryptUserName(constants.AUTH.USERNAME);
            messages = await messagingClient.poll(encryptedUserName, constants.AUTH.SESSION_TOKEN);
        } catch (err) {
            L.error(err);
        }

        return messages;
    }
}

module.exports = Auth;