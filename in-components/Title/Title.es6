import withSideEffect from 'react-side-effect';
import config from 'in-services/config';

function setTitle(titles) {
  titles[0] = titles[0] + ` - Instana (${config.tenantUnit}-${config.tenant})`;
  document.title = titles.reverse().join(' - ');
}

function reduceProps(propsList) {
  return propsList.reduce((result, props) => result.concat(props.title), []);
}

export default withSideEffect(reduceProps, setTitle)(() => null);
