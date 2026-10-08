#!/usr/bin/env bash
# Vérifie qu'un titre de pull request suit le format Conventional Commits :
#   type(portée facultative)!: description
# Exemples valides : « feat: add home page », « fix(ci)!: drop Node 22 ».
#
# Avec le merge squash, ce titre devient le message du commit sur master.
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
