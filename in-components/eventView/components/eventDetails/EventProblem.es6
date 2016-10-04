import React from 'react';

import {toHtml} from 'in-services/formatters/markdown';
import SvgIcon from 'in-components/SvgIcon';

import './EventProblem.less';


const block = 'in-event-view-event-problem';

export default function EventProblem({event}) {
  const fixSuggestion = toHtml(event.getIn(['problem', 'fixSuggestion']));

  return (
    <div className={`${block}`}>
      <SvgIcon className={`${block}__icon`}
               type='info_filled'
               width={20}
               height={20}
               color={'#7b8e96'} />

      <div className={`${block}__text-wrapper`}>
        <span className={`${block}__heading`}>
          Fix suggestion
        </span>
        <span className={`${block}__suggestion`}
              dangerouslySetInnerHTML={{__html: fixSuggestion}} />
      </div>
    </div>
  );
}
