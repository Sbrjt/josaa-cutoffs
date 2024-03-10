<h1 align='center'><a target="_blank" href='https://sbrjt.github.io/josaa-cutoffs' >Go to Website</a>➡️</h1>
<div align='center'>
<picture><img src="https://img.shields.io/github/stars/sbrjt/josaa-cutoffs?style=flat"></picture>
<a href="https://github.com/Sbrjt/josaa-cutoffs/issues"><img src="https://img.shields.io/github/issues/sbrjt/josaa-cutoffs"></a>
<a href="https://github.com/Sbrjt/josaa-cutoffs/commits/main/"><img src="https://img.shields.io/github/last-commit/sbrjt/josaa-cutoffs"></a>
<picture><img src="https://img.shields.io/github/languages/code-size/sbrjt/josaa-cutoffs"></picture>
<a href="https://www.gnu.org/licenses/agpl-3.0"><img src="https://img.shields.io/badge/License-AGPL_v3-blue.svg"></a>
</div>

<!--
![](https://img.shields.io/github/contributors/Sbrjt/josaa-cutoffs)
![](https://img.shields.io/github/downloads/Sbrjt/josaa-cutoffs/total)
![](https://img.shields.io/github/forks/sbrjt/josaa-cutoffs?style=flat)
![](https://img.shields.io/github/repo-size/sbrjt/josaa-cutoffs)
![](https://img.shields.io/github/issues-pr/sbrjt/josaa-cutoffs)
 -->


## 📝 Overview

This project hosts a website that displays the closing ranks of various colleges under JoSAA. It aims to provide an alternative, user-friendly platform to look up JoSSA cutoffs and help simplify college hunt before counselling. 🔍🎓

## 📲 Functionality

1. Enter your rank.
2. Choose your category, state and gender.
3. Select the desired branches and institutes.
4. Find prospective choices for you.
5. Click expand to see more results.

## ⚙️ Tech used

- [GitHub Pages](https://pages.github.com/)
- [sql.js](https://sql.js.org/)
- [Bootstrap](https://getbootstrap.com/)
- [Bootstrap-select](https://developer.snapappointments.com/bootstrap-select)
- [Bootstrap-table](https://bootstrap-table.com/)

The project is hosted on GitHub Pages that offers free hosting for static websites directly from the repository. Since GitHub Pages does not support any server-side scripting, a local SQLite database has been employed. (The data was scrapped from [JoSAA aspx](https://josaa.admissions.nic.in/Applicant/seatallotmentresult/currentorcr.aspx) using a [browser extension](https://chromewebstore.google.com/detail/html-table-scraper/ncphhmcjgbpglahiijnaaaaneoijlmkj) and the csv files were imported into a database table.) Bootstrap is used for responsive styling, along with bootstrap-select and bootstrap-table.

On first visit the site takes a while to download the database into local storage, this is especially noticeable on slower (throttled) connections. On subsequent visits the local storage remains available.

#

If you like my project, please gimme a star! ⭐💫

Contributions are welcome! 🤝

If you have any suggestion/concern, do [let me know](https://mailhide.io/e/kMGaefEP).

© Shubhrajit Sadhukhan :octocat:
