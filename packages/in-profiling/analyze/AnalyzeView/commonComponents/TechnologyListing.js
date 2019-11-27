import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getTechnologyLabel } from 'in-sdk/snapshot';
import { getIconSvgPath } from 'in-sdk/iconRegistry';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Link from 'in-components/Link';

import locals from './TechnologyListing.mless';

export default function TechnologyListing({ technologies, getHref }) {
  return (
    <div className={locals.techCell}>
      {technologies.length > 0
        ? technologies.map((tech, i) => <Tech key={i} name={tech} getHref={getHref} />)
        : valueMissingPlaceholder}
    </div>
  );
}

function Tech({ name, getHref }) {
  return (
    <Link className={locals.link} href$={getHref && getHref({ group: { groupbyTag: 'runtime' }, name })}>
      <SvgIcon
        className={evaluateClassNames({
          [locals.icon]: true,
          [locals.iconLinkable]: getHref
        })}
        iconPath={getIconSvgPath(name)}
        size="xs"
      />
      {getTechnologyLabel(name)}
    </Link>
  );
}
