# 2406-Final
Completed by Joshua Delfin (101159384) and Joshua Hills (101142996)

PROJECT REPORT
1. Code and database initialization:
    - Before testing the movie database webpage, check that all required files are downloaded:

        - controllers (folder)
            - contribution-router.js
            - index-router.js
            - movie-router.js
            - person-router.js
            - profile-router.js
            - review-router.js
            - search-router.js
            - signin-router.js
            - user-router.js

        - models (folder)
            - MovieModel.js
            - PersonModel.js
            - ReviewModel.js
            - UserModel.js

        - movieData (folder)
            - movie-data-2500.json

        - views (folder)
            - pages (folder)
                - contribute.pug
                - index.pug
                - movie.pug
                - person.pug
                - profile.pug
                - review.pug
                - seach.pug
                - signin.pug
                - user.pug

            - partials (folder)
                - header.pug

        - database-init.js
        - package-lock.json
        - package.json
        - README.md
        - server.js

    - Once all files have been verified, install all required modules by typing "npm install" in a terminal within this directory

    - To start initializing databases, ensure you are using mongodb and "use moviedb"
        - To initializes databases, run the databse-init.js file by typing "node database-init.js" in a terminal within this directory:
            You will see all the documents being loaded to the database in the terminal console.

2. Once all files, modules, and databases required are correctly installed you may begin testing the webpage:
    
    - To start the webpage run the server.js file by typing "node server.js" in a terminal within this directory.
    - Go to your preffered webpage on address http://localhost:3000 to see the page, or click on the address link in the terminal console.

3. Testing the webpage:
    - The webpage will consist of 5 main pages: Home, Profile, Signin/Up, Search and Contribute.

    - The webpage will also consist of 3 sub pages: movie, person, and review.

    PART 1: Main Pages
    1. Home Page
        - This page is the main area which provides links to other parts of the website.
        - Will have links to sign in, profile, and search pages.
    2. Profile Page
        - If you are not logged in already, the profile page will prompt you to log in or create an account
        - Once you are logged in the profile page will display your information:
            - username
            - watchlist
            - followed People (with links to their page)
            - reviews made (with links to the review)
        - When on the profile page, if your account is declared as a contributor account, a link will appear to reach the contributor page
    3. Signin/up Page
        - this page will prompt to login or sign up if you are not already logged in
    4. Search Page
        - The search page will start out with a list of movies
        - There is a prompt to search for movies with the requested title name, genres, and actors
        - After searching with a criteria, the list will display movies with the same title name, genres and actors.
    5. Contribute Page
        - The contribution page will display 2 different prompts.
            - Add person:
                - This prompt will request a person name
                - Upon entering a name, and clicking the button a new person will be created if the name is unique.
            
            - Add Movie:
                - This prompt will request a required movie title, runtime, release year and genre and also optional: writer, director, and actor;
                - Please note that if the person (director, writer, or actor) does not exist, you must first create their person document by using the "add person" prompt that the top of the page.
                - Once the button is pressed, the movie will be added to the database if the name is unique.


    PART 2: SUB PAGES
    1. Movie Page
        - While NOT logged in:
            - The movie page will display the movie poster, actors, directors, writers, review, and plot.

        - While logged in:
            -  The movie page will display the same information as not logged in, but will also include a prompt to create your own review, and button to add movie to your watchlist.
            - the review will include the base review, summary of review and rating.
            - After submitting a review, the movie will keep that review, your profile will keep the review and you will be redirected to that reviews page.
    2. Person Page
        - In a person page it will have a button to either follow or unfollow (if you are logged in)
        - It will also diplay the movies that they have acted in, written or directed.
    3. Review Page
        - The review page will display a specific review consisting of the movie title, link to movie page, creator of review and link to their profile, review rating, summary of review and the full review.


PROJECT CRITIQUE:

1. Functionality:

2. Design Critique:
    We believe that our webpage is done fairly well with organized pages and visibility handling. For example, when there are no followed users, the followed users section will not be displayed on the profile page. Our webpage also has a good flow once you have used it a few times. It begins at a home page stating all the main pages like search and signgin, and if you sign in the profile information is ready and visible. Upon making yourself a contributor, a link to the contribution page appears making it so that only accounts with contributor status are able to reach that page.
3. Algorithms:
    - Recommendation: 
        - The recommended list is based on the people you follow:
        - It consists of up to 5 movies that users you follow have contributed to. (acted, directed, written)
        - The algorithm takes the first person in your followed list and adds the movies they have contributed to onto the recommendation list.
        - We then take the next person's contribution of movies and so on until we have gone through all our following list.
        - Once we have our recommendation list we send the top 5 to display and link to those movies.

    - Similar Movies:
        - In each movie page, there will be a list of 5 similar movies.
        - The criteria for similar movies is based on the current viewed movie's genres.
        - For example, if the movie is a thriller, 5 movies with the thriller genre will be listed.
        - If multiple genres exist for the one movie, then the list will take the top 5 of the first genre unless there are less than 5
        - This is done by taking only up to 5 movies for the similar movie list.
        
























PROJECT CHECK IN PORTION:
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


