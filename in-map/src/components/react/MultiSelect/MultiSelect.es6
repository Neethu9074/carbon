import React from 'react';

import {multiSelection$, toggleMultiSelection} from 'in-map/src/stores/multiSelection';
import {view, types as views} from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';

import 'in-map/src/components/react/MultiSelect/MultiSelect.less';


const block = 'in-switcher-multi-select';

export default connectTo({
    multiSelection: multiSelection$,
    currentView: view
  }, MultiSelect
);

function MultiSelect({currentView, multiSelection}) {
  if (!currentView || currentView !== views.process) {
    return null;
  }

  return (
    <div className={block}
         onClick={toggleMultiSelection}>
      {multiSelection ? 'MultiSelect Off' : 'MultiSelect On'}
    </div>
  );
}

const rpt = React.PropTypes;
MultiSelect.propTypes = {
  multiSelection: rpt.bool,
  currentView: rpt.string
};
