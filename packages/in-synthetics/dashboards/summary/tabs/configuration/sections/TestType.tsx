/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SyntheticTest, SyntheticType } from '@instana/types';
import { KeyValue } from '@instana/components';
import { t } from '@instana/i18n-react';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { Col, Row } from 'in-components/layout/Grid/Grid';

import locals from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration.mless';

interface Props {
  test: SyntheticTest;
}

type SyntheticMapping = {
  testType: 'API' | 'Browser' | 'Webpage' | 'Domain Name Server' | 'SSL Certificate' | '';
  subTestType: 'Simple' | 'Script' | '';
};

type TypeMap = Record<SyntheticType, SyntheticMapping>;

const TestTypeSection = ({ test }: Props) => {
  const { configuration } = test;

  const mapSyntheticType = (syntheticType: string) => {
    const typeMap: TypeMap = {
      HTTPAction: { testType: 'API', subTestType: 'Simple' },
      HTTPScript: { testType: 'API', subTestType: 'Script' },
      BrowserScript: { testType: 'Browser', subTestType: 'Script' },
      WebpageAction: { testType: 'Webpage', subTestType: 'Simple' },
      WebpageScript: { testType: 'Webpage', subTestType: 'Script' },
      DNS: { testType: 'Domain Name Server', subTestType: '' },
      SSLCertificate: { testType: 'SSL Certificate', subTestType: '' },
      NotConfigured: { testType: '', subTestType: '' }
    };

    //@ts-expect-error expression of type 'string' can't be used to index type 'TypeMap'.
    const syntheticMapping = typeMap[syntheticType];

    if (syntheticMapping) {
      return syntheticMapping;
    } else {
      return { testType: '', subTestType: '' };
    }
  };

  return (
    <ExpandableLightCard
      className={locals.expandableCard}
      title={t('in-synthetics:dashboard.configuration.testTypeTitle')}
      darkFrame
      useMaxAvailableHeight
      openByDefault
    >
      <Row>
        <Col xs={3}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.testType')}
            value={mapSyntheticType(configuration.syntheticType).testType}
          />
        </Col>
        {!['SSLCertificate', 'DNS'].includes(configuration.syntheticType) && (
          <Col xs={3}>
            <KeyValue
              label={t('in-synthetics:dashboard.configuration.subType')}
              value={mapSyntheticType(configuration.syntheticType).subTestType}
            />
          </Col>
        )}
      </Row>
    </ExpandableLightCard>
  );
};

export default TestTypeSection;
