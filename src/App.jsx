import React, { useEffect, useMemo, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

const ADMIN_EMAIL = "nathantwalton@gmail.com";
const GOOGLE_EVIDENCE_FOLDER_URL = "https://drive.google.com/drive/folders/15zhX3e1Hf4ExWgkwJK6gjevOggPO8MG8?usp=drive_link";
const GOOGLE_SUBMISSIONS_SHEET_URL = "https://docs.google.com/spreadsheets/d/1-qxEZt2q_n6Len0yIcMfODnLyIsDfz-yhD60AkcSz5U/edit?gid=0#gid=0";
const APPS_SCRIPT_WEB_APP_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_APPS_SCRIPT_WEB_APP_URL) ||
  "https://script.google.com/macros/s/AKfycbyO1HJ0dokejC574nuUeMdPgQcrMAcrXXVpG6ZnLCT3SNAAyze6XYtlafqsXCEbyiE/exec";

const HOUSES = ["Catalina", "Rincon", "Santa Rita", "Tortolita", "Tucson"];

const STORAGE_KEYS = {
  rows: "houseCupRowsV1",
  featuredQuest: "houseCupFeaturedQuestV1",
  featuredNote: "houseCupFeaturedNoteV1",
  monthlyWellnessMonth: "houseCupMonthlyWellnessMonthV1",
};

const CHIEF_USERS = [
  { name: "Nate", password: "wootwoot1!", house: "Catalina" },
  { name: "Rosie", password: "wootwoot1!", house: "Rincon" },
  { name: "Amrutha", password: "wootwoot1!", house: "Santa Rita" },
  { name: "Will", password: "wootwoot1!", house: "Tortolita" },
  { name: "Johnny", password: "wootwoot1!", house: "Tucson" },
];

const ROSTER = [
  { name: "Adam Western", house: "Tortolita", role: "PGY2" },
  { name: "Adrianna Diviero", house: "Tucson", role: "PGY2" },
  { name: "Ajdin Ekic", house: "Tortolita", role: "PGY3" },
  { name: "Alex Wang", house: "Catalina", role: "PGY1" },
  { name: "Alexander Candel", house: "Tucson", role: "PGY1" },
  { name: "Alousius Fombang", house: "Tortolita", role: "PGY1" },
  { name: "Amanda Gong", house: "Catalina", role: "PGY1" },
  { name: "Amrutha Doniparthi", house: "Santa Rita", role: "Chief" },
  { name: "Amy Sussman", house: "Tortolita", role: "PD_APD" },
  { name: "Andres Sanchez", house: "Santa Rita", role: "PGY2" },
  { name: "Angela Monetathchi", house: "Santa Rita", role: "PGY1" },
  { name: "Anthony Witten", house: "Catalina", role: "PD_APD" },
  { name: "Arpan Sharma", house: "Rincon", role: "PGY1" },
  { name: "Asael Nunez", house: "Santa Rita", role: "PGY3" },
  { name: "Basem Al-Tarshan", house: "Catalina", role: "PGY1" },
  { name: "Benjamin Maglajac", house: "Rincon", role: "PGY2" },
  { name: "Brett Martin", house: "Tortolita", role: "PGY2" },
  { name: "Brielle Tobin", house: "Tortolita", role: "PGY1" },
  { name: "Bryce Little", house: "Rincon", role: "PGY1" },
  { name: "Bujji Ainapurapu", house: "Tucson", role: "PD_APD" },
  { name: "Cassandra Everly", house: "Santa Rita", role: "PGY3" },
  { name: "Celeste Gracey", house: "Catalina", role: "PGY3" },
  { name: "Christian Avalos", house: "Tortolita", role: "PGY3" },
  { name: "Christopher Sallurday", house: "Rincon", role: "PGY2" },
  { name: "Cole Sander", house: "Catalina", role: "PGY1" },
  { name: "Costa Dalis", house: "Santa Rita", role: "PGY2" },
  { name: "D'Andre Gomez", house: "Rincon", role: "PGY1" },
  { name: "Dalia Mikhail", house: "Rincon", role: "PD_APD" },
  { name: "Danielle Bailey", house: "Santa Rita", role: "PGY3" },
  { name: "David Hendrix", house: "Santa Rita", role: "PGY3" },
  { name: "Dimitrios Filioglou", house: "Santa Rita", role: "PGY1" },
  { name: "Drew Rasmussen", house: "Tucson", role: "PGY3" },
  { name: "Dustin Parsons", house: "Tortolita", role: "PGY3" },
  { name: "Duy Nguyen", house: "Santa Rita", role: "PGY1" },
  { name: "Dwani Patel", house: "Santa Rita", role: "PGY3" },
  { name: "Eduardo Garcia Licerio", house: "Rincon", role: "PGY3" },
  { name: "Emily Adamson", house: "Rincon", role: "PGY2" },
  { name: "Emily Ploom", house: "Rincon", role: "PGY1" },
  { name: "Emily Tishkoff", house: "Catalina", role: "PGY3" },
  { name: "Esther Cheng", house: "Tucson", role: "PGY2" },
  { name: "Ethan Renfrew", house: "Rincon", role: "PGY2" },
  { name: "Eric Brucks", house: "Tucson", role: "PD_APD" },
  { name: "Faissal Stipho", house: "Santa Rita", role: "PGY3" },
  { name: "Faith Kim", house: "Rincon", role: "PGY2" },
  { name: "Francine Holguin", house: "Tucson", role: "PGY1" },
  { name: "Frederick Pan", house: "Tucson", role: "PGY1" },
  { name: "Gagandeep Gill", house: "Catalina", role: "PGY2" },
  { name: "Gowtham Anche", house: "Tucson", role: "PGY2" },
  { name: "Grace Speer", house: "Tucson", role: "PGY2" },
  { name: "Henry Lang", house: "Catalina", role: "PGY1" },
  { name: "Ho Hyun Lee", house: "Santa Rita", role: "PGY1" },
  { name: "Hyun Kim", house: "Santa Rita", role: "PGY2" },
  { name: "Indu Partha", house: "Tucson", role: "PD_APD" },
  { name: "Isaac Zarif", house: "Tucson", role: "PGY1" },
  { name: "Isabella Campos Aguiar", house: "Santa Rita", role: "PGY1" },
  { name: "Isam Alannouf", house: "Tortolita", role: "PGY1" },
  { name: "Itzel Sazesuz", house: "Tucson", role: "STAFF" },
  { name: "Jackie Hu", house: "Catalina", role: "PGY3" },
  { name: "Jared Stillman", house: "Tortolita", role: "PGY3" },
  { name: "Jason Chen", house: "Tucson", role: "PGY1" },
  { name: "Jasmine Coatley-Thomas", house: "Rincon", role: "PGY1" },
  { name: "Jazmine Koli", house: "Tortolita", role: "STAFF" },
  { name: "Jesse Coy", house: "Catalina", role: "PGY1" },
  { name: "Jesse Ritter", house: "Rincon", role: "PGY3" },
  { name: "Jessica Kitsen", house: "Rincon", role: "PGY3" },
  { name: "Joey Ghotmi", house: "Catalina", role: "PGY1" },
  { name: "Johnny Trinh", house: "Tucson", role: "Chief" },
  { name: "Jocelyn Liu", house: "Rincon", role: "PGY1" },
  { name: "Joshua Malo", house: "Santa Rita", role: "PD_APD" },
  { name: "Joshua Nay", house: "Catalina", role: "PGY1" },
  { name: "Joy Eskandar", house: "Catalina", role: "PGY2" },
  { name: "JP Ferriera", house: "Catalina", role: "PD_APD" },
  { name: "Justin Le", house: "Santa Rita", role: "PGY2" },
  { name: "Kaitlyn Baber", house: "Santa Rita", role: "PGY3" },
  { name: "Kalvin Thomas", house: "Santa Rita", role: "PGY3" },
  { name: "Kassandra Mastras", house: "Catalina", role: "PGY1" },
  { name: "Kathryn Pulling", house: "Rincon", role: "PGY3" },
  { name: "Keanna Encinas", house: "Rincon", role: "STAFF" },
  { name: "Kellie Jeong", house: "Tucson", role: "PGY3" },
  { name: "Kenneth Silvestro", house: "Tucson", role: "PGY2" },
  { name: "Kent Lawrence", house: "Rincon", role: "PGY1" },
  { name: "Khaja Siddiqui", house: "Catalina", role: "PGY2" },
  { name: "Laura Meinke", house: "Rincon", role: "PD_APD" },
  { name: "Laura Tran", house: "Tortolita", role: "PGY2" },
  { name: "Laura Zelis", house: "Tortolita", role: "PGY1" },
  { name: "Levi Cohen", house: "Santa Rita", role: "PGY1" },
  { name: "Luca Bertozzi", house: "Catalina", role: "PGY2" },
  { name: "Mariah Black", house: "Catalina", role: "PGY1" },
  { name: "Marlee Panther", house: "Tortolita", role: "PGY3" },
  { name: "Matthew Lansman", house: "Santa Rita", role: "PGY3" },
  { name: "Matthew Ward", house: "Rincon", role: "PGY3" },
  { name: "Mattia Walter", house: "Catalina", role: "PGY3" },
  { name: "Mathew Thomas", house: "Tortolita", role: "PGY3" },
  { name: "Megan Kohn", house: "Tortolita", role: "PGY2" },
  { name: "Michael Palomares", house: "Santa Rita", role: "PGY2" },
  { name: "Milan Hirpara", house: "Tortolita", role: "PGY1" },
  { name: "Mohamad Al-Mula Hwaish", house: "Tortolita", role: "PGY2" },
  { name: "Monica Angeletti", house: "Rincon", role: "PGY3" },
  { name: "Mujtaba Shah", house: "Santa Rita", role: "PGY2" },
  { name: "Myles Bosompem", house: "Santa Rita", role: "PGY1" },
  { name: "Nandini Sodhi", house: "Tucson", role: "PGY1" },
  { name: "Nassim Idouraine", house: "Tortolita", role: "PGY1" },
  { name: "Nellie Toliver", house: "Tortolita", role: "PGY2" },
  { name: "Nate Walton", house: "Catalina", role: "Chief" },
  { name: "Nathan Giauque", house: "Tucson", role: "PGY3" },
  { name: "Nicholas Genz", house: "Catalina", role: "PGY3" },
  { name: "Nicole Price", house: "Rincon", role: "PGY2" },
  { name: "Nina Maitra", house: "Tucson", role: "PGY2" },
  { name: "Noorhan Monther", house: "Tortolita", role: "PGY2" },
  { name: "Paige Awtrey", house: "Tucson", role: "PGY1" },
  { name: "Rajesh Kotagiri", house: "Tortolita", role: "PD_APD" },
  { name: "Rachael Rosow", house: "Santa Rita", role: "PGY2" },
  { name: "Rambod Meshgi", house: "Santa Rita", role: "PGY1" },
  { name: "Rami Khoshaba", house: "Tortolita", role: "PGY1" },
  { name: "Ricardo Reyes", house: "Tortolita", role: "PGY2" },
  { name: "Rishab Srivastava", house: "Tucson", role: "PGY3" },
  { name: "Robert Sumner", house: "Tortolita", role: "PGY3" },
  { name: "Rosie Turk", house: "Rincon", role: "Chief" },
  { name: "Ryan Hakim", house: "Catalina", role: "PGY1" },
  { name: "Ryan Schmidt", house: "Catalina", role: "PGY2" },
  { name: "Ryan Waggoner", house: "Santa Rita", role: "PGY1" },
  { name: "Ryan Weyker", house: "Tortolita", role: "PGY3" },
  { name: "Ryan Wong", house: "Santa Rita", role: "PD_APD" },
  { name: "Sara Castaneda", house: "Rincon", role: "PGY1" },
  { name: "Sarah Busch", house: "Catalina", role: "PGY2" },
  { name: "Shaik Firdhos", house: "Tucson", role: "PGY1" },
  { name: "Shana Zadron", house: "Tucson", role: "PGY1" },
  { name: "Shenar Dinkha", house: "Catalina", role: "PGY3" },
  { name: "Shawn Wang", house: "Tucson", role: "PGY2" },
  { name: "Shreeya Agrawal", house: "Rincon", role: "PGY2" },
  { name: "Soojung Choi", house: "Tortolita", role: "PGY1" },
  { name: "Spencer Chee", house: "Tucson", role: "PGY2" },
  { name: "Srijit Paul", house: "Catalina", role: "PGY1" },
  { name: "Stacy Ploom", house: "Rincon", role: "PGY3" },
  { name: "Suzette Lopez Valenzuela", house: "Rincon", role: "PGY1" },
  { name: "Swathi Somisetty", house: "Rincon", role: "PGY3" },
  { name: "Swetha Vennelaganti", house: "Tucson", role: "PGY3" },
  { name: "Sydney Lovins", house: "Rincon", role: "PGY2" },
  { name: "Tammy Zamaitis", house: "Santa Rita", role: "PGY3" },
  { name: "Tim Yu", house: "Catalina", role: "PGY2" },
  { name: "Tolulope Popoola", house: "Tucson", role: "PGY3" },
  { name: "Tyler Hill", house: "Tucson", role: "PGY1" },
  { name: "Will Waidelich", house: "Tortolita", role: "Chief" },
  { name: "William Matloff", house: "Tortolita", role: "PGY3" },
  { name: "Yuvia Anaya", house: "Catalina", role: "STAFF" },
];

