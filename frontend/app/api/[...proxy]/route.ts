import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

async function proxyRequest(
  req: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params;
  const path = proxy.join('/');
  const searchParams = req.nextUrl.search;
  const targetUrl = `${BACKEND_URL}/api/${path}${searchParams}`;

  try {
    const headers = new Headers();
    req.headers.forEach((val, key) => {
      // Avoid forwarding host and content-length to prevent target mismatch
      if (key !== 'host' && key !== 'content-length') {
        headers.set(key, val);
      }
    });

    const init: RequestInit = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = await req.arrayBuffer();
    }

    const res = await fetch(targetUrl, init);
    const body = await res.arrayBuffer();

    const responseHeaders = new Headers();
    res.headers.forEach((val, key) => {
      responseHeaders.set(key, val);
    });

    return new NextResponse(body, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error(`[API Proxy Error] Failed to proxy to ${targetUrl}:`, error?.message || error);
    return NextResponse.json(
      {
        error: 'Cannot connect to backend server. Make sure FastAPI is running on port 8000.',
        target: targetUrl,
      },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
