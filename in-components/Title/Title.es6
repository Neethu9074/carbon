import withSideEffect from 'react-side-effect';

function setTitle(titles) {
  document.title = titles.join(' > ');
}

function reduceProps(propsList) {
  return propsList.reduce((result, props) => result.concat(props.title), []);
}

export default withSideEffect(reduceProps, setTitle)(() => null);
