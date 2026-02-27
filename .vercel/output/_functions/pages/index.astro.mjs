/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute, h as renderScript, b as createAstro } from '../chunks/astro/server_sjUij8hI.mjs';
import 'piccolore';
import { $ as $$Image } from '../chunks/_astro_assets_Iz0geHP9.mjs';
import { $ as $$Card } from '../chunks/Card_BmPa3zeO.mjs';
import { b as $$Section, c as $$SectionTitle, $ as $$Sponsors, a as $$Services } from '../chunks/Services_BZihe-Rc.mjs';
import { l as larrow } from '../chunks/icon3_DAL8aASk.mjs';
/* empty css                                 */
import { c as createSvgComponent, $ as $$MainLayout } from '../chunks/MainLayout_DAhHq353.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Cases = createComponent(($$result, $$props, $$slots) => {
  const cards = [
    {
      index: 0,
      title: "For a local restaurant, we implemented a targeted PPC campaign that resulted in a 50% increase in website traffic and a 25% increase in sales.",
      link: "https://google.com"
    },
    {
      index: 1,
      title: "For a B2B software company, we developed an SEO strategy that resulted in a first page ranking for key keywords and a 200% increase in organic traffic.",
      link: "https://google.com"
    },
    {
      index: 1,
      title: "For a national retail chain, we created a social media marketing campaign that increased followers by 25% and generated a 20% increase in online sales.",
      link: "https://google.com"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Section", $$Section, { "id": "cases" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "SectionTitle", $$SectionTitle, { "sectionTitle": "Case Studies", "description": "Explore Real-Life Examples of Our Proven Digital Marketing Success through Our Case Studies" })} ${maybeRenderHead()}<div class="flex flex-col lg:flex-row justify-between rounded-[45px] p-1"> ${cards.map((card) => renderTemplate`${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` <div class="flex p-[60px] h-full bg-dark text-gray rounded-[45px] m-[1px]"> <div class="flex flex-col gap-5"> <p>${card.title}</p> <a${addAttribute(card.link, "href")} class="flex items-center gap-[15px]"> <span class="text-green">Case Info</span> <picture> ${renderComponent($$result3, "Image", $$Image, { "src": larrow, "alt": "Arrow pointing up right" })} </picture> </a> </div> </div> ` })}`)} </div> ` })}`;
}, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/components/sections/Cases.astro", void 0);

const decorForm = new Proxy({"src":"/_astro/contact-pic.BrB0SfUf.png","width":692,"height":649,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/assets/pics/contact-pic.png";
							}
							
							return target[name];
						}
					});

