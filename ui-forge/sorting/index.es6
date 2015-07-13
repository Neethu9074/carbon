'use strict';

import {addMapping} from 'instana-ui-sdk/sorting';
import * as constants from '../constants';

addMapping(
  constants.plugins.os,
  (s1, s2) => s1.get('hostId').localeCompare(s2.get('hostId'))
);
