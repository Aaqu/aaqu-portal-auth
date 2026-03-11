/*
  Dashboard 2.0 plugin API
  https://dashboard.flowfuse.com/contributing/plugins/

  Portal headers (X-Portal-*) are set by Nginx after session verification.
  SocketIO WebSocket upgrade request also passes through Nginx
  and receives these headers at handshake.
*/

module.exports = function (RED) {
  RED.plugins.registerPlugin("node-red-dashboard-2-portal-auth", {
    type: "node-red-dashboard-2",

    hooks: {
      onAddConnectionCredentials: (conn, msg) => {
        const headers = conn.request.headers

        msg._client.portalUserId = headers["x-portal-user-id"] || null
        msg._client.portalUserName = headers["x-portal-user-name"] || null
        msg._client.portalUsername = headers["x-portal-user-username"] || null
        msg._client.portalUserEmail = headers["x-portal-user-email"] || null
        msg._client.portalUserRole = headers["x-portal-user-role"] || null

        try {
          msg._client.portalGroups = JSON.parse(
            headers["x-portal-user-groups"] || "[]"
          )
        } catch {
          msg._client.portalGroups = []
        }

        return msg
      },

      onIsValidConnection: (conn, msg) => {
        if (msg._client?.portalUserId) {
          return (
            msg._client.portalUserId ===
            conn.request.headers["x-portal-user-id"]
          )
        }
        return true
      },

      onCanSaveInStore: (msg) => {
        if (msg._client?.portalUserId) {
          return false
        }
        return true
      },
    },
  })
}
