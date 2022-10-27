# Create Streamyard Broadcast

Streamyard currently doesn't have an API, which means it isn't possible to integrate in an automated workflow using Zapier or Make. 

This simple Node API creates a Streamyard Studio (room) and a livestream on one YouTube channel. 

## Parameters

Pass the following parameters in a `POST` request body as a `x-www-form-urlencoded`.

- `title`: Stream title
- `description`: Stream description
- `plannedStartTime`: format `Sat Oct 29 2022 12:30:00 GMT-0300 (Atlantic Daylight Time)`
- `workspaceId`
- `destinationId`
- `selectedBrandId`
- `privacy`: private, public, unlisted
- `csrfToken`
- `cookies`

It's necessary to retrieve cookie data, csrfToken and various IDs from requests made in the browser. 