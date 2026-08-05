# SDNZ Content Map — Quick Reference

How to use: just message me the **ID** and the new value, e.g.
- "change `HERO_TITLE` to '...'"
- "replace `IMG_HERO_BG` with [attached photo]"
- "update `PROJ_TARANAKI.year` to 2025"
- "swap `TEAM_MITCH.image` with [attached photo]"

Multiple at once is fine. You can also paste a screenshot and circle the bit you want changed.

---

## NAV / GLOBAL — `src/App.tsx`

| ID | Current value |
|---|---|
| `NAV_LINKS` | Home · Services · About · Projects · Careers · Contact |
| `BRAND_NAME` | Sprinkler Design NZ |
| `BRAND_TAGLINE_FOOTER` | "Leading the way in BIM-driven fire protection design and consulting across New Zealand. Decades of expertise at your service." |
| `IMG_LOGO` | `/public/logo.png` (used in navbar, projects header, maintenance page, footer) |
| `IMG_FAVICON` | `/public/favicon.png` |

---

## HERO SECTION — `src/App.tsx` (Hero component)

| ID | Current value |
|---|---|
| `HERO_LABEL` | "Trusted Fire Protection Experts · New Zealand" |
| `HERO_TITLE` | "Your trusted partner for top-notch **BIM Fire Protection** Design & Consulting." |
| `HERO_SUBTITLE` | "Unleashing the power of BIM — we ignite excellence in fire protection across New Zealand with decades of industry expertise." |
| `HERO_CTA_PRIMARY` | "Explore Our Services" → #services |
| `HERO_CTA_SECONDARY` | "View Our Work" → #projects |
| `IMG_HERO_BG` | Unsplash URL (background, opacity 10%) — replace if you want a different ambient image |

### Stats bar (4 items)
| ID | Value | Label |
|---|---|---|
| `STAT_1` | `20+` | Years Industry Experience |
| `STAT_2` | `500+` | Projects Completed |
| `STAT_3` | `100%` | NZ Code Compliance |
| `STAT_4` | `8` | Landmark Projects |

---

## SERVICES SECTION — `src/App.tsx` (SERVICES array)

| ID | Title | Short description |
|---|---|---|
| `SVC1` | Fire Protection Consultant | Independent, end-to-end fire protection consultancy from preliminary concept to detailed design. |
| `SVC2` | BIM Fire Protection Design & Coordination | Precise 3D modelling and coordination using Autodesk Revit, BIM360 & Revizto. |
| `SVC3` | Fire Protection Design for Construction | Full lifecycle design from concept through to final construction documentation. |
| `SVC4` | Special Hazards | Bespoke fire suppression solutions for high-risk and complex environments. |
| `SVC5` | 3D Point Cloud Scanning | Highly detailed 3D representations of existing buildings using laser scanning technology. |
| `SVC6` | BIM Services Management & Coordination | Independent BIM management working with clients and contractors to establish BIM Execution Plans. |

Each service has these editable fields:
- `.title` — heading
- `.shortDesc` — card preview text
- `.detail` — expanded paragraph (shown when card opens)
- `.tags` — array of pill labels
- `.icon` (lucide icon name)
- `.accentColor` (hex)

### Section heading
| ID | Current value |
|---|---|
| `SERVICES_LABEL` | "What We Do" |
| `SERVICES_HEADING` | "Comprehensive Fire Protection Solutions" |
| `SERVICES_SUBHEADING` | "From initial concept to final construction documentation — leveraging the very best in BIM technology to deliver precise, compliant fire protection across New Zealand." |

---

## ABOUT SECTION — `src/App.tsx` (About component)

| ID | Current value |
|---|---|
| `ABOUT_LABEL` | "About Us" |
| `ABOUT_HEADING` | "Fire Protection Design **Consultancy**" |
| `ABOUT_SUBHEADING` | "Sprinkler Design NZ is New Zealand's leading independent fire protection design consultancy, combining deep trade knowledge with the latest BIM technology." |
| `ABOUT_BODY_HEADING` | "Your Reliable Partner for Exceptional BIM Fire Protection Design" |
| `ABOUT_BODY_PARA` | "With decades of industry expertise, Sprinkler Design NZ provides comprehensive solutions including professional consulting, BIM coordination, and construction documentation..." |
| `ABOUT_BADGE_VALUE` | `30+` |
| `ABOUT_BADGE_LABEL` | "Years Expertise" |
| `IMG_ABOUT` | `/public/images/pump room.jfif` |

### Bullet list (6 items)
| ID | Text |
|---|---|
| `ABOUT_BULLET_1` | High-quality, efficient fire protection services |
| `ABOUT_BULLET_2` | Cost-effective solutions tailored to your unique needs |
| `ABOUT_BULLET_3` | Decades of deep industry knowledge across all facets |
| `ABOUT_BULLET_4` | Advanced BIM coordination & clash detection using Revit |
| `ABOUT_BULLET_5` | Independent consultancy — no conflicts of interest |
| `ABOUT_BULLET_6` | PS1 authorship and PS4 construction monitoring |

