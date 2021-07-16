/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest, node */
import { expect } from 'chai';

import getPowerFunctions from 'in-applications/ApplicationMap/misc/layouting/powerFunctions';

describe('in-applications/ApplicationMap/misc/layouting/powerFunctions', () => {
  const currentPowerFunctions = getPowerFunctions(getMap());

  it('should return 0 on unknown entities or unconnected services', () => {
    expect(currentPowerFunctions.getPowerByName('unknown', 'calls')).to.equal(0);
    expect(currentPowerFunctions.getPowerByName('unknown', 'latency')).to.equal(0);
    expect(currentPowerFunctions.getPowerByName('unknown', 'errorRate')).to.equal(0);
  });

  it('should calculate the calls power based on incoming connections', () => {
    expect(currentPowerFunctions.getPowerByName('s1', 'calls')).to.equal(0);
    expect(currentPowerFunctions.getPowerByName('s2', 'calls')).to.equal(0.1);
    expect(currentPowerFunctions.getPowerByName('s3', 'calls')).to.equal(1);
  });

  it('should calculate the latency power based on incoming connections', () => {
    expect(currentPowerFunctions.getPowerByName('s1', 'latency')).to.equal(0);
    expect(currentPowerFunctions.getPowerByName('s2', 'latency')).to.equal(1);
    expect(currentPowerFunctions.getPowerByName('s3', 'latency')).to.equal(1 / 97);
  });

  it('should calculate the calls power based on incoming connections', () => {
    expect(currentPowerFunctions.getPowerByName('s1', 'errorRate')).to.equal(0.5);
    expect(currentPowerFunctions.getPowerByName('s2', 'errorRate')).to.equal(0);
    expect(currentPowerFunctions.getPowerByName('s3', 'errorRate')).to.equal(1);
  });
});

function getMap() {
  const incomingConnectionsMap = new Map();

  /*
    2, 3, 0.1  ---> s1
    3, 1, 0.4  ---> s1

    10, 100, 0   ---> s2

    0, 1, 0.8    ---> s3
    52, 2, 0.5 ---> s3
    2, 3, 0.25 ---> s3
    1, 4, 0    ---> s3
  */

  incomingConnectionsMap.set('s1', [
    {
      calls: 2,
      latency: 3,
      errorRate: 0.1
    },
    {
      calls: 3,
      latency: 1,
      errorRate: 0.4
    }
  ]);

  incomingConnectionsMap.set('s2', [
    {
      calls: 10,
      latency: 100,
      errorRate: 0
    }
  ]);

  incomingConnectionsMap.set('s3', [
    {
      calls: 0,
      latency: 1,
      errorRate: 0.8
    },
    {
      calls: 52,
      latency: 2,
      errorRate: 0.5
    },
    {
      calls: 2,
      latency: 3,
      errorRate: 0.25
    },
    {
      calls: 1,
      latency: 4,
      errorRate: 0
    }
  ]);

  return incomingConnectionsMap;
}
