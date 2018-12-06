import { Motion, spring } from 'react-motion';
import React from 'react';

import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import RequestQuoteDialog from 'in-components/RequestQuoteDialog';
import { createTracker } from 'in-services/tracking/mixpanel';

import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './UsageMessage.mless';
const buttonClickedMixpanelTracker = createTracker('requestQuote.buttonClicked');

export default function UsageMessage({ message }) {
  let classes = `${locals.flyout} ${locals[message.type]}`;
  if (message.onClick) {
    classes += ` ${locals.clickable}`;
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
            <SvgIcon type={message.icon} className={locals.icon} width={24} height={24} />
            <div className={locals.msg}>
              <Content content={message.content} />
              {!onPremLicenseInformationEnabled && (
                <Button
                  className={locals.button}
                  kind="warning"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    buttonClickedMixpanelTracker();
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
  return <div className={locals.content}>{content}</div>;
}
