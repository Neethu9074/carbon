import React, { Fragment, useState } from 'react';

import Button from 'in-new-components/Button/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SelectJsError.mless';

// TODO: subscribe to selected js error observable
export function SelectJsError() {
  const [error, setError] = useState(null);

  const handleClick = () => {
    // TODO: hide dialog and go to errors page
    setError({
      message: `Uncaught RangeError: Invalid number of stars
    received. Value '6' is outside renderable range.
    Only values between 1 and 5 are supported!`
    });
  };

  // TODO: if error is selected, add it to form and show selected error message
  return (
    <div className={locals.container}>
      {error ? (
        <div className={locals.message}>
          <SvgIcon className={locals.icon} type="lib_help_error_warning" />
          <div>
            <span className={locals.label}>Error Message</span>
            <p>{error.message}</p>
          </div>
        </div>
      ) : (
        <Fragment>
          <p>Please select a JS error first, then click the &quot;Create Alert&quot; button</p>
          <Button onClick={handleClick}>Select JS Error</Button>
        </Fragment>
      )}
    </div>
  );
}

// SelectJsError.propTypes = {
//   form: PropTypes.object.isRequired
// };
