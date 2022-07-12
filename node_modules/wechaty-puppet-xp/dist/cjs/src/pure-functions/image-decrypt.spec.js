#!/usr/bin/env -S ts-node --project tsconfig.cjs.json
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tstest_1 = require("tstest");
const image_decrypt_js_1 = require("./image-decrypt.js");
(0, tstest_1.test)('CJS: codeRoot()', async (t) => {
    t.ok(image_decrypt_js_1.ImageDecrypt, 'should exist ImageDecrypt');
});
//# sourceMappingURL=image-decrypt.spec.js.map