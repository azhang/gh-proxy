export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    
    if (!token) {
      return new Response('Missing token parameter', { status: 400 });
    }
    
    // Parse the path to extract owner/repo/file
    // Path format: /owner/repo/filepath
    const pathParts = url.pathname.split('/').filter(part => part.length > 0);
    
    if (pathParts.length < 3) {
      return new Response('Invalid path format. Use: /owner/repo/filepath', { status: 400 });
    }
    
    const owner = pathParts[0];
    const repo = pathParts[1];
    const filePath = pathParts.slice(2).join('/'); // Handle nested paths
    
    // Optional branch, tag, or commit SHA; omitted means the repo's default branch
    const ref = url.searchParams.get('ref');

    // Build GitHub API URL
    let githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    if (ref) {
      githubApiUrl += `?ref=${encodeURIComponent(ref)}`;
    }
    
    const response = await fetch(githubApiUrl, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.raw',
        'User-Agent': 'Clash-Config-Proxy'
      }
    });
    
    if (!response.ok) {
      return new Response(`GitHub API error: ${response.status} for ${githubApiUrl}`, { 
        status: response.status 
      });
    }
    
    // Get the content as text to ensure proper encoding
    const content = await response.text();
    
    return new Response(content, {
      headers: {
        'Content-Type': 'text/yaml; charset=utf-8',
        'Cache-Control': 'private, no-cache'
      }
    });
  }
};