/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import withSideEffect from 'react-side-effect';
import { sortedUniq } from 'lodash';

import { setTitles as setTitlesForTracking } from 'in-services/tracking/tracking';
import { isBlank, isNotBlank } from 'in-services/util/string';
import config from 'in-services/config';

const defaultTitleSuffix = `Instana (${config.tenantUnit}-${config.tenant})`;
const MAX_DYNAMIC_SEGMENT_LENGTH = 30;

function setTitle(titles) {
  setTitlesForTracking(titles);

  document.title = [defaultTitleSuffix]
    .concat(sortedUniq(titles.map(toString).filter(isNotBlank)))
    .reverse()
    .join(' – ');
}

function reduceProps(propsList) {
  return propsList.reduce((result, props) => result.concat(props), []);
}

function toString({ title, dynamic }) {
  if (isBlank(title)) {
    return null;
  }

  if (typeof dynamic != 'string' || dynamic === title || isBlank(dynamic)) {
    return title;
  }

  dynamic =
    dynamic.length <= MAX_DYNAMIC_SEGMENT_LENGTH ? dynamic : dynamic.substring(0, MAX_DYNAMIC_SEGMENT_LENGTH) + '…';
  return `${title}: ${dynamic}`;
}

export default withSideEffect(reduceProps, setTitle)(() => null);
