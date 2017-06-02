import { Map, fromJS } from 'immutable';
import React from 'react';

import { getLabel, getCategory, getTypeLabelSingular, getTypeLabelPlural, getCategoryIcon } from 'in-sdk/tracing';
import GroupingSorterSelectBox from 'in-views/traceAnalyticsView/components/GroupingSorterSelectBox';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import { groupSorting$ } from 'in-views/traceAnalyticsView/stores/groupSorting';
import { compareIgnoreCase as compareString } from 'in-services/util/string';
import { analysedTraces$ } from 'in-stores/traces/analytics/analysedTraces';
import TraceGroup from 'in-views/traceAnalyticsView/components/TraceGroup';
import spanCategoryColors from 'in-stores/colorCoding/spanCategories';
import Section from 'in-views/configurationView/components/Section';
import { createInverseComparator } from 'in-services/util/function';
import { getTraceAnalytics } from 'in-services/api/traceAnalytics';
import { compare as compareNumber } from 'in-services/util/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { joinClassNames } from 'in-services/util/classnames';
import { hexToRGB } from 'in-services/formatters/color';
import Toggle from 'in-components/form/Toggle';
import { dispose } from 'in-services/util/ro';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './TraceGroupings.less';

const block = 'in-trace-analytics-groupings';
const groupings = `${block}__groupings`;
const headerElement = `${block}__header`;
const headerCellElement = `${block}__header-cell`;
const activeHeaderCellElement = `${headerCellElement} ${headerCellElement}--active`;
const heading = `${block}__heading`;
const orderIconElement = `${block}__header-cell-order`;
const expandElement = `${block}__toggle-expand`;
const callsElement = `${block}__calls`;
const totalTimeElement = `${block}__total-time`;
const minElement = `${block}__min`;
const avgElement = `${block}__avg`;
const maxElement = `${block}__max`;
const errorsElement = `${block}__errors`;
const callElement = `${block}__call`;
const kpiElement = `${block}__kpi`;
const kpiWrapperElement = `${block}__kpi-wrapper`;
const descriptionElement = `${block}__description`;

