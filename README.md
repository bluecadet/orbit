# @bluecadet/orbit

A set of packages for declarative animations on the web.

> [!WARNING]  
> This package is currently in development and APIs may change.

## Packages

This monorepo contains the following packages:

### [@bluecadet/orbit-vanilla](./packages/orbit-vanilla)

Core web components for animation, built with Lit. This package provides the foundational animation components using standard web components.

### [@bluecadet/orbit-react](./packages/orbit-react)

React wrapper components for orbit-vanilla. Provides a React-friendly interface to the core animation components.

## Development

This project uses npm workspaces with Turborepo for build orchestration and Changesets for version management.

```bash
npm install
npm run build
```

### Monorepo Structure

- We use [Turborepo](https://turbo.build/) for efficient task running and caching
- [Changesets](https://github.com/changesets/changesets) manages our versioning and changelogs
- Packages are managed with npm workspaces

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

## License

MIT
