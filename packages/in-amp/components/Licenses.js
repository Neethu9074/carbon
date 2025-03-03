/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Card } from '@instana/components';

import NoLicenseAvailableMessage from 'in-amp/components/NoLicenseAvailableMessage';
import WithAccountInformation from 'in-amp/components/WithAccountInformation';
import { productAreas } from 'in-services/tracking/productAreas';
import ExpiredLicenses from 'in-amp/components/ExpiredLicenses';
import QueuedLicenses from 'in-amp/components/QueuedLicenses';
import ActiveLicenses from 'in-amp/components/ActiveLicenses';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Licenses() {
  return (
    <WithAccountInformation>
      {props => (props.unitSelectorOptions?.length === 0 ? <NoLicenseAvailableMessage /> : <License />)}
    </WithAccountInformation>
  );
}

function License() {
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.settings,
          pageRootName: pageNames.license
        }}
      />
      <Row>
        <Col xs={12}>
          <Card title={t('in-amp:components.usages.activeLicenses')}>
            <ActiveLicenses />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card title={t('in-amp:components.usages.expiredLicenses')}>
            <ExpiredLicenses />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card title={t('in-amp:components.usages.queuedLicenses')}>
            <QueuedLicenses />
          </Card>
        </Col>
      </Row>
    </>
  );
}
