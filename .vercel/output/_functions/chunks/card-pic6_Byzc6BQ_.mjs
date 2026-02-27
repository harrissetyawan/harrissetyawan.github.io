import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from './astro/server_sjUij8hI.mjs';
import 'piccolore';
import { $ as $$Image } from './_astro_assets_Iz0geHP9.mjs';
import { $ as $$Card } from './Card_BmPa3zeO.mjs';
import { c as createSvgComponent } from './MainLayout_DAhHq353.mjs';
/* empty css                         */

const gob = createSvgComponent({"meta":{"src":"/_astro/icon6.gU4U-Esm.svg","width":41,"height":41,"format":"svg"},"attributes":{"width":"41","height":"41","viewBox":"0 0 41 41","fill":"none"},"children":"\n<circle cx=\"20.5\" cy=\"20.5\" r=\"20.5\" fill=\"#191A23\" />\n<path d=\"M11.2501 24.7009C10.5326 25.1151 10.2868 26.0325 10.701 26.75C11.1152 27.4674 12.0326 27.7132 12.7501 27.299L11.2501 24.7009ZM30.7694 16.3882C30.9839 15.588 30.509 14.7655 29.7088 14.5511L16.6688 11.057C15.8686 10.8426 15.0461 11.3175 14.8317 12.1177C14.6173 12.9179 15.0921 13.7404 15.8923 13.9548L27.4834 17.0606L24.3776 28.6517C24.1632 29.4519 24.6381 30.2744 25.4383 30.4888C26.2385 30.7033 27.061 30.2284 27.2754 29.4282L30.7694 16.3882ZM12.7501 27.299L30.0706 17.299L28.5706 14.7009L11.2501 24.7009L12.7501 27.299Z\" fill=\"#B9FF66\" />\n"});

const wob = createSvgComponent({"meta":{"src":"/_astro/icon7._oy4oYgP.svg","width":41,"height":41,"format":"svg"},"attributes":{"width":"41","height":"41","viewBox":"0 0 41 41","fill":"none"},"children":"\n<circle cx=\"20.5\" cy=\"20.5\" r=\"20.5\" fill=\"white\" />\n<path d=\"M11.2501 24.7009C10.5326 25.1151 10.2868 26.0325 10.701 26.75C11.1152 27.4674 12.0326 27.7132 12.7501 27.299L11.2501 24.7009ZM30.7694 16.3882C30.9839 15.588 30.509 14.7655 29.7088 14.5511L16.6688 11.057C15.8686 10.8426 15.0461 11.3175 14.8317 12.1177C14.6173 12.9179 15.0921 13.7404 15.8923 13.9548L27.4834 17.0606L24.3776 28.6517C24.1632 29.4519 24.6381 30.2744 25.4383 30.4888C26.2385 30.7033 27.061 30.2284 27.2754 29.4282L30.7694 16.3882ZM12.7501 27.299L30.0706 17.299L28.5706 14.7009L11.2501 24.7009L12.7501 27.299Z\" fill=\"black\" />\n"});

const $$Astro = createAstro("https://positivustheme.vercel.app");
const $$ServiceCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ServiceCard;
  const { index, titleTop, titleBottom, img, alt, link } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Card", $$Card, { "isUnderline": true, "data-astro-cid-qzn24t3o": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div${addAttribute(`h-[300px] w-full sm:h-full lg:gap-[60px] grid custom-grid lg:grid-cols-2 lg:grid-rows-1 p-8 sm:p-[50px] rounded-[45px] ${index === 1 ? "bg-gray" : index === 2 ? "bg-green" : "bg-dark text-gray"}`, "class")} data-astro-cid-qzn24t3o> <h3${addAttribute(`flex flex-col col-span-2 lg:col-span-1`, "class")} data-astro-cid-qzn24t3o> <span${addAttribute(`w-[fit-content] ${index === 1 ? "greenhead" : "whitehead"}`, "class")} data-astro-cid-qzn24t3o>${titleTop}</span> <span${addAttribute(`w-[fit-content] ${index === 1 ? "greenhead" : "whitehead"}`, "class")} data-astro-cid-qzn24t3o>${titleBottom}</span> </h3> <picture class="w-full h-full row-span-1 order-1 lg:order-none lg:row-span-2 flex justify-center items-center" data-astro-cid-qzn24t3o> ${renderComponent($$result2, "Image", $$Image, { "src": img, "alt": alt, "class": "h-[100px] w-auto sm:h-auto sm:w-3/4 object-cover", "data-astro-cid-qzn24t3o": true })} </picture> <div class="flex items-end" data-astro-cid-qzn24t3o> <a${addAttribute(link, "href")} class="flex items-center gap-3.5" data-astro-cid-qzn24t3o>${renderComponent($$result2, "Image", $$Image, { "src": index === 1 || index === 2 ? gob : wob, "alt": alt, "data-astro-cid-qzn24t3o": true })} <span class="hidden sm:block" data-astro-cid-qzn24t3o>Service Info</span></a> </div> </div> ` })} `;
}, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/components/ui/ServiceCard.astro", void 0);

const c2 = new Proxy({"src":"/_astro/card-pic2.BeQ4x_k2.png","width":210,"height":148,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/assets/pics/card-pic2.png";
							}
							
							return target[name];
						}
					});

const c3 = new Proxy({"src":"/_astro/card-pic3.D4d3JTsx.png","width":210,"height":210,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/assets/pics/card-pic3.png";
							}
							
							return target[name];
						}
					});

const c4 = new Proxy({"src":"/_astro/card-pic4.CPZGvqT8.png","width":210,"height":194,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/assets/pics/card-pic4.png";
							}
							
							return target[name];
						}
					});

const c5 = new Proxy({"src":"/_astro/card-pic5.CqK5dBMJ.png","width":210,"height":196,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/assets/pics/card-pic5.png";
							}
							
							return target[name];
						}
					});

const c6 = new Proxy({"src":"/_astro/card-pic6.CXJkFMY0.png","width":210,"height":170,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/assets/pics/card-pic6.png";
							}
							
							return target[name];
						}
					});

export { $$ServiceCard as $, c3 as a, c4 as b, c2 as c, c5 as d, c6 as e };
