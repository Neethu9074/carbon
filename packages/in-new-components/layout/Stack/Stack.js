import React, { forwardRef } from 'react';
import classNames from 'classnames';
import rpt from 'prop-types';

import locals from './Stack.mless';

const components = ['div', 'ul', 'ol'];
const alignments = ['left', 'center', 'right'];
// See in-new-components/layout/Stack/spacings.less for mappings to PX/REM
export const spaces = [
  'disabled',
  'xxsmall',
  'xsmall',
  'small',
  'normal',
  'medium',
  'large',
  'xlarge',
  'xxlarge',
  'gutter'
];

// An implementation of https://seek-oss.github.io/braid-design-system/components/Stack/
export default forwardRef(Stack);

function Stack({ component: Component = 'div', space = 'normal', align = null, children }, ref) {
  return (
    <Component
      className={classNames(locals.stack, {
        [locals[`spacing-${space}`]]: true,
        [locals[`alignment-${align}`]]: align
      })}
      ref={ref}
    >
      {children}
    </Component>
  );
}

Stack.propTypes = {
  component: rpt.oneOfType([rpt.elementType, rpt.oneOf(components)]),
  space: rpt.oneOf(spaces),
  align: rpt.oneOf(alignments),
  children: rpt.node
};
