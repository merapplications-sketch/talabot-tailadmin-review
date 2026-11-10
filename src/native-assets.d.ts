declare module '*.svg' {
 import type {FC,SVGProps} from 'react';
 const component: FC<SVGProps<SVGSVGElement>>;
 export default component;
}

declare module '*?url' {const url:string;export default url;}
