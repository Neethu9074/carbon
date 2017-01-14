import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import SvgIcon from 'in-components/SvgIcon';

import './MatchPresenter.less';

const block = 'in-config-generic-ex-rule-match-presenter';

export default function MatchPresenter({match, prefix}) {
  let content;
  let captureGroups;

  if (match) {
    content = (
      <div>
        <SvgIcon type='ok'
                 height={13}
                 className={`${block}__indicator ${block}__indicator--match`} />
        Matches
      </div>
    );

    if (match.length > 1) {
      captureGroups = (
        <div>
          <span className={`${block}__capture-groups`}>
            Capture Groups
          </span>

          <DescriptionList className={`${block}__groups`}>
            {match.map((m, i) => {
              let title = `${prefix}${i}`;
              if (i === 0) {
                title = `${title} (full match)`;
              }
              return (
                <DescriptionItem title={title}
                                 key={i}>
                  <code>{m || '<emtpy string>'}</code>
                </DescriptionItem>
              );
            })}
          </DescriptionList>
        </div>
      );
    }
  } else {
    content = (
      <div>
        <SvgIcon type='x'
                 height={13}
                 className={`${block}__indicator ${block}__indicator--no-match`} />
        No match
      </div>
    );
  }

  return (
    <div className={block}>
      <span className={`${block}__label`}>
        Matching Results
      </span>

      {content}

      {captureGroups}
    </div>
  );
}
