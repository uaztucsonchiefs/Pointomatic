import React, { useEffect, useMemo, useState } from "react";

/*
  House Cup Point-O-Matic
  Mobile-first resident submission update

  Replace these three constants after you finish the chiefs-Gmail migration.
*/
const APPS_SCRIPT_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyO1HJ0dokejC574nuUeMdPgQcrMAcrXXVpG6ZnLCT3SNAAyze6XYtlafqsXCEbyiE/exec";

const GOOGLE_SUBMISSIONS_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1-qxEZt2q_n6Len0yIcMfODnLyIsDfz-yhD60AkcSz5U/edit?gid=1636192795#gid=1636192795";

const GOOGLE_EVIDENCE_FOLDER_URL =
  "https://drive.google.com/drive/folders/1R55IwjF-h1XnklopowLxctU_9RRdM6Hp";

const ADMIN_EMAIL = "uaztucsonchiefs@gmail.com";

const HOUSES = [
  { name: "Catalina", icon: "🏔️" },
  { name: "Rincon", icon: "🌄" },
  { name: "Santa Rita", icon: "🌵" },
  { name: "Tortolita", icon: "🦎" },
  { name: "Tucson", icon: "☀️" },
];

const CHIEF_USERS = [
  { name: "Nate", fullName: "Nate Walton", password: "wootwoot1!" },
  { name: "Rosie", fullName: "Rosie Turk", password: "wootwoot1!" },
  { name: "Amrutha", fullName: "Amrutha Doniparthi", password: "wootwoot1!" },
  { name: "Will", fullName: "Will Waidelich", password: "wootwoot1!" },
  { name: "Johnny", fullName: "Johnny Trinh", password: "wootwoot1!" },
];

const QUESTS = [
  {
    key: "group_activity",
    icon: "👯",
    title: "Group activity",
    shortTitle: "Group",
    points: 2,
    status: "approved",
    notePlaceholder: "What did you do? Who was there?",
  },
  {
    key: "exercise",
    icon: "💪",
    title: "Exercise / wellness",
    shortTitle: "Exercise",
    points: 2,
    status: "approved",
    notePlaceholder: "Run, lift, hike, bike, yoga, pickleball, etc.",
  },
  {
    key: "academic",
    icon: "🧠",
    title: "Academic flex",
    shortTitle: "Academic",
    points: 3,
    status: "approved",
    notePlaceholder: "Questions, teaching, article, chalk talk, etc.",
  },
  {
    key: "community",
    icon: "🌿",
    title: "Wellness + community",
    shortTitle: "Community",
    points: 3,
    status: "approved",
    notePlaceholder: "Volunteer, potluck, resident support, community thing.",
  },
  {
    key: "big_tucson",
    icon: "🌵",
    title: "Big Tucson challenge",
    shortTitle: "Tucson",
    points: 5,
    status: "approved",
    notePlaceholder: "Mt. Lemmon, Sabino, Tumamoc, local chaos, etc.",
  },
  {
    key: "pitch",
    icon: "🤔",
    title: "Pitch me points",
    shortTitle: "Pitch",
    points: "",
    status: "pending",
    notePlaceholder: "Sell this to the chiefs. What happened and why is it point-worthy?",
  },
];

