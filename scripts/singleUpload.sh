#!/bin/bash -eu
curl localhost:4001/graphql \
  -F operations='{ "query": "mutation ($file: Upload!) { singleUpload(file: $file) { filename mimetype encoding } }", "variables": { "file": null } }' \
  -F map='{ "0": ["variables.file"] }' \
  -F 0=@yarn.lock