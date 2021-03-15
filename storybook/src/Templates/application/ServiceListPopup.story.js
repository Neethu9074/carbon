/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { EntityToInstanaServicesButton } from 'in-new-components/EntityToInstanaServiceButton/EntityToInstanaServiceButton';
import OverlayPresenter from 'in-new-components/overlays/OverlayPresenter';

export default {
  title: 'Templates|application/EntityToInstanaServicesButton',
  component: EntityToInstanaServicesButton
};

export function ServiceListPopupStory() {
  return (
    <>
      <h2>One Service</h2>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <EntityToInstanaServicesButton
          instanaServices={[
            {
              id: 42,
              label: 'foobar',
              types: ['HTTP'],
              metrics: { maxSeverity: [[0, 0]], latencyAgg: [[0, 123]], errorsAgg: [[0, 0]], callsAgg: [[0, 1234]] }
            }
          ]}
        />
        <OverlayPresenter />
      </div>

      <h2>Many Services</h2>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <EntityToInstanaServicesButton
          instanaServices={[
            {
              id: 42,
              label: 'foobar',
              types: ['HTTP'],
              metrics: { maxSeverity: [[0, 0]], latencyAgg: [[0, 123]], errorsAgg: [[0, 0]], callsAgg: [[0, 1234]] }
            },
            {
              id: 43,
              label: 'very long label which is very long. seriously, this is a long label',
              types: ['RPC'],
              metrics: {
                maxSeverity: [[0, 5]],
                latencyAgg: [[0, 1230]],
                errorsAgg: [[0, 0.5]],
                callsAgg: [[0, 1234]]
              }
            },
            {
              id: 44,
              label: 'foobar',
              types: ['DATABASE'],
              metrics: {
                maxSeverity: [[0, 10]],
                latencyAgg: [[0, 12300]],
                errorsAgg: [[0, 1]],
                callsAgg: [[0, 1234]]
              }
            },
            {
              id: 45,
              label: 'foobar',
              types: ['INTERNAL'],
              metrics: { maxSeverity: [[0, 0]], latencyAgg: [[0, 123]], errorsAgg: [[0, 0]], callsAgg: [[0, 1234]] }
            },
            {
              id: 46,
              label: 'foobar',
              types: ['UNDEFINED'],
              metrics: {
                maxSeverity: [[0, 5]],
                latencyAgg: [[0, 7645]],
                errorsAgg: [[0, 0.125]],
                callsAgg: [[0, 1234]]
              }
            },
            {
              id: 47,
              label: 'foobar',
              metrics: {
                maxSeverity: [[0, 5]],
                latencyAgg: [[0, 7645]],
                errorsAgg: [[0, 0.125]],
                callsAgg: [[0, 1234]]
              }
            }
          ]}
        />
        <OverlayPresenter />
      </div>
    </>
  );
}
