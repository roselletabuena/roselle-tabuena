import { ReactNode } from 'react';

export default function CaseStudyLayout({ children }: { children: ReactNode }) {
    return (
        <main className="prose prose-gray mt-24 pb-20 prose-h4:prose-base dark:prose-invert prose-h1:text-xl prose-h1:font-medium prose-h2:mt-12 prose-h2:scroll-m-20 prose-h2:text-lg prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-h4:font-medium prose-h5:text-base prose-h5:font-medium prose-h6:text-base prose-h6:font-medium prose-strong:font-medium prose-ul:my-6 prose-li:my-2">
            {children}
        </main>
    );
}
