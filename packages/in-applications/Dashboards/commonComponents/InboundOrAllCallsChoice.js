import { Fragment } from 'react';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import ExpandableCard from 'in-new-components/ExpandableCard';
import OptionBox from 'in-applications/components/OptionBox';
import { boundaryScopes } from 'in-applications/constants';
import { Row, Col } from 'in-new-components/layout/Grid';
import SvgIcon from 'in-components/SvgIcon';

import locals from './InboundOrAllCallsChoice.mless';

export default function InboundOrAllCallsChoice({ boundaryScope, onBoundaryStateChange }) {
  const cardPreview = (
    <Fragment>
      <SvgIcon type={boundaryScopes.info[boundaryScope].icon} className={locals.headerIcon} />
      <span className={locals.headerPreview}>{boundaryScopes.info[boundaryScope].text}</span>
    </Fragment>
  );

  return (
    <ExpandableCard
      className={locals.card}
      bodyWithoutPadding={true}
      preview={cardPreview}
      titleSubText={'Select only inbound calls or all calls'}
      framed={true}
      openByDefault={false}
    >
      <Row>
        <Col lg={6}>
          <OptionBox
            icon={boundaryScopes.info[boundaryScopes.inbound].icon}
            title={boundaryScopes.info[boundaryScopes.inbound].text}
            asRadioButton={true}
            className={evaluateClassNames({
              [locals.optionBox]: true,
              [locals.optionBoxUnchecked]: boundaryScopes.inbound !== boundaryScope
            })}
            description="The dashboard is displaying information based only on the calls that are performed by the consumers of this application."
            checked={boundaryScopes.inbound === boundaryScope}
            onChange={() => onBoundaryStateChange({ boundaryScope: boundaryScopes.inbound })}
          />
        </Col>
        <Col lg={6}>
          <OptionBox
            icon={boundaryScopes.info[boundaryScopes.all].icon}
            title={boundaryScopes.info[boundaryScopes.all].text}
            asRadioButton={true}
            className={evaluateClassNames({
              [locals.optionBox]: true,
              [locals.optionBoxUnchecked]: boundaryScopes.all !== boundaryScope
            })}
            description="The dashboard is displaying information based only on the calls that are performed within this application, by both consumers as well as internally."
            checked={boundaryScopes.all === boundaryScope}
            onChange={() => onBoundaryStateChange({ boundaryScope: boundaryScopes.all })}
          />
        </Col>
      </Row>
    </ExpandableCard>
  );
}
