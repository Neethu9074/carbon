'use strict';

import prettyBytes from 'pretty-bytes';

export function formatBytes(bytes) {
  return prettyBytes(bytes);
}
