import { fromJS } from 'immutable';
import { filter } from 'lodash';
import React from 'react';

import Applications, {
  noRightHeader
} from 'in-settings/tabs/TeamSettings/pages/accessControl/PermissionSets/components/Applications';
import K8sNamespaces from 'in-settings/tabs/TeamSettings/pages/accessControl/PermissionSets/components/K8sNamespaces';
import K8sClusters from 'in-settings/tabs/TeamSettings/pages/accessControl/PermissionSets/components/K8sClusters';
import Websites from 'in-settings/tabs/TeamSettings/pages/accessControl/PermissionSets/components/Websites';
import { getK8sNamespaces, getApplications, getK8sClusters, getWebsites } from 'in-api/permissionSets';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { productAreaPermissions } from 'in-stores/permission';
import FormGroup from 'in-settings/components/FormGroup';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

export default function PermissionSetForm({ form, setForm, onChange }) {
  const selectedApplications = form.get('applicationIds') ? form.get('applicationIds').value.toJS() : [];
  const selectedK8sClusters = form.get('kubernetesClusterUUIDs') ? form.get('kubernetesClusterUUIDs').value.toJS() : [];
  const selectedK8sNamespaces = form.get('kubernetesNamespaceUIDs')
    ? form.get('kubernetesNamespaceUIDs').value.toJS()
    : [];
  const selectedWebsites = form.get('websiteIds') ? form.get('websiteIds').value.toJS() : [];

  return (
    <fieldset>
      <SectionHeading>General</SectionHeading>
      {form.get('name').map(field => (
        <FormGroup>
          <Label htmlFor="permission-set-name" hasError={!field.valid && field.touched}>
            Name
          </Label>
          <Input
            id="permission-set-name"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            autoFocus
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      <SectionHeading>Product Areas</SectionHeading>
      {productAreaPermissions.map(area => (
        <Permission
          key={area.value}
          form={form}
          setForm={setForm}
          permission={area.value}
          label={`Access '${area.label}' monitoring`}
          helpText={`Permits access to '${area.label}' monitoring functionality.`}
          disabled={false}
        />
      ))}

      <Applications
        setTitle={false}
        loadEntities={() => getSelectedApplicationConfigs(selectedApplications)}
        hasRowNavigation={false}
        noDataMessage="No Application Perspectives Selected"
        tableActions={applicationSelectionTableActions(form, setForm)}
        rightHeader={
          <SelectListDialogButton
            form={form}
            onSubmit={selectedIds => submitApplicationSelection(form, setForm, selectedIds)}
            title="Add Application Perspectives"
            label="Add Application Perspectives"
            listComponent={Applications}
            listComponentRightHeader={noRightHeader}
            hiddenIds={selectedApplications}
            createSubmitLabel={numberOfItems =>
              numberOfItems > 0 ? `Add ${numberOfItems} Application Perspective${numberOfItems > 1 ? 's' : ''}` : 'Add'
            }
            requiresAtLeastOneMessage="Please select at least one application perspectives."
          />
        }
      />
      <TouchedMessages field={form.get('applicationIds')} />

      <K8sClusters
        setTitle={false}
        loadEntities={() => getSelectedK8sClusters(selectedK8sClusters)}
        hasRowNavigation={false}
        noDataMessage="No Kubernetes Cluster Selected"
        tableActions={k8sClusterSelectionTableActions(form, setForm)}
        rightHeader={
          <SelectListDialogButton
            form={form}
            onSubmit={selectedIds => submitK8sClusterSelection(form, setForm, selectedIds)}
            title="Add Kubernets Clusters"
            label="Add Kubernets Clusters"
            listComponent={K8sClusters}
            listComponentRightHeader={noRightHeader}
            hiddenIds={selectedK8sClusters}
            createSubmitLabel={numberOfItems =>
              numberOfItems > 0 ? `Add ${numberOfItems} Kubernetes Cluster${numberOfItems > 1 ? 's' : ''}` : 'Add'
            }
            requiresAtLeastOneMessage="Please select at least one Kubernetes cluster."
          />
        }
      />
      <TouchedMessages field={form.get('kubernetesClusterUUIDs')} />

      <K8sNamespaces
        setTitle={false}
        loadEntities={() => getSelectedK8sNamespaces(selectedK8sNamespaces)}
        hasRowNavigation={false}
        noDataMessage="No Kubernetes Namespace Selected"
        tableActions={k8sNamespaceSelectionTableActions(form, setForm)}
        rightHeader={
          <SelectListDialogButton
            form={form}
            onSubmit={selectedIds => submitK8sNamespaceSelection(form, setForm, selectedIds)}
            title="Add Kubernets Namespaces"
            label="Add Kubernets Namespaces"
            listComponent={K8sNamespaces}
            listComponentRightHeader={noRightHeader}
            hiddenIds={selectedK8sNamespaces}
            createSubmitLabel={numberOfItems =>
              numberOfItems > 0 ? `Add ${numberOfItems} Kubernetes Namespace${numberOfItems > 1 ? 's' : ''}` : 'Add'
            }
            requiresAtLeastOneMessage="Please select at least one Kubernetes namespace."
          />
        }
      />
      <TouchedMessages field={form.get('kubernetesNamespaceUIDs')} />

      <Websites
        setTitle={false}
        loadEntities={() => getSelectedWebsites(selectedWebsites)}
        hasRowNavigation={false}
        noDataMessage="No Website Selected"
        tableActions={websiteSelectionTableActions(form, setForm)}
        rightHeader={
          <SelectListDialogButton
            form={form}
            onSubmit={selectedIds => submitWebsiteSelection(form, setForm, selectedIds)}
            title="Add Website"
            label="Add Website"
            listComponent={Websites}
            listComponentRightHeader={noRightHeader}
            hiddenIds={selectedWebsites}
            createSubmitLabel={numberOfItems =>
              numberOfItems > 0 ? `Add ${numberOfItems} Website${numberOfItems > 1 ? 's' : ''}` : 'Add'
            }
            requiresAtLeastOneMessage="Please select at least one website."
          />
        }
      />
      <TouchedMessages field={form.get('websiteIds')} />
    </fieldset>
  );
}

function getSelectedApplicationConfigs(selectedApplications = []) {
  return getApplications().map(application =>
    filter(application, function(app) {
      return selectedApplications.indexOf(app.id) >= 0;
    })
  );
}

function getSelectedK8sClusters(selectedK8sClusters = []) {
  return getK8sClusters().map(k8sCluster =>
    filter(k8sCluster, function(cluster) {
      return selectedK8sClusters.indexOf(cluster.id) >= 0;
    })
  );
}

function getSelectedK8sNamespaces(selectedK8sNamespaces = []) {
  return getK8sNamespaces().map(k8sNamespace =>
    filter(k8sNamespace, function(namespace) {
      return selectedK8sNamespaces.indexOf(namespace.id) >= 0;
    })
  );
}

function getSelectedWebsites(selectedWebsites = []) {
  return getWebsites().map(website =>
    filter(website, function(web) {
      return selectedWebsites.indexOf(web.id) >= 0;
    })
  );
}

function applicationSelectionTableActions(form, setForm) {
  return {
    deselect: {
      deselect: deselectedEntity => {
        if (deselectedEntity) {
          setForm(
            form.updateIn(['applicationIds'], field => {
              return field
                .setValue(field.value.filterNot(referencedId => referencedId === deselectedEntity.id))
                .setTouched(true);
            })
          );
        }
      }
    }
  };
}

function k8sClusterSelectionTableActions(form, setForm) {
  return {
    deselect: {
      deselect: deselectedEntity => {
        if (deselectedEntity) {
          setForm(
            form.updateIn(['kubernetesClusterUUIDs'], field => {
              return field
                .setValue(field.value.filterNot(referencedId => referencedId === deselectedEntity.id))
                .setTouched(true);
            })
          );
        }
      }
    }
  };
}

function k8sNamespaceSelectionTableActions(form, setForm) {
  return {
    deselect: {
      deselect: deselectedEntity => {
        if (deselectedEntity) {
          setForm(
            form.updateIn(['kubernetesNamespaceUIDs'], field => {
              return field
                .setValue(field.value.filterNot(referencedId => referencedId === deselectedEntity.id))
                .setTouched(true);
            })
          );
        }
      }
    }
  };
}

function websiteSelectionTableActions(form, setForm) {
  return {
    deselect: {
      deselect: deselectedEntity => {
        if (deselectedEntity) {
          setForm(
            form.updateIn(['websiteIds'], field => {
              return field
                .setValue(field.value.filterNot(referencedId => referencedId === deselectedEntity.id))
                .setTouched(true);
            })
          );
        }
      }
    }
  };
}

function submitApplicationSelection(form, setForm, selectedIds) {
  setForm(
    form.updateIn(['applicationIds'], field => {
      return field.setValue(field.value.concat(fromJS(selectedIds))).setTouched(true);
    })
  );
}

function submitK8sClusterSelection(form, setForm, selectedIds) {
  setForm(
    form.updateIn(['kubernetesClusterUUIDs'], field => {
      return field.setValue(field.value.concat(fromJS(selectedIds))).setTouched(true);
    })
  );
}

function submitK8sNamespaceSelection(form, setForm, selectedIds) {
  setForm(
    form.updateIn(['kubernetesNamespaceUIDs'], field => {
      return field.setValue(field.value.concat(fromJS(selectedIds))).setTouched(true);
    })
  );
}

function submitWebsiteSelection(form, setForm, selectedIds) {
  setForm(
    form.updateIn(['websiteIds'], field => {
      return field.setValue(field.value.concat(fromJS(selectedIds))).setTouched(true);
    })
  );
}

function tooglePermission(form, setForm, permission) {
  setForm(
    form.updateIn(['permissions'], field => {
      if (field.value.includes(permission)) {
        return field.setValue(field.value.filterNot(permitted => permitted === permission)).setTouched(true);
      }
      return field.setValue(field.value.push(permission)).setTouched(true);
    })
  );
}

function Permission({ form, setForm, permission, label, helpText, disabled }) {
  const field = form.get('permissions');
  return (
    <HorizontalFormGroup helpText={helpText}>
      <Label htmlFor={`permission-${permission}`}>{label}</Label>
      <Toggle
        id={`permission-${permission}`}
        checked={field.value.includes(permission)}
        onChange={() => tooglePermission(form, setForm, permission)}
        disabled={disabled}
      />
    </HorizontalFormGroup>
  );
}
