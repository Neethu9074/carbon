/* eslint-env mocha, node */
import Immutable from 'immutable';
import {expect} from 'chai';

import {extractConnections} from './wiring';


describe('snapshot', () => {

  describe('extractConnections', () => {

    it('should extract connections', () => {
      const snapshots = getConnectedSnapshots();
      snapshots.forEach(snapshot => {
        const connections = extractConnections(snapshot, snapshots);
        const outgoing = connections.outgoing;
        const incoming = connections.incoming;
        const name = snapshot.get('name');
        if (name === 'a') {
          expect(outgoing.size).to.equal(3);
          expect(incoming.size).to.equal(0);

        } else if (name === 'b') {
          expect(outgoing.size).to.equal(3);
          expect(incoming.size).to.equal(2);

        } else if (name === 'c') {
          expect(outgoing.size).to.equal(1);
          expect(incoming.size).to.equal(1);
          expect(outgoing.getIn([0, 'steadyId'])).to.equal('46.137.99.225');
          expect(incoming.getIn([0, 'name'])).to.equal('d');

        } else if (name === 'ec2') {
          expect(outgoing.size).to.equal(0);
          expect(incoming.size).to.equal(0);

        } else if (name === 'd') {
          expect(outgoing.size).to.equal(0);
          expect(incoming.size).to.equal(0);
        }
      });
    });

  });

  function getConnectedSnapshots() {
    return Immutable.fromJS({
      a: {
        name: 'a',
        data: {
          interfaces: {
            eth0: {
              addresses: [
                {ip: '1.1.1.1'}
              ]
            }
          },
          connections: {
            outgoing: [
              '1.1.1.2',
              '1.1.1.3',
              '1.1.1.6' // unknown
            ]
          }
        }
      }, b: {
        name: 'b',
        data: {
          interfaces: {
            eth0: {
              addresses: [
                {ip: '1.1.1.2'}
              ]
            }
          },
          connections: {
            incoming: [
              '1.1.1.1',
              '1.1.1.3'
            ],
            outgoing: [
              '1.1.1.1',
              '1.1.1.3',
              '1.1.1.5' // unknown
            ]
          }
        }
      }, c: {
        name: 'c',
        data: {
          interfaces: {
            eth0: {
              addresses: [
                {ip: '1.1.1.3'}
              ]
            }
          },
          connections: {
            incoming: [
              '1.1.1.4'
            ],
            outgoing: [
              '46.137.99.225'
            ]
          }
        }
      }, d: {
        name: 'd',
        data: {
          interfaces: {
            eth0: {
              addresses: [
                {ip: '1.1.1.4'}
              ]
            }
          }
        }
      }, ec2: {
        name: 'ec2',
        data: {
          'com.instana.sdk.annotation.Describes:reverse': {
            'com.instana.forge.hardware.virtual.ec2.Ec2.Ec2': {
              'i-4f84b70f.ami-5256b825': {
                'public-ipv4': '46.137.99.225'
              }
            }
          }
        }
      }
    });
  }

});
