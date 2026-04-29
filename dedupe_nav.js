const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Deduplicate mobile nav link
  // Handles cases where Faculty is right after Faculty
  content = content.replace(/(<a href="faculty\.html"(?:[^>]*)>Faculty <span class="arrow">›<\/span><\/a>\s*)+/g, '<a href="faculty.html" class="mobile-nav-link">Faculty <span class="arrow">›</span></a>');

  // Deduplicate desktop nav link
  content = content.replace(/(<a href="faculty\.html"(?:[^>]*)>Faculty<\/a>\s*)+/g, '<a href="faculty.html" class="nav-link">Faculty</a>');

  // Re-run the spacing fixes for desktop nav specifically if there's any messed up roles
  // We can just clean it to: `<a href="faculty.html" class="nav-link">Faculty</a>`

  // Deduplicate footer nav link
  content = content.replace(/(<a href="faculty\.html" class="footer-link"><span class="link-arrow">›<\/span>Faculty<\/a>\s*)+/g, '<a href="faculty.html" class="footer-link"><span class="link-arrow">›</span>Faculty</a>');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Deduped ${file}`);
  }
}
