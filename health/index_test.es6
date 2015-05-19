/*eslint-env mocha*/

'use strict';

import {expect} from 'chai';
import * as health from './index';

import immutable from 'immutable';

/*eslint-disable max-len */
const status = {
  'memory': {
    'stream_merger_70': {
      'problems': [{
        'problemText': 'You will run out of main memory just within next 2 hours',
        'fixSuggestion': 'Analyse running processes for eventual memory leaks, eventually kill heavy memory consuming processes',
        'explanation': 'Determined through linear regression',
        'severity': 5
      }],
      'labels': [
        'operating system instance'
      ]
    }
  },
  'cpu': {
    'cpu.total.steal': {
      'problems': [],
      'labels': [
        'operating system instance'
      ]
    }
  },
  'disk': {
    'fs./dev/xvdg.free': {
        'problems': [{
          'problemText': '',
          'fixSuggestion': '',
          'explanation': '',
          'severity': 2
        }],
        'labels': [
          'operating system instance'
        ]
      },
      'fs./dev/xvdb.free': {
        'problems': [],
        'labels': [
          'operating system instance'
        ]
      },
      'fs./dev/xvda1.free': {
        'problems': [{
          'problemText': '',
          'fixSuggestion': '',
          'explanation': '',
          'severity': 2
        }, {
          'problemText': '',
          'fixSuggestion': '',
          'explanation': '',
          'severity': 8
        }],
        'labels': [
          'operating system instance'
        ]
      },
      'fs./dev/xvdf.free': {
        'problems': [],
        'labels': [
          'operating system instance'
        ]
      }
  }
};
/*eslint-enable max-len */

describe('health', () => {
  it('should extract the highest severity', () => {
    expect(health.getHealth(immutable.fromJS(status))).to.equal(8);
    expect(health.getHealth(undefined)).to.equal(0);
  });
});
