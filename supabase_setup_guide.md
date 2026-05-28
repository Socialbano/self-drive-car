# Complete Website Migration & Supabase Setup Guide

यह गाइड आपको स्टेप-बाय-स्टेप बताएगी कि जब भी आप यह वेबसाइट/प्रोजेक्ट किसी नए क्लाइंट को बेचें (Sale करें), तो **Supabase** और **Cloudinary** को नए क्लाइंट के लिए सेट करने का सबसे आसान और सबसे तेज़ (Minimum Time-Taking) तरीका क्या है।

इस पूरी प्रक्रिया में **मुश्किल से 5 से 10 मिनट** का समय लागेल।

---

## 🛠️ Phase 1: Supabase Setup (Database & Storage)

### Step 1: नया Supabase प्रोजेक्ट बनाएं
1. **[Supabase.com](https://supabase.com)** पर जाएं और नए क्लाइंट के ईमेल से (या अपने मुख्य अकाउंट में) एक नया प्रोजेक्ट (**New Project**) बनाएं।
2. प्रोजेक्ट का **Database Password** कहीं सुरक्षित रूप से लिख कर रख लें।

### Step 2: Database Tables & Seeds तैयार करें (SQL Editor)
प्रोजेक्ट की सभी 10 आवश्यक टेबल्स (Settings, Cars, Leads, Invoices, Agreements, Blogs, Reels आदि) और शुरुआती डेटा को 1-क्लिक में सेटअप करने के लिए:
1. अपने नए Supabase प्रोजेक्ट के डैशबोर्ड में जाएं।
2. लेफ्ट साइडबार से **SQL Editor** पर क्लिक करें और **New Query** पर क्लिक करें।
3. आपके इस प्रोजेक्ट फ़ोल्डर के मुख्य डायरेक्टरी में मौजूद `supabase_complete_setup.sql` फ़ाइल का पूरा कोड कॉपी करें।
4. उसे SQL Editor में पेस्ट करें और **Run** बटन पर क्लिक करें। 
   *(यह सभी जरूरी टेबल्स, सिक्योरिटी रूल्स (RLS Policies) और कॉन्फ़िगरेशन को तुरंत तैयार कर देगा)।*

### Step 3: Storage Buckets & Policies तैयार करें (SQL Editor)
वेबसाइट पर इमेज, कार थंबनेल्स, लोगो और QR कोड अपलोड करने के लिए स्टोरेज बकेट्स बनानी होंगी:
1. SQL Editor में एक नया Query टैब खोलें (**New Query**)।
2. प्रोजेक्ट फ़ोल्डर में मौजूद `supabase_storage_setup.sql` फ़ाइल का पूरा कोड कॉपी करें।
3. उसे SQL Editor में पेस्ट करें और **Run** पर क्लिक करें।
   *(यह `hero-images` और `business-assets` बकेट्स बना देगा और उनके लिए सार्वजनिक (Public Read) और एडमिन के लिए अपलोड पॉलिसियों को सेट कर देगा)।*
4. **वैकल्पिक मैन्युअल तरीका:** यदि SQL से बकेट न बने, तो Supabase Dashboard में **Storage** -> **New Bucket** पर क्लिक करें और `hero-images` व `business-assets` नाम की दो **Public** बकेट्स बना लें।

---

## ☁️ Phase 2: Cloudinary Setup (For Optimization & Transformations)

प्रत्येक क्लाइंट/वेबसाइट के लिए एक अलग, स्वतंत्र Cloudinary अकाउंट होना चाहिए ताकि एक वेबसाइट की लिमिट खत्म होने पर दूसरी वेबसाइट बंद न हो।

### Step 1: नया Cloudinary अकाउंट बनाएं
1. **[Cloudinary.com](https://cloudinary.com)** पर जाएं और एक नया **Free Account** बनाएं।
2. लॉगिन करने के बाद अपने **Dashboard** से **Cloud Name** को कॉपी कर लें।

### Step 2: Unsigned Upload Preset बनाएं (Uploads के लिए)
1. Cloudinary Dashboard में नीचे लेफ्ट साइड में **Settings (गियर आइकॉन)** पर क्लिक करें।
2. **Upload** टैब पर जाएं।
3. स्क्रॉल करके **Upload presets** सेक्शन में जाएं और **Add upload preset** पर क्लिक करें।
4. सेटिंग्स इस प्रकार रखें:
   * **Upload preset name:** `hero_upload` (या कोई भी नाम जो आप रखना चाहें)
   * **Signing Mode:** इसे **Unsigned** पर सेट करें *(यह बहुत महत्वपूर्ण है)*
   * **Folder:** आप चाहें तो इसे `cars` या खाली छोड़ सकते हैं।
5. **Save** पर क्लिक करें और इस Preset का नाम कॉपी कर लें।

---

## 🔒 Phase 3: Environment Variables अपडेट करें (Connect Code to Database)

वेबसाइट को नए डेटाबेस और Cloudinary से कनेक्ट करने के लिए, अपने होस्टिंग प्लेटफॉर्म (जैसे Hostinger, Vercel, Netlify आदि) पर या लोकल टेस्टिंग के लिए `.env.local` फ़ाइल में ये वैरिएबल्स अपडेट करें:

1. Supabase डैशबोर्ड में **Project Settings > API** पर जाएं।
2. निम्नलिखित वैरिएबल्स की वैल्यूज़ को बदलें:
   ```env
   # Supabase Credentials
   NEXT_PUBLIC_SUPABASE_URL="यहाँ आपके नए Supabase प्रोजेक्ट का Project URL पेस्ट करें"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="यहाँ आपका नया API Anon Public Key पेस्ट करें"

   # Cloudinary Credentials
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="यहाँ नया Cloudinary Cloud Name पेस्ट करें"
   CLOUDINARY_UPLOAD_PRESET="यहाँ नया Upload Preset (e.g. hero_upload) पेस्ट करें"

   # Admin System
   NEXT_PUBLIC_SUPER_ADMIN_EMAIL="यहाँ एडमिन का मुख्य ईमेल आईडी डालें"
   ```

---

## 🔑 Phase 4: पहला एडमिन यूजर बनाएं (Create Admin Account)

एडमिन पैनल (Dashboard) में लॉगिन करने के लिए पहला यूजर बनाएं:
1. Supabase डैशबोर्ड में लेफ्ट साइडबार से **Authentication** टैब पर जाएं।
2. **Users** -> **Add User** -> **Create User** पर क्लिक करें।
3. नए क्लाइंट का **Email** और **Password** डालें और **Create User** पर क्लिक करें।
4. यूजर क्रिएट होने के बाद, यूजर के नाम के आगे **Confirm Email** बटन पर क्लिक कर दें (ताकि उसे ईमेल वेरिफिकेशन की प्रतीक्षा न करनी पड़े और अकाउंट तुरंत एक्टिव हो जाए)।

---

## 🎨 Phase 5: एडमिन पैनल से सेटिंग्स बदलें (Dynamic Settings Customization)

अब आपको कोड में कुछ भी बदलने की आवश्यकता नहीं है, वेबसाइट का ब्रांड और डोमेन पूरी तरह से डायनामिक है:

1. अपनी नई लाइव वेबसाइट पर जाएं और `/admin/settings` लिंक खोलें।
2. **Phase 4** में बनाए गए एडमिन ईमेल और पासवर्ड से लॉगिन करें।
3. **Control Settings** और **SEO & Pixels** टैब में जाकर निम्नलिखित बदलाव करें:
   * **Business Name, Mobile Numbers, WhatsApp Messages, Address, Email** आदि बदलें।
   * नया **UPI QR Code** और **Logo** डायरेक्ट फ़ाइल अपलोड करके बदलें।
   * **Website Canonical Domain URL** डालें (जैसे `https://drivekro.in` या `https://selfdrivecarrental.in`)।
   * नया Google Analytics ID, Meta Pixel ID या Google Site Verification (GSC) कोड सेट करें।
4. **Save Settings** पर क्लिक करें।

---

### 🎉 बधाई हो!
आपकी वेबसाइट अब पूरी तरह से नए क्लाइंट के ब्रांड, नए संपर्क नंबर, नए क्यूआर कोड, और नए डेटाबेस पर लाइव हो चुकी है।
