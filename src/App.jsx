import React, { useEffect, useMemo, useRef, useState } from "react";

/* =====================================================================
   POINT-O-MATIC v2 — House Cup point logger
   Banner–University Medical Center Tucson · Internal Medicine
   Frontend: Vite + React (this file is the whole app)
   Backend: Google Apps Script web app (Code.gs v2) + Google Sheet
   ===================================================================== */

const ADMIN_EMAIL = "uaztucsonchiefs@gmail.com";
const GOOGLE_EVIDENCE_FOLDER_URL = "https://drive.google.com/drive/folders/15zhX3e1Hf4ExWgkwJK6gjevOggPO8MG8?usp=drive_link";

// Paste your deployed Google Apps Script Web App /exec URL here after deployment.
const APPS_SCRIPT_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyO1HJ0dokejC574nuUeMdPgQcrMAcrXXVpG6ZnLCT3SNAAyze6XYtlafqsXCEbyiE/exec";

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
    id: "wellness_challenge",
    label: "Wellness quest",
    points: 3,
    icon: "🌵",
    blurb: "This rotation's wellness challenge.",
    challenge: "wellness",
  },
  {
    id: "photo_challenge",
    label: "Photo quest",
    points: 3,
    icon: "📸",
    blurb: "This rotation's photo challenge.",
    challenge: "photo",
  },
  {
    id: "big_challenge",
    label: "Big Tucson quest",
    points: 5,
    icon: "🏔️",
    blurb: "Summits, Loop epics, weird Tucson side quests.",
  },
  {
    id: "allstar",
    label: "IM All-Star shout-out",
    points: 2,
    icon: "⭐",
    blurb: "Give 2 pts to someone who crushed it. Reason required.",
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
  wellness: { title: "Hydrate or die-drate — log a 3-day water streak", points: 3, endDate: "" },
  photo: { title: "Golden hour: catch a Tucson sunset on camera", points: 3, endDate: "" },
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

async function fetchSummary() {
  const res = await fetch(APPS_SCRIPT_WEB_APP_URL + "?action=summary", { method: "GET" });
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
  const [bigQuest, setBigQuest] = useState(BIG_QUESTS[0].label);
  const [squadInput, setSquadInput] = useState("");
  const [squad, setSquad] = useState([]);
  const [note, setNote] = useState("");
  const [shoutTo, setShoutTo] = useState("");
  const [shoutReason, setShoutReason] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [burst, setBurst] = useState(null);
  const mashRef = useRef(null);
  const photoInputRef = useRef(null);

  const me = findRosterPerson(name);
  useEffect(function saveName() { if (me) rememberName(me.name); }, [me]);

  const bountyActivity = bounty ? {
    id: "bounty", label: "BOUNTY", points: Number(bounty.points) || 5, icon: "🔥",
    blurb: bounty.title + (bounty.endDate ? " · closes " + bounty.endDate : ""),
  } : null;
  const allActivities = bountyActivity ? [bountyActivity].concat(ACTIVITIES) : ACTIVITIES;
  const activity = allActivities.find(function f(a) { return a.id === activityId; }) || null;
  const isShout = activityId === "allstar";
  const shoutTarget = findRosterPerson(shoutTo);

  const effectivePoints = useMemo(function pts() {
    if (!activity) return 0;
    if (activity.id === "big_challenge") {
      const q = BIG_QUESTS.find(function f(b) { return b.label === bigQuest; });
      return q ? q.points : 5;
    }
    if (activity.challenge) {
      const live = challenges[activity.challenge];
      return live && live.points ? Number(live.points) : activity.points;
    }
    return activity.points;
  }, [activity, bigQuest, challenges]);

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

  function onPhotoChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  }

  function clearPhoto() {
    setPhotoFile(null);
    setPhotoPreview("");
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
    if (!photoFile) return "Snap the photo evidence";
    return "";
  })();

  async function mash() {
    if (readyReason || busy) return;
    setBusy(true);
    setStatus("");
    try {
      if (isShout) {
        await postToBackend({
          action: "shoutout",
          date: todayString(),
          from: me.name,
          fromHouse: me.house,
          to: shoutTarget.name,
          house: shoutTarget.house,
          points: effectivePoints,
          reason: shoutReason.trim(),
          photoBase64: photoFile ? await fileToBase64(photoFile) : "",
          photoName: photoFile ? photoFile.name : "",
          photoMimeType: photoFile ? photoFile.type : "",
        });
        setBurst({ points: effectivePoints, label: shoutTarget.name + " · House " + shoutTarget.house });
      } else {
        const participants = [{ name: me.name, house: me.house }].concat(squad);
        const liveChallenge = activity.challenge ? challenges[activity.challenge] : null;
        await postToBackend({
          action: "submit",
          date: todayString(),
          submitter: me.name,
          activityId: activity.id,
          activity: activity.id === "big_challenge" ? "Big Tucson quest: " + bigQuest
            : activity.id === "bounty" ? "Bounty: " + (bounty ? bounty.title : "")
            : liveChallenge ? activity.label + ": " + liveChallenge.title
            : activity.label,
          points: effectivePoints,
          participants: participants,
          note: note.trim(),
          photoBase64: await fileToBase64(photoFile),
          photoName: photoFile.name || "house-cup-photo.jpg",
          photoMimeType: photoFile.type || "image/jpeg",
        });
        const crewNote = participants.length > 1 ? " × " + participants.length + " crew" : "";
        setBurst({ points: displayPoints, label: "House " + me.house + crewNote });
      }
      launchConfetti(mashRef.current);
      setStatus("done");
      setActivityId("");
      setSquad([]);
      setNote("");
      setShoutTo("");
      setShoutReason("");
      clearPhoto();
      setTimeout(function fade() { setBurst(null); setStatus(""); }, 3200);
    } catch (err) {
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
          🔥 <strong>BOUNTY LIVE:</strong> {bounty.title} · <span className="pom-bounty-pts">{bounty.points} pts</span>{bounty.endDate ? " · closes " + bounty.endDate : ""}
        </div>
      )}
      <div className="pom-quests">
        <div className="pom-quest-card" style={{ borderColor: "#2F9E44" }}>
          <span className="pom-quest-kicker">🌵 Wellness quest · {(challenges.wellness && challenges.wellness.points) || 3} pts</span>
          <strong>{(challenges.wellness && challenges.wellness.title) || FALLBACK_CHALLENGES.wellness.title}</strong>
        </div>
        <div className="pom-quest-card" style={{ borderColor: "#D6336C" }}>
          <span className="pom-quest-kicker">📸 Photo quest · {(challenges.photo && challenges.photo.points) || 3} pts</span>
          <strong>{(challenges.photo && challenges.photo.title) || FALLBACK_CHALLENGES.photo.title}</strong>
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
                <span className="pom-act-pts">{a.id === "big_challenge" ? "5–8" : pts}{a.id === "allstar" ? " pts →" : " pts"}</span>
              </button>
            );
          })}
        </div>
        {activity && <p className="pom-act-blurb">{activity.blurb}</p>}
        {activity && activity.id === "big_challenge" && (
          <select className="pom-input" value={bigQuest} onChange={function onQ(e) { setBigQuest(e.target.value); }}>
            {BIG_QUESTS.map(function opt(q) { return <option key={q.label} value={q.label}>{q.label} · {q.points} pts</option>; })}
          </select>
        )}
      </section>

      {activity && !isShout && (
        <section className="pom-card">
          <h2 className="pom-step"><span className="pom-step-n">3</span> Who was with you?</h2>
          <p className="pom-hint">Everyone you tag gets {effectivePoints} pts for their own house. Same photo covers the whole crew.</p>
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
          {shoutTarget && <div className="pom-me"><HouseChip house={shoutTarget.house} /></div>}
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
          <h2 className="pom-step"><span className="pom-step-n">4</span> Photo evidence {isShout ? <em className="pom-optional">(optional for shout-outs)</em> : <em className="pom-required">(required)</em>}</h2>
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
          {!isShout && (
            <input
              className="pom-input"
              placeholder="Optional note (where, what, lore…)"
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
        {status && status !== "done" && <p className="pom-error">{status}</p>}
        <p className="pom-raffle-note">🎟️ Every mash = 1 ticket in this month's gift card raffle. Points optional, tickets guaranteed.</p>
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
  const [data, setData] = useState(null);
  const [state, setState] = useState("loading");
  const [votedFor, setVotedFor] = useState("");
  const [voteMsg, setVoteMsg] = useState("");

  function load() {
    setState("loading");
    fetchSummary()
      .then(function ok(json) { setData(json); setState("ready"); })
      .catch(function bad() { setState("error"); });
  }

  useEffect(function onMount() { load(); }, []);

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
        <button type="button" className="pom-btn-primary" onClick={load}>Reload standings</button>
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

      <section className="pom-card">
        <h2 className="pom-h2">The Range Race</h2>
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
        {data && data.totalsAsOf && <p className="pom-asof">As of {data.totalsAsOf} · conference points sync in every Monday · 🎟️ {data.raffleTickets || 0} tickets in this month's raffle drum</p>}
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
        <h2 className="pom-h2">High Scorers</h2>
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
        {shoutouts.length === 0 && <p className="pom-hint">No shout-outs yet. Someone near you deserves 2 points — go tell the app why.</p>}
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

function ChiefTab() {
  const [chiefName, setChiefName] = useState("");
  const [chiefPass, setChiefPass] = useState("");
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
  const [chPoints, setChPoints] = useState(3);
  const [chEnd, setChEnd] = useState("");
  const [chMsg, setChMsg] = useState("");

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

  // Shout-out judging
  const [shoutFeed, setShoutFeed] = useState([]);

  function login() {
    if (authenticateChief(chiefName, chiefPass)) {
      setAuthed(true);
      setLoginMsg("");
      fetchSummary().then(function ok(json) { setShoutFeed((json && json.recentShoutouts) || []); }).catch(function quiet() {});
    } else setLoginMsg("Name or password doesn't match a chief. The password is the sacred one.");
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
    if (!chTitle.trim()) { setChMsg("Give the quest a title."); return; }
    await postToBackend({
      action: "setChallenge",
      chief: chiefName,
      pass: chiefPass,
      type: chType,
      title: chTitle.trim(),
      points: Number(chPoints) || 3,
      endDate: chEnd,
    });
    setChMsg("Quest set: " + chTitle + " (" + chPoints + " pts). It goes live for residents on their next load.");
    setChTitle("");
  }

  if (!authed) {
    return (
      <div className="pom-card pom-narrow">
        <h2 className="pom-h2">Secret Chief Lair</h2>
        <input className="pom-input" placeholder="Chief name" value={chiefName} onChange={function onN(e) { setChiefName(e.target.value); }} autoComplete="off" />
        <input className="pom-input" placeholder="Password" type="password" value={chiefPass} onChange={function onP(e) { setChiefPass(e.target.value); }} onKeyDown={function onK(e) { if (e.key === "Enter") login(); }} />
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
        <p className="pom-hint">Sets the wellness or photo challenge every resident sees on the Earn tab.</p>
        <select className="pom-input" value={chType} onChange={function onT(e) { setChType(e.target.value); }}>
          <option value="wellness">🌵 Wellness quest</option>
          <option value="photo">📸 Photo quest</option>
          <option value="bounty">🔥 Bounty (limited-time, big banner)</option>
        </select>
        <input className="pom-input" placeholder="Quest title (e.g., Sunrise on Tumamoc)" value={chTitle} onChange={function onTi(e) { setChTitle(e.target.value); }} />
        <div className="pom-stepper-row">
          <button type="button" className="pom-step-btn" onClick={function dn() { setChPoints(Math.max(1, chPoints - 1)); }}>−</button>
          <span className="pom-step-val">{chPoints} pts</span>
          <button type="button" className="pom-step-btn" onClick={function up() { setChPoints(chPoints + 1); }}>+</button>
        </div>
        <label className="pom-hint" htmlFor="pom-ch-end">Quest ends (optional)</label>
        <input id="pom-ch-end" className="pom-input" type="date" value={chEnd} onChange={function onE(e) { setChEnd(e.target.value); }} />
        <button type="button" className="pom-btn-primary" onClick={setChallenge}>Set the quest</button>
        {chMsg && <p className="pom-ok">{chMsg}</p>}
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
  --sky: #FFF4E6;
  --paper: #FFFDF9;
  --ink: #3D2B52;
  --ink-soft: #6E5A85;
  --sunset: #F76707;
  --sunset-deep: #E8590C;
  --gold: #FFC53D;
  --line: #EAD9C4;
}
* { box-sizing: border-box; }
html, body, #root { margin: 0; padding: 0; }
body {
  background: linear-gradient(180deg, #FFE8CC 0%, var(--sky) 240px);
  color: var(--ink);
  font-family: 'Nunito Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.pom-shell { max-width: 640px; margin: 0 auto; padding: 20px 16px 120px; }
.pom-header { text-align: center; padding: 10px 0 18px; }
.pom-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800; font-size: 40px; letter-spacing: -1px; margin: 0;
  background: linear-gradient(92deg, var(--sunset-deep), #D6336C 55%, #7048E8);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.pom-tag { margin: 4px 0 0; color: var(--ink-soft); font-size: 14px; font-weight: 600; }

.pom-card {
  background: var(--paper); border: 2px solid var(--line); border-radius: 20px;
  padding: 18px; margin-bottom: 14px; box-shadow: 0 3px 0 rgba(61,43,82,0.06);
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

.pom-acts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.pom-act {
  border: 2px solid var(--line); border-radius: 16px; background: #fff; cursor: pointer;
  padding: 12px 10px; display: flex; flex-direction: column; align-items: center; gap: 4px;
  font-family: inherit; transition: transform 0.08s ease;
}
.pom-act:hover { transform: translateY(-2px); }
.pom-act.active { border-color: var(--sunset); background: #FFF0E0; box-shadow: 0 3px 0 var(--sunset); }
.pom-act-icon { font-size: 26px; }
.pom-act-label { font-weight: 800; font-size: 14px; text-align: center; }
.pom-act-pts { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; color: var(--sunset-deep); }
.pom-act-blurb { color: var(--ink-soft); font-size: 13px; margin: 10px 0; }

.pom-squad-row { display: flex; gap: 8px; }
.pom-squad-row .pom-input { margin-bottom: 0; }
.pom-squad-chips { margin-top: 10px; }

.pom-file-hidden { position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden; }
.pom-photo-drop {
  display: block; text-align: center; border: 2px dashed var(--sunset); border-radius: 16px;
  padding: 26px 12px; font-weight: 800; color: var(--sunset-deep); cursor: pointer; background: #FFF7EE;
  margin-bottom: 10px;
}
.pom-photo-preview { display: flex; align-items: flex-end; gap: 10px; margin-bottom: 10px; }
.pom-photo-preview img { width: 130px; height: 130px; object-fit: cover; border-radius: 14px; border: 3px solid #fff; box-shadow: 0 3px 10px rgba(61,43,82,0.25); transform: rotate(-2deg); }

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
  background: rgba(255,253,249,0.96); border-top: 2px solid var(--line);
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  backdrop-filter: blur(6px);
}
.pom-tab {
  border: 0; background: none; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700;
  font-size: 15px; padding: 10px 18px; border-radius: 999px; cursor: pointer; color: var(--ink-soft);
}
.pom-tab.active { background: var(--ink); color: #fff; }
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

@media (max-width: 420px) {
  .pom-title { font-size: 32px; }
  .pom-acts { grid-template-columns: 1fr 1fr; }
  .pom-quests { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .pom-peak, .pom-act, .pom-mash { transition: none; }
  .pom-spinner { animation: none; }
}
`}</style>
  );
}

/* ------------------------- App shell ------------------------- */

export default function PointOMatic() {
  const [tab, setTab] = useState("earn");
  const [challenges, setChallenges] = useState(FALLBACK_CHALLENGES);
  const [monsoon, setMonsoon] = useState(null);

  useEffect(function loadChallenges() {
    fetchSummary()
      .then(function ok(json) {
        if (json && json.challenges) {
          setChallenges({
            wellness: json.challenges.wellness || FALLBACK_CHALLENGES.wellness,
            photo: json.challenges.photo || FALLBACK_CHALLENGES.photo,
            bounty: json.challenges.bounty || null,
          });
        }
        if (json && json.monsoon) setMonsoon(json.monsoon);
      })
      .catch(function quiet() { /* fallback quests stay up */ });
  }, []);

  return (
    <div className="pom-shell">
      <PomStyles />
      <RosterDatalist />
      <header className="pom-header">
        <h1 className="pom-title">POINT-O-MATIC</h1>
        <p className="pom-tag">Welcome Residents · Log your points · Be well · Touch grass · Do good work </p>
      </header>

      {tab === "earn" && <EarnTab challenges={challenges} monsoon={monsoon} />}
      {tab === "glory" && <GloryTab />}
      {tab === "chiefs" && <ChiefTab />}

      <nav className="pom-tabs" aria-label="Main">
        <button type="button" className={"pom-tab " + (tab === "earn" ? "active" : "")} onClick={function t1() { setTab("earn"); }}>🌵 Earn</button>
        <button type="button" className={"pom-tab " + (tab === "glory" ? "active" : "")} onClick={function t2() { setTab("glory"); }}>🏆 Glory</button>
        <button type="button" className={"pom-tab " + (tab === "chiefs" ? "active" : "")} onClick={function t3() { setTab("chiefs"); }}>🎩 Chiefs</button>
      </nav>
    </div>
  );
}
