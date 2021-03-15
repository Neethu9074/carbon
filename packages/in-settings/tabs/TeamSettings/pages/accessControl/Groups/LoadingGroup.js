/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Skeleton from 'in-new-components/Loading/Skeleton';
import { Row, Col } from 'in-new-components/layout/Grid';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Group.mless';

export default function LoadingGroup() {
  return (
    <>
      <Row>
        <Col lg>
          <div className={locals.headline}>
            <SvgIcon className={locals.icon} type="lib_alerts_user_impacted" size="l" />
            <Skeleton className={locals.titleSkeleton} />
          </div>
        </Col>
      </Row>
    </>
  );
}
