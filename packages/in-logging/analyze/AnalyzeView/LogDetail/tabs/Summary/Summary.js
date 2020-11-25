import React from 'react';

import ContentWrapper from 'in-new-components/LocationAwareTabView/components/ContentWrapper';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import TagList from 'in-logging/analyze/AnalyzeView/LogDetail/components/TagList';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Card from 'in-new-components/Card';

export default function Summary({ data: log }) {
  return (
    <ContentWrapper>
      <Row withoutSideMargin>
        <Col lg={4}>
          <KpiCard title="Time" renderValue={formatDateTime} value={log.timestamp} />
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col lg={12}>
          <Card title="Content" withoutPadding>
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
