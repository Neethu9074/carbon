/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Skeleton from 'in-new-components/Loading/Skeleton';

export default {
  title: 'Atoms|Skeleton',
  component: Skeleton
};

export const Default = () => {
  return (
    <div style={{ height: '200px', width: '200px', background: 'white' }}>
      <Skeleton style={{ height: '20px', width: '100px', display: 'block' }} />
    </div>
  );
};

export const LightMode = () => {
  return <Skeleton lightMode style={{ height: '2rem', width: '100%', display: 'block' }} />;
};
