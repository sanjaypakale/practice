#!/bin/bash

# Parameters
DOWNLOAD_URL=$1       # Download URL for the zip file
REPO_URL=$2           # Repository URL (authenticated Git URL with token)
BRANCH_NAME=$3        # Branch name to create
COMMIT_MESSAGE=$4     # Commit message

# Determine the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Construct GUID-based location in the same directory as the script
GUID_LOCATION="${SCRIPT_DIR}/guid-$(date +%s)-$RANDOM"
mkdir -p "$GUID_LOCATION"

# Download the zip file using curl
ZIP_FILE="$GUID_LOCATION/ufw.zip"
curl -o "$ZIP_FILE" "$DOWNLOAD_URL"

# Extract the zip file
EXTRACTION_FOLDER="$GUID_LOCATION/extracted"
mkdir -p "$EXTRACTION_FOLDER"
unzip "$ZIP_FILE" -d "$EXTRACTION_FOLDER"

# Navigate to the extracted folder
cd "$EXTRACTION_FOLDER" || exit 1

# Initialize a new Git repository
git init

# Add the remote repository URL
git remote add origin "$REPO_URL"

# Create and switch to a new branch
git checkout -b "$BRANCH_NAME"

# Stage all files for commit
git add .

# Commit the changes
git commit -m "$COMMIT_MESSAGE"

# Push the changes to the remote repository
git push --set-upstream origin "$BRANCH_NAME"

# Cleanup: Remove the GUID-based folder and all its contents
cd "$SCRIPT_DIR"
rm -rf "$GUID_LOCATION"

echo "Git operations completed successfully."
