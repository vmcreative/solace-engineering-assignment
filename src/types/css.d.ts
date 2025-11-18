// types.css.d.ts
//
// Type declaration for importing CSS Modules in TypeScript files.
// ---------------------------------------------------------------
//
// This file allows statements like:
//
//    import styles from "./MyComponent.module.css";
//
// without triggering TypeScript errors.
//
// Next.js already supports CSS Modules at runtime, but TypeScript
// has no built-in understanding that importing a `.css` file returns
// an object mapping class names to generated strings.
//
// By declaring a wildcard module for "*.css", we inform TypeScript
// that:
//
//   • any imported .css file should resolve to an object
//     whose keys are class names,
//   • and the values are the corresponding compiled CSS classnames.
//
// This file does *not* modify runtime behavior — it is purely
// a type-level convenience that enables IDE autocompletion and
// prevents TS “cannot find module '*.css'” errors.
//

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}