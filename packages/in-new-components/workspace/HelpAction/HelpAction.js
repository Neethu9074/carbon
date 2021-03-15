/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './HelpAction.mless';

export default function HelpAction({ children, href, external }) {
  let content = (
    <SvgIcon
      type="lib_help_error_help_outline"
      content={children}
      className={classNames(locals.icon, { [locals.clickable]: href })}
    />
  );

  if (href) {
    content = (
      <Link href={href} external={external}>
        {content}
      </Link>
    );
  }

  return <Tooltip content={children}>{content}</Tooltip>;
}

HelpAction.propTypes = {
  children: PropTypes.node.isRequired,
  external: PropTypes.bool,
  href: PropTypes.string
};