const ROSTER = [
  { name: "Nate Walton", house: "Catalina", role: "Chief" },
  { name: "Amrutha Doniparthi", house: "Rincon", role: "Chief" },
  { name: "Will Waidelich", house: "Santa Rita", role: "Chief" },
  { name: "Johnny Trinh", house: "Tortolita", role: "Chief" },
  { name: "Rosie Turk", house: "Tucson", role: "Chief" },
  { name: "Mattia Walter", house: "Catalina", role: "Resident", tag: "B" },
  { name: "David Hendrix", house: "Rincon", role: "Resident", tag: "T" },
  { name: "Dwani Patel", house: "Santa Rita", role: "Resident", tag: "J" },
  { name: "Monica Angeletti", house: "Tortolita", role: "Resident", tag: "R" },
  { name: "Jared Stillman", house: "Tucson", role: "Resident", tag: "J" },
  { name: "Celeste Gracey", house: "Catalina", role: "Resident", tag: "J" },
  { name: "Kellie Jeong", house: "Rincon", role: "Resident", tag: "B" },
  { name: "Matthew Lansman", house: "Santa Rita", role: "Resident", tag: "J" },
  { name: "Nicholas Genz", house: "Tortolita", role: "Resident", tag: "B" },
  { name: "Swetha Vennelaganti", house: "Tucson", role: "Resident", tag: "B" },
  { name: "Robert Sumner", house: "Catalina", role: "Resident", tag: "R" },
  { name: "Costa Dalis", house: "Rincon", role: "Resident", tag: "J" },
  { name: "Kaitlyn Baber", house: "Santa Rita", role: "Resident", tag: "R" },
  { name: "Jesse Ritter", house: "Tortolita", role: "Resident", tag: "B" },
  { name: "Faith Kim", house: "Tucson", role: "Resident", tag: "T" },
  { name: "Tim Yu", house: "Catalina", role: "Resident", tag: "T" },
  { name: "Levi Cohen", house: "Rincon", role: "Resident", tag: "T" },
  { name: "Kathryn Pulling", house: "Santa Rita", role: "Resident", tag: "T" },
  { name: "Swathi Somisetty", house: "Tortolita", role: "Resident", tag: "J" },
  { name: "Ryan Schmidt", house: "Tucson", role: "Resident", tag: "R" },
  { name: "Justin Le", house: "Catalina", role: "Resident", tag: "J" },
  { name: "Dimitrios Filloglou", house: "Rincon", role: "Resident", tag: "B" },
  { name: "Adrianna Diviero", house: "Santa Rita", role: "Resident", tag: "B" },
  { name: "Grace Speer", house: "Tortolita", role: "Resident", tag: "T" },
  { name: "Frederick Pan", house: "Tucson", role: "Resident", tag: "T" },
  { name: "Isabella Campos Aguiar", house: "Catalina", role: "Resident", tag: "R" },
  { name: "Shaik Firdhos", house: "Rincon", role: "Resident", tag: "J" },
  { name: "Rami Khoshaba", house: "Santa Rita", role: "Resident", tag: "T" },
  { name: "Megan Kohn", house: "Tortolita", role: "Resident", tag: "R" },
  { name: "Emily Ploom", house: "Tucson", role: "Resident", tag: "B" },
  { name: "Alexander Candel", house: "Catalina", role: "Resident", tag: "T" },
  { name: "Alousius Fombang", house: "Rincon", role: "Resident", tag: "R" },
  { name: "Henry Lang", house: "Santa Rita", role: "Resident", tag: "R" },
  { name: "Kenneth Silvestro", house: "Tortolita", role: "Resident", tag: "J" },
  { name: "Cole Sander", house: "Tucson", role: "Resident", tag: "J" },
  { name: "Nassim Idouraine", house: "Rincon", role: "Resident", tag: "R" },
  { name: "Bryce Little", house: "Santa Rita", role: "Resident", tag: "B" },
  { name: "Duy Nguyen", house: "Tortolita", role: "Resident", tag: "T" },
  { name: "Arpan Sharma", house: "Tucson", role: "Resident", tag: "R" },
  { name: "Rishab Srivastava", house: "Catalina", role: "Resident", tag: "S" },
  { name: "Kalvin Thomas", house: "Rincon", role: "Resident", tag: "O" },
  { name: "Ajdin Ekic", house: "Santa Rita", role: "Resident", tag: "C" },
  { name: "Mathew Thomas", house: "Tortolita", role: "Resident", tag: "P" },
  { name: "Drew Rasmussen", house: "Tucson", role: "Resident", tag: "A" },
  { name: "Faissal Stipho", house: "Catalina", role: "Resident", tag: "S" },
  { name: "Matthew Ward", house: "Rincon", role: "Resident", tag: "O" },
  { name: "Dustin Parsons", house: "Santa Rita", role: "Resident", tag: "C" },
  { name: "Marlee Panther", house: "Tortolita", role: "Resident", tag: "P" },
  { name: "Danielle Bailey", house: "Tucson", role: "Resident", tag: "A" },
  { name: "Shenar Dinkha", house: "Catalina", role: "Resident", tag: "S" },
  { name: "William Matloff", house: "Rincon", role: "Resident", tag: "O" },
  { name: "Ricardo Reyes", house: "Santa Rita", role: "Resident", tag: "C" },
  { name: "Christian Avalos", house: "Tortolita", role: "Resident", tag: "P" },
  { name: "Ryan Weyker", house: "Tucson", role: "Resident", tag: "A" },
  { name: "Asael Nunez", house: "Catalina", role: "Resident", tag: "S" },
  { name: "Sydney Lovins", house: "Rincon", role: "Resident", tag: "O" },
  { name: "Christopher Sallurday", house: "Santa Rita", role: "Resident", tag: "C" },
  { name: "Eduardo Garcia Licerio", house: "Tortolita", role: "Resident", tag: "P" },
  { name: "Tammy Zamaitis", house: "Tucson", role: "Resident", tag: "A" },
  { name: "Spencer Chee", house: "Catalina", role: "Resident", tag: "S" },
  { name: "Gowtham Anche", house: "Rincon", role: "Resident", tag: "O" },
  { name: "Gagandeep Gill", house: "Santa Rita", role: "Resident", tag: "C" },
  { name: "Emily Tishkoff", house: "Tortolita", role: "Resident", tag: "P" },
  { name: "Mujtaba Shah", house: "Tucson", role: "Resident", tag: "A" },
  { name: "Laura Tran", house: "Catalina", role: "Resident", tag: "S" },
  { name: "Andres Sanchez", house: "Rincon", role: "Resident", tag: "O" },
  { name: "Brett Martin", house: "Santa Rita", role: "Resident", tag: "C" },
  { name: "Tolulope Popoola", house: "Tortolita", role: "Resident", tag: "P" },
  { name: "Nellie Toliver", house: "Tucson", role: "Resident", tag: "A" },
  { name: "Joy Eskandar", house: "Catalina", role: "Resident", tag: "S" },
  { name: "Benjamin Maglajac", house: "Rincon", role: "Resident", tag: "O" },
  { name: "Esther Cheng", house: "Santa Rita", role: "Resident", tag: "C" },
  { name: "Jessica Kitsen", house: "Tortolita", role: "Resident", tag: "P" },
  { name: "Rachel Rosow", house: "Tucson", role: "Resident", tag: "A" },
  { name: "Emily Adamson", house: "Catalina", role: "Resident", tag: "S" },
  { name: "Srijit Paul", house: "Rincon", role: "Resident", tag: "O" },
  { name: "Mohamad Al-Mula Hwaish", house: "Santa Rita", role: "Resident", tag: "C" },
  { name: "Noorhan Monther", house: "Tortolita", role: "Resident", tag: "P" },
  { name: "Nina Maitra", house: "Tucson", role: "Resident", tag: "A" },
  { name: "Ho Hyun Lee", house: "Catalina", role: "Resident", tag: "S" },
  { name: "Alex Wang", house: "Rincon", role: "Resident", tag: "O" },
  { name: "Nicole Price", house: "Santa Rita", role: "Resident", tag: "C" },
  { name: "Isaac Zarif", house: "Tortolita", role: "Resident", tag: "P" },
  { name: "Shawn Wang", house: "Tucson", role: "Resident", tag: "A" },
  { name: "Suzette Lopez Valenzuela", house: "Catalina", role: "Resident", tag: "S" },
  { name: "Kent Lawrence", house: "Rincon", role: "Resident", tag: "O" },
  { name: "Tyler Hill", house: "Santa Rita", role: "Resident", tag: "C" },
  { name: "Nandini Sodhi", house: "Tortolita", role: "Resident", tag: "P" },
  { name: "Ethan Renfrew", house: "Tucson", role: "Resident", tag: "A" },
  { name: "Jesse Coy", house: "Catalina", role: "Resident", tag: "S" },
  { name: "Myles Bosompem", house: "Rincon", role: "Resident", tag: "O" },
  { name: "Mariah Black", house: "Santa Rita", role: "Resident", tag: "C" },
  { name: "Jasmine Coatley-Thomas", house: "Tortolita", role: "Resident", tag: "P" },
  { name: "D'Andre Gomez", house: "Tucson", role: "Resident", tag: "A" },
  { name: "Cassandra Everly", house: "Catalina", role: "Resident" },
  { name: "Sarah Busch", house: "Rincon", role: "Resident" },
  { name: "Shreeya Agrawal", house: "Santa Rita", role: "Resident" },
  { name: "Jackie Maltagliati", house: "Tortolita", role: "Resident" },
  { name: "Nathan Giauque", house: "Tucson", role: "Resident" },
  { name: "Adam Western", house: "Catalina", role: "Resident" },
  { name: "Michael Palomares", house: "Rincon", role: "Resident" },
  { name: "Luca Bertozzi", house: "Santa Rita", role: "Resident" },
  { name: "Hyun Kim", house: "Tortolita", role: "Resident" },
  { name: "Khaja Siddiqui", house: "Tucson", role: "Resident" },
  { name: "Basem Al-Tarshan", house: "Catalina", role: "Resident" },
  { name: "Jason Chen", house: "Rincon", role: "Resident" },
  { name: "Joey Ghotmi", house: "Santa Rita", role: "Resident" },
  { name: "Angela Monetathchi", house: "Tortolita", role: "Resident" },
  { name: "Brielle Tobin", house: "Tucson", role: "Resident" },
  { name: "Sara Castaneda", house: "Catalina", role: "Resident" },
  { name: "Soojung Choi", house: "Rincon", role: "Resident" },
  { name: "Kassandra Mastras", house: "Santa Rita", role: "Resident" },
  { name: "Joshua Nay", house: "Tortolita", role: "Resident" },
  { name: "Shana Zadron", house: "Tucson", role: "Resident" },
  { name: "Amanda Gong", house: "Catalina", role: "Resident" },
  { name: "Milan Hirpara", house: "Rincon", role: "Resident" },
  { name: "Francine Holguin", house: "Santa Rita", role: "Resident" },
  { name: "Jocelyn Liu", house: "Tortolita", role: "Resident" },
  { name: "Isam Allanouf", house: "Tucson", role: "Resident" },
  { name: "Paige Awtrey", house: "Catalina", role: "Resident" },
  { name: "Ryan Hakim", house: "Rincon", role: "Resident" },
  { name: "Rambod Meshgi", house: "Santa Rita", role: "Resident" },
  { name: "Ryan Waggoner", house: "Tortolita", role: "Resident" },
  { name: "Laura Zelis", house: "Tucson", role: "Resident" },
  { name: "Riley Huffman", house: "Catalina", role: "Resident" },
  { name: "Alexander Kim", house: "Rincon", role: "Resident" },
  { name: "Lucas Lane", house: "Santa Rita", role: "Resident" },
  { name: "Christina Lim", house: "Tortolita", role: "Resident" },
  { name: "Estevan Sandoval", house: "Tucson", role: "Resident" },
  { name: "Samuel Stewart", house: "Catalina", role: "Resident" },
];

