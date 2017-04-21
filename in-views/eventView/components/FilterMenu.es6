import React from 'react';

import {setSortDirection} from 'in-views/eventView/stores/sortDirection';
import {setSortBy} from 'in-views/eventView/stores/sortBy';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './FilterMenu.less';


const block = 'in-event-filter-menu';

export default connectTo({

},
function FilterMenu({field, closeMenu}) {
  if (field === 'severity') {
    const critical = (
      <SvgIcon type='critical'
               width={10}
               height={10}
               color='#000' />
    );
    const change = (
      <SvgIcon type='change2'
               width={10}
               height={10}
               color='#000' />
    );

    return (
      <div className={block}>
        <Row>
          <Entry onClick={() =>  {
            setSortDirection('asc');
            setSortBy(getQueryFieldNameForField(field));
            closeMenu();
          }}>
            <div className={`${block}__flex-wrapper`}>
              {change}
              &rarr;
              {critical}
            </div>
          </Entry>
          <Entry onClick={() => {
            setSortDirection('desc');
            setSortBy(getQueryFieldNameForField(field));
            closeMenu();
          }}>
            <div className={`${block}__flex-wrapper`}>
              {critical}
              &rarr;
              {change}
            </div>
          </Entry>
        </Row>
      </div>
    );
  }

  return (
    <div className={block}>
      <Row>
        <Entry onClick={() =>  {
          setSortDirection('asc');
          setSortBy(getQueryFieldNameForField(field));
          closeMenu();
        }}>
          Sort A &rarr; Z
        </Entry>
        <Entry onClick={() => {
          setSortDirection('desc');
          setSortBy(getQueryFieldNameForField(field));
          closeMenu();
        }}>
          Sort Z &rarr; + A
        </Entry>
      </Row>
    </div>
  );
});

function Row({children}) {
  return (
    <div className={`${block}__row`}>
      {children}
    </div>
  );
}

function Entry({onClick, children, kind}) {
  return (
    <Button className={`${block}__button`}
            kind={kind ? kind : null}
            size='sm'
            onClick={onClick}>
      {children}
    </Button>
  );
}

export function getQueryFieldNameForField(field) {
  switch (field) {
    case 'title':
      return 'problem.problemText';
    case 'severity':
      return 'problem.severity';
    case 'triggered':
      return 'triggeringTime';
    default:
      return field;
  }
}
