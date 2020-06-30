import { useState } from 'react';
import React from 'react';

import Button from 'in-new-components/Button';

export function QueryBuilderStateHelper({ children: Component }) {
  const [value, setState] = useState([
    {
      type: 'TAG',
      name: 'endpoint.name',
      operator: 'EQUALS',
      stringValue: 'GET /api/maintenanceConfig/:id',
      entity: 'SOURCE'
    },
    {
      type: 'CONJUNCTION',
      logicalOperator: 'AND'
    },
    {
      type: 'OPEN_BRACKET'
    },
    {
      type: 'TAG',
      name: 'service.name',
      operator: 'EQUALS',
      stringValue: 'shop',
      entity: 'DESTINATION'
    },
    {
      type: 'CONJUNCTION',
      logicalOperator: 'OR'
    },
    {
      type: 'TAG',
      name: 'service.name',
      operator: 'EQUALS',
      stringValue: 'shipping',
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
      type: 'TAG',
      name: 'endpoint.name',
      operator: 'EQUALS',
      stringValue: 'product',
      entity: 'SOURCE'
    },
    {
      type: 'CONJUNCTION',
      logicalOperator: 'AND'
    },
    {
      type: 'TAG',
      name: 'endpoint.name',
      operator: 'EQUALS',
      stringValue: 'user',
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
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 400 }}>
      <Component value={value} setState={setState} />

      <div style={{ borderTop: '1px dashed lightgray', paddingTop: 8 }}>
        <Button
          kind="secondary"
          onClick={() =>
            setState(
              value.concat([
                {
                  type: 'TAG',
                  name: 'service.name',
                  operator: 'EQUALS',
                  stringValue: 'shop',
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
      </div>
    </div>
  );
}
