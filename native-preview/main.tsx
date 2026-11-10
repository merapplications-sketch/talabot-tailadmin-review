import React,{useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {NextIntlClientProvider} from 'next-intl';
import {ThemeProvider} from '../src/context/theme-context';
import NativeAdmin from '../src/components/talabot/native';
import en from '../src/messages/en.json';import ru from '../src/messages/ru.json';import tg from '../src/messages/tg.json';
import '../src/app/globals.css';
const readLocale=()=>{const value=localStorage.getItem('ux02-native:locale');return value&&['en','ru','tg'].includes(value)?value:'en'};
function Root(){const [locale,setLocale]=useState(readLocale);useEffect(()=>{document.documentElement.lang=locale},[locale]);useEffect(()=>{const sync=()=>setLocale(readLocale());addEventListener('native-locale',sync);return()=>removeEventListener('native-locale',sync)},[]);return <NextIntlClientProvider locale={locale} messages={({en,ru,tg})[locale as 'en'|'ru'|'tg']} timeZone="Asia/Dushanbe"><ThemeProvider><NativeAdmin/></ThemeProvider></NextIntlClientProvider>}
createRoot(document.getElementById('root')!).render(<Root/>);
