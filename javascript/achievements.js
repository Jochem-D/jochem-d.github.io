// achievements.js

const DEFAULT_ACHIEVEMENTS = [
  // --- My Achievements (not user-unlockable) ---
  {
    id: "my_first_deploy",
    title: "First Live Project",
    desc: "You deployed your first site back in 2023.",
    unlocked: true,
    category: "my"
  },
  {
    id: "my_musicbox_built",
    title: "Jukebox Architect",
    desc: "Built a retro music player window.",
    unlocked: true,
    category: "my"
  },

  // --- User Achievements (unlockable across site) ---
  {
    id: "user_visit_about",
    title: "Curious Visitor",
    desc: "You visited the About page.",
    unlocked: false,
    category: "user"
  },
  {
    id: "user_open_musicbox",
    title: "Now Playing",
    desc: "You opened the music player.",
    unlocked: false,
    category: "user"
  },
  {
    id: "user_secret_found",
    title: "Hidden Path",
    desc: "You discovered a hidden area.",
    unlocked: false,
    category: "user"
  }
];

function loadAchievements() {
  let data = localStorage.getItem("achievements");
  if (!data) {
    localStorage.setItem("achievements", JSON.stringify(DEFAULT_ACHIEVEMENTS));
    return DEFAULT_ACHIEVEMENTS;
  }
  return JSON.parse(data);
}

function saveAchievements(data) {
  localStorage.setItem("achievements", JSON.stringify(data));
}

function unlockAchievement(id) {
  const achievements = loadAchievements();
  const index = achievements.findIndex(a => a.id === id);
  if (index !== -1 && !achievements[index].unlocked && achievements[index].category === "user") {
    achievements[index].unlocked = true;
    saveAchievements(achievements);
    showUnlockToast(achievements[index]);
  }
}

function showUnlockToast(achievement) {
  const toast = document.createElement("div");
  toast.className = "achievement-toast";
  toast.innerText = `🏆 ${achievement.title} unlocked!`;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => toast.classList.remove("show"), 3000);
  setTimeout(() => toast.remove(), 3600);
}

function getAchievementsByCategory(category) {
  return loadAchievements().filter(a => a.category === category);
}

// Add toast styles dynamically
const style = document.createElement("style");
style.innerHTML = `
  .achievement-toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #222;
    color: #fff;
    padding: 12px 18px;
    border-left: 4px solid #4caf50;
    border-radius: 8px;
    font-family: sans-serif;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease;
    z-index: 9999;
  }
  .achievement-toast.show {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

// Optional: expose to window for testing
window.unlockAchievement = unlockAchievement;
window.getAchievementsByCategory = getAchievementsByCategory;
