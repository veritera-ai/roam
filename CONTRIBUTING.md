# Contributing

ROAM is a commercial product with a public protocol, SDK, documentation, examples, and evaluation surface.

We welcome contributions that improve the public integration layer:

- protocol documentation
- SDK examples
- adapter examples
- install and setup documentation
- security documentation
- reproducible bugs in public components
- small fixes that make evaluation clearer

Please do not submit large rewrites, product-core implementations, or speculative architecture changes before opening an issue. The engine, desktop app internals, Steward coordination internals, EYDII behavioral intelligence, and commercial licensing systems are protected product areas.

## Before Opening A PR

1. Open an issue describing the problem or improvement.
2. Keep the change focused.
3. Include reproduction steps for bugs.
4. Update docs or examples when behavior changes.
5. Do not include credentials, `.roam/` state, agent logs, customer data, or private PRD material.

## Development

```bash
npm install
npm run build
npm run check
npm test
```

## Security

Do not open public issues for vulnerabilities. Send reports to `security@veritera.ai`.

See [SECURITY.md](SECURITY.md).
