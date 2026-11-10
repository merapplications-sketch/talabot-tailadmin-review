import type {ReactNode} from 'react';
import { ArrowLeftIcon, CallIcon, PencilIcon, ChevronRightIcon, SearchIcon, ChatIcon, ClockIcon } from '@/icons';
import {LocationIcon,NativeWalletIcon} from '@/icons/native-operation';
export const icons = {back:ArrowLeftIcon,phone:CallIcon,edit:PencilIcon,details:ChevronRightIcon,search:SearchIcon,map:LocationIcon,chat:ChatIcon,wallet:NativeWalletIcon,history:ClockIcon};
export const button='inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand-500 dark:border-gray-700';
export const input='min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-base dark:border-gray-700';
export function Card({title,children}:{title?:string;children:ReactNode}){return <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">{title&&<h2 className="mb-3 text-lg font-semibold">{title}</h2>}{children}</section>}
export function Pair({label,children}:{label:string;children:ReactNode}){return <div className="flex flex-wrap justify-between gap-2 border-b border-gray-100 py-2 dark:border-gray-800"><span className="text-gray-500 dark:text-gray-400">{label}</span><span className="min-w-0 break-words font-medium">{children}</span></div>}
export function Action({label,kind,onClick}:{label:string;kind:keyof typeof icons;onClick:()=>void}){const Icon=icons[kind];return <button type="button" className={button} aria-label={label} onClick={onClick}><Icon className="size-5"/><span>{label}</span></button>}
