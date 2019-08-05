import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './BackButton.mless';

export default function BackButton({ label, href, href$, withoutMargin }) {
  return (
    <Link
      className={evaluateClassNames({
        [locals.link]: true,
        [locals.withoutMargin]: withoutMargin
      })}
      href={href}
      href$={href$}
    >
      <SvgIcon type="lib_arrow_expand_left" className={locals.icon} />
      {label}
    </Link>
  );
}
