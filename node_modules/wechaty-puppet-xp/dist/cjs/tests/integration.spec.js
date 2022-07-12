#!/usr/bin/env node --no-warnings --loader ts-node/esm
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tstest_1 = require("tstest");
const wechaty_1 = require("wechaty");
const mod_js_1 = require("../src/mod.js");
(0, tstest_1.test)('integration testing', async (t) => {
    const puppet = new mod_js_1.PuppetXp();
    const wechaty = wechaty_1.WechatyBuilder.build({ puppet });
    t.ok(wechaty, 'should instantiate wechaty with puppet mocker');
});
//# sourceMappingURL=integration.spec.js.map