import React from 'react';

import {toHtml} from 'in-services/formatters/markdown';
import SvgIcon from 'in-components/SvgIcon';

import 'in-components/eventView/components/ProblemDescription.less';


const block = 'in-event-view-event-problem';

export default function EventProblem({event, className}) {
  const fixSuggestion = toHtml(event.getIn(['problem', 'fixSuggestion']));

  let blockClassName = block;
  if (className) {
    blockClassName += ` ${className}`;
  }

  return (
    <div className={blockClassName}>
      <div className={`${block}__icon-wrapper`}>
        <SvgIcon type='info_filled'
                 width={20}
                 height={20}
                 color={'#7b8e96'} />
      </div>

      <div className={`${block}__text-wrapper`}>
        <span className={`${block}__heading`}>
          Detail
        </span>
        <span className={`${block}__suggestion`}
              dangerouslySetInnerHTML={{__html: fixSuggestion}} />
      </div>
    </div>
  );
}
