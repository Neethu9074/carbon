/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { KeyValue, SearchInput, Checkbox } from '@instana/components';
import { SyntheticTest } from '@instana/types/typeDefinitions';
import { t } from '@instana/i18n-react';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { Col, Row } from 'in-components/layout/Grid/Grid';

import locals from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration.mless';

interface Props {
  test: SyntheticTest;
}

const Identify = ({ test }: Props) => {
  const [searchInput, setSearchInput] = useState('');

  const header = (
    <SearchInput
      disabled
      className={locals.rightHeader}
      maxWidth={140}
      query={searchInput}
      onChange={q => setSearchInput(q)}
    />
  );

  return (
    <ExpandableLightCard
      className={locals.expandableCard}
      title={t('in-synthetics:dashboard.configuration.identifyTitle')}
      darkFrame
      useMaxAvailableHeight
      openByDefault
    >
      <Row className={locals.configRow}>
        <Col xs={12}>
          <KeyValue label={t('in-synthetics:dashboard.configuration.identifySectionName')} value={test.label} />
        </Col>
      </Row>
      <Row className={locals.configRow}>
        <Col xs={12}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.identifySectionDescription')}
            value={test.description}
          />
        </Col>
      </Row>
      <Row>
        {!syntheticRbacLimitedEnabled && (
          <LightCard
            className={locals.lastConfigRow}
            header={header}
            title={t('in-synthetics:dashboard.configuration.associatedApplication')}
            darkFrame
            framed
          >
            {test.applicationLabel === '' || test.applicationLabel === undefined ? (
              t('in-synthetics:dashboard.configuration.noApplicationAssociated')
            ) : (
              <Checkbox checked disabled label={test.applicationLabel} />
            )}
          </LightCard>
        )}
      </Row>
    </ExpandableLightCard>
  );
};

export default Identify;
