/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { LoadingSkeleton } from '@instana/components';
import { SvgIcon } from '@instana/components';

import { Row, Col } from 'in-components/layout/Grid';

import locals from './Group.mless';

export default function LoadingGroup() {
  return (
    <>
      <Row>
        <Col lg>
          <div className={locals.headline}>
            <SvgIcon className={locals.icon} type="lib_alerts_user_impacted" size="l" />
            <LoadingSkeleton className={locals.titleSkeleton} />
          </div>
        </Col>
      </Row>
    </>
  );
}
