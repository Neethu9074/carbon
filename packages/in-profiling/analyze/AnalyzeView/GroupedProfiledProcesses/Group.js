import { get } from 'lodash';
import React from 'react';

import TechnologyListing from 'in-profiling/analyze/AnalyzeView/commonComponents/TechnologyListing';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { Tr, Td } from 'in-components/tables/sharedComponents';
import { number } from 'in-services/formatters/number';
import { getIconSvgPath } from 'in-sdk/iconRegistry';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Link from 'in-components/Link';

import locals from './Group.mless';

export default function Group({ item, getGroupAsFilterUrl }) {
  const { groupName, technologies, metrics } = item;

  const numProcesses = get(metrics, ['processes', 0, 1]);

  return (
    <Tr size="compact">
      <Td ellipsis="50vw">
        <Link className={locals.link} href$={getGroupAsFilterUrl({ name: groupName })}>
          <SvgIcon className={locals.icon} iconPath={getIconSvgPath(technologies[0])} size="xs" />
          {groupName}
        </Link>
      </Td>
      <Td noWrap>
        <TechnologyListing technologies={technologies} getHref={getGroupAsFilterUrl} />
      </Td>

      <Td noWrap>{numProcesses ? number.compact(numProcesses) : valueMissingPlaceholder}</Td>
    </Tr>
  );
}
