"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHATIE_OFFICIAL_ACCOUNT_QRCODE = exports.qrCodeForChatie = exports.VERSION = void 0;
const file_box_1 = require("file-box");
const package_json_js_1 = require("./package-json.js");
const VERSION = package_json_js_1.packageJson.version || '0.0.0';
exports.VERSION = VERSION;
const CHATIE_OFFICIAL_ACCOUNT_QRCODE = 'http://weixin.qq.com/r/qymXj7DEO_1ErfTs93y5';
exports.CHATIE_OFFICIAL_ACCOUNT_QRCODE = CHATIE_OFFICIAL_ACCOUNT_QRCODE;
function qrCodeForChatie() {
    return file_box_1.FileBox.fromQRCode(CHATIE_OFFICIAL_ACCOUNT_QRCODE);
}
exports.qrCodeForChatie = qrCodeForChatie;
//# sourceMappingURL=config.js.map