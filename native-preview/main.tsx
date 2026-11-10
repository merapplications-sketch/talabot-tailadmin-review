import React,{useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {NextIntlClientProvider} from 'next-intl';
import {ThemeProvider} from '../src/context/theme-context';
import NativeAdmin from '../src/components/talabot/native';
import dictionary from '../src/components/talabot/native/dictionary.json';
import {sections} from '../src/components/talabot/native/b-shell/data';
import {TooltipProvider} from '../src/components/ui/tooltip';
import en from '../src/messages/en.json';import ru from '../src/messages/ru.json';import tg from '../src/messages/tg.json';
import '../src/app/globals.css';
const readLocale=()=>{const value=localStorage.getItem('ux02-native:locale');return value&&['en','ru','tg'].includes(value)?value:'en'};
const keys=['tO','tS','tD','tU','tH','tG','tR','tB','tP','tY','tL','tF'];
for(const [lang,messages] of Object.entries({en,ru,tg})){messages.sidebar.groups.menu=lang==='en'?'Operations':lang==='tg'?'Амалиёт':'Операции';Object.assign(messages.sidebar.items,Object.fromEntries(sections.map((section,i)=>['native_'+section,(dictionary[lang==='en'?'en':'ru'] as Record<string,string>)[keys[i]]])))}
function Root(){const [locale,setLocale]=useState(readLocale);useEffect(()=>{document.documentElement.lang=locale},[locale]);useEffect(()=>{const sync=()=>setLocale(readLocale());addEventListener('native-locale',sync);return()=>removeEventListener('native-locale',sync)},[]);return <NextIntlClientProvider locale={locale} messages={({en,ru,tg})[locale as 'en'|'ru'|'tg']} timeZone="Asia/Dushanbe"><ThemeProvider><TooltipProvider><NativeAdmin/></TooltipProvider></ThemeProvider></NextIntlClientProvider>}
createRoot(document.getElementById('root')!).render(<Root/>);
