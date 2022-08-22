/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

interface HiddenCallConfiguratorProps {
  includeInternal?: boolean;
  includeSynthetic?: boolean;
  onChangeInternal?: (includeInternal: boolean) => void;
  onChangeSynthetic?: (includeSynthetic: boolean) => void;
}

export default function HiddenCallsConfigurator({
  includeInternal,
  includeSynthetic,
  onChangeInternal,
  onChangeSynthetic
}: HiddenCallConfiguratorProps) {
  return (
    <Row>
      <Col md={5} xs={5}>
        <CheckboxFancy
          label={t('in-custom-dashboards:widgets.slo.sliFormPresenter.includeInternalCalls')}
          checked={includeInternal}
          onChange={() => onChangeInternal?.(!includeInternal)}
        />
      </Col>
      <Col md={5} xs={5}>
        <CheckboxFancy
          label={t('in-custom-dashboards:widgets.slo.sliFormPresenter.includeSyntheticCalls')}
          checked={includeSynthetic}
          onChange={() => onChangeSynthetic?.(!includeSynthetic)}
        />
      </Col>
    </Row>
  );
}
