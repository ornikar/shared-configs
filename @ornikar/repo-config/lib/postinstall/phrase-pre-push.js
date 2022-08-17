'use strict';

exports.phrasePrePush = `
# z40 is the value matching the empty blob/commit/tree SHA (zero x 40)
z40=0000000000000000000000000000000000000000

while read local_ref local_sha remote_ref remote_sha
do
    branch_ref=$(git symbolic-ref HEAD)
    if [ "$local_ref" = "$branch_ref" ]
    then
        if [ "$remote_sha" = $z40 ]
        then
            # New branch, examine all commits since first commit
            range="$local_sha"
        else
            # Update to existing branch, examine new commits
            range="$remote_sha..$local_sha"
        fi

        # Check for Translations in commit
        translation=\`git --glob-pathspecs diff "$range" -- "@ornikar/*/translations/**" "@ornikar/*/src/translations/**"\`
        if [ -n "$translation" ]
        then
            branch_name=$(git branch --show-current)
            echo >&2 "🦜 Found translation(s) in commit in $range"
            echo >&2 "Pushing $branch_name to Phrase"
            yarn phrase push
        fi
    fi
done
`;
