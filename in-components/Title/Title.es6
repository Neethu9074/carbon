import withSideEffect from 'react-side-effect';
import config from 'in-services/config';

const MAX_TITLE_LENGTH = 30;

function setTitle(titles) {
  titles[0] = titles[0] + ` - Instana (${config.tenantUnit}-${config.tenant})`;
  document.title = titles.reverse().join(' - ');
}

function reduceProps(propsList) {
  return limitTitleLength(propsList.reduce((result, props) => result.concat(props.title), []));
}

function limitTitleLength(titles) {
  return titles.map((title, index) => {
    if (index === 0 || title.length < MAX_TITLE_LENGTH) {
      //the first one will be instana - unit/tenant. we don't want to cut this ever.
      return title;
    } else {
      return `${title.substring(0, MAX_TITLE_LENGTH)}...`;
    }
  });
}

export default withSideEffect(reduceProps, setTitle)(() => null);