function normalizeName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 '\-]/g, "")
    .trim();
}

function dedupePeople(list) {
  const seen = new Set();
  return list.filter((person) => {
    if (!person?.name) return false;
    const key = normalizeName(person.name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function findRosterPerson(name, roster = ROSTER) {
  const needle = normalizeName(name);
  if (!needle) return null;
  return (
    roster.find((p) => normalizeName(p.name) === needle) ||
    roster.find((p) => normalizeName(p.name).includes(needle) || needle.includes(normalizeName(p.name))) ||
    null
  );
}

function getHouseIcon(houseName) {
  return HOUSES.find((h) => h.name === houseName)?.icon || "🏆";
}

function toCsv(rows) {
  const headers = [
    "timestamp",
    "name",
    "house",
    "quest",
    "points",
    "status",
    "people",
    "note",
    "photoUrl",
  ];

  const escapeCell = (value) => {
    const s = String(value ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  return [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escapeCell(row[h])).join(",")),
  ].join("\n");
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function jsonp(url, timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    const callbackName = "houseCupJsonp_" + Math.random().toString(36).slice(2);
    const script = document.createElement("script");
    const cleanup = () => {
      delete window[callbackName];
      script.remove();
    };

    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("Could not load Apps Script JSONP endpoint."));
    }, timeoutMs);

    window[callbackName] = (data) => {
      window.clearTimeout(timer);
      cleanup();
      resolve(data);
    };

    const separator = url.includes("?") ? "&" : "?";
    script.src = `${url}${separator}callback=${callbackName}`;
    script.onerror = () => {
      window.clearTimeout(timer);
      cleanup();
      reject(new Error("Could not load Apps Script backend."));
    };

    document.body.appendChild(script);
  });
}

function dataUrlFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Could not read photo."));
    reader.readAsDataURL(file);
  });
}

