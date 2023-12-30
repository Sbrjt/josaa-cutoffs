<h3 align='center'><a href='https://sbrjt.github.io/josaa/' target="_blank">Go to Website</a>➡️</h3>

## 📝 Overview

This project hosts a website that displays the closing ranks of various colleges under JoSAA. It aims to provide an alternative, user-friendly platform to look up JoSSA cutoffs and help simplify college hunt before counselling.🔍🚀

## 📲 Functionality

1. Enter your rank.
2. Choose your category, state and gender.
3. Select the desired branches and institutes.
4. Find prospective choices for you.
5. Click expand to see more results.

## ⚙️ Tech used

- [GitHub Pages](https://pages.github.com/)
- [SQLite](https://www.sqlite.org/index.html)
- [Bootstrap](https://getbootstrap.com/)
- [Bootstrap-select](https://developer.snapappointments.com/bootstrap-select/)

The project is hosted on GitHub Pages that offers free hosting for static websites directly from the repository. Since GitHub Pages does not support any server-side scripting, a local SQLite database has been employed. (The data was scrapped from [JoSAA aspx](https://josaa.admissions.nic.in/Applicant/seatallotmentresult/currentorcr.aspx) using a [browser extension](https://chromewebstore.google.com/detail/html-table-scraper/ncphhmcjgbpglahiijnaaaaneoijlmkj) and the csv files were imported into a database table using python's [sqlite module](https://docs.python.org/3/library/sqlite3.html).) Bootstrap is used for responsive styling, along with bootstrap-select. The site devoid of any server-side code works even when offline.

#

If you like my project, please gimme a star! ⭐💫

Contributions are welcome!🤝

If you have any suggestion/concern, do [let me know](https://mailhide.io/e/kMGaefEP).

<!-- ## 📜 License

Licensed under the MIT License.

© 2023 Shubhrajit Sadhukhan
-->
