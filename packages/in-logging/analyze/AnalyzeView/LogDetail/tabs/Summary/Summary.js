import classNames from 'classnames';
import React from 'react';

import ContentWrapper from 'in-new-components/LocationAwareTabView/components/ContentWrapper';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import TagList from 'in-logging/analyze/AnalyzeView/components/TagList';
import { getLogLevel } from 'in-logging/analyze/AnalyzeView/logLevel';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';

import locals from './Summary.mless';

export default function Summary({ data: log }) {
  const logLevel = getLogLevel(log) ?? valueMissingPlaceholder;

  return (
    <ContentWrapper>
      <Row withoutSideMargin>
        <Col lg={4}>
          <KpiCard title="Log time" renderValue={formatDateTime} value={log.timestamp} />
        </Col>
        <Col lg={4}>
          <KpiCard
            valuesClassName={classNames({
              [locals.type]: true,
              [locals[logLevel.toLowerCase()]]: true
            })}
            title="Type"
            value={logLevel}
            raw
          />
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col lg={12}>
          <Card title="Message" withoutPadding>
            {log.content}
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col lg={12}>
          <Card title="Tags">
            <HorizontalFlexWrapper>
              <TagList tags={log.tags} />
            </HorizontalFlexWrapper>
          </Card>
        </Col>
      </Row>
    </ContentWrapper>
  );
}
