"use strict";

const constants = require('../../config').constants;
const cryptUtils = require('../../lib').cryptUtils;
const AuthClient = require('../client').chatAppClient.auth;
const authClient = new AuthClient();
const logtag = '[service/api/auth]';

/**
 * @class
 */
class Auth {
    static async createUser(userName, password) {
        try {
            const encryptedUserName = cryptUtils.encryptUserName(userName);
            const passHash = cryptUtils.convertPasswordToHash(password);
            const response = await authClient.createUser(encryptedUserName, passHash);
            const message = response && response.message || '';
            return message;
        } catch (err) {
            throw err;
        }
    }

    static async loginUser(userName, password) {
        try {
            const encryptedUserName = cryptUtils.encryptUserName(userName);
            const passHash = cryptUtils.convertPasswordToHash(password);
            const response = await authClient.login(encryptedUserName, passHash);
            const message = response && response.message || '';
            console.log(response);
            constants.AUTH.SESSION_TOKEN = response && response.sessionToken || '';
            constants.AUTH.USERNAME = userName;
            return message;
        } catch (err) {
            throw err;
        }
    }

    static async logoutUser(userName) {
        try {
            const encryptedUserName = cryptUtils.encryptUserName(userName);
            const response = await authClient.logout(encryptedUserName, constants.AUTH.SESSION_TOKEN);
            const message = response && response.message || '';
            constants.AUTH.SESSION_TOKEN = undefined;
            constants.AUTH.USERNAME = undefined;
            return message;
        } catch (err) {
            throw err;
        }
    }

    static async checkUserExists(userName) {
        try {
            const encryptedUserName = cryptUtils.encryptUserName(userName);
            await authClient.checkUserExists(encryptedUserName);
        } catch(err) {
            throw err;
        }
    }
}

module.exports = Auth;