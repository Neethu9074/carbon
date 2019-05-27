import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import ButtonGroup from 'in-new-components/ButtonGroup';

import locals from './ButtonSegmentedControl.mless';

export default function ButtonSegmentedControl(props) {
  const buttonPropsList = props.buttonPropsList.map(prop => {
    prop.className = evaluateClassNames({
      [locals.button]: true,
      [locals.activeButton]: props.activeKey === prop.key
    });
    return prop;
  });
  return <ButtonGroup className={locals.group} {...props} buttonPropsList={buttonPropsList} />;
}