### Team
| ID | Name | Role | Image |
|---|---|---|---|
| `TEAM_MITCH` | Mitch Buckley | Director & Principal Fire Protection Designer | `/public/team-mitch.png` |
| `TEAM_JOSEF` | Josef Thompson-Smith | Senior Fire Protection Designer & BIM Manager | `/public/team-josef.png` |
| `TEAM_LAURA` | Laura Cullen | Fire Protection Designer | `/public/team-laura.png` |

Each team member has: `.name`, `.role`, `.bio`, `.image`

### Software pills (in order)
`SOFTWARE` array: Autodesk Revit · BIM360 · Revizto · MicroBIM Fire · Navisworks · FireLogic

---

## PROJECTS — `src/data/projects.ts`

| ID | Title | Year | Location | Image |
|---|---|---|---|---|
| `PROJ_TARANAKI` | Taranaki Base Hospital – Stage Two | 2024 | New Plymouth | `/public/images/taranakihospital.jpg` |
| `PROJ_TEKAHA` | Te Kaha – Canterbury Multi-Use Arena | 2024 | Christchurch | `/public/images/ONE NZ Stadium.png` |
| `PROJ_LIVINGPA` | The Living Pā | 2023 | Auckland | `/public/images/thelivingpa.jpg` |
| `PROJ_KMART` | Project Punga – Kmart Rūrākura | 2023 | Hamilton | `/public/images/kmartpunga.png` |
| `PROJ_CROSSING` | The Crossing – Stage 2A & 2B | 2022 | Christchurch | `/public/images/thecrossing.png` |
| `PROJ_WAIKERIA` | Waikeria Prison Development | 2022 | Waikeria | `/public/images/Waikeria-6.jpg` |
| `PROJ_WHANGAREI` | Whangārei Civic Centre | 2023 | Whangārei | `/public/images/whangareicivi.png` |
| `PROJ_AALTO` | AALTO | 2022 | Auckland | `/public/images/aalto.jpg` |

Each project has: `.slug`, `.title`, `.category`, `.year`, `.location`, `.description`, `.shortDesc`, `.image`, `.highlights[]`, `.services[]`, `.published`

Examples:
- "change `PROJ_TARANAKI.title` to '...'"
- "replace `PROJ_KMART.image` with [attached]"
- "set `PROJ_AALTO.published` to false" (hides it)
- "add a new project called X with image Y..."

### Projects page header — `src/pages/ProjectsPage.tsx`
| ID | Current value |
|---|---|
| `PROJECTS_PAGE_TITLE` | "Project Portfolio" |
| `PROJECTS_PAGE_INTRO` | "From landmark hospitals to major infrastructure — here's a selection of the projects that showcase our expertise in BIM fire protection design across New Zealand." |
| `PROJECTS_PAGE_STAT_1` | 500+ Projects completed |
| `PROJECTS_PAGE_STAT_2` | 20+ Years experience |
| `PROJECTS_PAGE_STAT_3` | 100% NZ code compliance |
| `PROJECTS_PAGE_CTA_HEADING` | "Ready to start your **next project?**" |
| `PROJECTS_PAGE_CTA_BODY` | "Get in touch with our team for an obligation-free consultation on your fire protection design needs." |

---

## TESTIMONIALS — `src/App.tsx` (TESTIMONIALS array)

| ID | Author | Company |
|---|---|---|
| `TESTIMONIAL_1` | Senior Project Manager | Major NZ Construction Contractor — Healthcare Sector |
| `TESTIMONIAL_2` | Project Director | Auckland Commercial Development — 2024 |
| `TESTIMONIAL_3` | Mechanical & Fire Services Contractor | Nationwide M&E Subcontractor |

Each has: `.quote`, `.author`, `.company`, `.initials`

### Section heading
| ID | Current value |
|---|---|
| `TESTIMONIALS_LABEL` | "Client Feedback" |
| `TESTIMONIALS_HEADING` | "Trusted by **New Zealand's Best**" |
| `TESTIMONIALS_SUBHEADING` | "What project managers, directors, and contractors say about working with us." |

---

## CAREERS — `src/App.tsx` (Careers component)

| ID | Current value |
|---|---|
| `CAREERS_LABEL` | "Join Our Team" |
| `CAREERS_HEADING` | "Propel Your **Career**" |
| `CAREERS_PARA_1` | "At Sprinkler Design NZ, we combine extensive expertise with a genuine care for your growth..." |
| `CAREERS_PARA_2` | "We are currently looking for passionate **Sprinkler Designers**..." |
| `CAREERS_BENEFIT_1` | Industry Leaders — "Work on landmark NZ projects including hospitals, arenas, prisons, and civic centres." |
| `CAREERS_BENEFIT_2` | Cutting-Edge Tech — "Use the latest BIM tools — Revit, BIM360, Revizto, and point cloud scanning." |
| `CAREERS_BENEFIT_3` | Great Team Culture — "A tight-knit, experienced team that values learning, mentorship, and work-life balance." |
| `CAREERS_CTA` | "Apply Now" → mailto:info@sprinklerdesign.co.nz |

