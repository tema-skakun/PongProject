#!/bin/bash

# Define the unique comment identifier
identifier="MOCK"

# Use the 'find' command to locate all relevant files (e.g., .js or .ts files)
# You can modify the '-name' flag to match your project's file types
find src -type f \( -name '*.js' -o -name '*.ts' \) -exec grep -l "${identifier}" {} \; |
while IFS= read -r file
do
  # Remove the lines containing the unique comment identifier and save the result to a temporary file
  echo ${identifier}
  touch tmp
  sed -n "/${identifier}/!p" "$file" > tmp

  cat tmp > "$file"

  rm -f tmp
done
