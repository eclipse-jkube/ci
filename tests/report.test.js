describe('report module test suite', () => {
  const ghApiData = require('./gh-api.data');
  let report;
  beforeEach(() => {
    report = require('../src/report');
  });
  describe('template', () => {
    test('With completed workflow run', () => {
      // Given
      const workflowRun = ghApiData.getWorkflowRunCompletedSuccess().data;
      const jobs = ghApiData.listJobsForWorkflowRun().data;
      const artifacts = [{
        name: 'Artifact',
        content: '[✓] All tests (0) passed successfully!!!'
      }]
      // When
      const result = report.template({workflowRun, jobs, artifacts});
      // Then
      expect(result).toBe(`<!-- Eclipse JKube CI bot report -->
<!-- METADATA {"pr":"1337","runId":"313373"} -->
### Eclipse JKube [CI Report](https://github.com/eclipse-jkube/ci)

Started new GH workflow run for https://github.com/eclipse-jkube/jkube/pull/1337 (_2015-10-21T04:29:00.000Z_)

:gear: [JKube E2E Tests Mocked (313373)](https://github.com/eclipse-jkube/ci/actions/runs/313373) :heavy_check_mark:
- :heavy_check_mark: [Bootstrap CI test run (#1337)](https://github.com/eclipse-jkube/ci/runs/13371) (60s)
- :hourglass_flowing_sand: [K8S v1.12.0 webapp (#1337)](https://github.com/eclipse-jkube/ci/runs/13374)
- :hand: [OpenShift v3.11.0 quarkus (#1337)](https://github.com/eclipse-jkube/ci/runs/13372)
- :x: [Windows (#1337)](https://github.com/eclipse-jkube/ci/runs/13373) (300s)
- :hourglass_flowing_sand: [Finish CI test run](https://github.com/eclipse-jkube/ci/runs/13375)

<details>
  <summary><h4>Test results</h4></summary>

  <blockquote>
  
<details>
  <summary>:heavy_check_mark: Artifact</summary>

  \`\`\`
[✓] All tests (0) passed successfully!!!
  \`\`\`
</details>

  </blockquote>
</details>
    `);
    });
  });
  describe('parseMetadata', () => {
    test('with valid comment, should return metadata', () => {
      // Given
      const comment = {
        user: {
          login: 'manusa'
        },
        body: `<!-- Eclipse JKube CI bot report -->
<!-- METADATA {"pr":"1337","runId":"313373"} -->
Other stuff
`
      };
      // When
      const result = report.parseMetadata(comment);
      // Then
      expect(result).toEqual({
        pr: '1337',
        runId: '313373'
      });
    });
  });
});
