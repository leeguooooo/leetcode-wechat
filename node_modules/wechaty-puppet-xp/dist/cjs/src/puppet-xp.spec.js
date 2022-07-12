#!/usr/bin/env node --no-warnings --loader ts-node/esm
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tstest_1 = require("tstest");
const puppet_xp_js_1 = require("./puppet-xp.js");
class PuppetXpTest extends puppet_xp_js_1.PuppetXp {
}
tstest_1.test.skip('PuppetXp perfect restart testing', async (t) => {
    const puppet = new PuppetXpTest();
    try {
        for (let i = 0; i < 3; i++) {
            await puppet.start();
            t.ok(puppet.state.active(), 'should be turned on after start()');
            await puppet.stop();
            t.ok(puppet.state.inactive(), 'should be turned off after stop()');
            t.pass('start/stop-ed at #' + i);
        }
        t.pass('PuppetXp() perfect restart pass.');
    }
    catch (e) {
        t.fail(e);
    }
});
//# sourceMappingURL=puppet-xp.spec.js.map