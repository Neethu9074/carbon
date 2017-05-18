import { Map, fromJS } from 'immutable';
import React from 'react';

import { getLabel, getCategory, getTypeLabelSingular, getTypeLabelPlural, getCategoryIcon } from 'in-sdk/tracing';
import { compareIgnoreCase as compareString } from 'in-services/util/string';
import TraceGroup from 'in-views/traceAnalyticsView/components/TraceGroup';
import spanCategoryColors from 'in-stores/colorCoding/spanCategories';
import { createInverseComparator } from 'in-services/util/function';
import { getTraceAnalytics } from 'in-services/api/traceAnalytics';
import { compare as compareNumber } from 'in-services/util/number';
import { selectedTraceIds$ } from 'in-stores/traces/analytics';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { joinClassNames } from 'in-services/util/classnames';
import { hexToRGB } from 'in-services/formatters/color';
import { dispose } from 'in-services/util/ro';
import SvgIcon from 'in-components/SvgIcon';

import './TraceGroupings.less';

const block = 'in-trace-analytics-groupings';
const headerElement = `${block}__header`;
const headerCellElement = `${block}__header-cell`;
const activeHeaderCellElement = `${headerCellElement} ${headerCellElement}--active`;
const orderIconElement = `${block}__header-cell-order`;
const expandElement = `${block}__toggle-expand`;
const callsElement = `${block}__calls`;
const totalTimeElement = `${block}__total-time`;
const minElement = `${block}__min`;
const avgElement = `${block}__avg`;
const maxElement = `${block}__max`;
const errorsElement = `${block}__errors`;
const callElement = `${block}__call`;

export default class TraceGroupings extends React.PureComponent {
  constructor() {
    super();

    this.traceIdsSubscription = null;
    this.traceGroupingsSubscription = null;
    this.state = {
      traceIds: [],
      loading: true,
      traceGroups: [],
      error: null,
      order: 'desc',
      traceGroupsComparator: compareTraceGroupByDurationTotal
    };
  }

  componentDidMount() {
    this.traceIdsSubscription = selectedTraceIds$.subscribe(this.onNewTraceIds);
  }

  onNewTraceIds = traceIds => {
    this.traceGroupingsSubscription = dispose(this.traceGroupingsSubscription);

    this.setState({
      traceIds,
      isLoading: true,
      traceGroups: [],
      error: null
    });

    this.traceGroupingsSubscription = getTraceAnalytics({ traceIds }).once(
      traceGroups => {
        this.enrichGroups(traceGroups);
        this.setState({
          traceIds,
          isLoading: false,
          traceGroups: traceGroups,
          error: null
        });
      },
      error => {
        this.setState({
          traceIds,
          isLoading: false,
          traceGroups: [],
          error: error.message
        });
      }
    );
  };

  enrichGroups(traceGroups, level = 0) {
    for (let i = 0; i < traceGroups.length; i++) {
      this.enrichGroup(traceGroups[i], level);
    }
  }

  enrichGroup(traceGroup, level) {
    const fakeSpan = Map({
      name: traceGroup.spanType,
      data: fromJS(traceGroup.dataSample)
    });
    const category = getCategory(fakeSpan);
    const typeLabel = traceGroup.statistics.count === 1 ? getTypeLabelSingular(fakeSpan) : getTypeLabelPlural(fakeSpan);

    const categoryColor = spanCategoryColors[category];
    const categoryColorRgb = hexToRGB(categoryColor);
    const categoryBackgroundOpaque = { background: categoryColor };
    const categoryBackgroundTransparent = {
      background: `rgba(${categoryColorRgb.r}, ${categoryColorRgb.g}, ${categoryColorRgb.b}, 0.1)`,
      margin: `0 0 0 ${level * 20}px`,
      borderLeft: `3px solid ${categoryColor}`
    };

    traceGroup.enrichment = {
      fakeSpan,
      label: getLabel(fakeSpan),
      category,
      categoryIcon: getCategoryIcon(category),
      categoryBackgroundOpaque,
      categoryBackgroundTransparent,
      typeLabel,
      errorPercentage: 1 / traceGroup.statistics.count * traceGroup.statistics.errorCount
    };

    this.enrichGroups(traceGroup.children, level + 1);
  }

  componentWillUnmount() {
    this.traceIdsSubscription = dispose(this.traceIdsSubscription);
    this.traceGroupingsSubscription = dispose(this.traceGroupingsSubscription);
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator type="dark" />;
    } else if (this.state.error) {
      return (
        <p className={`${block}__error`}>
          {this.state.error}
        </p>
      );
    }

