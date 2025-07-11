/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Card, Typography } from '@instana/components';

//@ts-expect-error - Cannot find module
import ActivationChecklist from 'in-amp/components/ActivationChecklist';
//@ts-expect-error - Cannot find module
import ProductAdoptionKPIs from 'in-amp/components/ProductAdoptionKPIs';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { t } from 'in-i18n';

export default function CustomerAdoption(props: any) {
  return (
    <>
      <Row>
        <Col md={4}>
          <Card>
            <Typography variant="heading-03">
              {t('in-amp:components.activationAdoption.activationChecklist')}
            </Typography>
            <ActivationChecklist accountInfo={props.accountInfo} />
          </Card>
        </Col>
        <Col md={8}>
          <Card title={t('in-amp:components.activationAdoption.productAdoption')}>
            <ProductAdoptionKPIs accountInfo={props.accountInfo} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
