import React from 'react';

import {setSortDirection} from 'in-components/eventView/stores/sortDirection';
import {setSortBy} from 'in-components/eventView/stores/sortBy';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './FilterMenu.less';


const block = 'in-event-filter-menu';

export default connectTo({

},
function FilterMenu({field, closeMenu}) {

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
          Sort Z &rarr; A
        </Entry>
      </Row>

      <Row>
        <Entry onClick={closeMenu}>
          Apply
        </Entry>
        <Entry onClick={closeMenu}
                kind='secondary'>
          Cancel
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
            onClick={onClick}>
      {children}
    </Button>
  );
}

function getQueryFieldNameForField(field) {
  switch (field) {
    case 'Start':
      return 'start';
    case 'End':
      return 'end';
    case 'Title':
      return 'event.problemText';
    case 'Severity':
      return 'event.severity';
    default:
      return null;
  }
}
