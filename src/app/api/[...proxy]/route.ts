import { NextRequest, NextResponse } from 'next/server';

// Proxy all requests to the Ngrok backend to completely avoid browser CORS issues.
const BACKEND_URL = 'https://vantage-swept-stiffen.ngrok-free.dev/api/v1';

export async function POST(req: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest(req, resolvedParams.proxy);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest(req, resolvedParams.proxy);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest(req, resolvedParams.proxy);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest(req, resolvedParams.proxy);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest(req, resolvedParams.proxy);
}

async function proxyRequest(req: NextRequest, pathArray: string[]) {
  const path = pathArray.join('/');
  const targetUrl = `${BACKEND_URL}/${path}`;
  
  try {
    const body = req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined;
    
    const headers = new Headers();
    req.headers.forEach((value, key) => {
      // Avoid passing host header to prevent target server mismatch
      if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'connection') {
        headers.set(key, value);
      }
    });
    
    // Add Ngrok bypass header
    headers.set('ngrok-skip-browser-warning', 'true');

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      // @ts-ignore
      duplex: 'half'
    });

    const responseBody = await response.text();
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Forward all headers except encoding
      if (key.toLowerCase() !== 'content-encoding') {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return new NextResponse(JSON.stringify({ error: 'Proxy failed to reach backend' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