const RESIDENT_ACTIVITIES = [
  { id: "group_activity", label: "Group activity", points: 2, icon: "🤝", color: "#d7ffd8", description: "Dinner, trivia, coffee, game night, house hang. 3+ people." },
  { id: "group_exercise", label: "Group exercise", points: 2, icon: "🏃", color: "#ffe0bd", description: "Hike, bike, climb, gym, yoga, pickleball, walk. 3+ people." },
  { id: "academic", label: "Academic flex", points: 3, icon: "🧠", color: "#efe1ff", description: "Journal club, teaching, abstract, presentation, QI/research work. 3+ pts." },
  { id: "wellness_community", label: "Wellness + community +3", points: 3, icon: "🌵", color: "#c8fff3", description: "Wellness, service, Shubitz, blood donation, helping a friend. +3 pts." },
  { id: "big_challenge", label: "Big Tucson challenges", points: 5, icon: "🏔️", color: "#fff2aa", description: "" },
  { id: "point_pitch", label: "Tell me why I should give you points?", points: 0, icon: "🤔", color: "#ffd6ef", description: "For unsanctioned excellence and suspiciously wholesome nonsense." },
];

const FEATURED_QUEST_IDEAS = [
  "Find the most judgmental saguaro",
  "Sunrise before signout",
  "Best Tucson mural walk",
  "Touch grass with three people from your house",
  "Sabino sunrise crew",
  "Sonoran hot dog + decompression walk",
  "A Mountain sunset photo",
  "No-phone nature hour",
  "Bring joy to the team snack drop",
  "Write three gratitude notes",
  "Check in on five colleagues you do not know well",
  "Hydration hero shift",
  "Find the weirdest cactus in Tucson",
  "Farmers market produce quest",
  "Coffee walk with someone outside your usual crew",
  "Trail cleanup / leave-it-better mini mission",
  "House picnic or potluck",
  "Desert Museum or botanical garden reset",
  "Meet your interns for coffee, snacks, or a hospital walk",
  "Ask an intern what would make this month easier, then do one small thing",
  "Text someone post-call that you appreciate them",
  "Bring a ridiculous but useful snack to the workroom",
  "Make a team playlist for prerounds / charting / survival",
  "Take a walk with someone who looks like they need a reset",
  "Send one thank-you message to a nurse, MA, pharmacist, RT, or clinic staff member",
  "Make the call room slightly less cursed",
  "Teach one thing you wish someone had taught you earlier",
  "Organize a five-minute stretch break during a long day",
  "Do a kindness drive-by: coffee, snack, note, or errand for someone slammed",
  "Find a beautiful Tucson sky and document it for morale",
  "Have a real conversation with no work talk for ten minutes",
  "Make a mini survival guide for new interns",
  "Take a house photo that looks like an album cover",
  "Create a house motto, chant, handshake, or absolutely unnecessary ritual",
  "Host a tiny workroom celebration for no good reason",
  "Share one good thing from the week in your house chat",
  "Make an intern laugh during a hard shift",
  "Do something wholesome enough that it feels suspicious",
];

const QUEST_OPTIONS = [
  { label: "Featured Quest", points: 5, category: "Big Tucson Challenge", questType: "featured_quest" },
  { label: "Monthly Wellness Challenge", points: 5, category: "Monthly Wellness", questType: "monthly_wellness" },
  { label: "Tucson mountain summit", points: 6, category: "Big Tucson Challenge", questType: "summit" },
  { label: "The Loop ride/walk epic", points: 5, category: "Big Tucson Challenge", questType: "big_tucson" },
  { label: "Sabino sunrise crew", points: 5, category: "Big Tucson Challenge", questType: "big_tucson" },
  { label: "Sonoran hot dog + group walk", points: 5, category: "Big Tucson Challenge", questType: "big_tucson" },
  { label: "Best Tucson mural walk", points: 5, category: "Big Tucson Challenge", questType: "big_tucson" },
  { label: "Post-call burrito (or equivalent morale meal)", points: 5, category: "Big Tucson Challenge", questType: "big_tucson" },
  { label: "Sunrise before signout", points: 5, category: "Big Tucson Challenge", questType: "big_tucson" },
  { label: "Other Big Tucson challenge", points: 5, category: "Big Tucson Challenge", questType: "big_tucson_other" },
];

