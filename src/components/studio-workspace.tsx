"use client";

import { useMemo, useState } from "react";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

export type StudioTemplate = "daily" | "weekly" | "habit" | "meal" | "routine" | "study" | "budget" | "adhd" | "teacher" | "student" | "nurse" | "coach";
type SizeName = "A4" | "A5" | "Letter";
type Orientation = "portrait" | "landscape";
type FontStyle = "clean" | "editorial" | "mono";
type Anchor = "start" | "middle" | "end";

type Command =
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number; color: string; width?: number; dash?: string }
  | { kind: "rect"; x: number; y: number; width: number; height: number; fill?: string; stroke?: string; radius?: number }
  | { kind: "circle"; x: number; y: number; radius: number; fill?: string; stroke?: string }
  | { kind: "text"; x: number; y: number; text: string; size: number; color: string; weight?: "regular" | "bold"; font?: FontStyle; anchor?: Anchor; tracking?: number };

const sizes: Record<SizeName, { width: number; height: number }> = {
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  Letter: { width: 215.9, height: 279.4 },
};

const palettes = [
  { name: "Cobalt", ink: "#17243D", accent: "#2B5CFF", soft: "#E3EBFF", paper: "#FFFFFF" },
  { name: "Sage", ink: "#253B35", accent: "#5B8877", soft: "#DCEAE3", paper: "#FEFFFC" },
  { name: "Clay", ink: "#452E2A", accent: "#C66F5E", soft: "#F2DED8", paper: "#FFFDFC" },
  { name: "Ink", ink: "#18212D", accent: "#18212D", soft: "#E8EBEE", paper: "#FFFFFF" },
];

