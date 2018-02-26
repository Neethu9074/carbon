import withSideEffect from 'react-side-effect';
import config from 'in-services/config';

const defaultTitleSuffix = `Instana (${config.tenantUnit}-${config.tenant})`;
const MAX_DYNAMIC_SEGMENT_LENGTH = 30;

function setTitle(titles) {
  document.title = titles
    .slice()
    .reverse()
    .join(' – ');
}

function reduceProps(propsList) {
  return propsList.reduce((result, props) => result.concat(toString(props)), [defaultTitleSuffix]);
}

function toString({ title, dynamic }) {
  if (dynamic == null) {
    return title;
  }

  dynamic =
    dynamic.length <= MAX_DYNAMIC_SEGMENT_LENGTH ? dynamic : dynamic.substring(0, MAX_DYNAMIC_SEGMENT_LENGTH) + '…';
  return `${title}: ${dynamic}`;
}

export default withSideEffect(reduceProps, setTitle)(() => null);
