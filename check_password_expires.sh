#!/bin/bash

USER="owndvxsg"
TEAM_EMAIL="team@example.com"
THRESHOLD_DAYS=2
TODAY=$(date +%s)

# Get password expiry date for the user
EXP_DATE=$(chage -l "$USER" | grep "Password expires" | cut -d: -f2 | xargs)

# Exit if password never expires
if [[ "$EXP_DATE" == "never" || -z "$EXP_DATE" ]]; then
    exit 0
fi

# Convert to epoch
EXP_EPOCH=$(date -d "$EXP_DATE" +%s 2>/dev/null)

# Exit if conversion fails
if [[ -z "$EXP_EPOCH" ]]; then
    echo "Error: Could not parse expiry date for user $USER"
    exit 1
fi

# Calculate days left
DAYS_LEFT=$(( (EXP_EPOCH - TODAY) / 86400 ))

# Notify if 2 days left
if [[ $DAYS_LEFT -eq $THRESHOLD_DAYS ]]; then
    echo "User '$USER' password will expire in $THRESHOLD_DAYS day(s) on $EXP_DATE." \
    | mailx -s "Password Expiry Warning for $USER" "$TEAM_EMAIL"
fi
