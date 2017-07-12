import React from 'react';

import { toggleDevPanel, devPanelVisible$ } from 'in-components/DeveloperPanel/stores/visibilityStore';
import MapStatistics from 'in-components/DeveloperPanel/components/MapStatistics';
import Charts from 'in-components/DeveloperPanel/components/Charts';
import { evaluateClassNames } from 'in-services/util/classnames';
import Misc from 'in-components/DeveloperPanel/components/Misc';
import { SvgIconList } from 'in-components/SvgIcon';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './DeveloperPanel.less';

const block = 'in-dev-panel';

export default connectTo(
  {
    devPanelVisible: devPanelVisible$
  },
  class extends React.Component {
    static displayName = 'DeveloperPanel';

    state = {
      activeMenu: SvgIconList
    };

    render() {
      const { devPanelVisible } = this.props;
      if (!devPanelVisible) {
        return null;
      }

      return (
        <div className={block}>
          <div className={`${block}__header`}>
            <SvgIcon type="x" height={13} width={13} className={`${block}__icon`} onClick={toggleDevPanel} />
          </div>
          <div className={`${block}__tabs`}>
            <Tab
              title="Icons"
              activeMenu={this.state.activeMenu}
              onClick={activeMenu => this.setState({ activeMenu })}
              menu={SvgIconList}
            />
            <Tab
              title="3D statistics"
              activeMenu={this.state.activeMenu}
              onClick={activeMenu => this.setState({ activeMenu })}
              menu={MapStatistics}
            />
            <Tab
              title="Charts"
              activeMenu={this.state.activeMenu}
              onClick={activeMenu => this.setState({ activeMenu })}
              menu={Charts}
            />
            <Tab
              title="Misc"
              activeMenu={this.state.activeMenu}
              onClick={activeMenu => this.setState({ activeMenu })}
              menu={Misc}
            />
          </div>
          <div className={`${block}__content`}>
            <this.state.activeMenu />
          </div>
        </div>
      );
    }
  }
);

function Tab({ title, onClick, activeMenu, menu }) {
  return (
    <div
      className={evaluateClassNames({
        [`${block}__tab`]: true,
        [`${block}__tab--active`]: activeMenu === menu
      })}
      onClick={() => onClick(menu)}
    >
      {title}
    </div>
  );
}
