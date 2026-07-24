import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pdfUrl = searchParams.get('url');

  if (!pdfUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const fetchHeaders = {};
    const range = request.headers.get('range');
    if (range) {
      fetchHeaders['Range'] = range;
    }

    const response = await fetch(pdfUrl, { headers: fetchHeaders });
    
    if (!response.ok && response.status !== 206) {
      return new NextResponse(`Failed to fetch PDF: ${response.statusText}`, { status: response.status });
    }

    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', 'inline');
    headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    headers.set('Accept-Ranges', 'bytes');
    
    // Copy relevant headers from upstream response
    if (response.headers.has('Content-Length')) {
      headers.set('Content-Length', response.headers.get('Content-Length'));
    }
    if (response.headers.has('Content-Range')) {
      headers.set('Content-Range', response.headers.get('Content-Range'));
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: headers,
    });
  } catch (error) {
    console.error('PDF proxy error:', error);
    return new NextResponse('Failed to proxy PDF', { status: 500 });
  }
}