export default connectTo(
  {
    groupSorting: groupSorting$
  },
  class TraceGroupings extends React.PureComponent {
    constructor() {
      super();

      this.traceIdsSubscription = null;
      this.traceGroupingsSubscription = null;
      this.traceGroupsComparatorMap = new Map([
        ['total', compareTraceGroupByDurationTotal],
        ['calls', compareTraceGroupByCount],
        ['errors', compareTraceGroupByErrorPercentage]
      ]);
      this.state = {
        traceIds: [],
        loading: true,
        traceGroups: [],
        error: null,
        showLatencyMetrics: false
      };
    }

    componentDidMount() {
      this.traceIdsSubscription = analysedTraces$
        .map(traces => {
          const ids = [];
          traces.forEach((trace, traceId) => {
            ids.push(traceId);
          });
          return ids;
        })
        .subscribe(this.onNewTraceIds);
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
      const typeLabel = traceGroup.statistics.count === 1
        ? getTypeLabelSingular(fakeSpan)
        : getTypeLabelPlural(fakeSpan);

      const categoryColor = spanCategoryColors[category];
      const categoryColorRgb = hexToRGB(categoryColor);
      const categoryBackgroundOpaque = { background: categoryColor };
      const categoryBackgroundTransparent = {
        background: `rgba(${categoryColorRgb.r}, ${categoryColorRgb.g}, ${categoryColorRgb.b}, 0.1)`,
        margin: `0 0 0 ${level * 20}px`,
        borderLeft: `3px solid ${categoryColor}`,
        detailBorderLeft: `${28 + level * 20}px solid white`
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
      const { isLoading, error, traceGroups, showLatencyMetrics } = this.state;
      if (isLoading) {
        return <LoadingIndicator type="dark" />;
      } else if (error) {
        return (
          <p className={`${block}__error`}>
            {error}
          </p>
        );
      }

      const groupSorting = this.props.groupSorting;
      const traceGroupsComparator = this.traceGroupsComparatorMap.get(groupSorting);
      const comparator = createInverseComparator(traceGroupsComparator);

      return (
        <Section>
          <SectionHeading>
            Trace Groupings
          </SectionHeading>
          <DescriptionText />
          <div className={heading}>
            <Tooltip
              content="En- or disables the metrics for min, max and average latency in the trace grouping overview."
              align={'topMiddle'}
            >
              <div className={`${block}__heading`}>
                Analyse groups by: &nbsp;
                <GroupingSorterSelectBox />
              </div>
            </Tooltip>

            <Tooltip content="Describes the metric where the groups are sorted by" align={'topMiddle'}>
              <div className={`${block}__checkbox`}>
                Show latency metrics
                &nbsp;
                <Toggle
                  checked={showLatencyMetrics}
                  onChange={e => this.setState({ showLatencyMetrics: e.target.checked })}
                />
              </div>
            </Tooltip>
          </div>
          <div className={block}>
            <div className={headerElement}>
              <div className={expandElement}>&nbsp;</div>
              <HeaderCell
                className={callElement}
                style={{
                  width: `calc(100% - ${showLatencyMetrics ? '31' : '16'}.75rem)`
                }}
                activeComparator={traceGroupsComparator}
                comparator={compareTraceGroupByLabel}
              >
                Type & Call
              </HeaderCell>
              <HeaderCell
                className={totalTimeElement}
                activeComparator={traceGroupsComparator}
                comparator={compareTraceGroupByDurationTotal}
              >
                Total
              </HeaderCell>
              <HeaderCell
                className={errorsElement}
                activeComparator={traceGroupsComparator}
                comparator={compareTraceGroupByErrorPercentage}
              >
                Errors
              </HeaderCell>
              <HeaderCell
                className={callsElement}
                activeComparator={traceGroupsComparator}
                comparator={compareTraceGroupByCount}
              >
                #Calls
              </HeaderCell>
              {showLatencyMetrics
                ? <HeaderCell
                    className={minElement}
                    activeComparator={traceGroupsComparator}
                    comparator={compareTraceGroupByDurationMin}
                  >
                    Min
                  </HeaderCell>
                : null}
              {showLatencyMetrics
                ? <HeaderCell
                    className={avgElement}
                    activeComparator={traceGroupsComparator}
                    comparator={compareTraceGroupByDurationAvg}
                  >
                    Avg
                  </HeaderCell>
                : null}
              {showLatencyMetrics
                ? <HeaderCell
                    className={maxElement}
                    activeComparator={traceGroupsComparator}
                    comparator={compareTraceGroupByDurationMax}
                  >
                    Max
                  </HeaderCell>
                : null}
            </div>

            <ol className={groupings}>
              {traceGroups
                .sort(comparator)
                .map(traceGroup => (
                  <TraceGroup
                    key={traceGroup.hash}
                    showLatencyMetrics={showLatencyMetrics}
                    traceGroup={traceGroup}
                    level={0}
                    traceGroupsComparator={comparator}
                  />
                ))}
            </ol>
          </div>
        </Section>
      );
    }

    setOrder = (traceGroupsComparator, order) => {
      this.setState({
        traceGroupsComparator,
        order
      });
    };
  }
);

function HeaderCell({ children, activeComparator, comparator, className, style }) {
  const active = activeComparator === comparator;
  const baseClassName = active ? activeHeaderCellElement : headerCellElement;

  return (
    <div className={joinClassNames(baseClassName, className)} style={style}>
      {children}

      {active ? <SvgIcon className={orderIconElement} type={'triangle_down'} width={5} height={5} /> : null}
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

function DescriptionText() {
  return (
    <div className={descriptionElement}>
      Trace groups are calculated out of the selected traces and spans on the left. Spans are compared and grouped by specific properties, depending on the spans type.
      For a deep drill down, there are KPIs, helping you to understand and find the root cause. The KPIs are:
      <br />
      <div className={kpiWrapperElement}>
        <div className={kpiElement}>
          Total Time
        </div>
        <div className={kpiElement}>
          Error Rate
        </div>
        <div className={kpiElement}>
          Calls
        </div>
      </div>
    </div>
  );
}
