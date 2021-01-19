/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { useState } from 'react';
import React from 'react';

import Button from 'in-new-components/Button';

export function QueryBuilderStateHelper({ children: Component }) {
  const [readOnly, setReadOnly] = useState(false);
  const [value, setState] = useState([
    {
      type: 'TAG_FILTER',
      name: 'kubernetes.cluster.name',
      operator: 'CONTAINS',
      value: 'prod-shop'
    },
    {
      type: 'CONJUNCTION',
      logicalOperator: 'AND'
    },
    {
      type: 'TAG_FILTER',
      name: 'endpoint.name',
      operator: 'EQUALS',
      value: 'GET /api/maintenanceConfig/:id',
      entity: 'SOURCE'
    },
    {
      type: 'CONJUNCTION',
      logicalOperator: 'AND'
    },
    {
      type: 'TAG_FILTER',
      name: 'call.latency',
      operator: 'GREATER_THAN',
      value: 1000,
      entity: 'DESTINATION'
    },
    {
      type: 'CONJUNCTION',
      logicalOperator: 'AND'
    },
    {
      type: 'TAG_FILTER',
      name: 'call.http.header',
      operator: 'CONTAINS',
      key: 'user-agent',
      value: 'chrome',
      entity: 'DESTINATION'
    },
    {
      type: 'CONJUNCTION',
      logicalOperator: 'AND'
    },
    {
      type: 'OPEN_BRACKET'
    },
    {
      type: 'TAG_FILTER',
      name: 'service.name',
      operator: 'EQUALS',
      value: 'shop',
      entity: 'DESTINATION'
    },
    {
      type: 'CONJUNCTION',
      logicalOperator: 'OR'
    },
    {
      type: 'TAG_FILTER',
      name: 'service.name',
      operator: 'EQUALS',
      value: 'shipping',
      entity: 'DESTINATION'
    },
    {
      type: 'CONJUNCTION',
      logicalOperator: 'AND'
    },
    {
      type: 'OPEN_BRACKET'
    },
    {
      type: 'TAG_FILTER',
      name: 'endpoint.name',
      operator: 'EQUALS',
      value: 'product',
      entity: 'SOURCE'
    },
    {
      type: 'CONJUNCTION',
      logicalOperator: 'AND'
    },
    {
      type: 'TAG_FILTER',
      name: 'endpoint.name',
      operator: 'EQUALS',
      value: 'user',
      entity: 'SOURCE'
    },
    {
      type: 'CLOSE_BRACKET'
    },
    {
      type: 'CLOSE_BRACKET'
    }
  ]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Component value={value} setState={setState} readOnly={readOnly} />

      <div style={{ borderTop: '1px dashed lightgray', paddingTop: 8, marginTop: '2rem' }}>
        <Button
          kind="secondary"
          onClick={() =>
            setState(
              value.concat([
                {
                  type: 'TAG_FILTER',
                  name: 'service.name',
                  operator: 'EQUALS',
                  value: 'shop',
                  entity: 'DESTINATION'
                }
              ])
            )
          }
        >
          Tag
        </Button>
        <Button kind="secondary" onClick={() => setState(value.concat([{ type: 'OPEN_BRACKET' }]))}>
          (
        </Button>
        <Button kind="secondary" onClick={() => setState(value.concat([{ type: 'CLOSE_BRACKET' }]))}>
          )
        </Button>
        <Button
          kind="secondary"
          onClick={() => setState(value.concat([{ type: 'CONJUNCTION', logicalOperator: 'OR' }]))}
        >
          OR
        </Button>
        <Button
          kind="secondary"
          onClick={() => setState(value.concat([{ type: 'CONJUNCTION', logicalOperator: 'AND' }]))}
        >
          AND
        </Button>
        <Button style={{ marginLeft: 16 }} kind="secondary" onClick={() => setState([])}>
          Clear
        </Button>
        <Button
          style={{ marginLeft: 16 }}
          kind={!readOnly ? 'secondary' : 'info'}
          onClick={() => setReadOnly(prevState => !prevState)}
        >
          Toggle read-only
        </Button>
      </div>
    </div>
  );
}
