/*eslint-env mocha*/

'use strict';

import {expect} from 'chai';
import * as health from './index';

import immutable from 'immutable';

/*eslint-disable max-len */
const snapshot = {
  'snapshot': {
    'interfaces': {
      'eth0': {
        'mac': '22:00:0b:5d:9c:cc',
        'ips': [
          '10.140.194.67'
        ]
      }
    },
    'com.instana.sdk.annotation.Describes: com.instana.forge.infrastructure.virtualization.EC2': {
        'reservation-id': 'r-d03abd31',
          'instance-id': 'i-c8fbc339',
          'instance-type': 'm3.medium',
          'ami-id': 'ami-9a562df2',
          'availability-zone': 'us-east-1c'
    },
    'memory.total': 3947331584,
    'uuid': '0647ef39-1eef-4dcf-bdde-7a9fc87491c0',
    'cpu.count': 1,
    'status': {
      'memory': {
        'stream_merger_70': {
          'problems': [{
            'problemText': '',
            'fixSuggestion': '',
            'explanation': '',
            'severity': 3
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
              'severity': 1
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
          'fs./dev/xvdb.free': {
            'problems': [],
            'labels': [
              'operating system instance'
            ]
          },
          'fs./dev/xvda1.free': {
            'problems': [],
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
    },
    'filesystems': {
      '/dev/xvda1': {
          'mount': '/',
          'options': 'rw,discard',
          'systype': 'ext4',
          'capacity': 20496628
        },
        '/dev/xvdb': {
          'mount': '/mnt',
          'options': 'rw',
          'systype': 'ext3',
          'capacity': 4057280
        },
        '/dev/xvdf': {
          'mount': '/mnt/dfs',
          'options': 'rw',
          'systype': 'xfs',
          'capacity': 104806400
        },
        '/dev/xvdg': {
          'mount': '/mnt/elk',
          'options': 'rw',
          'systype': 'ext4',
          'capacity': 103081248
        }
    },
    'os.arch': 'amd64',
    'os.name': 'Linux',
    'cpu.model': 'Intel Xeon 2.5 GHz',
    'os.version': '3.13.0-44-generic',
    'connections': [
      '10.231.212.66',
      '10.179.191.97',
      '10.79.132.103'
    ]
  },
  'hostId': 'ip-10-140-194-67.ec2.internal',
  'steadyId': '0647ef39-1eef-4dcf-bdde-7a9fc87491c0',
  'pluginId': 'com.instana.forge.infrastructure.os.OS'
};
/*eslint-enable max-len */

describe('health', () => {

  describe('getHealth', () => {
    it('should map to the correct health', () => {
      expect(health.getHealth(immutable.fromJS(snapshot))).to.equal('warning');
    });

    it('should fail when passing undefined', () => {
      expect(() => health.getHealth(undefined)).to.throw(Error);
    });
  });
});
