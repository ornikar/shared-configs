'use strict';

exports.noPushOnMain = `
if [[ "$remote_sha" != $z40 && "$remote_ref" == "refs/heads/$mainBranch" ]]
then
  echo "Do not push directly on \\"origin/$currentBranch\\""
  exit 1
fi
`;