const $$Form = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="flex relative justify-start items-center p-[60px] bg-[#F3F3F3] rounded-[45px] overflow-hidden" data-astro-cid-2lkv3ujd> <form class="bg-gray sm:p-6 h-full w-full lg:max-w-lg" data-astro-cid-2lkv3ujd> <div class="flex flex-col sm:flex-row gap-[35px] sm:items-center mb-10" data-astro-cid-2lkv3ujd> <div class="flex items-center gap-[14px]" data-astro-cid-2lkv3ujd> <input type="checkbox" id="checkbox1" name="checkbox1" class="form-checkbox text-black" data-astro-cid-2lkv3ujd> <label for="checkbox1" class="text-black" data-astro-cid-2lkv3ujd>Say Hi</label> </div> <div class="flex items-center gap-[14px]" data-astro-cid-2lkv3ujd> <input type="checkbox" id="checkbox2" name="checkbox2" class="form-checkbox text-black" data-astro-cid-2lkv3ujd> <label for="checkbox2" class="flex items-center text-black" data-astro-cid-2lkv3ujd>Get a Quote</label> </div> </div> <div class="mb-4" data-astro-cid-2lkv3ujd> <label for="name" class="block text-black mb-2" data-astro-cid-2lkv3ujd>Name*</label> <input type="text" id="name" name="name" placeholder="Name" class="w-full px-[30px] py-[18px] border border-black rounded-[14px] text-black outline-none" data-astro-cid-2lkv3ujd> </div> <div class="mb-4" data-astro-cid-2lkv3ujd> <label for="email" class="block text-black mb-2" data-astro-cid-2lkv3ujd>Email*</label> <input type="email" id="email" name="email" placeholder="Email" class="w-full px-[30px] py-[18px] border border-black rounded-[14px] text-black outline-none" data-astro-cid-2lkv3ujd> </div> <div class="mb-4" data-astro-cid-2lkv3ujd> <label for="message" class="block text-black mb-2" data-astro-cid-2lkv3ujd>Message*</label> <textarea id="message" name="message" placeholder="Message" class="w-full px-[30px] py-[18px] border border-black rounded-[14px] text-black outline-none" data-astro-cid-2lkv3ujd></textarea> </div> <button type="submit" name="submit" class="btn-primary w-full" data-astro-cid-2lkv3ujd>Send</button> </form> <picture class="absolute right-[-25%] top-[2%] bottom-[2%] hidden lg:block" data-astro-cid-2lkv3ujd> ${renderComponent($$result, "Image", $$Image, { "src": decorForm, "alt": "decor", "data-astro-cid-2lkv3ujd": true })} </picture> </div>  ${renderScript($$result, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/components/ui/Form.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/components/ui/Form.astro", void 0);

const $$Contact = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Section", $$Section, { "id": "contact" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-[140px] relative"> ${renderComponent($$result2, "SectionTitle", $$SectionTitle, { "sectionTitle": "Contact Us", "description": "Connect with Us: Let's Discuss Your Digital Marketing Needs" })} ${renderComponent($$result2, "Form", $$Form, {})} </div> ` })}`;
}, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/components/sections/Contact.astro", void 0);

const HeroIlust = createSvgComponent({"meta":{"src":"/_astro/hero.Cc0GD7y9.svg","width":601,"height":515,"format":"svg"},"attributes":{"width":"601","height":"515","viewBox":"0 0 601 515","fill":"none"},"children":"\n<g clip-path=\"url(#clip0_332_1228)\">\n<path d=\"M311.536 432.535L329.137 427.349L324.001 445L329.137 462.601L311.536 457.465L293.885 462.601L299.07 445L293.885 427.349L311.536 432.535Z\" fill=\"black\" stroke=\"white\" stroke-miterlimit=\"10\" />\n</g>\n<g clip-path=\"url(#clip1_332_1228)\">\n<path d=\"M125.484 345.509L156.96 362.659L125.484 379.947L108.266 411.354L91.0468 379.947L59.5708 362.659L91.0468 345.509L108.266 313.964L125.484 345.509Z\" fill=\"black\" stroke=\"white\" stroke-miterlimit=\"10\" />\n</g>\n<path d=\"M565.117 389.333C563.218 392.777 559.679 395.268 554.584 396.813C549.486 398.359 542.874 398.943 534.913 398.6C518.992 397.913 497.791 393.524 472.776 385.868C422.756 370.558 357.594 342.216 289.155 304.465C220.715 266.715 161.982 226.717 122.349 192.575C102.53 175.501 87.5079 159.909 78.4343 146.81C73.8969 140.259 70.8635 134.355 69.4517 129.218C68.0405 124.084 68.2602 119.762 70.1597 116.319C72.0593 112.875 75.5976 110.384 80.693 108.839C85.7907 107.293 92.4028 106.709 100.364 107.052C116.285 107.739 137.486 112.128 162.501 119.784C212.521 135.094 277.683 163.436 346.122 201.187C414.562 238.937 473.295 278.934 512.928 313.077C532.747 330.15 547.769 345.742 556.843 358.842C561.38 365.393 564.414 371.297 565.825 376.434C567.237 381.568 567.017 385.889 565.117 389.333Z\" stroke=\"black\" />\n<path d=\"M544.887 426.007C542.987 429.451 539.449 431.942 534.354 433.487C529.256 435.033 522.644 435.617 514.683 435.273C498.762 434.587 477.56 430.198 452.546 422.542C402.526 407.232 337.364 378.89 268.924 341.139C200.485 303.388 141.752 263.391 102.119 229.249C82.2995 212.175 67.2774 196.583 58.2038 183.483C53.6664 176.933 50.6331 171.029 49.2212 165.892C47.81 160.758 48.0297 156.436 49.9293 152.992C51.8289 149.549 55.3672 147.057 60.4625 145.512C65.5603 143.967 72.1723 143.383 80.1336 143.726C96.0541 144.413 117.256 148.802 142.27 156.458C192.291 171.767 257.452 200.11 325.892 237.86C394.331 275.611 453.064 315.608 492.697 349.75C512.517 366.824 527.539 382.416 536.612 395.516C541.15 402.067 544.183 407.971 545.595 413.107C547.006 418.241 546.786 422.563 544.887 426.007Z\" stroke=\"black\" />\n<path d=\"M524.658 462.681C522.759 466.125 519.22 468.616 514.125 470.161C509.027 471.707 502.415 472.291 494.454 471.948C478.533 471.261 457.332 466.872 432.317 459.216C382.297 443.906 317.135 415.564 248.696 377.813C180.256 340.063 121.523 300.066 81.8905 265.923C62.071 248.85 47.0489 233.258 37.9753 220.158C33.4379 213.607 30.4045 207.703 28.9927 202.566C27.5815 197.432 27.8012 193.111 29.7008 189.667C31.6003 186.223 35.1386 183.732 40.234 182.187C45.3318 180.641 51.9438 180.057 59.9051 180.4C75.8256 181.087 97.0273 185.476 122.042 193.132C172.062 208.442 237.224 236.784 305.663 274.535C374.103 312.285 432.836 352.283 472.469 386.425C492.288 403.499 507.31 419.091 516.384 432.19C520.921 438.741 523.955 444.645 525.366 449.782C526.778 454.916 526.558 459.237 524.658 462.681Z\" stroke=\"black\" />\n<circle cx=\"132.037\" cy=\"104.5\" r=\"15.5\" fill=\"#B9FF66\" />\n<circle cx=\"421.537\" cy=\"435\" r=\"10\" fill=\"#B9FF66\" />\n<circle cx=\"82.0371\" cy=\"64.5\" r=\"23.5\" fill=\"black\" />\n<path d=\"M306.509 383.59C300.205 385.744 293.001 381.475 290.495 374.071L251.496 259.81L274.284 252.015L313.322 366.433C315.828 373.758 312.774 381.436 306.509 383.59Z\" fill=\"black\" />\n<path d=\"M303.102 385C301.262 385 299.383 384.569 297.581 383.668C293.94 381.866 291.042 378.498 289.633 374.345L250.634 260.084C250.478 259.653 250.713 259.144 251.182 258.987L273.971 251.192C274.206 251.113 274.441 251.113 274.636 251.231C274.832 251.348 274.989 251.505 275.067 251.74L314.105 366.159C316.728 373.914 313.439 382.101 306.744 384.412C305.608 384.804 304.355 385 303.102 385ZM252.592 260.358L291.317 373.797C292.57 377.518 295.154 380.574 298.364 382.14C300.949 383.394 303.729 383.629 306.235 382.767C312.03 380.769 314.849 373.562 312.5 366.707L273.736 253.111L252.592 260.358Z\" fill=\"black\" />\n<path d=\"M270.251 153.382L196.521 205.988L167.821 235.798L156.544 255.736L156.505 255.892C154.273 259.339 155.565 267.291 159.755 275.399C163.866 283.39 169.661 288.953 173.733 289.266L173.616 289.344L195.268 291.695L235.794 285.231L321.818 254.443L428.751 272.775L429.495 272.814C402.635 267.8 366.377 231.88 340.025 181.076C313.713 130.31 305.334 80.132 316.885 55.376H316.845L270.838 152.128L270.251 153.382Z\" fill=\"#B9FF66\" />\n<path d=\"M447.266 270.603C473.694 256.873 468.583 194.629 435.852 131.577C403.121 68.5247 355.163 28.5412 328.736 42.2711C302.308 56.001 307.419 118.245 340.15 181.297C372.881 244.349 420.839 284.333 447.266 270.603Z\" fill=\"white\" />\n<path d=\"M435.643 274.185C424.131 274.185 410.27 267.761 395.352 255.266C375.031 238.266 355.101 212.06 339.243 181.428C315.241 135.05 305.334 87.4964 314.027 60.2726C316.924 51.1849 321.78 44.8392 328.397 41.4313C341.553 34.6939 360.073 40.4129 380.591 57.5698C400.912 74.57 420.842 100.775 436.7 131.407C460.742 177.786 470.648 225.339 461.916 252.563C459.019 261.651 454.163 267.996 447.546 271.404C443.983 273.284 439.989 274.185 435.643 274.185ZM340.378 40.4129C336.345 40.4129 332.586 41.2355 329.219 42.9982C322.993 46.171 318.451 52.2033 315.711 60.8601C307.136 87.6922 317.003 134.737 340.809 180.723C373.23 243.279 420.764 283.312 446.802 269.955C453.028 266.782 457.57 260.75 460.311 252.093C468.886 225.261 459.019 178.216 435.212 132.23C406.981 77.782 367.356 40.4129 340.378 40.4129Z\" fill=\"black\" />\n<path d=\"M435.643 274.185C424.131 274.185 410.27 267.761 395.352 255.266C375.031 238.265 355.101 212.06 339.243 181.428C315.241 135.05 305.334 87.4963 314.027 60.2725C316.924 51.1848 321.78 44.8391 328.397 41.4312C337.207 36.8874 348.718 38.0234 361.679 44.6824C374.091 51.0673 387.521 62.3877 400.599 77.3902C400.912 77.7427 400.873 78.2911 400.521 78.6045C400.168 78.9179 399.62 78.8787 399.307 78.5262C372.76 48.0511 345.899 34.4196 329.219 42.9981C322.993 46.1709 318.451 52.2033 315.711 60.86C307.136 87.6922 317.003 134.737 340.809 180.723C369.001 235.132 408.665 272.54 435.604 272.54C439.637 272.54 443.396 271.717 446.763 269.955C452.989 266.782 457.531 260.75 460.272 252.093C468.847 225.261 458.98 178.216 435.173 132.23C428.086 118.52 420.098 105.632 411.523 93.9204C411.249 93.5286 411.328 92.9803 411.719 92.7061C412.111 92.4319 412.659 92.5102 412.933 92.9019C421.586 104.692 429.574 117.658 436.739 131.446C460.742 177.785 470.648 225.339 461.916 252.563C459.019 261.65 454.163 267.996 447.546 271.404C443.983 273.284 439.989 274.185 435.643 274.185Z\" fill=\"black\" />\n<path d=\"M387.303 190.339C393.426 187.158 392.248 172.751 384.673 158.159C377.098 143.567 365.995 134.316 359.872 137.497C353.75 140.678 354.928 155.085 362.503 169.677C370.077 184.269 381.181 193.52 387.303 190.339Z\" fill=\"#B9FF66\" />\n<path d=\"M384.624 191.848C377.889 191.848 368.492 183.152 361.718 170.03C356.08 159.14 353.77 147.937 355.845 141.474C356.589 139.202 357.803 137.596 359.486 136.734C366.143 133.326 377.537 142.61 385.446 157.847C391.085 168.737 393.395 179.94 391.32 186.403C390.576 188.675 389.362 190.281 387.678 191.143C386.738 191.613 385.72 191.848 384.624 191.848ZM362.54 137.714C361.718 137.714 360.935 137.87 360.269 138.223C358.977 138.889 358.038 140.142 357.45 141.983C355.532 148.016 357.764 158.748 363.206 169.246C370.411 183.152 381.257 192.514 386.856 189.615C388.148 188.949 389.088 187.696 389.675 185.855C391.594 179.783 389.323 169.09 383.919 158.592C377.576 146.41 368.492 137.714 362.54 137.714Z\" fill=\"#B9FF66\" />\n<path d=\"M429.692 259.574C419.59 259.574 407.452 253.934 394.374 243.005C376.597 228.12 359.134 205.166 345.273 178.373C324.247 137.792 315.593 96.153 323.19 72.2978C325.735 64.307 330.003 58.7447 335.837 55.7285C349.228 48.8736 368.923 56.7861 389.91 77.4292C390.262 77.7818 390.262 78.291 389.91 78.6435C389.558 78.9961 389.049 78.9961 388.696 78.6435C368.257 58.5488 349.267 50.7146 336.62 57.2562C331.216 60.0373 327.262 65.2471 324.834 72.8071C317.355 96.2313 325.97 137.361 346.8 177.589C371.429 225.182 406.081 257.851 429.653 257.851C433.177 257.851 436.426 257.107 439.402 255.618C444.806 252.837 448.76 247.627 451.188 240.067C458.667 216.643 450.052 175.513 429.222 135.285C422.918 123.142 415.87 111.743 408.274 101.441C408 101.049 408.078 100.501 408.47 100.227C408.861 99.9526 409.409 100.031 409.683 100.423C417.358 110.842 424.445 122.28 430.788 134.501C451.814 175.082 460.468 216.721 452.872 240.576C450.327 248.567 446.059 254.13 440.225 257.146C437.014 258.752 433.49 259.574 429.692 259.574Z\" fill=\"black\" />\n<path d=\"M195.308 292.517C195.269 292.517 195.23 292.517 195.23 292.517L173.577 290.167C173.46 290.167 173.342 290.128 173.225 290.05C168.761 289.344 163.123 283.704 159.011 275.791C154.626 267.448 153.334 259.3 155.722 255.462L155.762 255.344L167.038 235.367C167.077 235.289 167.117 235.249 167.156 235.21L195.857 205.401C195.896 205.362 195.935 205.323 195.974 205.284L269.508 152.794L316.024 54.9845C316.141 54.7886 316.298 54.632 316.533 54.5536C316.768 54.4753 317.003 54.4753 317.199 54.5928C317.629 54.7886 317.825 55.2979 317.629 55.7288C305.844 80.994 315.163 131.211 340.77 180.645C366.417 230.157 402.165 266.821 429.692 271.874C430.122 271.953 430.436 272.344 430.396 272.814C430.357 273.245 429.966 273.559 429.535 273.598L428.791 273.559C428.752 273.559 428.713 273.559 428.674 273.559L321.936 255.266L236.108 285.976C236.069 285.976 235.991 286.015 235.951 286.015L195.426 292.478C195.387 292.517 195.348 292.517 195.308 292.517ZM174.204 288.522L195.308 290.794L235.638 284.331L321.623 253.581C321.78 253.542 321.897 253.503 322.054 253.542L418.141 269.994C392.181 258.595 361.836 224.947 339.321 181.468C316.964 138.301 306.979 94.4689 312.461 66.775L271.035 153.735C270.956 153.852 270.878 153.97 270.761 154.048L197.11 206.655L168.526 236.307L157.249 256.284C157.249 256.323 157.21 256.363 157.21 256.363C155.174 259.535 156.545 267.37 160.499 275.008C164.376 282.49 169.975 288.13 173.812 288.404C173.969 288.404 174.086 288.444 174.204 288.522Z\" fill=\"black\" />\n<path d=\"M270.367 153.069L316.845 55.3369H316.884C305.333 80.093 313.751 130.271 340.025 181.037C366.376 231.881 402.634 267.8 429.573 272.736L428.829 272.697L322.052 254.404L319.586 253.973C307.173 251.779 290.611 235.641 278.747 212.608C266.569 188.988 264.416 165.447 269.819 154.244L270.367 153.069Z\" fill=\"white\" />\n<path d=\"M429.573 273.598C429.534 273.598 429.573 273.598 429.573 273.598L428.79 273.558C428.751 273.558 428.711 273.558 428.672 273.558L321.896 255.266L319.429 254.835C306.312 252.524 289.671 235.719 277.964 213.039C264.69 187.265 264.025 164.311 269.036 153.891L269.624 152.716L316.101 55.0236C316.218 54.8277 316.375 54.671 316.61 54.5927C316.845 54.5143 317.08 54.5143 317.276 54.6319C317.706 54.8277 317.902 55.3369 317.706 55.7678C305.921 81.0331 315.24 131.25 340.847 180.684C366.494 230.196 402.243 266.86 429.769 271.913C430.199 271.992 430.513 272.383 430.473 272.853C430.356 273.245 430.004 273.598 429.573 273.598ZM312.381 66.7749L271.151 153.46L270.563 154.635C265.591 164.977 267.04 188.087 279.491 212.217C290.963 234.466 307.134 250.918 319.742 253.111L322.209 253.542L418.1 269.994C392.14 258.595 361.795 224.947 339.281 181.467C316.923 138.301 306.939 94.4687 312.381 66.7749Z\" fill=\"black\" />\n<path d=\"M194.133 292.4C194.094 292.4 194.055 292.4 194.055 292.4L173.538 290.206C173.42 290.206 173.303 290.167 173.185 290.089C168.721 289.384 163.083 283.743 158.972 275.831C154.626 267.448 153.333 259.3 155.722 255.462L155.761 255.344L167.038 235.367C167.273 234.936 167.782 234.819 168.212 235.054C168.643 235.289 168.761 235.798 168.526 236.229L157.249 256.284C157.249 256.323 157.21 256.363 157.21 256.363C155.174 259.535 156.544 267.37 160.499 275.008C164.375 282.49 169.974 288.13 173.812 288.404C173.929 288.404 174.086 288.444 174.164 288.522L194.212 290.676C194.681 290.716 195.034 291.146 194.955 291.616C194.916 292.047 194.564 292.4 194.133 292.4Z\" fill=\"black\" />\n<path d=\"M195.503 291.538C188.847 291.068 179.528 281.628 172.754 268.584C165.589 254.756 163.905 240.459 168.29 235.367L156.583 255.736L156.505 255.892C154.273 259.339 155.565 267.291 159.755 275.399C163.866 283.39 169.661 288.953 173.733 289.266L173.616 289.344L195.503 291.538Z\" fill=\"white\" />\n<path d=\"M195.504 292.4C195.464 292.4 195.464 292.4 195.425 292.4C195.269 292.4 195.073 292.36 194.916 292.36L173.538 290.206C173.42 290.206 173.303 290.167 173.185 290.088C168.721 289.383 163.083 283.743 158.972 275.83C154.626 267.448 153.333 259.3 155.722 255.461L155.761 255.344L166.059 237.404C166.45 236.385 166.959 235.484 167.586 234.74C167.86 234.387 168.369 234.348 168.721 234.583C169.074 234.857 169.191 235.327 168.956 235.719L167.508 238.187C165.197 244.415 167.468 256.636 173.42 268.074C179.881 280.57 188.691 289.697 194.995 290.519L195.464 290.559C195.934 290.598 196.287 291.029 196.248 291.499C196.287 292.047 195.934 292.4 195.504 292.4ZM174.164 288.522L189.121 290.049C183.366 286.367 177.022 278.768 171.971 268.975C167.077 259.535 164.649 249.742 165.041 242.692L157.249 256.284C157.249 256.323 157.21 256.362 157.21 256.362C155.174 259.535 156.544 267.369 160.499 275.008C164.375 282.489 169.974 288.13 173.812 288.404C173.929 288.404 174.086 288.443 174.164 288.522Z\" fill=\"black\" />\n<path d=\"M234.345 285.388L236.068 285.035C226.749 286.994 212.026 272.892 201.65 252.876C191.039 232.429 189.042 212.021 196.56 205.988L195.581 206.968L168.368 235.249C163.905 240.263 165.549 254.639 172.754 268.544C179.684 281.941 189.512 291.499 196.208 291.459L234.345 285.388Z\" fill=\"black\" />\n<path d=\"M196.169 292.36C189.043 292.36 179.137 282.764 171.971 268.975C164.689 254.874 162.848 240.146 167.704 234.701L194.407 206.968C194.877 206.341 195.425 205.793 196.013 205.323C196.365 205.048 196.874 205.088 197.187 205.401C197.501 205.753 197.501 206.263 197.187 206.576L195.66 208.182C190.218 215.468 192.92 234.113 202.434 252.484C212.693 272.305 227.024 285.897 235.795 284.252L235.912 284.213C236.382 284.135 236.813 284.409 236.93 284.879C237.008 285.349 236.734 285.78 236.264 285.897C236.225 285.897 236.186 285.897 236.147 285.936L234.542 286.25H234.502L196.365 292.321C196.287 292.321 196.209 292.36 196.169 292.36ZM192.136 211.825L168.996 235.876C164.689 240.733 166.646 254.913 173.538 268.192C180.272 281.197 189.787 290.598 196.169 290.637L229.843 285.27C220.759 282.058 209.561 269.955 200.907 253.307C192.685 237.443 189.513 221.304 192.136 211.825Z\" fill=\"black\" />\n<path d=\"M359.878 137.479C353.731 140.612 354.631 155.145 362.462 169.638C375.579 193.885 386.034 191.025 387.248 190.594C387.287 190.594 387.287 190.634 387.248 190.634L364.733 208.77C358.116 199.486 351.812 189.145 346.017 177.981C340.496 167.288 335.837 156.633 332.156 146.292L359.878 137.479Z\" fill=\"black\" />\n<path d=\"M364.733 209.631C364.694 209.631 364.655 209.631 364.616 209.631C364.381 209.592 364.185 209.475 364.028 209.279C357.255 199.76 350.951 189.341 345.273 178.412C339.83 167.914 335.132 157.221 331.373 146.645C331.295 146.41 331.295 146.174 331.412 145.979C331.53 145.783 331.686 145.626 331.921 145.548L359.643 136.734C360.074 136.617 360.544 136.813 360.7 137.243C360.857 137.674 360.7 138.144 360.309 138.34C358.977 139.006 357.998 140.338 357.411 142.297C355.493 148.446 357.842 159.336 363.284 169.325C376.088 192.984 385.955 190.281 387.013 189.889C387.404 189.733 387.874 189.928 388.07 190.281C388.266 190.634 388.187 191.143 387.874 191.417L365.281 209.436C365.125 209.553 364.929 209.631 364.733 209.631ZM333.292 146.84C337.011 157.064 341.553 167.405 346.8 177.59C352.282 188.166 358.39 198.233 364.929 207.516L384.467 191.77C380.004 191.574 371.585 188.244 361.718 170.03C356.002 159.493 353.652 148.368 355.727 141.67C356.002 140.808 356.315 140.064 356.706 139.359L333.292 146.84Z\" fill=\"black\" />\n<path d=\"M475.723 81.5974C493.623 72.1937 500.547 50.1159 491.187 32.2852C481.827 14.4545 459.729 7.62311 441.829 17.0268C423.929 26.4305 417.006 48.5083 426.365 66.339C435.725 84.1697 457.823 91.0011 475.723 81.5974Z\" fill=\"black\" />\n<path d=\"M442.104 41.2352C443.827 38.8849 446.372 37.4356 449.27 37.1223C451.462 36.8872 453.498 37.3573 455.417 38.5324C456.396 39.12 457.257 39.8642 458.08 40.7652C458.667 39.7075 459.372 38.7674 460.194 37.984C461.799 36.4172 463.718 35.5162 465.872 35.2812C468.769 34.9678 471.588 35.8296 473.781 37.749C475.934 39.6292 477.305 42.3712 477.657 45.4657C478.01 48.6385 477.148 51.6939 474.956 55.0626C472.998 58.0787 470.022 61.2124 466.576 64.8945C465.402 66.1479 464.07 67.5581 462.7 69.0466C462.348 69.4383 461.839 69.7125 461.29 69.7517C460.742 69.83 460.233 69.6733 459.763 69.36C458.08 68.1848 456.474 67.0881 455.065 66.1479C450.914 63.3276 447.312 60.899 444.728 58.3921C441.83 55.611 440.342 52.7906 439.99 49.6178C439.677 46.5233 440.421 43.5463 442.104 41.2352Z\" fill=\"white\" />\n<path d=\"M577.272 83.5925C590.377 70.4829 590.377 49.2281 577.272 36.1185C564.168 23.0089 542.922 23.0089 529.817 36.1185C516.713 49.228 516.713 70.4829 529.817 83.5925C542.922 96.7021 564.168 96.7021 577.272 83.5925Z\" fill=\"#B9FF66\" />\n<path d=\"M553.539 94.2732C534.587 94.2732 519.121 78.8399 519.121 59.8419C519.121 40.8832 534.548 25.4106 553.539 25.4106C572.529 25.4106 587.956 40.844 587.956 59.8419C587.956 78.8007 572.529 94.2732 553.539 94.2732ZM553.539 27.1342C535.527 27.1342 520.844 41.7841 520.844 59.8419C520.844 77.8606 535.488 92.5497 553.539 92.5497C571.55 92.5497 586.233 77.8998 586.233 59.8419C586.233 41.8233 571.589 27.1342 553.539 27.1342Z\" fill=\"#B9FF66\" />\n<path d=\"M562.622 63.1713C560.743 63.1713 559.098 64.0723 558.002 65.4824L546.686 61.0561C546.686 60.8994 546.725 60.7819 546.725 60.6252C546.725 60.351 546.686 60.0768 546.647 59.8026L558.237 54.4362C559.294 55.6505 560.86 56.4339 562.622 56.4731C565.833 56.4731 568.495 53.8486 568.495 50.5974C568.495 47.3462 565.872 44.6826 562.622 44.6826C559.411 44.6826 556.749 47.3071 556.749 50.5583C556.749 50.8325 556.788 51.1067 556.827 51.3809L545.237 56.7473C544.18 55.533 542.614 54.7496 540.852 54.7104C537.641 54.7104 534.979 57.3348 534.979 60.586C534.979 63.8372 537.602 66.5009 540.852 66.5009C542.731 66.5009 544.376 65.5999 545.472 64.1898L556.788 68.6161C556.788 68.7728 556.749 68.8903 556.749 69.047C556.749 72.2982 559.372 74.9618 562.622 74.9618C565.833 74.9618 568.495 72.3373 568.495 69.0861C568.456 65.8349 565.833 63.2105 562.622 63.1713Z\" fill=\"black\" />\n<path d=\"M563.067 189.993C578.433 179.322 582.294 158.283 571.69 142.999C561.085 127.715 540.032 123.975 524.665 134.645C509.299 145.315 505.438 166.355 516.042 181.639C526.647 196.923 547.7 200.663 563.067 189.993Z\" fill=\"black\" />\n<path d=\"M535.411 178.373L530.478 151.619C530.243 150.248 531.496 149.112 532.827 149.465L561.998 157.73C563.486 158.161 563.838 160.08 562.624 161.02L538.348 179.509C537.291 180.371 535.685 179.783 535.411 178.373Z\" fill=\"white\" />\n<path d=\"M543.535 299.582C562.512 290.34 570.452 267.553 561.271 248.686C552.09 229.819 529.264 222.016 510.287 231.258C491.311 240.499 483.371 263.286 492.552 282.153C501.733 301.02 524.559 308.823 543.535 299.582Z\" fill=\"#B9FF66\" />\n<path d=\"M526.718 304.347C522.646 304.347 518.495 303.72 514.462 302.349C504.595 299.059 496.607 292.165 491.987 282.842C487.367 273.559 486.662 263.022 489.99 253.151C496.881 232.821 519.043 221.735 539.443 228.512C549.31 231.802 557.298 238.696 561.918 248.019C566.539 257.303 567.243 267.84 563.915 277.711C558.355 294.006 543.045 304.347 526.718 304.347ZM527.109 228.277C511.486 228.277 496.842 238.148 491.556 253.738C488.385 263.178 489.05 273.245 493.475 282.098C497.899 290.99 505.535 297.61 514.971 300.743C534.47 307.206 555.653 296.63 562.232 277.202C565.403 267.761 564.737 257.694 560.313 248.842C555.888 239.95 548.253 233.33 538.817 230.196C534.94 228.865 530.986 228.277 527.109 228.277Z\" fill=\"black\" />\n<path d=\"M546.375 259.261C545.983 268.78 529.891 291.029 526.053 296.239C525.662 296.787 524.84 296.748 524.487 296.16C522.06 292.243 514.033 279.082 509.843 268.427C508.16 264.197 507.102 260.358 507.22 257.655C507.651 246.844 516.774 238.422 527.581 238.853C538.387 239.362 546.806 248.45 546.375 259.261Z\" fill=\"black\" />\n<path d=\"M533.13 264.827C536.632 261.324 536.632 255.644 533.13 252.141C529.628 248.638 523.951 248.638 520.45 252.141C516.948 255.644 516.948 261.324 520.45 264.827C523.951 268.33 529.628 268.33 533.13 264.827Z\" fill=\"#B9FF66\" />\n<defs>\n<clipPath id=\"clip0_332_1228\">\n<rect width=\"36\" height=\"36\" fill=\"white\" transform=\"translate(293.537 427)\" />\n</clipPath>\n<clipPath id=\"clip1_332_1228\">\n<rect width=\"70.3259\" height=\"70.3259\" fill=\"white\" transform=\"translate(108.266 313) rotate(45)\" />\n</clipPath>\n</defs>\n"});

const $$Hero = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Section", $$Section, { "id": "home" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="relative flex flex-col-reverse items-center md:flex-row" id="hero"> <div class="row items-center py-5 md:w-6/12 md:pb-20 md:pt-10"> <div class="text-left space-y-3"> <h1 class="text-4xl font-medium leading-none md:text-6xl text-center md:text-left">Navigating the <br> digital landscape <br> for success</h1> <p class="mt-6 mb-8 text-lg font-normal leading-7 sm:mb-12 text-center md:text-left md:pr-12">Our digital marketing agency helps businesses grow and succeed online through a range of services including SEO, PPC, social media marketing, and content creation.</p> <div class="w-full justify-center md:justify-start items-center inline-flex"> <a href="https://github.com/manulthanura/Positivus" target="_blank" class="px-8 py-5 bg-zinc-900 hover:bg-white rounded-2xl text-center text-white hover:text-black border text-xl font-normal leading-7">Book a consultation
</a> </div> </div> </div> <div class="flex items-center py-5 md:w-6/12 md:pb-20 md:pt-10"> ${renderComponent($$result2, "Image", $$Image, { "src": HeroIlust, "alt": "Hero Ilustration", "loading": "eager" })} </div> </div> ` })}`;
}, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/components/sections/Hero.astro", void 0);