    const { traceGroupsComparator, order } = this.state;

    const comparator = order === 'desc' ? createInverseComparator(traceGroupsComparator) : traceGroupsComparator;

    return (
      <div className={block}>
        <div className={headerElement}>
          <div className={expandElement}>&nbsp;</div>
          <HeaderCell
            className={callsElement}
            activeComparator={traceGroupsComparator}
            comparator={compareTraceGroupByCount}
            activeOrder={order}
            setOrder={this.setOrder}
            defaultOrder="desc"
          >
            #Calls
          </HeaderCell>
          <HeaderCell
            className={totalTimeElement}
            activeComparator={traceGroupsComparator}
            comparator={compareTraceGroupByDurationTotal}
            activeOrder={order}
            setOrder={this.setOrder}
            defaultOrder="desc"
          >
            Total
          </HeaderCell>
          <HeaderCell
            className={minElement}
            activeComparator={traceGroupsComparator}
            comparator={compareTraceGroupByDurationMin}
            activeOrder={order}
            setOrder={this.setOrder}
            defaultOrder="desc"
          >
            Min
          </HeaderCell>
          <HeaderCell
            className={avgElement}
            activeComparator={traceGroupsComparator}
            comparator={compareTraceGroupByDurationAvg}
            activeOrder={order}
            setOrder={this.setOrder}
            defaultOrder="desc"
          >
            Avg
          </HeaderCell>
          <HeaderCell
            className={maxElement}
            activeComparator={traceGroupsComparator}
            comparator={compareTraceGroupByDurationMax}
            activeOrder={order}
            setOrder={this.setOrder}
            defaultOrder="desc"
          >
            Max
          </HeaderCell>
          <HeaderCell
            className={errorsElement}
            activeComparator={traceGroupsComparator}
            comparator={compareTraceGroupByErrorPercentage}
            activeOrder={order}
            setOrder={this.setOrder}
            defaultOrder="desc"
          >
            Errors
          </HeaderCell>
          <HeaderCell
            className={callElement}
            activeComparator={traceGroupsComparator}
            comparator={compareTraceGroupByLabel}
            activeOrder={order}
            setOrder={this.setOrder}
            defaultOrder="asc"
          >
            Type & Call
          </HeaderCell>
        </div>

        <ol className={`${block}__groupings`}>
          {this.state.traceGroups
            .sort(comparator)
            .map(traceGroup => (
              <TraceGroup key={traceGroup.hash} traceGroup={traceGroup} level={0} traceGroupsComparator={comparator} />
            ))}
        </ol>
      </div>
    );
  }

  setOrder = (traceGroupsComparator, order) => {
    this.setState({
      traceGroupsComparator,
      order
    });
  };
}

function HeaderCell({ children, activeComparator, comparator, className, activeOrder, setOrder, defaultOrder }) {
  const active = activeComparator === comparator;
  const onClick = () => {
    if (active) {
      const newOrder = activeOrder === 'asc' ? 'desc' : 'asc';
      setOrder(comparator, newOrder);
    } else {
      setOrder(comparator, defaultOrder);
    }
  };

  const baseClassName = active ? activeHeaderCellElement : headerCellElement;

  return (
    <div className={joinClassNames(baseClassName, className)} onClick={onClick}>
      {children}

      {active
        ? <SvgIcon
            className={orderIconElement}
            type={activeOrder === 'asc' ? 'triangle_up' : 'triangle_down'}
            width={5}
            height={5}
          />
        : null}
    </div>
  );
}

function compareTraceGroupByCount(a, b) {
  return compareNumber(a.statistics.count, b.statistics.count);
}

function compareTraceGroupByDurationTotal(a, b) {
  return compareNumber(a.statistics.durationTotal, b.statistics.durationTotal);
}

function compareTraceGroupByDurationMin(a, b) {
  return compareNumber(a.statistics.durationMin, b.statistics.durationMin);
}

function compareTraceGroupByDurationAvg(a, b) {
  return compareNumber(a.statistics.durationAvg, b.statistics.durationAvg);
}

function compareTraceGroupByDurationMax(a, b) {
  return compareNumber(a.statistics.durationMax, b.statistics.durationMax);
}

function compareTraceGroupByErrorPercentage(a, b) {
  return compareNumber(a.enrichment.errorPercentage, b.enrichment.errorPercentage);
}

function compareTraceGroupByLabel(a, b) {
  return compareString(a.enrichment.label, b.enrichment.label);
}
