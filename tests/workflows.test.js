describe('workflows module test suite', () => {
  const ghApiData = require('./gh-api.data');
  let octokit;
  let workflows;
  beforeEach(() => {
    jest.resetModules();
    octokit = {
      actions: {
        cancelWorkflowRun: jest.fn(),
        downloadArtifact: jest.fn(ghApiData.downloadArtifact),
        listWorkflowRunArtifacts: jest.fn(ghApiData.artifactsForWorkflowRun)
      }
    };
    jest.mock('@octokit/rest');
    require('@octokit/rest').Octokit.mockImplementation(() => octokit);
    workflows = require('../src/workflows');
  });
  test('artifacts', async () => {
    const result = await workflows.artifacts();
    expect(octokit.actions.listWorkflowRunArtifacts)
      .toHaveBeenCalledWith({'owner': 'eclipse-jkube', 'repo': 'ci', 'run_id': 313373});
    expect(result).toMatchObject({total_count: 3, artifacts: expect.any(Array)});
  });
  test('artifactDownload', async () => {
    const result = await workflows.artifactDownload(ghApiData.artifactsForWorkflowRun().data.artifacts[0]);
    expect(result).toContain('All tests (5) passed successfully!!!');
  });
  test('cancelWorkflowRun', async () => {
    await workflows.cancelWorkflowRun(1337);
    expect(octokit.actions.cancelWorkflowRun)
      .toHaveBeenCalledWith({'owner': 'eclipse-jkube', 'repo': 'ci', 'run_id': 1337});
  });
});
