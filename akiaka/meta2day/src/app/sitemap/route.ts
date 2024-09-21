import { NextResponse } from 'next/server';

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
        <url>
            <loc>https://meta2day.online/home</loc>
            <lastmod>2024-09-19T00:28:26+00:00</lastmod>
            <priority>1.00</priority>
        </url>
        <url>
            <loc>https://meta2day.online/alarm</loc>
            <lastmod>2024-09-19T00:28:26+00:00</lastmod>
            <priority>0.80</priority>
        </url>
        <url>
            <loc>https://meta2day.online/post</loc>
            <lastmod>2024-09-19T00:28:26+00:00</lastmod>
            <priority>0.80</priority>
        </url>
        <url>
            <loc>https://meta2day.online/chat</loc>
            <lastmod>2024-09-19T00:28:26+00:00</lastmod>
            <priority>0.80</priority>
        </url>
        <url>
            <loc>https://meta2day.online/signup</loc>
            <lastmod>2024-09-19T00:28:26+00:00</lastmod>
            <priority>0.80</priority>
        </url>
        <url>
            <loc>https://meta2day.online/login</loc>
            <lastmod>2024-09-19T00:28:26+00:00</lastmod>
            <priority>0.80</priority>
        </url>
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}