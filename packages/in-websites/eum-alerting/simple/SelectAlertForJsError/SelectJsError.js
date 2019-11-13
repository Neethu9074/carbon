import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Button from 'in-new-components/Button/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SelectJsError.mless';

export function SelectJsError({ onSelectClick, error = null }) {
  return (
    <div className={locals.container}>
      {error ? (
        <div className={locals.message}>
          <SvgIcon className={locals.icon} type="lib_help_error_warning" />
          <div>
            <span className={locals.label}>Error Message</span>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <Fragment>
          <p>Please select a JS error first, then click the &quot;Create Alert&quot; button</p>
          <Button onClick={onSelectClick}>Select JS Error</Button>
        </Fragment>
      )}
    </div>
  );
}

SelectJsError.propTypes = {
  onSelectClick: PropTypes.func.isRequired,
  error: PropTypes.string
};
