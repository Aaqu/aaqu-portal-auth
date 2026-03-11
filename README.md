## Important Information

Your support in the ongoing development of this library would be sincerely appreciated. 🙂

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-%23FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/mazuralbert)

# portal-auth

portal-auth is an authentication module for Dashboard 2.0,
designed specifically for Portal, the instance manager for Node-RED.

## How it works

Authentication is handled by the Nginx reverse proxy that sits in front of Node-RED. Nginx verifies the user session and injects `X-Portal-*` headers into every request (including WebSocket upgrade). This plugin reads those headers and populates `msg._client` with user identity and group permissions.

No middleware configuration or environment variables are needed in Node-RED.

### Portal headers injected by Nginx

| Header | Type | Description |
|---|---|---|
| `X-Portal-User-Id` | string | Unique user ID |
| `X-Portal-User-Name` | string | Display name |
| `X-Portal-User-Username` | string | Login username |
| `X-Portal-User-Email` | string | Email |
| `X-Portal-User-Role` | string | `"admin"` or `"user"` |
| `X-Portal-User-Groups` | JSON string | Groups with link permissions |

### X-Portal-User-Groups format

```json
[
  {
    "id": "group-uuid-1",
    "name": "Dashboards",
    "links": ["link-uuid-1", "link-uuid-2"]
  }
]
```

- **Admin** — receives all groups and all links
- **User** — receives only groups/links they have permission for
- **Empty `[]`** — user has no link permissions

### msg._client structure

After processing by the plugin, each message contains:

```json
{
  "socketId": "abc123",
  "portalUserId": "cm5abc123...",
  "portalUserName": "Jan Kowalski",
  "portalUsername": "jkowalski",
  "portalUserEmail": "jan@example.com",
  "portalUserRole": "admin",
  "portalGroups": [
    {
      "id": "group-uuid",
      "name": "Dashboards",
      "links": ["link-uuid-1"]
    }
  ]
}
```

## Install

```bash
npm install @aaqu/node-red-dashboard-2-portal-auth
```

## Notes

- Headers are set per-request by Nginx after session verification
- If the session expires, Nginx returns 401 and redirects to `/auth/login`
- `X-Portal-*` headers cannot be spoofed externally — Nginx overwrites them with values from verify-proxy
