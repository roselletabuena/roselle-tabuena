import { WEBSITE_URL } from '@/lib/constants'

export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Roselle Tabuena',
    url: WEBSITE_URL,
    sameAs: [
      'https://github.com/roselletabuena',
      'https://www.linkedin.com/in/roselletabuena',
    ],
    jobTitle: 'Full Stack Developer',
    worksFor: [
      {
        '@type': 'Organization',
        name: 'Accenture PH',
      },
    ],
    knowsAbout: [
      'React',
      'Next.js',
      'Node',
      'TypeScript',
      'JavaScript',
      'Web Development',
      'Full Stack Development',
      'Component Development',
      'Frontend Development',
      'Backend Development',
      'AWS'
    ],
    description:
      'Full Stack Developer specializing in scalable components, modern web development, and building solutions to improve developer workflows.',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