---

## FAQ — `src/App.tsx` (FAQS array)

| ID | Question |
|---|---|
| `FAQ_1` | What does a PS1 author do in fire protection? |
| `FAQ_2` | What is BIM coordination for fire protection? |
| `FAQ_3` | Do you design residential fire sprinkler systems? |
| `FAQ_4` | What areas of New Zealand do you service? |
| `FAQ_5` | What is 3D point cloud scanning and when is it useful? |

Each has: `.question`, `.answer`

---

## CONTACT — `src/App.tsx` (Contact component)

| ID | Current value |
|---|---|
| `CONTACT_LABEL` | "Get In Touch" |
| `CONTACT_HEADING` | "Let's Discuss Your **Next Project**" |
| `CONTACT_SUBHEADING` | "Ready to elevate your fire protection design? Get in touch with our experts today for an obligation-free consultation." |
| `CONTACT_PHONE` | 0800 113 996 |
| `CONTACT_EMAIL` | info@sprinklerdesign.co.nz |
| `CONTACT_LOCATION` | "Auckland · Wellington · Christchurch · Nationwide" |
| `CONTACT_FOOTER_NOTE` | "We typically respond within 1 business day." |

---

## FOOTER — `src/App.tsx` (Footer component)

| ID | Current value |
|---|---|
| `FOOTER_TAGLINE` | "Leading the way in BIM-driven fire protection design and consulting across New Zealand. Decades of expertise at your service." |
| `FOOTER_PHONE` | 0800 113 996 |
| `FOOTER_EMAIL` | info@sprinklerdesign.co.nz |
| `FOOTER_LOCATION` | "New Zealand — Nationwide" |
| `FOOTER_SERVICES_LIST` | Fire Protection Consulting · BIM Design & Coordination · Construction Docs · 3D Point Cloud Scanning · Special Hazards · BIM Management |
| `FOOTER_LEGAL` | "© {year} Sprinkler Design Ltd. All rights reserved." |
| `FOOTER_LINK_PRIVACY` | https://www.sprinklerdesign.co.nz/privacy-policy |
| `FOOTER_LINK_TERMS` | https://www.sprinklerdesign.co.nz/terms-of-use |

---

## ALL IMAGES — quick swap reference

| ID | Path | Used in |
|---|---|---|
| `IMG_LOGO` | `/public/logo.png` | Navbar, Projects page, Maintenance page |
| `IMG_FAVICON` | `/public/favicon.png` | Browser tab |
| `IMG_HERO_BG` | Unsplash URL (in App.tsx Hero) | Hero background |
| `IMG_ABOUT` | `/public/images/pump room.jfif` | About section |
| `IMG_TEAM_MITCH` | `/public/team-mitch.png` | Team card |
| `IMG_TEAM_JOSEF` | `/public/team-josef.png` | Team card |
| `IMG_TEAM_LAURA` | `/public/team-laura.png` | Team card |
| `IMG_PROJ_TARANAKI` | `/public/images/taranakihospital.jpg` | Taranaki project |
| `IMG_PROJ_TEKAHA` | `/public/images/ONE NZ Stadium.png` | Te Kaha project |
| `IMG_PROJ_LIVINGPA` | `/public/images/thelivingpa.jpg` | Living Pā project |
| `IMG_PROJ_KMART` | `/public/images/kmartpunga.png` | Kmart project |
| `IMG_PROJ_CROSSING` | `/public/images/thecrossing.png` | The Crossing project |
| `IMG_PROJ_WAIKERIA` | `/public/images/Waikeria-6.jpg` | Waikeria project |
| `IMG_PROJ_WHANGAREI` | `/public/images/whangareicivi.png` | Whangārei project |
| `IMG_PROJ_AALTO` | `/public/images/aalto.jpg` | AALTO project |

To replace any image: drop the new file into the chat (or attach to a message) and tell me which `IMG_*` to swap. I'll save it to the right folder and update the reference.

---

## MAINTENANCE PAGE (when site is in upgrade mode) — `src/pages/MaintenancePage.tsx`

| ID | Current value |
|---|---|
| `MAINT_LABEL` | "System Upgrade" |
| `MAINT_HEADING` | "We're building something **better.**" |
| `MAINT_BODY` | "Sprinkler Design NZ is currently undergoing a planned system upgrade..." |
| `MAINT_STATUS` | "Under Construction" |
| `MAINT_FOOTER` | "Thank you for your patience." |

---

## How to request changes — examples

```
change HERO_TITLE to "BIM Fire Protection Design You Can Trust"
update CONTACT_PHONE to 09 555 1234
replace IMG_TEAM_MITCH with [attached]
shorten TEAM_LAURA.bio to two sentences
remove SVC4
add a new FAQ: "Do you do international projects? — No, NZ only."
hide PROJ_AALTO
add new project: title "Auckland Tower", year 2025, location Auckland, image [attached]
```

That's it — just point at the IDs and tell me what you want.