const MONTHLY_WELLNESS_QUESTS = [
  { month: "July", theme: "Housewarming Party", quest: "Motto Motto Medicine — house mottos + meet your interns", vibe: "Identity & Belonging", proof: "House motto/logo photo + photo of something fun with interns, inside or outside the hospital" },
  { month: "August", theme: "Hydrate or Die-drate", quest: "Beat the Heat Step Stampede — cumulative house steps", vibe: "Movement & Heat Survival", proof: "Step screenshot / wearable screenshot" },
  { month: "September", theme: "Tiny Teaching, Big Feelings", quest: "Teach Me Something Good — one pearl, chalk talk, article, or mini teaching moment", vibe: "Learning Culture", proof: "Photo/screenshot of teaching, article, whiteboard, or post" },
  { month: "October", theme: "Boo-cson", quest: "Haunted Tucson Field Trip — visit a haunted or historic Tucson spot", vibe: "Fun & Adventure", proof: "Photo at the spot" },
  { month: "November", theme: "Thanks, I Needed That", quest: "Gratitude + Service Combo Meal — post one gratitude note and complete one service/community action", vibe: "Giving Back", proof: "Gratitude screenshot + service/donation/volunteering photo or receipt" },
  { month: "December", theme: "Desert Claus", quest: "Holiday Giving Drive — clothing, food, gifts, or patient/community support", vibe: "Community", proof: "Donation/photo/receipt" },
  { month: "January", theme: "New Year, Same Pager", quest: "Fresh Start Bingo — try a new wellness activity", vibe: "Fresh Start", proof: "Photo/checklist/calendar screenshot" },
  { month: "February", theme: "Pal-entines", quest: "Connection Quest — check in on 5 colleagues", vibe: "Social Wellness", proof: "Group photo / message screenshot / note" },
  { month: "March", theme: "Peak Freaks", quest: "Peak Bagging Month — summit, hike, or high-effort outdoor adventure", vibe: "Adventure", proof: "Summit photos / route screenshots" },
  { month: "April", theme: "Spoke Signals", quest: "Bike Month — house miles by bike, commute, Loop ride, or spin", vibe: "Active Transport", proof: "Mileage screenshot / bike photo" },
  { month: "May", theme: "Brain Deserves Snacks", quest: "Mental Health Choose-Your-Own-Adventure", vibe: "Mental Health", proof: "Photo, calendar/checklist, streak screenshot, reflection note, or other non-private proof" },
  { month: "June", theme: "Sunrise Survival Club", quest: "Summer Heat Challenge — sunrise workouts + early hikes", vibe: "Resilience", proof: "Sunrise photo / workout screenshot" },
];

function getStoredValue(key, fallback) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return fallback;
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (_) {
    return fallback;
  }
}

function getStoredRows() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return [];
    const raw = window.localStorage.getItem(STORAGE_KEYS.rows);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function setStoredValue(key, value) {
  try {
    if (typeof window !== "undefined" && window.localStorage) window.localStorage.setItem(key, value);
  } catch (_) {}
}

function setStoredRows(rows) {
  try {
    if (typeof window !== "undefined" && window.localStorage) window.localStorage.setItem(STORAGE_KEYS.rows, JSON.stringify(Array.isArray(rows) ? rows : []));
  } catch (_) {}
}

function normalizeName(value) {
  return String(value === null || value === undefined ? "" : value).trim().toLowerCase().replace(/\s+/g, " ");
}

function findRosterPerson(name) {
  const normalized = normalizeName(name);
  if (!normalized) return null;
  return ROSTER.find((person) => normalizeName(person.name) === normalized) || null;
}

function authenticateChief(name, password) {
  const user = normalizeName(name);
  const pass = String(password || "");
  return CHIEF_USERS.find((chief) => normalizeName(chief.name) === user && chief.password === pass) || null;
}

function getChiefHouse(chiefName) {
  const chief = CHIEF_USERS.find((item) => normalizeName(item.name) === normalizeName(chiefName));
  return chief ? chief.house : "Unknown";
}

function canChiefApprovePitch(chiefName, submission) {
  if (!submission) return false;
  const chiefHouse = getChiefHouse(chiefName);
  return chiefHouse !== "Unknown" && submission.house !== "Unknown" && chiefHouse !== submission.house;
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function getRandomFeaturedQuestIdea() {
  return FEATURED_QUEST_IDEAS[Math.floor(Math.random() * FEATURED_QUEST_IDEAS.length)] || FEATURED_QUEST_IDEAS[0];
}

function getCurrentMonthlyWellnessQuest(monthOverride) {
  const monthName = monthOverride || new Date().toLocaleString("en-US", { month: "long" });
  return MONTHLY_WELLNESS_QUESTS.find((item) => item.month === monthName) || MONTHLY_WELLNESS_QUESTS[0];
}

function calculateHouseTotals(rows) {
  const base = {};
  HOUSES.forEach((house) => { base[house] = 0; });
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    if (!row || !row.house || row.house === "Unknown") return;
    if (row.status === "denied" || row.status === "pending_review") return;
    base[row.house] = (base[row.house] || 0) + Number(row.points || 0);
  });
  return HOUSES.map((house) => ({ house, points: base[house] || 0 })).sort((a, b) => b.points - a.points || a.house.localeCompare(b.house));
}

function getPendingPointPitches(rows) {
  return (Array.isArray(rows) ? rows : []).filter((row) => row && row.source === "resident_point_pitch" && row.status === "pending_review");
}

function reviewPointPitchRows(rows, submissionKey, decision, approvedPoints, chiefName, reviewNote) {
  return rows.map((row, index) => {
    const key = row.submissionId || row.timestamp + "-" + index;
    if (key !== submissionKey || !canChiefApprovePitch(chiefName, row)) return row;
    return {
      ...row,
      points: decision === "approve" ? Number(approvedPoints || row.points || 0) : 0,
      status: decision === "approve" ? "approved" : "denied",
      reviewedBy: chiefName,
      reviewedAt: new Date().toISOString(),
      reviewNote: reviewNote || (decision === "approve" ? "Approved by chief from different house" : "Denied by chief from different house"),
    };
  });
}

function splitAttendanceNames(text) {
  return String(text || "").split(/\r?\n|,/).map((name) => name.trim()).filter(Boolean);
}

function attendanceTextToRows(options) {
  const opts = options || {};
  const uploadedBy = opts.uploadedBy || "Unknown chief";
  return splitAttendanceNames(opts.text || "").map((name) => {
    const person = findRosterPerson(name);
    return {
      timestamp: new Date().toISOString(),
      date: opts.eventDate || todayString(),
      name,
      house: person && person.house ? person.house : "Unknown",
      activity: opts.eventTitle || "AHD / conference attendance",
      points: Number(opts.points || 1) || 1,
      category: "Attendance",
      questType: "attendance",
      people: "",
      note: person ? "Uploaded attendance" : "Uploaded attendance - house not found in roster",
      photoName: "",
      photoStatus: "not_required",
      source: "chief_ahd_upload",
      uploadedBy,
      status: "approved",
      reviewedBy: uploadedBy,
      reviewedAt: new Date().toISOString(),
      reviewNote: "",
      submissionId: makeSubmissionId(),
    };
  });
}

function chiefBonusToRow(options) {
  const opts = options || {};
  const uploadedBy = opts.uploadedBy || "Unknown chief";
  return {
    timestamp: new Date().toISOString(),
    date: opts.eventDate || todayString(),
    name: (opts.house || "Unknown") + " house",
    house: opts.house || "Unknown",
    activity: opts.eventTitle || "Kahoot / trivia bonus",
    points: Number(opts.points || 0) || 0,
    category: "Chief Bonus",
    questType: "chief_bonus",
    people: "",
    note: opts.note || "Chief-scored bonus points",
    photoName: "",
    photoStatus: "not_required",
    source: "chief_bonus",
    uploadedBy,
    status: "approved",
    reviewedBy: uploadedBy,
    reviewedAt: new Date().toISOString(),
    reviewNote: "",
    submissionId: makeSubmissionId(),
  };
}

function makeSubmissionId() {
  return String(Date.now()) + "-" + Math.random().toString(36).slice(2);
}

