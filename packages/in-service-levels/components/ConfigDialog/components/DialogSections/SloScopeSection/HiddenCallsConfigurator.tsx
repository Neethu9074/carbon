/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Checkbox } from '@instana/carbon';

import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

interface HiddenCallConfiguratorProps {
  disabled?: boolean;
  includeInternal?: boolean;
  includeSynthetic?: boolean;
  onChangeInternal?: (includeInternal: boolean) => void;
  onChangeSynthetic?: (includeSynthetic: boolean) => void;
}

export default function HiddenCallsConfigurator({
  disabled = false,
  includeInternal,
  includeSynthetic,
  onChangeInternal,
  onChangeSynthetic
}: HiddenCallConfiguratorProps) {
  return (
    <Row>
      <Col md={5} xs={5}>
        <Checkbox
          id="slo-internal-call-checkbox"
          disabled={disabled}
          checked={includeInternal}
          labelText={t('in-custom-dashboards:widgets.slo.sliFormPresenter.includeInternalCalls')}
          onChange={() => onChangeInternal?.(!includeInternal)}
        />
      </Col>
      <Col md={5} xs={5}>
        <Checkbox
          id="slo-synthetic-call-checkbox"
          disabled={disabled}
          checked={includeSynthetic}
          labelText={t('in-custom-dashboards:widgets.slo.sliFormPresenter.includeSyntheticCalls')}
          onChange={() => onChangeSynthetic?.(!includeSynthetic)}
        />
      </Col>
    </Row>
  );
}
