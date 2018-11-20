import React from 'react';

import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';

import locals from './ConditionsList.mless';

export default function ConditionsList({ conditions = [] }) {
  return (
    <Card title="Conditions">
      <Row>
        {conditions.map((condition, i) => (
          <Col key={i} lg={4}>
            <Condition condition={condition} />
          </Col>
        ))}
      </Row>
    </Card>
  );
}

function Condition({ condition }) {
  return (
    <div className={locals.conditionWrapper}>
      <div>
        <span className={locals.type}>{condition.type}</span>(<span className={locals.status}>{condition.status}</span>)
        {` - `}
        <span>{formatDateTime(condition.lastTransitionTime)}</span>
      </div>
      <div className={locals.reason}>{condition.reason}</div>
      <span>{condition.message}</span>
    </div>
  );
}
