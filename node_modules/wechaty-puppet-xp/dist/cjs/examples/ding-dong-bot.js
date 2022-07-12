"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mod_js_1 = require("../src/mod.js");
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
/**
 *
 * 1. Declare your Bot!
 *
 */
const puppet = new mod_js_1.PuppetXp();
/**
 *
 * 2. Register event handlers for Bot
 *
 */
puppet
    .on('logout', onLogout)
    .on('login', onLogin)
    .on('scan', onScan)
    .on('error', onError)
    .on('message', onMessage);
/**
 *
 * 3. Start the bot!
 *
 */
puppet.start()
    .catch(async (e) => {
    console.error('Bot start() fail:', e);
    await puppet.stop();
    process.exit(-1);
});
/**
 *
 * 4. You are all set. ;-]
 *
 */
/**
 *
 * 5. Define Event Handler Functions for:
 *  `scan`, `login`, `logout`, `error`, and `message`
 *
 */
function onScan(payload) {
    if (payload.qrcode) {
        const qrcodeImageUrl = [
            'https://wechaty.js.org/qrcode/',
            encodeURIComponent(payload.qrcode),
        ].join('');
        console.info('StarterBot', 'onScan: %s(%s) - %s', payload.status, qrcodeImageUrl);
        qrcode_terminal_1.default.generate(payload.qrcode, { small: true }); // show qrcode on console
        console.info(`[${payload.status}] ${payload.qrcode}\nScan QR Code above to log in: `);
    }
    else {
        console.info(`[${payload.status}]`);
    }
}
function onLogin(payload) {
    console.info(`${payload.contactId} login`);
}
function onLogout(payload) {
    console.info(`${payload.contactId} logouted`);
}
function onError(payload) {
    console.error('Bot error:', payload.data);
    /*
    if (bot.logonoff()) {
      bot.say('Wechaty error: ' + e.message).catch(console.error)
    }
    */
}
/**
 *
 * 6. The most important handler is for:
 *    dealing with Messages.
 *
 */
async function onMessage({ messageId, }) {
    const { talkerId, roomId, text, } = await puppet.messagePayload(messageId);
    if (/ding/i.test(text || '')) {
        await puppet.messageSendText(roomId || talkerId, 'dong');
    }
}
/**
 *
 * 7. Output the Welcome Message
 *
 */
const welcome = `
Puppet Version: ${puppet.version()}

Please wait... I'm trying to login in...

`;
console.info(welcome);
//# sourceMappingURL=ding-dong-bot.js.map