import { Motion, spring } from 'react-motion';
import React from 'react';

import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import RequestQuoteDialog from 'in-components/RequestQuoteDialog';

import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import './UsageMessage.less';

let block = 'in-message-flyout-usage-message';

export default function Message({ message }) {
  if (message.isLicenseUsageMsg) {
    block = 'in-message-flyout-usage-message';
  }

  let classes = `${block} ${block}--${message.type}`;
  if (message.onClick) {
    classes = `${classes} ${block}--clickable`;
  }

  return (
    <Motion defaultStyle={{ opacity: 0 }} style={{ opacity: spring(1) }}>
      {interpolatedStyle => {
        return (
          <div
            style={interpolatedStyle}
            className={classes}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              if (message.onClick) {
                message.onClick();
              }
            }}
          >
            <SvgIcon type={message.icon} className={`${block}__icon`} width={18} />
            <div className={`${block}__msg`}>
              <Content content={message.content} />
              {!onPremLicenseInformationEnabled && (
                <Button
                  kind="warning"
                  className={`${block}__button`}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveDialog(<RequestQuoteDialog />);
                  }}
                >
                  Request a quote
                </Button>
              )}
            </div>
          </div>
        );
      }}
    </Motion>
  );
}

function Content({ content }) {
  return <div className={`${block}__content`}>{content}</div>;
}
