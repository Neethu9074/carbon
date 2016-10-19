import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.docker,
  icon,

  namesForTypeSearch: ['docker'],

  pluginName: {
    singular: 'Docker Container',
    plural: 'Docker Containers'
  },

  getLabel
});


function getLabel(s) {
  const image = s.getIn(['data', 'Image']);
  if (!image) {
    return getFallbackLabel(s);
  }
  const match = image.match(/(^|\/)(([^\/]+)\/)?([^\/:]+)([^/]*)$/);
  if (!match) {
    return getFallbackLabel(s);
  }
  if (match[3]) {
    return `${match[3]}/${match[4]}`;
  }
  return match[4];
}


function getFallbackLabel(s) {
  const names = s.getIn(['data', 'Names']);
  return names ? names.join(', ') : undefined;
}