const $$Astro$1 = createAstro("https://positivustheme.vercel.app");
const $$AccordionItem = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AccordionItem;
  const { index, title, description } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div id="accordion__item" class="accordion__item group h-[160px] bg-[#F3F3F3] overflow-hidden w-full transition-all duration-500 mb-[30px] rounded-[45px] border border-dark shadow-[0px_5px_0px_#191a23]" data-astro-cid-kq6n5brs> <button class="accordion__toggle w-full h-[160px] flex items-center justify-between p-[60px] cursor-pointer"${addAttribute(`${title} accordion__item menu button`, "id")} aria-expanded="false"${addAttribute(`${title} accordion__item menu content`, "aria-controls")} data-astro-cid-kq6n5brs> <div class="flex items-center gap-[25px]" data-astro-cid-kq6n5brs> <span class="hidden sm:block sm:text-6xl" data-astro-cid-kq6n5brs>0${index}</span> ${title} </div> <div class="bg-gray w-[58px] h-[58px] flex justify-center items-center rounded-full border border-dark" data-astro-cid-kq6n5brs> <div class="accordion__icon h-10 w-10 transition-transform duration-300 flex justify-center items-center relative" aria-hidden="true" data-astro-cid-kq6n5brs></div> </div> </button> <div${addAttribute(`${title} accordion__item menu content`, "id")}${addAttribute(`${title} accordion__item menu button `, "aria-labelledby")} class="accordion__content px-[60px]" data-astro-cid-kq6n5brs> <div class="w-full h-[2px] bg-black" data-astro-cid-kq6n5brs></div> <p class="prose mb-4 mt-1 max-w-full pt-5 pb-[60px] transition-[height]" data-astro-cid-kq6n5brs> ${description} </p> </div> </div>  ${renderScript($$result, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/components/ui/AccordionItem.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/components/ui/AccordionItem.astro", void 0);

const $$Accordion = createComponent(($$result, $$props, $$slots) => {
  const content = [
    {
      index: 1,
      title: "Consultation",
      description: "During the initial consultation, we will discuss your business goals and objectives, target audience, and current marketing efforts. This will allow us to understand your needs and tailor our services to best fit your requirements."
    },
    {
      index: 2,
      title: "Research",
      description: "After the consultation, we will conduct thorough research to identify your target audience, competitors, and industry trends. This will help us develop a comprehensive strategy to achieve your business goals."
    },
    {
      index: 3,
      title: "Implementation",
      description: "Once the research is complete, we will begin implementing the strategy. This may include optimizing your website, creating content, and launching marketing campaigns. Our team will work diligently to ensure that all tasks are completed on time and within budget."
    },
    {
      index: 4,
      title: "Optimization",
      description: "After the initial implementation, we will continuously monitor and optimize your marketing efforts to ensure maximum results. This may involve adjusting ad campaigns, refining content, and analyzing data to identify areas for improvement."
    },
    {
      index: 5,
      title: "Reporting",
      description: "Throughout the process, we will provide regular reports on the performance of your marketing campaigns. This will allow you to track progress, measure success, and make informed decisions about future strategies."
    },
    {
      index: 6,
      title: "Improvement",
      description: "Based on the data and insights gathered from the reports, we will make recommendations for further improvement. This may involve refining existing strategies, exploring new opportunities, or adjusting tactics to better align with your business goals."
    }
  ];
  return renderTemplate`${content.map((item) => {
    return renderTemplate`${renderComponent($$result, "AccordionItem", $$AccordionItem, { "index": item.index, "title": item.title, "description": item.description })}`;
  })}`;
}, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/components/ui/Accordion.astro", void 0);

const $$Process = createComponent(($$result, $$props, $$slots) => {
  const description = "Step-by-Step Guide to Achieving Your Business Goals";
  return renderTemplate`${renderComponent($$result, "Section", $$Section, { "id": "process" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mt-[140px]"> ${renderComponent($$result2, "SectionTitle", $$SectionTitle, { "sectionTitle": "Our Working Process", "description": description })} ${renderComponent($$result2, "Accordion", $$Accordion, {})} </div> ` })}`;
}, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/components/sections/Process.astro", void 0);

const propImg = new Proxy({"src":"/_astro/proposal-pic.DC7YnBHg.png","width":494,"height":395,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/assets/pics/proposal-pic.png";
							}
							
							return target[name];
						}
					});

const $$Proposal = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Section", $$Section, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="flex bg-[#F3F3F3] rounded-[45px] p-[60px] relative mt-[123px] mb-[163px]"> <div class="w-full md:w-[40%] flex flex-col gap-[26px]"> <h2 class="text-3xl font-medium">Let's make things happen</h2> <p>
Contact us today to learn more about how our digital marketing
          services can help your business grow and succeed online.
</p> <button class="btn-primary">Get your free proposal</button> </div> <picture class="hidden md:flex absolute right-[-10%] lg:right-0 top-[-15%] h-[450px] items-center justify-center"> ${renderComponent($$result3, "Image", $$Image, { "src": propImg, "alt": "This is an illustration", "class": "hidden md:flex lg:h-full lg:w-auto" })} </picture> </div> ` })} ` })}`;
}, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/components/sections/Proposal.astro", void 0);

