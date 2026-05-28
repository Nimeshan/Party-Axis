"use strict";

const fs = require("fs");
const path = require("path");

const webDir = path.resolve(__dirname, "..");
const parentDir = path.resolve(webDir, "..");
const parentModules = path.join(parentDir, "node_modules");

const links = ["tailwindcss", "@tailwindcss"];

function main() {
  for (const name of links) {
    const src = path.join(webDir, "node_modules", name);
    const dest = path.join(parentModules, name);
    if (!fs.existsSync(src)) continue;
    fs.mkdirSync(parentModules, { recursive: true });
    if (fs.existsSync(dest)) {
      const st = fs.lstatSync(dest);
      if (st.isSymbolicLink()) fs.unlinkSync(dest);
      else fs.rmSync(dest, { recursive: true, force: true });
    }
    const symlinkType = process.platform === "win32" ? "junction" : "dir";
    fs.symlinkSync(src, dest, symlinkType);
  }
}

main();
