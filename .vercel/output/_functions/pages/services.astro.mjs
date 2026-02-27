/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_sjUij8hI.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../chunks/MainLayout_DAhHq353.mjs';
import { $ as $$Card } from '../chunks/Card_BmPa3zeO.mjs';
import { c as c2, a as c3, b as c4, d as c5, e as c6, $ as $$ServiceCard } from '../chunks/card-pic6_Byzc6BQ_.mjs';
import { c as c1 } from '../chunks/card-pic1_DBXZhX1K.mjs';
/* empty css                                    */
export { renderers } from '../renderers.mjs';

const $$Services = createComponent(($$result, $$props, $$slots) => {
  const services = [
    {
      index: 1,
      titleTop: "Search Engine",
      titleBottom: "Optimization",
      img: c1,
      alt: "SEO",
      description: "We optimize your website to rank higher in search engine results pages, driving more organic traffic to your site. Our SEO services include keyword research, on-page optimization, technical SEO, and link building strategies.",
      benefits: ["Increased organic traffic", "Higher website rankings", "Better user experience", "Increased brand visibility"],
      cta: "Get SEO Audit",
      link: "/services/seo"
    },
    {
      index: 2,
      titleTop: "Pay-per-click",
      titleBottom: "advertising",
      img: c2,
      alt: "PPC",
      description: "Our PPC services help you maximize your advertising budget by creating targeted campaigns that reach the right audience at the right time. We manage campaigns across Google Ads, Bing Ads, and social media platforms.",
      benefits: ["Immediate website traffic", "Highly targeted advertising", "Measurable ROI", "Flexible budgeting options"],
      cta: "Start PPC Campaign",
      link: "/services/ppc"
    },
    {
      index: 3,
      titleTop: "Social Media",
      titleBottom: "Marketing",
      img: c3,
      alt: "Social Media Marketing",
      description: "We help you build and engage with your audience across various social media platforms. Our services include content creation, community management, paid social advertising, and performance analytics.",
      benefits: ["Increased brand awareness", "Better customer engagement", "Higher conversion rates", "Audience insights"],
      cta: "Social Media Strategy",
      link: "/services/social-media"
    },
    {
      index: 1,
      titleTop: "Email",
      titleBottom: "Marketing",
      img: c4,
      alt: "Email Marketing",
      description: "Our email marketing services help you nurture leads and maintain customer relationships through personalized campaigns. We handle everything from strategy development to design, automation, and performance analysis.",
      benefits: ["Direct customer communication", "High ROI", "Personalized messaging", "Automated workflows"],
      cta: "Start Email Campaign",
      link: "/services/email-marketing"
    },
    {
      index: 2,
      titleTop: "Content",
      titleBottom: "Creation",
      img: c5,
      alt: "Content Creation",
      description: "We create high-quality, engaging content that resonates with your target audience and helps achieve your business goals. Our content services include blog posts, articles, ebooks, infographics, videos, and more.",
      benefits: ["Increased audience engagement", "Improved brand authority", "Better search visibility", "Valuable marketing assets"],
      cta: "Content Strategy",
      link: "/services/content"
    },
    {
      index: 3,
      titleTop: "Analytics and",
      titleBottom: "Tracking",
      img: c6,
      alt: "Analytics",
      description: "We help you make data-driven decisions by setting up comprehensive tracking systems and providing actionable insights. Our services include setting up analytics tools, custom dashboards, conversion tracking, and regular reporting.",
      benefits: ["Data-driven decision making", "Performance tracking", "User behavior insights", "ROI measurement"],
      cta: "Analytics Setup",
      link: "/services/analytics"
    }
  ];
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Our Services | Positivus", "description": "Explore our comprehensive range of digital marketing services including SEO, PPC, social media marketing, email marketing, content creation, and analytics.", "data-astro-cid-ucd2ps2b": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="py-16 px-4 mx-auto max-w-screen-xl lg:py-24 lg:px-6" data-astro-cid-ucd2ps2b> <div class="text-center mb-16" data-astro-cid-ucd2ps2b> <h1 class="mb-4 text-5xl font-medium leading-none tracking-tight md:text-6xl" data-astro-cid-ucd2ps2b>Our Services</h1> <p class="text-xl font-normal leading-7 mx-auto max-w-3xl" data-astro-cid-ucd2ps2b>
At Positivus, we offer a comprehensive range of digital marketing services designed to help your business thrive in the online world. Explore our services below to find the perfect solution for your needs.
</p> </div> <div class="space-y-24" data-astro-cid-ucd2ps2b> ${services.map((service, index) => renderTemplate`<div class="service-item" data-astro-cid-ucd2ps2b> <div class="mb-12" data-astro-cid-ucd2ps2b> ${renderComponent($$result2, "ServiceCard", $$ServiceCard, { "index": service.index, "titleTop": service.titleTop, "titleBottom": service.titleBottom, "img": service.img, "alt": service.alt, "link": service.link, "data-astro-cid-ucd2ps2b": true })} </div> <div class="grid md:grid-cols-2 gap-10 px-4" data-astro-cid-ucd2ps2b> <div data-astro-cid-ucd2ps2b> <h3 class="text-2xl font-medium mb-4" data-astro-cid-ucd2ps2b>What we offer</h3> <p class="mb-6" data-astro-cid-ucd2ps2b>${service.description}</p> <a${addAttribute(service.link, "href")} class="inline-flex items-center px-8 py-4 bg-green text-dark rounded-2xl hover:bg-dark hover:text-white transition-all font-medium" data-astro-cid-ucd2ps2b> ${service.cta} <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-ucd2ps2b> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" data-astro-cid-ucd2ps2b></path> </svg> </a> </div> <div class="bg-gray rounded-2xl p-8" data-astro-cid-ucd2ps2b> <h3 class="text-2xl font-medium mb-4" data-astro-cid-ucd2ps2b>Benefits</h3> <ul class="space-y-4" data-astro-cid-ucd2ps2b> ${service.benefits.map((benefit) => renderTemplate`<li class="flex items-start" data-astro-cid-ucd2ps2b> <svg class="mr-2 w-5 h-5 mt-1 text-green" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-astro-cid-ucd2ps2b> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-astro-cid-ucd2ps2b></path> </svg> <span data-astro-cid-ucd2ps2b>${benefit}</span> </li>`)} </ul> </div> </div> </div>`)} </div> <div class="mt-24 text-center" data-astro-cid-ucd2ps2b> ${renderComponent($$result2, "Card", $$Card, { "data-astro-cid-ucd2ps2b": true }, { "default": ($$result3) => renderTemplate` <div class="p-10 md:p-16" data-astro-cid-ucd2ps2b> <h2 class="text-3xl md:text-4xl font-medium mb-6" data-astro-cid-ucd2ps2b>Ready to transform your digital presence?</h2> <p class="mb-10 text-xl max-w-2xl mx-auto" data-astro-cid-ucd2ps2b>
Contact us today to discuss your digital marketing needs and discover how our services can help your business grow and succeed online.
</p> <a href="/contact" class="inline-flex items-center px-10 py-5 bg-dark text-white rounded-2xl hover:bg-green hover:text-dark transition-all font-medium text-xl" data-astro-cid-ucd2ps2b>
Get in touch
</a> </div> ` })} </div> </div> ` })} `;
}, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/pages/services.astro", void 0);

const $$file = "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/pages/services.astro";
const $$url = "/services";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Services,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
