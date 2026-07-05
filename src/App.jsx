import React, { useEffect, useMemo, useRef, useState } from "react";

/* =====================================================================
   POINT-O-MATIC v2 — House Cup point logger
   Banner–University Medical Center Tucson · Internal Medicine
   Frontend: Vite + React (this file is the whole app)
   Backend: Google Apps Script web app (Code.gs v2) + Google Sheet
   ===================================================================== */

const ADMIN_EMAIL = "uaztucsonchiefs@gmail.com";
const WEBMASTER_EMAIL = "nathantwalton@arizona.edu";
const GOOGLE_EVIDENCE_FOLDER_URL = "https://drive.google.com/drive/folders/15zhX3e1Hf4ExWgkwJK6gjevOggPO8MG8?usp=drive_link";

// Paste your deployed Google Apps Script Web App /exec URL here after deployment.
const APPS_SCRIPT_WEB_APP_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_APPS_SCRIPT_WEB_APP_URL) ||
  "https://script.google.com/macros/s/AKfycbz7ZQ1posPyy-_exlDJgCtbe-NG4wLDMTB2PdhBmXOfJR0xQB01RpZ2utkVsovlhPdr/exec";

const HOUSES = ["Catalina", "Rincon", "Santa Rita", "Tortolita", "Tucson"];

const HOUSE_COLORS = {
  Catalina: "#5B8DEF",
  Rincon: "#E8590C",
  "Santa Rita": "#2F9E44",
  Tortolita: "#F59F00",
  Tucson: "#D6336C",
};

// Front-end chief gatekeeping only. Server re-checks the pass on chief actions.
const CHIEF_USERS = [
  { name: "Nate", password: "wootwoot1!" },
  { name: "Rosie", password: "wootwoot1!" },
  { name: "Amrutha", password: "wootwoot1!" },
  { name: "Will", password: "wootwoot1!" },
  { name: "Johnny", password: "wootwoot1!" },
];

// Current fallback roster. Future edits should live in the Google Sheet Team tab.
const ROSTER = [
  { name: "Nate Walton", house: "Catalina", role: "Chief", email: "nathantwalton@arizona.edu" },
  { name: "Amrutha Doniparthi", house: "Rincon", role: "Chief", email: "amruthad39@arizona.edu" },
  { name: "Will Waidelich", house: "Santa Rita", role: "Chief", email: "wwaidelich@arizona.edu" },
  { name: "Johnny Trinh", house: "Tortolita", role: "Chief", email: "johnnyminhtrinh@arizona.edu" },
  { name: "Rosie Turk", house: "Tucson", role: "Chief", email: "rosemarieturk@arizona.edu" },
  { name: "Laura Meinke", house: "All", role: "Independent Adjudicator", lowestHouseCredit: true },
  { name: "Mattia Walter", house: "Catalina", role: "PGY3", email: "mattiawalter@arizona.edu" },
  { name: "David Hendrix", house: "Rincon", role: "PGY3", email: "hendrixd1@arizona.edu" },
  { name: "Dwani Patel", house: "Santa Rita", role: "PGY3", email: "dwanip@arizona.edu" },
  { name: "Monica Angeletti", house: "Tortolita", role: "PGY3", email: "monicaangeletti@arizona.edu" },
  { name: "Jared Stillman", house: "Tucson", role: "PGY3", email: "jmstillman@arizona.edu" },
  { name: "Celeste Gracey", house: "Catalina", role: "PGY3", email: "celestegracey@arizona.edu" },
  { name: "Kellie Jeong", house: "Rincon", role: "PGY3", email: "kelliejeong@arizona.edu" },
  { name: "Matthew Lansman", house: "Santa Rita", role: "PGY3", email: "mlansman@arizona.edu" },
  { name: "Nicholas Genz", house: "Tortolita", role: "PGY3", email: "ngenz@arizona.edu" },
  { name: "Swetha Vennelaganti", house: "Tucson", role: "PGY3", email: "svennelaganti@arizona.edu" },
  { name: "Robert Sumner", house: "Catalina", role: "PGY3", email: "rsumner@arizona.edu" },
  { name: "Costa Dalis", house: "Rincon", role: "PGY2", email: "cdalis@arizona.edu" },
  { name: "Kaitlyn Baber", house: "Santa Rita", role: "PGY3", email: "kbaber@arizona.edu" },
  { name: "Jesse Ritter", house: "Tortolita", role: "PGY3", email: "jritter@arizona.edu" },
  { name: "Faith Kim", house: "Tucson", role: "PGY2", email: "faithkim@arizona.edu" },
  { name: "Tim Yu", house: "Catalina", role: "PGY2", email: "timyu456@arizona.edu" },
  { name: "Levi Cohen", house: "Rincon", role: "PGY1", email: "levicohen@arizona.edu" },
  { name: "Kathryn Pulling", house: "Santa Rita", role: "PGY3", email: "kpulling@arizona.edu" },
  { name: "Swathi Somisetty", house: "Tortolita", role: "PGY3", email: "swathisomisetty@arizona.edu" },
  { name: "Ryan Schmidt", house: "Tucson", role: "PGY2", email: "ryanschmidt@arizona.edu" },
  { name: "Justin Le", house: "Catalina", role: "PGY2", email: "justinle@arizona.edu" },
  { name: "Dimitrios Filloglou", house: "Rincon", role: "PGY1", email: "dfilioglou98@arizona.edu" },
  { name: "Adrianna Diviero", house: "Santa Rita", role: "PGY2", email: "adiviero@arizona.edu" },
  { name: "Grace Speer", house: "Tortolita", role: "PGY2", email: "gracespeer@arizona.edu" },
  { name: "Frederick Pan", house: "Tucson", role: "PGY1", email: "fredpan@arizona.edu" },
  { name: "Isabella Campos Aguiar", house: "Catalina", role: "PGY1", email: "isabellacaguiar@arizona.edu" },
  { name: "Shaik Firdhos", house: "Rincon", role: "PGY1", email: "firdhos@arizona.edu" },
  { name: "Rami Khoshaba", house: "Santa Rita", role: "PGY1", email: "rkhoshaba@arizona.edu" },
  { name: "Megan Kohn", house: "Tortolita", role: "PGY2", email: "mkohn3@arizona.edu" },
  { name: "Emily Ploom", house: "Tucson", role: "PGY1", email: "emilyploom@arizona.edu" },
  { name: "Alexander Candel", house: "Catalina", role: "PGY1", email: "acandel@arizona.edu" },
  { name: "Alousius Fombang", house: "Rincon", role: "PGY1", email: "asfombang@arizona.edu" },
  { name: "Henry Lang", house: "Santa Rita", role: "PGY1", email: "henrylang@arizona.edu" },
  { name: "Kenneth Silvestro", house: "Tortolita", role: "PGY2", email: "kennysilvestro@arizona.edu" },
  { name: "Cole Sander", house: "Tucson", role: "PGY1", email: "colesander@arizona.edu" },
  { name: "Rishab Srivastava", house: "Catalina", role: "PGY3", email: "rishabsrivastava@arizona.edu" },
  { name: "Nassim Idouraine", house: "Rincon", role: "PGY1", email: "nidouraine@arizona.edu" },
  { name: "Bryce Little", house: "Santa Rita", role: "PGY1", email: "brycelittle@arizona.edu" },
  { name: "Duy Nguyen", house: "Tortolita", role: "PGY1", email: "duymnguyen@arizona.edu" },
  { name: "Arpan Sharma", house: "Tucson", role: "PGY1", email: "arpans44@arizona.edu" },
  { name: "Faissal Stipho", house: "Catalina", role: "PGY3", email: "fstipho@arizona.edu" },
  { name: "Kalvin Thomas", house: "Rincon", role: "PGY3", email: "kalvinethomas@arizona.edu" },
  { name: "Ajdin Ekic", house: "Santa Rita", role: "PGY3", email: "aekic@arizona.edu" },
  { name: "Mathew Thomas", house: "Tortolita", role: "PGY3", email: "matjthomas95@arizona.edu" },
  { name: "Drew Rasmussen", house: "Tucson", role: "PGY3", email: "dnrasmussen@arizona.edu" },
  { name: "Shenar Dinkha", house: "Catalina", role: "PGY3", email: "sdinkha@arizona.edu" },
  { name: "Matthew Ward", house: "Rincon", role: "PGY3", email: "mbward@arizona.edu" },
  { name: "Dustin Parsons", house: "Santa Rita", role: "PGY3", email: "dustinparsons@arizona.edu" },
  { name: "Marlee Panther", house: "Tortolita", role: "PGY3", email: "marleepanther@arizona.edu" },
  { name: "Danielle Bailey", house: "Tucson", role: "PGY3", email: "daniellebailey@arizona.edu" },
  { name: "Asael Nunez", house: "Catalina", role: "PGY3", email: "asaelnunez@arizona.edu" },
  { name: "William Matloff", house: "Rincon", role: "PGY3", email: "wmatloff@arizona.edu" },
  { name: "Ricardo Reyes", house: "Santa Rita", role: "PGY2", email: "rreyes014@arizona.edu" },
  { name: "Christian Avalos", house: "Tortolita", role: "PGY3", email: "avalosc@arizona.edu" },
  { name: "Ryan Weyker", house: "Tucson", role: "PGY3", email: "rweyker@arizona.edu" },
  { name: "Spencer Chee", house: "Catalina", role: "PGY2", email: "spencerchee@arizona.edu" },
  { name: "Sydney Lovins", house: "Rincon", role: "PGY2", email: "sydneylovins@arizona.edu" },
  { name: "Christopher Sallurday", house: "Santa Rita", role: "PGY2", email: "csallurday@arizona.edu" },
  { name: "Eduardo Garcia Licerio", house: "Tortolita", role: "PGY3", email: "eduardogarcia@arizona.edu" },
  { name: "Tammy Zamaitis", house: "Tucson", role: "PGY3", email: "tzamaitis@arizona.edu" },
  { name: "Laura Tran", house: "Catalina", role: "PGY2", email: "lauratran@arizona.edu" },
  { name: "Gowtham Anche", house: "Rincon", role: "PGY2", email: "gowthamanche@arizona.edu" },
  { name: "Gagandeep Gill", house: "Santa Rita", role: "PGY2", email: "gagan@arizona.edu" },
  { name: "Emily Tishkoff", house: "Tortolita", role: "PGY3", email: "emilytishkoff@arizona.edu" },
  { name: "Mujtaba Shah", house: "Tucson", role: "PGY2", email: "mujtabashah@arizona.edu" },
  { name: "Joy Eskandar", house: "Catalina", role: "PGY2", email: "eskandarj@arizona.edu" },
  { name: "Andres Sanchez", house: "Rincon", role: "PGY2", email: "andresdsanchez@arizona.edu" },
  { name: "Brett Martin", house: "Santa Rita", role: "PGY2", email: "bmartin13@arizona.edu" },
  { name: "Tolulope Popoola", house: "Tortolita", role: "PGY3", email: "tpopoola@arizona.edu" },
  { name: "Nellie Toliver", house: "Tucson", role: "PGY2", email: "nltoliver@arizona.edu" },
  { name: "Emily Adamson", house: "Catalina", role: "PGY2", email: "eadamson@arizona.edu" },
  { name: "Benjamin Maglajac", house: "Rincon", role: "PGY2", email: "maglajac@arizona.edu" },
  { name: "Esther Cheng", house: "Santa Rita", role: "PGY2", email: "esthercheng@arizona.edu" },
  { name: "Jessica Kitsen", house: "Tortolita", role: "PGY3", email: "jkitsen@arizona.edu" },
  { name: "Rachel Rosow", house: "Tucson", role: "PGY2", email: "rrosow@arizona.edu" },
  { name: "Ho Hyun Lee", house: "Catalina", role: "PGY1", email: "hohyunlee@arizona.edu" },
  { name: "Srijit Paul", house: "Rincon", role: "PGY1", email: "srijitpaul@arizona.edu" },
  { name: "Mohamad Al-Mula Hwaish", house: "Santa Rita", role: "PGY2", email: "mohamadakeel@arizona.edu" },
  { name: "Noorhan Monther", house: "Tortolita", role: "PGY2", email: "nmonther@arizona.edu" },
  { name: "Nina Maitra", house: "Tucson", role: "PGY2", email: "ninamaitra@arizona.edu" },
  { name: "Suzette Lopez Valenzuela", house: "Catalina", role: "PGY1", email: "suzettelopez@arizona.edu" },
  { name: "Alex Wang", house: "Rincon", role: "PGY1", email: "awang41@arizona.edu" },
  { name: "Nicole Price", house: "Santa Rita", role: "PGY2", email: "nprice1@arizona.edu" },
  { name: "Isaac Zarif", house: "Tortolita", role: "PGY1", email: "izarif@arizona.edu" },
  { name: "Shawn Wang", house: "Tucson", role: "PGY2", email: "shawn5299@arizona.edu" },
  { name: "Jesse Coy", house: "Catalina", role: "PGY1", email: "jessecoy@arizona.edu" },
  { name: "Kent Lawrence", house: "Rincon", role: "PGY1", email: "alexlawrence@arizona.edu" },
  { name: "Tyler Hill", house: "Santa Rita", role: "PGY1", email: "tylerhill@arizona.edu" },
  { name: "Nandini Sodhi", house: "Tortolita", role: "PGY1", email: "nandinisodhi@arizona.edu" },
  { name: "Ethan Renfrew", house: "Tucson", role: "PGY2", email: "ethanrenfrew@arizona.edu" },
  { name: "Cassandra Everly", house: "Catalina", role: "PGY3", email: "ceverly@arizona.edu" },
  { name: "Myles Bosompem", house: "Rincon", role: "PGY1", email: "bosompem@arizona.edu" },
  { name: "Mariah Black", house: "Santa Rita", role: "PGY1", email: "mariahblack@arizona.edu" },
  { name: "Jasmine Coatley-Thomas", house: "Tortolita", role: "PGY1", email: "coatleythomas@arizona.edu" },
  { name: "D'Andre Gomez", house: "Tucson", role: "PGY1", email: "dmgomez@arizona.edu" },
  { name: "Adam Western", house: "Catalina", role: "PGY2", email: "awestern@arizona.edu" },
  { name: "Sarah Busch", house: "Rincon", role: "PGY2", email: "sarahbusch@arizona.edu" },
  { name: "Shreeya Agrawal", house: "Santa Rita", role: "PGY2", email: "shreeyaagrawal@arizona.edu" },
  { name: "Jackie Maltagliati", house: "Tortolita", role: "PGY3", email: "jackiehu@arizona.edu" },
  { name: "Nathan Giauque", house: "Tucson", role: "PGY3", email: "ngiauque@arizona.edu" },
  { name: "Basem Al-Tarshan", house: "Catalina", role: "PGY1", email: "baltarshan@arizona.edu" },
  { name: "Michael Palomares", house: "Rincon", role: "PGY2", email: "mpalomares@arizona.edu" },
  { name: "Luca Bertozzi", house: "Santa Rita", role: "PGY2", email: "labertozzi@arizona.edu" },
  { name: "Hyun Kim", house: "Tortolita", role: "PGY2", email: "kihyun@arizona.edu" },
  { name: "Khaja Siddiqui", house: "Tucson", role: "PGY2", email: "ksiddiqui@arizona.edu" },
  { name: "Sara Castaneda", house: "Catalina", role: "PGY1", email: "saravalencia@arizona.edu" },
  { name: "Jason Chen", house: "Rincon", role: "PGY1", email: "jasonlchen@arizona.edu" },
  { name: "Joey Ghotmi", house: "Santa Rita", role: "PGY1", email: "joeyghotmi@arizona.edu" },
  { name: "Angela Monetathchi", house: "Tortolita", role: "PGY1", email: "amonetathchi@arizona.edu" },
  { name: "Brielle Tobin", house: "Tucson", role: "PGY1", email: "brielletobin@arizona.edu" },
  { name: "Amanda Gong", house: "Catalina", role: "PGY1", email: "agong3@arizona.edu" },
  { name: "Soojung Choi", house: "Rincon", role: "PGY1", email: "soojungchoi@arizona.edu" },
  { name: "Kassandra Mastras", house: "Santa Rita", role: "PGY1", email: "kmastras@arizona.edu" },
  { name: "Joshua Nay", house: "Tortolita", role: "PGY1", email: "jnay@arizona.edu" },
  { name: "Shana Zadron", house: "Tucson", role: "PGY1", email: "shanazadron@arizona.edu" },
  { name: "Paige Awtrey", house: "Catalina", role: "PGY1", email: "pawtrey@arizona.edu" },
  { name: "Milan Hirpara", house: "Rincon", role: "PGY1", email: "milhirpara@arizona.edu" },
  { name: "Francine Holguin", house: "Santa Rita", role: "PGY1", email: "frholguin@arizona.edu" },
  { name: "Jocelyn Liu", house: "Tortolita", role: "PGY1", email: "jocelynliu@arizona.edu" },
  { name: "Isam Allanouf", house: "Tucson", role: "PGY1", email: "isamalannouf@arizona.edu" },
  { name: "Riley Huffman", house: "Catalina", role: "Resident" },
  { name: "Ryan Hakim", house: "Rincon", role: "PGY1", email: "ryanhakim@arizona.edu" },
  { name: "Rambod Meshgi", house: "Santa Rita", role: "PGY1", email: "rmeshgi@arizona.edu" },
  { name: "Ryan Waggoner", house: "Tortolita", role: "PGY1", email: "rwaggoner@arizona.edu" },
  { name: "Laura Zelis", house: "Tucson", role: "PGY1" },
  { name: "Samuel Stewart", house: "Catalina", role: "Resident" },
  { name: "Alexander Kim", house: "Rincon", role: "Resident" },
  { name: "Lucas Lane", house: "Santa Rita", role: "Resident" },
  { name: "Christina Lim", house: "Tortolita", role: "Resident" },
  { name: "Estevan Sandoval", house: "Tucson", role: "Resident" },
  { name: "Anthony Witten", house: "Catalina", role: "PD_APD" },
  { name: "Eric Brucks", house: "Rincon", role: "PD_APD" },
  { name: "Joao Paulo Ferreira", house: "Santa Rita", role: "PD_APD" },
  { name: "Rajesh Kotagiri", house: "Tortolita", role: "PD_APD" },
  { name: "Indu Partha", house: "Tucson", role: "PD_APD" },
  { name: "Bujji Ainapurapu", house: "Catalina", role: "PD_APD" },
  { name: "Joshua Malo", house: "Rincon", role: "PD_APD" },
  { name: "Ryan Wong", house: "Santa Rita", role: "PD_APD" },
  { name: "Dalia Mikhail", house: "Tortolita", role: "PD_APD" },
  { name: "Amy Sussman", house: "Tucson", role: "PD_APD" },
  { name: "Maria Longoria", house: "Catalina", role: "Program Staff" },
  { name: "Jazmine Koli", house: "Rincon", role: "Program Staff" },
  { name: "Elizabeth Cazesuz", house: "Santa Rita", role: "Program Staff" },
  { name: "Keanna Encinas", house: "Tortolita", role: "Program Staff" },
  { name: "Breanna Sherrow-Serrano", house: "Tucson", role: "Program Staff" }
];

