#!/usr/bin/env bash
# Checks that a pull request title follows Conventional Commits:
#   type(optional scope)!: description
# Valid examples: "feat: add home page", "fix(ci)!: drop Node 22".
#
# With squash merges, this title becomes the commit message on master.
#
# Usage : PR_TITLE="feat: add home page" check-pr-title.sh

set -euo pipefail

ALLOWED_TYPES="feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert"
SCOPE_PATTERN="(\([a-z0-9-]+\))?"
BREAKING_PATTERN="!?"
TITLE_PATTERN="^(${ALLOWED_TYPES})${SCOPE_PATTERN}${BREAKING_PATTERN}: [^ ].*$"

if [[ -z "${PR_TITLE:-}" ]]; then
  echo "PR_TITLE est vide." >&2
  exit 2
fi

if [[ "${PR_TITLE}" =~ ${TITLE_PATTERN} ]]; then
  echo "Titre valide : ${PR_TITLE}"
  exit 0
fi

echo "Titre invalide : ${PR_TITLE}" >&2
echo "Format attendu : type(portée)!: description" >&2
echo "Types autorisés : ${ALLOWED_TYPES//|/, }" >&2
exit 1
