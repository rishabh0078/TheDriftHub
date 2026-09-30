import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  let filePath = path.join(process.cwd(), 'admin-ui', 'index.html');
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), '..', 'backend', 'admin-ui', 'index.html');
  }

  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf-8');
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  }

  return new Response(
    '<h1>Admin UI file not found</h1><p>Expected at frontend/admin-ui/index.html</p>',
    {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }
  );
}