/* ------------------------- Activities ------------------------- */

const ACTIVITIES = [
  {
    id: "group_activity",
    label: "Group hang",
    points: 2,
    icon: "🤝",
    blurb: "Dinner, coffee, trivia night, game night. 2+ people.",
  },
  {
    id: "group_exercise",
    label: "Group exercise",
    points: 2,
    icon: "🏃",
    blurb: "Hike, bike, climb, gym, yoga, pickleball. 2+ people.",
  },
  {
    id: "academic",
    label: "Academic flex",
    points: 3,
    icon: "🧠",
    blurb: "Journal club, teaching, abstract, QI, research.",
  },
  {
    id: "wellness_event",
    label: "Wellness / community",
    points: 3,
    icon: "💚",
    blurb: "Generic wellness or service: Shubitz/CUP shift, group self-care, community engagement, service project, or other wholesome human activity.",
    requiresNote: true,
  },
  {
    id: "wellness_challenge",
    label: "Monthly wellness quest",
    points: 5,
    icon: "🌵",
    blurb: "This month's official wellness challenge.",
    challenge: "wellness",
  },
  {
    id: "photo_challenge",
    label: "Monthly photo quest",
    points: 3,
    icon: "📸",
    blurb: "This month's official photo challenge.",
    challenge: "photo",
  },
  {
    id: "optional_quest",
    label: "Optional quest / bounty",
    points: 5,
    icon: "🎯",
    blurb: "Chief-posted optional wellness/photo quest, bounty, or one-off side mission. Worth 5 points unless chiefs say otherwise.",
    requiresNote: true,
  },
  {
    id: "big_challenge",
    label: "Big Tucson quest",
    points: 5,
    icon: "🏔️",
    blurb: "Summits, Loop epics, weird Tucson side quests.",
  },
  {
    id: "points_request",
    label: "Make a case",
    points: 1,
    icon: "📝",
    blurb: "Low-proof ask. Request 1–10 pts, explanation required, photo optional.",
    lowProof: true,
  },
  {
    id: "allstar",
    label: "IM All-Star shout-out",
    points: 2,
    icon: "⭐",
    blurb: "Nominate someone who crushed it. The submitter earns 2 pts; the nominee gets the glory. Reason required.",
  },
];

const BIG_QUESTS = [
  { label: "A Mountain summit", points: 5 },
  { label: "The Loop ride/walk epic", points: 5 },
  { label: "Sabino sunrise crew", points: 5 },
  { label: "Sonoran hot dog + group walk", points: 5 },
  { label: "Mission San Xavier reflective visit", points: 5 },
  { label: "Wasson Peak summit", points: 6 },
  { label: "Mt. Lemmon / Ski Valley pilgrimage", points: 6 },
  { label: "Mt. Wrightson summit", points: 7 },
  { label: "Mica Mountain madness", points: 8 },
  { label: "Custom big Tucson side quest", points: 5 },
];

// Shown until the live challenges load from the Sheet (chiefs rotate them in the Chief Lair).
const FALLBACK_CHALLENGES = {
  wellness: {
    title: "Motto Motto Medicine — house mottos + meet your interns",
    points: 5,
    endDate: "",
    note: "Proof: House motto/logo photo + photo of something fun with interns, inside or outside the hospital · Kick off the year: build house identity and adopt your interns early.",
  },
  photo: {
    title: "House crest reveal: motto/logo + at least 3 house humans",
    points: 3,
    endDate: "",
    note: "Proof: Photo required · Recovered legacy launch challenge — pairs with Motto Motto Medicine.",
  },
};

