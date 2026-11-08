import assert from 'node:assert/strict';
import {signUpSchema} from '../src/components/others/auth/sign-up/schema.ts';
import {signInSchema} from '../src/components/others/auth/sign-in/schema.ts';
const valid={fname:'Demo',lname:'Tester',email:'demo@example.invalid',password:'DemoPass123',confirmPassword:'DemoPass123',terms:true};
for(const patch of [{fname:' '},{lname:''},{email:'invalid'},{password:'123'},{confirmPassword:'different'},{terms:false}])assert.equal(signUpSchema.safeParse({...valid,...patch}).success,false);
assert.equal(signUpSchema.safeParse(valid).success,true);
assert.equal(signInSchema.safeParse({email:'bad',password:'x'}).success,false);
assert.equal(signInSchema.safeParse({email:'demo@example.invalid',password:'x'}).success,true);
console.log('9 real schema assertions passed; no backend authentication implied');
