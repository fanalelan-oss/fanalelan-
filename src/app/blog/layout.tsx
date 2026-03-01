import React from 'react';

// This layout file is required for the blog section to work correctly with Next.js App Router.
// It ensures that all pages within the /blog directory have a consistent structure.

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      {/* The content of the blog pages (page.tsx) will be rendered here */}
      {children}
    </section>
  );
}
