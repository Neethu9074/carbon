/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Motion, spring } from 'react-motion';
import classNames from 'classnames';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './Message.mless';

export default function Message({ message }) {
  if (message.isLicenseUsageMsg) {
    return null;
  }

  return (
    <Motion defaultStyle={{ opacity: 0 }} style={{ opacity: spring(1) }}>
      {interpolatedStyle => {
        return (
          <div
            style={interpolatedStyle}
            className={classNames({
              [locals.flyoutMessage]: true,
              [locals[message.type]]: message.type,
              [locals.clickable]: message.onClick
            })}
            onClick={e => {
              if (message.onClick) {
                message.onClick(e);
              }
            }}
          >
            <SvgIcon type={message.icon} className={locals.icon} />
            <div
              className={classNames(locals.msg, {
                [locals.verticallyCenterMsg]: !message.title && typeof message.content === 'string'
              })}
            >
              <Title title={message.title} />
              {typeof message.content === 'string' ? <Content content={message.content} /> : message.content}
            </div>
          </div>
        );
      }}
    </Motion>
  );
}

function Title({ title }) {
  if (!title) {
    return null;
  }
  return (
    <div className={locals.title}>
      <strong>{title}</strong>
    </div>
  );
}

function Content({ content }) {
  return <div className={locals.content}>{content}</div>;
}
