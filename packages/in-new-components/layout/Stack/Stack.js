import rpt from 'prop-types';
import React from 'react';

import classNames from 'classnames';

import locals from './Stack.mless';

const components = ['div', 'ul', 'ol'];
const alignments = ['left', 'center', 'right'];
export const spaces = ['disabled', 'xxsmall', 'xsmall', 'small', 'gutter', 'medium', 'large', 'xlarge', 'xxlarge'];

// An implementation of https://seek-oss.github.io/braid-design-system/components/Stack/
export default function Stack({ component: Component = 'div', space = 'gutter', align = null, children }) {
  return React.createElement(
    Component,
    {
      className: classNames({
        [locals.stack]: true,
        [locals[`spacing-${space}`]]: true,
        [locals[`alignment-${align}`]]: align
      })
    },
    children
  );
}

Stack.propTypes = {
  component: rpt.oneOfType([rpt.elementType, rpt.oneOf(components)]),
  space: rpt.oneOf(spaces),
  align: rpt.oneOf(alignments),
  children: rpt.node
};
