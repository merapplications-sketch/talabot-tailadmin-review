import {createTranslator} from 'use-intl/core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const expected={en:['0 orders','1 order','2 orders','5 orders','11 orders','21 orders','22 orders','25 orders'],ru:['0 заказов','1 заказ','2 заказа','5 заказов','11 заказов','21 заказ','22 заказа','25 заказов'],tg:['0 фармоиш','1 фармоиш','2 фармоиш','5 фармоиш','11 фармоиш','21 фармоиш','22 фармоиш','25 фармоиш']};
for(const locale of Object.keys(expected)){const messages=JSON.parse(fs.readFileSync(`src/messages/${locale}.json`));const t=createTranslator({locale,messages,namespace:'talabotOrders'});[0,1,2,5,11,21,22,25].forEach((count,i)=>assert.equal(t('results',{count}),expected[locale][i]));}
console.log('PASS: 24 count cases EN/RU/TG, including Russian 11/21/22/25. TG linguistic review remains open.');
