/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';

import './Notification.less';

const block = 'in-notification';

export default function Notification({ children, success, failure, loading }) {
  let className = block;
  if (success) {
    className += ` ${block}--success`;
  }
  if (failure) {
    className += ` ${block}--failure`;
  }
  if (loading) {
    className += ` ${block}--loading`;
  }

  return (
    <span className={className}>
      {loading ? (
        <LoadingIndicator
          type="dark"
          inline
          style={{
            height: '17px'
          }}
        />
      ) : null}

      {children}
    </span>
  );
}
