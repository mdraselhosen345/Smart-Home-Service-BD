# Real Brothers Shop — Backend setup (বাংলা)

এই ZIP-এ `backend/` নামে Express API যোগ করা হয়েছে। এটি MongoDB Atlas-এ পণ্য, অর্ডার ও সার্ভিস বুকিং রাখে এবং Firebase ID token যাচাই করে admin API সুরক্ষিত রাখে। **এটি এখনো আপনার লাইভ ডোমেইনে deploy করা হয়নি এবং frontend-এর সব admin/customer page এখনো API-তে সংযুক্ত নয়।** নিচের সেটআপ শেষ করে page-গুলো API helper (`src/lib-api.js`) ব্যবহার করে সংযুক্ত করতে হবে।

## 1. নিরাপত্তা
- ZIP-এর মূল `.env` ইচ্ছাকৃতভাবে distribution ZIP-এ রাখা হবে না। `.env`/secret কখনো GitHub-এ push করবেন না।
- Firebase web config browser-এ দৃশ্যমান হওয়া স্বাভাবিক, কিন্তু Firebase Console-এ authorized domains, Authentication providers এবং Firestore/Storage rules সঠিকভাবে সেট করতে হবে। Backend admin API Firebase ID token ও `ADMIN_EMAILS` যাচাই করে।
- Admin email শুধু `backend/.env`-এর `ADMIN_EMAILS`-এ দিন। Frontend-এর PrivateRoute শুধু UI guard; server-side authorization-ই আসল নিরাপত্তা।
- বKash/Nagad-কে শুধু payment method নাম হিসেবে রাখা হয়েছে। এটি আসল payment confirmation নয়। Live payment নিতে merchant onboarding ও provider-এর server-side checkout/callback verification লাগবে।

## 2. MongoDB Atlas
1. MongoDB Atlas-এ project/cluster তৈরি করুন।
2. Database Access থেকে আলাদা database user তৈরি করুন; শক্তিশালী password দিন।
3. Network Access-এ deployment host-এর IP allow করুন। Production-এ অকারণে `0.0.0.0/0` খুলবেন না।
4. Connect → Drivers থেকে connection string নিন এবং `backend/.env`-এ `MONGODB_URI` হিসেবে রাখুন।

## 3. Firebase
1. বর্তমান frontend-এ যে Firebase project আছে সেটিই ব্যবহার করুন।
2. Authentication → Sign-in method-এ Email/Password ও চাইলে Google চালু করুন।
3. `backend/.env`-এ `FIREBASE_PROJECT_ID` একই project ID দিন। Firebase Admin SDK hosting environment-এর Application Default Credentials ব্যবহার করবে; Render/Railway-এর মতো host-এ provider-supported service account/credentials configuration অনুসরণ করুন। Service-account JSON GitHub-এ দেবেন না।
4. `ADMIN_EMAILS`-এ আপনার admin email দিন। Production-এ admin account email verified রাখুন।

## 4. লোকাল রান
Terminal 1 (backend):
```bash
cd backend
npm install
# .env.example কপি করে .env বানান, মানগুলো পূরণ করুন
npm run dev
```
Terminal 2 (frontend, project root):
```bash
npm install
# root .env.example কপি করে .env বানান এবং Firebase মানগুলো দিন
npm run dev
```
API health check: `http://localhost:5000/api/health`

## 5. API endpoints
- `GET /api/products`, `GET /api/products/:id` — public active catalogue
- `POST /api/orders` — customer order create; browser total নয়, known product-এর database price নেওয়া হয়
- `POST /api/services` — service booking
- Admin (Firebase ID token লাগে): `GET/POST /api/admin/products`, `PATCH/DELETE /api/admin/products/:id`, `GET /api/admin/orders`, `PATCH /api/admin/orders/:id`, `GET /api/admin/services`, `PATCH /api/admin/services/:id`, `GET /api/admin/customers`, `GET /api/admin/payments`, `GET /api/admin/dashboard`

Admin request-এর header: `Authorization: Bearer <Firebase ID token>`। `src/lib-api.js`-এর `apiRequest()` এটি যোগ করে; যেমন `apiRequest('/admin/products', { admin: true })`।

## 6. ডোমেইন ও production
- Domain registrar-এ domain কিনুন। Frontend host (যেমন Vercel/Netlify) এবং backend host (যেমন Render/Railway) আলাদা হতে পারে।
- Frontend host-এ `VITE_API_URL=https://your-api-domain.example/api` এবং সব `VITE_FIREBASE_*` production environment variables দিন।
- Backend host-এ `MONGODB_URI`, `FIREBASE_PROJECT_ID`, `ADMIN_EMAILS`, `CLIENT_ORIGINS=https://your-domain.com` এবং `NODE_ENV=production` দিন।
- DNS records host-এর নির্দেশনা অনুযায়ী সেট করুন, HTTPS/SSL সক্রিয় করুন, Firebase Authentication-এর Authorized domains-এ আপনার domain যোগ করুন।
- প্রতিটি route, mobile layout, checkout, admin role, order total, inventory, backup ও payment test না করে live traffic নেবেন না।

## Important limitation
Backend API তৈরি হয়েছে, কিন্তু বর্তমান frontend-এর Add Product, All Product, Orders, Services, Customers, Payments, Dashboard এখনো বেশিরভাগ ক্ষেত্রে `localStorage` ব্যবহার করছে। Production-ready করার জন্য প্রতিটি page ও public shop/checkout-কে API-তে সংযুক্ত করতে হবে এবং live domain/credentials দিয়ে deploy ও test করতে হবে।
