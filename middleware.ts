import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals, static files, webhooks, and UploadThing.
    // UploadThing callbacks must stay publicly reachable:
    // https://docs.uploadthing.com/faq
    '/((?!_next|api/webhooks|api/uploadthing|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/:path*',
    '/(api(?!/webhooks|/uploadthing)|trpc)(.*)',
  ],
};
