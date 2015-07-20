# PEBBLESHIPS

---

#### How to run this:

Clone it:

`https://github.com/humancatfood/pebbleship.git`

Then:

`cd pebbleship`

and

`npm install` to install dependencies

and finally

`npm start`

to run it. Done!


---

# Specs


#### Goals:

- a very simple game of [battleships](https://en.wikipedia.org/wiki/Battleship_%28game%29)
- a simple console (browser or terminal) application
- allow a single human player to play a one-sided game of battleships against the computer
- the program should
- create a 10x10 grid
- place a number of ships on the grid at random with the following sizes:
  - 1x Battleship (5 squares)
  - 2x Destroyers (4 squares)
- the console application should accept input from the user in the format “A5” to signify a square to target
- feedback to the user whether the shot was success
- report on the sinking of any vessels



#### Antigoals:

Do not spend any time formatting output in the console window (displaying a grid etc) - focus on the domain rather than the presentation.


---

#### Decisions:

- Browser console or command line?
  - Command line is cleaner.
  - This is for JavaScript development so I'll use NodeJS (with PromptJS because I can't be arsed to write all that myself)

---

#### Requirements:

- a world representation
  - a grid
  - battleships
  - destroyers
- input
  - input
  - input validation
- output
  - a status report


