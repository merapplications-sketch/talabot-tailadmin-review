import {createContext,useContext,type AnchorHTMLAttributes} from 'react';
interface RouteBridge{section:string;go:(section:string)=>void}
export const NativeRouteContext=createContext<RouteBridge>({section:'orders',go:()=>{}});
export function usePathname(){return '/'+useContext(NativeRouteContext).section}
export function Link({href,onClick,...props}:AnchorHTMLAttributes<HTMLAnchorElement>){const {go}=useContext(NativeRouteContext);return <a {...props} href={'?section='+(href==='/'?'orders':href?.replace(/^\//,''))} onClick={e=>{onClick?.(e);if(!e.defaultPrevented&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&e.button===0){e.preventDefault();go(href==='/'?'orders':String(href).replace(/^\//,''))}}}/>}
