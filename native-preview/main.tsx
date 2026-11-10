import React,{useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {NextIntlClientProvider} from 'next-intl';
import {ThemeProvider} from '../src/context/theme-context';
import NativeAdmin from '../src/components/talabot/native';
import en from '../src/messages/en.json';import ru from '../src/messages/ru.json';import tg from '../src/messages/tg.json';
import '../src/app/globals.css';
function Root(){const [locale,setLocale]=useState(localStorage.getItem('ux02-native:locale')||'en');useEffect(()=>{const sync=()=>setLocale(localStorage.getItem('ux02-native:locale')||'en');addEventListener('native-locale',sync);return()=>removeEventListener('native-locale',sync)},[]);return <NextIntlClientProvider locale={locale} messages={({en,ru,tg})[locale as 'en'|'ru'|'tg']} timeZone="Asia/Dushanbe"><ThemeProvider><NativeAdmin/></ThemeProvider></NextIntlClientProvider>}
createRoot(document.getElementById('root')!).render(<Root/>);
