/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_sjUij8hI.mjs';
import 'piccolore';
import { $ as $$MainLayout } from '../chunks/MainLayout_DAhHq353.mjs';
import { $ as $$Sponsors, a as $$Services } from '../chunks/Services_BZihe-Rc.mjs';
export { renderers } from '../renderers.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "About us" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="space-y-20"> <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-3"> <div class="relative flex flex-col-reverse items-center md:flex-row" id="hero"> <div class="row items-center py-5 md:pb-20 md:pt-10"> <div class="text-center space-y-10"> <h2 class="text-5xl font-medium leading-none md:text-6xl">We Navigate the <br> digital landscape <br> for success</h2> <p class="mt-6 mb-8  text-xl font-normal leading-7 sm:mb-12">Our digital marketing agency helps businesses grow and succeed online through a range of services including SEO, PPC, social media marketing, and content creation.</p> <a class="px-9 py-5 bg-zinc-900 hover:bg-white text-white hover:text-black border rounded-2xl justify-items-center md:justify-items-start gap-2.5 inline-flex" rel="noopener noreferrer" href="https://github.com/manulthanura/Positivus" target="_blank"> <h2 class="text-center text-xl font-normal leading-7">Book a consultation</h2> </a> </div> </div> </div> </div> ${renderComponent($$result2, "Sponsors", $$Sponsors, {})} ${renderComponent($$result2, "Services", $$Services, {})} </main> ` })}`;
}, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/pages/about.astro", void 0);

const $$file = "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
        __proto__: null,
        default: $$About,
        file: $$file,
        url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
