#!/bin/bash -eu
curl localhost:4001/graphql \
  -F operations='{ "query": "mutation($files: [Upload!]!) { multipleUpload(files: $files) { filename mimetype encoding } }", "variables": { "files": [null, null] } }' \
  -F map='{ "0": ["variables.files.0"], "1": ["variables.files.1"] }' \
  -F 0=@package.json \
  -F 1=@nodemon.json