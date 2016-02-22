/// <reference path="../../typings/runtime.d.ts" />

import {Snapshot} from 'in-services/types';

export interface DashboardContentProps {
  /**
   * The selected snapshot for which the dashboard
   * should be shown.
   */
  snapshot: Snapshot,

  /**
   * The user configured timeframe which defines how many
   * milliseconds worth of data should be shown in our
   * charts.
   */
  timeframe: number
}

export interface SidebarProps {
  /**
   * The selected snapshot for which the sidebar should be shown.
   */
  snapshot: Snapshot,
}

export interface PluginConfiguration {
  plugin: string,

  pluginName: {
    singular: string,
    plural: string
  },

  /**
   * Determine a human understandable label for this plugin. You may use
   * all the information found in the snapshot to provide good labels.
   * Example for a good label:
   *
   *  Node.js v4.2.1 executing nodejs-mongo
   *
   * @param snapshot The snapshot for which the label should be generated.
   * @return The human readable string.
   */
  getLabel(snapshot: Snapshot): string,

  /**
   * Should provide the path to an Icon for this plugin preferably in
   * an SVG format.
   *
   * @param snapshot If available, a snapshot will be passed in which can
   *   be used to further differentiate between icons. For instance this
   *   can be used to provide a Windows, Apple or Linux logo for hosts.
   * @return Path to the icon relative to document root or absolute. May
   *   also provide the icon in a base64 encoded format.
   */
  getIcon(snapshot?: Snapshot): string,

  /**
   * Calculate a snapshots power as in how capable is this component. This
   * information is used to compare snapshot's of the same type. Also, we
   * use this information to render snapshot boxes in the 3D map with
   * varying heights. More capable snapshots should have a larger power.
   *
   * By default a power of 1 will be used.
   */
  getPower?(snapshot: Snapshot): number,

  /**
   * Defines the look and feel for this plugin's sidebar as seen in the
   * map when selecting a snapshot.
   */
  mapSidebar?: __React.ComponentClass<SidebarProps>,

  /**
   * Defines the look and feel plugin's sidebar as seen in the dashboard.
   */
  dashboardSidebar: __React.ComponentClass<SidebarProps>,

  /**
   * Defines the content area for the dashboard when inspecting a snapshot
   * of this plugin's type.
   */
  dashboardContent: __React.ComponentClass<DashboardContentProps>
}
