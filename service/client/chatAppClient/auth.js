"use strict";

const BaseClient = require('../baseClient');
const chatAppClientConfig = require('../../../config').chatAppClient;

/**
 * @class
 * @extends BaseClient
 */
class Auth extends BaseClient {
    /**
     * 
     * Constructor for our Auth class. This class is meant to call auth apis for chat app backend server. It expects following parameters :
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
            CLIENT_NAME : "AUTH-CLIENT",
            LOGTAG : "[service/client/chatAppClient/auth]",
            ...args //jshint ignore:line
        });
    }

    /**
     * Function which calls the create user api.
     * 
     * @param {String} userName - User Name
     * @param {String} password - password 
     * 
     * @returns {Promise.<Object|Error>} Returns a promise which either resolves to the required 
     * response body or rejects with the corresponding error.
     */
    async createUser(userName, password) {
        return super.with('/auth/user/create', {
            method : 'POST',
            body : {
                name : userName,
                password
            },
            json : true,
        });
    }

    /**
     * Function which calls the login api.
     * 
     * @param {String} userName - User Name
     * @param {String} password - password 
     * 
     * @returns {Promise.<Object|Error>} Returns a promise which either resolves to the required 
     * response body or rejects with the corresponding error.
     */
    async login(userName, password) {
        return super.with('/auth/user/login', {
            method : 'POST',
            body : {
                name : userName,
                password
            },
            json : true,
        });
    }

    /**
     * Function which calls the logout api.
     * 
     * @param {String} userName - User Name
     * @param {String} sessionToken - Session Token 
     * 
     * @returns {Promise.<Object|Error>} Returns a promise which either resolves to the required 
     * response body or rejects with the corresponding error.
     */
    async logout(userName, sessionToken) {
        return super.with('/auth/user/logout', {
            method : 'POST',
            body : {
                name : userName,
                sessionToken
            },
            json : true,
        });
    }

    /**
     * Function which calls the check user exists api.
     * 
     * @param {String} word - Word whose examples needs to be fetched
     * 
     * @returns {Promise.<Object|Error>} Returns a promise which either resolves to the required 
     * response body or rejects with the corresponding error.
     */
     async checkUserExists(userName) {
        return super.with(`/auth/user/${userName}/exists`, {
            method : 'GET',
            json : true,
        });
    }
}

module.exports = Auth;