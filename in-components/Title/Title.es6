import withSideEffect from 'react-side-effect';
import config from 'in-services/config';

function setTitle(titles) {
  //console.log(titles);
  // Todo: do we still want to have this Instana - unit-tenant?
  titles[0] = titles[0] + ` – Instana (${config.tenantUnit}-${config.tenant})`;
  document.title = titles.join(' > ');
}

function reduceProps(propsList) {
  return propsList.reduce((result, props) => result.concat(props.title), []);
}

export default withSideEffect(reduceProps, setTitle)(() => null);
