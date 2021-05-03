/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import FileNameAndLine from 'in-new-components/Profiling/components/FileNameAndLine';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import MethodName from 'in-new-components/Profiling/components/MethodName';
import At from 'in-new-components/Profiling/components/At';
import { percentage } from 'in-services/formatters/number';

import locals from './StackTrace.mless';

export default function StackTrace({ profile }) {
  const items = [];
  collectParents(profile, items);

  return (
    <div>
      {items.map((_profile, i) => (
        <div key={i} className={locals.line}>
          <HorizontalFlexWrapper className={locals.signature}>
            {i === items.length - 1 ? (
              <SvgIcon className={locals.icon} type="lib_arrow_short_right" size="xs" />
            ) : (
              <div className={locals.iconPlaceholder} />
            )}
            <MethodName methodName={_profile.methodName} />
            <At />
            <FileNameAndLine canFetchSourceCode={false} profileNode={_profile} />
          </HorizontalFlexWrapper>
          <span className={locals.percent}>({percentage.detailed(_profile.percent / 100)})</span>
        </div>
      ))}
    </div>
  );
}

function collectParents(profile, items) {
  let current = profile;
  while (current) {
    items.unshift(current);
    current = current.parentNode;
  }
}