const linkd = createSvgComponent({"meta":{"src":"/_astro/profile-in.CjyVQDgO.svg","width":34,"height":34,"format":"svg"},"attributes":{"width":"34","height":"34","viewBox":"0 0 34 34","fill":"none"},"children":"\n<circle cx=\"17\" cy=\"17\" r=\"17\" fill=\"black\" />\n<path d=\"M9.31776 25H12.8131V13.6844H9.31776V25Z\" fill=\"#B9FF66\" />\n<path d=\"M9 10.0719C9 11.1875 9.90031 12.0906 11.0654 12.0906C12.1776 12.0906 13.0779 11.1875 13.0779 10.0719C13.0779 8.95625 12.1776 8 11.0654 8C9.90031 8 9 8.95625 9 10.0719Z\" fill=\"#B9FF66\" />\n<path d=\"M22.4517 25H26V18.7844C26 15.7562 25.3115 13.3656 21.7632 13.3656C20.0685 13.3656 18.9034 14.3219 18.4268 15.225H18.3738V13.6844H15.0374V25H18.5327V19.4219C18.5327 17.9344 18.7975 16.5 20.6511 16.5C22.4517 16.5 22.4517 18.2 22.4517 19.475V25Z\" fill=\"#B9FF66\" />\n"});

const $$Astro = createAstro("https://positivustheme.vercel.app");
const $$TeamCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TeamCard;
  const { pic, name, role, description, link } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Card", $$Card, { "isUnderline": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-[60px]"> <div class="flex flex-col sm:flex-row relative"> <picture>${renderComponent($$result2, "Image", $$Image, { "src": pic, "alt": name })}</picture> <div class="flex flex-col justify-end sm:ml-5"> <h3 class="text-lg font-medium">${name}</h3> <p class="text-sm font-normal">${role}</p> </div> <a${addAttribute(link, "href")} class="absolute right-0 top-0">${renderComponent($$result2, "Image", $$Image, { "src": linkd, "alt": "Linkedin Logo" })}</a> </div> <div class="w-full h-[1px] bg-black my-7"></div> <div>${description}</div> </div> ` })}`;
}, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/components/ui/TeamCard.astro", void 0);

