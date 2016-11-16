import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import addSection from 'in-views/eventView/hocs/addSection';
import {toHtml} from 'in-services/formatters/markdown';

import 'in-views/eventView/components/ProblemDescription.less';


const block = 'in-event-view-event-problem';

export default addSection(function EventProblem({event}) {
  const fixSuggestion = toHtml(event.getIn(['problem', 'fixSuggestion']));

  return (
    <DescriptionList>
      <DescriptionItem title='Detail'>
        <span className={`${block}__suggestion`}
              dangerouslySetInnerHTML={{__html: fixSuggestion}} />
      </DescriptionItem>
    </DescriptionList>
  );
});
