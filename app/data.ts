type Project = {
  name: string
  description: string
  link: string
  video: string
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
}

type SocialLink = {
  label: string
  link: string
}

export const PROJECTS: Project[] = [
  {
    name: 'Enterprise Search',
    description:
      'A large-scale web app application used by internal stakeholders. ',
    link: '/project/enterprise-search',
    video:
      'https://images.unsplash.com/photo-1743796055664-3473eedab36e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    id: 'project1',
  },
  {
    name: 'Innovations',
    description: 'A collection of innovative projects that I have worked on.',
    link: '/project/innovation',
    video:
      'https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    id: 'project2',
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Accenture PH',
    title: 'Software Engineer',
    start: '2022',
    end: 'Present',
    link: 'https://www.linkedin.com/in/roselletabuena/',
    id: 'work1',
  },
  {
    company: 'Information Managers',
    title: 'Junior Software Developer',
    start: '2022',
    end: '2024',
    link: 'https://www.linkedin.com/in/roselletabuena/',
    id: 'work2',
  },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Adding a Feature in an Unfamiliar Programming Language: Where Do You Start?',
    description: "A practical guide on building features in an unfamiliar language, using existing patterns, AI tools, and strong collaboration.",
    link: '/blog/adding-feature-in-an-unfamiliar-programming-language',
    uid: 'blog-1',
  }
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
