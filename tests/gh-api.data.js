const fs = require('fs');
const path = require('path');

const getWorkflowRunCompletedSuccess = () => ({
  status: 200,
  data: {
    id: 313373,
    name: 'JKube E2E Tests Mocked',
    event: 'repository_dispatch',
    status: 'completed',
    conclusion: 'success',
    url: 'https://api.github.com/repos/eclipse-jkube/ci/actions/runs/313373',
    html_url: 'https://github.com/eclipse-jkube/ci/actions/runs/313373',
    created_at: '2015-10-21T03:29:00.000Z',
    updated_at: '2015-10-21T04:29:00.000Z',
    run_attempt: 1,
    jobs_url: 'https://api.github.com/repos/eclipse-jkube/ci/actions/runs/313373/jobs',
    logs_url: 'https://api.github.com/repos/eclipse-jkube/ci/actions/runs/313373/logs'
  }
});

const listJobsForWorkflowRun = () => ({
  status: 200,
  data: {
    total_count: 5,
    jobs: [
      {
        id: 13371,
        html_url: 'https://github.com/eclipse-jkube/ci/runs/13371',
        name: 'Bootstrap CI test run (#1337)',
        status: 'completed',
        conclusion: 'success',
        started_at: '2015-10-21T03:29:00.000Z',
        completed_at: '2015-10-21T03:30:00.000Z'
      },
      {
        id: 13373,
        html_url: 'https://github.com/eclipse-jkube/ci/runs/13373',
        name: 'Windows (#1337)',
        status: 'completed',
        conclusion: 'failure',
        started_at: '2015-10-21T03:29:00.000Z',
        completed_at: '2015-10-21T03:34:00.000Z'
      },
      {
        id: 13372,
        html_url: 'https://github.com/eclipse-jkube/ci/runs/13372',
        name: 'OpenShift v3.11.0 quarkus (#1337)',
        status: 'queued'
      },
      {
        id: 13374,
        html_url: 'https://github.com/eclipse-jkube/ci/runs/13374',
        name: 'K8S v1.12.0 webapp (#1337)'
      },
      {id: 13375, html_url: 'https://github.com/eclipse-jkube/ci/runs/13375', name: 'Finish CI test run'}
    ]
  }
});

const artifactsForWorkflowRun = () => ({
  status: 200,
  data: {
    total_count: 3,
    artifacts: [
      {
        id: 13371,
        name: 'Test reports (Minikube v1.24.0-other)',
        size_in_bytes: 1269,
        url: 'https://api.github.com/repos/eclipse-jkube/ci/actions/artifacts/13371',
        archive_download_url: 'https://api.github.com/repos/eclipse-jkube/ci/actions/artifacts/13371/zip'
      },
      {
        id: 13372,
        name: 'Test reports (Minikube v1.24.0-webapp)',
        size_in_bytes: 1269,
        url: 'https://api.github.com/repos/eclipse-jkube/ci/actions/artifacts/13371',
        archive_download_url: 'https://api.github.com/repos/eclipse-jkube/ci/actions/artifacts/13372/zip'
      },
      {
        id: 13373,
        name: 'Test reports (Minikube v1.12.0-other)',
        size_in_bytes: 1269,
        url: 'https://api.github.com/repos/eclipse-jkube/ci/actions/artifacts/13371',
        archive_download_url: 'https://api.github.com/repos/eclipse-jkube/ci/actions/artifacts/13373/zip'
      }
    ]
  }
});

const downloadArtifact = ({artifact_id= '1337-1337-1337-1337'}) => ({
  status: 200,
  url: `https://pipelines.actions.githubusercontent.com/serviceHosts/${artifact_id}/_apis/pipelines/1/runs/2105/signedartifactscontent?artifactName=Test%20reports%20%28Minikube%20-other%29&urlExpires=2022-05-13T08%3A00%3A45.0241294Z&urlSigningMethod=HMACV2&urlSignature=PpyhCnM7L%2BtaxZuzu7s%2FtoOVx2ys0gSXdsN%2F5UQXsSI%3D`,
  data: fs.readFileSync(path.join(__dirname, 'test-reports.zip'))
});

const listComments = () => ({
  status: 200,
  data: [
    {
      id: 13371,
      user: {login: 'ghost'},
      body: 'Regular comment'
    },
    {
      id: 13372,
      user: {login: 'manusa'},
      body: 'Regular comment'
    },
    {
      id: 13373,
      user: {login: 'manusa'},
      body: '<!-- Eclipse JKube CI bot report --> This is the right one!'
    },
    {
      id: 13373,
      user: {login: 'ghost'},
      body: '<!-- Eclipse JKube CI bot report --> This is counterfeit!'
    }
  ]
});

module.exports = {
  artifactsForWorkflowRun,
  downloadArtifact,
  getWorkflowRunCompletedSuccess,
  listComments,
  listJobsForWorkflowRun
}
