import {create} from 'reactive-observables';

import testConfig from 'in-stores/testConfig.yaml';


// TODO: Use backend to get and set the agent config
const config = create();
config.emit(testConfig);

export function getAgentConfig(/* snapshot */) {
  return config;
}

export function saveAgentConfig(snapshot, _config) {
  config.emit(_config);
}
