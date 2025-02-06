import fs from "fs";

function killProcess(pid) {
  try {
    process.kill(pid, "SIGTERM"); // Graceful shutdown
    console.log(`Process with PID ${pid} terminated.`);
  } catch (error) {
    console.error(`Failed to kill PID ${pid}:`, error.message);
  }
}

// Read stored PIDs from file
const pids = fs.readFileSync("child_pids.txt", "utf-8").split("\n").filter(Boolean);

pids.forEach((pid) => killProcess(parseInt(pid, 10)));

// Optional: Clear the PID file after killing all processes
fs.writeFileSync("child_pids.txt", "");
