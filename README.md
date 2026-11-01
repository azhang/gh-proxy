# GitHub Proxy Worker

A Cloudflare Worker that proxies GitHub API requests to fetch raw file contents from repositories.

## Features

- Fetches raw file contents from GitHub repositories
- Supports nested file paths
- Returns content with appropriate YAML headers
- Simple token-based authentication

## Deployment

1. Create a new Cloudflare Worker
2. Copy the contents of `github-proxy-worker.js` to your Worker
3. Deploy the Worker

## Usage

### Request Format

```
GET https://your-worker.workers.dev/[owner]/[repo]/[filepath]?token=[github-token]
```

### Parameters

- `owner`: GitHub username or organization
- `repo`: Repository name  
- `filepath`: Path to the file in the repository (supports nested paths)
- `token`: GitHub personal access token (passed as query parameter)
- `ref` (optional): branch, tag, or commit SHA. Defaults to the repo's default branch.

### Examples

Fetch a file from the root:
```
https://your-worker.workers.dev/myuser/myrepo/config.yaml?token=ghp_xxxx
```

Fetch from a branch or tag (e.g. a beta config subscription):
```
https://your-worker.workers.dev/myuser/myrepo/config.yaml?token=ghp_xxxx&ref=beta
```

Fetch a nested file:
```
https://your-worker.workers.dev/myuser/myrepo/folder/subfolder/file.yaml?token=ghp_xxxx
```

## Response

- **Success**: Returns the raw file content with `Content-Type: text/yaml`
- **400 Bad Request**: Missing token or invalid path format
- **404 Not Found**: File doesn't exist in the repository
- **401 Unauthorized**: Invalid token or insufficient permissions

## Security Notes

- Never expose your GitHub token in client-side code
- Consider implementing additional authentication or rate limiting in production
- Use tokens with minimal required permissions (read-only access to specific repositories)

## GitHub Token

Generate a personal access token at: https://github.com/settings/tokens

Required scope: `repo` (for private repositories) or `public_repo` (for public repositories only)