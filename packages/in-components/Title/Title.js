import withSideEffect from 'react-side-effect';
import { sortedUniq } from 'lodash';

import { isBlank, isNotBlank } from 'in-services/util/string';
import config from 'in-services/config';

const defaultTitleSuffix = `Instana (${config.tenantUnit}-${config.tenant})`;
const MAX_DYNAMIC_SEGMENT_LENGTH = 30;

function setTitle(titles) {
  document.title = sortedUniq(titles.filter(isNotBlank).reverse()).join(' – ');
}

function reduceProps(propsList) {
  return propsList.reduce((result, props) => result.concat(toString(props)), [defaultTitleSuffix]);
}

function toString({ title, dynamic }) {
  if (isBlank(title)) {
    return null;
  }

  if (typeof dynamic != 'string' || dynamic === title) {
    return title;
  }

  dynamic =
    dynamic.length <= MAX_DYNAMIC_SEGMENT_LENGTH ? dynamic : dynamic.substring(0, MAX_DYNAMIC_SEGMENT_LENGTH) + '…';
  return `${title}: ${dynamic}`;
}

export default withSideEffect(reduceProps, setTitle)(() => null);
