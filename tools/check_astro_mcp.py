"""Read-only smoke check of the official Astro documentation MCP; stdlib only."""

import json
import sys
from datetime import datetime, timezone
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ENDPOINT = "https://mcp.docs.astro.build/mcp"


def main():
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "User-Agent": "giunchi-site-tooling-check/1.0",
    }

    def rpc(method, params=None, request_id=None):
        payload = {"jsonrpc": "2.0", "method": method}
        if params is not None:
            payload["params"] = params
        if request_id is not None:
            payload["id"] = request_id
        request = Request(ENDPOINT, json.dumps(payload).encode(), headers, method="POST")
        with urlopen(request, timeout=25) as response:
            session = response.headers.get("Mcp-Session-Id")
            if session:
                headers["Mcp-Session-Id"] = session
            if request_id is None:
                return None
            if "text/event-stream" in response.headers.get("Content-Type", ""):
                data = []
                message = None
                for raw_line in response:
                    line = raw_line.decode("utf-8").rstrip("\r\n")
                    if line.startswith("data:"):
                        data.append(line[5:].lstrip())
                    elif not line and data:
                        candidate = json.loads("\n".join(data))
                        data = []
                        if candidate.get("id") == request_id:
                            message = candidate
                            break
                if message is None:
                    raise ValueError("No matching MCP response")
            else:
                message = json.load(response)
        if "error" in message:
            raise ValueError("MCP error: " + str(message["error"].get("code")))
        if message.get("id") != request_id:
            raise ValueError("Mismatched MCP response ID")
        return message["result"]

    try:
        init = rpc("initialize", {
            "protocolVersion": "2025-03-26",
            "capabilities": {},
            "clientInfo": {"name": "giunchi-site-tooling-check", "version": "1.0"},
        }, 1)
        headers["MCP-Protocol-Version"] = init["protocolVersion"]
        rpc("notifications/initialized")
        catalog = rpc("tools/list", {}, 2)
        tools = catalog.get("tools", [])
        report = {
            "checked_at": datetime.now(timezone.utc).isoformat(),
            "endpoint": ENDPOINT,
            "server": init.get("serverInfo"),
            "protocol": init["protocolVersion"],
            "tools": [{"name": t["name"], "inputSchema": t.get("inputSchema")} for t in tools],
            "status": "handshake_and_tool_discovery_passed",
        }
        # Discover the actual schema before constructing a documentation query.
        if "--search" in sys.argv:
            search = next((t for t in tools if t["name"] == "search_astro_docs"), None)
            if search is None or "query" not in search.get("inputSchema", {}).get("properties", {}):
                raise ValueError("Expected Astro search schema is unavailable; inspect tool catalog")
            result = rpc("tools/call", {
                "name": search["name"],
                "arguments": {"query": "static content collections GitHub Pages deployment"},
            }, 3)
            text_blocks = [c.get("text", "") for c in result.get("content", []) if c.get("type") == "text"]
            if result.get("isError") or not any(text_blocks):
                raise ValueError("Astro documentation search did not return text")
            report["status"] = "handshake_tool_discovery_and_search_passed"
            report["search_text_characters"] = sum(len(t) for t in text_blocks)
        print(json.dumps(report, indent=2))
    finally:
        if headers.get("Mcp-Session-Id"):
            try:
                with urlopen(Request(ENDPOINT, headers=headers, method="DELETE"), timeout=10):
                    pass
            except (HTTPError, URLError, TimeoutError):
                pass  # Session deletion is optional in the transport.


if __name__ == "__main__":
    try:
        main()
    except (HTTPError, URLError, TimeoutError, ValueError, KeyError) as exc:
        print(json.dumps({"status": "failed", "error_type": type(exc).__name__, "detail": str(exc)}))
        sys.exit(1)