export const studioTemplates: Record<StudioTemplate, { name: string; note: string; title: string; subtitle: string; items: string[] }> = {
  daily: { name: "Daily focus", note: "Time blocks, priorities & notes", title: "A clear day", subtitle: "Make space for what matters", items: ["Deep work", "Admin", "Move", "Read", "Reset"] },
  weekly: { name: "Weekly rhythm", note: "Seven days plus weekly intention", title: "This week", subtitle: "A quiet plan for a full life", items: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
  habit: { name: "Habit garden", note: "Personal habits with 14-day grid", title: "Small things, often", subtitle: "Two weeks of gentle consistency", items: ["Water", "Walk outside", "Read", "Stretch", "Sleep by 11", "No-spend day"] },
  meal: { name: "Meal & market", note: "Weekly menu and shopping list", title: "At our table", subtitle: "A simple week of good food", items: ["Vegetables", "Fruit", "Pantry", "Protein", "Dairy", "Household"] },
  routine: { name: "Family routine", note: "Morning and evening checklists", title: "Milo's rhythm", subtitle: "A happy little plan for every day", items: ["Get dressed", "Brush teeth", "Pack bag", "Tidy toys", "Choose tomorrow's clothes", "Story time"] },
  study: { name: "Study dashboard", note: "Subjects, focus and review", title: "Study map", subtitle: "Turn the syllabus into small steps", items: ["Mathematics", "Biology", "Literature", "History", "Languages"] },
  budget: { name: "Budget planner", note: "Zero-based monthly money map", title: "Money map", subtitle: "Plan every dollar before it leaves", items: ["Income", "Fixed bills", "Variable spending", "Debt payment", "Savings", "Buffer"] },
  adhd: { name: "ADHD planner", note: "Low-friction planning with rewards", title: "Steady steps", subtitle: "Less overwhelm, more follow-through", items: ["Top 3", "Tiny next step", "Body double", "Reward", "Reset", "Done list"] },
  teacher: { name: "Teacher planner", note: "Lessons, prep and class notes", title: "Lesson map", subtitle: "A calmer week in the classroom", items: ["Lesson focus", "Materials", "Homework", "Assessment", "Parent contact", "Notes"] },
  student: { name: "Student planner", note: "Assignments, deadlines and GPA", title: "Semester plan", subtitle: "Turn the term into milestones", items: ["Classes", "Deadlines", "Reading", "Exam prep", "GPA", "Office hours"] },
  nurse: { name: "Nurse shift sheet", note: "Report sheet for a full shift", title: "Shift report", subtitle: "Track the day without losing the thread", items: ["Patients", "Meds", "Vitals", "Tasks", "Handoff", "Notes"] },
  coach: { name: "Client tracker", note: "Progress, sessions and follow-ups", title: "Client tracker", subtitle: "Keep every account moving forward", items: ["Client goal", "Session plan", "Progress", "Homework", "Follow-up", "Payment"] },
};

const mmToPt = (mm: number) => (mm * 72) / 25.4;
const hex = (value: string) => {
  const n = Number.parseInt(value.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};
const truncate = (value: string, max: number) => value.trim().slice(0, max);

function createDesign({ width, height, template, title, subtitle, owner, items, palette, font }: {
  width: number; height: number; template: StudioTemplate; title: string; subtitle: string; owner: string; items: string[]; palette: typeof palettes[number]; font: FontStyle;
}) {
  const c: Command[] = [];
  const m = Math.max(10, Math.min(width, height) * 0.065);
  const innerW = width - m * 2;
  const bottom = height - m;
  const lineColor = palette.soft;
  const label = (text: string, x: number, y: number, anchor: Anchor = "start") => c.push({ kind: "text", x, y, text: text.toUpperCase(), size: 2.7, color: palette.accent, weight: "bold", font: "mono", anchor, tracking: 0.15 });
  const line = (x1: number, y1: number, x2: number, y2: number, color = lineColor, width = 0.35) => c.push({ kind: "line", x1, y1, x2, y2, color, width });
  const checkbox = (x: number, y: number) => c.push({ kind: "rect", x, y, width: 3.2, height: 3.2, stroke: palette.accent, radius: 0.6 });

  c.push({ kind: "rect", x: 0, y: 0, width, height, fill: palette.paper });
  c.push({ kind: "rect", x: 0, y: 0, width: 4.2, height, fill: palette.accent });
  c.push({ kind: "text", x: m, y: m + 3, text: truncate(title, 34) || studioTemplates[template].title, size: Math.min(12, innerW / 13), color: palette.ink, weight: "bold", font });
  c.push({ kind: "text", x: m, y: m + 10, text: truncate(subtitle, 54), size: 3.2, color: palette.ink, font });
  if (owner.trim()) c.push({ kind: "text", x: width - m, y: m + 4, text: truncate(owner, 28), size: 3.1, color: palette.accent, weight: "bold", font, anchor: "end" });
  line(m, m + 16, width - m, m + 16, palette.accent, 0.55);
  const top = m + 25;

  if (template === "daily") {
    const split = m + innerW * 0.61;
    label("Schedule", m, top);
    label("Priorities", split + 6, top);
    line(split, top - 4, split, bottom);
    const rowH = (bottom - top - 7) / 11;
    for (let i = 0; i < 11; i++) {
      const y = top + 7 + i * rowH;
      c.push({ kind: "text", x: m, y: y + 1, text: `${String(i + 7).padStart(2, "0")}:00`, size: 2.6, color: palette.ink, font: "mono" });
      line(m + 14, y, split - 5, y);
    }
    items.slice(0, 3).forEach((item, i) => {
      const y = top + 9 + i * 13;
      c.push({ kind: "circle", x: split + 8, y: y - 1, radius: 2.7, stroke: palette.accent });
      c.push({ kind: "text", x: split + 8, y, text: String(i + 1), size: 2.4, color: palette.accent, weight: "bold", anchor: "middle" });
      c.push({ kind: "text", x: split + 14, y, text: truncate(item, 20), size: 3.1, color: palette.ink, font });
    });
    label("Notes", split + 6, top + 51);
    for (let y = top + 60; y < bottom; y += 8) line(split + 6, y, width - m, y);
  }

  if (template === "weekly") {
    label("Weekly intention", m, top);
    line(m + 34, top - 1, width - m, top - 1);
    const gap = 4;
    const cardW = (innerW - gap) / 2;
    const cardTop = top + 7;
    const cardH = (bottom - cardTop - gap * 3) / 4;
    [...items.slice(0, 7), "Notes"].forEach((day, i) => {
      const col = i % 2, row = Math.floor(i / 2), x = m + col * (cardW + gap), y = cardTop + row * (cardH + gap);
      c.push({ kind: "rect", x, y, width: cardW, height: cardH, fill: i === 7 ? palette.soft : undefined, stroke: lineColor, radius: 1.4 });
      c.push({ kind: "text", x: x + 5, y: y + 7, text: truncate(day, 18), size: 3.2, color: palette.ink, weight: "bold", font });
      for (let ly = y + 13; ly < y + cardH - 4; ly += 7) line(x + 5, ly, x + cardW - 5, ly);
    });
  }

  if (template === "habit") {
    label("Habit", m, top);
    label("14 quiet repetitions", width - m, top, "end");
    const gridTop = top + 7, labelW = innerW * 0.34, colW = (innerW - labelW) / 14;
    for (let i = 0; i < 14; i++) c.push({ kind: "text", x: m + labelW + (i + 0.5) * colW, y: gridTop + 4, text: String(i + 1), size: 2.2, color: palette.ink, font: "mono", anchor: "middle" });
    const rows = Math.min(8, Math.max(4, items.length)), rowH = Math.min(19, (bottom - gridTop - 8) / rows);
    for (let r = 0; r <= rows; r++) line(m, gridTop + 7 + r * rowH, width - m, gridTop + 7 + r * rowH);
    line(m + labelW, gridTop, m + labelW, gridTop + 7 + rows * rowH, palette.accent, 0.5);
    items.slice(0, rows).forEach((item, r) => {
      const y = gridTop + 7 + (r + 0.55) * rowH;
      c.push({ kind: "text", x: m + 2, y, text: truncate(item, 20), size: 3, color: palette.ink, font });
      for (let i = 0; i < 14; i++) c.push({ kind: "circle", x: m + labelW + (i + 0.5) * colW, y: y - 1, radius: Math.min(2.1, colW * 0.25), stroke: palette.accent });
    });
    label("What felt easy?", m, bottom - 18);
    line(m, bottom - 10, width - m, bottom - 10);
  }

  if (template === "meal") {
    const split = m + innerW * 0.64;
    label("Menu", m, top);
    label("Market list", split + 6, top);
    line(split, top - 4, split, bottom);
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"], rowH = (bottom - top - 7) / 7;
    days.forEach((day, i) => {
      const y = top + 7 + i * rowH;
      c.push({ kind: "text", x: m, y: y + 5, text: day, size: 2.6, color: palette.accent, weight: "bold", font: "mono" });
      c.push({ kind: "text", x: m + 15, y: y + 4, text: "lunch", size: 2.3, color: palette.ink, font });
      c.push({ kind: "text", x: m + 15, y: y + 10, text: "dinner", size: 2.3, color: palette.ink, font });
      line(m, y + rowH, split - 5, y + rowH);
    });
    items.slice(0, 6).forEach((item, i) => {
      const y = top + 9 + i * ((bottom - top - 5) / 6);
      c.push({ kind: "text", x: split + 6, y, text: truncate(item, 16), size: 2.9, color: palette.ink, weight: "bold", font });
      for (let ly = y + 5; ly < y + 19 && ly < bottom; ly += 6) line(split + 6, ly, width - m, ly);
    });
  }

  if (template === "budget") {
    const split = m + innerW * 0.58;
    label("Budget plan", m, top);
    label("Zero-based checklist", split + 6, top);
    line(split, top - 4, split, bottom);
    const rowH = (bottom - top - 8) / 7;
    ["Income", "Rent / housing", "Food / household", "Bills", "Debt", "Savings", "Buffer"].forEach((item, i) => {
      const y = top + 7 + i * rowH;
      c.push({ kind: "text", x: m, y: y + 5, text: truncate(item, 20), size: 3.1, color: palette.ink, weight: i === 0 ? "bold" : undefined, font });
      line(m + 42, y + 2, split - 5, y + 2);
    });
    c.push({ kind: "rect", x: split + 6, y: top + 8, width: innerW - (split - m) - 6, height: 18, fill: palette.soft, radius: 1.5 });
    c.push({ kind: "text", x: split + 11, y: top + 19, text: "LEFT TO BUDGET", size: 2.9, color: palette.ink, weight: "bold", font: "mono" });
    const rightItems = ["Savings target", "Debt snowball", "Sinking funds", "Irregular bills", "Subscriptions", "Needs / wants"];
    rightItems.forEach((item, i) => {
      const y = top + 34 + i * ((bottom - top - 42) / 6);
      c.push({ kind: "circle", x: split + 10, y: y - 1, radius: 2.4, stroke: palette.accent });
      c.push({ kind: "text", x: split + 16, y, text: truncate(item, 22), size: 3, color: palette.ink, font });
      line(split + 16, y + 4, width - m - 4, y + 4);
    });
    label("Next pay cycle", split + 6, bottom - 22);
    line(split + 6, bottom - 15, width - m, bottom - 15);
  }

  if (template === "adhd") {
    const split = m + innerW * 0.56;
    label("Top 3", m, top);
    label("Brain dump", split + 6, top);
    line(split, top - 4, split, bottom);
    c.push({ kind: "rect", x: m, y: top + 7, width: split - m - 5, height: 17, fill: palette.soft, radius: 1.4 });
    c.push({ kind: "text", x: m + 6, y: top + 18, text: "ONE SMALL WIN", size: 2.9, color: palette.ink, weight: "bold", font: "mono" });
    const scheduleY = top + 31;
    for (let i = 0; i < 8; i++) {
      const y = scheduleY + i * 11.5;
      c.push({ kind: "text", x: m, y: y + 1, text: `${String(i + 8).padStart(2, "0")}:00`, size: 2.6, color: palette.ink, font: "mono" });
      line(m + 14, y, split - 5, y);
    }
    items.slice(0, 3).forEach((item, i) => {
      const y = top + 9 + i * 15;
      c.push({ kind: "circle", x: split + 8, y: y - 1, radius: 2.7, stroke: palette.accent });
      c.push({ kind: "text", x: split + 8, y, text: String(i + 1), size: 2.4, color: palette.accent, weight: "bold", anchor: "middle" });
      c.push({ kind: "text", x: split + 14, y, text: truncate(item, 18), size: 3.1, color: palette.ink, font });
      line(split + 14, y + 4, width - m, y + 4);
    });
    label("Reward / reset", split + 6, top + 60);
    line(split + 6, top + 67, width - m, top + 67);
    for (let y = top + 74; y < bottom; y += 9) line(split + 6, y, width - m, y);
  }

  if (template === "teacher") {
    label("Lesson map", m, top);
    label("Week at a glance", width - m, top, "end");
    const cols = 5, gap = 3, gridTop = top + 8, cardW = (innerW - gap * (cols - 1)) / cols, cardH = 45;
    ["MON", "TUE", "WED", "THU", "FRI"].forEach((day, i) => {
      const x = m + i * (cardW + gap);
      c.push({ kind: "rect", x, y: gridTop, width: cardW, height: cardH, fill: i % 2 === 0 ? palette.soft : undefined, stroke: lineColor, radius: 1.4 });
      c.push({ kind: "text", x: x + 4, y: gridTop + 7, text: day, size: 2.7, color: palette.accent, weight: "bold", font: "mono" });
      c.push({ kind: "text", x: x + 4, y: gridTop + 17, text: "Objective", size: 2.5, color: palette.ink, weight: "bold", font });
      c.push({ kind: "text", x: x + 4, y: gridTop + 27, text: "Materials", size: 2.4, color: palette.ink, font });
      c.push({ kind: "text", x: x + 4, y: gridTop + 37, text: "Exit ticket", size: 2.4, color: palette.ink, font });
    });
    const lowerTop = gridTop + 53;
    const split = m + innerW * 0.62;
    label("Prep list", m, lowerTop);
    label("Assessment notes", split + 6, lowerTop);
    line(split, lowerTop - 4, split, bottom);
    const prepItems = ["Copies", "Slides", "Handouts", "Station setup", "Differentiation", "Homework"];
    prepItems.forEach((item, i) => {
      const y = lowerTop + 9 + i * 11;
      c.push({ kind: "circle", x: m + 2.5, y: y - 1, radius: 2.2, stroke: palette.accent });
      c.push({ kind: "text", x: m + 8, y, text: item, size: 3, color: palette.ink, font });
      line(m + 16, y + 4, split - 5, y + 4);
    });
    for (let y = lowerTop + 8; y < bottom; y += 8) line(split + 6, y, width - m, y);
  }

  if (template === "student") {
    const split = m + innerW * 0.57;
    label("Classes", m, top);
    label("Deadlines", split + 6, top);
    line(split, top - 4, split, bottom);
    const classH = (bottom - top - 8) / 6;
    items.slice(0, 5).forEach((item, i) => {
      const y = top + 7 + i * classH;
      c.push({ kind: "text", x: m, y: y + 5, text: truncate(item, 20), size: 3.2, color: palette.ink, weight: "bold", font });
      c.push({ kind: "text", x: m + 40, y: y + 5, text: "Lecture", size: 2.5, color: palette.accent, font: "mono" });
      line(m, y + classH, split - 5, y + classH);
    });
    c.push({ kind: "rect", x: split + 6, y: top + 8, width: innerW - (split - m) - 6, height: 18, fill: palette.soft, radius: 1.4 });
    c.push({ kind: "text", x: split + 11, y: top + 19, text: "GPA TARGET", size: 2.9, color: palette.ink, weight: "bold", font: "mono" });
    const deadlineLabels = ["Assignment", "Due", "Weight"];
    deadlineLabels.forEach((labelText, i) => {
      c.push({ kind: "text", x: split + 6 + i * 22, y: top + 35, text: labelText, size: 2.3, color: palette.accent, weight: "bold", font: "mono" });
    });
    for (let r = 0; r < 4; r++) {
      const y = top + 40 + r * 18;
      line(split + 6, y, width - m, y);
      c.push({ kind: "text", x: split + 6, y: y - 3, text: `Task ${r + 1}`, size: 3, color: palette.ink, font });
    }
    label("Study blocks", split + 6, bottom - 22);
    line(split + 6, bottom - 15, width - m, bottom - 15);
  }

  if (template === "nurse") {
    const split = m + innerW * 0.56;
    label("Patient list", m, top);
    label("Handoff notes", split + 6, top);
    line(split, top - 4, split, bottom);
    const rows = 4;
    const rowH = (bottom - top - 12) / rows;
    for (let r = 0; r < rows; r++) {
      const y = top + 8 + r * rowH;
      c.push({ kind: "rect", x: m, y, width: split - m - 5, height: rowH - 2, fill: r % 2 === 0 ? palette.soft : undefined, stroke: lineColor, radius: 1.2 });
      c.push({ kind: "text", x: m + 5, y: y + 6, text: `Room ${101 + r}`, size: 2.8, color: palette.accent, weight: "bold", font: "mono" });
      c.push({ kind: "text", x: m + 5, y: y + 15, text: "Vitals / meds / tasks", size: 2.6, color: palette.ink, font });
    }
    const rightItems = ["Meds due", "PRN", "Labs", "Mobility", "Family update", "Escalation"];
    rightItems.forEach((item, i) => {
      const y = top + 10 + i * ((bottom - top - 15) / 6);
      c.push({ kind: "circle", x: split + 8, y: y - 1, radius: 2.5, stroke: palette.accent });
      c.push({ kind: "text", x: split + 14, y, text: item, size: 3, color: palette.ink, font });
      line(split + 14, y + 4, width - m, y + 4);
    });
    label("Shift summary", split + 6, bottom - 22);
    line(split + 6, bottom - 15, width - m, bottom - 15);
  }

  if (template === "coach") {
    const split = m + innerW * 0.57;
    label("Client tracker", m, top);
    label("Follow-up plan", split + 6, top);
    line(split, top - 4, split, bottom);
    const rows = 5;
    const rowH = (bottom - top - 8) / rows;
    items.slice(0, 5).forEach((item, i) => {
      const y = top + 8 + i * rowH;
      c.push({ kind: "rect", x: m, y, width: split - m - 5, height: rowH - 2, fill: i % 2 ? palette.soft : undefined, stroke: lineColor, radius: 1.2 });
      c.push({ kind: "text", x: m + 5, y: y + 6, text: truncate(item, 18), size: 3.2, color: palette.ink, weight: "bold", font });
      c.push({ kind: "text", x: m + 5, y: y + 14, text: "Goal / current / next step", size: 2.5, color: palette.accent, font: "mono" });
    });
    const followUps = ["Check-in", "Homework", "Nutrition", "Training split", "Progress photo", "Payment"];
    followUps.forEach((item, i) => {
      const y = top + 10 + i * ((bottom - top - 18) / 6);
      c.push({ kind: "circle", x: split + 8, y: y - 1, radius: 2.5, stroke: palette.accent });
      c.push({ kind: "text", x: split + 14, y, text: item, size: 3, color: palette.ink, font });
      line(split + 14, y + 4, width - m, y + 4);
    });
    label("Session notes", split + 6, bottom - 22);
    line(split + 6, bottom - 15, width - m, bottom - 15);
  }

  if (template === "routine") {
    const gap = 7, colW = (innerW - gap) / 2, rowTop = top + 5;
    ["Morning", "Evening"].forEach((period, col) => {
      const x = m + col * (colW + gap);
      c.push({ kind: "rect", x, y: top - 4, width: colW, height: 13, fill: palette.soft, radius: 1.5 });
      c.push({ kind: "text", x: x + 5, y: top + 4, text: period, size: 3.5, color: palette.ink, weight: "bold", font });
      const list = col === 0 ? items.slice(0, Math.ceil(items.length / 2)) : items.slice(Math.ceil(items.length / 2));
      const filled = [...list, ...Array(Math.max(0, 6 - list.length)).fill("")].slice(0, 6);
      filled.forEach((item, i) => {
        const y = rowTop + 18 + i * ((bottom - rowTop - 22) / 6);
        checkbox(x + 2, y - 3.8);
        c.push({ kind: "text", x: x + 9, y: y - 0.5, text: truncate(item, 25), size: 3.1, color: palette.ink, font });
        line(x + 9, y + 4, x + colW - 3, y + 4);
      });
    });
  }

  if (template === "study") {
    const focusH = Math.min(40, (bottom - top) * 0.23);
    label("This week's focus", m, top);
    c.push({ kind: "rect", x: m, y: top + 6, width: innerW, height: focusH, fill: palette.soft, radius: 1.5 });
    c.push({ kind: "text", x: m + 6, y: top + 17, text: "One clear outcome", size: 3.1, color: palette.ink, weight: "bold", font });
    line(m + 6, top + 25, width - m - 6, top + 25, palette.accent, 0.45);
    const tableTop = top + focusH + 15;
    label("Subjects & next actions", m, tableTop);
    const rows = Math.min(6, Math.max(4, items.length)), rowH = (bottom - tableTop - 8) / rows;
    items.slice(0, rows).forEach((item, i) => {
      const y = tableTop + 8 + i * rowH;
      c.push({ kind: "text", x: m, y: y + 5, text: truncate(item, 18), size: 3.2, color: palette.ink, weight: "bold", font });
      c.push({ kind: "text", x: m + innerW * 0.34, y: y + 5, text: "Next:", size: 2.5, color: palette.accent, font: "mono" });
      checkbox(width - m - 5, y + 1);
      line(m, y + rowH, width - m, y + rowH);
    });
  }

  c.push({ kind: "text", x: width - m, y: height - 5, text: "PDFPAPERS · MADE BY YOU", size: 1.8, color: palette.accent, font: "mono", anchor: "end", tracking: 0.08 });
  return c;
}

function DesignPreview({ commands, width, height, label }: { commands: Command[]; width: number; height: number; label: string }) {
  return <svg className="studio-paper" viewBox={`0 0 ${width} ${height}`} style={{ aspectRatio: `${width}/${height}` }} aria-label={`${label} personalized printable preview`}>
    {commands.map((command, index) => {
      if (command.kind === "line") return <line key={index} x1={command.x1} y1={command.y1} x2={command.x2} y2={command.y2} stroke={command.color} strokeWidth={command.width ?? .35} strokeDasharray={command.dash} />;
      if (command.kind === "rect") return <rect key={index} x={command.x} y={command.y} width={command.width} height={command.height} fill={command.fill ?? "none"} stroke={command.stroke} strokeWidth={command.stroke ? .35 : 0} rx={command.radius ?? 0} />;
      if (command.kind === "circle") return <circle key={index} cx={command.x} cy={command.y} r={command.radius} fill={command.fill ?? "none"} stroke={command.stroke} strokeWidth={command.stroke ? .35 : 0} />;
      const family = command.font === "editorial" ? "Georgia, serif" : command.font === "mono" ? "monospace" : "Arial, sans-serif";
      return <text key={index} x={command.x} y={command.y} fill={command.color} fontSize={command.size} fontFamily={family} fontWeight={command.weight === "bold" ? 700 : 400} textAnchor={command.anchor ?? "start"} letterSpacing={command.tracking}>{command.text}</text>;
    })}
  </svg>;
}

async function drawPdf(page: PDFPage, commands: Command[], width: number, height: number, fonts: Record<string, PDFFont>) {
  const pageH = mmToPt(height);
  for (const command of commands) {
    if (command.kind === "line") page.drawLine({ start: { x: mmToPt(command.x1), y: pageH - mmToPt(command.y1) }, end: { x: mmToPt(command.x2), y: pageH - mmToPt(command.y2) }, thickness: mmToPt(command.width ?? .35), color: hex(command.color) });
    if (command.kind === "rect") page.drawRectangle({ x: mmToPt(command.x), y: pageH - mmToPt(command.y + command.height), width: mmToPt(command.width), height: mmToPt(command.height), color: command.fill ? hex(command.fill) : undefined, borderColor: command.stroke ? hex(command.stroke) : undefined, borderWidth: command.stroke ? mmToPt(.35) : 0 });
    if (command.kind === "circle") page.drawCircle({ x: mmToPt(command.x), y: pageH - mmToPt(command.y), size: mmToPt(command.radius), color: command.fill ? hex(command.fill) : undefined, borderColor: command.stroke ? hex(command.stroke) : undefined, borderWidth: command.stroke ? mmToPt(.35) : 0 });
    if (command.kind === "text") {
      const key = `${command.font ?? "clean"}-${command.weight ?? "regular"}`;
      const pdfFont = fonts[key] ?? fonts["clean-regular"];
      const size = mmToPt(command.size);
      const textWidth = pdfFont.widthOfTextAtSize(command.text, size);
      const anchorOffset = command.anchor === "middle" ? textWidth / 2 : command.anchor === "end" ? textWidth : 0;
      page.drawText(command.text, { x: mmToPt(command.x) - anchorOffset, y: pageH - mmToPt(command.y) - size * .18, size, font: pdfFont, color: hex(command.color) });
    }
  }
}

export function StudioWorkspace({ initialTemplate = "daily" }: { initialTemplate?: StudioTemplate }) {
  const initial = studioTemplates[initialTemplate];
  const [template, setTemplate] = useState<StudioTemplate>(initialTemplate);
  const [size, setSize] = useState<SizeName>("A4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [font, setFont] = useState<FontStyle>("clean");
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [title, setTitle] = useState(initial.title);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [owner, setOwner] = useState("Made for Alex");
  const [itemText, setItemText] = useState(initial.items.join("\n"));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const base = sizes[size];
  const dimensions = orientation === "portrait" ? base : { width: base.height, height: base.width };
  const designWidth = dimensions.width, designHeight = dimensions.height;
  const items = useMemo(() => itemText.split("\n").map((item) => item.trim()).filter(Boolean).slice(0, 8), [itemText]);
  const palette = palettes[paletteIndex];
  const commands = useMemo(() => createDesign({ width: designWidth, height: designHeight, template, title, subtitle, owner, items, palette, font }), [designWidth, designHeight, template, title, subtitle, owner, items, palette, font]);

  function chooseTemplate(next: StudioTemplate) {
    const preset = studioTemplates[next];
    setTemplate(next); setTitle(preset.title); setSubtitle(preset.subtitle); setItemText(preset.items.join("\n"));
  }

  async function downloadPdf() {
    setBusy(true); setError("");
    try {
      const doc = await PDFDocument.create();
      const page = doc.addPage([mmToPt(dimensions.width), mmToPt(dimensions.height)]);
      const fonts: Record<string, PDFFont> = {
        "clean-regular": await doc.embedFont(StandardFonts.Helvetica),
        "clean-bold": await doc.embedFont(StandardFonts.HelveticaBold),
        "editorial-regular": await doc.embedFont(StandardFonts.TimesRoman),
        "editorial-bold": await doc.embedFont(StandardFonts.TimesRomanBold),
        "mono-regular": await doc.embedFont(StandardFonts.Courier),
        "mono-bold": await doc.embedFont(StandardFonts.CourierBold),
      };
      await drawPdf(page, commands, dimensions.width, dimensions.height, fonts);
      doc.setTitle(`${title || studioTemplates[template].name} — personalized printable`);
      doc.setCreator("pdfpapers Studio");
      const bytes = await doc.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = `pdfpapers-${template}-${size.toLowerCase()}.pdf`; link.style.display = "none";
      document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setError("We couldn't create this PDF. Please try again."); }
    finally { setBusy(false); }
  }

  return <>
    <div className="studio-heading">
      <div><p className="eyebrow">PERSONAL PRINT STUDIO</p><h1>Start with a design.<br /><em>Make it yours.</em></h1></div>
      <p>Edit the words, mood, format, and details. Your finished PDF is built privately in this browser.</p>
    </div>
    <div className="studio-workspace">
      <aside className="studio-controls">
        <div className="studio-control-head"><div><span>01</span><h2>Choose a page</h2></div><small>{studioTemplates[template].note}</small></div>
        <div className="template-picker">{(Object.keys(studioTemplates) as StudioTemplate[]).map((key) => <button key={key} className={template === key ? "active" : ""} onClick={() => chooseTemplate(key)}><span className={`template-glyph glyph-${key}`} aria-hidden="true" /><b>{studioTemplates[key].name}</b></button>)}</div>

        <div className="studio-control-head compact"><div><span>02</span><h2>Personalize</h2></div></div>
        <label className="studio-field">Title<input value={title} maxLength={34} onChange={(event) => setTitle(event.target.value)} /></label>
        <label className="studio-field">Supporting line<input value={subtitle} maxLength={54} onChange={(event) => setSubtitle(event.target.value)} /></label>
        <label className="studio-field">Name or dedication<input value={owner} maxLength={28} onChange={(event) => setOwner(event.target.value)} /></label>
        <label className="studio-field">Your labels<textarea value={itemText} rows={5} onChange={(event) => setItemText(event.target.value)} /><small>One per line · up to 8</small></label>

        <div className="studio-control-head compact"><div><span>03</span><h2>Style & paper</h2></div></div>
        <div className="studio-field"><span>Color story</span><div className="studio-palettes">{palettes.map((choice, index) => <button key={choice.name} className={paletteIndex === index ? "active" : ""} onClick={() => setPaletteIndex(index)} aria-label={`${choice.name} color story`}><i style={{ background: choice.accent }} /><i style={{ background: choice.soft }} /></button>)}</div></div>
        <div className="studio-field"><span>Type style</span><div className="studio-segment three">{(["clean", "editorial", "mono"] as FontStyle[]).map((style) => <button key={style} className={font === style ? "active" : ""} onClick={() => setFont(style)}>{style}</button>)}</div></div>
        <div className="studio-field"><span>Format</span><div className="studio-format"><div className="studio-segment">{(Object.keys(sizes) as SizeName[]).map((paperSize) => <button key={paperSize} className={size === paperSize ? "active" : ""} onClick={() => setSize(paperSize)}>{paperSize}</button>)}</div><div className="studio-segment orientation"><button className={orientation === "portrait" ? "active" : ""} onClick={() => setOrientation("portrait")} aria-label="Portrait">▯</button><button className={orientation === "landscape" ? "active" : ""} onClick={() => setOrientation("landscape")} aria-label="Landscape">▭</button></div></div></div>

        <button className="studio-download" disabled={busy} onClick={downloadPdf}>{busy ? "Building your PDF…" : "Download my design"}<span>↗</span></button>
        <p className="studio-download-note">Vector PDF · Print-ready · No account</p>{error && <p className="generator-error">{error}</p>}
      </aside>
      <section className="studio-stage"><div className="studio-stage-bar"><span>LIVE PREVIEW</span><span>{size} · {orientation}</span></div><div className="studio-canvas"><DesignPreview commands={commands} width={dimensions.width} height={dimensions.height} label={studioTemplates[template].name} /></div></section>
    </div>
  </>;
}
