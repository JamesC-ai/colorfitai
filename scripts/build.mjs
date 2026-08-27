import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const siteUrl = "https://colorfit.pagecheckai.com";

const pages = [
  {
    slug: "personal-color-analysis-online",
    title: "Personal color analysis online",
    description: "Use a daylight selfie and confirmed color samples to build a private personal palette and practical shopping shortlist.",
    headline: "Run a personal color analysis in your browser.",
    intent: "People who want a useful starting palette before buying clothing, makeup, jewelry, or hair color.",
  },
  {
    slug: "seasonal-color-palette-finder",
    title: "Seasonal color palette finder",
    description: "Compare warm and cool signals, contrast, and clarity to create a working Spring, Summer, Autumn, or Winter palette.",
    headline: "Find a seasonal palette you can actually shop.",
    intent: "Shoppers who want the seasonal-color framework translated into named colors and hex references.",
  },
  {
    slug: "best-clothing-colors-for-me",
    title: "Best clothing colors for me",
    description: "Turn confirmed skin, hair, and eye color samples into a focused clothing palette and reliable neutral shortlist.",
    headline: "Choose clothing colors with a shorter, clearer list.",
    intent: "People reducing wardrobe mistakes or planning a capsule wardrobe.",
  },
  {
    slug: "warm-or-cool-undertone-photo-test",
    title: "Warm or cool undertone photo test",
    description: "Use a manually confirmed cheek sample to estimate warm, cool, or neutral color signals without uploading your photo.",
    headline: "Check warm, cool, and neutral signals from a photo.",
    intent: "Makeup and clothing shoppers who want a cautious undertone reference rather than a permanent label.",
  },
  {
    slug: "makeup-color-palette-from-selfie",
    title: "Makeup color palette from selfie",
    description: "Create blush, lip, and neutral makeup color references from a locally processed daylight selfie.",
    headline: "Build a makeup color shortlist from a daylight selfie.",
    intent: "People comparing lipstick and blush families before visiting a store or ordering samples.",
  },
  {
    slug: "lipstick-color-finder",
    title: "Lipstick color finder",
    description: "Narrow lipstick shopping to coral, rose, berry, brick, mauve, or blue-red references based on a working seasonal palette.",
    headline: "Reduce lipstick guesswork before checkout.",
    intent: "Shoppers who want color-family references, not promises about a specific product or screen rendering.",
  },
  {
    slug: "hair-color-palette-guide",
    title: "Hair color palette guide",
    description: "Translate warm, cool, soft, and clear color signals into practical hair-color reference families.",
    headline: "Bring clearer hair-color references to your consultation.",
    intent: "People preparing examples for a licensed colorist and avoiding vague requests such as simply asking for brown or blonde.",
  },
  {
    slug: "jewelry-metal-color-test",
    title: "Jewelry metal color test",
    description: "Compare yellow gold, rose gold, silver, platinum, bronze, and mixed-metal directions with a working palette.",
    headline: "Choose a jewelry metal direction without rigid rules.",
    intent: "Shoppers deciding which metal finish to test near their face in natural light.",
  },
  {
    slug: "capsule-wardrobe-color-palette",
    title: "Capsule wardrobe color palette",
    description: "Start a capsule wardrobe with reliable neutrals, accent colors, and repeatable outfit color formulas.",
    headline: "Give your capsule wardrobe a repeatable color system.",
    intent: "People who want fewer pieces to coordinate more easily.",
  },
  {
    slug: "color-analysis-photo-tips",
    title: "Color analysis photo tips",
    description: "Improve color-analysis consistency with indirect daylight, neutral surroundings, and careful manual sample placement.",
    headline: "Take a more reliable color-analysis photo.",
    intent: "Anyone comparing multiple color-analysis results or troubleshooting unstable seasonal classifications.",
  },
  {
    slug: "soft-summer-vs-clear-winter",
    title: "Soft Summer vs Clear Winter",
    description: "Use contrast and clarity signals to understand why two cool palettes can recommend very different color intensity.",
    headline: "Compare soft cool color with crisp cool contrast.",
    intent: "People whose cool undertone result sits between muted Summer references and high-contrast Winter references.",
  },
  {
    slug: "bright-spring-vs-deep-autumn",
    title: "Bright Spring vs Deep Autumn",
    description: "Use depth, clarity, and contrast to compare two warm seasonal color directions.",
    headline: "Compare lively warm color with grounded warm depth.",
    intent: "People whose warm undertone result needs a clearer decision between bright and deep color families.",
  },
  {
    slug: "eyeglass-frame-color-finder",
    title: "Eyeglass frame color finder",
    description: "Use a working personal palette to shortlist eyeglass frame colors, metals, transparency, and contrast before trying frames in person.",
    headline: "Shortlist eyeglass frame colors before your next fitting.",
    intent: "Glasses shoppers comparing neutral, colorful, metal, tortoiseshell, and translucent frame options near the face.",
  },
  {
    slug: "workwear-color-palette",
    title: "Workwear color palette",
    description: "Build a coordinated workwear palette with dependable neutrals, shirts, layers, shoes, and repeatable accent colors.",
    headline: "Give your work wardrobe a practical color system.",
    intent: "Professionals planning office, hybrid, interview, or client-facing outfits with fewer color mismatches.",
  },
  {
    slug: "wedding-guest-outfit-color-palette",
    title: "Wedding guest outfit color palette",
    description: "Create a personal shortlist for wedding guest clothing, accessories, makeup, and metal colors while respecting the event dress code.",
    headline: "Choose wedding guest colors that fit you and the dress code.",
    intent: "Wedding guests narrowing outfit colors without treating a seasonal palette as a rigid rule or ignoring host guidance.",
  },
  {
    slug: "interview-outfit-color-palette",
    title: "Interview outfit color palette",
    description: "Build a practical interview outfit color shortlist with dependable neutrals, shirt colors, accent pieces, and metal choices.",
    headline: "Choose interview colors that feel polished and practical.",
    intent: "Job seekers who want a simple color plan for interviews without turning style into a personal judgment.",
  },
  {
    slug: "travel-capsule-wardrobe-colors",
    title: "Travel capsule wardrobe colors",
    description: "Plan a travel capsule color palette with repeatable neutrals, accent colors, shoes, layers, and laundry-friendly combinations.",
    headline: "Pack fewer colors that combine more easily.",
    intent: "Travelers building a small wardrobe that still works across weather, photos, dinners, and casual days.",
  },
  {
    slug: "nail-polish-color-palette-finder",
    title: "Nail polish color palette finder",
    description: "Shortlist nail polish color families that coordinate with a working palette, jewelry metals, and wardrobe neutrals.",
    headline: "Narrow nail polish colors before buying another bottle.",
    intent: "Shoppers comparing nude, red, berry, coral, taupe, navy, and metallic polish families.",
  },
  {
    slug: "scarf-color-finder",
    title: "Scarf color finder",
    description: "Use a personal palette to choose scarf colors that sit near the face and coordinate with coats, knits, and accessories.",
    headline: "Pick scarf colors that do more work near your face.",
    intent: "Shoppers using scarves to test accent colors before committing to larger wardrobe pieces.",
  },
  {
    slug: "handbag-shoe-color-palette",
    title: "Handbag and shoe color palette",
    description: "Create a handbag and shoe color shortlist with core neutrals, accent options, metal hardware, and wardrobe fit notes.",
    headline: "Make bag and shoe colors easier to repeat.",
    intent: "Shoppers deciding which accessory colors will coordinate with the most outfits.",
  },
  {
    slug: "black-white-contrast-outfit-checker",
    title: "Black and white contrast outfit checker",
    description: "Decide whether sharp black-and-white contrast, softer charcoal, cream, navy, or taupe combinations fit a working palette better.",
    headline: "Compare sharp contrast with softer neutrals.",
    intent: "People who like black and white but want to test whether lower-contrast neutrals may be easier to wear.",
  },
  {
    slug: "closet-color-audit-checklist",
    title: "Closet color audit checklist",
    description: "Audit closet colors against a practical palette to find repeatable neutrals, lonely accent pieces, and smarter future purchases.",
    headline: "Turn a messy closet into a color map.",
    intent: "People who want to shop less randomly and reuse more of what they already own.",
  },
  {
    slug: "online-shopping-color-checklist",
    title: "Online shopping color checklist",
    description: "Use a color checklist before online checkout to compare product photos, return rules, fabric finish, lighting, and palette fit.",
    headline: "Check color risk before online checkout.",
    intent: "Online shoppers trying to reduce returns caused by screen color, lighting, fabric sheen, or vague product names.",
  },
  {
    slug: "mens-wardrobe-color-palette",
    title: "Men's wardrobe color palette",
    description: "Build a practical men's wardrobe palette with suits, shirts, knits, outerwear, shoes, accessories, and repeatable color formulas.",
    headline: "Create a men's wardrobe color system that repeats well.",
    intent: "Men shopping for office, casual, interview, or event outfits with fewer mismatched pieces.",
  },
  {
    slug: "bridesmaid-dress-color-palette",
    title: "Bridesmaid dress color palette",
    description: "Compare bridesmaid dress color families with event guidance, skin-adjacent color comfort, accessories, and photo-lighting checks.",
    headline: "Choose bridesmaid colors with palette and event context.",
    intent: "Wedding parties narrowing dress colors while respecting the couple's palette, venue, and dress-code decisions.",
  },
  {
    slug: "mother-of-bride-outfit-color-palette",
    title: "Mother of the bride outfit color palette",
    description: "Shortlist mother-of-the-bride outfit colors with event palette, personal color comfort, photos, metals, and fabric finish in mind.",
    headline: "Choose occasion colors that fit the event and your palette.",
    intent: "Wedding family members balancing personal color preferences with dress code, venue, season, and photography context.",
  },
  {
    slug: "graduation-outfit-color-palette",
    title: "Graduation outfit color palette",
    description: "Build a graduation outfit color shortlist with robe colors, photos, weather, accessories, and personal palette fit.",
    headline: "Plan graduation colors that photograph clearly.",
    intent: "Graduates and guests choosing practical colors for ceremonies, family photos, campus weather, and post-event plans.",
  },
  {
    slug: "holiday-party-outfit-color-palette",
    title: "Holiday party outfit color palette",
    description: "Create a holiday party color plan with festive accents, reliable neutrals, makeup, metals, and repeatable outfit formulas.",
    headline: "Pick holiday colors without buying one-wear pieces.",
    intent: "Shoppers planning office parties, family gatherings, winter events, and photo-heavy celebrations with fewer impulse buys.",
  },
  {
    slug: "video-call-outfit-color-palette",
    title: "Video call outfit color palette",
    description: "Choose video-call clothing colors that work with webcam lighting, background color, contrast, and a practical personal palette.",
    headline: "Make video-call colors easier on camera.",
    intent: "Remote workers, interview candidates, creators, and presenters who want camera-friendly color choices without overthinking outfits.",
  },
  {
    slug: "red-lipstick-undertone-checker",
    title: "Red lipstick undertone checker",
    description: "Compare blue-red, orange-red, brick, berry, and muted red lipstick directions against a working personal palette.",
    headline: "Shortlist red lipstick families before sampling.",
    intent: "Makeup shoppers narrowing red lipstick options while remembering that formula, opacity, lighting, and lip color change the result.",
  },
  {
    slug: "neutral-wardrobe-color-palette",
    title: "Neutral wardrobe color palette",
    description: "Choose practical wardrobe neutrals such as navy, charcoal, cream, taupe, camel, brown, black, and soft white for a personal palette.",
    headline: "Build a neutral palette that supports more outfits.",
    intent: "People who want a calmer closet foundation before adding accent colors, prints, shoes, bags, or seasonal pieces.",
  },
  {
    slug: "plus-size-outfit-color-palette",
    title: "Plus size outfit color palette",
    description: "Plan plus-size outfit color combinations with preferred silhouettes, contrast comfort, fabric finish, layering, and personal style goals.",
    headline: "Use color as a styling tool, not a body judgment.",
    intent: "Shoppers building outfits around color confidence while avoiding attractiveness, body-worth, or size-based verdicts.",
  },
  {
    slug: "maternity-outfit-color-palette",
    title: "Maternity outfit color palette",
    description: "Create a maternity color plan for changing fit needs, repeatable layers, photos, comfort, accessories, and post-pregnancy reuse.",
    headline: "Plan maternity colors around comfort and reuse.",
    intent: "Pregnant shoppers and gift buyers choosing practical outfit colors without treating color analysis as health or body advice.",
  },
  {
    slug: "thrift-shopping-color-checklist",
    title: "Thrift shopping color checklist",
    description: "Use a personal palette while thrifting to evaluate lighting, fabric wear, alterations, dye shifts, return limits, and outfit fit.",
    headline: "Thrift with a clearer color checklist.",
    intent: "Secondhand shoppers trying to make faster color decisions in inconsistent store lighting and limited-return situations.",
  },
  {
    slug: "jewelry-capsule-color-palette",
    title: "Jewelry capsule color palette",
    description: "Build a small jewelry capsule around metal direction, stones, enamel, pearls, contrast, wardrobe colors, and outfit repeatability.",
    headline: "Choose jewelry colors that repeat across outfits.",
    intent: "Shoppers deciding which metal and accent colors deserve space in a small accessory collection.",
  },
  {
    slug: "winter-coat-color-checklist",
    title: "Winter coat color checklist",
    description: "Choose winter coat colors by comparing palette fit, scarf options, shoe color, fabric texture, lint visibility, and repeat outfits.",
    headline: "Buy a winter coat color you can repeat for years.",
    intent: "Shoppers choosing a coat color that needs to work near the face, across weather, and with many existing outfits.",
  },
  {
    slug: "summer-wedding-guest-color-checklist",
    title: "Summer wedding guest color checklist",
    description: "Plan summer wedding guest colors with heat, daylight photos, dress code, fabric sheerness, accessories, and personal palette fit in mind.",
    headline: "Shortlist summer wedding colors before buying the outfit.",
    intent: "Wedding guests balancing warm-weather comfort, host guidance, outdoor lighting, and colors they are likely to wear again.",
  },
  {
    slug: "job-interview-blazer-color-checklist",
    title: "Job interview blazer color checklist",
    description: "Compare blazer colors for interviews with shirt contrast, webcam lighting, industry norms, wardrobe reuse, and a practical palette.",
    headline: "Choose an interview blazer color with fewer second guesses.",
    intent: "Job seekers deciding between navy, charcoal, black, taupe, cream, brown, or softer colors for interviews and follow-up meetings.",
  },
  {
    slug: "capsule-wardrobe-accent-color-checklist",
    title: "Capsule wardrobe accent color checklist",
    description: "Pick accent colors for a capsule wardrobe by checking outfit formulas, seasonality, accessories, makeup, and repeatable pairings.",
    headline: "Add accent colors without breaking the capsule.",
    intent: "People who already have neutrals and want one to three accent colors that coordinate instead of creating isolated pieces.",
  },
  {
    slug: "hair-color-wardrobe-checklist",
    title: "Hair color wardrobe checklist",
    description: "Review how a planned hair color may change wardrobe contrast, makeup references, metals, and near-face clothing colors.",
    headline: "Check wardrobe colors before changing hair color.",
    intent: "People preparing for a stylist consultation and wanting practical examples to test after hair color changes.",
  },
  {
    slug: "foundation-undertone-shopping-checklist",
    title: "Foundation undertone shopping checklist",
    description: "Use a cautious undertone checklist for foundation shopping that accounts for daylight, neck comparison, oxidation, coverage, and returns.",
    headline: "Shop foundation undertones with a cleaner checklist.",
    intent: "Makeup shoppers comparing warm, cool, neutral, olive, and depth signals while still swatching real formulas on skin.",
  },
  {
    slug: "shoe-and-bag-color-checklist",
    title: "Shoe and bag color checklist",
    description: "Build a shoe and bag color plan around wardrobe neutrals, hardware metals, event needs, weather, and outfit repeatability.",
    headline: "Choose shoe and bag colors that do more work.",
    intent: "Shoppers deciding which accessory colors are versatile enough before buying another pair or bag.",
  },
  {
    slug: "travel-photo-outfit-color-checklist",
    title: "Travel photo outfit color checklist",
    description: "Plan travel outfit colors for photos by checking destination backgrounds, climate, layers, shoes, laundry, and personal palette fit.",
    headline: "Pack colors that photograph well and still travel light.",
    intent: "Travelers choosing outfits for scenic photos, family trips, conferences, or destination events without overpacking.",
  },
  {
    slug: "presentation-outfit-color-checklist",
    title: "Presentation outfit color checklist",
    description: "Choose presentation outfit colors by checking stage lighting, slide background, microphone packs, camera contrast, and palette comfort.",
    headline: "Make presentation colors easier on stage and camera.",
    intent: "Speakers, teachers, founders, and creators preparing outfits for presentations, recordings, webinars, or panels.",
  },
  {
    slug: "athleisure-color-palette-checklist",
    title: "Athleisure color palette checklist",
    description: "Create an athleisure color plan with leggings, sneakers, jackets, gym lighting, fabric sheen, and everyday outfit reuse.",
    headline: "Build athleisure colors that work beyond one set.",
    intent: "Shoppers choosing activewear and casual layers that coordinate with existing sneakers, outerwear, and everyday pieces.",
  },
  {
    slug: "denim-wash-color-checklist",
    title: "Denim wash color checklist",
    description: "Compare denim washes with wardrobe contrast, shoe colors, jacket pairings, daylight photos, and repeated outfit use.",
    headline: "Choose denim washes with fewer closet mismatches.",
    intent: "Shoppers deciding between light, mid, dark, black, grey, cream, or colored denim before buying another pair.",
  },
  {
    slug: "office-capsule-color-plan",
    title: "Office capsule color plan",
    description: "Plan office capsule colors around repeatable tops, jackets, trousers, shoes, meeting lighting, and laundry cadence.",
    headline: "Build office colors that repeat without feeling stuck.",
    intent: "Professionals who want a practical color system for work outfits, hybrid meetings, and travel days.",
  },
  {
    slug: "family-photo-outfit-color-palette",
    title: "Family photo outfit color palette",
    description: "Coordinate family photo outfit colors with location, background, season, skin-facing colors, prints, and comfort.",
    headline: "Coordinate family photo colors without matching everything.",
    intent: "Families choosing outfits for portraits, holiday cards, reunions, or milestone photos while keeping each person comfortable.",
  },
  {
    slug: "concert-outfit-color-checklist",
    title: "Concert outfit color checklist",
    description: "Pick concert outfit colors with venue lighting, photos, layers, shoes, bag rules, and palette comfort in mind.",
    headline: "Plan concert colors for lights, photos, and real movement.",
    intent: "Shoppers building a concert or festival outfit that still works under changing light and practical venue constraints.",
  },
  {
    slug: "vacation-swimwear-color-checklist",
    title: "Vacation swimwear color checklist",
    description: "Shortlist swimwear colors with beach lighting, coverups, sandals, photos, fabric transparency, and personal palette fit.",
    headline: "Choose swimwear colors before the last-minute cart panic.",
    intent: "Travelers comparing swimwear, coverups, hats, and sandals while checking real fabric and return policies before buying.",
  },
  {
    slug: "handbag-hardware-metal-checklist",
    title: "Handbag hardware metal checklist",
    description: "Compare handbag hardware metals with jewelry, shoe buckles, wardrobe neutrals, occasion needs, and palette direction.",
    headline: "Match handbag hardware to the accessories you actually wear.",
    intent: "Shoppers deciding between gold, silver, gunmetal, brass, rose gold, black, or mixed hardware before buying a bag.",
  },
  {
    slug: "bridesmaid-accessory-color-checklist",
    title: "Bridesmaid accessory color checklist",
    description: "Plan bridesmaid accessories around dress color, metal finish, shoes, wrap, bouquet tones, lighting, and reuse.",
    headline: "Make bridesmaid accessory colors easier to coordinate.",
    intent: "Bridesmaids and wedding parties choosing accessories that respect the dress code and still feel wearable again.",
  },
  {
    slug: "color-analysis-before-shopping-checklist",
    title: "Color analysis before shopping checklist",
    description: "Use a pre-shopping checklist for photo quality, palette confidence, existing wardrobe gaps, budget, and real-world swatches.",
    headline: "Turn color analysis into a calmer shopping list.",
    intent: "People who have a working palette and want to avoid buying too many new colors before testing them in real life.",
  },
  {
    slug: "wardrobe-color-declutter-checklist",
    title: "Wardrobe color declutter checklist",
    description: "Review wardrobe colors by wear frequency, outfit pairings, near-face confidence, fabric condition, and donation uncertainty.",
    headline: "Declutter colors without deleting your personality.",
    intent: "People editing a closet who want practical color notes without letting a palette override personal favorites.",
  },
  {
    slug: "makeup-bag-color-audit-checklist",
    title: "Makeup bag color audit checklist",
    description: "Audit makeup colors by undertone, depth, finish, oxidation, lighting, duplicate shades, and real wear tests.",
    headline: "Check makeup colors before buying another near-duplicate.",
    intent: "Makeup shoppers comparing blush, lip, bronzer, and neutral shades while still testing real formulas on skin.",
  },
  {
    slug: "teacher-wardrobe-color-palette",
    title: "Teacher wardrobe color palette",
    description: "Plan teacher wardrobe colors around classroom lighting, repeated outfits, comfortable layers, washable fabrics, and approachability.",
    headline: "Build classroom colors that repeat comfortably.",
    intent: "Teachers choosing practical outfit colors for long days, changing room temperatures, video calls, and repeated wear.",
  },
  {
    slug: "conference-capsule-color-checklist",
    title: "Conference capsule color checklist",
    description: "Pack conference outfit colors with badges, shoes, networking photos, session rooms, layers, and repeatable mix-and-match outfits.",
    headline: "Pack conference colors that work across the whole trip.",
    intent: "Speakers, founders, employees, and attendees planning a small travel wardrobe for professional events.",
  },
  {
    slug: "date-night-color-checklist",
    title: "Date night color checklist",
    description: "Choose date night colors with lighting, comfort, existing favorites, makeup, accessories, and personal confidence in mind.",
    headline: "Choose date night colors without overthinking the whole outfit.",
    intent: "People planning an outfit for dinner, events, or casual dates while keeping personal taste ahead of rigid palette rules.",
  },
  {
    slug: "job-fair-outfit-color-checklist",
    title: "Job fair outfit color checklist",
    description: "Pick job fair outfit colors around approachability, industry expectations, comfort, resume folders, shoes, and repeated introductions.",
    headline: "Make job fair colors feel prepared and repeatable.",
    intent: "Students, recent graduates, and career changers choosing colors for recruiting events and informational interviews.",
  },
  {
    slug: "retail-uniform-color-coordination",
    title: "Retail uniform color coordination checklist",
    description: "Coordinate retail uniform colors with allowed pieces, shoes, apron or badge colors, lighting, comfort, and personal palette fit.",
    headline: "Make uniform colors work with the pieces you can choose.",
    intent: "Retail and service workers planning optional layers, shoes, accessories, or makeup around required uniform colors.",
  },
  {
    slug: "stage-performance-outfit-color-plan",
    title: "Stage performance outfit color plan",
    description: "Plan stage outfit colors around lighting, backdrop contrast, movement, microphones, group coordination, and camera visibility.",
    headline: "Choose stage colors that hold up under lighting.",
    intent: "Performers, hosts, panelists, and presenters checking outfit colors before stepping under bright or changing lights.",
  },
  {
    slug: "minimalist-wardrobe-color-ratio",
    title: "Minimalist wardrobe color ratio",
    description: "Set a minimalist wardrobe color ratio across neutrals, accents, shoes, outerwear, occasion pieces, and laundry reality.",
    headline: "Give a minimalist wardrobe enough color to stay useful.",
    intent: "People simplifying a closet who still want personality, contrast, and practical outfit variety.",
  },
  {
    slug: "seasonal-sale-color-shopping-checklist",
    title: "Seasonal sale color shopping checklist",
    description: "Review sale items by palette fit, true wardrobe gaps, return policy, fabric reality, styling options, and duplicate risk.",
    headline: "Use sale season without buying orphan colors.",
    intent: "Shoppers trying to avoid discount-driven color mistakes while still finding useful pieces.",
  },
  {
    slug: "outerwear-accessory-color-map",
    title: "Outerwear accessory color map",
    description: "Map coat, scarf, hat, glove, boot, and bag colors for cold-weather outfits that repeat without clashing.",
    headline: "Coordinate outerwear accessories before winter stacks up.",
    intent: "Shoppers and travelers planning visible cold-weather layers around a practical color system.",
  },
  {
    slug: "color-palette-after-weight-change",
    title: "Color palette after weight change checklist",
    description: "Rebuild wardrobe colors after size changes with comfort, favorites, outfit formulas, budget, and non-judgmental fit checks.",
    headline: "Revisit wardrobe colors after size changes without judgment.",
    intent: "People replacing or adjusting clothes after body changes while avoiding beauty, health, or worth assumptions.",
  },
  {
    slug: "remote-work-capsule-color-plan",
    title: "Remote work capsule color plan",
    description: "Plan remote-work wardrobe colors around video calls, comfort, repeat outfits, lighting, layers, and camera-friendly contrast.",
    headline: "Build remote-work colors that look steady on camera.",
    intent: "People who work from home and want a small set of repeatable colors for calls, focus days, and hybrid-office weeks.",
  },
  {
    slug: "vacation-capsule-color-palette",
    title: "Vacation capsule color palette",
    description: "Pack vacation colors around weather, activities, photos, laundry, shoes, swimwear, evening outfits, and repeatable combinations.",
    headline: "Pack vacation colors that mix without overpacking.",
    intent: "Travelers building a small capsule wardrobe that works across photos, dinners, day trips, and changing weather.",
  },
  {
    slug: "wedding-family-photo-color-plan",
    title: "Wedding family photo color plan",
    description: "Coordinate wedding family photo colors with dress code, venue, lighting, skin-tone variety, accessories, and comfort boundaries.",
    headline: "Coordinate wedding family photo colors without making everyone match.",
    intent: "Families choosing photo-friendly outfit colors while keeping personal comfort and the couple's dress code in view.",
  },
  {
    slug: "postpartum-wardrobe-color-checklist",
    title: "Postpartum wardrobe color checklist",
    description: "Rebuild postpartum wardrobe colors with comfort, nursing access, washable fabrics, familiar favorites, budget, and no body-worth assumptions.",
    headline: "Choose postpartum wardrobe colors with comfort first.",
    intent: "New parents refreshing clothing colors after body and schedule changes without health, beauty, or identity judgments.",
  },
  {
    slug: "silver-hair-wardrobe-color-checklist",
    title: "Silver hair wardrobe color checklist",
    description: "Review wardrobe colors after silver or gray hair changes with contrast, makeup shifts, eyewear, metals, and favorite-color preservation.",
    headline: "Update wardrobe colors when hair tone changes.",
    intent: "People with natural, dyed, or transitioning silver hair who want color options without age, attractiveness, or identity assumptions.",
  },
  {
    slug: "glasses-frame-color-wardrobe-map",
    title: "Glasses frame color wardrobe map",
    description: "Map glasses frame colors against wardrobe neutrals, jewelry metals, hair color, workwear, casual outfits, and replacement timing.",
    headline: "Choose frame colors that work with more outfits.",
    intent: "Eyeglass shoppers comparing frames as everyday accessories instead of one isolated color decision.",
  },
  {
    slug: "formal-event-color-checklist",
    title: "Formal event color checklist",
    description: "Choose formal event colors with dress code, lighting, photos, jewelry, shoes, weather, comfort, and reuse after the event.",
    headline: "Pick formal event colors you can actually wear again.",
    intent: "Guests, speakers, and hosts planning polished event outfits without treating color advice as a beauty rule.",
  },
  {
    slug: "small-closet-color-system",
    title: "Small closet color system",
    description: "Design a small closet color system around core neutrals, accents, laundry rhythm, repeat outfits, storage limits, and real lifestyle needs.",
    headline: "Make a small closet easier to combine.",
    intent: "People with limited closet space who want fewer color dead ends and more repeatable outfit formulas.",
  },
  {
    slug: "thrift-store-color-filter-checklist",
    title: "Thrift store color filter checklist",
    description: "Use color filters while thrifting around lighting, fabric wear, alterations, duplicate colors, return limits, and styling reality.",
    headline: "Thrift by color without buying maybes.",
    intent: "Secondhand shoppers trying to spot useful colors quickly while avoiding pressure, scarcity, and unrealistic alterations.",
  },
  {
    slug: "makeup-and-wardrobe-color-handoff",
    title: "Makeup and wardrobe color handoff",
    description: "Connect makeup and wardrobe colors across undertone, contrast, finish, neckline, lighting, swatch tests, and personal favorites.",
    headline: "Make makeup and outfit colors support each other.",
    intent: "People comparing lipstick, blush, eyeshadow, neckline, jewelry, and clothing colors before buying or packing.",
  },
  {
    slug: "color-analysis-photo-consistency-checklist",
    title: "Color analysis photo consistency checklist",
    description: "Compare lighting, camera processing, exposure, background reflection, filters, makeup, hair color, and sample placement before trusting a photo set.",
    headline: "Reject inconsistent color-analysis photos before choosing a palette.",
    intent: "People who look different across photos and need to pause analysis, keep only comparable captures, and verify color families with real fabric in consistent daylight rather than force a permanent season label.",
  },
  {
    slug: "color-analysis-white-balance-capture-log",
    title: "Color analysis white balance capture log",
    description: "Record device, lens, camera mode, white-balance setting, exposure, light source, time, background, and reference neutral before comparing color-analysis photos.",
    headline: "Document capture conditions before comparing skin-adjacent colors.",
    intent: "People comparing phone or camera photos who need to compare only captures made under the same documented conditions. This log does not calibrate a camera, correct a photo, recover true skin color, or prove undertone.",
  },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pageHtml(page) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(page.title)} - ColorFitAI</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <link rel="canonical" href="${siteUrl}/${page.slug}/" />
    <meta property="og:title" content="${escapeHtml(page.title)} - ColorFitAI" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:image" content="${siteUrl}/color-studio.png" />
    <link rel="stylesheet" href="/styles.css" />
    <link rel="icon" href="/favicon.svg" />
  </head>
  <body>
    <header class="topbar"><a class="brand" href="/"><span class="brand-mark">C</span><span>ColorFitAI</span></a><nav><a href="/#analyzer">Analyzer</a><a href="/support.html">Support</a></nav></header>
    <main class="legal">
      <p class="eyebrow">Private color planning</p>
      <h1>${escapeHtml(page.headline)}</h1>
      <p>${escapeHtml(page.description)}</p>
      <h2>Best fit</h2>
      <p>${escapeHtml(page.intent)}</p>
      <h2>Use the result well</h2>
      <ol>
        <li>Start with an unfiltered photo in indirect daylight.</li>
        <li>Confirm the cheek, natural hair, and iris sample points yourself.</li>
        <li>Use the output to shortlist color families, not to eliminate personal favorites.</li>
        <li>Compare the real fabric, makeup sample, or metal near your face before buying.</li>
      </ol>
      <p><a class="primary-button" href="/?utm_source=colorfitai&amp;utm_medium=owned&amp;utm_campaign=conversion&amp;utm_content=seo_${page.slug}_free_palette#analyzer">Build a free current palette</a></p>
      <h2>When a paid palette pack is worth it</h2>
      <p>Use the free current palette first. Review paid-pack boundaries in the analyzer only after the current photo, capture conditions, sample points, shopping decision, and limitations have been checked by a named person. The $49 option also needs a defined wardrobe-review scope. Skip payment if you need an appearance rating, body judgment, identity guess, professional styling, cosmetic safety advice, product fit guarantee, or guaranteed result.</p>
      <h2>Accuracy boundary</h2>
      <p>Camera white balance, screen calibration, makeup, hair dye, reflected wall color, and sample placement can change the result. ColorFitAI does not infer identity, ethnicity, health, age, or attractiveness.</p>
      <p><a href="/support.html">Support</a> · <a href="https://tools.pagecheckai.com">More PageCheckAI tools</a></p>
    </main>
  </body>
</html>`;
}

await rm("dist", { force: true, recursive: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });

for (const page of pages) {
  await mkdir(`dist/${page.slug}`, { recursive: true });
  await writeFile(`dist/${page.slug}/index.html`, pageHtml(page));
}

await writeFile("dist/robots.txt", `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
`);

const staticUrls = ["/", "/privacy.html", "/terms.html", "/support.html"];
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...pages.map((page) => `/${page.slug}/`)]
  .map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`)
  .join("\n")}
</urlset>
`,
);

console.log(`Built ColorFitAI with ${pages.length} SEO pages.`);
