import PropTypes from 'prop-types';
import { useContext } from 'react';

import { pathPropType, normalizePath } from 'in-components/form/binding/paths';
import { FormContext } from 'in-components/form/binding/FormContext';

export default function FormBound({ path, autoHide, children }) {
  const { form, setForm, rootPath, disabled } = useContext(FormContext);
  const absolutePath = normalizePath(rootPath, path);
  const pathId = absolutePath.join('/');

  let item;
  try {
    item = form.getIn(absolutePath);
  } catch {
    if (autoHide) {
      return null;
    }
    throw new Error(`No such form item at path: ${pathId}`);
  }

  return children({
    form,
    setForm,
    disabled,
    absolutePath,
    pathId,
    item
  });
}

FormBound.propTypes = {
  path: pathPropType.isRequired,
  autoHide: PropTypes.bool,
  children: PropTypes.func.isRequired
};