const p1 = new Proxy({"src":"/_astro/t1.DCqpUh7U.png","width":106,"height":103,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/assets/team/t1.png";
							}
							
							return target[name];
						}
					});

const p2 = new Proxy({"src":"/_astro/t2.nG-pfUKH.png","width":103,"height":103,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/assets/team/t2.png";
							}
							
							return target[name];
						}
					});

const p3 = new Proxy({"src":"/_astro/t3.CD1xqxr1.png","width":103,"height":103,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/assets/team/t3.png";
							}
							
							return target[name];
						}
					});

const p4 = new Proxy({"src":"/_astro/t4.H_8Q79jb.png","width":103,"height":103,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/assets/team/t4.png";
							}
							
							return target[name];
						}
					});

const p5 = new Proxy({"src":"/_astro/t5.hcMJufQa.png","width":103,"height":103,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/assets/team/t5.png";
							}
							
							return target[name];
						}
					});

const p6 = new Proxy({"src":"/_astro/t6.C1epwtLh.png","width":103,"height":103,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/assets/team/t6.png";
							}
							
							return target[name];
						}
					});

const $$Team = createComponent(($$result, $$props, $$slots) => {
  const description = "Meet the skilled and experienced team behind our successful digital marketing strategies";
  const team = [
    {
      pic: p1,
      name: "John Smith",
      role: "CEO and Founder",
      description: "10+ years of experience in digital marketing. Expertise in SEO, PPC, and content strategy",
      link: "https://linkedin.com"
    },
    {
      pic: p2,
      name: "Jane Doe",
      role: "Director of Operations",
      description: "7+ years of experience in project management and team leadership. Strong organizational and communication skills",
      link: "https://linkedin.com"
    },
    {
      pic: p3,
      name: "Michael Brown",
      role: "Senior SEO Specialist",
      description: "5+ years of experience in SEO and content creation. Proficient in keyword research and on-page optimization",
      link: "https://linkedin.com"
    },
    {
      pic: p4,
      name: "Emily Johnson",
      role: "PPC Manager",
      description: "3+ years of experience in paid search advertising. Skilled in campaign management and performance analysis",
      link: "https://linkedin.com"
    },
    {
      pic: p5,
      name: "Brian Williams",
      role: "Social Media Specialist",
      description: "4+ years of experience in social media marketing. Proficient in creating and scheduling content, analyzing metrics, and building engagement",
      link: "https://linkedin.com"
    },
    {
      pic: p6,
      name: "Sarah Kim",
      role: "Content Creator",
      description: "2+ years of experience in writing and editing. Skilled in creating compelling, SEO-optimized content for various industries",
      link: "https://linkedin.com"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Section", $$Section, { "id": "about" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mt-[140px]"> ${renderComponent($$result2, "SectionTitle", $$SectionTitle, { "sectionTitle": "Team", "description": description })} <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-2 gap-10"> ${team.map((member, index) => renderTemplate`${renderComponent($$result2, "TeamCard", $$TeamCard, { "key": index, "pic": member.pic, "name": member.name, "role": member.role, "description": member.description, "link": member.link })}`)} </div> <div class="flex justify-end mt-10"> <button class="btn-primary">See all team</button> </div> </div> ` })}`;
}, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/components/sections/Team.astro", void 0);

const Testimonials = [
	{
		index: 1,
		name: "John Smith",
		role: "Marketing dierector at XYZ",
		comment: "We have been working with Positivus for the past year and have seen a significant increase in website traffic and leads as a result of their efforts. The team is professional, responsive, and truly cares about the success of our business. We highly recommend Positivus to any company looking to grow their online presence."
	},
	{
		index: 2,
		name: "Jane Doe",
		role: "CEO at ABC",
		comment: "We chose Positivus to help us with our SEO and PPC campaigns and have been very impressed with their results. They are knowledgeable, responsive, and truly care about the success of our business. We highly recommend Positivus to any company looking to grow their online presence."
	},
	{
		index: 3,
		name: "Alice Johnson",
		role: "Owner at 123",
		comment: "I recently started working with Positivus and have been very impressed with their professionalism and expertise. They have helped me increase my online visibility and generate more leads for my business. I highly recommend Positivus to anyone looking to improve their online marketing strategy."
	},
	{
		index: 4,
		name: "Bob Brown",
		role: "Dierector at XYZ",
		comment: "Positivus has been a great partner for our company. They are knowledgeable, responsive, and truly care about the success of our business. We have seen a significant increase in website traffic and leads as a result of their efforts. I highly recommend Positivus to any company looking to grow their online presence."
	},
	{
		index: 5,
		name: "Gupta Patel",
		role: "Content creator",
		comment: "I have been working with Positivus for the past year and have been very impressed with their professionalism and expertise. They have helped me increase my online visibility and generate more leads for my business. I highly recommend Positivus to anyone looking to improve their online marketing strategy."
	},
	{
		index: 6,
		name: "Sara Johnson",
		role: "Freelancer",
		comment: "Positivus made a huge difference in our online presence. They are knowledgeable, responsive, and truly care about the success of our business. We have seen a significant increase in website traffic and leads as a result of their efforts. I highly recommend Positivus to any company looking to grow their online presence."
	}
];

const $$SwiperSlider = createComponent(($$result, $$props, $$slots) => {
  const processedTestimonials = Testimonials.map((item, index, array) => ({
    ...item,
    index: index + 1,
    length: array.length
  }));
  return renderTemplate`${maybeRenderHead()}<div id="ProjectSlider" class="swiper mt-10"${addAttribute({
    "--swiper-pagination-color": "var(--green)",
    "--swiper-pagination-bullet-inactive-color": "#fff",
    "--swiper-pagination-bullet-inactive-opacity": "1",
    "--swiper-pagination-bullet-size": "19px",
    "--swiper-pagination-bullet-horizontal-gap": "10px"
  }, "style")} data-astro-cid-klye6o2m> <div class="swiper-wrapper mt-[84px] mb-[124px]" data-cursor="swipe" data-astro-cid-klye6o2m> ${processedTestimonials.map((item) => renderTemplate`<div class="swiper-slide text-gray flex flex-col" role="group"${addAttribute(`${item.index} / ${item.length}`, "aria-label")} data-astro-cid-klye6o2m> <div class="flex flex-col justify-center items-center py-[48px] px-6 sm:px-[52px]" data-astro-cid-klye6o2m> <p class="bubble" data-astro-cid-klye6o2m>
"${item.comment}"
</p> </div> <div class="w-full px-10 sm:px-20 " data-astro-cid-klye6o2m> <div class="text-green font-medium" data-astro-cid-klye6o2m>${item.name}</div> <div data-astro-cid-klye6o2m>${item.role}</div> </div> </div>`)} </div> <div class="flex justify-around lg:justify-center mb-[68px] lg:gap-[189px]" data-astro-cid-klye6o2m> <div class="swiper-button-prev w-7 h-7 sm:w-10 sm:h-10" data-astro-cid-klye6o2m> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-astro-cid-klye6o2m><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> <path fill="#ffffff" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" data-astro-cid-klye6o2m></path></svg> </div> <div class="swiper-pagination" data-astro-cid-klye6o2m></div> <div class="swiper-button-next w-7 h-7 sm:w-10 sm:h-10 rotate-180" data-astro-cid-klye6o2m> <svg xmlns="http://www.w3.org/2000/svg " viewBox="0 0 448 512" data-astro-cid-klye6o2m> <path fill="#ffffff" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" data-astro-cid-klye6o2m></path></svg> </div> </div> </div> ${renderScript($$result, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/components/ui/SwiperSlider.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/components/ui/SwiperSlider.astro", void 0);

const $$Testimonials = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Section", $$Section, { "id": "testimonials" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mt-20"> ${renderComponent($$result2, "SectionTitle", $$SectionTitle, { "sectionTitle": "Testimonials", "description": "Hear from Our Satisfied Clients: Read Our Testimonials to Learn More about Our Digital Marketing Services" })} <div class="rounded-[45px] bg-dark mb-[150px] text-gray"> ${renderComponent($$result2, "SwiperSlider", $$SwiperSlider, {})} </div> </div> ` })}`;
}, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/components/sections/Testimonials.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Positivus", "description": "A beautiful and functional landing page design created specifically for digital marketing agencies. With its clean and modern design, Positivus is the perfect template to showcase your agency's services and case studies to potential clients. Built with astro and tailwindcss" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Hero", $$Hero, {})} ${renderComponent($$result2, "Sponsors", $$Sponsors, {})} ${renderComponent($$result2, "Services", $$Services, {})} ${renderComponent($$result2, "Proposal", $$Proposal, {})} ${renderComponent($$result2, "Cases", $$Cases, {})} ${renderComponent($$result2, "Process", $$Process, {})} ${renderComponent($$result2, "Team", $$Team, {})} ${renderComponent($$result2, "Testimonials", $$Testimonials, {})} ${renderComponent($$result2, "Contact", $$Contact, {})} ` })}`;
}, "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/pages/index.astro", void 0);

const $$file = "/Users/harissetyawan/codes/harrisetyawan.github.io/Positivus/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
