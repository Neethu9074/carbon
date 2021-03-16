/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  latency,
  latencyFixed,
  meanLatency,
  meanLatencyLargeInSeconds,
  meanLatencyFixed
} from 'in-services/formatters/number';

export default {
  title: 'Helpers|Formatting'
};

export const Latency = () => {
  const formatters = [
    {
      name: 'meanLatency',
      formatter: meanLatency
    },
    {
      name: 'meanLatencyFixed',
      formatter: meanLatencyFixed
    },
    {
      name: 'meanLatencyLargeInSeconds',
      formatter: meanLatencyLargeInSeconds
    },
    {
      name: 'latency',
      formatter: latency
    },
    {
      name: 'latencyFixed',
      formatter: latencyFixed
    }
  ];
  const latencies = [0, 0.1, 123, 1234, 123456, 1234567, 12345678, 123456789, 1234567890];
  const style = { display: 'flex', justifyContent: 'space-between', width: '25rem' };
  return (
    <div>
      {formatters.map(f => (
        <p>
          <h1>{f.name}.compact</h1>
          <p>
            {latencies.map(l => (
              <div key={l} style={style}>
                <span>
                  {f.name}.compact({l})
                </span>
                <span>{f.formatter.compact(l)}</span>
              </div>
            ))}
          </p>
          <h1>{f.name}.detailed</h1>
          <p>
            {latencies.map(l => (
              <div key={l} style={style}>
                <span>
                  {f.name}.detailed({l})
                </span>
                <span>{f.formatter.detailed(l)}</span>
              </div>
            ))}
          </p>
        </p>
      ))}
    </div>
  );
};
