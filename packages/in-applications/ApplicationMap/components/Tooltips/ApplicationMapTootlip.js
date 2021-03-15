/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import locals from './ApplicationMapTootlip.mless';

export default function ApplicationMapTootlip({ renderHeader, renderContent }) {
  return (
    <div className={locals.wrapper}>
      <div className={locals.header}>{renderHeader()}</div>
      {renderContent && (
        <Fragment>
          <div className={locals.line} />
          <div className={locals.content}>{renderContent()}</div>
        </Fragment>
      )}
    </div>
  );
}