// Local Challenge Bank — loaded from the chief-provided master list.
// The backend can still override this via action=questLibrary, but this keeps
// Chief Lair useful even if the Sheet library endpoint is empty/offline.
const LOCAL_CHALLENGE_BANK = {
  "wellness": [
    {
      "section": "Monthly Wellness",
      "month": "July · Housewarming Party",
      "type": "wellness",
      "title": "Motto Motto Medicine — house mottos + meet your interns",
      "points": 5,
      "evidence": "House motto/logo photo + photo of something fun with interns, inside or outside the hospital",
      "description": "Kick off the year: build house identity and adopt your interns early.",
      "note": "Proof: House motto/logo photo + photo of something fun with interns, inside or outside the hospital · Kick off the year: build house identity and adopt your interns early.",
      "launchCopy": "New year, new houses. Make a motto, meet your interns, collect 5 points."
    },
    {
      "section": "Monthly Wellness",
      "month": "August · Hydrate or Die-drate",
      "type": "wellness",
      "title": "Beat the Heat Step Stampede — cumulative house steps",
      "points": 5,
      "evidence": "Step screenshot or walk photo",
      "description": "Cumulative house steps; every walk counts.",
      "note": "Proof: Step screenshot or walk photo · Cumulative house steps; every walk counts.",
      "launchCopy": "It's 108 out. Walk anyway (before 7 AM). The Stampede is on."
    },
    {
      "section": "Monthly Wellness",
      "month": "September · Tiny Teaching, Big Feelings",
      "type": "wellness",
      "title": "Teach Me Something Good — one pearl, chalk talk, article, or mini teaching moment",
      "points": 5,
      "evidence": "Photo of the board/moment or short note",
      "description": "Any teaching counts: pearls, chalk talks, articles, mini-moments.",
      "note": "Proof: Photo of the board/moment or short note · Any teaching counts: pearls, chalk talks, articles, mini-moments.",
      "launchCopy": "Teach one thing. Any thing. The board is your canvas."
    },
    {
      "section": "Monthly Wellness",
      "month": "October · Boo-cson",
      "type": "wellness",
      "title": "Haunted Tucson Field Trip — visit a haunted or historic Tucson spot",
      "points": 5,
      "evidence": "Photo at the spot",
      "description": "Hotel Congress, Fox Theatre, old barrios — haunted or historic both count.",
      "note": "Proof: Photo at the spot · Hotel Congress, Fox Theatre, old barrios — haunted or historic both count.",
      "launchCopy": "Tucson is old and haunted. Go say hi."
    },
    {
      "section": "Monthly Wellness",
      "month": "November · Thanks, I Needed That",
      "type": "wellness",
      "title": "Gratitude + Service Combo Meal — post one gratitude note and complete one service/community action",
      "points": 5,
      "evidence": "Photo or note of both halves",
      "description": "Both halves required: one gratitude note + one service action.",
      "note": "Proof: Photo or note of both halves · Both halves required: one gratitude note + one service action.",
      "launchCopy": "One thank-you, one good deed. Combo meal pricing: 5 points."
    },
    {
      "section": "Monthly Wellness",
      "month": "December · Desert Claus",
      "type": "wellness",
      "title": "Holiday Giving Drive — clothing, food, gifts, or patient/community support",
      "points": 5,
      "evidence": "Photo of the give",
      "description": "Any giving counts: drives, gifts, patient/community support.",
      "note": "Proof: Photo of the give · Any giving counts: drives, gifts, patient/community support.",
      "launchCopy": "Desert Claus is watching. Give something, log it."
    },
    {
      "section": "Monthly Wellness",
      "month": "January · New Year, Same Pager",
      "type": "wellness",
      "title": "Fresh Start Bingo — try a new wellness activity",
      "points": 5,
      "evidence": "Photo of the new thing",
      "description": "New means new-to-you: climbing gym, birding, pottery, whatever.",
      "note": "Proof: Photo of the new thing · New means new-to-you: climbing gym, birding, pottery, whatever.",
      "launchCopy": "Same pager, new you. Try one new wellness thing."
    },
    {
      "section": "Monthly Wellness",
      "month": "February · Pal-entines",
      "type": "wellness",
      "title": "Connection Quest — check in on 5 colleagues",
      "points": 5,
      "evidence": "Short note or screenshot",
      "description": "Five real check-ins, especially people outside your usual orbit.",
      "note": "Proof: Short note or screenshot · Five real check-ins, especially people outside your usual orbit.",
      "launchCopy": "Forget valentines — send pal-entines. Five check-ins, five points."
    },
    {
      "section": "Monthly Wellness",
      "month": "March · Peak Freaks",
      "type": "wellness",
      "title": "Peak Bagging Month — summit, hike, or high-effort outdoor adventure",
      "points": 5,
      "evidence": "Summit/trail photo",
      "description": "Any summit or high-effort outdoor adventure counts.",
      "note": "Proof: Summit/trail photo · Any summit or high-effort outdoor adventure counts.",
      "launchCopy": "Peak season. Go get one."
    },
    {
      "section": "Monthly Wellness",
      "month": "April · Spoke Signals",
      "type": "wellness",
      "title": "Bike Month — house miles by bike, commute, Loop ride, or spin",
      "points": 5,
      "evidence": "Ride photo or screenshot",
      "description": "Commutes, Loop rides, and spin classes all count toward house miles.",
      "note": "Proof: Ride photo or screenshot · Commutes, Loop rides, and spin classes all count toward house miles.",
      "launchCopy": "April is Bike Month. Every mile is a spoke signal."
    },
    {
      "section": "Monthly Wellness",
      "month": "May · Brain Deserves Snacks",
      "type": "wellness",
      "title": "Mental Health Choose-Your-Own-Adventure",
      "points": 5,
      "evidence": "Photo or short note",
      "description": "Pick your own restorative thing: therapy walk, nap, hobby, boundary.",
      "note": "Proof: Photo or short note · Pick your own restorative thing: therapy walk, nap, hobby, boundary.",
      "launchCopy": "Your brain deserves snacks. Choose your own adventure and log it."
    },
    {
      "section": "Monthly Wellness",
      "month": "June · Sunrise Survival Club",
      "type": "wellness",
      "title": "Summer Heat Challenge — sunrise workouts + early hikes",
      "points": 5,
      "evidence": "Timestamped sunrise proof",
      "description": "Beat the heat: workouts and hikes finished early.",
      "note": "Proof: Timestamped sunrise proof · Beat the heat: workouts and hikes finished early.",
      "launchCopy": "The Sunrise Survival Club is now boarding. 5 AM alarms build character."
    },
    {
      "section": "Alternates",
      "month": "July",
      "type": "wellness",
      "title": "Touch Grass",
      "points": 3,
      "evidence": "Photo preferred; short note okay",
      "description": "Spend 30+ minutes outside with another resident.",
      "note": "Proof: Photo preferred; short note okay · Spend 30+ minutes outside with another resident.",
      "launchCopy": "Log it. Leave the fluorescent lights. Touch grass."
    },
    {
      "section": "Alternates",
      "month": "July",
      "type": "wellness",
      "title": "Monsoon Watch Society",
      "points": 3,
      "evidence": "Storm photo from somewhere dry",
      "description": "Catch a storm rolling in and hydrate like it's your job. Lightning safety is self-explanatory.",
      "note": "Proof: Storm photo from somewhere dry · Catch a storm rolling in and hydrate like it's your job. Lightning safety is self-explanatory.",
      "launchCopy": "Monsoon szn. Watch responsibly."
    },
    {
      "section": "Alternates",
      "month": "August",
      "type": "wellness",
      "title": "Hydration Streak",
      "points": 3,
      "evidence": "Photo preferred; short note okay",
      "description": "Three-day hydration streak or group water accountability.",
      "note": "Proof: Photo preferred; short note okay · Three-day hydration streak or group water accountability.",
      "launchCopy": "Water is free. Nephrology is watching."
    },
    {
      "section": "Alternates",
      "month": "September",
      "type": "wellness",
      "title": "Feed the Workroom",
      "points": 3,
      "evidence": "Photo preferred",
      "description": "Bring or coordinate snacks/coffee for a team or workroom.",
      "note": "Proof: Photo preferred · Bring or coordinate snacks/coffee for a team or workroom.",
      "launchCopy": "Snack-based morale intervention now live."
    },
    {
      "section": "Alternates",
      "month": "September",
      "type": "wellness",
      "title": "Lemmon Aid",
      "points": 3,
      "evidence": "Photo preferred",
      "description": "Escape up the Catalina Highway with housemates. The Cookie Cabin counts as wellness.",
      "note": "Proof: Photo preferred · Escape up the Catalina Highway with housemates. The Cookie Cabin counts as wellness.",
      "launchCopy": "Lemmon Aid: elevation is medicine."
    },
    {
      "section": "Alternates",
      "month": "October",
      "type": "wellness",
      "title": "Post-call Recovery",
      "points": 3,
      "evidence": "Short note required",
      "description": "Do something restorative after nights/long call and explain why it counts.",
      "note": "Proof: Short note required · Do something restorative after nights/long call and explain why it counts.",
      "launchCopy": "Recovery is a clinical skill. Log the reset."
    },
    {
      "section": "Alternates",
      "month": "October",
      "type": "wellness",
      "title": "Tucson Meet Yourself",
      "points": 3,
      "evidence": "Photo preferred",
      "description": "Eat something you can't pronounce at the folk festival.",
      "note": "Proof: Photo preferred · Eat something you can't pronounce at the folk festival.",
      "launchCopy": "TMY: bonus lore for the most ambitious food line."
    },
    {
      "section": "Alternates",
      "month": "November",
      "type": "wellness",
      "title": "Gratitude Ping",
      "points": 3,
      "evidence": "Short note required",
      "description": "Send a genuine thank-you or shout-out to someone who helped.",
      "note": "Proof: Short note required · Send a genuine thank-you or shout-out to someone who helped.",
      "launchCopy": "Say the quiet good part out loud."
    },
    {
      "section": "Alternates",
      "month": "November",
      "type": "wellness",
      "title": "All Souls & Gratitude",
      "points": 3,
      "evidence": "Respectful photos only",
      "description": "Attend the All Souls Procession or host a gratitude dinner with housemates.",
      "note": "Proof: Respectful photos only · Attend the All Souls Procession or host a gratitude dinner with housemates.",
      "launchCopy": "All Souls weekend: show up, reflect, log it."
    },
    {
      "section": "Alternates",
      "month": "December",
      "type": "wellness",
      "title": "Warm Handoff",
      "points": 3,
      "evidence": "Short note required",
      "description": "Recognize someone for helping with cross-cover, signout, teaching, or kindness.",
      "note": "Proof: Short note required · Recognize someone for helping with cross-cover, signout, teaching, or kindness.",
      "launchCopy": "Warm handoffs count."
    },
    {
      "section": "Alternates",
      "month": "December",
      "type": "wellness",
      "title": "Winterhaven Wander",
      "points": 3,
      "evidence": "Photo preferred",
      "description": "Walk the Festival of Lights, or run a tamale crawl — dealer's choice.",
      "note": "Proof: Photo preferred · Walk the Festival of Lights, or run a tamale crawl — dealer's choice.",
      "launchCopy": "Tamale count is not capped. Points are."
    },
    {
      "section": "Alternates",
      "month": "January",
      "type": "wellness",
      "title": "Step Into It",
      "points": 3,
      "evidence": "Photo preferred",
      "description": "Group walk/stairs/gym/yoga/climb/pickleball/movement.",
      "note": "Proof: Photo preferred · Group walk/stairs/gym/yoga/climb/pickleball/movement.",
      "launchCopy": "Move the body. Free the pager-brain."
    },
    {
      "section": "Alternates",
      "month": "February",
      "type": "wellness",
      "title": "Kindness Consult",
      "points": 3,
      "evidence": "Short note required",
      "description": "Do something kind for a teammate and explain what happened.",
      "note": "Proof: Short note required · Do something kind for a teammate and explain what happened.",
      "launchCopy": "Consult kindness. No prior auth needed."
    },
    {
      "section": "Alternates",
      "month": "February",
      "type": "wellness",
      "title": "Gem Show Expedition",
      "points": 3,
      "evidence": "Photo required",
      "description": "Find the weirdest rock in the entire show. Rodeo Days outings also count.",
      "note": "Proof: Photo required · Find the weirdest rock in the entire show. Rodeo Days outings also count.",
      "launchCopy": "Weirdest rock wins. Yeehaw responsibly."
    },
    {
      "section": "Alternates",
      "month": "March",
      "type": "wellness",
      "title": "Spring Reset",
      "points": 3,
      "evidence": "Photo preferred",
      "description": "Outdoor reset with a co-resident.",
      "note": "Proof: Photo preferred · Outdoor reset with a co-resident.",
      "launchCopy": "The desert is open. Go be a person."
    },
    {
      "section": "Alternates",
      "month": "March",
      "type": "wellness",
      "title": "Festival of Books & Blooms",
      "points": 3,
      "evidence": "Photo preferred",
      "description": "Campus book festival or a wildflower walk. Poppy season waits for no one.",
      "note": "Proof: Photo preferred · Campus book festival or a wildflower walk. Poppy season waits for no one.",
      "launchCopy": "Books or blooms — pick your reset."
    },
    {
      "section": "Alternates",
      "month": "April",
      "type": "wellness",
      "title": "Desert Miles",
      "points": 3,
      "evidence": "Photo preferred",
      "description": "Group hike, trail run, bike, climb, or intentional outside movement.",
      "note": "Proof: Photo preferred · Group hike, trail run, bike, climb, or intentional outside movement.",
      "launchCopy": "Mileage counts. Lore counts more."
    },
    {
      "section": "Alternates",
      "month": "April",
      "type": "wellness",
      "title": "Desert Bloom Challenge",
      "points": 3,
      "evidence": "Photo required",
      "description": "Document wildflowers, visit Biosphere 2, or catch early blooms. (Original House Cup calendar.)",
      "note": "Proof: Photo required · Document wildflowers, visit Biosphere 2, or catch early blooms. (Original House Cup calendar.)",
      "launchCopy": "Bloom watch is on."
    },
    {
      "section": "Alternates",
      "month": "May",
      "type": "wellness",
      "title": "Teach One Thing",
      "points": 3,
      "evidence": "Photo or note",
      "description": "Teach a pearl, share a paper, or run a mini chalk talk.",
      "note": "Proof: Photo or note · Teach a pearl, share a paper, or run a mini chalk talk.",
      "launchCopy": "One pearl. One point-able moment."
    },
    {
      "section": "Alternates",
      "month": "May",
      "type": "wellness",
      "title": "Saguaro Bloom Bingo",
      "points": 3,
      "evidence": "Photo required",
      "description": "Find a crown in bloom — they only do this once a year.",
      "note": "Proof: Photo required · Find a crown in bloom — they only do this once a year.",
      "launchCopy": "Crown spotting season. Go."
    },
    {
      "section": "Alternates",
      "month": "June",
      "type": "wellness",
      "title": "Pass the Torch",
      "points": 3,
      "evidence": "Photo or note",
      "description": "Advice, teaching, welcome, or support for incoming interns/new seniors.",
      "note": "Proof: Photo or note · Advice, teaching, welcome, or support for incoming interns/new seniors.",
      "launchCopy": "Make July less feral for someone."
    },
    {
      "section": "Alternates",
      "month": "June",
      "type": "wellness",
      "title": "Saguaro Harvest Season",
      "points": 3,
      "evidence": "Photo preferred",
      "description": "Harvest event, sunrise hike, or dinner at a historic Tucson institution. (Original House Cup calendar.)",
      "note": "Proof: Photo preferred · Harvest event, sunrise hike, or dinner at a historic Tucson institution. (Original House Cup calendar.)",
      "launchCopy": "Harvest season: eat, hike, log."
    }
  ],
  "photo": [
    {
      "section": "Monthly Photo",
      "month": "July · Housewarming Party",
      "type": "photo",
      "title": "House crest reveal: motto/logo + at least 3 house humans",
      "points": 3,
      "evidence": "Photo required",
      "description": "Recovered legacy launch challenge — pairs with Motto Motto Medicine.",
      "note": "Proof: Photo required · Recovered legacy launch challenge — pairs with Motto Motto Medicine.",
      "launchCopy": "Reveal your crest. Minimum three house humans in frame."
    },
    {
      "section": "Monthly Photo",
      "month": "August · Hydrate or Die-drate",
      "type": "photo",
      "title": "Sweatiest wholesome step screenshot or desert-safe walk selfie",
      "points": 3,
      "evidence": "Photo required",
      "description": "Desert-safe means shade, water, and pre-9AM energy.",
      "note": "Proof: Photo required · Desert-safe means shade, water, and pre-9AM energy.",
      "launchCopy": "Show us the sweat. Wholesomely."
    },
    {
      "section": "Monthly Photo",
      "month": "September · Tiny Teaching, Big Feelings",
      "type": "photo",
      "title": "Best chalk-talk board / teaching pearl glamour shot",
      "points": 3,
      "evidence": "Photo required",
      "description": "Boards, diagrams, teaching moments — glamour angle encouraged.",
      "note": "Proof: Photo required · Boards, diagrams, teaching moments — glamour angle encouraged.",
      "launchCopy": "Chalk talk glamour shots due now."
    },
    {
      "section": "Monthly Photo",
      "month": "October · Boo-cson",
      "type": "photo",
      "title": "Spookiest Tucson photo that remains HR-safe",
      "points": 3,
      "evidence": "Photo required",
      "description": "Spooky but HR-safe. The bar is high, the liability is low.",
      "note": "Proof: Photo required · Spooky but HR-safe. The bar is high, the liability is low.",
      "launchCopy": "Scare us. Professionally."
    },
    {
      "section": "Monthly Photo",
      "month": "November · Thanks, I Needed That",
      "type": "photo",
      "title": "Most wholesome gratitude/service proof",
      "points": 3,
      "evidence": "Photo required",
      "description": "Document the good deed without violating anyone's privacy.",
      "note": "Proof: Photo required · Document the good deed without violating anyone's privacy.",
      "launchCopy": "Wholesome proof or it didn't happen."
    },
    {
      "section": "Monthly Photo",
      "month": "December · Desert Claus",
      "type": "photo",
      "title": "Most festive giving-drive evidence",
      "points": 3,
      "evidence": "Photo required",
      "description": "Festive giving documentation: drives, donations, deliveries.",
      "note": "Proof: Photo required · Festive giving documentation: drives, donations, deliveries.",
      "launchCopy": "Festive evidence, please."
    },
    {
      "section": "Monthly Photo",
      "month": "January · New Year, Same Pager",
      "type": "photo",
      "title": "New year, new coping mechanism",
      "points": 3,
      "evidence": "Photo required",
      "description": "Show us the new healthy coping mechanism in action.",
      "note": "Proof: Photo required · Show us the new healthy coping mechanism in action.",
      "launchCopy": "New coping mechanism just dropped. Pics required."
    },
    {
      "section": "Monthly Photo",
      "month": "February · Pal-entines",
      "type": "photo",
      "title": "Best colleague connection selfie or screenshot",
      "points": 3,
      "evidence": "Photo required",
      "description": "Connection caught on camera — selfies and screenshots both count.",
      "note": "Proof: Photo required · Connection caught on camera — selfies and screenshots both count.",
      "launchCopy": "Pal-entine selfies due by end of month."
    },
    {
      "section": "Monthly Photo",
      "month": "March · Peak Freaks",
      "type": "photo",
      "title": "Summit goblin glamour shot",
      "points": 3,
      "evidence": "Photo required",
      "description": "Peak photo, goblin energy, glamour execution.",
      "note": "Proof: Photo required · Peak photo, goblin energy, glamour execution.",
      "launchCopy": "Summit goblin season is open."
    },
    {
      "section": "Monthly Photo",
      "month": "April · Spoke Signals",
      "type": "photo",
      "title": "Best bike/Loop/spin proof",
      "points": 3,
      "evidence": "Photo required",
      "description": "Bikes, Loop scenery, spin class suffering — all valid.",
      "note": "Proof: Photo required · Bikes, Loop scenery, spin class suffering — all valid.",
      "launchCopy": "Wheels or it didn't happen."
    },
    {
      "section": "Monthly Photo",
      "month": "May · Brain Deserves Snacks",
      "type": "photo",
      "title": "Most peaceful non-PHI reset photo",
      "points": 3,
      "evidence": "Photo required",
      "description": "Peaceful reset moments only. Zero PHI, maximum serenity.",
      "note": "Proof: Photo required · Peaceful reset moments only. Zero PHI, maximum serenity.",
      "launchCopy": "Show us peace. No PHI."
    },
    {
      "section": "Monthly Photo",
      "month": "June · Sunrise Survival Club",
      "type": "photo",
      "title": "Best sunrise survival shot",
      "points": 3,
      "evidence": "Photo required",
      "description": "Sunrise + evidence you survived it.",
      "note": "Proof: Photo required · Sunrise + evidence you survived it.",
      "launchCopy": "Sunrise survival shots due before the heat wins."
    },
    {
      "section": "Alternates",
      "month": "July",
      "type": "photo",
      "title": "First Tucson Sunset",
      "points": 3,
      "evidence": "Photo required",
      "description": "Photo of a Tucson sunset with a resident/person/pet/water bottle cameo.",
      "note": "Proof: Photo required · Photo of a Tucson sunset with a resident/person/pet/water bottle cameo.",
      "launchCopy": "The sunset is undefeated. Prove you saw it."
    },
    {
      "section": "Alternates",
      "month": "August",
      "type": "photo",
      "title": "Hydration Vessel Flex",
      "points": 3,
      "evidence": "Photo required",
      "description": "Best ridiculous/beautiful/industrial-size water bottle photo.",
      "note": "Proof: Photo required · Best ridiculous/beautiful/industrial-size water bottle photo.",
      "launchCopy": "Show us the vessel."
    },
    {
      "section": "Alternates",
      "month": "September",
      "type": "photo",
      "title": "Snack Shrine",
      "points": 3,
      "evidence": "Photo required",
      "description": "Best workroom snack spread or team coffee run photo.",
      "note": "Proof: Photo required · Best workroom snack spread or team coffee run photo.",
      "launchCopy": "The snack shrine is open."
    },
    {
      "section": "Alternates",
      "month": "October",
      "type": "photo",
      "title": "Spooky Hospital Fit",
      "points": 3,
      "evidence": "Photo required",
      "description": "PG-safe seasonal photo: pumpkins, socks, badge reel, workroom decor.",
      "note": "Proof: Photo required · PG-safe seasonal photo: pumpkins, socks, badge reel, workroom decor.",
      "launchCopy": "Spooky but HR-safe."
    },
    {
      "section": "Alternates",
      "month": "November",
      "type": "photo",
      "title": "Unsung Hero",
      "points": 3,
      "evidence": "Photo required; no patient info",
      "description": "Photo representing someone who made the day better; keep patient info out.",
      "note": "Proof: Photo required; no patient info · Photo representing someone who made the day better; keep patient info out.",
      "launchCopy": "Find the helper. Keep it HIPAA-clean."
    },
    {
      "section": "Alternates",
      "month": "December",
      "type": "photo",
      "title": "Cozy Workroom",
      "points": 3,
      "evidence": "Photo required",
      "description": "Best cozy/holiday-safe workroom or resident lounge photo.",
      "note": "Proof: Photo required · Best cozy/holiday-safe workroom or resident lounge photo.",
      "launchCopy": "Cozy counts."
    },
    {
      "section": "Alternates",
      "month": "January",
      "type": "photo",
      "title": "First Light",
      "points": 3,
      "evidence": "Photo required",
      "description": "Sunrise, early commute, coffee, or first-light desert photo.",
      "note": "Proof: Photo required · Sunrise, early commute, coffee, or first-light desert photo.",
      "launchCopy": "Post-call sunrise? Emotionally billable."
    },
    {
      "section": "Alternates",
      "month": "February",
      "type": "photo",
      "title": "Heart of the Program",
      "points": 3,
      "evidence": "Photo required",
      "description": "Wholesome resident teamwork or heart-themed safe visual.",
      "note": "Proof: Photo required · Wholesome resident teamwork or heart-themed safe visual.",
      "launchCopy": "Show us the heart of IM."
    },
    {
      "section": "Alternates",
      "month": "March",
      "type": "photo",
      "title": "Spring Training",
      "points": 3,
      "evidence": "Photo required",
      "description": "Best baseball/spring/Tucson outdoor photo.",
      "note": "Proof: Photo required · Best baseball/spring/Tucson outdoor photo.",
      "launchCopy": "Spring is a clinical intervention."
    },
    {
      "section": "Alternates",
      "month": "April",
      "type": "photo",
      "title": "Summit Evidence",
      "points": 3,
      "evidence": "Photo required",
      "description": "Photo from A Mountain, Tumamoc, Sabino, Wasson, Lemmon, or any trail.",
      "note": "Proof: Photo required · Photo from A Mountain, Tumamoc, Sabino, Wasson, Lemmon, or any trail.",
      "launchCopy": "Summit or it didn't happen."
    },
    {
      "section": "Alternates",
      "month": "May",
      "type": "photo",
      "title": "Teaching in the Wild",
      "points": 3,
      "evidence": "Photo required",
      "description": "Whiteboard, chalk talk, team learning, journal club, or safe teaching scene.",
      "note": "Proof: Photo required · Whiteboard, chalk talk, team learning, journal club, or safe teaching scene.",
      "launchCopy": "Catch someone teaching."
    },
    {
      "section": "Alternates",
      "month": "June",
      "type": "photo",
      "title": "Legacy Photo",
      "points": 3,
      "evidence": "Photo required",
      "description": "Best class/team/senior sendoff photo.",
      "note": "Proof: Photo required · Best class/team/senior sendoff photo.",
      "launchCopy": "Document the lore."
    },
    {
      "section": "Alternates",
      "month": "Any",
      "type": "photo",
      "title": "Your house's mountain range from a brand-new angle",
      "points": 3,
      "evidence": "Photo required",
      "description": "Catalina, Rincon, Santa Rita, Tortolita, or Tucson — go find yours.",
      "note": "Proof: Photo required · Catalina, Rincon, Santa Rita, Tortolita, or Tucson — go find yours.",
      "launchCopy": "Show us your range like we've never seen it."
    },
    {
      "section": "Alternates",
      "month": "Any",
      "type": "photo",
      "title": "White coat in the wild",
      "points": 3,
      "evidence": "Photo required",
      "description": "Scrubs somewhere scrubs have never been. Keep it HIPAA-proof and HR-proof.",
      "note": "Proof: Photo required · Scrubs somewhere scrubs have never been. Keep it HIPAA-proof and HR-proof.",
      "launchCopy": "White coat, wrong habitat. Go."
    },
    {
      "section": "Alternates",
      "month": "Any",
      "type": "photo",
      "title": "Two houses, one frame",
      "points": 3,
      "evidence": "Photo required",
      "description": "A cross-house hang caught on camera.",
      "note": "Proof: Photo required · A cross-house hang caught on camera.",
      "launchCopy": "Fraternizing with the enemy is encouraged."
    }
  ],
  "bounty": [
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Find the most judgmental saguaro",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Sunrise before signout",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Best Tucson mural walk",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Touch grass with three people from your house",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Sabino sunrise crew",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Sonoran hot dog + decompression walk",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "A Mountain sunset photo",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "No-phone nature hour",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Bring joy to the team snack drop",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Write three gratitude notes",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Check in on five colleagues you do not know well",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Hydration hero shift",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Find the weirdest cactus in Tucson",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Farmers market produce quest",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Coffee walk with someone outside your usual crew",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Trail cleanup / leave-it-better mini mission",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "House picnic or potluck",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Desert Museum or botanical garden reset",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Meet your interns for coffee, snacks, or a hospital walk",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Ask an intern what would make this month easier, then do one small thing",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Text someone post-call that you appreciate them",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Bring a ridiculous but useful snack to the workroom",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Make a team playlist for prerounds / charting / survival",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Take a walk with someone who looks like they need a reset",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Send one thank-you message to a nurse, MA, pharmacist, RT, or clinic staff member",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Make the call room slightly less cursed",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Teach one thing you wish someone had taught you earlier",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Organize a five-minute stretch break during a long day",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Do a kindness drive-by: coffee, snack, note, or errand for someone slammed",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Find a beautiful Tucson sky and document it for morale",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Have a real conversation with no work talk for ten minutes",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Make a mini survival guide for new interns",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Take a house photo that looks like an album cover",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Create a house motto, chant, handshake, or absolutely unnecessary ritual",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Host a tiny workroom celebration for no good reason",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Share one good thing from the week in your house chat",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Make an intern laugh during a hard shift",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Featured Quest Pool",
      "month": "",
      "type": "bounty",
      "title": "Do something wholesome enough that it feels suspicious",
      "points": 3,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": ""
    },
    {
      "section": "Group Bounties",
      "month": "",
      "type": "bounty",
      "title": "First house to get 8 people to the Gem Show",
      "points": 15,
      "evidence": "One group photo, eight identifiable humans",
      "description": "Judged on arrival order. February energy.",
      "note": "Proof: One group photo, eight identifiable humans · Judged on arrival order. February energy.",
      "launchCopy": "The Gem Show bounty is LIVE: first house with 8 humans in one frame takes 15."
    },
    {
      "section": "Group Bounties",
      "month": "",
      "type": "bounty",
      "title": "Full house on A Mountain: one summit photo with 6+ housemates",
      "points": 12,
      "evidence": "Summit photo, 6+ housemates",
      "description": "",
      "note": "Proof: Summit photo, 6+ housemates",
      "launchCopy": "Get your house up A Mountain. Six or more, one photo, twelve points."
    },
    {
      "section": "Group Bounties",
      "month": "",
      "type": "bounty",
      "title": "Eegee's flavor of the month: 5 housemates, 5 cups, 1 photo",
      "points": 8,
      "evidence": "Photo required",
      "description": "",
      "note": "Proof: Photo required",
      "launchCopy": "Flavor of the month run: 5 cups, 1 photo, 8 points."
    },
    {
      "section": "Group Bounties",
      "month": "",
      "type": "bounty",
      "title": "Cross-Class Hang",
      "points": 5,
      "evidence": "Photo required",
      "description": "Group hang with at least two classes represented.",
      "note": "Proof: Photo required · Group hang with at least two classes represented.",
      "launchCopy": "Mix the classes. Reduce the awkwardness."
    },
    {
      "section": "Group Bounties",
      "month": "",
      "type": "bounty",
      "title": "House-Selected Activity",
      "points": 5,
      "evidence": "Usually photo required",
      "description": "Chief-selected activity of the week; residents complete it for bonus points.",
      "note": "Proof: Usually photo required · Chief-selected activity of the week; residents complete it for bonus points.",
      "launchCopy": "This week's house quest is live."
    },
    {
      "section": "Group Bounties",
      "month": "",
      "type": "bounty",
      "title": "Academic Flex Week",
      "points": 5,
      "evidence": "Photo or note",
      "description": "Teaching, QI, journal club, paper discussion, abstract, conference prep.",
      "note": "Proof: Photo or note · Teaching, QI, journal club, paper discussion, abstract, conference prep.",
      "launchCopy": "Brains get points this week."
    }
  ]
};


const AWARD_PRESETS = ["Trivia W", "Kahoot crown", "Event MVP", "Chief's whim"];

/* ------------------------- Helpers ------------------------- */

function normalizeName(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function findRosterPerson(name) {
  const target = normalizeName(name);
  if (!target) return null;
  for (let i = 0; i < ROSTER.length; i += 1) {
    if (normalizeName(ROSTER[i].name) === target) return ROSTER[i];
  }
  return null;
}

function authenticateChief(name, password) {
  const target = normalizeName(name);
  return CHIEF_USERS.some(function check(u) {
    return normalizeName(u.name) === target && u.password === password;
  });
}

function todayString() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + m + "-" + day;
}

function dateFromYMD(value) {
  const parts = String(value || "").split("-").map(function num(x) { return Number(x); });
  return new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1);
}

