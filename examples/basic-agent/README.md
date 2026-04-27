# Basic Agent Example

This example shows the shape of a custom agent that participates in a ROAM republic.

```ts
import { RoamAgent } from "@roam/sdk";

const agent = new RoamAgent({
  sessionRoot: "~/.roam/demo",
  agentId: "researcher",
  role: "Researcher",
  framework: "custom",
});

await agent.register();
await agent.heartbeat();

// In a real integration, the agent would claim work,
// update task state, write artifacts, and continue heartbeating.
```

The important part is not the framework. The important part is participation in the same local coordination protocol.

Anything that can read and write files can become a ROAM participant.
