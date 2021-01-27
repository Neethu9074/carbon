/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment, forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './ScopePath.mless';

const ScopePath = forwardRef(({ entries, iconSize = 's', noBottomMargin }, ref) => {
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

function ArrowSeparator({ iconSize }) {
  return <SvgIcon className={locals.separator} size={iconSize} type="lib_arrow_expand_right" />;
}

function ScopeEntry({ iconType, iconSize, label, href, href$ }) {
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

ScopePath.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      iconType: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      href$: PropTypes.object,
      href: PropTypes.string
    })
  ).isRequired,
  iconSize: PropTypes.string,
  noBottomMargin: PropTypes.bool
};

export default ScopePath;
