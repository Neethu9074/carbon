import { compose, withState } from 'recompose';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Card from 'in-new-components/Card';

import locals from './ExpandableCard.mless';

export default compose(withState('expanded', 'setExpanded', false))(ExpandableCard);

function ExpandableCard({ title, preview, children, header, expanded, setExpanded, expansionTracker }) {
  const rightSide = (
    <div className={locals.rightSide}>
      {header}

      <Tooltip content={expanded ? 'Show less' : 'Show more'}>
        <SvgIcon
          className={locals.icon}
          type={expanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
          onClick={() => {
            if (expansionTracker) {
              expansionTracker({
                expanded: !expanded
              });
            }
            setExpanded(!expanded);
          }}
          width={20}
          height={20}
        />
      </Tooltip>
    </div>
  );

  return (
    <Card title={title} titleSubText={!expanded && preview} header={rightSide} withoutPadding={!expanded}>
      {expanded && children}
    </Card>
  );
}
