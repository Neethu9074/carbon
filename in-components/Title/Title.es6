import withSideEffect from 'react-side-effect';
import config from 'in-services/config';

const MAX_TITLE_LENGTH = 30;

function setTitle(titles) {
  setInstanaToTitle(titles);
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
    return `${title} > ${dynamic.length <= MAX_TITLE_LENGTH ? dynamic : dynamic.substring(0, MAX_TITLE_LENGTH) + '…'}`;
  }
}

/**
 * setting the instana title at the beginning
 * @param titles
 * @returns {*}
 */
function setInstanaToTitle(titles) {
  const instanaTitle = `Instana (${config.tenantUnit}-${config.tenant}`;
  if (titles.length === 0) {
    return instanaTitle;
  } else {
    titles[0] = titles[0] + ` - ${instanaTitle})`;
    return titles;
  }
}

export default withSideEffect(reduceProps, setTitle)(() => null);
