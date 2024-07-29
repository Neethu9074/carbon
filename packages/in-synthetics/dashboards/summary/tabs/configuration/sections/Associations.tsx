/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { SyntheticTest } from '@instana/types/typeDefinitions';
import { Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { syntheticMultiAppEnabled } from 'in-services/featureFlags';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import PreviewBadge from 'in-components/PreviewBadge/PreviewBadge';
import { Col, Row } from 'in-components/layout/Grid/Grid';

import locals from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration.mless';

interface Props {
  test: SyntheticTest;
}

const Associations = ({ test }: Props) => {
  const getPrivatePreviewBadge = () => {
    if (syntheticMultiAppEnabled) {
      return (
        <Stack direction="horizontal" gap="xxsmall">
          {t('in-synthetics:dashboard.configuration.associations')}
          <PreviewBadge privatePreview />
        </Stack>
      );
    }
    return t('in-synthetics:dashboard.configuration.associations');
  };
  return (
    <ExpandableLightCard
      className={locals.expandableCard}
      title={getPrivatePreviewBadge()}
      darkFrame
      useMaxAvailableHeight
      openByDefault
    >
      <Row>
        <LightCard
          className={locals.lastConfigRow}
          title={t('in-synthetics:dashboard.configuration.associatedApplications')}
          darkFrame
          framed
        >
          {test.applicationLabels?.length === 0 || test.applicationLabels === undefined
            ? t('in-synthetics:dashboard.configuration.noApplicationsAssociated')
            : test.applicationLabels.map((application, index) => {
                return (
                  <Row
                    key={index}
                    className={classNames({
                      [locals.configRow]: true,
                      [locals.lastRow]: index === test.applicationLabels?.length! - 1
                    })}
                  >
                    <Col xs={12}>{application}</Col>
                  </Row>
                );
              })}
        </LightCard>
      </Row>
    </ExpandableLightCard>
  );
};

export default Associations;
