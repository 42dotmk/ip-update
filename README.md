# Base42 IP Update Script

This repo contains the repo update script for Base42, it updates the DNS record in CloudFlare to always point to the current IP of the runner.

## Setup

The script needs a couple of environment variables set up:

```
ZONE_ID=
RECORD_ID=
CF_AUTH_BEARER=
```

`CF_AUTH_BEARER` is the auth token from CF (Not a legacy global token).
`ZONE_ID` and  `RECORD_ID` are self-explanatory and are the IDs of the Zone and DNS Record in the CF account.

