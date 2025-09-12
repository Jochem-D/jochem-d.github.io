// Content buttons open new WinBox windows
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.getAttribute('data-window');
    let url = '';
    let title = '';

    switch (tab) {
      case 'about':
        url = 'about.html';
        title = '🖥 About Me';
        break;
      case 'music':
        url = 'jukebox.html';
        title = '🎵 Music Player';
        break;
      case 'accomplishments':
        url = 'accomplishments.html';
        title = '🏆 Accomplishments';
        break;
      case 'gaming':
        url = 'hobbies.html';
        title = '🎮 Gaming & Anime';
        break;
    }

    openWinBox(url, title);
  });
});

// Start menu toggle
const startButton = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');

startButton.addEventListener('click', () => {
  const isVisible = startMenu.classList.toggle('show');
  startMenu.setAttribute('aria-hidden', !isVisible);
});

// Close start menu if clicking outside
document.addEventListener('click', (e) => {
  if (!startMenu.contains(e.target) && e.target !== startButton) {
    startMenu.classList.remove('show');
    startMenu.setAttribute('aria-hidden', 'true');
  }
});

// Open Brogrammer game via WinBox
document.getElementById('open-brogrammer').addEventListener('click', () => {
  startMenu.classList.remove('show');
  startMenu.setAttribute('aria-hidden', 'true');

  new WinBox({
    title: "🕹️ Brogrammer Game",
    url: "https://thijsder.github.io/Brogrammer-Game/",
    width: 600,
    height: 400,
    x: "center",
    y: "center",
  });
});

function openWinBox(url, title, width = 800, height = 550) {
  // Get the viewport dimensions minus window size
  const maxX = window.innerWidth - width;
  const maxY = window.innerHeight - height;

  // Prevent negative maxX/maxY (if viewport smaller than window)
  const safeMaxX = Math.max(0, maxX);
  const safeMaxY = Math.max(0, maxY);

  // Generate random coordinates within screen bounds
  const randomX = Math.floor(Math.random() * safeMaxX);
  const randomY = Math.floor(Math.random() * safeMaxY);

  new WinBox({
    title: title,
    url: url,
    width: width,
    height: height,
    x: randomX,
    y: randomY,
  });
}


