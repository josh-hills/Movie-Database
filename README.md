# 2406-Final
Completed by Joshua Delfin and Joshua Hills

1. Before attempting to open the server insure that all required files are downloaded:
- pdfs:
    - Object Outline.docx
    - RESTful design.docx
- public/css:
    - stylesheet.css
- views:
    -  pages:
        - contribute.pug
        - index.pug
        - movie.pug
        - otheruser.pug
        - person.pug
        - profile.pug
        - review.pug
        - search.pug
        - searchresults.pug
        - signin.pug
    - partials:
        - header.pug
- me.json
- movie-data-10.json
- movie-data-100.json
- movie-data-1000.json
- movie-data-2500.json
- otheruser.json
- package-lock.json
- package.json
- profile-router.js
- README.md
- server.js

2. Once all files are installed:
    - open the terminal in the current directory and type "npm install"
    - This will create a node-modules folder and install all the required modules.

3. Once the installation is complete:
    - type "node server.js" to run the server
    - it will open the server in the specified spot in this case 
    "http://localhost:3000"
    - Open this in your preffered browser to begin browsing the webpage

ABOUT THE WEBPAGE/NAVIGATION
4. MAIN PAGES
a) The first main page will be our index/homepage 
    - Currently this displays links to the current most popular movie, person and user.

b) Our second main page is the profile page
    - Currently this displays the user's profile page with their username, notifications, contributor status, watchlist (with links to movies), followed people (with links to people) and followed users (with links to users)

c) Our third main page is the signin/up page. (DOES NOT WORK YET)
    - Currently this page prompts for the username and password of the user, and can choose to either create a new account or login to an existing account.

d) Our fourth main page is the search page. (INCOMPLETE)
    - Currently this page prompts for a title, genre and actor name to filter search. Since the search does not work just yet, clicking the search button simply sends you to the pregenerated searchresults page

e) Our fifth and last main page is the contribute page. (DOES NOT WORK YET)
    - Currently this page has two prompts, one to add an actor, or to add a movie.
    - Add an actor has 1 parameter entry; actor's name
    - Add a movie has 6 parameter entries; title, runtime, release year, writers, directors, and actors.
    - The buttons do not work at this time.

5. OTHER PAGES:
a) Upon clicking a movie link, it brings you to the movie page.
    - The movie webpage currently only displays the Space Balls movie and it's information

b) Upon clicking a person link, it brings you to a person page.
    - The person webpage currently only display Quentin Tarantino's page and information on that person. 
    - Includes: list of Top collaborators, list of movies directed, and list of movies written

c) Upon clicking a user link, it brings you to an otheruser page.
    - This page currrently only leads to Zaphod Beeblebrox's profile page and information
    - There is a button for following or unfollowing the user (not functioning atm)
    - page includes: watch list, list of followed people, and list of followed users

d) Upon clicking the search button on the search page, it brings you to the searchresults page.
    - Currently this page only displays a pregenerated list of movie results


