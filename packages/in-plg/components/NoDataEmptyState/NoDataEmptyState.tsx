/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { NoDataEmptyState as CarbonNoDataEmptyState, NoDataEmptyStateProps } from '@instana/ibm-products';
import { SvgIcon } from '@instana/components';
import { Link } from '@instana/carbon';

import locals from 'in-plg/components/NoDataEmptyState/NoDataEmptyState.mless';

const NoDataEmptyState = ({ link, ...rest }: NoDataEmptyStateProps) => {
  return (
    <div className={locals.wrapper}>
      <CarbonNoDataEmptyState {...rest} />
      <Link href={link?.href} target="_blank" renderIcon={() => <SvgIcon type="lib_views_external_link" size="xs" />}>
        {link?.text}
      </Link>
    </div>
  );
};

export default NoDataEmptyState;
