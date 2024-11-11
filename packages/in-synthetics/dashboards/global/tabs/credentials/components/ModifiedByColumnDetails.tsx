/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import locals from './ModifiedByColumnDetails.mless';

const ModifiedByColumnDetails = ({ modifiedBy }: { modifiedBy?: string }) => {
  const modifiedByArr = modifiedBy?.split(':');
  const getModifiedMethod = () => {
    switch (modifiedByArr![0]) {
      case 'ApiToken':
        return 'API';
      case 'UserEmail':
        return 'User';
      default:
        return modifiedBy;
    }
  };

  return (
    <div>
      {modifiedBy && (
        <>
          <h4 className={locals.label}>{getModifiedMethod()}</h4>
          <span className={locals.secText}>{modifiedByArr![1]}</span>
        </>
      )}
    </div>
  );
};

export default ModifiedByColumnDetails;
