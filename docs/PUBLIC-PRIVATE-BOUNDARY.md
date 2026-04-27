# Public / Private Boundary

ROAM is a commercial product with a public evaluation repository.

The public repository exists so serious builders can understand the architecture, inspect the integration surface, evaluate the trust model, and decide whether ROAM belongs in their environment.

## Public

The public repository may include:

- README and positioning
- protocol specification
- SDK surface documentation
- examples and starter patterns
- install and evaluation notes
- security and threat-model documentation
- issue tracker and community health files

## Protected

The private development repositories contain protected product work:

- ROAM engine internals
- daemon implementation details
- desktop application internals
- Steward coordination kernel internals
- EYDII behavioral intelligence internals
- telemetry and commercial systems
- private PRDs, competitive analysis, roadmaps, and diligence material
- patent strategy and implementation details

Do not move these files into the public repository.

## Why This Boundary Exists

ROAM and EYDII are the product, not demo artifacts. Publishing every internal subsystem would make the commercial system easy to clone while giving serious evaluators little additional confidence.

The public repo should answer:

- What is ROAM?
- Why should I trust it enough to evaluate?
- What runs locally?
- What data does it touch?
- What is open for inspection?
- What is protected?
- How do I install or request deeper review?

The private repo should hold everything needed to build, operate, and protect the product.