function csvEscape(value) {
  const text = String(value === null || value === undefined ? "" : value);
  if (text.includes(",") || text.includes("\n") || text.includes('"')) return '"' + text.replace(/"/g, '""') + '"';
  return text;
}

function downloadCSV(rows) {
  const headers = ["timestamp", "date", "name", "house", "activity", "points", "category", "questType", "people", "note", "photoName", "photoUrl", "photoStatus", "source", "uploadedBy", "status", "reviewedBy", "reviewedAt", "reviewNote", "submissionId"];
  const lines = [headers.join(",")];
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    lines.push(headers.map((header) => csvEscape(row ? row[header] : "")).join(","));
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "house-cup-points.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) { resolve(""); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const commaIndex = result.indexOf(",");
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.onerror = () => reject(reader.error || new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

async function submitToAppsScript(row, photoFile) {
  if (!APPS_SCRIPT_WEB_APP_URL) return { ok: false, skipped: true };
  const payload = { ...row };
  if (photoFile) {
    payload.photoBase64 = await fileToBase64(photoFile);
    payload.photoName = photoFile.name || row.photoName || "house-cup-photo.jpg";
    payload.photoMimeType = photoFile.type || "image/jpeg";
  }
  await fetch(APPS_SCRIPT_WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  return { ok: true };
}

async function submitRowsToAppsScript(rows) {
  const safeRows = Array.isArray(rows) ? rows : [];
  for (let i = 0; i < safeRows.length; i += 1) {
    await submitToAppsScript(safeRows[i], null);
  }
  return { ok: true, count: safeRows.length };
}

async function readSubmissionsFromAppsScript() {
  const url = APPS_SCRIPT_WEB_APP_URL + "?action=submissions&cacheBust=" + Date.now();
  const response = await fetch(url);
  const data = await response.json();
  if (!data || data.ok !== true || !Array.isArray(data.submissions)) {
    throw new Error("Sheet endpoint did not return submissions.");
  }
  return data.submissions.map((row, index) => ({
    timestamp: row.timestamp || new Date().toISOString(),
    date: row.date || "",
    name: row.name || "",
    house: row.house || "Unknown",
    activity: row.activity || "",
    points: Number(row.points || 0),
    category: row.category || "",
    questType: row.questType || "",
    people: row.people || "",
    note: row.note || "",
    photoName: row.photoName || "",
    photoUrl: row.photoUrl || "",
    photoStatus: row.photoStatus || "",
    source: row.source || "sheet",
    uploadedBy: row.uploadedBy || "",
    status: row.status || "approved",
    reviewedBy: row.reviewedBy || "",
    reviewedAt: row.reviewedAt || "",
    reviewNote: row.reviewNote || "",
    submissionId: row.submissionId || "sheet-" + index + "-" + Date.now(),
  }));
}

function getLeaderboardRankLabel(index) {
  if (index === 0) return "🥇 Current House Champions";
  if (index === 1) return "🥈 Respectable Menace";
  if (index === 2) return "🥉 Strong Showing";
  if (index === 3) return "🙂 Still in the Mix";
  return "💪 Comeback Season";
}

function getLeaderboardTrashTalk(index) {
  if (index === 0) return "Please use power responsibly.";
  if (index === 1) return "Dangerously close to glory.";
  if (index === 2) return "Podium adjacent. Hydrate.";
  if (index === 3) return "Still mathematically alive.";
  return "One good week changes everything.";
}

function getAchievementBadges(rows) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const badges = [];
  if (safeRows.length > 0) badges.push({ label: "First blood", detail: "First logged points are on the board." });
  if (safeRows.some((row) => /grass|nature|walk|outside|sunrise|sunset|sabino|tumamoc|mountain|summit|loop/i.test(row.activity + " " + row.note))) badges.push({ label: "Grass toucher", detail: "Someone successfully went outside." });
  if (safeRows.some((row) => /AHD|conference/i.test(row.activity))) badges.push({ label: "Conference attendee", detail: "Showing up counts." });
  if (safeRows.some((row) => /group activity|house hang|dinner|trivia|coffee/i.test(row.activity + " " + row.note))) badges.push({ label: "Group activity menace", detail: "Social wellness has entered the chat." });
  if (safeRows.some((row) => /summit|peak|lemmon|wrightson|mica|wasson|mountain/i.test(row.activity + " " + row.note))) badges.push({ label: "Summit sicko", detail: "Altitude-based personality development." });
  if (safeRows.some((row) => /wellness|meditation|sleep|gratitude|mental|reset|yoga|community|shubitz|blood|platelet|friend|service/i.test(row.activity + " " + row.note))) badges.push({ label: "Wellness? In this economy?", detail: "A brave and controversial choice." });
  if (safeRows.some((row) => row.source === "resident_point_pitch" && row.status === "approved")) badges.push({ label: "Chief-approved nonsense", detail: "Questionable, but sanctioned." });
  return badges;
}

function getRecentSubmissions(rows) {
  return (Array.isArray(rows) ? rows : []).slice(0, 6).map((row) => {
    const pending = row.status === "pending_review";
    const emoji = pending ? "🤔" : row.source === "chief_bonus" ? "🏆" : /sonoran|taco|burrito/i.test(row.activity + " " + row.note) ? "🌭" : /summit|mountain|peak|lemmon|wrightson|mica|wasson/i.test(row.activity + " " + row.note) ? "🏔️" : /community|shubitz|blood|platelet|friend|service/i.test(row.activity + " " + row.note) ? "❤️" : "✨";
    return { text: row.name + " submitted “" + row.activity + "” for " + row.house + ". +" + row.points + (pending ? " — pending review." : "."), emoji };
  });
}

function FieldLabel(props) { return <label className="hc-label">{props.children}</label>; }
function TextInput(props) { return <input {...props} className={(props.className || "") + " hc-input"} />; }
function SelectInput(props) { return <select value={props.value} onChange={props.onChange} className="hc-input">{props.children}</select>; }
function TabButton(props) { return <button type="button" onClick={props.onClick} className={"hc-tab " + (props.active ? "active" : "")}>{props.children}</button>; }

function HouseCupStyles() {
  return (
    <style>{`
      .hc-page { min-height: 100vh; cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='%230a7a3d' stroke='%23000000' stroke-width='2' d='M15 29V9a4 4 0 0 1 8 0v5h3a3 3 0 0 1 3 3v4h-5v-4h-1v12h-8zM15 16h-3v-4H9v7h6v5H8a4 4 0 0 1-4-4v-8a4 4 0 0 1 8 0v1h3z'/%3E%3C/svg%3E") 2 2, auto; padding: 14px; color: #24130d; background-color: #fff7b8; background-image: radial-gradient(circle at 12px 12px, rgba(0,128,96,.28) 0 3px, transparent 4px), radial-gradient(circle at 34px 34px, rgba(0,128,96,.22) 0 2px, transparent 3px), linear-gradient(135deg, rgba(255,255,255,.62), rgba(255,214,231,.52), rgba(217,247,255,.58)); background-size: 46px 46px, 46px 46px, auto; font-family: Verdana, Geneva, Tahoma, sans-serif; }
      .hc-shell { max-width: 1120px; margin: 0 auto; }
      .hc-hero { border: 4px solid #000; padding: 16px; background: linear-gradient(to bottom, #ffffff 0%, #fffef0 100%); box-shadow: 7px 7px 0 #000; text-align: center; }
      .hc-kicker { display: inline-block; padding: 7px 12px; border: 3px solid #000; background: #ffff66; color: #000; font-weight: 1000; text-transform: uppercase; box-shadow: 3px 3px 0 #000; }
      .hc-title { margin: 14px 0 8px; font-size: clamp(42px, 8vw, 86px); line-height: .9; font-weight: 1000; letter-spacing: -2px; text-transform: uppercase; color: #d4006a; text-shadow: 2px 2px 0 #fff, 4px 4px 0 #000; }
      .hc-marquee-wrap { margin-top: 14px; border: 3px solid #000; background: #000; overflow: hidden; }
      .hc-marquee { display: inline-block; white-space: nowrap; color: #00ff66; font-family: "Courier New", monospace; font-size: 14px; font-weight: 900; padding: 7px 0; animation: hc-scroll 18s linear infinite; }
      @keyframes hc-scroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
      .hc-counterbar { margin-top: 10px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
      .hc-counter, .hc-underconstruction, .hc-webmaster { border: 2px solid #000; background: #fff; padding: 6px 10px; font-family: "Courier New", monospace; font-size: 12px; font-weight: 1000; box-shadow: 3px 3px 0 #000; }
      .hc-underconstruction { background: repeating-linear-gradient(45deg, #ffeb3b, #ffeb3b 10px, #000 10px, #000 20px); color: #fff; text-shadow: 1px 1px 0 #000; }
      .hc-webmaster { color: #0000ee; text-decoration: underline; cursor: pointer; }
      .hc-tabs { position: sticky; top: 0; z-index: 10; margin-top: 14px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; padding: 6px 0; background: rgba(255,247,184,.88); backdrop-filter: blur(4px); }
      .hc-tab { border-top: 3px solid #fff; border-left: 3px solid #fff; border-right: 3px solid #000; border-bottom: 3px solid #000; padding: 10px 8px; background: linear-gradient(to bottom, #fefefe, #d9d9d9); color: #111827; font-weight: 1000; cursor: pointer; text-transform: uppercase; }
      .hc-tab.active { background: linear-gradient(to bottom, #ff8ad8, #ff4db3); color: #fff; text-shadow: 1px 1px 0 #000; }
      .hc-card, .hc-footer { margin-top: 16px; border: 4px solid #000; padding: 14px; background: rgba(255,255,255,.95); box-shadow: 5px 5px 0 #000; }
      .hc-footer { border-style: dotted; font-size: 13px; color: #334155; font-weight: 700; }
      .hc-grid { display: grid; gap: 12px; }
      .hc-grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .hc-grid-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
      .hc-label { display: block; margin-bottom: 6px; font-size: 12px; font-weight: 1000; color: #000080; text-transform: uppercase; }
      .hc-input { width: 100%; box-sizing: border-box; border-top: 3px solid #777; border-left: 3px solid #777; border-right: 3px solid #fff; border-bottom: 3px solid #fff; padding: 10px 12px; background: #fff; color: #111827; font: inherit; outline: none; }
      .hc-input:focus { background: #fffde7; }
      .hc-muted { color: #5b6470; font-size: 12px; font-weight: 700; }
      .hc-alert { margin-top: 14px; padding: 12px; border: 3px dashed #0033cc; background: #dbeafe; color: #002b7f; font-weight: 900; }
      .hc-success { margin-top: 14px; border: 3px solid #14532d; padding: 12px; background: #dcfce7; color: #14532d; font-weight: 900; }
      .hc-actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-top: 16px; }
      .hc-action { min-height: 154px; border: 4px solid #000; padding: 16px; text-align: left; cursor: pointer; box-shadow: 6px 6px 0 #000; transition: transform .06s ease, box-shadow .06s ease; position: relative; overflow: hidden; }
      .hc-action:hover { transform: translate(2px, 2px); box-shadow: 4px 4px 0 #000; }
      .hc-action:disabled { opacity: .5; cursor: not-allowed; }
      .hc-action-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
      .hc-icon { font-size: 38px; line-height: 1; }
      .hc-badge { display: inline-block; padding: 5px 10px; border: 2px solid #000; background: #000; color: #00ff66; font-family: "Courier New", monospace; font-weight: 1000; }
      .hc-action-title { margin-top: 14px; font-size: 22px; font-weight: 1000; text-transform: uppercase; color: #111; }
      .hc-action-desc { margin-top: 6px; font-size: 13px; color: #334155; font-weight: 700; min-height: 18px; }
      .hc-quest-card { margin-top: 12px; border: 3px dashed #000; padding: 12px; background: #fff7b8; font-weight: 900; }
      .hc-button { border-top: 3px solid #fff; border-left: 3px solid #fff; border-right: 3px solid #000; border-bottom: 3px solid #000; padding: 10px 14px; background: linear-gradient(to bottom, #fffbcc, #ffd54f); color: #000; font-weight: 1000; cursor: pointer; text-transform: uppercase; }
      .hc-button.secondary { background: linear-gradient(to bottom, #fff, #d9d9d9); color: #111827; }
      .hc-button.danger { background: linear-gradient(to bottom, #ffd6d6, #ff9b9b); color: #7f0000; }
      .hc-button:disabled { opacity: .45; cursor: not-allowed; }
      .hc-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
      .hc-photo-preview { margin-top: 8px; max-height: 90px; border: 2px solid #000; object-fit: cover; }
      .hc-leader { border: 4px solid #000; padding: 18px; text-align: center; background: linear-gradient(to bottom, #fff, #f8fafc); box-shadow: 5px 5px 0 #000; }
      .hc-rank { color: #000080; font-weight: 1000; }
      .hc-house { margin-top: 6px; font-size: 22px; font-weight: 1000; text-transform: uppercase; }
      .hc-score { margin-top: 12px; font-size: 54px; font-weight: 1000; color: #c2185b; text-shadow: 2px 2px 0 #00000022; }
      .hc-trash { margin-top: 8px; color: #475569; font-size: 12px; font-weight: 900; }
      .hc-badge-wall, .hc-months { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }
      .hc-achievement, .hc-month, .hc-feed-item { border: 2px solid #000; background: #fff; padding: 10px; font-size: 12px; box-shadow: 2px 2px 0 #000; font-weight: 800; }
      .hc-achievement { border-width: 3px; background: #fef08a; font-weight: 1000; }
      .hc-achievement small { display: block; margin-top: 5px; color: #475569; font-weight: 800; }
      .hc-feed { margin-top: 12px; display: grid; gap: 8px; }
      .hc-table-wrap { max-height: 380px; overflow: auto; border: 3px solid #000; background: #fff; }
      .hc-table { width: 100%; border-collapse: collapse; font-size: 13px; }
      .hc-table th { position: sticky; top: 0; background: #ffeb3b; border-bottom: 2px solid #000; padding: 10px; text-align: left; text-transform: uppercase; }
      .hc-table td { border-top: 1px solid #cbd5e1; padding: 10px; }
      .hc-login { max-width: 440px; margin: 18px auto 0; }
      .hc-blink { animation: hc-blink 1s step-start infinite; }
      @keyframes hc-blink { 50% { opacity: 0; } }
      @media (max-width: 860px) { .hc-grid-4, .hc-grid-5, .hc-actions, .hc-tabs, .hc-badge-wall, .hc-months { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 560px) {
        .hc-page { padding: 8px; cursor: auto; }
        .hc-hero { padding: 10px; box-shadow: 4px 4px 0 #000; }
        .hc-kicker { font-size: 11px; padding: 5px 8px; }
        .hc-title { font-size: 40px; letter-spacing: -1px; text-shadow: 1px 1px 0 #fff, 3px 3px 0 #000; }
        .hc-marquee { font-size: 12px; }
        .hc-tabs { grid-template-columns: 1fr 1fr; gap: 6px; }
        .hc-tab { font-size: 11px; padding: 10px 5px; }
        .hc-grid-4, .hc-grid-5, .hc-actions, .hc-badge-wall, .hc-months { grid-template-columns: 1fr; }
        .hc-card, .hc-footer { padding: 12px; box-shadow: 3px 3px 0 #000; }
        .hc-action { min-height: 132px; padding: 14px; box-shadow: 4px 4px 0 #000; }
        .hc-action-title { font-size: 19px; }
        .hc-score { font-size: 44px; }
      }
    `}</style>
  );
}

function runSelfTests() {
  console.assert(QUEST_OPTIONS.some((option) => option.label === "Post-call burrito (or equivalent morale meal)"), "Burrito morale meal option should exist");
  console.assert(!QUEST_OPTIONS.some((option) => /San Xavier/i.test(option.label)), "San Xavier should not be in the quest dropdown");
  console.assert(!QUEST_OPTIONS.some((option) => option.label === "A Mountain summit"), "A Mountain summit should not be in the quest dropdown");
  console.assert(splitAttendanceNames("A, B\nC").length === 3, "Attendance splitting should handle comma and newline input");
  console.assert(findRosterPerson("Nate Walton")?.house === "Catalina", "Known roster person should resolve to house");
  console.assert(authenticateChief("Nate", "wootwoot1!")?.house === "Catalina", "Chief login should authenticate known chief");
  console.assert(findRosterPerson("Eric Brucks")?.role === "PD_APD", "Eric Brucks should be listed as PD/APD");
  console.assert(canChiefApprovePitch("Rosie", { house: "Catalina" }) === true, "Different-house chief should approve pitch");
  console.assert(canChiefApprovePitch("Nate", { house: "Catalina" }) === false, "Same-house chief should not approve pitch");
}
runSelfTests();

export default function HouseCupPointLogger() {
  const [activeTab, setActiveTab] = useState("log");
  const [name, setName] = useState("");
  const [house, setHouse] = useState("");
  const [people, setPeople] = useState("");
  const [note, setNote] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [submitStatus, setSubmitStatus] = useState("");
  const [questLabel, setQuestLabel] = useState(QUEST_OPTIONS[0].label);
  const [currentFeaturedQuest, setCurrentFeaturedQuest] = useState(() => getStoredValue(STORAGE_KEYS.featuredQuest, FEATURED_QUEST_IDEAS[0]));
  const [currentFeaturedNote, setCurrentFeaturedNote] = useState(() => getStoredValue(STORAGE_KEYS.featuredNote, "Photo evidence encouraged. Keep it easy, funny, and wholesome."));
  const [currentMonthlyWellnessMonth, setCurrentMonthlyWellnessMonth] = useState(() => getStoredValue(STORAGE_KEYS.monthlyWellnessMonth, getCurrentMonthlyWellnessQuest().month));
  const [featuredSuggestion, setFeaturedSuggestion] = useState(() => getStoredValue(STORAGE_KEYS.featuredQuest, FEATURED_QUEST_IDEAS[0]));
  const [pointPitchAmount, setPointPitchAmount] = useState(1);
  const [rows, setRows] = useState(() => getStoredRows());
  const [lastSaved, setLastSaved] = useState(null);
  const [sheetStatus, setSheetStatus] = useState("Local backup loaded. Sync Sheet for shared leaderboard.");

  const [chiefName, setChiefName] = useState("");
  const [chiefPassword, setChiefPassword] = useState("");
  const [chiefAuthed, setChiefAuthed] = useState(false);
  const [currentChief, setCurrentChief] = useState("");
  const [chiefMessage, setChiefMessage] = useState("");
  const [attendanceText, setAttendanceText] = useState("");
  const [attendanceTitle, setAttendanceTitle] = useState("AHD / conference attendance");
  const [attendanceDate, setAttendanceDate] = useState(todayString());
  const [attendancePoints, setAttendancePoints] = useState(1);
  const [uploadMessage, setUploadMessage] = useState("");
  const [bonusHouse, setBonusHouse] = useState("");
  const [bonusTitle, setBonusTitle] = useState("Kahoot / trivia bonus");
  const [bonusDate, setBonusDate] = useState(todayString());
  const [bonusPoints, setBonusPoints] = useState(3);
  const [bonusNote, setBonusNote] = useState("");
  const [bonusMessage, setBonusMessage] = useState("");
  const [approvalMessage, setApprovalMessage] = useState("");
  const [approvalPoints, setApprovalPoints] = useState(1);
  const [approvalNote, setApprovalNote] = useState("");

  const rosterMatch = findRosterPerson(name);
  const effectiveHouse = rosterMatch && rosterMatch.house ? rosterMatch.house : house;
  const canSubmit = Boolean(name.trim() && effectiveHouse);
  const totals = useMemo(() => calculateHouseTotals(rows), [rows]);
  const unknownUploads = rows.filter((row) => row && row.house === "Unknown");
  const pendingPointPitches = getPendingPointPitches(rows);
  const achievementBadges = getAchievementBadges(rows);
  const recentSubmissions = getRecentSubmissions(rows);

  useEffect(() => { setStoredRows(rows); }, [rows]);
  useEffect(() => { setStoredValue(STORAGE_KEYS.featuredQuest, currentFeaturedQuest); }, [currentFeaturedQuest]);
  useEffect(() => { setStoredValue(STORAGE_KEYS.featuredNote, currentFeaturedNote); }, [currentFeaturedNote]);
  useEffect(() => { setStoredValue(STORAGE_KEYS.monthlyWellnessMonth, currentMonthlyWellnessMonth); }, [currentMonthlyWellnessMonth]);

  function handlePhotoChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) { setPhotoName(""); setPhotoPreview(""); setPhotoFile(null); return; }
    setPhotoName(file.name);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoFile(file);
  }

  function getQuestSelection() {
    const option = QUEST_OPTIONS.find((item) => item.label === questLabel) || QUEST_OPTIONS[0];
    if (option.questType === "featured_quest") {
      return { ...option, label: "Featured Quest — " + currentFeaturedQuest, note: currentFeaturedNote };
    }
    if (option.questType === "monthly_wellness") {
      const monthQuest = getCurrentMonthlyWellnessQuest(currentMonthlyWellnessMonth);
      return { ...option, label: monthQuest.month + " Monthly Wellness Challenge — " + monthQuest.quest, points: 5, monthlyTheme: monthQuest.theme, monthlyVibe: monthQuest.vibe, proof: monthQuest.proof };
    }
    return option;
  }

  async function syncSheet() {
    try {
      setSheetStatus("Syncing Sheet...");
      const sheetRows = await readSubmissionsFromAppsScript();
      setRows(sheetRows);
      setLastSaved(sheetRows[0] || null);
      setSheetStatus("Synced " + sheetRows.length + " Sheet row(s). Shared leaderboard loaded.");
    } catch (error) {
      setSheetStatus("Could not sync Sheet. Check Apps Script deployment/access.");
      console.error(error);
    }
  }

  async function logActivity(activity) {
    if (!canSubmit) return;
    let finalActivity = activity.label;
    let finalPoints = activity.points;
    let finalCategory = "General";
    let finalQuestType = activity.id;

    if (activity.id === "wellness_community") {
      finalCategory = "Wellness + Community";
      finalQuestType = "wellness_community";
      finalPoints = 3;
    }
    if (activity.id === "big_challenge") {
      const selected = getQuestSelection();
      finalActivity = selected.label;
      finalPoints = selected.points;
      finalCategory = selected.category || "Big Tucson Challenge";
      finalQuestType = selected.questType || "big_tucson";
    }
    if (activity.id === "group_activity") {
      finalCategory = "Group Activity";
      finalQuestType = "group_activity";
    }
    if (activity.id === "group_exercise") {
      finalCategory = "Group Exercise";
      finalQuestType = "group_exercise";
    }
    if (activity.id === "academic") {
      finalCategory = "Academic";
      finalQuestType = "academic";
    }
    if (activity.id === "point_pitch") {
      finalActivity = "Point pitch - chief review requested";
      finalPoints = Number(pointPitchAmount) || 0;
      finalCategory = "Point Pitch";
      finalQuestType = "point_pitch";
      if (!note.trim()) { setSubmitStatus("For a point pitch, tell us why you deserve points in the note field first."); return; }
    }

    const row = {
      timestamp: new Date().toISOString(),
      date: todayString(),
      name: name.trim(),
      house: effectiveHouse,
      activity: finalActivity,
      points: finalPoints,
      category: finalCategory,
      questType: finalQuestType,
      people: people.trim(),
      note: finalQuestType === "point_pitch" ? "Requested " + finalPoints + " point(s): " + note.trim() : note.trim(),
      photoName,
      photoStatus: photoName ? "upload_requested" : "none",
      source: finalQuestType === "point_pitch" ? "resident_point_pitch" : "resident_log",
      uploadedBy: "resident",
      status: finalQuestType === "point_pitch" ? "pending_review" : "approved",
      reviewedBy: "",
      reviewedAt: "",
      reviewNote: "",
      submissionId: makeSubmissionId(),
    };

    setRows((previousRows) => [row].concat(previousRows));
    setLastSaved(row);
    setNote("");
    setSubmitStatus("Uploading to Google Sheet/Drive...");
    try {
      await submitToAppsScript(row, photoFile);
      setSubmitStatus("Submitted.");
    } catch (error) {
      console.error(error);
      setSubmitStatus("Saved locally, but Google upload failed. Export CSV as backup.");
    }
    setPhotoName("");
    setPhotoPreview("");
    setPhotoFile(null);
  }

  function loginChief() {
    const chiefUser = authenticateChief(chiefName, chiefPassword);
    if (chiefUser) { setChiefAuthed(true); setCurrentChief(chiefUser.name); setChiefMessage("Chief mode unlocked as " + chiefUser.name + "."); setActiveTab("chief"); }
    else { setChiefAuthed(false); setCurrentChief(""); setChiefMessage("Get lost punk."); }
  }

  async function importAttendance() {
    const imported = attendanceTextToRows({ text: attendanceText, eventTitle: attendanceTitle, eventDate: attendanceDate, points: Number(attendancePoints) || 1, uploadedBy: currentChief || chiefName || "Unknown chief" });
    if (!imported.length) { setUploadMessage("Paste at least one attendee name."); return; }
    setRows((previousRows) => imported.concat(previousRows));
    setAttendanceText("");
    const unknownCount = imported.filter((row) => row.house === "Unknown").length;
    setUploadMessage("Imported " + imported.length + " attendance entries" + (unknownCount ? " - " + unknownCount + " need roster/house cleanup" : "") + ".");
    try { await submitRowsToAppsScript(imported); setUploadMessage("Imported and submitted " + imported.length + " attendance entries" + (unknownCount ? " - " + unknownCount + " need roster/house cleanup" : "") + "."); } catch (error) { setUploadMessage("Imported locally, but Google upload failed. Export CSV as backup."); }
  }

  async function addChiefBonus() {
    if (!bonusHouse) { setBonusMessage("Choose a house first."); return; }
    const row = chiefBonusToRow({ house: bonusHouse, eventTitle: bonusTitle, eventDate: bonusDate, points: Number(bonusPoints) || 0, note: bonusNote, uploadedBy: currentChief || chiefName || "Unknown chief" });
    setRows((previousRows) => [row].concat(previousRows));
    setBonusNote("");
    setBonusMessage("Added " + row.points + " bonus point(s) to " + row.house + ".");
    try { await submitToAppsScript(row, null); setBonusMessage("Added and submitted " + row.points + " bonus point(s) to " + row.house + "."); } catch (error) { setBonusMessage("Added locally, but Google upload failed. Export CSV as backup."); }
  }

  function reviewPointPitch(submission, index, decision) {
    const submissionKey = submission.submissionId || submission.timestamp + "-" + index;
    if (!canChiefApprovePitch(currentChief, submission)) { setApprovalMessage("Conflict check: chiefs cannot approve/deny point pitches from their own house. Ask a chief from another house."); return; }
    setRows((previousRows) => reviewPointPitchRows(previousRows, submissionKey, decision, Number(approvalPoints) || submission.points || 0, currentChief, approvalNote));
    setApprovalMessage((decision === "approve" ? "Approved" : "Denied") + " point pitch for " + submission.name + ".");
    setApprovalNote("");
  }

  function clearRows() {
    setRows([]);
    setStoredRows([]);
    setLastSaved(null);
    setUploadMessage("");
    setBonusMessage("");
    setApprovalMessage("");
    setSheetStatus("Local browser data cleared. Google Sheet data is unchanged.");
  }

  async function testBackendConnection() {
    try {
      setSheetStatus("Testing Apps Script backend...");
      await submitToAppsScript({
        timestamp: new Date().toISOString(),
        date: todayString(),
        name: "backend test",
        house: getChiefHouse(currentChief) || "Unknown",
        activity: "backend connection test",
        points: 0,
        category: "Test",
        questType: "backend_test",
        people: "",
        note: "If this row appears in the Submissions sheet, the web app is connected to Apps Script.",
        photoName: "",
        photoStatus: "not_required",
        source: "web_app_backend_test",
        uploadedBy: currentChief || "chief",
        status: "approved",
        reviewedBy: currentChief || "",
        reviewedAt: new Date().toISOString(),
        reviewNote: "",
        submissionId: makeSubmissionId(),
      }, null);
      setSheetStatus("Backend test sent. Check the Submissions sheet for a backend connection test row.");
    } catch (error) {
      setSheetStatus("Backend test failed locally. Check Apps Script URL/deployment/access.");
      console.error(error);
    }
  }

  return (
    <div className="hc-page">
      <HouseCupStyles />
      <div className="hc-shell">
        <header className="hc-hero">
          <div className="hc-kicker">🏔️ UA Internal Medicine House Cup</div>
          <h1 className="hc-title">Point-O-Matic</h1>
          <div className="hc-marquee-wrap"><div className="hc-marquee">★ WELCOME RESIDENTS &amp; FACULTY ★ LOG YOUR POINTS ★ DO COOL STUFF ★ TOUCH GRASS ★ BE WELL ★</div></div>
          <div className="hc-counterbar"><div className="hc-underconstruction">UNDER CONSTRUCTION</div><a className="hc-webmaster" href="mailto:nathantwalton@gmail.com?subject=House%20Cup%20bug%20%2F%20goblin%20complaint&body=Dear%20webmaster%2C%0A%0AI%20regret%20to%20inform%20you...%0A%0AThe%20problem%20is%3A%0A%0AHouse%3A%0AName%3A%0AScreenshot%20or%20evidence%3A%0A%0AWith%20respectful%20chaos%2C%0A">email the webmaster</a><div className="hc-counter">Status: <span className="hc-blink">ONLINE</span></div></div>
        </header>

        <nav className="hc-tabs">
          <TabButton active={activeTab === "log"} onClick={() => setActiveTab("log")}>Resident Zone</TabButton>
          <TabButton active={activeTab === "leaderboard"} onClick={() => setActiveTab("leaderboard")}>Hall of Glory</TabButton>
          <TabButton active={activeTab === "chiefLogin" || activeTab === "chief"} onClick={() => setActiveTab(chiefAuthed ? "chief" : "chiefLogin")}>Secret Chief Lair</TabButton>
          <TabButton active={activeTab === "data"} onClick={() => setActiveTab("data")}>Nerd Stuff</TabButton>
        </nav>

        {activeTab === "log" && (
          <section>
            <div className="hc-card">
              <div className="hc-grid hc-grid-4">
                <div>
                  <FieldLabel>Resident/Faculty/Staff name</FieldLabel>
                  <TextInput list="names" value={name} onChange={(event) => setName(event.target.value)} placeholder="Start typing..." />
                  <datalist id="names">{ROSTER.map((person) => <option key={person.name} value={person.name} />)}</datalist>
                </div>
                <div>
                  <FieldLabel>House</FieldLabel>
                  {rosterMatch ? <div className="hc-input"><b>{rosterMatch.house}</b> <span className="hc-muted">auto</span></div> : <SelectInput value={house} onChange={(event) => setHouse(event.target.value)}><option value="">Choose house</option>{HOUSES.map((h) => <option key={h} value={h}>{h}</option>)}</SelectInput>}
                </div>
                <div><FieldLabel>People with you</FieldLabel><TextInput value={people} onChange={(event) => setPeople(event.target.value)} placeholder="Optional" /></div>
                <div><FieldLabel>Photo evidence</FieldLabel><input className="hc-input" type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} />{photoName && <div className="hc-muted">Selected: {photoName}</div>}{photoPreview && <img className="hc-photo-preview" src={photoPreview} alt="Evidence preview" />}</div>
              </div>
              <div style={{ marginTop: 12 }}><FieldLabel>Note or supporting documentation</FieldLabel><TextInput value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional, unless using point pitch" /></div>
              {!canSubmit && <div className="hc-alert">Enter your name and house once, then submit points.</div>}
            </div>

            <div className="hc-card">
              <div className="hc-grid hc-grid-4">
                <div style={{ gridColumn: "span 3" }}><FieldLabel>Quest picker</FieldLabel><SelectInput value={questLabel} onChange={(event) => setQuestLabel(event.target.value)}>{QUEST_OPTIONS.map((opt) => <option key={opt.label} value={opt.label}>{opt.category}: {opt.label} (+{opt.points || "?"})</option>)}</SelectInput></div>
                <div><FieldLabel>Point pitch amount</FieldLabel><TextInput type="number" min="0" value={pointPitchAmount} onChange={(event) => setPointPitchAmount(event.target.value)} placeholder="?" /></div>
              </div>
              <div className="hc-quest-card">Current Featured Quest: {currentFeaturedQuest} (+5)</div>
              <div className="hc-quest-card">Monthly Wellness: {getCurrentMonthlyWellnessQuest(currentMonthlyWellnessMonth).month} — {getCurrentMonthlyWellnessQuest(currentMonthlyWellnessMonth).quest} (+5). Proof: {getCurrentMonthlyWellnessQuest(currentMonthlyWellnessMonth).proof}</div>
              <div className="hc-muted" style={{ marginTop: 10 }}>Use this dropdown for Featured Quest, Monthly Wellness Challenge, or Big Tucson/custom challenges. Otherwise mash respective button below.</div>
            </div>

            <div className="hc-actions">
              {RESIDENT_ACTIVITIES.map((activity) => {
                const quest = getQuestSelection();
                const usesQuestPicker = activity.id === "big_challenge";
                const isPitch = activity.id === "point_pitch";
                const shownPoints = usesQuestPicker ? quest.points : isPitch ? "?" : activity.points;
                const shownDescription = usesQuestPicker ? quest.label : isPitch ? "Requested: +" + (Number(pointPitchAmount) || 0) + " · requires note/chief review" : activity.description;
                return <button key={activity.id} type="button" onClick={() => logActivity(activity)} disabled={!canSubmit} className="hc-action" style={{ background: activity.color }}><div className="hc-action-top"><span className="hc-icon">{activity.icon}</span><span className="hc-badge">{activity.id === "point_pitch" ? "+?" : "+" + (activity.id === "wellness_community" ? 3 : shownPoints)}</span></div><div className="hc-action-title">{activity.label}</div><p className="hc-action-desc">{activity.id === "big_challenge" ? "" : activity.id === "point_pitch" ? "For unsanctioned excellence and suspiciously wholesome nonsense." : shownDescription}</p></button>;
              })}
            </div>

            {submitStatus && <div className="hc-alert">{submitStatus}</div>}
            {lastSaved && <div className="hc-success">Saved: {lastSaved.activity} · {lastSaved.name} · {lastSaved.house} · +{lastSaved.points} pts {lastSaved.photoName ? "· photo selected" : ""}</div>}
            <section className="hc-footer"><b>Scoring:</b> AHD/conference = 1 point/hour via chief upload · Group activity = 2 (3+ people) · Group exercise = 2 (3+ people) · Academic flex = 3+ · Wellness + community = 3 · Monthly wellness challenge = 5 · Big Tucson challenges = 5 · Tell me why I should give you points? = chief review.</section>
          </section>
        )}

        {activeTab === "leaderboard" && (
          <section>
            <div className="hc-row" style={{ marginTop: 18 }}><button className="hc-button" type="button" onClick={syncSheet}>Sync Sheet</button><span className="hc-muted">{sheetStatus}</span></div>
            <div className="hc-grid hc-grid-5" style={{ marginTop: 18 }}>{totals.map((total, index) => <div key={total.house} className="hc-leader"><div className="hc-rank">{getLeaderboardRankLabel(index)}</div><div className="hc-house">{total.house}</div><div className="hc-score">{total.points}</div><div className="hc-muted">points</div><div className="hc-trash">{getLeaderboardTrashTalk(index)}</div></div>)}</div>
            <div className="hc-card"><h3>Achievement Badges</h3>{achievementBadges.length === 0 && <div className="hc-alert">No badges yet. Be the first to do literally anything.</div>}<div className="hc-badge-wall">{achievementBadges.map((badge) => <div key={badge.label} className="hc-achievement">{badge.label}<small>{badge.detail}</small></div>)}</div></div>
            <div className="hc-card"><h3>Mini Wall of Fame</h3>{recentSubmissions.length === 0 && <div className="hc-alert">No submissions yet. The wall is tragically blank.</div>}<div className="hc-feed">{recentSubmissions.map((item, index) => <div key={index} className="hc-feed-item">{item.emoji} {item.text}</div>)}</div></div>
            <div className="hc-card"><h3>Monthly Wellness Quests</h3><div className="hc-months">{MONTHLY_WELLNESS_QUESTS.map((month) => <div key={month.month} className="hc-month"><b>{month.month}: {month.theme}</b><br />{month.quest}<br /><span className="hc-muted">{month.vibe}<br />Proof: {month.proof}</span></div>)}</div></div>
          </section>
        )}

        {activeTab === "chiefLogin" && (
          <section className="hc-card hc-login"><h2>🔐 Chief back-end</h2><p className="hc-muted">Chief uploads are tagged by uploader. Front-end login is light gatekeeping only — replace with real authentication before launch.</p><div style={{ marginTop: 12 }}><FieldLabel>Name</FieldLabel><TextInput value={chiefName} onChange={(event) => setChiefName(event.target.value)} placeholder="Nate" /></div><div style={{ marginTop: 12 }}><FieldLabel>Password</FieldLabel><TextInput type="password" value={chiefPassword} onChange={(event) => setChiefPassword(event.target.value)} placeholder="get lost punk" /></div><div className="hc-row" style={{ marginTop: 14 }}><button type="button" className="hc-button" onClick={loginChief}>Enter chief mode</button>{chiefMessage && <span className="hc-muted">{chiefMessage}</span>}</div></section>
        )}

        {activeTab === "chief" && chiefAuthed && (
          <section className="hc-card"><div className="hc-row" style={{ justifyContent: "space-between" }}><div><h2>Secret Chief Lair</h2><p className="hc-muted">Logged in as <b>{currentChief}</b> ({getChiefHouse(currentChief)}). AHD/conference upload = 1 point/hour by default. Kahoot/trivia/custom bonuses are manually awarded here.</p></div><button type="button" className="hc-button secondary" onClick={() => { setChiefAuthed(false); setCurrentChief(""); setActiveTab("chiefLogin"); }}>Log out</button></div>
            <div className="hc-card" style={{ boxShadow: "none" }}><h3>Google Docs / Drive settings</h3><p className="hc-muted">Admin/contact: <b>{ADMIN_EMAIL}</b>. Submissions sheet: <a href={GOOGLE_SUBMISSIONS_SHEET_URL} target="_blank" rel="noreferrer">open Google Sheet</a>. Evidence folder: <a href={GOOGLE_EVIDENCE_FOLDER_URL} target="_blank" rel="noreferrer">open Google Drive folder</a>. Apps Script endpoint: <a href={APPS_SCRIPT_WEB_APP_URL} target="_blank" rel="noreferrer">open backend</a>.</p><div className="hc-row" style={{ marginTop: 10 }}><button type="button" className="hc-button secondary" onClick={testBackendConnection}>Send backend test row</button><button type="button" onClick={clearRows} disabled={!rows.length} className="hc-button danger">Clear local browser data</button></div><p className="hc-muted">Clearing local data only resets this browser. It does not delete the Google Sheet.</p></div>
            <div className="hc-card" style={{ boxShadow: "none" }}><h3>Featured Quest / Monthly Wellness controls</h3><p className="hc-muted">This updates this browser and is saved locally. To make it global across everyone, store settings in the Sheet backend later.</p><div className="hc-grid hc-grid-4"><div><FieldLabel>Featured quest idea bank</FieldLabel><SelectInput value={featuredSuggestion} onChange={(event) => { setFeaturedSuggestion(event.target.value); setCurrentFeaturedQuest(event.target.value); }}>{FEATURED_QUEST_IDEAS.map((idea) => <option key={idea} value={idea}>{idea}</option>)}</SelectInput><button type="button" className="hc-button secondary" style={{ marginTop: 8 }} onClick={() => { const idea = getRandomFeaturedQuestIdea(); setFeaturedSuggestion(idea); setCurrentFeaturedQuest(idea); }}>🎲 Random sweet quest</button></div><div><FieldLabel>Current featured quest</FieldLabel><TextInput value={currentFeaturedQuest} onChange={(event) => setCurrentFeaturedQuest(event.target.value)} /></div><div><FieldLabel>Featured quest note</FieldLabel><TextInput value={currentFeaturedNote} onChange={(event) => setCurrentFeaturedNote(event.target.value)} /></div><div><FieldLabel>Monthly wellness challenge</FieldLabel><SelectInput value={currentMonthlyWellnessMonth} onChange={(event) => setCurrentMonthlyWellnessMonth(event.target.value)}>{MONTHLY_WELLNESS_QUESTS.map((month) => <option key={month.month} value={month.month}>{month.month}: {month.theme}</option>)}</SelectInput></div></div><div className="hc-quest-card">Resident view now shows: Featured Quest — {currentFeaturedQuest} (+5)</div><div className="hc-quest-card">Monthly Wellness: {getCurrentMonthlyWellnessQuest(currentMonthlyWellnessMonth).month} — {getCurrentMonthlyWellnessQuest(currentMonthlyWellnessMonth).quest}</div></div>
            <div className="hc-grid hc-grid-4" style={{ marginTop: 18 }}><div><FieldLabel>AHD event title</FieldLabel><TextInput value={attendanceTitle} onChange={(event) => setAttendanceTitle(event.target.value)} /></div><div><FieldLabel>Date</FieldLabel><TextInput type="date" value={attendanceDate} onChange={(event) => setAttendanceDate(event.target.value)} /></div><div><FieldLabel>Points/hour</FieldLabel><TextInput type="number" min="1" value={attendancePoints} onChange={(event) => setAttendancePoints(event.target.value)} /></div><div style={{ alignSelf: "end" }}><button type="button" className="hc-button" onClick={importAttendance}>Upload AHD</button></div></div>
            <div style={{ marginTop: 12 }}><FieldLabel>AHD/conference attendees</FieldLabel><textarea className="hc-input" style={{ minHeight: 110 }} value={attendanceText} onChange={(event) => setAttendanceText(event.target.value)} placeholder={"Paste names here:\nNate Walton\nResident Example\nFaculty Example"} /></div>{uploadMessage && <div className="hc-success">{uploadMessage}</div>}{unknownUploads.length > 0 && <div className="hc-alert">{unknownUploads.length} uploaded attendee(s) did not match roster.</div>}
            <hr style={{ margin: "24px 0", border: "none", borderTop: "3px dashed #111827" }} />
            <h3>Approval Zone</h3><p className="hc-muted">Point pitches must be approved or denied by a chief who is not in the same house.</p><div className="hc-grid hc-grid-4" style={{ marginTop: 12 }}><div><FieldLabel>Approved points</FieldLabel><TextInput type="number" min="0" value={approvalPoints} onChange={(event) => setApprovalPoints(event.target.value)} /></div><div><FieldLabel>Review note</FieldLabel><TextInput value={approvalNote} onChange={(event) => setApprovalNote(event.target.value)} placeholder="Optional" /></div><div className="hc-muted" style={{ alignSelf: "end" }}>Logged in as {currentChief} ({getChiefHouse(currentChief)}).</div></div>
            {pendingPointPitches.length === 0 && <div className="hc-alert">No pending point pitches.</div>}{pendingPointPitches.map((pitch, index) => { const blocked = !canChiefApprovePitch(currentChief, pitch); return <div key={pitch.submissionId || pitch.timestamp + "-" + index} className="hc-card" style={{ boxShadow: "none", background: blocked ? "#fee2e2" : "#fff7b8" }}><div><b>{pitch.name}</b> · {pitch.house} · requested +{pitch.points}</div><div className="hc-muted">{pitch.note}</div><div className="hc-muted">Conflict check: {blocked ? "BLOCKED — same house or unknown house" : "OK — different house chief"}</div><div className="hc-row" style={{ marginTop: 10 }}><button type="button" className="hc-button" disabled={blocked} onClick={() => reviewPointPitch(pitch, index, "approve")}>Approve</button><button type="button" className="hc-button danger" disabled={blocked} onClick={() => reviewPointPitch(pitch, index, "deny")}>Deny</button></div></div>; })}{approvalMessage && <div className="hc-success">{approvalMessage}</div>}
            <hr style={{ margin: "24px 0", border: "none", borderTop: "3px dashed #111827" }} />
            <h3>Kahoot / trivia / bonus points</h3><div className="hc-grid hc-grid-5"><div><FieldLabel>House</FieldLabel><SelectInput value={bonusHouse} onChange={(event) => setBonusHouse(event.target.value)}><option value="">Choose house</option>{HOUSES.map((h) => <option key={h} value={h}>{h}</option>)}</SelectInput></div><div><FieldLabel>Bonus title</FieldLabel><TextInput value={bonusTitle} onChange={(event) => setBonusTitle(event.target.value)} /></div><div><FieldLabel>Date</FieldLabel><TextInput type="date" value={bonusDate} onChange={(event) => setBonusDate(event.target.value)} /></div><div><FieldLabel>Points</FieldLabel><TextInput type="number" min="0" value={bonusPoints} onChange={(event) => setBonusPoints(event.target.value)} /></div><div style={{ alignSelf: "end" }}><button type="button" className="hc-button" onClick={addChiefBonus}>Add bonus</button></div></div><div style={{ marginTop: 12 }}><FieldLabel>Bonus note</FieldLabel><TextInput value={bonusNote} onChange={(event) => setBonusNote(event.target.value)} placeholder="Winner, runner-up, chaos award, etc." /></div>{bonusMessage && <div className="hc-success">{bonusMessage}</div>}
          </section>
        )}

        {activeTab === "data" && (
          <section className="hc-card"><div className="hc-row"><button type="button" onClick={syncSheet} className="hc-button">🔄 Sync Sheet</button><a className="hc-button secondary" href={GOOGLE_SUBMISSIONS_SHEET_URL} target="_blank" rel="noreferrer">Open Google Sheet</a><button type="button" onClick={() => downloadCSV(rows)} disabled={!rows.length} className="hc-button">⬇️ Download CSV</button></div><div className="hc-alert">{sheetStatus}</div><h3>Submission log</h3><div className="hc-table-wrap" style={{ marginTop: 14 }}><table className="hc-table"><thead><tr><th>When</th><th>Date</th><th>Name</th><th>House</th><th>Activity</th><th>Pts</th><th>Status</th><th>Photo</th><th>Source</th></tr></thead><tbody>{rows.map((row, index) => <tr key={row.submissionId || row.timestamp + "-" + index}><td>{row.timestamp ? new Date(row.timestamp).toLocaleString() : ""}</td><td>{row.date}</td><td>{row.name}</td><td>{row.house}</td><td>{row.activity}</td><td><b>{row.points}</b></td><td>{row.status || "approved"}</td><td>{row.photoUrl ? <a href={row.photoUrl} target="_blank" rel="noreferrer">photo</a> : ""}</td><td>{row.source}</td></tr>)}{!rows.length && <tr><td colSpan="9" style={{ textAlign: "center", color: "#64748b" }}>No points logged yet.</td></tr>}</tbody></table></div><h3 style={{ marginTop: 22 }}>Roster reference</h3><p className="hc-muted">Use this to check house assignments when logging attendance or adding new folks to the external roster sheet.</p><div className="hc-table-wrap" style={{ marginTop: 14 }}><table className="hc-table"><thead><tr><th>Name</th><th>House</th><th>Role</th></tr></thead><tbody>{ROSTER.slice().sort((a, b) => a.house.localeCompare(b.house) || a.role.localeCompare(b.role) || a.name.localeCompare(b.name)).map((person) => <tr key={person.name}><td>{person.name}</td><td>{person.house}</td><td>{person.role}</td></tr>)}</tbody></table></div></section>
        )}
      </div>
      <Analytics />
    </div>
  );
}
