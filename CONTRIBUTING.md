# Contributing to ROAM

Thank you for your interest in contributing to ROAM.

## What You Can Contribute

This repository contains the ROAM protocol specification and developer SDK. Contributions are welcome in these areas:

- **Protocol types and schemas** — Improvements to the coordination protocol
- **SDK enhancements** — New methods, better ergonomics, additional framework helpers
- **Documentation** — Corrections, clarifications, examples
- **Bug reports** — Issues with the protocol spec or SDK
- **Framework integration guides** — Examples of connecting new frameworks to ROAM

## What Lives Elsewhere

The ROAM daemon, Control Room, and EYDII trust layer are proprietary and maintained by Veritera Engineering. Issues and feature requests for those components are welcome here as GitHub Issues — the team reviews them regularly.

## How to Submit

1. Fork this repository
2. Create a branch (`git checkout -b my-change`)
3. Make your changes
4. Run type checking: `cd packages/protocol && npx tsc --noEmit`
5. Submit a pull request with a clear description

## Code Style

- TypeScript, ES2022 target
- No comments unless the WHY is non-obvious
- Prefer explicit types over inference for exported functions
- Use `zod` for runtime validation schemas

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
