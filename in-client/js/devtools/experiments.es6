// see IssueConveyer for filtering based on this key

window.instana.dev.showExperiments = set.bind(null, true);
window.instana.dev.hideExperiments = set.bind(null, false);

function set(v) {
  localStorage.setItem('in-experiments', v);
  window.location.reload();
}