function getAcademicQuarterInfo(now) {
  const d = now || new Date();
  const year = d.getFullYear();
  const month = d.getMonth();
  const academicStartYear = month >= 6 ? year : year - 1;
  const quarters = [
    { key: "Q1", label: "Q1", startDate: academicStartYear + "-07-01", endDate: academicStartYear + "-09-30", prize: "Conference credit" },
    { key: "Q2", label: "Q2", startDate: academicStartYear + "-10-01", endDate: academicStartYear + "-12-31", prize: "Conference credit" },
    { key: "Q3", label: "Q3", startDate: (academicStartYear + 1) + "-01-01", endDate: (academicStartYear + 1) + "-03-31", prize: "Conference credit" },
    { key: "Q4", label: "Q4", startDate: (academicStartYear + 1) + "-04-01", endDate: (academicStartYear + 1) + "-06-30", prize: "Conference credit + MICU coverage glory" },
  ];
  const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const active = quarters.find(function findQ(q) {
    return today >= dateFromYMD(q.startDate) && today <= dateFromYMD(q.endDate);
  }) || quarters[0];
  const end = dateFromYMD(active.endDate);
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.max(0, Math.ceil((end - today) / msPerDay));
  return Object.assign({}, active, { daysLeft: daysLeft, academicYear: academicStartYear + "–" + String(academicStartYear + 1).slice(-2) });
}

function formatGap(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  if (n <= 0) return "0";
  return String(Math.ceil(n));
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise(function toBlob(resolve) {
    if (!canvas.toBlob) { resolve(null); return; }
    canvas.toBlob(function done(blob) { resolve(blob); }, mimeType, quality);
  });
}

async function compressImageFile(file) {
  if (!file || !String(file.type || "").startsWith("image/")) return file;
  if (file.size && file.size < 450000) return file;
  try {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.decoding = "async";
    const loaded = new Promise(function wait(resolve, reject) {
      img.onload = resolve;
      img.onerror = reject;
    });
    img.src = url;
    await loaded;
    const maxSide = 1400;
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
    const w = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
    const h = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    const blob = await canvasToBlob(canvas, "image/jpeg", 0.72);
    if (!blob) return file;
    const compressedName = String(file.name || "house-cup-photo").replace(/\.[^.]+$/, "") + "-compressed.jpg";
    return new File([blob], compressedName, { type: "image/jpeg", lastModified: Date.now() });
  } catch (err) {
    return file;
  }
}

