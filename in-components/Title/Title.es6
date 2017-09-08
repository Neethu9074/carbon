import withSideEffect from 'react-side-effect';
import config from 'in-services/config';

const MAX_TITLE_LENGTH = 30;

function setTitle(titles) {
  titles[0] = titles[0] + ` - Instana (${config.tenantUnit}-${config.tenant})`;
  document.title = titles.reverse().join(' - ');
}

function reduceProps(propsList) {
  return propsList.reduce((result, props) => result.concat(limitLength(props)), []);
}

/**
 * a dynamic part of a title might be limited by
 * length as the could become very large (e.g error messages)
 * @param props
 * @returns {*}
 */
function limitLength(props) {
  const { title, dynamic } = props;

  if (dynamic == null) {
    return title;
  } else {
    return `${title} > ${dynamic.length <= MAX_TITLE_LENGTH ? dynamic : dynamic.substring(0, MAX_TITLE_LENGTH)}...`;
  }
}

export default withSideEffect(reduceProps, setTitle)(() => null);
