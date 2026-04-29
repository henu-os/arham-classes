const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Mobile nav links
  // <a href="about.html" class="mobile-nav-link">About <span class="arrow">›</span></a>
  // we want to ensure Faculty is after About
  if (content.includes('class="mobile-nav-link">About') && !content.includes('class="mobile-nav-link">Faculty')) {
    // regex that catches the about tag including potential newlines
    content = content.replace(
      /(<a href="about\.html" class="mobile-nav-link">About <span class="arrow">›<\/span><\/a>)/,
      '$1<a href="faculty.html" class="mobile-nav-link">Faculty <span class="arrow">›</span></a>'
    );
    // user's gallery formatting has a newline
    content = content.replace(
      /(<a\s*href="about\.html" class="mobile-nav-link">About <span class="arrow">›<\/span><\/a>)/,
      '$1<a href="faculty.html"\n        class="mobile-nav-link">Faculty <span class="arrow">›</span></a>'
    );
    modified = true;
  }

  // 2. Desktop nav links
  // <a href="about.html" class="nav-link">About</a>
  // or <a href="about.html" class="nav-link" role="menuitem">About</a>
  if (content.includes('class="nav-link"') && content.includes('>About</a>') && !content.includes('href="faculty.html" class="nav-link"')) {
    content = content.replace(
      /(<a href="about\.html" class="nav-link">About<\/a>)/,
      '$1<a href="faculty.html" class="nav-link">Faculty</a>'
    );
    content = content.replace(
      /(<a href="about\.html"\s*class="nav-link">About<\/a>)/,
      '$1<a href="faculty.html" class="nav-link">Faculty</a>'
    );
    content = content.replace(
      /(<a href="about\.html" class="nav-link" role="menuitem">About<\/a>)/,
      '$1\n        <a href="faculty.html" class="nav-link" role="menuitem">Faculty</a>'
    );
    modified = true;
  }

  // 3. Footer links
  // <a href="about.html" class="footer-link"><span class="link-arrow">›</span>About</a>
  if (content.includes('class="footer-link"') && content.includes('>About</a>') && !content.includes('href="faculty.html" class="footer-link"')) {
    content = content.replace(
      /(<a href="about\.html" class="footer-link"><span class="link-arrow">›<\/span>About<\/a>)/,
      '$1<a href="faculty.html" class="footer-link"><span class="link-arrow">›</span>Faculty</a>'
    );
    content = content.replace(
      /(<a href="about\.html" class="footer-link"><span\s*class="link-arrow">›<\/span>About<\/a>)/,
      '$1<a href="faculty.html" class="footer-link"><span class="link-arrow">›</span>Faculty</a>'
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