async function submitToAppsScript(payload) {
  if (!APPS_SCRIPT_WEB_APP_URL || APPS_SCRIPT_WEB_APP_URL.includes("PASTE_")) {
    throw new Error("Apps Script URL is missing.");
  }

  await fetch(APPS_SCRIPT_WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  return { ok: true };
}

function HouseCupStyles() {
  return (
    <style>{`
      :root {
        --hc-bg: #fff3bf;
        --hc-card: #fffdf2;
        --hc-ink: #111111;
        --hc-hot: #ff4d6d;
        --hc-blue: #4dabf7;
        --hc-green: #69db7c;
        --hc-yellow: #ffe066;
        --hc-shadow: 5px 5px 0 #000;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        background:
          radial-gradient(circle at 12px 12px, rgba(0,0,0,.10) 2px, transparent 2px),
          linear-gradient(135deg, #fff3bf, #ffc9c9 45%, #b2f2bb);
        background-size: 26px 26px, auto;
        color: var(--hc-ink);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      button, input, textarea, select {
        font: inherit;
      }

      .hc-page {
        min-height: 100vh;
        padding: 18px;
        padding-bottom: 130px;
      }

      .hc-shell {
        max-width: 1120px;
        margin: 0 auto;
      }

      .hc-hero {
        border: 4px solid #000;
        background: rgba(255,255,255,.82);
        box-shadow: var(--hc-shadow);
        padding: 18px;
        border-radius: 18px;
      }

      .hc-kicker {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border: 3px solid #000;
        background: #fff;
        box-shadow: 3px 3px 0 #000;
        padding: 6px 10px;
        font-weight: 1000;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: .06em;
      }

      .hc-title {
        margin: 12px 0 4px;
        font-family: Impact, Haettenschweiler, "Arial Black", sans-serif;
        font-size: clamp(48px, 9vw, 96px);
        line-height: .88;
        letter-spacing: -2px;
        text-transform: uppercase;
        text-shadow: 2px 2px 0 #fff, 6px 6px 0 #000;
      }

      .hc-subtitle {
        margin: 12px 0 0;
        font-size: 15px;
        font-weight: 800;
        max-width: 780px;
      }

      .hc-tabs {
        position: sticky;
        top: 10px;
        z-index: 20;
        margin-top: 16px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
      }

      .hc-tab {
        min-height: 48px;
        border: 3px solid #000;
        background: #fff;
        box-shadow: 4px 4px 0 #000;
        border-radius: 12px;
        font-weight: 1000;
        cursor: pointer;
      }

      .hc-tab.active {
        background: var(--hc-yellow);
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #000;
      }

      .hc-card {
        margin-top: 16px;
        border: 4px solid #000;
        background: var(--hc-card);
        box-shadow: var(--hc-shadow);
        border-radius: 18px;
        padding: 18px;
      }

      .hc-card h2, .hc-card h3 {
        margin-top: 0;
      }

      .hc-label {
        display: block;
        margin: 14px 0 6px;
        font-weight: 1000;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: .04em;
      }

      .hc-input {
        width: 100%;
        border: 3px solid #000;
        background: #fff;
        border-radius: 12px;
        padding: 12px 13px;
        box-shadow: 3px 3px 0 #000;
        outline: none;
      }

      .hc-input:focus {
        background: #fffbe6;
        box-shadow: 2px 2px 0 #000;
        transform: translate(1px, 1px);
      }

      .hc-big-input {
        min-height: 54px;
        font-size: 18px;
      }

      .hc-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .hc-grid-3 {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
      }

      .hc-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }

      .hc-button {
        border: 3px solid #000;
        background: var(--hc-yellow);
        box-shadow: 4px 4px 0 #000;
        border-radius: 12px;
        padding: 11px 14px;
        font-weight: 1000;
        cursor: pointer;
      }

      .hc-button:hover:not(:disabled) {
        transform: translate(1px, 1px);
        box-shadow: 3px 3px 0 #000;
      }

      .hc-button:disabled {
        opacity: .55;
        cursor: not-allowed;
      }

      .hc-button.secondary {
        background: #fff;
      }

      .hc-button.danger {
        background: #ffc9c9;
      }

      .hc-muted {
        color: #4a4a4a;
        font-size: 13px;
        font-weight: 700;
      }

      .hc-status {
        margin-top: 12px;
        border: 3px solid #000;
        background: #e7f5ff;
        box-shadow: 3px 3px 0 #000;
        border-radius: 12px;
        padding: 10px 12px;
        font-weight: 900;
      }

      .hc-status.error {
        background: #ffe3e3;
      }

      .hc-status.good {
        background: #d3f9d8;
      }

      .hc-submit-card {
        position: relative;
        overflow: visible;
      }

      .hc-mobile-submit-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }

      .hc-mobile-submit-header h2 {
        margin: 8px 0 0;
        font-family: Impact, Haettenschweiler, "Arial Black", sans-serif;
        font-size: 42px;
        line-height: .9;
        text-transform: uppercase;
      }

      .hc-submit-pill {
        border: 3px solid #000;
        background: #fff7b8;
        box-shadow: 3px 3px 0 #000;
        border-radius: 999px;
        padding: 8px 10px;
        font-weight: 1000;
        font-size: 12px;
        text-transform: uppercase;
        max-width: 150px;
        text-align: center;
      }

      .hc-house-confirm {
        border: 3px solid #000;
        background: #d3f9d8;
        box-shadow: 3px 3px 0 #000;
        border-radius: 12px;
        padding: 10px 12px;
        margin: 10px 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-weight: 900;
      }

      .hc-house-confirm button {
        border: 2px solid #000;
        background: #fff;
        border-radius: 999px;
        font-weight: 1000;
        padding: 6px 10px;
        cursor: pointer;
      }

      .hc-section-title {
        margin: 20px 0 10px;
        font-weight: 1000;
        text-transform: uppercase;
        letter-spacing: .04em;
      }

      .hc-quick-actions {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }

      .hc-quick-action {
        border: 3px solid #000;
        background: #fff;
        box-shadow: 4px 4px 0 #000;
        border-radius: 16px;
        padding: 13px 9px;
        min-height: 118px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 7px;
        text-align: center;
      }

      .hc-quick-action span {
        font-size: 31px;
        line-height: 1;
      }

      .hc-quick-action b {
        font-size: 14px;
        line-height: 1.05;
      }

      .hc-quick-action small {
        font-size: 11px;
        font-weight: 1000;
        opacity: .72;
      }

      .hc-quick-action.selected {
        background: var(--hc-yellow);
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #000;
      }

      .hc-mobile-details {
        margin-top: 16px;
        border: 3px solid #000;
        background: #fffdf0;
        box-shadow: 3px 3px 0 #000;
        border-radius: 14px;
        padding: 11px;
      }

      .hc-mobile-details summary {
        cursor: pointer;
        font-weight: 1000;
        text-transform: uppercase;
      }

      .hc-photo-upload {
        margin-top: 12px;
        border: 3px dashed #000;
        background: #fff;
        border-radius: 14px;
        padding: 16px;
        display: block;
        text-align: center;
        font-weight: 1000;
        cursor: pointer;
      }

      .hc-photo-upload input {
        display: block;
        width: 100%;
        margin-top: 10px;
      }

      .hc-photo-preview {
        display: block;
        max-width: 280px;
        max-height: 220px;
        border: 3px solid #000;
        border-radius: 14px;
        margin-top: 12px;
        object-fit: cover;
        box-shadow: 3px 3px 0 #000;
      }

      .hc-mobile-submit-spacer {
        display: none;
      }

      .hc-mobile-submit-bar {
        margin-top: 18px;
        border: 3px solid #000;
        background: #fff7b8;
        box-shadow: 4px 4px 0 #000;
        border-radius: 16px;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .hc-mobile-submit-bar small {
        display: block;
        font-size: 11px;
        font-weight: 900;
        opacity: .75;
      }

      .hc-submit-now {
        min-width: 145px;
      }

      .hc-leader {
        border: 3px solid #000;
        background: #fff;
        box-shadow: 4px 4px 0 #000;
        border-radius: 16px;
        padding: 15px;
      }

      .hc-house {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 1000;
        font-size: 20px;
      }

      .hc-score {
        margin-top: 8px;
        font-family: Impact, Haettenschweiler, "Arial Black", sans-serif;
        font-size: 54px;
        line-height: .9;
      }

      .hc-table-wrap {
        margin-top: 12px;
        overflow: auto;
        border: 3px solid #000;
        border-radius: 14px;
        background: #fff;
      }

      .hc-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }

      .hc-table th,
      .hc-table td {
        border-bottom: 2px solid #000;
        padding: 9px;
        text-align: left;
        vertical-align: top;
      }

      .hc-table th {
        background: #ffe066;
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .hc-login {
        max-width: 420px;
      }

      @media (max-width: 720px) {
        .hc-page {
          padding: 8px;
          padding-bottom: 178px;
        }

        .hc-hero {
          padding: 12px;
          border-radius: 14px;
          box-shadow: 4px 4px 0 #000;
        }

        .hc-title {
          font-size: 43px;
          letter-spacing: -1px;
          text-shadow: 1px 1px 0 #fff, 3px 3px 0 #000;
        }

        .hc-subtitle {
          font-size: 13px;
        }

        .hc-tabs {
          position: fixed;
          left: 8px;
          right: 8px;
          bottom: 8px;
          top: auto;
          z-index: 80;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 5px;
          margin: 0;
          padding: 7px;
          border: 3px solid #000;
          border-radius: 16px;
          background: rgba(255, 247, 184, .97);
          box-shadow: 4px 4px 0 #000;
        }

        .hc-tab {
          min-height: 50px;
          font-size: 10px;
          padding: 6px 4px;
          border-radius: 10px;
        }

        .hc-card {
          margin-top: 12px;
          padding: 12px;
          border-radius: 15px;
          box-shadow: 3px 3px 0 #000;
        }

        .hc-grid,
        .hc-grid-3 {
          grid-template-columns: 1fr;
        }

        .hc-mobile-submit-header {
          align-items: center;
        }

        .hc-mobile-submit-header h2 {
          font-size: 34px;
        }

        .hc-submit-pill {
          font-size: 10px;
          max-width: 108px;
          padding: 7px 8px;
        }

        .hc-label {
          margin-top: 12px;
        }

        .hc-input,
        .hc-button,
        .hc-tab,
        .hc-quick-action {
          font-size: 16px;
        }

        .hc-big-input {
          min-height: 58px;
          font-size: 18px;
          border-width: 3px;
        }

        .hc-quick-actions {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }

        .hc-quick-action {
          min-height: 112px;
          padding: 12px 8px;
          box-shadow: 3px 3px 0 #000;
        }

        .hc-quick-action span {
          font-size: 31px;
        }

        .hc-quick-action b {
          font-size: 13px;
        }

        .hc-mobile-details {
          margin-top: 14px;
        }

        .hc-mobile-submit-spacer {
          display: block;
          height: 88px;
        }

        .hc-mobile-submit-bar {
          position: fixed;
          left: 8px;
          right: 8px;
          bottom: 78px;
          z-index: 70;
          margin-top: 0;
          padding: 9px;
          border-radius: 15px;
          box-shadow: 4px 4px 0 #000;
        }

        .hc-submit-now {
          min-width: 126px;
          min-height: 50px;
          font-size: 16px;
        }

        .hc-photo-upload {
          padding: 14px 10px;
        }

        .hc-photo-preview {
          max-width: 100%;
          max-height: 170px;
        }

        .hc-row {
          display: grid;
          grid-template-columns: 1fr;
          align-items: stretch;
        }

        .hc-button {
          width: 100%;
          min-height: 48px;
        }

        .hc-table {
          min-width: 760px;
          font-size: 12px;
        }

        .hc-score {
          font-size: 44px;
        }
      }
    `}</style>
  );
}

function ResidentZone({
  fullRoster,
  addLocalRow,
  refreshSubmissions,
}) {
  const [submitter, setSubmitter] = useState("");
  const [house, setHouse] = useState("");
  const [manualHouse, setManualHouse] = useState(false);
  const [questKey, setQuestKey] = useState("");
  const [points, setPoints] = useState("");
  const [people, setPeople] = useState("");
  const [note, setNote] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [status, setStatus] = useState("");
  const [statusKind, setStatusKind] = useState("");

  const selectedQuest = QUESTS.find((q) => q.key === questKey);

  useEffect(() => {
    const person = findRosterPerson(submitter, fullRoster);
    if (person?.house && !manualHouse) {
      setHouse(person.house);
    }
  }, [submitter, fullRoster, manualHouse]);

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0] || null;
    setPhotoFile(file);
    if (!file) {
      setPhotoPreview("");
      return;
    }
    const preview = await dataUrlFromFile(file);
    setPhotoPreview(preview);
  }

  function pickQuest(quest) {
    setQuestKey(quest.key);
    setPoints(quest.points);
    if (quest.key === "pitch") {
      setStatus("Pitch selected. Add a note so the chiefs know what they are approving.");
      setStatusKind("");
    } else {
      setStatus("");
      setStatusKind("");
    }
  }

  const submitButtonText = !submitter.trim()
    ? "Add name"
    : !house
    ? "Pick house"
    : !questKey
    ? "Pick points"
    : selectedQuest?.key === "pitch" && !String(points).trim()
    ? "Add points"
    : selectedQuest?.key === "pitch" && !note.trim()
    ? "Add pitch"
    : "Submit";

  const canSubmit =
    submitter.trim() &&
    house &&
    questKey &&
    (selectedQuest?.key !== "pitch" || (String(points).trim() && note.trim()));

  async function submitPoints() {
    if (!canSubmit) {
      setStatus("Almost there — " + submitButtonText.toLowerCase() + ".");
      setStatusKind("error");
      return;
    }

    setStatus("Submitting...");
    setStatusKind("");

    const timestamp = new Date().toISOString();
    const photoDataUrl = photoFile ? await dataUrlFromFile(photoFile) : "";
    const numericPoints = Number(points || selectedQuest?.points || 0);

    const row = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      timestamp,
      name: submitter.trim(),
      submitter: submitter.trim(),
      residentName: submitter.trim(),
      house,
      quest: selectedQuest?.title || questKey,
      questKey,
      points: numericPoints,
      status: selectedQuest?.status || "approved",
      people: people.trim(),
      note: note.trim(),
      photoPreview: photoDataUrl,
      photoUrl: "",
      source: "resident_submission",
    };

    const payload = {
      ...row,
      photoData: photoDataUrl,
      photoBase64: photoDataUrl.includes(",") ? photoDataUrl.split(",")[1] : "",
      photoFilename: photoFile?.name || "",
      fileName: photoFile?.name || "",
      mimeType: photoFile?.type || "",
      adminEmail: ADMIN_EMAIL,
    };

    addLocalRow(row);

    try {
      await submitToAppsScript(payload);
      setStatus("Submitted. House points have entered the group chat.");
      setStatusKind("good");
      window.setTimeout(() => refreshSubmissions({ silent: true }), 1500);
    } catch (error) {
      setStatus("Saved locally, but backend did not answer: " + error.message);
      setStatusKind("error");
    }

    setSubmitter("");
    setHouse("");
    setManualHouse(false);
    setQuestKey("");
    setPoints("");
    setPeople("");
    setNote("");
    setPhotoFile(null);
    setPhotoPreview("");
    const fileInput = document.getElementById("hc-photo-input");
    if (fileInput) fileInput.value = "";
  }

  return (
    <div className="hc-card hc-submit-card">
      <div className="hc-mobile-submit-header">
        <div>
          <div className="hc-kicker">Resident Zone</div>
          <h2>Submit points</h2>
        </div>
        <div className="hc-submit-pill">
          {house ? `${getHouseIcon(house)} ${house}` : "Pick house"}
        </div>
      </div>

      <label className="hc-label">Your name</label>
      <input
        className="hc-input hc-big-input"
        list="resident-roster"
        value={submitter}
        onChange={(e) => {
          setSubmitter(e.target.value);
          if (!e.target.value) {
            setHouse("");
            setManualHouse(false);
          }
        }}
        placeholder="Start typing your name"
        autoComplete="name"
      />

      <datalist id="resident-roster">
        {fullRoster.map((person) => (
          <option key={person.name} value={person.name}>
            {person.house}
          </option>
        ))}
      </datalist>

      {house && !manualHouse ? (
        <div className="hc-house-confirm">
          <span>
            House: <b>{getHouseIcon(house)} {house}</b>
          </span>
          <button
            type="button"
            onClick={() => {
              setManualHouse(true);
              setHouse("");
            }}
          >
            change
          </button>
        </div>
      ) : (
        <>
          <label className="hc-label">House</label>
          <select
            className="hc-input hc-big-input"
            value={house}
            onChange={(e) => {
              setHouse(e.target.value);
              setManualHouse(true);
            }}
          >
            <option value="">Choose house</option>
            {HOUSES.map((h) => (
              <option key={h.name} value={h.name}>
                {h.icon} {h.name}
              </option>
            ))}
          </select>
        </>
      )}

      <div className="hc-section-title">What are you submitting?</div>

      <div className="hc-quick-actions">
        {QUESTS.map((quest) => (
          <button
            type="button"
            key={quest.key}
            className={questKey === quest.key ? "hc-quick-action selected" : "hc-quick-action"}
            onClick={() => pickQuest(quest)}
          >
            <span>{quest.icon}</span>
            <b>{quest.title}</b>
            <small>{quest.points ? `+${quest.points} points` : "chief review"}</small>
          </button>
        ))}
      </div>

      {selectedQuest?.key === "pitch" && (
        <>
          <label className="hc-label">Requested points</label>
          <input
            className="hc-input hc-big-input"
            type="number"
            min="1"
            max="25"
            inputMode="numeric"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="Be reasonable-ish"
          />
        </>
      )}

      <details className="hc-mobile-details" open={selectedQuest?.key === "pitch"}>
        <summary>Add details / people / proof</summary>

        <label className="hc-label">Who was there?</label>
        <textarea
          className="hc-input"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          placeholder="Names if this was a group thing"
          rows={2}
        />

        <label className="hc-label">Tell us what happened</label>
        <textarea
          className="hc-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={selectedQuest?.notePlaceholder || "Optional context for the chiefs"}
          rows={3}
        />

        <label className="hc-photo-upload">
          <span>📸 Add photo proof</span>
          <input
            id="hc-photo-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
          />
        </label>

        {photoPreview && (
          <img className="hc-photo-preview" src={photoPreview} alt="Evidence preview" />
        )}
      </details>

      {status && <div className={`hc-status ${statusKind}`}>{status}</div>}

      <div className="hc-mobile-submit-spacer" />

      <div className="hc-mobile-submit-bar">
        <div>
          <b>{points || selectedQuest?.points || "?"} pts</b>
          <small>{selectedQuest?.shortTitle || "Choose type"}</small>
        </div>
        <button
          type="button"
          className="hc-button hc-submit-now"
          onClick={submitPoints}
          disabled={!canSubmit}
        >
          {submitButtonText}
        </button>
      </div>
    </div>
  );
}

