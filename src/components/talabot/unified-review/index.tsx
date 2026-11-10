"use client";
import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { useTheme } from '@/context/theme-context';
import { Link } from '@/i18n/navigation';
import { BoxIcon, CartIcon, TruckDeliveryIcon, UsersIcon, BellIcon, PageIcon, StarIcon, TagIcon, ListIcon, UserCircleIcon } from '@/icons';
import { copy, sections, type Section } from './copy';
const icons = [BoxIcon,CartIcon,TruckDeliveryIcon,UsersIcon,BellIcon,PageIcon,StarIcon,PageIcon,TagIcon,StarIcon,ListIcon,UserCircleIcon];
export function OperationsLinks({compact=false}:{compact?:boolean}) {
 const locale=useLocale() as keyof typeof copy; const c=copy[locale]||copy.en;
 return <nav aria-label={c.title} className={compact?"grid grid-cols-1 gap-1":"grid grid-cols-2 gap-2 md:grid-cols-3"}>{Object.keys(sections).map((section,i)=>{const Icon=icons[i];return <Link key={section} href={`/operations/${section}`} className="flex min-h-11 min-w-0 items-center gap-2 rounded-lg border border-gray-200 p-3 text-sm break-words text-gray-700 focus-visible:outline-2 focus-visible:outline-brand-500 dark:border-gray-700 dark:text-gray-200"><Icon className="size-5 shrink-0"/>{c.sections[i]}</Link>})}</nav>;
}
export function ReviewNotice() {const locale=useLocale() as keyof typeof copy;const c=copy[locale]||copy.en;return <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300"><h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">{c.title}</h1><p>{c.notice}</p><p>{c.scope}</p></div>;}
export function AnalyticsHeading({sample=false}:{sample?:boolean}){const locale=useLocale() as keyof typeof copy;const c=copy[locale]||copy.en;return <h2 id={sample?'b-examples':'analytics'} className="text-lg font-semibold text-gray-800 dark:text-gray-200">{sample?c.samples:c.analytics}</h2>;}
export default function OperationsFrame({section='orders'}:{section?:Section}) {
 const locale=useLocale();const {theme}=useTheme();const frame=useRef<HTMLIFrameElement>(null);const [height,setHeight]=useState(900);
 const c=copy[locale as keyof typeof copy]||copy.en;
 useEffect(()=>{const receive=(event:MessageEvent)=>{if(event.origin!==location.origin||event.source!==frame.current?.contentWindow||event.data?.source!=='ux02-operations')return;if(Number.isFinite(event.data.height))setHeight(Math.max(400,Math.min(60000,event.data.height)));};window.addEventListener('message',receive);return()=>window.removeEventListener('message',receive);},[]);
 useEffect(()=>{frame.current?.contentWindow?.postMessage({source:'ux02-shell',dark:theme==='dark'},location.origin);},[theme,height]);
 return <section className="min-w-0 space-y-3" data-testid="operations-a"><div className="flex flex-wrap gap-3 text-sm text-brand-500"><a href={section==='orders'?'#analytics':'/#analytics'} className="inline-flex min-h-11 items-center">{c.jump}</a><Link href="/orders" className="inline-flex min-h-11 items-center">{c.filters}</Link></div><iframe ref={frame} title={c.sections[Object.keys(sections).indexOf(section)]} src={`/operations-source/admin.html?tab=${sections[section]}&lang=${locale}`} style={{height}} className="block w-full border-0" sandbox="allow-scripts allow-same-origin allow-popups" onLoad={()=>frame.current?.contentWindow?.postMessage({source:'ux02-shell',dark:theme==='dark'},location.origin)}/></section>;
}
