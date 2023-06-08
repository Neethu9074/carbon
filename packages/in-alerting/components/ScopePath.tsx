/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef, Fragment } from 'react';
import classNames from 'classnames';

import { SvgIcon, SvgIconProps } from '@instana/components';
import { Observable } from '@instana/observables';
import { Link } from '@instana/legacy';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';

import locals from 'in-alerting/components/ScopePath.mless';

interface ScopePathProps {
  entries: ScopeEntryType[];
  iconSize?: Size;
  noBottomMargin?: boolean;
}
type Size = SvgIconProps['size'];

export type ScopeEntryType = {
  iconType: string;
  label: string;
  href?: string;
  href$?: Observable<string>;
};

const ScopePath = forwardRef<HTMLDivElement, ScopePathProps>((props, ref) => {
  const { entries, iconSize = 's', noBottomMargin } = props;
  return (
    <HorizontalFlexWrapper
      ref={ref}
      className={classNames({
        [locals.container]: true,
        [locals.noBottomMargin]: noBottomMargin
      })}
    >
      {entries.map((entry, i) => (
        <Fragment key={i}>
          {i > 0 && <ArrowSeparator iconSize={iconSize} />}
          <ScopeEntry iconSize={iconSize} {...entry} />
        </Fragment>
      ))}
    </HorizontalFlexWrapper>
  );
});

function ArrowSeparator({ iconSize }: { iconSize: Size }) {
  return <SvgIcon className={locals.separator} size={iconSize} type="lib_arrow_expand_right" />;
}

interface ScopeEntryProps extends ScopeEntryType {
  iconSize: Size;
}

function ScopeEntry({ iconType, iconSize, label, href, href$ }: ScopeEntryProps) {
  return (
    <>
      <SvgIcon className={locals.icon} size={iconSize} type={iconType} />
      <Link href$={href$} href={href} className={locals.link}>
        {label}
      </Link>
    </>
  );
}

ScopePath.displayName = 'ScopePath';

export default ScopePath;
