/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import InboundOrAllCallsOptionBox from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsOptionBox';
import ExpandableCard from 'in-new-components/ExpandableCard';
import { boundaryScopes } from 'in-applications/constants';
import { Col, Row } from 'in-new-components/layout/Grid';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './InboundOrAllCallsChoiceHorizontal.mless';

export default function InboundOrAllCallsChoiceHorizontal({
  boundaryScope,
  onBoundaryStateChange,
  defaultBoundaryScope
}) {
  if (!boundaryScope || !defaultBoundaryScope) {
    return null;
  }

  const overrideInfo = (
    <Tooltip content={boundaryScopes.info[defaultBoundaryScope.toUpperCase()].overrideDefault} align="rightMiddle">
      <SvgIcon className={locals.icon} type="lib_help_error_info_outline" size="xs" />
    </Tooltip>
  );

  const cardPreview = (
    <>
      <SvgIcon type={boundaryScopes.info[boundaryScope.toUpperCase()].icon} className={locals.headerIcon} />
      <span className={locals.headerPreview}>
        {boundaryScopes.info[boundaryScope.toUpperCase()].text}
        {boundaryScope != defaultBoundaryScope ? overrideInfo : ''}
      </span>
    </>
  );

  return (
    <ExpandableCard
      className={locals.card}
      bodyWithoutPadding
      preview={cardPreview}
      titleSubContent="Select only inbound calls or all calls"
      framed
      openByDefault={false}
    >
      <Row>
        <Col lg={6}>
          <InboundOrAllCallsOptionBox
            boundaryScope={boundaryScope}
            onBoundaryStateChange={onBoundaryStateChange}
            scope={boundaryScopes.inbound}
          />
        </Col>
        <Col lg={6}>
          <InboundOrAllCallsOptionBox
            boundaryScope={boundaryScope}
            onBoundaryStateChange={onBoundaryStateChange}
            scope={boundaryScopes.all}
          />
        </Col>
      </Row>
    </ExpandableCard>
  );
}