function HallOfGlory({ rows, refreshSubmissions, sheetStatus }) {
  const houseScores = useMemo(() => {
    return HOUSES.map((house) => {
      const total = rows
        .filter((row) => row.house === house.name)
        .filter((row) => String(row.status || "approved").toLowerCase() !== "rejected")
        .reduce((sum, row) => sum + Number(row.points || 0), 0);

      return { ...house, total };
    }).sort((a, b) => b.total - a.total);
  }, [rows]);

  const recentRows = rows.slice(0, 20);

  return (
    <div className="hc-card">
      <div className="hc-row" style={{ justifyContent: "space-between" }}>
        <div>
          <div className="hc-kicker">Hall of Glory</div>
          <h2>Leaderboard</h2>
        </div>
        <button className="hc-button secondary" type="button" onClick={() => refreshSubmissions({ silent: false })}>
          Refresh Google Sheet
        </button>
      </div>
      <p className="hc-muted">{sheetStatus}</p>

      <div className="hc-grid">
        {houseScores.map((house, index) => (
          <div className="hc-leader" key={house.name}>
            <div className="hc-house">
              <span>{index === 0 ? "👑 " : ""}{house.icon} {house.name}</span>
              <span>#{index + 1}</span>
            </div>
            <div className="hc-score">{house.total}</div>
            <div className="hc-muted">points</div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 22 }}>Recent submissions</h3>
      <div className="hc-table-wrap">
        <table className="hc-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Name</th>
              <th>House</th>
              <th>Quest</th>
              <th>Pts</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {recentRows.length ? recentRows.map((row) => (
              <tr key={row.id || row.timestamp + row.name}>
                <td>{row.timestamp ? new Date(row.timestamp).toLocaleString() : ""}</td>
                <td>{row.name || row.submitter || row.residentName}</td>
                <td>{row.house}</td>
                <td>{row.quest || row.questKey}</td>
                <td>{row.points}</td>
                <td>{row.note}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6}>No submissions yet. The chaos awaits.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChiefLair({
  chiefAuthed,
  setChiefAuthed,
  currentChief,
  setCurrentChief,
  fullRoster,
  setRemoteRoster,
  addCustomPerson,
  rows,
  clearLocalRows,
  refreshSubmissions,
  refreshTeam,
  sheetStatus,
  teamStatus,
}) {
  const [chiefName, setChiefName] = useState("");
  const [chiefPassword, setChiefPassword] = useState("");
  const [chiefMessage, setChiefMessage] = useState("");
  const [newName, setNewName] = useState("");
  const [newHouse, setNewHouse] = useState("");
  const [newRole, setNewRole] = useState("Resident");

  function login() {
    const user = CHIEF_USERS.find(
      (u) =>
        normalizeName(u.name) === normalizeName(chiefName) ||
        normalizeName(u.fullName) === normalizeName(chiefName)
    );

    if (!user || user.password !== chiefPassword) {
      setChiefMessage("Nope. get lost punk.");
      return;
    }

    setChiefAuthed(true);
    setCurrentChief(user.fullName);
    setChiefMessage("Chief mode unlocked as " + user.fullName + ".");
    refreshTeam({ silent: true });
  }

  async function sendBackendTestRow() {
    const payload = {
      source: "chief_backend_test",
      timestamp: new Date().toISOString(),
      name: currentChief || "Chief Test",
      submitter: currentChief || "Chief Test",
      house: "Catalina",
      quest: "Backend connection test",
      questKey: "backend_test",
      points: 1,
      status: "approved",
      note: "This is a backend test row from the Vercel app.",
      people: "",
    };

    try {
      await submitToAppsScript(payload);
      setChiefMessage("Backend test sent. Check the Submissions tab.");
      window.setTimeout(() => refreshSubmissions({ silent: true }), 1500);
    } catch (error) {
      setChiefMessage("Backend test failed: " + error.message);
    }
  }

  async function addPerson() {
    if (!newName.trim() || !newHouse) {
      setChiefMessage("Add a name and house first.");
      return;
    }

    const person = {
      name: newName.trim(),
      house: newHouse,
      role: newRole || "Resident",
      active: true,
      source: "chief_admin",
      adminAction: "addTeamMember",
      timestamp: new Date().toISOString(),
    };

    addCustomPerson(person);

    try {
      await submitToAppsScript(person);
      setChiefMessage("Added " + person.name + ". Also attempted to save to Team sheet.");
    } catch (error) {
      setChiefMessage("Added locally, but Team sheet save failed: " + error.message);
    }

    setNewName("");
    setNewHouse("");
    setNewRole("Resident");
  }

  if (!chiefAuthed) {
    return (
      <div className="hc-card hc-login">
        <div className="hc-kicker">Secret Chief Lair</div>
        <h2>Chief login</h2>
        <label className="hc-label">Chief</label>
        <input
          className="hc-input hc-big-input"
          value={chiefName}
          onChange={(e) => setChiefName(e.target.value)}
          placeholder="Nate / Rosie / Amrutha / Will / Johnny"
        />
        <label className="hc-label">Password</label>
        <input
          className="hc-input hc-big-input"
          type="password"
          value={chiefPassword}
          onChange={(e) => setChiefPassword(e.target.value)}
          placeholder="get lost punk"
        />
        <div className="hc-row" style={{ marginTop: 14 }}>
          <button type="button" className="hc-button" onClick={login}>
            Unlock
          </button>
        </div>
        {chiefMessage && <div className="hc-status error">{chiefMessage}</div>}
      </div>
    );
  }

  return (
    <div className="hc-card">
      <div className="hc-row" style={{ justifyContent: "space-between" }}>
        <div>
          <div className="hc-kicker">Secret Chief Lair</div>
          <h2>Unlocked as {currentChief}</h2>
        </div>
        <button type="button" className="hc-button secondary" onClick={() => setChiefAuthed(false)}>
          Lock
        </button>
      </div>

      <div className="hc-grid-3">
        <a className="hc-button secondary" href={GOOGLE_SUBMISSIONS_SHEET_URL} target="_blank" rel="noreferrer">
          Open Google Sheet
        </a>
        <a className="hc-button secondary" href={GOOGLE_EVIDENCE_FOLDER_URL} target="_blank" rel="noreferrer">
          Open Photo Folder
        </a>
        <a className="hc-button secondary" href={APPS_SCRIPT_WEB_APP_URL} target="_blank" rel="noreferrer">
          Open Backend
        </a>
      </div>

      <div className="hc-row" style={{ marginTop: 14 }}>
        <button type="button" className="hc-button" onClick={() => refreshTeam({ silent: false })}>
          Refresh team/settings
        </button>
        <button type="button" className="hc-button" onClick={() => refreshSubmissions({ silent: false })}>
          Refresh submissions
        </button>
        <button type="button" className="hc-button secondary" onClick={sendBackendTestRow}>
          Send backend test row
        </button>
        <button type="button" className="hc-button danger" onClick={clearLocalRows}>
          Clear local browser data
        </button>
      </div>

      <p className="hc-muted">{teamStatus}</p>
      <p className="hc-muted">{sheetStatus}</p>
      {chiefMessage && <div className="hc-status">{chiefMessage}</div>}

      <h3>Add team member</h3>
      <div className="hc-grid-3">
        <input
          className="hc-input"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="First Last"
        />
        <select className="hc-input" value={newHouse} onChange={(e) => setNewHouse(e.target.value)}>
          <option value="">House</option>
          {HOUSES.map((h) => (
            <option key={h.name} value={h.name}>{h.name}</option>
          ))}
        </select>
        <input
          className="hc-input"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Resident / Faculty / Staff"
        />
      </div>
      <div className="hc-row" style={{ marginTop: 10 }}>
        <button type="button" className="hc-button" onClick={addPerson}>
          Add person
        </button>
      </div>

      <h3>Roster reference</h3>
      <div className="hc-table-wrap">
        <table className="hc-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>House</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {fullRoster.map((person) => (
              <tr key={person.name}>
                <td>{person.name}</td>
                <td>{person.house}</td>
                <td>{person.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Recent rows</h3>
      <p className="hc-muted">{rows.length} rows currently visible in app.</p>
    </div>
  );
}

function NerdStuff({ rows, fullRoster, refreshSubmissions }) {
  return (
    <div className="hc-card">
      <div className="hc-row" style={{ justifyContent: "space-between" }}>
        <div>
          <div className="hc-kicker">Nerd Stuff</div>
          <h2>Data export</h2>
        </div>
        <button type="button" className="hc-button secondary" onClick={() => refreshSubmissions({ silent: false })}>
          Refresh Google Sheet
        </button>
      </div>

      <div className="hc-row">
        <button
          type="button"
          className="hc-button"
          onClick={() => downloadTextFile("house-cup-submissions.csv", toCsv(rows))}
          disabled={!rows.length}
        >
          Download CSV
        </button>
      </div>

      <h3>Roster count</h3>
      <p className="hc-muted">{fullRoster.length} people in roster.</p>

      <h3>Submission log</h3>
      <div className="hc-table-wrap">
        <table className="hc-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Name</th>
              <th>House</th>
              <th>Quest</th>
              <th>Points</th>
              <th>Status</th>
              <th>People</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id || row.timestamp + row.name + row.quest}>
                <td>{row.timestamp}</td>
                <td>{row.name || row.submitter || row.residentName}</td>
                <td>{row.house}</td>
                <td>{row.quest}</td>
                <td>{row.points}</td>
                <td>{row.status}</td>
                <td>{row.people}</td>
                <td>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("resident");
  const [rows, setRows] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("houseCupRows") || "[]");
    } catch {
      return [];
    }
  });
  const [customRoster, setCustomRoster] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("houseCupCustomRoster") || "[]");
    } catch {
      return [];
    }
  });
  const [remoteRoster, setRemoteRoster] = useState([]);
  const [sheetStatus, setSheetStatus] = useState("Local backup loaded. Tap Refresh Google Sheet for shared leaderboard.");
  const [teamStatus, setTeamStatus] = useState("Team sheet not loaded yet.");
  const [chiefAuthed, setChiefAuthed] = useState(false);
  const [currentChief, setCurrentChief] = useState("");

  const fullRoster = useMemo(() => {
    return dedupePeople([...remoteRoster, ...customRoster, ...ROSTER]);
  }, [remoteRoster, customRoster]);

  useEffect(() => {
    localStorage.setItem("houseCupRows", JSON.stringify(rows));
  }, [rows]);

  useEffect(() => {
    localStorage.setItem("houseCupCustomRoster", JSON.stringify(customRoster));
  }, [customRoster]);

  function addLocalRow(row) {
    setRows((prev) => [row, ...prev]);
  }

  function addCustomPerson(person) {
    setCustomRoster((prev) => dedupePeople([person, ...prev]));
  }

  function clearLocalRows() {
    setRows([]);
    localStorage.removeItem("houseCupRows");
  }

  async function refreshSubmissions({ silent = false } = {}) {
    if (!APPS_SCRIPT_WEB_APP_URL || APPS_SCRIPT_WEB_APP_URL.includes("PASTE_")) {
      setSheetStatus("Apps Script URL missing.");
      return;
    }

    if (!silent) setSheetStatus("Loading Google Sheet...");
    try {
      const data = await jsonp(`${APPS_SCRIPT_WEB_APP_URL}?action=submissions`);
      const submissions = data?.submissions || data?.rows || [];
      if (Array.isArray(submissions)) {
        setRows(
          submissions
            .map((row, index) => ({
              id: row.id || row.timestamp + "-" + index,
              timestamp: row.timestamp || row.Timestamp || row.date || "",
              name: row.name || row.submitter || row.residentName || row.Name || "",
              submitter: row.submitter || row.name || "",
              residentName: row.residentName || row.name || "",
              house: row.house || row.House || "",
              quest: row.quest || row.type || row.Quest || "",
              questKey: row.questKey || "",
              points: Number(row.points || row.Points || 0),
              status: row.status || row.Status || "approved",
              people: row.people || row.People || "",
              note: row.note || row.Note || "",
              photoUrl: row.photoUrl || row.evidenceUrl || "",
            }))
            .reverse()
        );
        setSheetStatus(`Loaded ${submissions.length} submissions from Google Sheet.`);
      } else {
        setSheetStatus("Google Sheet loaded, but no submissions array found.");
      }
    } catch (error) {
      setSheetStatus("Could not load Google Sheet: " + error.message);
    }
  }

  async function refreshTeam({ silent = false } = {}) {
    if (!APPS_SCRIPT_WEB_APP_URL || APPS_SCRIPT_WEB_APP_URL.includes("PASTE_")) {
      setTeamStatus("Apps Script URL missing.");
      return;
    }

    if (!silent) setTeamStatus("Loading Team sheet...");
    try {
      let data = await jsonp(`${APPS_SCRIPT_WEB_APP_URL}?action=bootstrap`);
      if (!data?.team) {
        data = await jsonp(`${APPS_SCRIPT_WEB_APP_URL}?action=team`);
      }
      const team = data?.team || data?.members || [];
      if (Array.isArray(team)) {
        const cleaned = team
          .map((person) => ({
            name: person.name || person.Name || "",
            house: person.house || person.House || "",
            role: person.role || person.Role || "Resident",
            active: person.active ?? person.Active ?? true,
          }))
          .filter((person) => person.name && person.house)
          .filter((person) => String(person.active).toLowerCase() !== "false");

        setRemoteRoster(cleaned);
        setTeamStatus(`Loaded ${cleaned.length} active people from Team sheet.`);
      } else {
        setTeamStatus("Team endpoint loaded, but no team array found.");
      }

      const submissions = data?.submissions || [];
      if (Array.isArray(submissions) && submissions.length) {
        setRows(submissions.reverse());
        setSheetStatus(`Loaded ${submissions.length} submissions from bootstrap.`);
      }
    } catch (error) {
      setTeamStatus("Could not load Team sheet: " + error.message);
    }
  }

  return (
    <>
      <HouseCupStyles />
      <div className="hc-page">
        <div className="hc-shell">
          <header className="hc-hero">
            <div className="hc-kicker">🏆 Internal Medicine Residency Cup</div>
            <h1 className="hc-title">Point-O-Matic</h1>
            <p className="hc-subtitle">
              Submit house points fast. Phone-first, camera-friendly, and only mildly cursed.
            </p>
          </header>

          <nav className="hc-tabs" aria-label="House Cup tabs">
            <button
              type="button"
              className={activeTab === "resident" ? "hc-tab active" : "hc-tab"}
              onClick={() => setActiveTab("resident")}
            >
              Submit
            </button>
            <button
              type="button"
              className={activeTab === "leaderboard" ? "hc-tab active" : "hc-tab"}
              onClick={() => setActiveTab("leaderboard")}
            >
              Glory
            </button>
            <button
              type="button"
              className={activeTab === "chief" ? "hc-tab active" : "hc-tab"}
              onClick={() => setActiveTab("chief")}
            >
              Chiefs
            </button>
            <button
              type="button"
              className={activeTab === "data" ? "hc-tab active" : "hc-tab"}
              onClick={() => setActiveTab("data")}
            >
              Nerd
            </button>
          </nav>

          {activeTab === "resident" && (
            <ResidentZone
              fullRoster={fullRoster}
              addLocalRow={addLocalRow}
              refreshSubmissions={refreshSubmissions}
            />
          )}

          {activeTab === "leaderboard" && (
            <HallOfGlory
              rows={rows}
              refreshSubmissions={refreshSubmissions}
              sheetStatus={sheetStatus}
            />
          )}

          {activeTab === "chief" && (
            <ChiefLair
              chiefAuthed={chiefAuthed}
              setChiefAuthed={setChiefAuthed}
              currentChief={currentChief}
              setCurrentChief={setCurrentChief}
              fullRoster={fullRoster}
              setRemoteRoster={setRemoteRoster}
              addCustomPerson={addCustomPerson}
              rows={rows}
              clearLocalRows={clearLocalRows}
              refreshSubmissions={refreshSubmissions}
              refreshTeam={refreshTeam}
              sheetStatus={sheetStatus}
              teamStatus={teamStatus}
            />
          )}

          {activeTab === "data" && (
            <NerdStuff
              rows={rows}
              fullRoster={fullRoster}
              refreshSubmissions={refreshSubmissions}
            />
          )}
        </div>
      </div>
    </>
  );
}
