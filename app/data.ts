type Project = {
  name: string
  description: string
  link: string
  image: string
  id: string
}

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
}

type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
  date: string
}

type Certification = {
  title: string
  link: string
  image: string
}

type SocialLink = {
  label: string
  link: string
}

export const CERTIFICATIONS: Certification[] = [
  {
    title: 'AWS Certified AI Practitioner',
    image: '/badges/aws-certified-ai-practitioner.png',
    link: 'https://www.credly.com/badges/4033b0e0-144b-47cb-baad-57820a91e6dd/public_url',
  },
  {
    title: 'AWS Certified AI Practitioner Early Adopter',
    image: '/badges/aws-certified-ai-practitioner-early-adopter.png',
    link: 'https://www.credly.com/badges/aa979006-91fc-4473-9242-0b642e16b9f2/public_url',
  },
  {
    title: 'AWS Certified Solutions Architect – Associate',
    image: '/badges/aws-certified-solutions-architect-associate.png',
    link: 'https://www.credly.com/badges/1240b0d5-cc07-41c9-91c1-68306e1c82b6/public_url',
  },
]

export const PROJECTS: Project[] = [
  {
    name: 'Intent-Based Document Categorization',
    description: 'A prompt-based service that categorizes documents.',
    link: '/case-study/intent-based-categorization',
    image:
      'https://images.unsplash.com/photo-1527849214787-c99cd25c2f09?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    id: 'project1',
  },
  {
    name: 'AI Development with Copilot',
    description:
      'Enforced MUI and RWD standards via custom GitHub Copilot instructions, ensuring 100% architectural alignment.',
    link: '/case-study/code-standards',
    image:
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1488&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    id: 'project2',
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Accenture in the Philippines',
    title: 'Software Engineer',
    start: 'Nov 2022',
    end: 'Present',
    link: 'https://www.linkedin.com/in/roselletabuena/',
    id: 'work1',
  },
  {
    company: 'Information Managers',
    title: 'Junior Programmer',
    start: 'Jun 2021',
    end: 'Nov 2022',
    link: 'https://www.linkedin.com/in/roselletabuena/',
    id: 'work2',
  },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Beyond the Gantimpala Sinag Award',
    description:
      'Reflections on receiving the Sinag Award and the lessons I learned from improving everyday work.',
    link: '/blog/beyond-the-gatimpala-sinag-award',
    uid: 'blog-2',
    date: 'Jun 13, 2026',
  },
  {
    title:
      'Adding a Feature in an Unfamiliar Programming Language: Where Do You Start?',
    description:
      'A practical guide on building features in an unfamiliar language, using existing patterns, AI tools, and strong collaboration.',
    link: '/blog/adding-feature-in-an-unfamiliar-programming-language',
    uid: 'blog-1',
    date: 'Jan 27, 2026',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/roselletabuena',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/roselletabuena',
  },
]

export const EMAIL = 'tabuena.roselle17@gmail.com'
