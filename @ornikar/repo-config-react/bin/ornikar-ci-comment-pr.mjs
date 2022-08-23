#!/usr/bin/env node

import fetch from 'node-fetch';

const {
  GITHUB_TOKEN,
  CIRCLE_PROJECT_USERNAME: ORG,
  CIRCLE_PROJECT_REPONAME: REPO,
  CIRCLE_WORKFLOW_JOB_ID: WORKFLOW_JOB_ID,
} = process.env;
const PR_ID = process.env.CI_PULL_REQUEST.split('/').at(-1);

if (!WORKFLOW_JOB_ID) {
  console.error('Missing process.env.CIRCLE_WORKFLOW_JOB_ID');
  process.exit(1);
}

const prCommentsIssueUrl = `https://api.github.com/repos/${ORG}/${REPO}/issues/${PR_ID}/comments`;
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `token ${GITHUB_TOKEN}`,
  'User-Agent': 'ci',
};

const PREFIX = 'Storybook (CircleCI Artifact):';

async function cleanComments() {
  try {
    const deleteCommentIssueUrl = `https://api.github.com/repos/${ORG}/${REPO}/issues/comments`;
    const response = await fetch(prCommentsIssueUrl, {
      headers,
    });
    const body = await response.json();
    if (!body) return;
    await Promise.all(
      body.map((comment) => {
        if (comment.body.startsWith(PREFIX)) {
          return fetch(`${deleteCommentIssueUrl}/${comment.id}`, {
            method: 'DELETE',
            headers,
          });
        }

        return null;
      }),
    ).catch(console.error);
  } catch (err) {
    console.error('Failed to check comments on GitHub, an error occurred', err);
  }
}

(async () => {
  await cleanComments();
  const lateOceanStorybookUrl = `https://output.circle-artifacts.com/output/job/${WORKFLOW_JOB_ID}/artifacts/0/storybook-static/index.html`;

  const body = `${PREFIX}\n- Late Ocean Theme: ${lateOceanStorybookUrl}`;
  await fetch(prCommentsIssueUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ body }),
  });
})().catch(console.error);
