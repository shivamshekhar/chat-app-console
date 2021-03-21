const CHAT_APP_CLIENT_CONFIG = {
    HTTP_OPTS : {
        HOST : process.env.CHAT_APP_CLIENT_HOST || 'http://localhost:3000',
        TIMEOUT : 5000
    }
};

module.exports = CHAT_APP_CLIENT_CONFIG;