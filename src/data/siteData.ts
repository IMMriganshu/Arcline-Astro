export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface Service {
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface Project {
  number: string;
  title: string;
  category: string;
  image: string;
  aspect?: string;
  description: string;
  year: string;
  location: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
}

export interface Article {
  slug: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  image: string;
}

export const siteConfig = {
  name: "Arcline",
  title: "Arcline — Architecture & Design Agency",
  description: "Distinguished architectural agency located in Canada, creating meaningful spaces that stand the test of time.",
  email: "yourcompany@gmail.com",
  phone: "(555) 345-6789",
  address: "567 Jac Spruce Crescent, Montreal, QC H1A 2K3",
  estYear: "EST. 2010",
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/", hasDropdown: true },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Pages", href: "#", hasDropdown: true },
  { label: "Blog", href: "/#blog" },
];

export const homeDropdownItems = [
  { label: "Home One", href: "/" },
  { label: "Home Two", href: "/#hero-secondary" },
];

export const pagesDropdownData = {
  pages: [
    { label: "Projects", href: "/projects" },
    { label: "Team", href: "/about#team" },
    { label: "Project Details", href: "/projects#details" },
    { label: "Service Details", href: "/services#details" },
    { label: "Blog Details", href: "/blog#details" },
  ],
  utilityPages: [
    { label: "Style Guide", href: "/style-guide" },
    { label: "License", href: "/style-guide#license" },
    { label: "Changelog", href: "/style-guide#changelog" },
    { label: "Password Protected", href: "/style-guide#password" },
    { label: "Not Found", href: "/404" },
  ],
};

export const servicesData: Service[] = [
  {
    number: "01",
    title: "Home Decoration",
    description: "Architecture Agency embodies a combination of creativity, functionality, and innovation, turning spaces into inspiring environments.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Modern interior with yellow designer armchair and framed artwork",
  },
  {
    number: "02",
    title: "Interior Design",
    description: "Architecture Agency embodies a combination of creativity, functionality, and innovation, turning spaces into inspiring environments.",
    image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Sleek contemporary kitchen island overlooking twilight skyline",
  },
  {
    number: "03",
    title: "Landscape Design",
    description: "Architecture Agency embodies a combination of creativity, functionality, and innovation, turning spaces into inspiring environments.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Architectural team collaborating enthusiastically on blueprints",
  },
  {
    number: "04",
    title: "Renovation Planning",
    description: "Architecture Agency embodies a combination of creativity, functionality, and innovation, turning spaces into inspiring environments.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Architect reviewing blueprints and structural data with team",
  },
];

export const portfolioProjects: Project[] = [
  {
    number: "01",
    title: "Coastal Villa",
    category: "LANDSCAPE",
    image: "/images/project-coastal-villa.webp",
    description: "Private contemporary residence overlooking coastal waters with infinity pool integration.",
    year: "2024",
    location: "Vancouver, BC",
  },
  {
    number: "02",
    title: "Green Residence",
    category: "INTERIOR DESIGN",
    image: "/images/project-green-residence.webp",
    description: "Eco-conscious living complex blending manicured landscape lawns and passive solar design.",
    year: "2024",
    location: "Calgary, AB",
  },
  {
    number: "03",
    title: "Heritage Museum",
    category: "ARCHITECTURE",
    image: "/images/project-heritage-museum.webp",
    description: "Modern geometric glass-and-steel architectural pavilion housing cultural preservation archives.",
    year: "2023",
    location: "Toronto, ON",
  },
  {
    number: "04",
    title: "Housing Complex",
    category: "ARCHITECTURE",
    image: "/images/project-housing-complex.webp",
    description: "Multi-tiered residential development celebrating warm natural light and modular balconies.",
    year: "2023",
    location: "Montreal, QC",
  },
];

export const testimonialsData: Testimonial[] = [
  {
    id: "01",
    quote: "Arcline transformed our vision into a living space that exceeds every expectation. Their approach to blending natural light with sustainable materials created a home that feels both luxurious and deeply connected to the environment. An extraordinary team that truly listens.",
    author: "Richard Jackson",
    role: "CEO",
    company: "Luxories",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    rating: 5,
  },
  {
    id: "02",
    quote: "From concept to completion, the Arcline team brought unmatched precision and creativity to our urban development. The result is a community space that residents genuinely love — functional, beautiful, and built to stand the test of time.",
    author: "Emma Thompson",
    role: "CEO",
    company: "Urban Nest",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
    rating: 5,
  },
  {
    id: "03",
    quote: "What sets Arcline apart is their ability to listen and then exceed. They understood exactly what we needed — a landmark tower that speaks to innovation without losing human scale. The Skyline Tower has become a true icon of the city.",
    author: "David Lee",
    role: "CEO",
    company: "Arch Vista",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
    rating: 5,
  },
];

export const blogArticles: Article[] = [
  {
    slug: "5-challenges-in-urban-architecture",
    category: "ARCHITECTURE",
    date: "Dec 2, 2024",
    readTime: "5 Min Read",
    title: "5 Challenges in Urban Architecture and How to Overcome Them",
    excerpt: "Urban architecture faces unique challenges that require innovative solutions. From space constraints to environmental concerns, architects must navigate complex issues.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "biophilic-design-connecting-architecture-with-nature",
    category: "ARCHITECTURE",
    date: "Oct 18, 2024",
    readTime: "4 Min Read",
    title: "Biophilic Design: Connecting Architecture with Nature",
    excerpt: "Discover how biophilic design principles are creating healthier, more productive spaces by integrating natural elements into architectural design.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
  },
];