function fileToBase64(file) {
  return new Promise(function convert(resolve, reject) {
    if (!file) { resolve(""); return; }
    const reader = new FileReader();
    reader.onload = function onLoad() {
      const result = String(reader.result || "");
      const commaIndex = result.indexOf(",");
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.onerror = function onError() { reject(reader.error || new Error("Could not read file")); };
    reader.readAsDataURL(file);
  });
}

function makeSubmissionId(prefix) {
  return String(prefix || "pom") + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

// POST is fire-and-forget (no-cors keeps Apps Script simple); GET summary is readable JSON.
async function postToBackend(payload) {
  if (!APPS_SCRIPT_WEB_APP_URL) return { ok: false, message: "Backend URL not configured" };
  await fetch(APPS_SCRIPT_WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  return { ok: true };
}

async function fetchSummary(period, userName) {
  const params = new URLSearchParams({ action: "summary" });
  if (period) params.set("period", period);
  if (userName) params.set("user", userName);
  // Cache-bust the Apps Script summary so quest changes from Chief Lair show up
  // immediately on resident devices instead of waiting for browser/proxy cache.
  params.set("_", String(Date.now()));
  const res = await fetch(APPS_SCRIPT_WEB_APP_URL + "?" + params.toString(), {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Summary request failed: " + res.status);
  return res.json();
}

// Chief draws (raffle, Gila Monster) use readable GETs so the result can be shown live.
async function chiefGet(action, pass, extra) {
  const params = new URLSearchParams(Object.assign({ action: action, pass: pass }, extra || {}));
  const res = await fetch(APPS_SCRIPT_WEB_APP_URL + "?" + params.toString(), { method: "GET" });
  if (!res.ok) throw new Error("Request failed: " + res.status);
  return res.json();
}

// Remember who's mashing so voting and the next visit skip the typing. Guarded: never required.
function rememberName(name) {
  try { window.localStorage.setItem("pom-name", name); } catch (e) { /* private mode etc. */ }
}
function recallName() {
  try { return window.localStorage.getItem("pom-name") || ""; } catch (e) { return ""; }
}

// Theme: "sunset" (default) or "retro" (GeoCities-era Point-O-Matic tribute). Persisted like the name.
function rememberTheme(theme) {
  try { window.localStorage.setItem("pom-theme", theme); } catch (e) { /* private mode etc. */ }
}
function recallTheme() {
  try { return window.localStorage.getItem("pom-theme") || "sunset"; } catch (e) { return "sunset"; }
}

function launchConfetti(originEl) {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const emojis = ["🌵", "☀️", "⭐", "🏔️", "🎉", "🌅"];
  const rect = originEl ? originEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < 26; i += 1) {
    const el = document.createElement("span");
    el.className = "pom-confetti";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 160;
    el.style.left = cx + "px";
    el.style.top = cy + "px";
    el.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    el.style.setProperty("--dy", Math.sin(angle) * dist - 120 + "px");
    el.style.setProperty("--rot", (Math.random() * 540 - 270) + "deg");
    el.style.fontSize = 14 + Math.random() * 16 + "px";
    document.body.appendChild(el);
    setTimeout(function cleanUp() { el.remove(); }, 1300);
  }
}

/* ------------------------- Small components ------------------------- */

function HouseChip(props) {
  const color = HOUSE_COLORS[props.house] || "#888";
  return (
    <span className="pom-chip" style={{ background: color + "22", borderColor: color, color: color }}>
      ⛰️ House {props.house}
    </span>
  );
}

function PersonChip(props) {
  const color = HOUSE_COLORS[props.house] || "#888";
  return (
    <span className="pom-personchip" style={{ borderColor: color }}>
      <span className="pom-personchip-dot" style={{ background: color }} />
      {props.name}
      {props.onRemove && (
        <button type="button" className="pom-chip-x" onClick={props.onRemove} aria-label={"Remove " + props.name}>×</button>
      )}
    </span>
  );
}

function RosterDatalist() {
  return (
    <datalist id="pom-roster">
      {ROSTER.map(function opt(p) { return <option key={p.name} value={p.name} />; })}
    </datalist>
  );
}

/* ------------------------- Earn tab ------------------------- */

function EarnTab(props) {
  const challenges = props.challenges;
  const monsoon = props.monsoon;
  const bounty = props.challenges.bounty || null;
  const [name, setName] = useState(recallName());
  const [activityId, setActivityId] = useState("");
  const [showWhy, setShowWhy] = useState(false);
  const [requestedPoints, setRequestedPoints] = useState(1);
  const [bigQuest, setBigQuest] = useState(BIG_QUESTS[0].label);
  const [squadInput, setSquadInput] = useState("");
  const [squad, setSquad] = useState([]);
  const [note, setNote] = useState("");
  const [shoutTo, setShoutTo] = useState("");
  const [shoutReason, setShoutReason] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoStatus, setPhotoStatus] = useState("");
  const [status, setStatus] = useState("");
  const [receiptMsg, setReceiptMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [burst, setBurst] = useState(null);
  const mashRef = useRef(null);
  const photoInputRef = useRef(null);

  const me = findRosterPerson(name);
  useEffect(function saveName() { if (me) rememberName(me.name); }, [me]);

  const bountyActivity = bounty ? {
    id: "bounty", label: "OPTIONAL QUEST", points: Number(bounty.points) || 5, icon: "🎯",
    blurb: bounty.title + (bounty.endDate ? " · closes " + bounty.endDate : ""),
  } : null;
  const allActivities = bountyActivity ? [bountyActivity].concat(ACTIVITIES) : ACTIVITIES;
  const activity = allActivities.find(function f(a) { return a.id === activityId; }) || null;
  const isShout = activityId === "allstar";
  const isPointsRequest = activityId === "points_request";
  const shoutTarget = findRosterPerson(shoutTo);

  const effectivePoints = useMemo(function pts() {
    if (!activity) return 0;
    if (activity.id === "points_request") return Math.max(1, Math.min(10, Number(requestedPoints) || 1));
    if (activity.id === "big_challenge") {
      const q = BIG_QUESTS.find(function f(b) { return b.label === bigQuest; });
      return q ? q.points : 5;
    }
    if (activity.challenge) {
      const live = challenges[activity.challenge];
      return live && live.points ? Number(live.points) : activity.points;
    }
    return activity.points;
  }, [activity, bigQuest, challenges, requestedPoints]);

  const monsoonBoost = monsoon && me && me.house === monsoon.house;
  const displayPoints = monsoonBoost ? effectivePoints * 2 : effectivePoints;

  function addSquadMember(rawName) {
    const person = findRosterPerson(rawName);
    if (!person) { setStatus("Squad member not found on the roster — check the spelling."); return; }
    if (me && normalizeName(person.name) === normalizeName(me.name)) { setSquadInput(""); return; }
    if (squad.some(function dup(s) { return normalizeName(s.name) === normalizeName(person.name); })) { setSquadInput(""); return; }
    setSquad(squad.concat([{ name: person.name, house: person.house }]));
    setSquadInput("");
    setStatus("");
  }

  async function onPhotoChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setPhotoStatus("Optimizing photo for faster upload…");
    const optimized = await compressImageFile(file);
    setPhotoFile(optimized);
    const url = URL.createObjectURL(optimized);
    setPhotoPreview(url);
    const savedPct = file.size && optimized.size ? Math.max(0, Math.round((1 - optimized.size / file.size) * 100)) : 0;
    setPhotoStatus(savedPct > 10 ? "Photo optimized — " + savedPct + "% smaller, faster mash." : "Photo ready.");
  }

  function clearPhoto() {
    setPhotoFile(null);
    setPhotoPreview("");
    setPhotoStatus("");
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  const readyReason = (function readiness() {
    if (!me) return "Type your name so we know who's earning";
    if (!activity) return "Pick what you did";
    if (isShout) {
      if (!shoutTarget) return "Pick who you're shouting out";
      if (!shoutReason.trim()) return "Tell us why they're an All-Star";
      return "";
    }
    if (isPointsRequest && !note.trim()) return "Tell us why you're requesting points";
    if (activity && activity.requiresNote && !note.trim()) return activity.id === "optional_quest" ? "Tell us which optional quest/bounty you completed" : "Tell us what wellness/community thing you did";
    if (!isPointsRequest && !photoFile) return "Snap the photo evidence";
    return "";
  })();

  async function mash() {
    if (readyReason || busy) return;
    setBusy(true);
    setStatus("Uploading… hang tight.");
    const submissionId = makeSubmissionId(activityId || "points");
    try {
      if (isShout) {
        await postToBackend({
          action: "shoutout",
          clientSubmissionId: submissionId,
          date: todayString(),
          from: me.name,
          fromHouse: me.house,
          to: shoutTarget.name,
          house: me.house,
          nomineeHouse: shoutTarget.house,
          toHouse: shoutTarget.house,
          points: effectivePoints,
          reason: shoutReason.trim(),
          photoBase64: photoFile ? await fileToBase64(photoFile) : "",
          photoName: photoFile ? photoFile.name : "",
          photoMimeType: photoFile ? photoFile.type : "",
        });
        setBurst({ points: displayPoints, label: "House " + me.house + " · All-Star nom for " + shoutTarget.name });
      } else {
        const participants = [{ name: me.name, house: me.house }].concat(squad);
        const liveChallenge = activity.challenge ? challenges[activity.challenge] : null;
        await postToBackend({
          action: "submit",
          clientSubmissionId: submissionId,
          proofLevel: isPointsRequest ? "low" : "standard",
          requestedPoints: isPointsRequest ? effectivePoints : "",
          date: todayString(),
          submitter: me.name,
          activityId: activity.id,
          activity: activity.id === "big_challenge" ? "Big Tucson quest: " + bigQuest
            : activity.id === "bounty" ? "Bounty: " + (bounty ? bounty.title : "")
            : activity.id === "optional_quest" ? "Optional quest / bounty: " + note.trim()
            : activity.id === "wellness_event" ? "Wellness / community: " + note.trim()
            : activity.id === "points_request" ? "Points request: " + effectivePoints + " pts requested"
            : liveChallenge ? activity.label + ": " + liveChallenge.title
            : activity.label,
          points: effectivePoints,
          participants: participants,
          note: note.trim(),
          photoBase64: photoFile ? await fileToBase64(photoFile) : "",
          photoName: photoFile ? (photoFile.name || "house-cup-photo.jpg") : "",
          photoMimeType: photoFile ? (photoFile.type || "image/jpeg") : "",
        });
        const crewNote = participants.length > 1 ? " × " + participants.length + " crew" : "";
        setBurst({ points: displayPoints, label: "House " + me.house + crewNote });
      }
      launchConfetti(mashRef.current);
      setReceiptMsg("Receipt " + submissionId + " sent · Glory usually updates in a few seconds.");
      setStatus("done");
      setActivityId("");
      setSquad([]);
      setNote("");
      setShoutTo("");
      setShoutReason("");
      setRequestedPoints(1);
      clearPhoto();
      setTimeout(function fade() { setBurst(null); setStatus(""); }, 3200);
    } catch (err) {
      setReceiptMsg("");
      setStatus("That mash didn't land — check your connection and mash again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pom-earn">
      {monsoon && (
        <div className="pom-monsoon">
          🌧️ MONSOON WEEK — House {monsoon.house} earns <strong>DOUBLE points</strong>{monsoon.endDate ? " through " + monsoon.endDate : ""}. Make it rain.
        </div>
      )}
      {bounty && (
        <div className="pom-bounty-banner">
          🎯 <strong>OPTIONAL QUEST LIVE:</strong> {bounty.title} · <span className="pom-bounty-pts">{bounty.points} pts</span>{bounty.endDate ? " · closes " + bounty.endDate : ""}
          {bounty.note && <span className="pom-bounty-note">{bounty.note}</span>}
        </div>
      )}
      <div className="pom-quests">
        <div className="pom-quest-card" style={{ borderColor: "#2F9E44" }}>
          <span className="pom-quest-kicker">🌵 Wellness quest · {(challenges.wellness && challenges.wellness.points) || 3} pts</span>
          <strong>{(challenges.wellness && challenges.wellness.title) || FALLBACK_CHALLENGES.wellness.title}</strong>
          {challenges.wellness && challenges.wellness.note && <span className="pom-quest-note">{challenges.wellness.note}</span>}
        </div>
        <div className="pom-quest-card" style={{ borderColor: "#D6336C" }}>
          <span className="pom-quest-kicker">📸 Photo quest · {(challenges.photo && challenges.photo.points) || 3} pts</span>
          <strong>{(challenges.photo && challenges.photo.title) || FALLBACK_CHALLENGES.photo.title}</strong>
          {challenges.photo && challenges.photo.note && <span className="pom-quest-note">{challenges.photo.note}</span>}
        </div>
      </div>

      <section className="pom-card">
        <h2 className="pom-step"><span className="pom-step-n">1</span> Who's earning?</h2>
        <input
          className="pom-input pom-input-big"
          list="pom-roster"
          placeholder="Type your name…"
          value={name}
          onChange={function onN(e) { setName(e.target.value); }}
          autoComplete="off"
        />
        {me && <div className="pom-me"><HouseChip house={me.house} /> <span className="pom-me-hi">let's gooo, {me.name.split(" ")[0]}</span></div>}
      </section>

      <section className="pom-card">
        <h2 className="pom-step"><span className="pom-step-n">2</span> What'd you do?</h2>
        <div className="pom-acts">
          {allActivities.map(function tile(a) {
            const live = a.challenge ? props.challenges[a.challenge] : null;
            const pts = a.challenge && live && live.points ? live.points : a.points;
            return (
              <button
                key={a.id}
                type="button"
                className={"pom-act " + (activityId === a.id ? "active " : "") + (a.id === "bounty" ? "bounty" : "")}
                onClick={function pick() { setActivityId(a.id); }}
              >
                <span className="pom-act-icon">{a.icon}</span>
                <span className="pom-act-label">{a.label}</span>
                <span className="pom-act-pts">{a.id === "big_challenge" ? "5–8" : a.id === "points_request" ? "1–10" : pts} pts</span>
              </button>
            );
          })}
          <button
            type="button"
            className={"pom-act pom-info-act pom-act-wide " + (showWhy ? "active" : "")}
            onClick={function toggleWhy() { setShowWhy(!showWhy); }}
          >
            <span className="pom-act-icon">🤔</span>
            <span className="pom-act-label">Tell me why</span>
            <span className="pom-act-pts">rules</span>
          </button>
        </div>
        {activity && <p className="pom-act-blurb">{activity.blurb}</p>}
        {showWhy && (
          <div className="pom-why-box">
            <strong>Point theology, briefly:</strong>
            <ul>
              <li><strong>Group hang / group exercise:</strong> 2+ people, photo evidence, everyone tagged gets points for their own house.</li>
              <li><strong>Academic flex:</strong> teaching, journal club, QI, research, abstracts, or other resident-brain nourishment.</li>
              <li><strong>Wellness / community:</strong> Shubitz or CUP shifts, group self-care, service, community engagement, or other real-life wellness. Add a note so chiefs know what happened.</li>
              <li><strong>Monthly wellness / photo quests:</strong> whatever challenge the chiefs have live that block.</li>
              <li><strong>Optional quest / bounty:</strong> chief-posted side missions that do not fit the monthly cards. Default is 5 points.</li>
              <li><strong>Big Tucson quest:</strong> higher-effort desert side quests, summits, Loop epics, and other lore-worthy activities.</li>
              <li><strong>IM All-Star:</strong> nominate someone who went above and beyond. The <em>person submitting the nomination</em> gets 2 points; the nominee gets the shout-out and monthly prize eligibility.</li>
            </ul>
          </div>
        )}
        {activity && activity.id === "big_challenge" && (
          <select className="pom-input" value={bigQuest} onChange={function onQ(e) { setBigQuest(e.target.value); }}>
            {BIG_QUESTS.map(function opt(q) { return <option key={q.label} value={q.label}>{q.label} · {q.points} pts</option>; })}
          </select>
        )}
        {activity && activity.id === "points_request" && (
          <div className="pom-request-box">
            <label className="pom-hint" htmlFor="pom-request-points">How many points are you requesting?</label>
            <div className="pom-stepper-row">
              <button type="button" className="pom-step-btn" onClick={function dn() { setRequestedPoints(Math.max(1, requestedPoints - 1)); }}>−</button>
              <span id="pom-request-points" className="pom-step-val">{requestedPoints} pt{requestedPoints === 1 ? "" : "s"}</span>
              <button type="button" className="pom-step-btn" onClick={function up() { setRequestedPoints(Math.min(10, requestedPoints + 1)); }}>+</button>
            </div>
            <p className="pom-hint">Low-proof mode: photo optional, explanation required. Chiefs can adjust later if the desert math is suspicious.</p>
          </div>
        )}
      </section>

      {activity && !isShout && (
        <section className="pom-card">
          <h2 className="pom-step"><span className="pom-step-n">3</span> Who was with you?</h2>
          <p className="pom-hint">{isPointsRequest ? "Optional: tag anyone else who should be included in this discretionary request." : "Everyone you tag gets " + effectivePoints + " pts for their own house. Same photo covers the whole crew."}</p>
          <div className="pom-squad-row">
            <input
              className="pom-input"
              list="pom-roster"
              placeholder="Add a crew member…"
              value={squadInput}
              onChange={function onS(e) { setSquadInput(e.target.value); }}
              onKeyDown={function onKey(e) { if (e.key === "Enter") { e.preventDefault(); addSquadMember(squadInput); } }}
              autoComplete="off"
            />
            <button type="button" className="pom-btn-secondary" onClick={function add() { addSquadMember(squadInput); }}>Add</button>
          </div>
          {squad.length > 0 && (
            <div className="pom-squad-chips">
              {squad.map(function chip(s, i) {
                return <PersonChip key={s.name} name={s.name} house={s.house} onRemove={function rm() { setSquad(squad.filter(function keep(_, j) { return j !== i; })); }} />;
              })}
            </div>
          )}
        </section>
      )}

      {activity && isShout && (
        <section className="pom-card">
          <h2 className="pom-step"><span className="pom-step-n">3</span> Who's the All-Star?</h2>
          <input
            className="pom-input"
            list="pom-roster"
            placeholder="Their name…"
            value={shoutTo}
            onChange={function onT(e) { setShoutTo(e.target.value); }}
            autoComplete="off"
          />
          {shoutTarget && <div className="pom-me"><HouseChip house={shoutTarget.house} /> <span className="pom-me-hi">nominee gets the shout-out; your house gets the 2 pts</span></div>}
          <textarea
            className="pom-input pom-textarea"
            placeholder="Why do they deserve the shout-out? (required — make it count)"
            value={shoutReason}
            onChange={function onR(e) { setShoutReason(e.target.value); }}
            rows={3}
          />
        </section>
      )}

      {activity && (
        <section className="pom-card">
          <h2 className="pom-step"><span className="pom-step-n">4</span> Photo evidence {(isShout || isPointsRequest) ? <em className="pom-optional">(optional)</em> : <em className="pom-required">(required)</em>}</h2>
          <input
            ref={photoInputRef}
            id="pom-photo"
            className="pom-file-hidden"
            type="file"
            accept="image/*"
            onChange={onPhotoChange}
          />
          {!photoPreview && (
            <label htmlFor="pom-photo" className="pom-photo-drop">📷 Snap or pick a photo</label>
          )}
          {photoPreview && (
            <div className="pom-photo-preview">
              <img src={photoPreview} alt="Evidence preview" />
              <button type="button" className="pom-btn-secondary" onClick={clearPhoto}>Retake</button>
            </div>
          )}
          {photoStatus && <p className="pom-upload-note">{photoStatus}</p>}
          {!isShout && (
            <input
              className="pom-input"
              placeholder={isPointsRequest ? "Required: why should chiefs award these points?" : activity && activity.id === "optional_quest" ? "Required: which optional quest/bounty did you complete?" : activity && activity.id === "wellness_event" ? "Required: Shubitz/CUP, group self-care, community engagement, service, etc." : "Optional note (where, what, lore…)"}
              value={note}
              onChange={function onNote(e) { setNote(e.target.value); }}
            />
          )}
        </section>
      )}

      <div className="pom-mash-zone">
        {burst && (
          <div className="pom-burst" role="status">+{burst.points} PTS → {burst.label}</div>
        )}
        <button
          ref={mashRef}
          type="button"
          className={"pom-mash " + (readyReason ? "locked" : "")}
          onClick={mash}
          disabled={busy}
          aria-label="Record points"
        >
          {busy ? "MASHING…" : status === "done" ? "POINTS RECORDED ✓" : "MASH IT"}
          {!readyReason && !busy && status !== "done" && (
            <span className="pom-mash-sub">
              +{displayPoints} pts{monsoonBoost ? " 🌧️2x" : ""}{!isShout && squad.length > 0 ? " × " + (squad.length + 1) : ""}
            </span>
          )}
        </button>
        {readyReason && <p className="pom-mash-hint">{readyReason}</p>}
        {status && status !== "done" && <p className={status.indexOf("Upload") === 0 ? "pom-ok" : "pom-error"}>{status}</p>}
        {receiptMsg && <p className="pom-ok">{receiptMsg}</p>}
        <p className="pom-raffle-note">🎟️ Every mash = 1 ticket in this month's gift card raffle.</p>
      </div>
    </div>
  );
}

/* ------------------------- Glory tab ------------------------- */

function MountainBar(props) {
  const color = HOUSE_COLORS[props.house] || "#888";
  const pct = props.max > 0 ? Math.max(8, Math.round((props.points / props.max) * 100)) : 8;
  return (
    <div className="pom-peak-col">
      <div className="pom-peak-pts" style={{ color: color }}>{props.points}</div>
      <div className="pom-peak-wrap">
        <div
          className={"pom-peak " + (props.leader ? "leader" : "")}
          style={{ height: pct + "%", background: "linear-gradient(180deg, " + color + " 0%, " + color + "CC 100%)" }}
        >
          {props.leader && <span className="pom-flag">🚩</span>}
        </div>
      </div>
      <div className="pom-peak-name">{props.house}</div>
    </div>
  );
}

function GloryTab() {
  const [scope, setScope] = useState("quarter");
  const [data, setData] = useState(null);
  const [state, setState] = useState("loading");
  const [votedFor, setVotedFor] = useState("");
  const [voteMsg, setVoteMsg] = useState("");
  const quarterInfo = getAcademicQuarterInfo(new Date());
  const rememberedName = recallName();
  const rememberedPerson = findRosterPerson(rememberedName);

  function load(nextScope) {
    const requestedScope = nextScope || scope;
    setState("loading");
    fetchSummary(requestedScope, rememberedPerson ? rememberedPerson.name : "")
      .then(function ok(json) { setData(json); setState("ready"); })
      .catch(function bad() { setState("error"); });
  }

  useEffect(function onScopeChange() { load(scope); }, [scope]);

  const houseRows = useMemo(function rows() {
    const totals = (data && data.houseTotals) || {};
    return HOUSES.map(function mk(h) { return { house: h, points: Math.round(Number(totals[h] || 0)) }; });
  }, [data]);
  const max = Math.max.apply(null, houseRows.map(function m(r) { return r.points; }).concat([1]));
  const leaderPts = Math.max.apply(null, houseRows.map(function m(r) { return r.points; }).concat([0]));

  if (state === "loading") {
    return <div className="pom-card pom-center"><div className="pom-spinner" aria-hidden="true">🌵</div><p>Summiting the standings…</p></div>;
  }
  if (state === "error") {
    return (
      <div className="pom-card pom-center">
        <p>The standings didn't load. Check your connection, then try again.</p>
        <button type="button" className="pom-btn-primary" onClick={function reload() { load(scope); }}>Reload standings</button>
      </div>
    );
  }

  const scorers = (data && data.topScorers) || [];
  const photos = (data && data.recentPhotos) || [];
  const shoutouts = (data && data.recentShoutouts) || [];
  const rivalry = data && data.rivalry;
  const pomLeader = data && data.photoOfMonth;
  const sorted = houseRows.slice().sort(function bySort(a, b) { return b.points - a.points; });
  const saguaroHolder = leaderPts > 0 ? sorted[0].house : null;
  const tumbleweedHolder = leaderPts > 0 ? sorted[sorted.length - 1].house : null;
  const scopeTitle = scope === "quarter" ? "This Quarter" : "All Season";
  const myFromLeaderboard = rememberedPerson ? scorers.find(function findMe(s) { return normalizeName(s.name) === normalizeName(rememberedPerson.name); }) : null;
  const myStats = (data && data.myStats) || {};
  const myPoints = myStats.points != null ? Math.round(Number(myStats.points || 0)) : (myFromLeaderboard ? Math.round(Number(myFromLeaderboard.points || 0)) : 0);
  const myRank = myStats.rank || (myFromLeaderboard ? scorers.findIndex(function idx(s) { return normalizeName(s.name) === normalizeName(rememberedPerson.name); }) + 1 : null);
  const myRaffleTickets = myStats.raffleTicketsThisMonth != null ? myStats.raffleTicketsThisMonth : null;
  const myTopTenGap = myStats.pointsToTop10 != null ? myStats.pointsToTop10 : null;
  const myHouseRow = rememberedPerson ? houseRows.find(function h(r) { return r.house === rememberedPerson.house; }) : null;
  const myHouseGap = rememberedPerson && myHouseRow ? Math.max(0, leaderPts - myHouseRow.points) : null;

  function castVote(photoId) {
    const voter = recallName() || window.prompt("Who's voting? (your roster name)") || "";
    const person = findRosterPerson(voter);
    if (!person) { setVoteMsg("Votes need a roster name — mash a point first or type your full name."); return; }
    rememberName(person.name);
    postToBackend({ action: "vote", voter: person.name, photoId: photoId });
    setVotedFor(photoId);
    setVoteMsg("Vote cast for Photo of the Month. You can change it anytime this month.");
  }

  return (
    <div className="pom-glory">
      {data && data.monsoon && (
        <div className="pom-monsoon">🌧️ MONSOON WEEK — House {data.monsoon.house} is earning DOUBLE points{data.monsoon.endDate ? " through " + data.monsoon.endDate : ""}.</div>
      )}

      <section className="pom-card pom-quarter-card">
        <div className="pom-scope-topline">
          <span className="pom-quarter-badge">{quarterInfo.label} · AY {quarterInfo.academicYear}</span>
          <span className="pom-countdown">⏳ {quarterInfo.label} ends in <strong>{quarterInfo.daysLeft}</strong> day{quarterInfo.daysLeft === 1 ? "" : "s"}</span>
        </div>
        <h2 className="pom-h2">Quarter Awareness</h2>
        <p className="pom-hint">Conference credit and the MICU coverage prize live here. Deadline pressure is free motivation.</p>
        <div className="pom-scope-toggle" role="tablist" aria-label="Leaderboard scope">
          <button type="button" className={"pom-scope-btn " + (scope === "quarter" ? "active" : "")} onClick={function q() { setScope("quarter"); }}>This Quarter</button>
          <button type="button" className={"pom-scope-btn " + (scope === "season" ? "active" : "")} onClick={function s() { setScope("season"); }}>All Season</button>
        </div>
      </section>

      {rememberedPerson ? (
        <section className="pom-card pom-my-card" style={{ borderColor: HOUSE_COLORS[rememberedPerson.house] || "#1F1B16" }}>
          <div className="pom-my-head">
            <div>
              <span className="pom-quarter-badge">My Stats · {scopeTitle}</span>
              <h2 className="pom-h2">{rememberedPerson.name.split(" ")[0]}'s Dashboard</h2>
            </div>
            <HouseChip house={rememberedPerson.house} />
          </div>
          <div className="pom-my-grid">
            <div><span>Points</span><strong>{myPoints}</strong></div>
            <div><span>Rank</span><strong>{myRank ? "#" + myRank : "—"}</strong></div>
            <div><span>Raffle tickets</span><strong>{myRaffleTickets != null ? myRaffleTickets : "—"}</strong></div>
            <div><span>House gap to 1st</span><strong>{formatGap(myHouseGap)} pts</strong></div>
          </div>
          <p className="pom-hint pom-my-motivator">
            {myTopTenGap != null && Number(myTopTenGap) > 0
              ? "You are " + formatGap(myTopTenGap) + " points from the top 10. This is medically actionable."
              : myRank && myRank <= 10
                ? "Top 10 behavior. Maintain altitude."
                : "Mash a few points and this card gets much more satisfying."}
          </p>
        </section>
      ) : (
        <section className="pom-card pom-my-card">
          <h2 className="pom-h2">My Stats</h2>
          <p className="pom-hint">Type your roster name once on the Earn tab, then this card will show your points, rank, monthly raffle tickets, and your house's gap to first.</p>
        </section>
      )}

      <section className="pom-card">
        <h2 className="pom-h2">The Range Race · {scopeTitle}</h2>
        <p className="pom-hint">Every house is a Tucson range. Highest peak takes the Cup.</p>
        <div className="pom-peaks">
          {houseRows.map(function bar(r) {
            return <MountainBar key={r.house} house={r.house} points={r.points} max={max} leader={r.points === leaderPts && leaderPts > 0} />;
          })}
        </div>
        {saguaroHolder && (
          <div className="pom-trophies">
            <span className="pom-trophy gold">🌵 The Golden Saguaro lives with <strong>House {saguaroHolder}</strong></span>
            <span className="pom-trophy shame">🌾 The Tumbleweed haunts <strong>House {tumbleweedHolder}</strong></span>
          </div>
        )}
        {data && data.totalsAsOf && <p className="pom-asof">As of {data.totalsAsOf} · showing {scopeTitle.toLowerCase()} · conference points sync in every Monday · 🎟️ {data.raffleTickets || 0} tickets in this month's raffle drum</p>}
      </section>

      {rivalry && (
        <section className="pom-card pom-rivalry">
          <h2 className="pom-h2">⚔️ Rivalry Week</h2>
          <p className="pom-hint">Head-to-head{rivalry.endDate ? " through " + rivalry.endDate : ""} — winner takes a <strong>{rivalry.pot}-point pot</strong>.</p>
          <div className="pom-versus">
            <div className="pom-versus-side" style={{ color: HOUSE_COLORS[rivalry.houseA] }}>
              <strong>{rivalry.houseA}</strong>
              <span className="pom-versus-pts">{rivalry.tallyA}</span>
            </div>
            <span className="pom-versus-vs">VS</span>
            <div className="pom-versus-side" style={{ color: HOUSE_COLORS[rivalry.houseB] }}>
              <strong>{rivalry.houseB}</strong>
              <span className="pom-versus-pts">{rivalry.tallyB}</span>
            </div>
          </div>
          <div className="pom-versus-bar">
            <div style={{
              width: (rivalry.tallyA + rivalry.tallyB > 0 ? Math.round((rivalry.tallyA / (rivalry.tallyA + rivalry.tallyB)) * 100) : 50) + "%",
              background: HOUSE_COLORS[rivalry.houseA]
            }} />
            <div style={{ flex: 1, background: HOUSE_COLORS[rivalry.houseB] }} />
          </div>
        </section>
      )}

      {pomLeader && (
        <section className="pom-card pom-pom-hero">
          <h2 className="pom-h2">📸 Photo of the Month — current leader</h2>
          <figure className="pom-hero-fig" style={{ borderColor: HOUSE_COLORS[pomLeader.house] || "#888" }}>
            <img src={pomLeader.url} alt={pomLeader.activity || "Photo of the Month leader"} />
            <figcaption>
              <strong>{pomLeader.name || pomLeader.house}</strong> · {pomLeader.activity} · {pomLeader.votes} vote{pomLeader.votes === 1 ? "" : "s"}
            </figcaption>
          </figure>
        </section>
      )}

      <section className="pom-card">
        <h2 className="pom-h2">High Scorers · {scopeTitle}</h2>
        {scorers.length === 0 && <p className="pom-hint">Nobody on the board yet — the first mash makes history.</p>}
        <ol className="pom-scorers">
          {scorers.map(function row(s, i) {
            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : (i + 1) + ".";
            const color = HOUSE_COLORS[s.house] || "#888";
            return (
              <li key={s.name}>
                <span className="pom-medal">{medal}</span>
                <span className="pom-scorer-name">{s.name}</span>
                <span className="pom-personchip-dot" style={{ background: color }} />
                <span className="pom-scorer-pts">{Math.round(Number(s.points))} pts</span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="pom-card">
        <h2 className="pom-h2">⭐ Wall of Fame</h2>
        <p className="pom-hint">Recent All-Star shout-outs. Best one each month wins prizes for the nominee <em>and</em> the nominator.</p>
        {shoutouts.length === 0 && <p className="pom-hint">No shout-outs yet. Someone near you deserves the glory — and the nominator's house deserves 2 points.</p>}
        <ul className="pom-fame">
          {shoutouts.map(function sh(s, i) {
            const color = HOUSE_COLORS[s.house] || "#888";
            return (
              <li key={i}>
                <span className="pom-fame-to" style={{ color: color }}>⭐ {s.to}</span>
                <span className="pom-fame-note">{s.note}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="pom-card">
        <h2 className="pom-h2">Fresh Evidence</h2>
        <p className="pom-hint">Tap 🗳️ to vote a photo toward Photo of the Month. One vote per person — re-voting moves it.</p>
        {voteMsg && <p className="pom-ok">{voteMsg}</p>}
        {photos.length === 0 && <p className="pom-hint">No photos yet. Do something photogenic.</p>}
        <div className="pom-wall">
          {photos.map(function ph(p, i) {
            const color = HOUSE_COLORS[p.house] || "#888";
            return (
              <figure key={i} className="pom-polaroid" style={{ borderColor: color }}>
                <img src={p.url} alt={p.activity || "House Cup evidence"} loading="lazy" />
                <figcaption>
                  <strong>{p.name || p.house}</strong>
                  <span>{p.activity}</span>
                </figcaption>
                {p.photoId && (
                  <button type="button" className={"pom-vote " + (votedFor === p.photoId ? "voted" : "")} onClick={function v() { castVote(p.photoId); }}>
                    {votedFor === p.photoId ? "✓ Voted" : "🗳️ Vote"}
                  </button>
                )}
              </figure>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ------------------------- Chief tab ------------------------- */

function ChiefTab(props) {
  const [chiefName, setChiefName] = useState("");
  const [chiefPass, setChiefPass] = useState("");
  const [chiefFieldsUnlocked, setChiefFieldsUnlocked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [loginMsg, setLoginMsg] = useState("");

  // Award state
  const [mode, setMode] = useState("people");
  const [targetInput, setTargetInput] = useState("");
  const [targets, setTargets] = useState([]);
  const [awardHouse, setAwardHouse] = useState(HOUSES[0]);
  const [awardPoints, setAwardPoints] = useState(3);
  const [awardReason, setAwardReason] = useState(AWARD_PRESETS[0]);
  const [awardCustom, setAwardCustom] = useState("");
  const [awardMsg, setAwardMsg] = useState("");

  // Challenge state
  const [chType, setChType] = useState("wellness");
  const [chTitle, setChTitle] = useState("");
  const [chPoints, setChPoints] = useState(5);
  const [chEnd, setChEnd] = useState("");
  const [chNote, setChNote] = useState("");
  const [chMsg, setChMsg] = useState("");
  const [chBusy, setChBusy] = useState(false);

  // Challenge Bank picker
  const [bank, setBank] = useState(LOCAL_CHALLENGE_BANK);
  const [bankPick, setBankPick] = useState("");
  const [bankCopy, setBankCopy] = useState("");
  const [bankMsg, setBankMsg] = useState("");

  // Draws
  const [raffleResult, setRaffleResult] = useState(null);
  const [gilaResult, setGilaResult] = useState(null);
  const [drawMsg, setDrawMsg] = useState("");
  const [drawBusy, setDrawBusy] = useState(false);

  // Specials
  const [spType, setSpType] = useState("monsoon");
  const [spHouseA, setSpHouseA] = useState(HOUSES[0]);
  const [spHouseB, setSpHouseB] = useState(HOUSES[1]);
  const [spPot, setSpPot] = useState(10);
  const [spStart, setSpStart] = useState(todayString());
  const [spEnd, setSpEnd] = useState("");
  const [spMsg, setSpMsg] = useState("");

  // Announcement
  const [anTitle, setAnTitle] = useState("");
  const [anBody, setAnBody] = useState("");
  const [anEnd, setAnEnd] = useState("");
  const [anMsg, setAnMsg] = useState("");

  // Shout-out judging
  const [shoutFeed, setShoutFeed] = useState([]);

  function login() {
    if (authenticateChief(chiefName, chiefPass)) {
      setAuthed(true);
      setLoginMsg("");
      fetchSummary().then(function ok(json) { setShoutFeed((json && json.recentShoutouts) || []); }).catch(function quiet() {});
      chiefGet("questLibrary", chiefPass)
        .then(function ok(json) {
          if (json && json.ok && json.library && (json.library.wellness || json.library.photo || json.library.bounty)) {
            const counts = ["wellness", "photo", "bounty"].map(function count(k) { return (json.library[k] || []).length; });
            if (counts.some(function has(n) { return n > 0; })) setBank(json.library);
          }
        })
        .catch(function quiet() { setBankMsg("Using the built-in Challenge Bank — Sheet library did not load."); });
    } else setLoginMsg("Name or password doesn't match a chief. The password is the sacred one.");
  }

  // Bank entries for the currently selected quest type: canonical monthly rows first, then the rest.
  const bankOptions = (function options() {
    if (!bank || !bank[chType]) return [];
    const list = bank[chType].slice();
    list.sort(function order(a, b) {
      const rank = function (s) { return String(s.section).indexOf("Monthly") === 0 ? 0 : String(s.section) === "Featured Quest Pool" ? 1 : String(s.section) === "Group Bounties" ? 2 : 3; };
      return rank(a) - rank(b);
    });
    return list;
  })();

  function defaultQuestPointsForType(type) {
    return type === "photo" ? 3 : 5;
  }

  function bankPointsForQuest(q) {
    if (!q) return defaultQuestPointsForType(chType);
    const section = String(q.section || "");
    // Generic optional/featured quests should feel different from the monthly photo contest:
    // default them to 5 points unless the chief intentionally edits the stepper.
    if (section === "Featured Quest Pool" || section === "Alternates") return 5;
    return Number(q.points) || defaultQuestPointsForType(chType);
  }

  function pickFromBank(index) {
    setBankPick(index);
    const q = bankOptions[Number(index)];
    if (!q) return;
    setChTitle(q.title);
    setChPoints(bankPointsForQuest(q));
    setChNote(q.note || "");
    setBankCopy(q.launchCopy || "");
    setBankMsg((q.month ? q.section + " · " + q.month : q.section) + (q.evidence ? " · " + q.evidence : ""));
  }

  function copyLaunchCopy() {
    if (!bankCopy) return;
    try {
      navigator.clipboard.writeText(bankCopy);
      setBankMsg("Launch copy on the clipboard — paste it in the group chat.");
    } catch (e) {
      setBankMsg("Copy failed — select and copy the text manually.");
    }
  }

  async function drawRaffle() {
    setDrawBusy(true); setDrawMsg(""); setRaffleResult(null);
    try {
      const r = await chiefGet("raffleDraw", chiefPass);
      if (r.ok) setRaffleResult(r);
      else setDrawMsg(r.error || "The drum came up empty.");
    } catch (e) { setDrawMsg("Draw didn't reach the backend — check your connection."); }
    setDrawBusy(false);
  }

  async function summonGila() {
    setDrawBusy(true); setDrawMsg(""); setGilaResult(null);
    try {
      const r = await chiefGet("gilaDraw", chiefPass);
      if (r.ok) setGilaResult(r);
      else setDrawMsg(r.error || "The Gila Monster is asleep.");
    } catch (e) { setDrawMsg("The Gila Monster didn't answer — check your connection."); }
    setDrawBusy(false);
  }

  async function setSpecial() {
    await postToBackend({
      action: "setSpecial", chief: chiefName, pass: chiefPass, type: spType,
      houseA: spHouseA, houseB: spType === "rivalry" ? spHouseB : "",
      points: spType === "rivalry" ? Number(spPot) || 0 : 0,
      startDate: spStart, endDate: spEnd,
    });
    setSpMsg(spType === "monsoon"
      ? "🌧️ Monsoon declared over House " + spHouseA + (spEnd ? " through " + spEnd : "") + ". Double points from " + spStart + "."
      : "⚔️ Rivalry set: " + spHouseA + " vs " + spHouseB + " for a " + spPot + "-pt pot. Award the pot manually when it ends.");
  }

  function addTarget(raw) {
    const person = findRosterPerson(raw);
    if (!person) { setAwardMsg("Not on the roster — check the spelling."); return; }
    if (targets.some(function dup(t) { return normalizeName(t.name) === normalizeName(person.name); })) { setTargetInput(""); return; }
    setTargets(targets.concat([{ name: person.name, house: person.house }]));
    setTargetInput("");
    setAwardMsg("");
  }

  async function award() {
    const reason = awardReason === "custom" ? awardCustom.trim() : awardReason;
    if (!reason) { setAwardMsg("Give the award a reason."); return; }
    if (mode === "people" && targets.length === 0) { setAwardMsg("Add at least one person."); return; }
    await postToBackend({
      action: "chiefAward",
      chief: chiefName,
      pass: chiefPass,
      date: todayString(),
      points: Number(awardPoints) || 0,
      reason: reason,
      targets: mode === "people" ? targets : [],
      wholeHouse: mode === "house" ? awardHouse : "",
    });
    const who = mode === "house" ? "House " + awardHouse : targets.length + (targets.length === 1 ? " person" : " people");
    setAwardMsg("Awarded " + awardPoints + " pts to " + who + " · " + reason);
    setTargets([]);
    setAwardCustom("");
  }

  async function setChallenge() {
    if (chBusy) return;
    if (!chTitle.trim()) { setChMsg("Give the quest a title."); return; }
    setChBusy(true);
    setChMsg("Saving quest…");
    const cleanTitle = chTitle.trim();
    const cleanNote = chNote.trim();
    const cleanPoints = Number(chPoints) || defaultQuestPointsForType(chType);
    try {
      // Keep the original backend contract, but include common aliases so older/newer
      // Apps Script versions still recognize the quest rotation payload.
      await postToBackend({
        action: "setChallenge",
        actionAlias: "setQuest",
        chief: chiefName,
        chiefName: chiefName,
        pass: chiefPass,
        password: chiefPass,
        type: chType,
        questType: chType,
        challengeType: chType,
        category: chType,
        title: cleanTitle,
        challengeTitle: cleanTitle,
        points: cleanPoints,
        pointValue: cleanPoints,
        endDate: chEnd,
        end: chEnd,
        expires: chEnd,
        expiresOn: chEnd,
        note: cleanNote,
        notes: cleanNote,
        description: cleanNote,
      });
      if (props && typeof props.onQuestSaved === "function") {
        props.onQuestSaved(chType, {
          title: cleanTitle,
          points: cleanPoints,
          endDate: chEnd,
          note: cleanNote,
        });
      }
      setChMsg("Quest set: " + cleanTitle + " (" + cleanPoints + " pts). It should update on the Earn tab now; residents may need a refresh if their phone cached the app." + (bankCopy ? " Launch copy is ready below — paste it in the group chat." : ""));
      setChTitle("");
      setChNote("");
      setBankPick("");
      setBankCopy("");
      setChPoints(defaultQuestPointsForType(chType));
    } catch (e) {
      setChMsg("Quest did not save — check connection/backend deployment, then try again.");
    } finally {
      setChBusy(false);
    }
  }

  async function postAnnouncement() {
    if (!anTitle.trim() && !anBody.trim()) { setAnMsg("Give the dispatch a title or message."); return; }
    await postToBackend({
      action: "setAnnouncement",
      chief: chiefName,
      pass: chiefPass,
      title: anTitle.trim(),
      body: anBody.trim(),
      endDate: anEnd,
    });
    setAnMsg("📣 Desert Dispatch posted. It goes live for residents on their next refresh.");
    setAnTitle("");
    setAnBody("");
  }

  if (!authed) {
    return (
      <div className="pom-card pom-narrow">
        <h2 className="pom-h2">Secret Chief Lair</h2>
        <div className="pom-autofill-decoys" aria-hidden="true">
          <input type="text" name="username" autoComplete="username" tabIndex={-1} />
          <input type="password" name="password" autoComplete="current-password" tabIndex={-1} />
        </div>
        <input
          className="pom-input"
          name="pointomatic-chief-display-name"
          placeholder="Name"
          value={chiefName}
          onChange={function onN(e) { setChiefName(e.target.value); }}
          onPointerDown={function unlockChiefFields() { setChiefFieldsUnlocked(true); }}
          onFocus={function unlockChiefFields() { setChiefFieldsUnlocked(true); }}
          readOnly={!chiefFieldsUnlocked}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
          data-lpignore="true"
          data-1p-ignore="true"
        />
        <input
          className="pom-input"
          name="pointomatic-chief-not-a-saved-password"
          placeholder="get lost punk"
          type="password"
          value={chiefPass}
          onChange={function onP(e) { setChiefPass(e.target.value); }}
          onKeyDown={function onK(e) { if (e.key === "Enter") login(); }}
          onPointerDown={function unlockChiefFields() { setChiefFieldsUnlocked(true); }}
          onFocus={function unlockChiefFields() { setChiefFieldsUnlocked(true); }}
          readOnly={!chiefFieldsUnlocked}
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
          data-lpignore="true"
          data-1p-ignore="true"
        />
        <button type="button" className="pom-btn-primary" onClick={login}>Enter the lair</button>
        {loginMsg && <p className="pom-error">{loginMsg}</p>}
      </div>
    );
  }

  return (
    <div className="pom-glory">
      <section className="pom-card">
        <h2 className="pom-h2">Award points</h2>
        <div className="pom-mode-row">
          <button type="button" className={"pom-mode " + (mode === "people" ? "active" : "")} onClick={function m1() { setMode("people"); }}>People</button>
          <button type="button" className={"pom-mode " + (mode === "house" ? "active" : "")} onClick={function m2() { setMode("house"); }}>Whole house</button>
        </div>
        {mode === "people" && (
          <div>
            <div className="pom-squad-row">
              <input className="pom-input" list="pom-roster" placeholder="Add a person…" value={targetInput}
                onChange={function onT(e) { setTargetInput(e.target.value); }}
                onKeyDown={function onK(e) { if (e.key === "Enter") { e.preventDefault(); addTarget(targetInput); } }}
                autoComplete="off" />
              <button type="button" className="pom-btn-secondary" onClick={function add() { addTarget(targetInput); }}>Add</button>
            </div>
            <div className="pom-squad-chips">
              {targets.map(function chip(t, i) {
                return <PersonChip key={t.name} name={t.name} house={t.house} onRemove={function rm() { setTargets(targets.filter(function keep(_, j) { return j !== i; })); }} />;
              })}
            </div>
          </div>
        )}
        {mode === "house" && (
          <select className="pom-input" value={awardHouse} onChange={function onH(e) { setAwardHouse(e.target.value); }}>
            {HOUSES.map(function opt(h) { return <option key={h} value={h}>House {h}</option>; })}
          </select>
        )}
        <div className="pom-stepper-row">
          <button type="button" className="pom-step-btn" onClick={function dn() { setAwardPoints(Math.max(1, awardPoints - 1)); }}>−</button>
          <span className="pom-step-val">{awardPoints} pts</span>
          <button type="button" className="pom-step-btn" onClick={function up() { setAwardPoints(awardPoints + 1); }}>+</button>
        </div>
        <div className="pom-preset-row">
          {AWARD_PRESETS.map(function p(preset) {
            return <button key={preset} type="button" className={"pom-preset " + (awardReason === preset ? "active" : "")} onClick={function pick() { setAwardReason(preset); }}>{preset}</button>;
          })}
          <button type="button" className={"pom-preset " + (awardReason === "custom" ? "active" : "")} onClick={function pickC() { setAwardReason("custom"); }}>Custom…</button>
        </div>
        {awardReason === "custom" && (
          <input className="pom-input" placeholder="Reason for the award" value={awardCustom} onChange={function onC(e) { setAwardCustom(e.target.value); }} />
        )}
        <button type="button" className="pom-btn-primary" onClick={award}>Award points</button>
        {awardMsg && <p className="pom-ok">{awardMsg}</p>}
      </section>

      <section className="pom-card">
        <h2 className="pom-h2">Rotate the quests</h2>
        <p className="pom-hint">Sets the monthly wellness quest, monthly photo quest, or optional quest/bounty residents see on the Earn tab. Optional quests default to 5 points; monthly photo quests can stay at 3 unless you change the stepper.</p>
        <select className="pom-input" value={chType} onChange={function onT(e) { const nextType = e.target.value; setChType(nextType); setChPoints(defaultQuestPointsForType(nextType)); setBankPick(""); setBankCopy(""); setBankMsg(""); }}>
          <option value="wellness">🌵 Monthly wellness quest</option>
          <option value="photo">📸 Monthly photo quest</option>
          <option value="bounty">🎯 Optional quest / bounty</option>
        </select>
        {bankOptions.length > 0 && (
          <select className="pom-input pom-bank-select" value={bankPick} onChange={function onPick(e) { pickFromBank(e.target.value); }}>
            <option value="">📚 Pick from the Challenge Bank ({bankOptions.length})…</option>
            {bankOptions.map(function opt(q, i) {
              return <option key={i} value={i}>{(q.section ? q.section + " · " : "") + (q.month ? q.month + " — " : "") + q.title + " · " + bankPointsForQuest(q) + " pts"}</option>;
            })}
          </select>
        )}
        <input className="pom-input" placeholder="Quest title (e.g., Sunrise on Tumamoc)" value={chTitle} onChange={function onTi(e) { setChTitle(e.target.value); }} />
        <input className="pom-input" placeholder="Helper note shown under the quest (optional)" value={chNote} onChange={function onNo(e) { setChNote(e.target.value); }} />
        <div className="pom-stepper-row">
          <button type="button" className="pom-step-btn" onClick={function dn() { setChPoints(Math.max(1, chPoints - 1)); }}>−</button>
          <span className="pom-step-val">{chPoints} pts</span>
          <button type="button" className="pom-step-btn" onClick={function up() { setChPoints(chPoints + 1); }}>+</button>
        </div>
        <label className="pom-hint" htmlFor="pom-ch-end">Quest ends (optional)</label>
        <input id="pom-ch-end" className="pom-input" type="date" value={chEnd} onChange={function onE(e) { setChEnd(e.target.value); }} />
        <button type="button" className="pom-btn-primary" onClick={setChallenge} disabled={chBusy}>{chBusy ? "Saving…" : "Set the quest"}</button>
        {bankCopy && (
          <div className="pom-launchcopy">
            <span>📣 {bankCopy}</span>
            <button type="button" className="pom-btn-secondary" onClick={copyLaunchCopy}>Copy for GroupMe</button>
          </div>
        )}
        {bankMsg && <p className="pom-hint">{bankMsg}</p>}
        {chMsg && <p className="pom-ok">{chMsg}</p>}
      </section>

      <section className="pom-card">
        <h2 className="pom-h2">📣 Desert Dispatch</h2>
        <p className="pom-hint">Chief-selected announcement banner for the Earn and Glory tabs. Good for the current house-selected activity, bonus pushes, or lounge propaganda.</p>
        <input className="pom-input" placeholder="Headline (e.g., Catalina coffee cartel hour)" value={anTitle} onChange={function onTi(e) { setAnTitle(e.target.value); }} />
        <textarea className="pom-input pom-textarea" rows={3} placeholder="Message (optional but encouraged)" value={anBody} onChange={function onBo(e) { setAnBody(e.target.value); }} />
        <label className="pom-hint" htmlFor="pom-an-end">Dispatch ends (optional)</label>
        <input id="pom-an-end" className="pom-input" type="date" value={anEnd} onChange={function onAn(e) { setAnEnd(e.target.value); }} />
        <button type="button" className="pom-btn-primary" onClick={postAnnouncement}>Post the dispatch</button>
        {anMsg && <p className="pom-ok">{anMsg}</p>}
      </section>

      <section className="pom-card">
        <h2 className="pom-h2">🎰 The draws</h2>
        <p className="pom-hint">Raffle: every resident submission this month = one ticket. Gila Monster: one random submission from the past 7 days wins an instant prize. Announce both with maximum drama.</p>
        <div className="pom-draw-row">
          <button type="button" className="pom-btn-primary" onClick={drawRaffle} disabled={drawBusy}>🎟️ Draw the monthly raffle</button>
          <button type="button" className="pom-btn-primary pom-btn-gila" onClick={summonGila} disabled={drawBusy}>🦎 Summon the Gila Monster</button>
        </div>
        {drawMsg && <p className="pom-error">{drawMsg}</p>}
        {raffleResult && (
          <div className="pom-draw-result">
            🎟️ <strong>{raffleResult.winner}</strong> (House {raffleResult.house}) wins the {raffleResult.month} raffle —
            held {raffleResult.winnerTickets} of {raffleResult.totalTickets} tickets in the drum.
          </div>
        )}
        {gilaResult && (
          <div className="pom-draw-result pom-gila-result">
            🦎 THE GILA MONSTER HAS CHOSEN: <strong>{gilaResult.name}</strong> (House {gilaResult.house}) for
            &ldquo;{gilaResult.activity}&rdquo; on {gilaResult.date} — out of {gilaResult.poolSize} submissions this week.
            {gilaResult.photoUrl && <img src={gilaResult.photoUrl} alt="Winning submission" className="pom-gila-photo" />}
          </div>
        )}
      </section>

      <section className="pom-card">
        <h2 className="pom-h2">🌧️ Monsoon &amp; ⚔️ Rivalry</h2>
        <div className="pom-mode-row">
          <button type="button" className={"pom-mode " + (spType === "monsoon" ? "active" : "")} onClick={function m1() { setSpType("monsoon"); }}>Monsoon (2x week)</button>
          <button type="button" className={"pom-mode " + (spType === "rivalry" ? "active" : "")} onClick={function m2() { setSpType("rivalry"); }}>Rivalry week</button>
        </div>
        {spType === "monsoon" && <p className="pom-hint">Give the last-place house a double-points week each quarter. Points earned inside the window count 2x automatically.</p>}
        {spType === "rivalry" && <p className="pom-hint">Head-to-head for a point pot — the Glory tab tracks the live tally. When it ends, award the pot to the winner with the Award button above.</p>}
        <select className="pom-input" value={spHouseA} onChange={function onA(e) { setSpHouseA(e.target.value); }}>
          {HOUSES.map(function opt(h) { return <option key={h} value={h}>House {h}</option>; })}
        </select>
        {spType === "rivalry" && (
          <select className="pom-input" value={spHouseB} onChange={function onB(e) { setSpHouseB(e.target.value); }}>
            {HOUSES.filter(function nf(h) { return h !== spHouseA; }).map(function opt(h) { return <option key={h} value={h}>vs House {h}</option>; })}
          </select>
        )}
        {spType === "rivalry" && (
          <div className="pom-stepper-row">
            <button type="button" className="pom-step-btn" onClick={function dn() { setSpPot(Math.max(1, spPot - 1)); }}>−</button>
            <span className="pom-step-val">{spPot} pt pot</span>
            <button type="button" className="pom-step-btn" onClick={function up() { setSpPot(spPot + 1); }}>+</button>
          </div>
        )}
        <label className="pom-hint" htmlFor="pom-sp-start">Starts</label>
        <input id="pom-sp-start" className="pom-input" type="date" value={spStart} onChange={function onS(e) { setSpStart(e.target.value); }} />
        <label className="pom-hint" htmlFor="pom-sp-end">Ends</label>
        <input id="pom-sp-end" className="pom-input" type="date" value={spEnd} onChange={function onE(e) { setSpEnd(e.target.value); }} />
        <button type="button" className="pom-btn-primary" onClick={setSpecial}>{spType === "monsoon" ? "Declare the monsoon" : "Start the rivalry"}</button>
        {spMsg && <p className="pom-ok">{spMsg}</p>}
      </section>

      <section className="pom-card">
        <h2 className="pom-h2">⭐ All-Star of the Month bench</h2>
        <p className="pom-hint">Recent shout-outs for judging. Pick the best-written one each month — prize the nominee <em>and</em> the nominator via Award points.</p>
        {shoutFeed.length === 0 && <p className="pom-hint">No shout-outs on the bench yet.</p>}
        <ul className="pom-fame">
          {shoutFeed.map(function sh(s, i) {
            return (
              <li key={i}>
                <span className="pom-fame-to" style={{ color: HOUSE_COLORS[s.house] || "#888" }}>⭐ {s.to}</span>
                <span className="pom-fame-note">{s.note}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="pom-card">
        <h2 className="pom-h2">Nerd stuff</h2>
        <p className="pom-hint">
          Evidence photos land in the <a href={GOOGLE_EVIDENCE_FOLDER_URL} target="_blank" rel="noreferrer">House Cup Evidence Folder</a>.
          The full points log lives in the Point-o-matic Sheet under {ADMIN_EMAIL}. Conference Tracker appends 1 pt per conference
          attended every Monday morning — those rows show up in the Range Race automatically.
        </p>
      </section>
    </div>
  );
}

/* ------------------------- Styles ------------------------- */

function PomStyles() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Nunito+Sans:wght@400;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

:root {
  --sky: #FFF1C7;
  --paper: #FFF7D6;
  --ink: #1F1B16;
  --ink-soft: #6B5438;
  --sunset: #FF6B00;
  --sunset-deep: #D9480F;
  --gold: #FFE66D;
  --line: #1F1B16;
  --retro-green: #2FEE68;
  --retro-pink: #FF4D8D;
  --retro-blue: #20C7FF;
}
* { box-sizing: border-box; }
html, body, #root { margin: 0; padding: 0; }
body {
  background:
    radial-gradient(circle at 14% 12%, rgba(255,230,109,0.46), transparent 20%),
    radial-gradient(circle at 86% 8%, rgba(255,77,141,0.14), transparent 18%),
    linear-gradient(180deg, #FFF5D6 0%, #FFE0A3 28%, #FFD0A8 55%, #FFF4E5 100%);
  color: var(--ink);
  font-family: 'Nunito Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}
body::before {
  content: "";
  position: fixed;
  left: 0; right: 0; bottom: 0;
  height: 34vh;
  pointer-events: none;
  background:
    linear-gradient(180deg, transparent 0%, rgba(255,255,255,0) 18%),
    linear-gradient(0deg, rgba(31,27,22,0.10), rgba(31,27,22,0.10)),
    linear-gradient(135deg, transparent 36%, rgba(121, 74, 30, 0.10) 36% 46%, transparent 46%),
    linear-gradient(225deg, transparent 34%, rgba(121, 74, 30, 0.12) 34% 48%, transparent 48%),
    linear-gradient(180deg, transparent 0%, rgba(217,72,15,0.08) 100%);
  clip-path: polygon(0 100%, 0 68%, 12% 60%, 21% 67%, 33% 50%, 44% 63%, 55% 42%, 67% 61%, 79% 49%, 89% 58%, 100% 46%, 100% 100%);
  z-index: -1;
}
.pom-shell { max-width: 640px; margin: 0 auto; padding: 20px 16px 120px; }
.pom-header {
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: 14px 12px 0;
  margin: 0 0 18px;
  border: 3px solid var(--ink);
  border-radius: 22px;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.65), transparent 40%),
    radial-gradient(circle at 82% 24%, rgba(255,230,109,0.75), transparent 18%),
    linear-gradient(180deg, #FFF7D6 0%, #FFD89A 56%, #FFC078 100%);
  box-shadow: 7px 7px 0 var(--ink);
}
.pom-header::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(0deg, rgba(31,27,22,0.05) 0 1px, transparent 1px 5px);
  mix-blend-mode: multiply;
}
.pom-kicker {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--ink);
  border-radius: 999px;
  background: #1F1B16;
  color: var(--gold);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  padding: 5px 10px;
  margin-bottom: 10px;
  text-transform: uppercase;
}
.pom-title {
  position: relative;
  z-index: 1;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: 42px;
  line-height: 0.95;
  letter-spacing: -0.5px;
  margin: 0;
  color: var(--ink);
  text-shadow: 3px 3px 0 var(--gold), 5px 5px 0 var(--retro-pink);
}
.pom-tag {
  position: relative;
  z-index: 1;
  display: inline-flex;
  margin: 10px 0 12px;
  padding: 5px 12px;
  border: 2px solid var(--ink);
  border-radius: 999px;
  background: #FFFDF9;
  color: var(--ink);
  font-size: 13px;
  font-weight: 800;
}
.pom-ticker {
  position: relative;
  z-index: 1;
  margin: 0 -12px;
  border-top: 3px solid var(--ink);
  background: #12100E;
  color: var(--retro-green);
  overflow: hidden;
  white-space: nowrap;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.pom-ticker-track {
  display: flex;
  width: max-content;
  animation: pom-ticker-scroll 24s linear infinite;
}
.pom-ticker-track span {
  display: inline-block;
  padding: 9px 18px;
  text-shadow: 0 0 8px rgba(47,238,104,0.72);
}

@media (pointer: fine) {
  .pom-ticker,
  .pom-ticker * {
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ctext x='4' y='25' font-size='25'%3E%F0%9F%8C%B5%3C/text%3E%3C/svg%3E") 9 4, pointer;
  }
}
@keyframes pom-ticker-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.pom-webmaster {
  position: relative; z-index: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; margin: 16px auto 18px;
  border: 2px solid var(--ink); border-radius: 999px; padding: 8px 13px; background: linear-gradient(180deg, #fff 0%, #FFF3BF 100%);
  color: var(--ink); text-decoration: none; font-size: 12px; font-weight: 900;
  box-shadow: 3px 3px 0 var(--ink); text-transform: uppercase; letter-spacing: 0.02em;
}
.pom-webmaster:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--ink); }
.pom-dispatch {
  margin: 0 0 14px; padding: 12px 14px; border: 3px solid var(--ink); border-radius: 16px;
  background: linear-gradient(135deg, #FFF3BF 0%, #FFE8CC 100%); box-shadow: 4px 4px 0 rgba(31,27,22,0.9);
}
.pom-dispatch strong { display: block; margin-bottom: 3px; font-size: 14px; }
.pom-dispatch span { color: var(--ink-soft); font-size: 13px; }

.pom-quarter-card {
  background:
    linear-gradient(135deg, rgba(255,230,109,0.6), rgba(255,107,0,0.14)),
    var(--paper);
}
.pom-scope-topline {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  margin-bottom: 10px; flex-wrap: wrap;
}
.pom-quarter-badge {
  display: inline-flex; align-items: center; border: 2px solid var(--ink); border-radius: 999px;
  padding: 4px 10px; background: #1F1B16; color: var(--gold);
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 800; letter-spacing: 0.05em;
  text-transform: uppercase;
}
.pom-countdown {
  font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 800; color: var(--sunset-deep);
  background: #FFFDF9; border: 2px solid var(--ink); border-radius: 999px; padding: 4px 10px;
}
.pom-scope-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
.pom-scope-btn {
  border: 3px solid var(--ink); border-radius: 12px; padding: 11px 10px; background: #FFFDF9; color: var(--ink);
  font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 900; text-transform: uppercase; cursor: pointer;
  box-shadow: 3px 3px 0 var(--ink);
}
.pom-scope-btn.active { background: var(--ink); color: var(--gold); box-shadow: 3px 3px 0 var(--retro-pink); }
.pom-my-card { background: linear-gradient(180deg, #FFFDF9 0%, #FFF7D6 100%); }
.pom-my-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.pom-my-head .pom-h2 { margin-top: 8px; margin-bottom: 0; }
.pom-my-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.pom-my-grid div {
  border: 2px solid var(--ink); border-radius: 14px; background: #fff; padding: 10px 12px;
  box-shadow: 2px 2px 0 var(--ink);
}
.pom-my-grid span { display: block; color: var(--ink-soft); font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.04em; }
.pom-my-grid strong { display: block; margin-top: 2px; font-family: 'Bricolage Grotesque', sans-serif; font-size: 26px; line-height: 1; color: var(--ink); }
.pom-my-motivator { margin-top: 12px !important; margin-bottom: 0 !important; font-weight: 800; color: var(--sunset-deep); }

.pom-card {
  background: var(--paper); border: 3px solid var(--line); border-radius: 18px;
  padding: 18px; margin-bottom: 14px; box-shadow: 5px 5px 0 rgba(31,27,22,0.92);
}
.pom-narrow { max-width: 380px; margin-left: auto; margin-right: auto; }
.pom-center { text-align: center; }
.pom-h2, .pom-step {
  font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700;
  font-size: 20px; margin: 0 0 10px; display: flex; align-items: center; gap: 8px;
}
.pom-step-n {
  display: inline-flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 50%; background: var(--ink); color: #fff;
  font-size: 14px; font-family: 'IBM Plex Mono', monospace;
}
.pom-hint { color: var(--ink-soft); font-size: 13px; margin: 0 0 10px; }
.pom-asof { color: var(--ink-soft); font-size: 12px; margin: 10px 0 0; text-align: center; }
.pom-error { color: #C92A2A; font-size: 13px; font-weight: 700; margin: 8px 0 0; }
.pom-ok { color: #2B8A3E; font-size: 13px; font-weight: 700; margin: 8px 0 0; }
.pom-optional, .pom-required { font-style: normal; font-size: 12px; font-weight: 600; color: var(--ink-soft); }
.pom-required { color: var(--sunset-deep); }

.pom-input {
  width: 100%; border: 2px solid var(--line); border-radius: 12px;
  padding: 12px 14px; font-size: 16px; font-family: inherit; color: var(--ink);
  background: #fff; margin-bottom: 10px;
}
.pom-input:focus { outline: 3px solid var(--gold); border-color: var(--sunset); }
.pom-input-big { font-size: 20px; font-weight: 700; }
.pom-textarea { resize: vertical; }

.pom-me { display: flex; align-items: center; gap: 10px; }
.pom-me-hi { font-weight: 700; color: var(--sunset-deep); }
.pom-chip {
  display: inline-flex; align-items: center; gap: 4px; border: 2px solid; border-radius: 999px;
  padding: 4px 12px; font-weight: 800; font-size: 14px;
}
.pom-personchip {
  display: inline-flex; align-items: center; gap: 6px; border: 2px solid; border-radius: 999px;
  padding: 4px 10px; font-weight: 700; font-size: 13px; background: #fff; margin: 0 6px 6px 0;
}
.pom-personchip-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.pom-chip-x { border: 0; background: none; font-size: 16px; cursor: pointer; color: var(--ink-soft); padding: 0 2px; }

.pom-quests { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
.pom-quest-card {
  background: var(--paper); border: 2px dashed; border-radius: 16px; padding: 12px;
  display: flex; flex-direction: column; gap: 4px; font-size: 14px;
}
.pom-quest-kicker { font-size: 11px; font-weight: 800; letter-spacing: 0.4px; text-transform: uppercase; color: var(--ink-soft); }
.pom-quest-note { font-size: 12px; color: var(--ink-soft); font-weight: 600; }
.pom-bounty-note { display: block; font-size: 12px; font-weight: 600; opacity: 0.92; margin-top: 4px; }
.pom-bank-select { border-style: dashed; font-weight: 700; }
.pom-launchcopy {
  display: flex; align-items: center; gap: 10px; margin-top: 12px;
  background: #FFF3BF; border: 2px dashed var(--gold); border-radius: 12px; padding: 10px 12px; font-size: 13px; font-weight: 600;
}
.pom-launchcopy span { flex: 1; }
.pom-launchcopy .pom-btn-secondary { white-space: nowrap; }

.pom-acts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.pom-act {
  border: 3px solid var(--line); border-radius: 16px; background: #fff; cursor: pointer;
  padding: 12px 10px; display: flex; flex-direction: column; align-items: center; gap: 4px;
  font-family: inherit; transition: transform 0.08s ease, box-shadow 0.08s ease;
  box-shadow: 3px 3px 0 var(--ink);
}
.pom-act:hover { transform: translate(-1px, -2px); box-shadow: 5px 5px 0 var(--ink); }
.pom-act.active { border-color: var(--ink); background: #FFF0E0; box-shadow: 4px 4px 0 var(--sunset); }
.pom-info-act { background: #FFF3BF; }
.pom-act-wide { grid-column: 1 / -1; max-width: 240px; width: 100%; justify-self: center; }
.pom-act-icon { font-size: 26px; }
.pom-act-label { font-weight: 800; font-size: 14px; text-align: center; }
.pom-act-pts { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; color: var(--sunset-deep); }
.pom-act-blurb { color: var(--ink-soft); font-size: 13px; margin: 10px 0; }
.pom-request-box { margin-top: 10px; }
.pom-why-box {
  margin-top: 12px; padding: 12px 14px; border: 2px dashed var(--ink); border-radius: 12px;
  background: #FFF9DB; color: var(--ink); font-size: 13px; line-height: 1.45;
}
.pom-why-box ul { margin: 8px 0 0; padding-left: 18px; }
.pom-why-box li { margin: 5px 0; }

.pom-squad-row { display: flex; gap: 8px; }
.pom-squad-row .pom-input { margin-bottom: 0; }
.pom-squad-chips { margin-top: 10px; }

.pom-autofill-decoys {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  left: -9999px;
}

.pom-file-hidden { position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden; }
.pom-photo-drop {
  display: block; text-align: center; border: 2px dashed var(--sunset); border-radius: 16px;
  padding: 26px 12px; font-weight: 800; color: var(--sunset-deep); cursor: pointer; background: #FFF7EE;
  margin-bottom: 10px;
}
.pom-photo-preview { display: flex; align-items: flex-end; gap: 10px; margin-bottom: 10px; }
.pom-photo-preview img { width: 130px; height: 130px; object-fit: cover; border-radius: 14px; border: 3px solid #fff; box-shadow: 0 3px 10px rgba(61,43,82,0.25); transform: rotate(-2deg); }
.pom-upload-note { margin: -2px 0 10px; color: var(--ink-soft); font-size: 12px; font-weight: 800; }

.pom-btn-primary {
  border: 0; border-radius: 12px; background: var(--ink); color: #fff; font-family: inherit;
  font-weight: 800; font-size: 15px; padding: 12px 18px; cursor: pointer; width: 100%;
}
.pom-btn-secondary {
  border: 2px solid var(--line); border-radius: 12px; background: #fff; color: var(--ink);
  font-family: inherit; font-weight: 700; font-size: 14px; padding: 10px 14px; cursor: pointer; flex-shrink: 0;
}

.pom-mash-zone { text-align: center; padding: 12px 0 8px; position: relative; }
.pom-mash {
  width: 190px; height: 190px; border-radius: 50%; border: 0; cursor: pointer;
  background: radial-gradient(circle at 32% 28%, #FFA94D, var(--sunset) 55%, #C2255C 120%);
  color: #fff; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 26px;
  letter-spacing: 0.5px; box-shadow: 0 10px 0 #A61E4D, 0 16px 30px rgba(166,30,77,0.35);
  display: inline-flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  transition: transform 0.08s ease, box-shadow 0.08s ease, filter 0.2s ease;
}
.pom-mash:active { transform: translateY(8px) scale(0.97); box-shadow: 0 2px 0 #A61E4D, 0 6px 14px rgba(166,30,77,0.3); }
.pom-mash.locked { filter: grayscale(0.75) brightness(1.05); cursor: not-allowed; box-shadow: 0 6px 0 #999; }
.pom-mash-sub { font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 600; opacity: 0.95; }
.pom-mash-hint { color: var(--ink-soft); font-weight: 700; font-size: 14px; margin: 12px 0 0; }
.pom-burst {
  font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 22px;
  color: var(--sunset-deep); animation: pom-pop 0.5s ease; margin-bottom: 10px;
}
@keyframes pom-pop { 0% { transform: scale(0.3); opacity: 0; } 70% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }

.pom-confetti {
  position: fixed; z-index: 999; pointer-events: none;
  animation: pom-fly 1.2s ease-out forwards;
}
@keyframes pom-fly {
  0% { transform: translate(0,0) rotate(0); opacity: 1; }
  100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 0; }
}

.pom-peaks { display: flex; align-items: flex-end; gap: 8px; height: 220px; padding-top: 26px; }
.pom-peak-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
.pom-peak-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.pom-peak {
  width: 100%; position: relative; min-height: 14px;
  clip-path: polygon(0 100%, 0 62%, 22% 34%, 38% 52%, 55% 8%, 72% 40%, 88% 22%, 100% 48%, 100% 100%);
  transition: height 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}
.pom-peak.leader { filter: drop-shadow(0 0 8px rgba(255,197,61,0.9)); }
.pom-flag { position: absolute; top: -2px; left: 48%; font-size: 16px; }
.pom-peak-pts { font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 16px; margin-bottom: 4px; }
.pom-peak-name { font-weight: 800; font-size: 11px; margin-top: 6px; text-align: center; }

.pom-scorers { list-style: none; margin: 0; padding: 0; }
.pom-scorers li { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px dashed var(--line); font-size: 15px; }
.pom-scorers li:last-child { border-bottom: 0; }
.pom-medal { width: 32px; font-weight: 800; font-family: 'IBM Plex Mono', monospace; }
.pom-scorer-name { flex: 1; font-weight: 700; }
.pom-scorer-pts { font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--sunset-deep); }

.pom-wall { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.pom-polaroid {
  margin: 0; background: #fff; border: 2px solid; border-radius: 6px; padding: 6px 6px 8px;
  box-shadow: 0 4px 10px rgba(61,43,82,0.15); transform: rotate(-1.2deg);
}
.pom-polaroid:nth-child(even) { transform: rotate(1.4deg); }
.pom-polaroid img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 3px; display: block; }
.pom-polaroid figcaption { display: flex; flex-direction: column; padding-top: 6px; font-size: 11px; color: var(--ink-soft); }
.pom-polaroid figcaption strong { color: var(--ink); font-size: 12px; }

.pom-spinner { font-size: 34px; display: inline-block; animation: pom-spin 1.4s linear infinite; }
@keyframes pom-spin { to { transform: rotate(360deg); } }

.pom-tabs {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
  display: flex; justify-content: center; gap: 6px;
  background: rgba(255,247,214,0.97); border-top: 3px solid var(--line);
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  backdrop-filter: blur(6px);
}
.pom-tab {
  border: 2px solid var(--ink); background: #fff; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800;
  font-size: 15px; padding: 10px 18px; border-radius: 999px; cursor: pointer; color: var(--ink);
  box-shadow: 2px 2px 0 var(--ink);
}
.pom-tab.active { background: var(--ink); color: var(--gold); }
.pom-tab:focus-visible, .pom-mash:focus-visible, .pom-act:focus-visible, .pom-btn-primary:focus-visible { outline: 3px solid var(--gold); outline-offset: 2px; }

.pom-mode-row, .pom-preset-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
.pom-mode, .pom-preset {
  border: 2px solid var(--line); border-radius: 999px; background: #fff; cursor: pointer;
  font-family: inherit; font-weight: 700; font-size: 13px; padding: 8px 14px;
}
.pom-mode.active, .pom-preset.active { border-color: var(--sunset); background: #FFF0E0; }
.pom-stepper-row { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
.pom-step-btn {
  width: 42px; height: 42px; border-radius: 50%; border: 2px solid var(--line); background: #fff;
  font-size: 20px; font-weight: 800; cursor: pointer;
}
.pom-step-val { font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 18px; min-width: 64px; text-align: center; }

.pom-monsoon {
  background: linear-gradient(92deg, #364FC7, #1971C2); color: #fff; border-radius: 16px;
  padding: 12px 16px; font-weight: 700; font-size: 14px; margin-bottom: 14px; text-align: center;
}
.pom-bounty-banner {
  background: linear-gradient(92deg, #E8590C, #C2255C); color: #fff; border-radius: 16px;
  padding: 12px 16px; font-weight: 700; font-size: 14px; margin-bottom: 14px; text-align: center;
}
.pom-bounty-pts { font-family: 'IBM Plex Mono', monospace; }
.pom-act.bounty { border-color: #E8590C; background: #FFF0E6; box-shadow: 0 3px 0 #C2255C; }
.pom-raffle-note { color: var(--ink-soft); font-size: 12px; font-weight: 700; margin: 14px 0 0; }

.pom-trophies { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 14px; }
.pom-trophy { border-radius: 999px; padding: 6px 14px; font-size: 13px; }
.pom-trophy.gold { background: #FFF3BF; border: 2px solid var(--gold); }
.pom-trophy.shame { background: #F1F3F5; border: 2px dashed #ADB5BD; color: #495057; }

.pom-versus { display: flex; align-items: center; justify-content: space-between; margin: 6px 0 10px; }
.pom-versus-side { display: flex; flex-direction: column; align-items: center; font-size: 16px; }
.pom-versus-pts { font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 28px; }
.pom-versus-vs { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; color: var(--ink-soft); }
.pom-versus-bar { display: flex; height: 14px; border-radius: 999px; overflow: hidden; border: 2px solid var(--line); }
.pom-versus-bar div { transition: width 0.7s ease; }

.pom-hero-fig { margin: 0; border: 3px solid; border-radius: 10px; padding: 8px; background: #fff; box-shadow: 0 6px 16px rgba(61,43,82,0.2); }
.pom-hero-fig img { width: 100%; max-height: 340px; object-fit: cover; border-radius: 6px; display: block; }
.pom-hero-fig figcaption { padding-top: 8px; font-size: 13px; color: var(--ink-soft); }

.pom-vote {
  width: 100%; margin-top: 6px; border: 2px solid var(--line); border-radius: 8px; background: #fff;
  font-family: inherit; font-weight: 700; font-size: 12px; padding: 6px 4px; cursor: pointer;
}
.pom-vote.voted { border-color: #2B8A3E; background: #EBFBEE; color: #2B8A3E; }

.pom-fame { list-style: none; margin: 0; padding: 0; }
.pom-fame li { padding: 10px 0; border-bottom: 1px dashed var(--line); display: flex; flex-direction: column; gap: 3px; }
.pom-fame li:last-child { border-bottom: 0; }
.pom-fame-to { font-weight: 800; font-size: 14px; }
.pom-fame-note { color: var(--ink-soft); font-size: 13px; }

.pom-draw-row { display: flex; flex-direction: column; gap: 10px; }
.pom-btn-gila { background: linear-gradient(92deg, #E8590C, #F59F00); }
.pom-draw-result {
  margin-top: 12px; background: #FFF3BF; border: 2px solid var(--gold); border-radius: 14px;
  padding: 12px 14px; font-size: 14px; animation: pom-pop 0.5s ease;
}
.pom-gila-result { background: #FFE8CC; border-color: #E8590C; }
.pom-gila-photo { display: block; width: 140px; border-radius: 10px; margin-top: 10px; }

.pom-theme-toggle {
  position: absolute; top: 10px; right: 10px; z-index: 5;
  border: 2px solid var(--ink); border-radius: 999px; background: var(--paper); color: var(--ink);
  font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 11px; letter-spacing: 0.5px;
  padding: 6px 10px; cursor: pointer; box-shadow: 2px 2px 0 var(--ink);
}
.pom-theme-toggle:active { transform: translate(2px, 2px); box-shadow: none; }

/* =====================================================================
   RETRO MODE — a loving tribute to the original GeoCities-era
   Point-O-Matic. Navy text, magenta WordArt, beveled buttons, and a
   status bar that has been ONLINE since 1997.
   ===================================================================== */
@keyframes pom-blink { 50% { opacity: 0; } }
.pom-blink { animation: pom-blink 1s step-start infinite; }

body[data-pom-theme="retro"] {
  --sky: #FFFDE7; --paper: #FFFEF0; --ink: #000080; --ink-soft: #334155;
  --sunset: #D4006A; --sunset-deep: #D4006A; --gold: #FFEB3B; --line: #000080;
  background: #FFFDE7 repeating-linear-gradient(0deg, transparent 0 22px, rgba(0,0,128,0.05) 22px 23px);
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
body[data-pom-theme="retro"]::before { display: none; }

body[data-pom-theme="retro"] .pom-header { border-radius: 0; border: 3px double #000080; box-shadow: 6px 6px 0 #000080; }
body[data-pom-theme="retro"] .pom-header::before { display: none; }
body[data-pom-theme="retro"] .pom-title {
  font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: 900; text-transform: uppercase;
  background: none; -webkit-text-fill-color: #D4006A; color: #D4006A;
  text-shadow: 2px 2px 0 #fff, 4px 4px 0 #000;
}
body[data-pom-theme="retro"] .pom-kicker { font-family: 'Courier New', monospace; color: #000080; }
body[data-pom-theme="retro"] .pom-tag { font-family: 'Courier New', monospace; font-weight: 700; }
body[data-pom-theme="retro"] .pom-ticker { background: #000080; border-radius: 0; }
body[data-pom-theme="retro"] .pom-ticker-track span { color: #00FF66; font-family: 'Courier New', monospace; }

.pom-counterbar {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 16px; margin-top: 2px;
  font-family: 'Courier New', monospace; font-size: 11px; font-weight: 700; color: #000080;
}
.pom-underconstruction { background: repeating-linear-gradient(45deg, #FFEB3B 0 8px, #111 8px 16px); color: #fff; text-shadow: 1px 1px 0 #000; padding: 2px 8px; }
.pom-online { color: #00A335; }
.pom-bestviewed { color: #334155; }

body[data-pom-theme="retro"] .pom-card,
body[data-pom-theme="retro"] .pom-quest-card {
  border-radius: 0; border: 2px solid #000080; box-shadow: 4px 4px 0 #000080; background: #FFFEF0;
}
body[data-pom-theme="retro"] .pom-h2, body[data-pom-theme="retro"] .pom-step {
  font-family: Verdana, Geneva, Tahoma, sans-serif; text-transform: uppercase; letter-spacing: 0.5px; font-size: 17px;
}
body[data-pom-theme="retro"] .pom-input { border-radius: 0; border: 2px inset #d9d9d9; background: #fff; font-family: 'Courier New', monospace; font-weight: 700; }
body[data-pom-theme="retro"] .pom-btn-primary, body[data-pom-theme="retro"] .pom-btn-secondary {
  border-radius: 0; border: 3px outset #d9d9d9; background: #FFEB3B; color: #000080;
  font-family: Verdana, Geneva, Tahoma, sans-serif; text-transform: uppercase; box-shadow: none;
}
body[data-pom-theme="retro"] .pom-btn-primary:active, body[data-pom-theme="retro"] .pom-btn-secondary:active { border-style: inset; }

body[data-pom-theme="retro"] .pom-act { border-radius: 0; border: 2px solid #000080; box-shadow: 3px 3px 0 #000080; }
body[data-pom-theme="retro"] .pom-act:nth-child(6n+1) { background: #FFD6EF; }
body[data-pom-theme="retro"] .pom-act:nth-child(6n+2) { background: #FFF7B8; }
body[data-pom-theme="retro"] .pom-act:nth-child(6n+3) { background: #D6F5FF; }
body[data-pom-theme="retro"] .pom-act:nth-child(6n+4) { background: #E3FFD6; }
body[data-pom-theme="retro"] .pom-act:nth-child(6n+5) { background: #FFE0BD; }
body[data-pom-theme="retro"] .pom-act:nth-child(6n+6) { background: #EAD6FF; }
body[data-pom-theme="retro"] .pom-act.active { outline: 3px dashed #D4006A; outline-offset: 2px; }
body[data-pom-theme="retro"] .pom-act-pts { font-family: 'Courier New', monospace; color: #D4006A; }

body[data-pom-theme="retro"] .pom-mash {
  border-radius: 0; background: #D4006A; font-family: Verdana, Geneva, Tahoma, sans-serif;
  border: 4px outset #ff9ccb; box-shadow: 8px 8px 0 #000080;
}
body[data-pom-theme="retro"] .pom-mash:active { border-style: inset; transform: translate(4px, 4px); box-shadow: 4px 4px 0 #000080; }
body[data-pom-theme="retro"] .pom-mash-sub { font-family: 'Courier New', monospace; }
body[data-pom-theme="retro"] .pom-mash:not(.locked):not(:disabled) .pom-mash-sub { animation: pom-blink 1.4s step-start infinite; }

body[data-pom-theme="retro"] .pom-tabs { background: #000080; border-top: 3px double #FFEB3B; }
body[data-pom-theme="retro"] .pom-tab { color: #FFFDE7; font-family: 'Courier New', monospace; font-weight: 700; border-radius: 0; }
body[data-pom-theme="retro"] .pom-tab.active { background: #FFEB3B; color: #000080; }

body[data-pom-theme="retro"] .pom-polaroid { border-radius: 0; transform: none; }
body[data-pom-theme="retro"] .pom-monsoon, body[data-pom-theme="retro"] .pom-bounty-banner { border-radius: 0; box-shadow: 4px 4px 0 #000080; }
body[data-pom-theme="retro"] .pom-theme-toggle { border-radius: 0; background: #00FF66; border: 2px outset #d9d9d9; color: #000; }

@media (prefers-reduced-motion: reduce) {
  .pom-blink, body[data-pom-theme="retro"] .pom-mash-sub { animation: none; }
}

@media (max-width: 420px) {
  .pom-title { font-size: 33px; }
  .pom-header { box-shadow: 5px 5px 0 var(--ink); }
  .pom-ticker { font-size: 11px; }
  .pom-acts { grid-template-columns: 1fr 1fr; }
  .pom-quests { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .pom-peak, .pom-act, .pom-mash { transition: none; }
  .pom-spinner, .pom-ticker-track { animation: none; }
}
`}</style>
  );
}

/* ------------------------- App shell ------------------------- */

export default function PointOMatic() {
  const [tab, setTab] = useState("earn");
  const [theme, setTheme] = useState(recallTheme());

  useEffect(function applyTheme() {
    document.body.setAttribute("data-pom-theme", theme);
  }, [theme]);
  const [challenges, setChallenges] = useState(FALLBACK_CHALLENGES);
  const [monsoon, setMonsoon] = useState(null);
  const [announcement, setAnnouncement] = useState(null);

  function applySummary(json) {
    if (json && json.challenges) {
      setChallenges({
        wellness: json.challenges.wellness || FALLBACK_CHALLENGES.wellness,
        photo: json.challenges.photo || FALLBACK_CHALLENGES.photo,
        bounty: json.challenges.bounty || null,
      });
    }
    if (json && json.monsoon) setMonsoon(json.monsoon);
    if (json && json.announcement) setAnnouncement(json.announcement);
  }

  function reloadLiveChallenges() {
    fetchSummary()
      .then(function ok(json) { applySummary(json); })
      .catch(function quiet() { /* fallback quests stay up */ });
  }

  useEffect(function loadChallenges() {
    reloadLiveChallenges();
  }, []);

  return (
    <div className="pom-shell">
      <PomStyles />
      <RosterDatalist />
      <header className="pom-header">
        <button
          type="button"
          className="pom-theme-toggle"
          onClick={function flip() { const next = theme === "retro" ? "sunset" : "retro"; setTheme(next); rememberTheme(next); }}
          aria-label="Switch theme"
        >
          {theme === "retro" ? "🌅 SUNSET MODE" : "🕹️ RETRO MODE"}
        </button>
        <div className="pom-kicker">UA IM House Cup</div>
        <h1 className="pom-title">POINT-O-MATIC</h1>
        <p className="pom-tag">5 Houses · 1 Program · 1 Big Honkin' Competition</p>
        <div className="pom-ticker" aria-label="Point-O-Matic ticker">
          <div className="pom-ticker-track">
            <span>★ WELCOME RESIDENTS AND FACULTY ★ LOG YOUR POINTS ★ DO COOL STUFF ★ TOUCH GRASS ★ BE WELL ★&nbsp;</span>
            <span aria-hidden="true">★ WELCOME RESIDENTS AND FACULTY ★ LOG YOUR POINTS ★ DO COOL STUFF ★ TOUCH GRASS ★ BE WELL ★&nbsp;</span>
          </div>
        </div>
        <a className="pom-webmaster" href={"mailto:" + WEBMASTER_EMAIL + "?subject=Point-O-Matic%20help%20/%20bug%20report"}>📮 Holler at the webmaster</a>
        {theme === "retro" && (
          <div className="pom-counterbar">
            <span className="pom-underconstruction">🚧 UNDER CONSTRUCTION SINCE 1997 🚧</span>
            <span>Status: <span className="pom-blink pom-online">● ONLINE</span></span>
            <span className="pom-bestviewed">Best viewed at 800×600</span>
          </div>
        )}
      </header>

      {announcement && (
        <div className="pom-dispatch">
          <strong>📣 {announcement.title || "Desert Dispatch"}</strong>
          <span>{announcement.body || ""}{announcement.endDate ? (announcement.body ? " · " : "") + "through " + announcement.endDate : ""}</span>
        </div>
      )}

      {tab === "earn" && <EarnTab challenges={challenges} monsoon={monsoon} />}
      {tab === "glory" && <GloryTab />}
      {tab === "chiefs" && <ChiefTab onQuestSaved={function localQuestSaved(type, quest) {
        setChallenges(function previous(current) {
          return Object.assign({}, current, { [type]: quest });
        });
        window.setTimeout(reloadLiveChallenges, 1500);
      }} />}

      <nav className="pom-tabs" aria-label="Main">
        <button type="button" className={"pom-tab " + (tab === "earn" ? "active" : "")} onClick={function t1() { setTab("earn"); }}>🌵 Earn</button>
        <button type="button" className={"pom-tab " + (tab === "glory" ? "active" : "")} onClick={function t2() { setTab("glory"); }}>🏆 Glory</button>
        <button type="button" className={"pom-tab " + (tab === "chiefs" ? "active" : "")} onClick={function t3() { setTab("chiefs"); }}>🎩 Chiefs</button>
      </nav>
    </div>
  );
}
