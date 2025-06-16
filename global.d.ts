
/** This declaration tells TypeScript that any file ending with .svg should be treated as a 
 * module that exports a React component.
 */
declare module "*.svg" {
       import React = require("react");
       const content: React.FC<React.SVGProps<SVGSVGElement>>;
       export default content;
}

/** If you need to import SVGs as URL, this declaration tells the same to 
 * TypeScript
 */
declare module "*.svg?url" {
         const content: string;
         export default content;
}