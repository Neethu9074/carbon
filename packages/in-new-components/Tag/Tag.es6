import rpt from 'prop-types';
import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import locals from './Tag.mless';

export const kinds = ['default', 'default-rounded'];

export default Tag;
function Tag({ className, children, kind = 'default' }) {
  return <span className={joinClassNames(locals.tag, `${locals[kind]}`, className)}>{children}</span>;
}

Tag.propTypes = {
  kind: rpt.string,
  className: rpt.string,
  children: rpt.node.isRequired
};
