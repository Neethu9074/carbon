import { chunk } from 'lodash';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';

import locals from './ExpandingConditionsCard.mless';

export default function ExpandingConditionsCard({ viewAllHref$, conditions }) {
  if (!conditions || conditions.length === 0) {
    return null;
  }

  const maxColumns = 3;
  const preferredItemsPerColumn = 5;
  const numColumns = Math.min(maxColumns, Math.ceil(conditions.length / preferredItemsPerColumn));
  const itemsPerColumn = Math.max(preferredItemsPerColumn, Math.ceil(conditions.length / numColumns));
  const columns = chunk(conditions, itemsPerColumn);

  return (
    <Row>
      <Col lg={numColumns * 4}>
        <Card title="Conditions">
          <div className={locals.wrapper}>
            {columns.map((column, i) => (
              <div
                key={i}
                className={evaluateClassNames({
                  [locals.column]: true,
                  [locals.s]: numColumns === 1,
                  [locals.m]: numColumns === 2,
                  [locals.l]: numColumns === 3
                })}
              >
                {column.map((condition, i) => (
                  <Condition key={i} condition={condition} />
                ))}
              </div>
            ))}
          </div>
          <div className={locals.viewAllWrapper}>
            <Link className={locals.viewAllLink} href$={viewAllHref$}>
              View all Condition Details
            </Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
}

function Condition({ condition }) {
  return (
    <div className={locals.condition}>
      <span className={locals.type}>{condition.type}</span>
      <span className={locals.status}>{condition.status}</span>
    </div>
  );
}
