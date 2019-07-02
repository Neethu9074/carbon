import { compose, withState } from 'recompose';
import React, { Fragment } from 'react';

import CustomChartWrapper from 'in-custom-dashboards/components/CustomChart';
import CustomTableWrapper from 'in-custom-dashboards/components/CustomTable';
import SectionHeader from 'in-custom-dashboards/components/SectionHeader';
import CustomList from 'in-custom-dashboards/components/CustomList';
import configuration from 'in-custom-dashboards/proposed-config';
import { Col, Row } from 'in-new-components/layout/Grid';

export default compose(withState('configuration', 'setConfiguratin', configuration))(DashboardView);

function DashboardView({ configuration }) {
  const { panels, layout } = configuration;

  return (
    <Fragment>
      {layout.map((section, index) => (
        <DashboardSection key={index} section={section} panels={panels} />
      ))}
    </Fragment>
  );
}

function DashboardSection({ section: rowPanels, panels }) {
  return (
    <Row>
      {rowPanels.filter(Boolean).map(panelId => {
        const panel = panels.filter(panel => panel.id == panelId)[0];
        const { panelType } = panel;
        return (
          <Col lg={calculatePanelWidth(rowPanels)} key={panelId}>
            {renderer(panel)[panelType]}
          </Col>
        );
      })}
    </Row>
  );
}

function renderer(props) {
  return {
    'section-title': <SectionHeader panel={props} />,
    chart: <CustomChartWrapper panel={props} />,
    table: <CustomTableWrapper panel={props} />,
    list: <CustomList panel={props} />
  };
}

function calculatePanelWidth(row) {
  return 12 / row.length;
}
