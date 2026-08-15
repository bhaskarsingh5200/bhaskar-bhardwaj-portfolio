const starter = {
  id: "starter",
  name: "Starter",
  dot: "🟢",
  popular: false
};

const professional = {
  id: "professional",
  name: "Professional",
  dot: "🔵",
  popular: true
};

const premium = {
  id: "premium",
  name: "Premium",
  dot: "🔥",
  popular: false
};

const tier = (base, { price, audience, blurb, features }) => ({
  ...base,
  price,
  audience,
  blurb,
  features
});

export const pricingCategories = [
  {
    id: "gym",
    label: "Gym & Fitness",
    emoji: "🏋️",
    heading: "Gym Website Packages",
    subtitle:
      "One-time build pricing for gym & fitness websites — from a professional website to a complete business management system. Choose the package that fits your budget and growth stage.",
    tiers: [
      tier(starter, {
        price: "₹15,000",
        audience: "Small / local gym",
        blurb: "A professional website that builds your brand — without the heavy features.",
        features: [
          "Custom responsive design",
          "Home, About & core pages",
          "Basic membership plans",
          "Gallery + Instagram link/grid",
          "WhatsApp, contact form, Google Maps",
          "FAQ + testimonials",
          "Basic SEO, security & performance"
        ]
      }),
      tier(professional, {
        price: "₹25,000",
        audience: "Growing gym",
        blurb: "The most popular package — everything a growing gym needs to stand out.",
        features: [
          "Everything in Starter",
          "Dynamic membership plans",
          "Programs + trainer profiles",
          "Free trial booking + class timetable",
          "Transformations + nutrition section",
          "Blog + basic admin dashboard",
          "SEO & performance optimization"
        ]
      }),
      tier({ ...premium, name: "Business", dot: "🟣", id: "business" }, {
        price: "₹35,000",
        audience: "Serious business",
        blurb: "Best-value package — website plus business management tools.",
        features: [
          "Everything in Professional",
          "CRM + lead management",
          "Member management + expiry & renewal tracking",
          "Class booking + attendance",
          "Shop with cart, checkout & orders",
          "Advanced SEO + analytics",
          "Notifications & renewal alerts"
        ]
      }),
      tier(premium, {
        price: "₹49,000",
        audience: "Premium / pro gym",
        blurb: "The complete business system — website plus full gym management suite.",
        features: [
          "Everything in Business",
          "Advanced membership + booking + attendance",
          "Advanced shop, coupons & payment gateway",
          "Admin roles, audit logs & alerts",
          "Advanced analytics + local SEO",
          "Advanced security hardening",
          "Priority support"
        ]
      })
    ],
    comparison: [
      { feature: "Custom responsive design", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Membership Plans", values: ["Basic", "Dynamic", "Dynamic + comparison", "Advanced"] },
      { feature: "Programs / Training Plans", values: ["Basic", "yes", "yes", "yes"] },
      { feature: "Trainers", values: ["Basic section", "Profiles", "Admin managed", "Advanced"] },
      { feature: "Gallery + Instagram", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Free Trial Booking", values: ["no", "yes", "yes", "Advanced"] },
      { feature: "Class Timetable", values: ["no", "Basic", "Dynamic", "Dynamic + booking"] },
      { feature: "Blog", values: ["no", "Basic", "Admin managed", "Advanced"] },
      { feature: "CRM / Lead Management", values: ["no", "no", "Basic", "Advanced"] },
      { feature: "Member Management", values: ["no", "no", "Basic", "yes"] },
      { feature: "Shop + Cart + Checkout", values: ["no", "Basic", "Full", "Advanced"] },
      { feature: "Payment Gateway", values: ["no", "Optional", "yes", "yes"] },
      { feature: "Analytics", values: ["no", "Basic", "yes", "Advanced"] },
      { feature: "Admin Dashboard", values: ["no", "Basic", "yes", "Full"] },
      { feature: "Security hardening", values: ["Basic", "yes", "yes", "Advanced"] },
      { feature: "Best for", values: ["Small/local gym", "Growing gym", "Serious business", "Premium/pro gym"] }
    ]
  },

  {
    id: "business",
    label: "Business & Corporate",
    emoji: "💼",
    heading: "Business Website Packages",
    subtitle:
      "Clean, professional websites that make your business look established and trustworthy — built to bring you enquiries and calls.",
    tiers: [
      tier(starter, {
        price: "₹9,999",
        audience: "Small business",
        blurb: "A sharp 5-page website that makes your business look professional.",
        features: [
          "Custom responsive design",
          "5 core pages (Home, About, Services, Contact)",
          "Contact form + WhatsApp button",
          "Google Maps embed",
          "Basic SEO, security & performance",
          "Free Google Analytics setup"
        ]
      }),
      tier(professional, {
        price: "₹17,999",
        audience: "Growing business",
        blurb: "A complete business presence with more pages, a blog and easy editing.",
        features: [
          "Everything in Starter",
          "Up to 10 pages",
          "Testimonials + case studies",
          "FAQ section",
          "Blog with admin dashboard",
          "Advanced SEO + analytics",
          "Team & services showcase"
        ]
      }),
      tier(premium, {
        price: "₹29,999",
        audience: "Established brand",
        blurb: "A full corporate site with lead management and everything managed for you.",
        features: [
          "Everything in Professional",
          "CRM + lead capture & tracking",
          "Multiple language support",
          "Custom animations & branding",
          "Advanced security hardening",
          "Priority support"
        ]
      })
    ],
    comparison: [
      { feature: "Custom responsive design", values: ["yes", "yes", "yes"] },
      { feature: "Pages", values: ["5", "Up to 10", "Unlimited"] },
      { feature: "Contact form + WhatsApp", values: ["yes", "yes", "yes"] },
      { feature: "Testimonials", values: ["no", "yes", "yes"] },
      { feature: "Blog", values: ["no", "yes", "yes"] },
      { feature: "Admin dashboard", values: ["no", "Basic", "Full"] },
      { feature: "CRM / Lead Management", values: ["no", "no", "yes"] },
      { feature: "Multiple languages", values: ["no", "no", "yes"] },
      { feature: "Analytics", values: ["Basic", "yes", "Advanced"] },
      { feature: "SEO", values: ["Basic", "yes", "Advanced"] },
      { feature: "Best for", values: ["Small business", "Growing business", "Established brand"] }
    ]
  },

  {
    id: "restaurant",
    label: "Restaurant, Cafe & Food",
    emoji: "🍽️",
    heading: "Restaurant & Cafe Website Packages",
    subtitle:
      "Hungry for customers? Beautiful food websites with menus, table bookings and even online ordering.",
    tiers: [
      tier(starter, {
        price: "₹11,999",
        audience: "Cafe / small restaurant",
        blurb: "A mouth-watering website with your menu, gallery and contact details.",
        features: [
          "Custom responsive design",
          "Digital menu + dish gallery",
          "Reservations via WhatsApp",
          "Contact form + Google Maps",
          "Basic SEO, security & performance"
        ]
      }),
      tier(professional, {
        price: "₹19,999",
        audience: "Growing restaurant",
        blurb: "Adds online table booking, reviews and an easy-to-edit menu.",
        features: [
          "Everything in Starter",
          "Online table booking system",
          "Customer reviews + testimonials",
          "Food delivery links (Zomato/Swiggy)",
          "Blog + admin dashboard",
          "Advanced SEO + analytics"
        ]
      }),
      tier(premium, {
        price: "₹34,999",
        audience: "Full service restaurant",
        blurb: "Your own online ordering system — keep every order and every rupee yours.",
        features: [
          "Everything in Professional",
          "Online ordering + cart + checkout",
          "Order management dashboard",
          "Payment gateway integration",
          "Loyalty & offers",
          "Advanced analytics + priority support"
        ]
      })
    ],
    comparison: [
      { feature: "Custom responsive design", values: ["yes", "yes", "yes"] },
      { feature: "Digital menu", values: ["yes", "yes", "yes"] },
      { feature: "Reservations / Table booking", values: ["WhatsApp", "Online booking", "Online + manage"] },
      { feature: "Reviews", values: ["no", "yes", "yes"] },
      { feature: "Food delivery links", values: ["no", "yes", "yes"] },
      { feature: "Online ordering + cart", values: ["no", "no", "yes"] },
      { feature: "Payment gateway", values: ["no", "no", "yes"] },
      { feature: "Admin dashboard", values: ["no", "Basic", "Full orders"] },
      { feature: "SEO", values: ["Basic", "yes", "Advanced + Local"] },
      { feature: "Best for", values: ["Cafe / small restaurant", "Growing restaurant", "Full service restaurant"] }
    ]
  },

  {
    id: "ecommerce",
    label: "E-commerce & Online Shop",
    emoji: "🛒",
    heading: "E-commerce Website Packages",
    subtitle:
      "Sell online like the big brands — product stores with cart, secure checkout and order management.",
    tiers: [
      tier(starter, {
        price: "₹14,999",
        audience: "New online store",
        blurb: "A professional store to get you selling online quickly.",
        features: [
          "Custom responsive store design",
          "Up to 50 products",
          "Shopping cart + checkout",
          "WhatsApp orders option",
          "Product categories + search",
          "Basic SEO + performance"
        ]
      }),
      tier(professional, {
        price: "₹24,999",
        audience: "Growing brand",
        blurb: "Full online store with payment gateway and easy admin management.",
        features: [
          "Everything in Starter",
          "Up to 200 products",
          "Payment gateway (UPI/cards)",
          "Order management dashboard",
          "Product variants (size/color)",
          "Coupons & offers",
          "Advanced SEO + analytics"
        ]
      }),
      tier(premium, {
        price: "₹39,999",
        audience: "Scaling business",
        blurb: "A complete e-commerce system built to scale with your sales.",
        features: [
          "Everything in Professional",
          "Unlimited products",
          "Inventory & stock alerts",
          "Customer accounts + order history",
          "Advanced coupons & promotions",
          "Email / WhatsApp order notifications",
          "Advanced security + priority support"
        ]
      })
    ],
    comparison: [
      { feature: "Custom store design", values: ["yes", "yes", "yes"] },
      { feature: "Products", values: ["Up to 50", "Up to 200", "Unlimited"] },
      { feature: "Product variants", values: ["no", "yes", "yes"] },
      { feature: "Cart + checkout", values: ["yes", "yes", "yes"] },
      { feature: "Payment gateway", values: ["no", "yes", "yes"] },
      { feature: "Order management", values: ["no", "yes", "Advanced"] },
      { feature: "Inventory tracking", values: ["no", "no", "yes"] },
      { feature: "Customer accounts", values: ["no", "no", "yes"] },
      { feature: "Coupons & offers", values: ["no", "Basic", "Advanced"] },
      { feature: "Admin dashboard", values: ["no", "yes", "Full"] },
      { feature: "Best for", values: ["New online store", "Growing brand", "Scaling business"] }
    ]
  },

  {
    id: "education",
    label: "Education & Coaching",
    emoji: "🎓",
    heading: "Education & Coaching Website Packages",
    subtitle:
      "Attract students and parents with a professional website for your institute, academy or coaching centre.",
    tiers: [
      tier(starter, {
        price: "₹9,999",
        audience: "New institute",
        blurb: "A clean website showcasing your courses, teachers and contact details.",
        features: [
          "Custom responsive design",
          "Courses & programs showcase",
          "Faculty profiles",
          "Contact form + WhatsApp",
          "Basic SEO, security & performance"
        ]
      }),
      tier(professional, {
        price: "₹17,999",
        audience: "Active academy",
        blurb: "Adds admission enquiries, timetables and easy content management.",
        features: [
          "Everything in Starter",
          "Online admission / enquiry forms",
          "Class timetables",
          "Results & notice board section",
          "Blog + admin dashboard",
          "Advanced SEO + analytics"
        ]
      }),
      tier(premium, {
        price: "₹29,999",
        audience: "Premium coaching",
        blurb: "A complete learning brand with online course booking and payments.",
        features: [
          "Everything in Professional",
          "Online course / batch booking",
          "Fee payment gateway",
          "Student accounts + progress",
          "Certificates section",
          "Priority support"
        ]
      })
    ],
    comparison: [
      { feature: "Custom responsive design", values: ["yes", "yes", "yes"] },
      { feature: "Courses showcase", values: ["yes", "yes", "yes"] },
      { feature: "Admission / enquiry forms", values: ["no", "yes", "yes"] },
      { feature: "Timetables", values: ["no", "yes", "yes"] },
      { feature: "Results / notice board", values: ["no", "yes", "yes"] },
      { feature: "Online booking + payment", values: ["no", "no", "yes"] },
      { feature: "Student accounts", values: ["no", "no", "yes"] },
      { feature: "Admin dashboard", values: ["no", "Basic", "Full"] },
      { feature: "SEO", values: ["Basic", "yes", "Advanced"] },
      { feature: "Best for", values: ["New institute", "Active academy", "Premium coaching"] }
    ]
  },

  {
    id: "wedding",
    label: "Wedding & Events",
    emoji: "💍",
    heading: "Wedding & Events Website Packages",
    subtitle:
      "Beautiful, shareable websites for weddings, engagements and events — right from the announcement to the RSVPs.",
    tiers: [
      tier(starter, {
        price: "₹11,999",
        audience: "Wedding day site",
        blurb: "An elegant single-page site for your special day.",
        features: [
          "Custom elegant design",
          "Couple story + photos",
          "Event details & venue",
          "Photo gallery",
          "RSVP via WhatsApp",
          "Mobile-first design"
        ]
      }),
      tier(professional, {
        price: "₹19,999",
        audience: "Full event site",
        blurb: "A complete event website with schedule, guestbook and gallery.",
        features: [
          "Everything in Starter",
          "Event schedule + countdown",
          "Online RSVP form",
          "Guestbook / wishes section",
          "Gift registry section",
          "Multiple galleries"
        ]
      }),
      tier(premium, {
        price: "₹34,999",
        audience: "Premium celebration",
        blurb: "A stunning cinematic website with guest management handled for you.",
        features: [
          "Everything in Professional",
          "Cinematic animations & effects",
          "Guest list & RSVP tracking",
          "Custom domain + branding",
          "Same-day gallery updates",
          "Priority support"
        ]
      })
    ],
    comparison: [
      { feature: "Custom elegant design", values: ["yes", "yes", "Cinematic"] },
      { feature: "Event details & schedule", values: ["Basic", "Yes + countdown", "Advanced"] },
      { feature: "Photo gallery", values: ["yes", "Multiple", "Same-day updates"] },
      { feature: "RSVP", values: ["WhatsApp", "Online form", "Online + tracking"] },
      { feature: "Guestbook / wishes", values: ["no", "yes", "yes"] },
      { feature: "Gift registry", values: ["no", "yes", "yes"] },
      { feature: "Guest list management", values: ["no", "no", "yes"] },
      { feature: "Custom domain", values: ["no", "no", "yes"] },
      { feature: "Best for", values: ["Wedding day site", "Full event site", "Premium celebration"] }
    ]
  },

  {
    id: "salon",
    label: "Salon, Spa & Beauty",
    emoji: "💇",
    heading: "Salon & Spa Website Packages",
    subtitle:
      "Attract walk-ins and book appointments online — a stunning website that matches your salon's style.",
    tiers: [
      tier(starter, {
        price: "₹9,999",
        audience: "Single salon",
        blurb: "A beautiful site with your services, prices and booking via WhatsApp.",
        features: [
          "Custom responsive design",
          "Services & price list",
          "Work / gallery showcase",
          "WhatsApp booking",
          "Contact form + Google Maps",
          "Basic SEO + performance"
        ]
      }),
      tier(professional, {
        price: "₹17,999",
        audience: "Popular salon",
        blurb: "Adds online appointment booking, staff profiles and easy management.",
        features: [
          "Everything in Starter",
          "Online appointment booking",
          "Staff & specialist profiles",
          "Packages & offers section",
          "Reviews & testimonials",
          "Admin dashboard"
        ]
      }),
      tier(premium, {
        price: "₹29,999",
        audience: "Salon chain / premium",
        blurb: "A complete booking system with payments, memberships and loyalty.",
        features: [
          "Everything in Professional",
          "Multi-branch support",
          "Online payments for bookings",
          "Memberships & loyalty",
          "Automated reminders",
          "Advanced analytics + priority support"
        ]
      })
    ],
    comparison: [
      { feature: "Custom responsive design", values: ["yes", "yes", "yes"] },
      { feature: "Services & price list", values: ["yes", "yes", "yes"] },
      { feature: "Booking", values: ["WhatsApp", "Online", "Online + payments"] },
      { feature: "Staff profiles", values: ["no", "yes", "yes"] },
      { feature: "Reviews & testimonials", values: ["no", "yes", "yes"] },
      { feature: "Multi-branch", values: ["no", "no", "yes"] },
      { feature: "Memberships & loyalty", values: ["no", "no", "yes"] },
      { feature: "Admin dashboard", values: ["no", "yes", "Full"] },
      { feature: "SEO", values: ["Basic", "yes", "Advanced + Local"] },
      { feature: "Best for", values: ["Single salon", "Popular salon", "Salon chain / premium"] }
    ]
  },

  {
    id: "healthcare",
    label: "Healthcare & Clinic",
    emoji: "🏥",
    heading: "Clinic & Healthcare Website Packages",
    subtitle:
      "A trustworthy online presence for clinics, doctors and healthcare providers — with easy appointment booking.",
    tiers: [
      tier(starter, {
        price: "₹11,999",
        audience: "New clinic",
        blurb: "A professional website introducing your clinic and doctors.",
        features: [
          "Custom responsive design",
          "Clinic info & services",
          "Doctor profiles",
          "Contact form + WhatsApp",
          "Google Maps + timings",
          "Basic SEO + performance"
        ]
      }),
      tier(professional, {
        price: "₹19,999",
        audience: "Established clinic",
        blurb: "Adds online appointment booking and builds patient trust.",
        features: [
          "Everything in Starter",
          "Online appointment booking",
          "Testimonials & patient stories",
          "FAQ + health blog",
          "Admin dashboard",
          "Advanced SEO + analytics"
        ]
      }),
      tier(premium, {
        price: "₹34,999",
        audience: "Hospital / multi-speciality",
        blurb: "A full healthcare platform with consultation booking and patient care tools.",
        features: [
          "Everything in Professional",
          "Multi-doctor / department system",
          "Online consultation booking",
          "Patient records & follow-ups",
          "Health packages & offers",
          "Priority support"
        ]
      })
    ],
    comparison: [
      { feature: "Custom responsive design", values: ["yes", "yes", "yes"] },
      { feature: "Doctor profiles", values: ["Basic", "yes", "Advanced"] },
      { feature: "Appointment booking", values: ["no", "Online", "Online + manage"] },
      { feature: "Testimonials", values: ["no", "yes", "yes"] },
      { feature: "Health blog / FAQ", values: ["no", "yes", "yes"] },
      { feature: "Multi-department system", values: ["no", "no", "yes"] },
      { feature: "Patient records & follow-ups", values: ["no", "no", "yes"] },
      { feature: "Admin dashboard", values: ["no", "Basic", "Full"] },
      { feature: "SEO", values: ["Basic", "yes", "Advanced + Local"] },
      { feature: "Best for", values: ["New clinic", "Established clinic", "Hospital / multi-speciality"] }
    ]
  },

  {
    id: "realestate",
    label: "Real Estate & Property",
    emoji: "🏠",
    heading: "Real Estate Website Packages",
    subtitle:
      "Showcase properties like a pro — listings, search, galleries and leads straight to your phone.",
    tiers: [
      tier(starter, {
        price: "₹11,999",
        audience: "New agent / builder",
        blurb: "A professional website with your properties and contact details.",
        features: [
          "Custom responsive design",
          "Property listings",
          "Image galleries per property",
          "Enquiry via WhatsApp/contact form",
          "Basic SEO + performance"
        ]
      }),
      tier(professional, {
        price: "₹19,999",
        audience: "Active agent / developer",
        blurb: "Adds property search, filters and an admin to manage listings.",
        features: [
          "Everything in Starter",
          "Property search + filters",
          "Featured & sold status",
          "Agent/builder profiles",
          "Blog + market updates",
          "Admin dashboard"
        ]
      }),
      tier(premium, {
        price: "₹34,999",
        audience: "Agency / developer group",
        blurb: "A complete real estate platform with lead CRM and advanced tools.",
        features: [
          "Everything in Professional",
          "Lead management / CRM",
          "Mortgage / EMI calculator",
          "Map & locality views",
          "Virtual tours support",
          "Advanced analytics + priority support"
        ]
      })
    ],
    comparison: [
      { feature: "Custom responsive design", values: ["yes", "yes", "yes"] },
      { feature: "Property listings", values: ["yes", "yes", "Advanced"] },
      { feature: "Search & filters", values: ["no", "yes", "yes"] },
      { feature: "Property galleries", values: ["yes", "yes", "yes"] },
      { feature: "Enquiry handling", values: ["WhatsApp", "Form", "CRM"] },
      { feature: "Agent / builder profiles", values: ["no", "yes", "yes"] },
      { feature: "EMI calculator", values: ["no", "no", "yes"] },
      { feature: "Map & locality views", values: ["no", "no", "yes"] },
      { feature: "Admin dashboard", values: ["no", "yes", "Full"] },
      { feature: "Best for", values: ["New agent / builder", "Active agent / developer", "Agency / developer group"] }
    ]
  },

  {
    id: "portfolio",
    label: "Personal Portfolio & Blog",
    emoji: "👤",
    heading: "Portfolio & Blog Packages",
    subtitle:
      "A personal brand that lands you clients — for freelancers, creators and professionals.",
    tiers: [
      tier(starter, {
        price: "₹6,999",
        audience: "Freelancer / student",
        blurb: "A sharp single-page portfolio that makes you look professional.",
        features: [
          "Custom responsive design",
          "About + work + contact sections",
          "Projects showcase",
          "Social media links",
          "Basic SEO + performance"
        ]
      }),
      tier(professional, {
        price: "₹11,999",
        audience: "Active creator",
        blurb: "A full personal site with a blog to grow your audience.",
        features: [
          "Everything in Starter",
          "Multi-section website",
          "Blog with admin dashboard",
          "Testimonials & services",
          "Advanced SEO + analytics"
        ]
      }),
      tier(premium, {
        price: "₹16,999",
        audience: "Personal brand",
        blurb: "A premium personal brand with newsletter and custom touches.",
        features: [
          "Everything in Professional",
          "Newsletter signup",
          "Custom animations & design",
          "Case studies page",
          "Priority support"
        ]
      })
    ],
    comparison: [
      { feature: "Custom responsive design", values: ["yes", "yes", "Premium"] },
      { feature: "Pages / sections", values: ["Single-page", "Multi-section", "Multi-section + blog"] },
      { feature: "Projects showcase", values: ["yes", "yes", "Advanced"] },
      { feature: "Blog", values: ["no", "yes", "yes"] },
      { feature: "Newsletter", values: ["no", "no", "yes"] },
      { feature: "Testimonials", values: ["no", "yes", "yes"] },
      { feature: "Admin dashboard", values: ["no", "yes", "yes"] },
      { feature: "Custom animations", values: ["no", "no", "yes"] },
      { feature: "SEO", values: ["Basic", "yes", "Advanced"] },
      { feature: "Best for", values: ["Freelancer / student", "Active creator", "Personal brand"] }
    ]
  }
];
