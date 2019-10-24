const serverConfig = require('../../serverConfig.js');

if (serverConfig.consul && serverConfig.consul.baseUrl) {
  startWith('consul');
} else if (serverConfig.instanactlCockroachDb && serverConfig.instanactlCockroachDb.host) {
  startWith('instanactl');
} else {
  startWith('config');
}

function startWith(name) {
  console.log(`Starting ui-client with **${name}** based configuration and service resolver.`);
  exports.activeResolver = require(`./${name}`);
}
