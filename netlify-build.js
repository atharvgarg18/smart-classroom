import { execSync } from "child_process";
import { cpSync, mkdirSync } from "fs";

const portal = process.env.PORTAL || "admin";

console.log(`Building portal: ${portal}`);

if (portal === "student") {
  execSync("npm run build:student", { stdio: "inherit" });
  // Copy dist/student → dist/out
  mkdirSync("dist/out", { recursive: true });
  cpSync("dist/student", "dist/out", { recursive: true });
} else {
  execSync("npm run build:admin", { stdio: "inherit" });
  // Copy dist/spa → dist/out
  mkdirSync("dist/out", { recursive: true });
  cpSync("dist/spa", "dist/out", { recursive: true });
}

console.log(`Done! Published to dist/out`);
