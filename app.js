const appUi = require('./service').app.ui;

(async function() {
    try {
        await appUi.start();
        process.exit(0);
    } catch(err) {
        process.exit(1);
    }
}())