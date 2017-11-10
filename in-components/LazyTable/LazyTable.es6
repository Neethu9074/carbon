import React from 'react';

import Column from 'in-components/LazyTable/components/Column';
import Row from 'in-components/LazyTable/components/Row';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './LazyTable.less';

const block = 'in-lazy-table';

export default class extends React.Component {
  static displayName = 'LazyTable';

  render() {
    const props = this.props;
    const { cols, rows, maxHeight } = props;
    this.calculateDynamicColumnDimensions(cols);

    return (
      <div className={block} style={{ maxHeight }}>
        <Columns {...props} />

        <div className={`${block}__content`}>
          {rows.map(row => <Row key={row.key} row={row} {...props} />)}

          <div className={`${block}__button-wrapper`}>
            <LoadMoreButton {...props} />
          </div>
        </div>
      </div>
    );
  }

  calculateDynamicColumnDimensions(cols) {
    let numDynamicCols = 0;
    let totalWidthOfStaticRows = 0;

    cols.forEach(col => {
      col.isStaticWidth = !isNaN(Number(col.width));
      if (!col.isStaticWidth) {
        numDynamicCols++;
      } else {
        totalWidthOfStaticRows += col.width;
      }
    });

    const dynamicCols = [];
    cols.forEach(col => {
      if (!col.isStaticWidth) {
        dynamicCols.push(col);
        col.width = `calc(${100 * (1 / numDynamicCols)}% - ${totalWidthOfStaticRows / numDynamicCols}px)`;
      }
    });
  }
}

const LoadMoreButton = connectTo(
  props => ({
    furtherDataAvailable: props.furtherDataAvailable$
  }),
  function LoadMoreButton({ furtherDataAvailable, loadMoreData }) {
    if (!furtherDataAvailable) {
      return null;
    }
    return (
      <Button className={`${block}__button`} onClick={loadMoreData}>
        load more
      </Button>
    );
  }
);

const Columns = connectTo(props => ({ sortBy: props.sortBy$, sortDirection: props.sortDirection$ }), function Columns({
  cols,
  onSortingChanged,
  sortBy,
  sortDirection
}) {
  return (
    <div className={`${block}__header`}>
      {cols.map(col => (
        <Column
          key={col.title}
          col={col}
          onClick={onSortingChanged}
          isSelected={sortBy === col.field}
          sortDirection={sortDirection}
        />
      ))}
    </div>
  );
});
