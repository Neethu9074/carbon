import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { evaluateClassNames } from 'in-services/util/classnames';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './ExpandButton.mless';

export default connectTo(
  props => ({
    isLoading: props.events$.on(`isLoadingData_${props.direction}`).distinct(),
    isExpanded: props.events$.on(`isExpanded_${props.direction}`).distinct(),
    errors: props.events$.on(`errors_${props.direction}`).distinct()
  }),
  function ExpandButton({ className, isLoading, isExpanded, errors, onClick, direction }) {
    if (isExpanded) {
      return null;
    }
    const hasErrors = errors && errors.length > 0;
    return (
      <Tooltip content={hasErrors ? <ErroneousResultPresenter errors={errors} /> : null}>
        <div
          className={evaluateClassNames({
            [locals.expandButtonRight]: direction === 'outgoing',
            [locals.expandButtonLeft]: direction === 'incoming',
            [locals.errorneousExpandIcon]: errors && errors.length > 0,
            [className]: className
          })}
          onClick={onClick}
        >
          <SvgIcon
            className={locals.expandIcon}
            type={isLoading ? 'lib_actions_loading' : 'lib_openclose_add'}
            width={24}
            height={24}
            spinning={isLoading}
          />
        </div>
      </Tooltip>
    );
  }
);
