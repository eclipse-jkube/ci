const fs = require('fs');
const path = require('path');
const config = require('./config');
const pullRequests = require('./pull-requests');

const actionResolvePr = async () => {
  console.log(`Resolving PR metadata for #${config.pr}...`);
  const pr = await pullRequests.get();
  const metadata = {
    cloneUrl: pr.head.repo.clone_url,
    ref: pr.head.ref
  };
  const metadataPath = path.resolve(__dirname, '..', 'pr-metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`PR metadata written to ${metadataPath}`);
};

module.exports = actionResolvePr;
