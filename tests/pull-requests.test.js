describe('pull-requests module test suite', () => {
  let octokit;
  let pullRequests;
  let execFileSync;

  beforeEach(() => {
    jest.resetModules();
    execFileSync = jest.fn();
    jest.doMock('child_process', () => ({execFileSync}));
    octokit = {
      pulls: {
        get: jest.fn(() => ({
          data: {
            head: {
              ref: 'feature-branch',
              repo: {clone_url: 'https://github.com/someone/jkube.git'}
            }
          }
        }))
      }
    };
    jest.mock('@octokit/rest');
    require('@octokit/rest').Octokit.mockImplementation(() => octokit);
    pullRequests = require('../src/pull-requests');
  });

  describe('get', () => {
    test('should call octokit pulls.get with correct parameters', async () => {
      await pullRequests.get();
      expect(octokit.pulls.get).toHaveBeenCalledWith({
        owner: 'eclipse-jkube',
        repo: 'jkube',
        pull_number: '1337'
      });
    });
  });

  describe('checkOut', () => {
    test('should use execFileSync with array arguments instead of execSync', async () => {
      await pullRequests.checkOut();
      expect(execFileSync).toHaveBeenCalledWith(
        'git',
        ['clone', 'https://github.com/someone/jkube.git', '--branch', 'feature-branch', 'jkube'],
        {stdio: 'inherit'}
      );
    });

    test('should pass malicious branch name as literal argument without shell interpretation', async () => {
      octokit.pulls.get.mockReturnValue({
        data: {
          head: {
            ref: 'x$(touch${IFS}/tmp/pwned)',
            repo: {clone_url: 'https://github.com/attacker/jkube.git'}
          }
        }
      });
      await pullRequests.checkOut();
      expect(execFileSync).toHaveBeenCalledWith(
        'git',
        ['clone', 'https://github.com/attacker/jkube.git', '--branch', 'x$(touch${IFS}/tmp/pwned)', 'jkube'],
        {stdio: 'inherit'}
      );
    });

    test('should throw descriptive error when clone fails', async () => {
      execFileSync.mockImplementation(() => {
        const err = new Error('clone failed');
        err.status = 128;
        throw err;
      });
      await expect(pullRequests.checkOut()).rejects.toThrow("Couldn't check out #1337");
    });
  });
});