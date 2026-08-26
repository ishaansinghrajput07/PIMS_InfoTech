import { Link, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import logoImage from '/Logo.jpeg';

GlobalWorkerOptions.workerSrc = workerUrl;

const utilities = [
  { title: 'ATS Resume Checker', description: 'Scan and score your resume for ATS compatibility and suggestions.', badge: 'Career Tools', highlight: 'Instant feedback' },
  { title: 'Resume Maker', description: 'Create polished resumes quickly with modern, ATS-friendly templates.', badge: 'Career Tools', highlight: 'Professional layouts' },
  { title: 'Marriage Biodata', description: 'Generate elegant biodata profiles for families, wedding invitations, and introductions.', badge: 'Personal Profiles', highlight: 'Custom formatting' },
  { title: 'Image Compressor', description: 'Reduce image size while keeping quality intact for websites and sharing.', badge: 'Image Tools', highlight: 'Fast compression' },
  { title: 'Compress PDF', description: 'Reduce the file size of your PDF documents for easy sharing.', badge: 'Document Tools', highlight: 'Smaller files' },
  { title: 'JPG to PNG Converter', description: 'Convert JPEG images to high-quality PNG files.', badge: 'Image Convert', highlight: 'Lossless options' },
  { title: 'PNG to JPG Converter', description: 'Compress transparent PNG images into lightweight JPEG files.', badge: 'Image Convert', highlight: 'Smaller illustrations' },
  { title: 'WEBP to JPG Converter', description: 'Convert modern WEBP images to widely supported JPGs.', badge: 'Image Convert', highlight: 'Compatibility' },
  { title: 'SVG to PNG Converter', description: 'Rasterize vector SVG illustrations into crisp PNG images.', badge: 'Image Convert', highlight: 'Vector to raster' },
  { title: 'BMP to JPG Converter', description: 'Convert heavy, uncompressed BMP files into compressed JPEGs.', badge: 'Image Convert', highlight: 'Web-ready' },
  { title: 'Resize Image', description: 'Adjust image dimensions precisely for profile pictures and uploads.', badge: 'Image Tools', highlight: 'Flexible sizing' },
  { title: 'Crop Image', description: 'Crop images precisely with X, Y, Width, and Height controls.', badge: 'Image Tools', highlight: 'Precise cropping' },
  { title: 'Rotate Image', description: 'Rotate images to any angle or flip them horizontally/vertically.', badge: 'Image Tools', highlight: 'Rotate & flip' },
  { title: 'Image Filters', description: 'Apply stylish filters like Black & White, Sepia, Blur, and Polaroid.', badge: 'Image Tools', highlight: 'Creative looks' },
  { title: 'Background Remover', description: 'Remove image backgrounds automatically for clean, crisp cut-outs.', badge: 'Image Tools', highlight: 'Auto remove' },
  { title: 'Digital Signature', description: 'Extract or apply digital signatures to documents and images.', badge: 'Document Tools', highlight: 'Sign & verify' },
  { title: 'JPG to PDF', description: 'Convert images into a clean, single PDF document.', badge: 'Document Tools', highlight: 'Image to PDF' },
  { title: 'PDF to JPG', description: 'Extract PDF pages as high-quality JPG files.', badge: 'Document Tools', highlight: 'Page extraction' },
  { title: 'PDF to Word', description: 'Turn a PDF into an editable Word (.docx) document.', badge: 'Document Tools', highlight: 'Edit PDFs' },
  { title: 'Word to PDF', description: 'Convert your Word documents into polished, shareable PDFs.', badge: 'Document Tools', highlight: 'Publish-ready' },
  { title: 'PDF to PowerPoint', description: 'Turn each PDF page into a ready-to-present slide.', badge: 'Document Tools', highlight: 'Slide export' },
  { title: 'PowerPoint to PDF', description: 'Convert PowerPoint slides into a shareable PDF file.', badge: 'Document Tools', highlight: 'Slide to PDF' },
  { title: 'Merge PDF', description: 'Combine several PDF files into a single organized document.', badge: 'Document Tools', highlight: 'Batch merging' },
  { title: 'Split PDF', description: 'Break a PDF into separate files by page or fixed chunks.', badge: 'Document Tools', highlight: 'Split pages' },
  { title: 'Organize Pages', description: 'Rearrange, reorder, or delete pages within your PDF document.', badge: 'Document Tools', highlight: 'Reorder pages' },
  { title: 'Rotate Pages', description: 'Rotate specific pages inside your PDF by 90 or 180 degrees.', badge: 'Document Tools', highlight: 'Rotate pages' },
  { title: 'Add Page Numbers', description: 'Insert page numbers into your PDF at any position.', badge: 'Document Tools', highlight: 'Numbering' },
  { title: 'Watermark PDF', description: 'Add text or image watermarks to your PDF to protect your content.', badge: 'Document Tools', highlight: 'Brand protection' },
  { title: 'Protect PDF', description: 'Add password protection to keep your PDF private and secure.', badge: 'Security', highlight: 'Password protect' },
  { title: 'Unlock PDF', description: 'Remove passwords from PDFs you own to make them accessible.', badge: 'Security', highlight: 'Unlock' },
  { title: 'PDF to Text', description: 'Extract readable plain text from your PDF files for quick editing.', badge: 'Document Tools', highlight: 'Text extraction' },
  { title: 'PDF to Excel', description: 'Detect tables in a PDF and export them into an Excel spreadsheet.', badge: 'Document Tools', highlight: 'Table extraction' }
];

const services = [
  { title: 'Custom Software', description: 'Bespoke web and mobile applications designed to align with your business processes, improve customer experience, and scale as your operations grow.', details: 'We build solutions that reduce manual effort, accelerate onboarding, and adapt as your product requirements evolve.', badge: 'Product Engineering', icon: '🧩', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80' },
  { title: 'Cloud & DevOps', description: 'Secure cloud infrastructure and DevOps pipelines that accelerate delivery, increase reliability, and keep your systems performing under demand.', details: 'From automated deployment to monitoring and cost optimization, we help your technology stay resilient while supporting fast release cycles.', badge: 'Infrastructure', icon: '☁️', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80' },
  { title: 'AI Automation', description: 'Intelligent automation workflows and AI-enabled tools that reduce manual work, accelerate decisions, and improve accuracy across teams.', details: 'We deliver tailored automations for customer interactions, document processing, and business operations to save time and cut errors.', badge: 'AI Solutions', icon: '🤖', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80' },
  { title: 'Digital Marketing', description: 'Integrated digital campaigns that build brand awareness, nurture leads, and deliver measurable business growth through data-driven execution.', details: 'We focus on the right channels, creative messaging, and analytics to turn traffic into qualified inquiries and revenue.', badge: 'Growth Marketing', icon: '📈', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80' },
  { title: 'Google Ads', description: 'Search and display campaigns crafted to capture high-intent customers, improve conversion rates, and maximize return on ad spend.', details: 'Our campaigns combine smart bidding, audience targeting, and continual optimization to help you win in search and display advertising.', badge: 'Paid Media', icon: '🔎', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80' },
  { title: 'Meta Ads', description: 'Social advertising strategies for Facebook and Instagram that expand reach, support engagement, and drive qualified leads.', details: 'We create ad funnels and creative testing that turn social engagement into measurable lead and sales outcomes.', badge: 'Social Ads', icon: '📣', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=900&q=80' },
  { title: 'SEO Services', description: 'SEO planning and optimization that helps your website rank higher, attract consistent organic traffic, and turn visitors into opportunities.', details: 'We optimize content, technical performance, and local visibility so your business appears for the queries that matter most.', badge: 'Organic Growth', icon: '🌐', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80' },
  { title: 'Social Media Management', description: 'Strategic social content, publishing, and community engagement designed to grow your brand and build meaningful audience relationships.', details: 'We manage posting schedules, creative assets, and community replies to keep your brand consistent and connected every day.', badge: 'Social Strategy', icon: '📱', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80' },
  { title: 'Content & Branding', description: 'Clear messaging, brand identity, and content strategy that position your business with confidence and drive audience trust.', details: 'We craft compelling brand stories, website copy, and campaign content that make your services easier to understand and choose.', badge: 'Branding', icon: '✍️', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80' }
];

const features = [
  { title: 'Fast & intuitive', description: 'Every solution is built to be simple, clear, and ready for daily use.' },
  { title: 'Secure by design', description: 'We protect business data and customer information with modern safeguards.' },
  { title: 'Cross-device ready', description: 'Our products work smoothly across desktop, mobile, and tablet experiences.' }
];

const stats = [
  { value: '50+', label: 'Projects delivered' },
  { value: '24/7', label: 'Support coverage' },
  { value: '100%', label: 'Client-focused delivery' }
];

const processSteps = [
  { title: 'Discovery', description: 'We clarify your goals, audience, priorities, and success metrics before design begins.', icon: '🔎' },
  { title: 'Design', description: 'We shape the experience, messaging, and technical approach around the right outcome.', icon: '🎨' },
  { title: 'Build', description: 'We create reliable solutions in phased iterations with clear milestones and feedback loops.', icon: '🛠️' },
  { title: 'Launch', description: 'We test, refine, and roll out your product with a smooth deployment and support plan.', icon: '🚀' },
  { title: 'Support', description: 'We stay involved after launch for enhancements, monitoring, and continued growth.', icon: '🤝' }
];

const testimonials = [
  { quote: 'Pims Infotech helped us modernize our document and customer processes with speed and precision.', author: 'AB. Singh, Operations Lead', icon: '⭐' },
  { quote: 'The team delivered a polished digital experience that our customers immediately noticed.', author: 'RV. Jaiswal, Product Head', icon: '🌟' },
  { quote: 'Their automation and document tools saved our team hours every week and made our workflows much more reliable.', author: 'Nisha Patel, Operations Manager', icon: '✨' },
  { quote: 'We saw better lead quality and faster campaign results after Pims Infotech built our marketing and analytics workflow.', author: 'Rahul Mehra, Growth Lead', icon: '🚀' },
  { quote: 'The onboarding was smooth and the deliverables were on time with great attention to detail.', author: 'Priya Desai, HR Head', icon: '💼' },
  { quote: 'Excellent communication and clear milestones made the whole project feel very manageable.', author: 'Vikram Sharma, CTO', icon: '📡' },
  { quote: 'Their custom tools simplified our internal approval process and improved user adoption quickly.', author: 'Anita Rao, Product Manager', icon: '✅' },
  { quote: 'Pims Infotech provided strong technical guidance and helped us avoid common pitfalls.', author: 'Samir Kulkarni, Director', icon: '🧠' },
  { quote: 'The marketing automation solution increased our qualified lead flow and reduced manual follow-up.', author: 'Sonal Mehta, Marketing Lead', icon: '📈' },
  { quote: 'We appreciated the responsive support and rapid iterations during launch week.', author: 'Karan Iyer, Business Owner', icon: '⚡' }
];

const caseStudies = [
  {
    title: 'Workflow automation for a service-led business',
    client: 'Northstar Advisory',
    challenge: 'Manual follow-up, delayed onboarding, and scattered document handling kept the team reactive.',
    before: '10+ hours weekly on repetitive admin',
    after: '5 hours weekly after automation',
    timeline: '4 weeks',
    value: '₹3.2L annual savings',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Modern storefront and lead funnel for a B2B brand',
    client: 'Apex Commerce',
    challenge: 'The website felt outdated, visitors dropped off, and campaign traffic was not converting.',
    before: '18% landing page conversion rate',
    after: '32% conversion rate after UX and funnel refresh',
    timeline: '6 weeks',
    value: '2.4x faster qualified lead flow',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'AI-powered customer support setup for a growing startup',
    client: 'BrightLane Labs',
    challenge: 'Response times were inconsistent and the team was losing time on repetitive questions.',
    before: 'Average 2-hour response window',
    after: 'Sub-20 minute response flow with automation',
    timeline: '5 weeks',
    value: '40% faster support handling',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80'
  }
];

const teamMembers = [
  {
    name: 'Ankit Sharma',
    role: 'Founder & Lead Strategist',
    initials: 'AS',
    bio: 'Leads product strategy, delivery, and client partnerships with a focus on measurable growth.',
    certs: ['Certified Digital Consultant', 'Google Ads Certified'],
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Riya Verma',
    role: 'Product Engineer',
    initials: 'RV',
    bio: 'Designs scalable web experiences and reliable systems with strong technical execution.',
    certs: ['Cloud Architecture', 'Modern Web Delivery'],
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Meera Iyer',
    role: 'Marketing & Growth Lead',
    initials: 'MI',
    bio: 'Builds search, social, and automation campaigns that turn attention into leads and revenue.',
    certs: ['SEO Strategy', 'Performance Marketing'],
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80'
  }
];

const heroImage = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80';

const trustBadges = [
  { label: 'Client-first delivery', detail: 'Transparent milestones and weekly progress updates' },
  { label: 'Security minded', detail: 'Privacy-conscious implementation and secure handoff' },
  { label: 'Award-ready execution', detail: 'Polished design systems and high-quality delivery' },
  { label: 'Trusted support', detail: 'Ongoing guidance post-launch and optimization' }
];

const packages = [
  {
    name: 'Starter',
    price: '₹25k+',
    blurb: 'A focused launch for a new offer, landing page, or MVP.',
    features: ['Landing page or starter website', 'Basic SEO setup', 'WhatsApp support for launch week'],
    cta: 'Start small'
  },
  {
    name: 'Growth',
    price: '₹60k+',
    blurb: 'A stronger website, automation layer, or lead funnel for scaling teams.',
    features: ['Custom web experience', 'Automation or CRM workflow', 'Analytics and conversion tracking'],
    cta: 'Plan a growth sprint'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    blurb: 'A tailored digital system for complex operations and high-volume demand.',
    features: ['Advanced integrations', 'Multi-step product workflow', 'Dedicated delivery and support'],
    cta: 'Book a strategy call'
  }
];

const blogPosts = [
  {
    title: 'How to choose the right tech stack for a growing business',
    category: 'Strategy',
    excerpt: 'A practical framework for deciding between speed, scalability, and long-term maintainability.'
  },
  {
    title: 'Why automation beats manual follow-up in service businesses',
    category: 'Automation',
    excerpt: 'A simple way to reduce delays, improve consistency, and free your team for higher-value work.'
  },
  {
    title: 'What a high-converting website should include in 2026',
    category: 'Growth',
    excerpt: 'The essentials for stronger trust, clearer messaging, and better lead capture.'
  }
];

const businessOutcomes = [
  { value: '30%+', label: 'Average efficiency lift', detail: 'Streamlined workflows and automation for faster delivery.' },
  { value: '24/7', label: 'Responsive support', detail: 'Reliable assistance for launch, maintenance, and growth.' },
  { value: '100%', label: 'Outcome-focused delivery', detail: 'Every project is aligned to measurable business impact.' }
];

const industries = ['Startups', 'Retail', 'Healthcare', 'Education', 'Real Estate', 'SaaS'];

const trustPoints = [
  'Transparent delivery milestones and reporting',
  'Scalable architecture for future growth',
  'Security-first implementation for sensitive data',
  'Dedicated support long after launch'
];

const faqs = [
  { question: 'Do you build custom solutions for startups and enterprises?', answer: 'Yes. We support businesses of different sizes with tailored strategy, development, and support.' },
  { question: 'Can you handle both web and mobile products?', answer: 'Absolutely. We build responsive web apps and mobile-ready experiences that fit your audience.' },
  { question: 'Do you provide support after launch?', answer: 'Yes. We offer ongoing support, maintenance, and optimization after deployment.' }
];

const companyLinks = [
  { label: 'About Us', path: '/about' },
  { label: 'Our Services', path: '/services' },
  { label: 'Contact Us', path: '/contact' }
];

const utilityIcons = {
  'ATS Resume Checker': '📊',
  'Resume Maker': '📝',
  'Marriage Biodata': '💍',
  'Image Compressor': '🖼️',
  'Compress PDF': '🗜️',
  'JPG to PNG Converter': '🔁',
  'PNG to JPG Converter': '🔁',
  'WEBP to JPG Converter': '🔁',
  'SVG to PNG Converter': '🖼️',
  'BMP to JPG Converter': '🖼️',
  'Resize Image': '📐',
  'Crop Image': '✂️',
  'Rotate Image': '🔄',
  'Image Filters': '🎨',
  'Background Remover': '🧽',
  'Digital Signature': '✍️',
  'JPG to PDF': '📄',
  'PDF to JPG': '🖨️',
  'PDF to Word': '📃',
  'Word to PDF': '📚',
  'PDF to PowerPoint': '📊',
  'PowerPoint to PDF': '📑',
  'Merge PDF': '🔗',
  'Split PDF': '✂️',
  'Organize Pages': '📚',
  'Rotate Pages': '🔁',
  'Add Page Numbers': '🔢',
  'Watermark PDF': '💧',
  'Protect PDF': '🔒',
  'Unlock PDF': '🔓',
  'PDF to Text': '📝',
  'PDF to Excel': '📈'
};

const serviceIcons = Object.fromEntries(services.map((service) => [service.title, service.icon]));
const processIcons = Object.fromEntries(processSteps.map((step) => [step.title, step.icon]));
const testimonialIcons = Object.fromEntries(testimonials.map((testimonial) => [testimonial.author, testimonial.icon]));

function ServiceIllustration({ type }) {
  const illustrations = {
    'Custom Software': (
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <rect x="14" y="18" width="92" height="84" rx="18" fill="rgba(76, 201, 240, 0.18)" stroke="rgba(67, 97, 238, 0.7)" strokeWidth="3" />
        <rect x="28" y="32" width="64" height="18" rx="8" fill="rgba(255,255,255,0.9)" />
        <rect x="28" y="58" width="64" height="10" rx="5" fill="rgba(255,255,255,0.75)" />
        <rect x="28" y="76" width="64" height="10" rx="5" fill="rgba(255,255,255,0.75)" />
        <circle cx="36" cy="106" r="6" fill="rgba(103, 232, 249, 0.9)" />
        <circle cx="60" cy="106" r="6" fill="rgba(255,255,255,0.9)" />
        <circle cx="84" cy="106" r="6" fill="rgba(255,255,255,0.9)" />
      </svg>
    ),
    'Cloud & DevOps': (
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <path d="M26 66c0-13.5 10.9-24.4 24.4-24.4 2.9 0 5.6.5 8.1 1.4 3.5-8.8 12.1-15.1 21.8-15.1 13.5 0 24.4 10.9 24.4 24.4 0 12.4-9.1 22.6-20.9 24.2" fill="rgba(67, 97, 238, 0.2)" stroke="rgba(76, 201, 240, 0.8)" strokeWidth="3" />
        <rect x="34" y="68" width="20" height="18" rx="4" fill="rgba(255,255,255,0.9)" />
        <rect x="66" y="68" width="20" height="18" rx="4" fill="rgba(255,255,255,0.9)" />
        <path d="M44 48h32" stroke="rgba(67, 97, 238, 0.7)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
    'AI Automation': (
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <rect x="32" y="24" width="56" height="72" rx="18" fill="rgba(67, 97, 238, 0.18)" stroke="rgba(76, 201, 240, 0.7)" strokeWidth="3" />
        <circle cx="60" cy="48" r="12" fill="rgba(255,255,255,0.95)" />
        <path d="M60 68v18" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
        <path d="M48 80h24" stroke="rgba(255,255,255,0.8)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="44" cy="100" r="6" fill="rgba(103, 232, 249, 0.85)" />
        <circle cx="76" cy="100" r="6" fill="rgba(255,255,255,0.85)" />
      </svg>
    ),
    'Digital Marketing': (
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <path d="M28 38h64v44H28z" fill="rgba(67, 97, 238, 0.18)" stroke="rgba(76, 201, 240, 0.75)" strokeWidth="3" />
        <path d="M34 52h18M34 64h32M34 76h26" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
        <path d="M34 42l10-12 12 10 14-16 18 22" fill="none" stroke="rgba(103, 232, 249, 0.9)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="86" cy="68" r="8" fill="rgba(103, 232, 249, 0.95)" />
      </svg>
    ),
    'Google Ads': (
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <path d="M34 90h52L92 46H34z" fill="rgba(103, 232, 249, 0.2)" stroke="rgba(76, 201, 240, 0.8)" strokeWidth="3" />
        <path d="M42 58h28" stroke="rgba(255,255,255,0.95)" strokeWidth="4" strokeLinecap="round" />
        <path d="M42 74h20" stroke="rgba(255,255,255,0.85)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="76" cy="82" r="9" fill="rgba(255,255,255,0.9)" />
      </svg>
    ),
    'Meta Ads': (
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <path d="M30 40c16-24 38-22 44 0 6 22-8 38-28 50-18-10-24-24-20-44z" fill="rgba(67, 97, 238, 0.18)" stroke="rgba(76, 201, 240, 0.8)" strokeWidth="3" />
        <path d="M90 40c-16-24-38-22-44 0-6 22 8 38 28 50 18-10 24-24 20-44z" fill="rgba(103, 232, 249, 0.16)" stroke="rgba(76, 201, 240, 0.8)" strokeWidth="3" />
        <circle cx="60" cy="60" r="10" fill="rgba(255,255,255,0.9)" />
      </svg>
    ),
    'SEO Services': (
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <circle cx="60" cy="60" r="26" fill="rgba(67, 97, 238, 0.16)" stroke="rgba(76, 201, 240, 0.8)" strokeWidth="3" />
        <path d="M60 34v14M60 72v10" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
        <path d="M34 60h12M74 60h12" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="60" cy="60" r="8" fill="rgba(255,255,255,0.95)" />
      </svg>
    ),
    'Social Media Management': (
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <rect x="24" y="28" width="72" height="70" rx="18" fill="rgba(67, 97, 238, 0.18)" stroke="rgba(76, 201, 240, 0.75)" strokeWidth="3" />
        <circle cx="60" cy="52" r="10" fill="rgba(255,255,255,0.9)" />
        <path d="M42 76h36" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
        <path d="M48 90h24" stroke="rgba(103, 232, 249, 0.85)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
    'Content & Branding': (
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <rect x="30" y="28" width="60" height="64" rx="14" fill="rgba(103, 232, 249, 0.14)" stroke="rgba(76, 201, 240, 0.8)" strokeWidth="3" />
        <path d="M40 44h40M40 60h32M40 76h28" stroke="rgba(255,255,255,0.95)" strokeWidth="4" strokeLinecap="round" />
        <path d="M58 96l8-18 8 18" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  };

  return illustrations[type] || (
    <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
      <circle cx="60" cy="60" r="32" fill="rgba(67, 97, 238, 0.2)" stroke="rgba(76, 201, 240, 0.7)" strokeWidth="3" />
      <path d="M45 60h30M60 45v30" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

const utilityLinks = utilities.map((tool) => ({ label: tool.title, path: '/contact' }));
const legalLinks = [
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms & Conditions', path: '/terms' },
  { label: 'Data Privacy Disclaimer', path: '/privacy' }
];

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadText(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, filename);
}

function buildResumeHtml(data) {
  const skills = (data.skills || '').split(',').map((item) => item.trim()).filter(Boolean);
  return `<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>${data.name || 'Resume'}</title></head>
  <body style="font-family:Arial,sans-serif;line-height:1.5;padding:24px;color:#111;">
    <h1>${data.name || 'Your Name'}</h1>
    <p>${data.email || ''} • ${data.phone || ''}</p>
    <p>${data.location || ''}</p>
    <h2>Summary</h2>
    <p>${data.summary || 'A focused professional ready to contribute.'}</p>
    <h2>Skills</h2>
    <ul>${skills.map((skill) => `<li>${skill}</li>`).join('')}</ul>
    <h2>Experience</h2>
    <p>${data.experience || 'Experienced professional with a strong track record.'}</p>
  </body>
</html>`;
}

function buildBiodataHtml(data) {
  return `<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>${data.groomName || 'Biodata'}</title></head>
  <body style="font-family:Georgia,serif;line-height:1.7;padding:24px;color:#111;">
    <h1>${data.groomName || 'Groom Name'} & ${data.brideName || 'Bride Name'}</h1>
    <p><strong>Event Date:</strong> ${data.eventDate || 'To be decided'}</p>
    <p><strong>Venue:</strong> ${data.venue || 'To be decided'}</p>
    <p><strong>Contact:</strong> ${data.contact || 'Contact details'}</p>
    <p>${data.details || 'A thoughtful profile prepared for family and community sharing.'}</p>
  </body>
</html>`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function processImageFile(file, options) {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  const angle = ((Number(options.angle) || 0) % 360 + 360) % 360;
  const targetWidth = Number(options.width) || image.width;
  const targetHeight = Number(options.height) || image.height;
  const rotated = angle === 90 || angle === 270;
  canvas.width = rotated ? targetHeight : targetWidth;
  canvas.height = rotated ? targetWidth : targetHeight;
  const context = canvas.getContext('2d');
  if (options.filter === 'grayscale') context.filter = 'grayscale(1)';
  if (options.filter === 'sepia') context.filter = 'sepia(1)';
  if (options.filter === 'blur') context.filter = 'blur(3px)';
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate((angle * Math.PI) / 180);
  if (options.removeBackground) context.globalCompositeOperation = 'destination-over';
  if (options.crop) {
    context.drawImage(image, Number(options.cropX) || 0, Number(options.cropY) || 0, targetWidth, targetHeight, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
  } else {
    context.drawImage(image, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
  }
  if (options.removeBackground) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let index = 0; index < pixels.data.length; index += 4) {
      if (pixels.data[index] > 235 && pixels.data[index + 1] > 235 && pixels.data[index + 2] > 235) pixels.data[index + 3] = 0;
    }
    context.putImageData(pixels, 0, 0);
  }
  const mimeType = options.format === 'png' ? 'image/png' : options.format === 'jpeg' ? 'image/jpeg' : 'image/webp';
  const quality = options.format === 'png' ? undefined : Number(options.quality || 0.8);
  return new Promise((resolve) => canvas.toBlob(resolve, mimeType, quality));
}

async function createPdfFromImages(files) {
  const pdfDoc = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const imageType = file.type.includes('png') ? 'png' : file.type.includes('jpeg') || file.type.includes('jpg') ? 'jpeg' : 'png';
    const image = imageType === 'png' ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  return pdfDoc.save();
}

async function mergePdfFiles(files) {
  const pdfDoc = await PDFDocument.create();
  for (const file of files) {
    const sourcePdf = await PDFDocument.load(await file.arrayBuffer());
    const copiedPages = await pdfDoc.copyPages(sourcePdf, sourcePdf.getPageIndices());
    copiedPages.forEach((page) => pdfDoc.addPage(page));
  }
  return pdfDoc.save();
}

async function splitPdfFile(file) {
  const sourcePdf = await PDFDocument.load(await file.arrayBuffer());
  const pdfs = [];
  for (let index = 0; index < sourcePdf.getPageCount(); index += 1) {
    const pdfDoc = await PDFDocument.create();
    const [page] = await pdfDoc.copyPages(sourcePdf, [index]);
    pdfDoc.addPage(page);
    pdfs.push(await pdfDoc.save());
  }
  return pdfs;
}

async function compressPdf(file) {
  const sourcePdf = await PDFDocument.load(await file.arrayBuffer());
  return sourcePdf.save();
}

async function convertPdfToImages(file) {
  const src = await file.arrayBuffer();
  const loadingTask = getDocument({ data: src });
  const pdf = await loadingTask.promise;
  const images = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d');
    await page.render({ canvasContext: context, viewport }).promise;
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    images.push(blob);
  }
  return images;
}

async function extractPdfText(file) {
  const loadingTask = getDocument({ data: await file.arrayBuffer() });
  const pdf = await loadingTask.promise;
  const pages = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(' '));
  }
  return pages.join('\n\n');
}

async function updatePdfPages(file, options) {
  const sourcePdf = await PDFDocument.load(await file.arrayBuffer());
  const pageNumbers = options.pageNumbers || sourcePdf.getPageIndices();
  const outputPdf = await PDFDocument.create();
  const copiedPages = await outputPdf.copyPages(sourcePdf, pageNumbers);
  copiedPages.forEach((page, index) => {
    if (options.rotate) page.setRotation({ angle: options.rotate, type: 'degrees' });
    if (options.numberPages) {
      page.drawText(String(index + 1), { x: 24, y: 18, size: 10 });
    }
    if (options.watermark) {
      page.drawText(options.watermark, { x: 40, y: page.getHeight() / 2, size: 24, opacity: 0.2, rotate: { angle: 45, type: 'degrees' } });
    }
  });
  copiedPages.forEach((page) => outputPdf.addPage(page));
  return outputPdf.save();
}

async function createSignatureImage(file) {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let index = 0; index < pixels.data.length; index += 4) {
    if (pixels.data[index] > 235 && pixels.data[index + 1] > 235 && pixels.data[index + 2] > 235) pixels.data[index + 3] = 0;
  }
  context.putImageData(pixels, 0, 0);
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

function calculateAtsScore(text) {
  const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim();
  const words = normalized ? normalized.split(/\s+/) : [];
  const checks = [
    { label: 'Contact details', weight: 15, passed: /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text) && /(?:\+?\d[\d\s().-]{7,})/.test(text) },
    { label: 'Professional summary', weight: 12, passed: /\b(?:summary|professional summary|profile|objective)\b/.test(normalized) },
    { label: 'Work experience', weight: 18, passed: /\b(?:experience|employment|work history|professional experience)\b/.test(normalized) },
    { label: 'Education or certifications', weight: 12, passed: /\b(?:education|degree|university|college|certification)\b/.test(normalized) },
    { label: 'Skills and technologies', weight: 15, passed: /\b(?:skills|technical skills|core competencies|technologies)\b/.test(normalized) },
    { label: 'Action verbs', weight: 10, passed: /\b(?:managed|built|created|improved|led|delivered|developed|increased|reduced|launched)\b/.test(normalized) },
    { label: 'Measurable achievements', weight: 8, passed: /\b\d+(?:%|\+|k|m| years?| months?)\b/.test(normalized) },
    { label: 'Readable length (150-1200 words)', weight: 5, passed: words.length >= 150 && words.length <= 1200 },
    { label: 'ATS-safe formatting', weight: 5, passed: !/(?:table|column|header|footer|text box|graphic)/.test(normalized) }
  ];
  return {
    score: Math.min(100, checks.reduce((total, check) => total + (check.passed ? check.weight : 0), 0)),
    improvements: checks.filter((check) => !check.passed).map((check) => check.label)
  };
}

function ToolWorkspace({ tool }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    skills: 'React, Node.js, UI Design',
    experience: '3+ years in product delivery',
    groomName: '',
    brideName: '',
    eventDate: '',
    venue: '',
    contact: '',
    details: '',
    width: '1200',
    height: '1200',
    cropX: '0',
    cropY: '0',
    quality: '0.8',
    format: 'webp',
    angle: '90',
    filter: 'none',
    pageNumbers: '',
    watermark: ''
  });
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('');
  const [atsResult, setAtsResult] = useState(null);

  useEffect(() => {
    setFiles([]);
    setStatus('');
    setAtsResult(null);
  }, [tool.title]);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleFileSelection = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
  };

  const handleGenerate = async () => {
    try {
      if (tool.title === 'ATS Resume Checker') {
        if (!files[0]) {
          setStatus('Please choose a resume text, PDF, or document file first.');
          return;
        }
        const text = files[0].type === 'application/pdf' ? await extractPdfText(files[0]) : await files[0].text();
        const atsResult = calculateAtsScore(text);
        setAtsResult(atsResult);
        setStatus(`ATS Score: ${atsResult.score}/100`);
      } else if (tool.title === 'Resume Maker') {
        setAtsResult(null);
        const filename = `${(form.name || 'resume').toLowerCase().replace(/\s+/g, '-') || 'resume'}.html`;
        downloadText(buildResumeHtml(form), filename);
        setStatus('Resume draft generated successfully.');
      } else if (tool.title === 'Marriage Biodata') {
        const filename = `${(form.groomName || 'biodata').toLowerCase().replace(/\s+/g, '-') || 'biodata'}.html`;
        downloadText(buildBiodataHtml(form), filename);
        setStatus('Biodata document generated successfully.');
      } else if (['Image Compressor', 'Resize Image', 'Crop Image', 'Rotate Image', 'Image Filters', 'Background Remover'].includes(tool.title)) {
        setAtsResult(null);
        if (!files[0]) {
          setStatus('Please choose an image file first.');
          return;
        }
        const blob = await processImageFile(files[0], {
          width: tool.title === 'Crop Image' ? Number(form.width) || 800 : Number(form.width) || 1200,
          height: tool.title === 'Crop Image' ? Number(form.height) || 800 : Number(form.height) || 1200,
          quality: Number(form.quality) || 0.8,
          format: tool.title === 'Background Remover' ? 'png' : form.format,
          angle: tool.title === 'Rotate Image' ? Number(form.angle) : 0,
          filter: tool.title === 'Image Filters' ? form.filter : 'none',
          removeBackground: tool.title === 'Background Remover',
          crop: tool.title === 'Crop Image',
          cropX: form.cropX,
          cropY: form.cropY
        });
        const extension = form.format === 'png' ? 'png' : form.format === 'jpeg' ? 'jpeg' : 'webp';
        const fileName = `${(files[0].name || 'image').replace(/\.[^.]+$/, '')}.${extension}`;
        downloadBlob(blob, fileName);
        setStatus(`Processed image saved as ${fileName}.`);
      } else if (tool.title === 'JPG to PDF') {
        setAtsResult(null);
        if (!files.length) {
          setStatus('Please choose one or more image files first.');
          return;
        }
        const buffer = await createPdfFromImages(files);
        downloadBlob(new Blob([buffer], { type: 'application/pdf' }), 'converted-images.pdf');
        setStatus('Images converted into a PDF.');
      } else if (tool.title === 'PDF to JPG') {
        setAtsResult(null);
        if (!files[0]) {
          setStatus('Please choose a PDF file first.');
          return;
        }
        const images = await convertPdfToImages(files[0]);
        images.forEach((blob, index) => downloadBlob(blob, `page-${index + 1}.jpg`));
        setStatus('PDF pages converted to JPG files.');
      } else if (tool.title === 'Compress PDF') {
        setAtsResult(null);
        if (!files[0]) {
          setStatus('Please choose a PDF file first.');
          return;
        }
        const buffer = await compressPdf(files[0]);
        downloadBlob(new Blob([buffer], { type: 'application/pdf' }), 'compressed.pdf');
        setStatus('PDF prepared for download.');
      } else if (tool.title === 'Merge PDF' || tool.title === 'PDF Merge') {
        setAtsResult(null);
        if (!files.length) {
          setStatus('Please choose at least two PDF files.');
          return;
        }
        const buffer = await mergePdfFiles(files);
        downloadBlob(new Blob([buffer], { type: 'application/pdf' }), 'merged.pdf');
        setStatus('PDF files merged successfully.');
      } else if (tool.title === 'Split PDF' || tool.title === 'PDF Split') {
        setAtsResult(null);
        if (!files[0]) {
          setStatus('Please choose a PDF file first.');
          return;
        }
        const chunks = await splitPdfFile(files[0]);
        chunks.forEach((chunk, index) => downloadBlob(new Blob([chunk], { type: 'application/pdf' }), `page-${index + 1}.pdf`));
        setStatus('PDF split into individual page files.');
      } else if (['Organize Pages', 'Rotate Pages', 'Add Page Numbers', 'Watermark PDF'].includes(tool.title)) {
        setAtsResult(null);
        if (!files[0]) {
          setStatus('Please choose a PDF file first.');
          return;
        }
        const sourcePdf = await PDFDocument.load(await files[0].arrayBuffer());
        const allPages = sourcePdf.getPageIndices();
        const requestedPages = form.pageNumbers.split(',').map((value) => Number(value.trim()) - 1).filter((value) => Number.isInteger(value) && value >= 0 && value < allPages.length);
        const pageNumbers = tool.title === 'Organize Pages' && requestedPages.length ? requestedPages : allPages;
        const buffer = await updatePdfPages(files[0], {
          pageNumbers,
          rotate: tool.title === 'Rotate Pages' ? Number(form.angle) : 0,
          numberPages: tool.title === 'Add Page Numbers',
          watermark: tool.title === 'Watermark PDF' ? form.watermark : ''
        });
        downloadBlob(new Blob([buffer], { type: 'application/pdf' }), `${tool.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
        setStatus(`${tool.title} completed successfully.`);
      } else if (tool.title === 'PDF to Text' || tool.title === 'PDF to Excel') {
        setAtsResult(null);
        if (!files[0]) {
          setStatus('Please choose a PDF file first.');
          return;
        }
        const text = await extractPdfText(files[0]);
        const output = tool.title === 'PDF to Excel' ? text.split('\n').map((line) => line.split(/\s{2,}|\t/).join(',')).join('\n') : text;
        downloadText(output, tool.title === 'PDF to Excel' ? 'extracted-table.csv' : 'extracted-text.txt');
        setStatus(`${tool.title} export downloaded.`);
      } else if (tool.title === 'Digital Signature') {
        setAtsResult(null);
        if (!files[0]) {
          setStatus('Please choose a signature image first.');
          return;
        }
        downloadBlob(await createSignatureImage(files[0]), 'transparent-signature.png');
        setStatus('Background-free signature downloaded as PNG.');
      } else if (tool.title === 'JPG to PNG Converter' || tool.title === 'PNG to JPG Converter' || tool.title === 'WEBP to JPG Converter' || tool.title === 'SVG to PNG Converter' || tool.title === 'BMP to JPG Converter') {
        setAtsResult(null);
        if (!files[0]) {
          setStatus('Please choose an image file first.');
          return;
        }
        const isPng = tool.title === 'JPG to PNG Converter' || tool.title === 'SVG to PNG Converter';
        const format = isPng ? 'png' : 'jpeg';
        const blob = await processImageFile(files[0], { format, quality: 0.92 });
        downloadBlob(blob, `${files[0].name.replace(/\.[^.]+$/, '')}.${isPng ? 'png' : 'jpg'}`);
        setStatus('Image converted successfully.');
      } else if (['PDF to Word', 'Word to PDF', 'PDF to PowerPoint', 'PowerPoint to PDF'].includes(tool.title)) {
        setAtsResult(null);
        setStatus('This browser-only version cannot preserve Office document layouts. Use PDF to Text or JPG to PDF for a reliable export.');
      } else if (tool.title === 'Protect PDF' || tool.title === 'Unlock PDF') {
        setAtsResult(null);
        setStatus('PDF encryption requires a server-side processor and is not performed in this browser-only app.');
      }
    } catch (error) {
      console.error(error);
      setStatus('The tool could not complete the action. Please try again.');
    }
  };

  const isImageTool = ['Image Compressor', 'Resize Image', 'Crop Image', 'Rotate Image', 'Image Filters', 'Background Remover'].includes(tool.title) || tool.title.includes('to PNG Converter') || tool.title.includes('to JPG Converter');
  const isPdfTool = ['ATS Resume Checker', 'JPG to PDF', 'PDF to JPG', 'Compress PDF', 'PDF Merge', 'Merge PDF', 'PDF Split', 'Split PDF', 'Organize Pages', 'Rotate Pages', 'Add Page Numbers', 'Watermark PDF', 'PDF to Text', 'PDF to Excel', 'PDF to Word', 'Word to PDF', 'PDF to PowerPoint', 'PowerPoint to PDF'].includes(tool.title);
  const isFileTool = isImageTool || isPdfTool || tool.title === 'Digital Signature';

  return (
    <div className="tool-workspace">
      {tool.title === 'Resume Maker' && (
        <div className="tool-form">
          <label>
            Full name
            <input value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Alex Johnson" />
          </label>
          <label>
            Email
            <input value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="alex@email.com" />
          </label>
          <label>
            Phone
            <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="+91 72918 52216" />
          </label>
          <label>
            Location
            <input value={form.location} onChange={(event) => updateField('location', event.target.value)} placeholder="Noida, UP" />
          </label>
          <label>
            Professional summary
            <textarea value={form.summary} onChange={(event) => updateField('summary', event.target.value)} placeholder="Describe your experience and strengths" />
          </label>
          <label>
            Skills
            <input value={form.skills} onChange={(event) => updateField('skills', event.target.value)} placeholder="React, Node.js, UI Design" />
          </label>
          <label>
            Experience
            <textarea value={form.experience} onChange={(event) => updateField('experience', event.target.value)} placeholder="Tell us about your experience" />
          </label>
        </div>
      )}

      {tool.title === 'Marriage Biodata' && (
        <div className="tool-form">
          <label>
            Groom name
            <input value={form.groomName} onChange={(event) => updateField('groomName', event.target.value)} placeholder="Groom Name" />
          </label>
          <label>
            Bride name
            <input value={form.brideName} onChange={(event) => updateField('brideName', event.target.value)} placeholder="Bride Name" />
          </label>
          <label>
            Event date
            <input value={form.eventDate} onChange={(event) => updateField('eventDate', event.target.value)} placeholder="12 August 2026" />
          </label>
          <label>
            Venue
            <input value={form.venue} onChange={(event) => updateField('venue', event.target.value)} placeholder="Grand Hall, Ranchi" />
          </label>
          <label>
            Contact details
            <input value={form.contact} onChange={(event) => updateField('contact', event.target.value)} placeholder="Phone / Email" />
          </label>
          <label>
            Biodata description
            <textarea value={form.details} onChange={(event) => updateField('details', event.target.value)} placeholder="Share family details and a short introduction" />
          </label>
        </div>
      )}

      {isFileTool && (
        <div className="tool-form">
          <label>
            Choose file{isPdfTool && tool.title !== 'JPG to PDF' ? '' : 's'}
            <input type="file" multiple={tool.title === 'JPG to PDF' || tool.title === 'PDF Merge' || tool.title === 'Merge PDF'} onChange={handleFileSelection} accept={tool.title === 'ATS Resume Checker' ? '.pdf,.txt,.doc,.docx' : tool.title === 'Word to PDF' ? '.doc,.docx,.txt' : isPdfTool && tool.title !== 'JPG to PDF' ? '.pdf' : 'image/*'} />
          </label>
          {isImageTool && (
            <>
              {tool.title === 'Crop Image' && (
                <>
                  <label>
                    Crop X
                    <input type="number" min="0" value={form.cropX} onChange={(event) => updateField('cropX', event.target.value)} />
                  </label>
                  <label>
                    Crop Y
                    <input type="number" min="0" value={form.cropY} onChange={(event) => updateField('cropY', event.target.value)} />
                  </label>
                </>
              )}
              <label>
                Width
                <input type="number" value={form.width} onChange={(event) => updateField('width', event.target.value)} />
              </label>
              <label>
                Height
                <input type="number" value={form.height} onChange={(event) => updateField('height', event.target.value)} />
              </label>
              <label>
                Quality
                <input type="range" min="0.1" max="1" step="0.1" value={form.quality} onChange={(event) => updateField('quality', event.target.value)} />
                <span>{form.quality}</span>
              </label>
              <label>
                Output format
                <select value={form.format} onChange={(event) => updateField('format', event.target.value)}>
                  <option value="webp">WebP</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                </select>
              </label>
              {tool.title === 'Rotate Image' && (
                <label>
                  Rotation
                  <select value={form.angle} onChange={(event) => updateField('angle', event.target.value)}>
                    <option value="90">90 degrees</option>
                    <option value="180">180 degrees</option>
                    <option value="270">270 degrees</option>
                  </select>
                </label>
              )}
              {tool.title === 'Image Filters' && (
                <label>
                  Filter
                  <select value={form.filter} onChange={(event) => updateField('filter', event.target.value)}>
                    <option value="none">Original</option>
                    <option value="grayscale">Black & White</option>
                    <option value="sepia">Sepia</option>
                    <option value="blur">Soft Blur</option>
                  </select>
                </label>
              )}
            </>
          )}
          {['Organize Pages', 'Rotate Pages'].includes(tool.title) && (
            <label>
              {tool.title === 'Organize Pages' ? 'Page order (example: 3,1,2)' : 'Rotation'}
              {tool.title === 'Organize Pages' ? (
                <input value={form.pageNumbers} onChange={(event) => updateField('pageNumbers', event.target.value)} placeholder="3,1,2" />
              ) : (
                <select value={form.angle} onChange={(event) => updateField('angle', event.target.value)}>
                  <option value="90">90 degrees</option>
                  <option value="180">180 degrees</option>
                  <option value="270">270 degrees</option>
                </select>
              )}
            </label>
          )}
          {tool.title === 'Watermark PDF' && (
            <label>
              Watermark text
              <input value={form.watermark} onChange={(event) => updateField('watermark', event.target.value)} placeholder="CONFIDENTIAL" />
            </label>
          )}
        </div>
      )}

      <div className="tool-actions">
        <button type="button" className="btn btn-primary" onClick={handleGenerate}>Run Tool</button>
      </div>
      {status && <p className="tool-status">{status}</p>}
      {tool.title === 'ATS Resume Checker' && atsResult && (
        <div className="tool-status">
          <strong>{atsResult.improvements.length ? 'Parameters to improve' : 'Maximum score achieved'}</strong>
          {atsResult.improvements.length > 0 && (
            <ul>
              {atsResult.improvements.map((improvement) => <li key={improvement}>{improvement}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    projectType: '',
    budgetRange: '',
    timeline: '',
    preferredContact: 'Email',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [activeTool, setActiveTool] = useState(utilities[0]);
  const [activeFaq, setActiveFaq] = useState(0);
  const [enquiries, setEnquiries] = useState(() => {
    try {
      const stored = localStorage.getItem('pimsEnquiries');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  });

  const filteredUtilities = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return utilities;
    return utilities.filter((tool) => `${tool.title} ${tool.description}`.toLowerCase().includes(search));
  }, [query]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialPairIndex, setTestimonialPairIndex] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((current) => (current + 1) % services.length);
    }, 4200);
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setTestimonialPairIndex((current) => (current + 1) % Math.ceil(testimonials.length / 2));
    }, 5200);
    return () => clearInterval(testimonialTimer);
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveEnquiry = (entry) => {
    setEnquiries((current) => {
      const next = [entry, ...current];
      try {
        localStorage.setItem('pimsEnquiries', JSON.stringify(next));
      } catch (error) {
        // ignore storage errors
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    const entry = {
      id: Date.now(),
      ...form,
      submittedAt: new Date().toISOString()
    };

    try {
      await axios.post('/api/enquiries', form);
      setStatus('Thanks! Your enquiry has been received.');
    } catch (error) {
      setStatus('Unable to send enquiry right now. Saved locally for admin review.');
    }

    saveEnquiry(entry);
    setForm({
      name: '',
      email: '',
      phone: '',
      companyName: '',
      projectType: '',
      budgetRange: '',
      timeline: '',
      preferredContact: 'Email',
      message: ''
    });
  };

  return (
    <div className="app-shell">
      <Routes>
        <Route
          path="/"
          element={
            <PageLayout>
              <main>
                <section className="hero-section">
                  <div className="hero-copy">
                    <p className="eyebrow">PIMS INFOTECH</p>
                    <h1>Building modern digital products and business solutions.</h1>
                    <p className="hero-text">
                      We design reliable software, automation, and digital experiences that help teams move faster and operate smarter — including a full suite of document and image utilities.
                    </p>
                    <div className="hero-actions">
                      <Link className="btn btn-primary" to="/contact">Book a Consultation</Link>
                      <a className="btn btn-secondary" href="#utilities">Explore Solutions</a>
                      <a className="btn btn-accent" href="https://wa.me/917291852216?text=Hello%20Pims%20Infotech%2C%20I%20would%20like%20a%20consultation." target="_blank" rel="noreferrer">WhatsApp Us</a>
                    </div>
                    <div className="hero-stats">
                      {stats.map((stat) => (
                        <div key={stat.label}>
                          <strong>{stat.value}</strong>
                          <span>{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="hero-side">
                    <div className="hero-preview">
                      <div className="hero-preview-header">
                        <p className="eyebrow">Scene: service spotlight</p>
                        <h3>Hero service carousel</h3>
                      </div>
                      <div className="hero-slides" aria-live="polite">
                        {services.map((service, index) => (
                          <article key={service.title} className={`hero-slide ${index === currentSlide ? 'active' : ''}`}>
                            <span className="hero-slide-badge">{service.badge}</span>
                            <div className="hero-slide-media">
                              <img src={service.image} alt={service.title} loading="lazy" />
                            </div>
                            <h4>{service.title}</h4>
                            <p>{service.description}</p>
                          </article>
                        ))}
                      </div>
                      <div className="hero-slide-controls">
                        {services.map((_, index) => (
                          <button
                            type="button"
                            key={index}
                            className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Show ${services[index].title}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="hero-card">
                      <p className="hero-card-label">Core focus areas</p>
                      <ul>
                        <li>Custom software and web platforms that match your business goals</li>
                        <li>Digital marketing, Google Ads, Meta Ads, and SEO for measurable growth</li>
                        <li>Automation and AI-driven workflows to reduce effort and improve speed</li>
                        <li>Resume, biodata, PDF, and image tools that support modern business needs</li>
                      </ul>
                      <Link to="/services" className="text-link">View our services →</Link>
                    </div>
                  </div>
                </section>

                <section className="section alt-section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow"><span className="section-badge">⚡</span> OUR SERVICES</p>
                      <h2>Technology solutions built for real business needs</h2>
                    </div>
                  </div>
                  <div className="service-grid">
                    {services.map((service) => (
                      <article className="feature-card service-card" key={service.title}>
                        <div className="feature-card-header">
                          <div className="card-icon">{serviceIcons[service.title]}</div>
                          <h3>{service.title}</h3>
                        </div>
                        <div className="feature-card-body">
                          <span className="chip">{service.badge}</span>
                          <p>{service.description}</p>
                          <p className="service-detail">{service.details}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow"><span className="section-badge">📊</span> CASE STUDIES</p>
                      <h2>Proof that our work creates measurable business value</h2>
                    </div>
                  </div>
                  <div className="case-study-grid">
                    {caseStudies.map((study) => (
                      <article className="feature-card case-study-card" key={study.title}>
                        {study.image && <img className="case-study-image" src={study.image} alt={study.title} loading="lazy" />}
                        <div className="case-study-top">
                          <span className="chip">{study.client}</span>
                          <h3>{study.title}</h3>
                        </div>
                        <p>{study.challenge}</p>
                        <div className="case-study-metrics">
                          <div className="case-study-metric">
                            <span>Before</span>
                            <strong>{study.before}</strong>
                          </div>
                          <div className="case-study-metric">
                            <span>After</span>
                            <strong>{study.after}</strong>
                          </div>
                        </div>
                        <div className="case-study-meta">
                          <span>Timeline: {study.timeline}</span>
                          <span>Value: {study.value}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="section alt-section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow"><span className="section-badge">🏅</span> TRUST & CREDIBILITY</p>
                      <h2>Built to feel dependable from the first conversation</h2>
                    </div>
                  </div>
                  <div className="trust-badges">
                    {trustBadges.map((badge) => (
                      <div className="trust-badge-card" key={badge.label}>
                        <strong>{badge.label}</strong>
                        <span>{badge.detail}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow"><span className="section-badge">👥</span> TEAM & FOUNDER</p>
                      <h2>A small expert team that combines strategy, product, and growth</h2>
                    </div>
                  </div>
                  <div className="team-grid">
                    {teamMembers.map((member) => (
                      <article className="feature-card team-card" key={member.name}>
                        <div className="team-avatar">{member.initials}</div>
                        <span className="chip">{member.role}</span>
                        <h3>{member.name}</h3>
                        <p>{member.bio}</p>
                        <div className="team-cert-list">
                          {member.certs.map((cert) => (
                            <span key={cert} className="industry-chip">{cert}</span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="section alt-section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow"><span className="section-badge">💼</span> SERVICE PACKAGES</p>
                      <h2>Flexible options for launch, growth, and long-term delivery</h2>
                    </div>
                  </div>
                  <div className="package-grid">
                    {packages.map((pkg) => (
                      <article className="feature-card package-card" key={pkg.name}>
                        <div className="package-top">
                          <div>
                            <h3>{pkg.name}</h3>
                            <p>{pkg.blurb}</p>
                          </div>
                          <strong className="package-price">{pkg.price}</strong>
                        </div>
                        <ul>
                          {pkg.features.map((feature) => (
                            <li key={feature}>{feature}</li>
                          ))}
                        </ul>
                        <Link className="btn btn-secondary" to="/contact">{pkg.cta}</Link>
                      </article>
                    ))}
                  </div>
                </section>

                <section id="utilities" className="section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow"><span className="section-badge">🛠️</span> FEATURED SOLUTIONS</p>
                      <h2>Everyday tools for documents, images, and business workflows</h2>
                    </div>
                    <input
                      className="search-bar"
                      type="search"
                      placeholder="Search utilities"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <div className="utility-layout">
                    <div className="card-grid">
                      {filteredUtilities.map((tool) => (
                        <button
                          className={`utility-card ${activeTool.title === tool.title ? 'active' : ''}`}
                          key={tool.title}
                          type="button"
                          onClick={() => setActiveTool(tool)}
                        >
                          <div className="utility-card-header">
                            <div className="card-icon">{utilityIcons[tool.title]}</div>
                            <h4>{tool.title}</h4>
                          </div>
                          <span className="chip">{tool.badge}</span>
                          <p>{tool.description}</p>
                          <span className="card-link">Try this tool →</span>
                        </button>
                      ))}
                    </div>
                    <aside className="preview-card">
                      <p className="eyebrow">WORKSPACE</p>
                      <h3>{activeTool.title}</h3>
                      <p>{activeTool.description}</p>
                      <ToolWorkspace tool={activeTool} />
                    </aside>
                  </div>
                </section>

                <section className="section alt-section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow"><span className="section-badge">🧭</span> OUR PROCESS</p>
                      <h2>A clear path from idea to launch</h2>
                    </div>
                  </div>
                  <div className="process-grid">
                    {processSteps.map((step, index) => (
                      <article className="feature-card" key={step.title}>
                        <div className="card-icon">{processIcons[step.title]}</div>
                        <span className="step-number">0{index + 1}</span>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow"><span className="section-badge">📈</span> BUSINESS IMPACT</p>
                      <h2>Built to look credible, perform reliably, and scale with your business</h2>
                    </div>
                  </div>
                  <div className="business-showcase">
                    <div className="business-panel">
                      <h3>Why growing businesses choose us</h3>
                      <ul>
                        {trustPoints.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="business-panel">
                      <div className="outcomes-grid">
                        {businessOutcomes.map((item) => (
                          <div key={item.label} className="outcome-card">
                            <strong>{item.value}</strong>
                            <span>{item.label}</span>
                            <p>{item.detail}</p>
                          </div>
                        ))}
                      </div>
                      <div className="industry-list">
                        {industries.map((industry) => (
                          <span key={industry} className="industry-chip">{industry}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow"><span className="section-badge">💬</span> TESTIMONIALS</p>
                      <h2>Trusted by teams that value reliability</h2>
                    </div>
                  </div>
                  <div className="testimonial-slider">
                    {testimonials.slice(testimonialPairIndex * 2, testimonialPairIndex * 2 + 2).map((item) => (
                      <article key={item.author} className="testimonial-slide active">
                        <div className="testimonial-card feature-card">
                          <div className="card-icon">{testimonialIcons[item.author]}</div>
                          <p className="testimonial-quote">“{item.quote}”</p>
                          <strong className="testimonial-author">{item.author}</strong>
                        </div>
                      </article>
                    ))}
                    {testimonials.length % 2 === 1 && testimonialPairIndex === Math.floor(testimonials.length / 2) && testimonials.length > 1 && (
                      <article key="testimonial-empty" className="testimonial-slide testimonial-empty" aria-hidden="true" />
                    )}
                  </div>
                  <div className="testimonial-dots">
                    {Array.from({ length: Math.ceil(testimonials.length / 2) }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`testimonial-dot ${index === testimonialPairIndex ? 'active' : ''}`}
                        onClick={() => setTestimonialPairIndex(index)}
                        aria-label={`Show testimonial pair ${index + 1}`}
                      />
                    ))}
                  </div>
                </section>

                <section className="section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow"><span className="section-badge">📝</span> INSIGHTS</p>
                      <h2>Practical ideas for stronger digital growth</h2>
                    </div>
                  </div>
                  <div className="blog-grid">
                    {blogPosts.map((post) => (
                      <article className="blog-card" key={post.title}>
                        <span className="chip">{post.category}</span>
                        <h3>{post.title}</h3>
                        <p>{post.excerpt}</p>
                        <Link className="text-link" to="/contact">Discuss this idea →</Link>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="section alt-section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow"><span className="section-badge">❓</span> FAQ</p>
                      <h2>Helpful answers before you start</h2>
                    </div>
                  </div>
                  <div className="faq-list">
                    {faqs.map((faq, index) => {
                      const open = activeFaq === index;
                      return (
                        <div className={`faq-item ${open ? 'open' : ''}`} key={faq.question}>
                          <button className="faq-question" type="button" onClick={() => setActiveFaq(open ? -1 : index)}>
                            <span>{faq.question}</span>
                            <span>{open ? '−' : '+'}</span>
                          </button>
                          {open && <p className="faq-answer">{faq.answer}</p>}
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section id="contact" className="section contact-section">
                  <div className="contact-intro">
                    <p className="eyebrow"><span className="section-badge">📩</span> CONTACT</p>
                    <h2>Let’s build something useful for your business.</h2>
                    <p>
                      Reach out for support, product discussions, or help getting started with your next digital solution.
                    </p>
                    <ul className="contact-list">
                      <li>Email: contact@pimsinfotech.com</li>
                      <li>Phone: +91 72918 52216</li>
                      <li>Address: B-88 Basement Office No 05, Block-B, Sector-02 (Nearest Metro Station 15), Noida, Uttar Pradesh, 201301</li>
                    </ul>
                    <div className="contact-cta-row">
                      <a className="btn btn-secondary" href="https://wa.me/917291852216?text=Hello%20Pims%20Infotech%2C%20I%20would%20like%20to%20discuss%20my%20project." target="_blank" rel="noreferrer">WhatsApp Now</a>
                      <a className="btn btn-secondary" href="mailto:contact@pimsinfotech.com">Email Us</a>
                    </div>
                  </div>
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                      <label>
                        <span>Name</span>
                        <input value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
                      </label>
                      <label>
                        <span>Email</span>
                        <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
                      </label>
                      <label>
                        <span>Phone</span>
                        <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="Optional" />
                      </label>
                      <label>
                        <span>Company</span>
                        <input value={form.companyName} onChange={(e) => updateField('companyName', e.target.value)} placeholder="Optional" />
                      </label>
                      <label>
                        <span>Project type</span>
                        <input value={form.projectType} onChange={(e) => updateField('projectType', e.target.value)} placeholder="Website, automation, app..." />
                      </label>
                      <label>
                        <span>Budget range</span>
                        <select value={form.budgetRange} onChange={(e) => updateField('budgetRange', e.target.value)}>
                          <option value="">Select budget</option>
                          <option value="Under ₹25k">Under ₹25k</option>
                          <option value="₹25k - ₹60k">₹25k - ₹60k</option>
                          <option value="₹60k - ₹1.5L">₹60k - ₹1.5L</option>
                          <option value="Custom / Enterprise">Custom / Enterprise</option>
                        </select>
                      </label>
                      <label>
                        <span>Timeline</span>
                        <select value={form.timeline} onChange={(e) => updateField('timeline', e.target.value)}>
                          <option value="">Select timeline</option>
                          <option value="This month">This month</option>
                          <option value="Next 1-3 months">Next 1-3 months</option>
                          <option value="Next 3-6 months">Next 3-6 months</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                      </label>
                      <label>
                        <span>Preferred contact</span>
                        <select value={form.preferredContact} onChange={(e) => updateField('preferredContact', e.target.value)}>
                          <option value="Email">Email</option>
                          <option value="Phone">Phone</option>
                          <option value="WhatsApp">WhatsApp</option>
                        </select>
                      </label>
                    </div>
                    <label>
                      <span>Project details</span>
                      <textarea value={form.message} onChange={(e) => updateField('message', e.target.value)} required />
                    </label>
                    <button type="submit" className="btn btn-primary">Send Enquiry</button>
                    {status && <p className="status">{status}</p>}
                  </form>
                </section>
              </main>
            </PageLayout>
          }
        />
        <Route path="/services" element={<InfoPage title="Our Services" body="Pims Infotech offers custom software, cloud and DevOps services, AI-driven automation, and document workflow solutions designed to fit modern businesses." />} />
        <Route path="/about" element={<InfoPage title="About Pims Infotech" body="Pims Infotech is a technology-focused company that helps businesses modernize products, automate everyday tasks, and deliver polished digital experiences with dependable support." />} />
        <Route path="/admin" element={<AdminDashboard enquiries={enquiries} setEnquiries={setEnquiries} />} />
        <Route path="/contact" element={<InfoPage title="Contact Pims Infotech" body="Use the contact form or reach us directly at contact@pimsinfotech.com or +91 72918 52216. We are happy to help with product questions, support needs, and workflow guidance." />} />
        <Route path="/privacy" element={<InfoPage title="Privacy Policy" body="We respect your privacy and use your data only to provide support, respond to enquiries, and improve our services. Any information you share through the site will be handled carefully and securely." />} />
        <Route path="/terms" element={<InfoPage title="Terms & Conditions" body="By using these services, you agree to use them responsibly and lawfully. Pims Infotech reserves the right to update these terms as the platform evolves." />} />
      </Routes>
    </div>
  );
}

function AdminDashboard({ enquiries, setEnquiries }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ name: '', email: '', message: '' });

  const saveStorage = (next) => {
    setEnquiries(next);
    try {
      localStorage.setItem('pimsEnquiries', JSON.stringify(next));
    } catch (error) {}
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setDraft({ name: entry.name, email: entry.email, message: entry.message });
  };

  const handleDelete = (id) => {
    const next = enquiries.filter((entry) => entry.id !== id);
    saveStorage(next);
  };

  const handleSave = () => {
    const next = enquiries.map((entry) => {
      if (entry.id !== editingId) return entry;
      return { ...entry, ...draft };
    });
    saveStorage(next);
    setEditingId(null);
    setDraft({ name: '', email: '', message: '' });
  };

  const handleDownload = () => {
    const header = ['Name', 'Email', 'Message', 'Submitted At'];
    const rows = enquiries.map((entry) => [entry.name, entry.email, entry.message, entry.submittedAt]);
    const csv = [header, ...rows]
      .map((row) => row.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pims-enquiries.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <PageLayout>
      <main className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span className="section-badge">🗂️</span> ADMIN DASHBOARD</p>
            <h2>Manage enquiries</h2>
          </div>
          <div className="hero-actions">
            <button type="button" className="btn btn-secondary" onClick={handleDownload}>Export CSV</button>
          </div>
        </div>

        <div className="alt-section admin-dashboard">
          {editingId && (
            <section className="admin-editor">
              <h3>Edit enquiry</h3>
              <label>
                Name
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </label>
              <label>
                Email
                <input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              </label>
              <label>
                Message
                <textarea value={draft.message} onChange={(e) => setDraft({ ...draft, message: e.target.value })} />
              </label>
              <div className="hero-actions">
                <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </section>
          )}

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan="5">No enquiries yet.</td>
                </tr>
              ) : enquiries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.name}</td>
                  <td>{entry.email}</td>
                  <td>{entry.message}</td>
                  <td>{new Date(entry.submittedAt).toLocaleString()}</td>
                  <td className="admin-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => handleEdit(entry)}>Edit</button>
                    <button type="button" className="btn btn-secondary" onClick={() => handleDelete(entry.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </PageLayout>
  );
}

function PageLayout({ children }) {
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link className="brand" to="/">
            <span className="brand-mark">
              <img src={logoImage} alt="Pims Infotech logo" />
            </span>
            <span className="brand-text">PIMS INFOTECH</span>
          </Link>
          <nav className="topnav">
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/admin">Admin</Link>
            <a href="#contact">Contact</a>
          </nav>
          <div className="topbar-actions">
            <Link className="text-link" to="/privacy">Privacy</Link>
            <div className="quick-contact" tabIndex={0}>
              <button type="button" className="quick-contact-toggle" aria-label="Quick contact access">
                <span>✆</span>
              </button>
              <div className="quick-contact-menu">
                <a className="quick-contact-item" href="https://wa.me/917291852216" target="_blank" rel="noreferrer">
                  <span className="qc-icon">🟢</span>
                  <span>WhatsApp</span>
                </a>
                <a className="quick-contact-item" href="tel:+917291852216">
                  <span className="qc-icon">📞</span>
                  <span>Call</span>
                </a>
                <a className="quick-contact-item" href="mailto:contact@pimsinfotech.com">
                  <span className="qc-icon">✉️</span>
                  <span>Email</span>
                </a>
              </div>
            </div>
            <Link className="btn btn-primary" to="/contact">Get Started</Link>
          </div>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div>
          <h4>Company</h4>
          <ul>
            {companyLinks.map((link) => (
              <li key={link.label}><Link to={link.path}>{link.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Solutions</h4>
          <ul>
            {utilityLinks.map((link) => (
              <li key={link.label}><Link to={link.path}>{link.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Legal</h4>
          <ul>
            {legalLinks.map((link) => (
              <li key={link.label}><Link to={link.path}>{link.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:contact@pimsinfotech.com">contact@pimsinfotech.com</a></li>
            <li><a href="tel:+917291852216">+91 72918 52216</a></li>
            <li>Noida, Uttar Pradesh</li>
          </ul>
        </div>
      </footer>
    </>
  );
}

function InfoPage({ title, body }) {
  return (
    <PageLayout>
      <main className="info-page">
        <div className="info-card">
          <p className="eyebrow">PIMS INFOTECH</p>
          <h1>{title}</h1>
          <p>{body}</p>
          <Link className="btn btn-primary" to="/">Back to home</Link>
        </div>
      </main>
    </PageLayout>
  );
}

export default App;
