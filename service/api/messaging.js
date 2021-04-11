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
            const encryptedUserName = cryptUtils.encryptString(constants.AUTH.USERNAME);
            const encryptedFriendName = cryptUtils.encryptString(friendName);
            const encryptedMessage = cryptUtils.encryptString(message);
            await messagingClient.send(encryptedUserName, encryptedMessage, encryptedFriendName, constants.AUTH.SESSION_TOKEN);
        } catch (err) {
            throw err;
        }
    }

    static async poll() {
        let messages = [];
        try {
            const encryptedUserName = cryptUtils.encryptString(constants.AUTH.USERNAME);
            const encryptedMessages = await messagingClient.poll(encryptedUserName, constants.AUTH.SESSION_TOKEN);
            for(let em of encryptedMessages) {
                em.message = cryptUtils.decryptString(em.message);
                em.sentFrom = cryptUtils.decryptString(em.sentFrom);
                messages.push(em);
            }
        } catch (err) {
            L.error(err);
        }

        return messages;
    }
}

module.exports = Auth;