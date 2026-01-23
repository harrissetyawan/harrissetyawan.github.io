
import { scopedPreflightStyles, isolateInsideOfContainer, isolateOutsideOfContainer } from 'tailwindcss-scoped-preflight';

/** @type {import("tailwindcss").Config} */
const config = {
  content: ['./*.{html,mjs}'],
  plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer('.prospect-calc'),
    }),
  ],
};

exports.default = config;