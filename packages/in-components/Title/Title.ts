/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { sortedUniq } from 'lodash';

import { setTitles as setTitlesForTracking } from 'in-services/tracking/tracking';
import createSideEffectHook from 'in-hooks/createSideEffectHook';
import { isBlank, isNotBlank } from 'in-services/util/string';
import config from 'in-services/config';

const defaultTitleSuffix = `Instana (${config.tenantUnit}-${config.tenant})`;
const MAX_DYNAMIC_SEGMENT_LENGTH = 30;

const useSideEffect = createSideEffectHook<Props, Props[]>(
  propsList => propsList.slice(),
  titles => {
    setTitlesForTracking(titles);

    document.title = [defaultTitleSuffix]
      .concat(sortedUniq(titles.map(toString).filter(isNotBlank) as string[]))
      .reverse()
      .join(' – ');
  }
);

function toString({ title, dynamic }: Props): string | undefined {
  if (isBlank(title)) {
    return undefined;
  }

  if (typeof dynamic != 'string' || dynamic === title || isBlank(dynamic)) {
    return title;
  }

  dynamic =
    dynamic.length <= MAX_DYNAMIC_SEGMENT_LENGTH ? dynamic : dynamic.substring(0, MAX_DYNAMIC_SEGMENT_LENGTH) + '…';
  return `${title}: ${dynamic}`;
}

export interface Props {
  title?: string;
  dynamic?: string;
}

export default function Title(props: Props) {
  useSideEffect(props);
  return null;
}
