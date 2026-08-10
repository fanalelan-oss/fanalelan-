const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://fan-alelan.com';

export function LocalBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#business`,
    "name": "فن الإعلان للدعاية والإعلان",
    "alternateName": "Fan Al-Elan Advertising",
    "description": "شركة فن الإعلان متخصصة في الدعاية والإعلان والمقاولات العامة بالرياض. تنفيذ واجهات كلادينج، لوحات إعلانية، أسوار دعائية، حروف بارزة مضيئة، تغليف سيارات، أعمال حديد، مظلات وسواتر. خدمة جميع أحياء ومناطق الرياض.",
    "url": BASE_URL,
    "telephone": "+966557517792",
    "email": "info@fan-alelan.com",
    "image": `${BASE_URL}/android-chrome-512x512.png`,
    "logo": `${BASE_URL}/favicon.svg`,
    "priceRange": "$$",
    "currenciesAccepted": "SAR",
    "paymentAccepted": "Cash, Bank Transfer",
    "areaServed": {
      "@type": "City",
      "name": "الرياض",
      "alternateName": "Riyadh"
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 24.7136,
        "longitude": 46.6753
      },
      "geoRadius": "50000"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "الرياض",
      "addressRegion": "منطقة الرياض",
      "addressCountry": "SA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 24.7136,
      "longitude": 46.6753
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        "opens": "08:00",
        "closes": "22:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61587226595703",
      "https://wa.me/966557517792",
      "https://maps.app.goo.gl/6yK27RgFCgv9NGSh9"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "خدمات فن الإعلان",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "دعاية وإعلان",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "واجهات كلادينج الرياض", "url": `${BASE_URL}/services/cladding-facades` } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "لوحات إعلانية حروف بارزة الرياض", "url": `${BASE_URL}/services/advertising-signs` } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "أسوار إعلانية ودعائية الرياض", "url": `${BASE_URL}/services/promotional-fences` } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "استيكرات وتغليف سيارات الرياض", "url": `${BASE_URL}/services/car-stickers` } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "طباعة رقمية بنر فلكس الرياض", "url": `${BASE_URL}/services/digital-printing` } }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "مقاولات عامة",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "أعمال الحديد قص ليزر مظلات سواتر الرياض", "url": `${BASE_URL}/services/iron-works` } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "صيانة وترميم واجهات ولوحات الرياض", "url": `${BASE_URL}/services/maintenance-restoration` } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "تصميم وتنفيذ بوثات معارض الرياض", "url": `${BASE_URL}/services/booths-and-stands` } }
          ]
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    "name": "فن الإعلان للدعاية والإعلان والمقاولات",
    "alternateName": "Fan Al-Elan",
    "url": BASE_URL,
    "logo": `${BASE_URL}/favicon.svg`,
    "description": "شركة فن الإعلان — متخصصون في الدعاية والإعلان والمقاولات العامة بالرياض. واجهات كلادينج، لوحات محلات، أسوار دعائية، حروف بارزة، تغليف سيارات، أعمال حديد.",
    "foundingLocation": {
      "@type": "Place",
      "name": "الرياض، المملكة العربية السعودية"
    },
    "knowsAbout": [
      "واجهات كلادينج",
      "لوحات إعلانية",
      "حروف بارزة مضيئة",
      "أسوار دعائية",
      "أسوار إعلانية",
      "تغليف سيارات",
      "طباعة رقمية",
      "أعمال حديد",
      "قص ليزر",
      "مظلات وسواتر",
      "صيانة وترميم",
      "مقاولات عامة",
      "بوثات معارض",
      "دعاية وإعلان الرياض"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+966557517792",
      "contactType": "sales",
      "areaServed": "SA",
      "availableLanguage": ["Arabic"]
    },
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61587226595703",
      "https://wa.me/966557517792",
      "https://maps.app.goo.gl/6yK27RgFCgv9NGSh9"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQPageJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceJsonLd({ name, description, url, image }: { name: string; description: string; url: string; image?: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "url": url,
    "provider": {
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/#business`
    },
    "areaServed": {
      "@type": "City",
      "name": "الرياض"
    },
    ...(image && { "image": image })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BlogPostJsonLd({ title, description, url, image, datePublished }: { title: string; description: string; url: string; image: string; datePublished: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "url": url,
    "image": image.startsWith('http') ? image : `${BASE_URL}${image}`,
    "datePublished": datePublished,
    "dateModified": datePublished,
    "author": {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`
    },
    "publisher": {
      "@type": "Organization",
      "name": "فن الإعلان للدعاية والإعلان",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/favicon.svg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
