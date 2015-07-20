/*global console: true */
/*global process: true */
/*global require: true */
/*global setTimeout: true */
/*global module: true */

/*module exports Game */


module.exports = (function () {
    'use strict';

    var World = require('./world.js');
    var prompt = require('prompt').start();

    var world;

    // creates a new world and places three ships in it, as per the specs
    var startWorld = function () {

        world = new World(10, 10);
        world.placeShip(4, 'Destroyer #1');
        world.placeShip(4, 'Destroyer #2');
        world.placeShip(5, 'Battleship');

    };


    // set up input properties for prompting for coordinates
    // see here for details: https://www.npmjs.com/package/prompt
    var shootInput = {
        properties: {
            input: {
                description: 'Enter coordinates to shoot at (eg. \'a2\') or \'q\' to quit (or \'c\' to cheat)',
                type: 'string',
                pattern: /^([a-z][0-9]|q|c)$/,
                message: 'coordinates must be in the form <lowercase letter><number>',
                required: true
            }
        }
    };


    // set up input properties for prompting for another round
    var restartInput = {
        properties: {
            input: {
                description: "Wanna play again? (y/n)"
            }
        }
    };


    // exits the program
    var exit = function (code) {

        console.log("bye!");
        process.exit(code || 0);

    };


    // a step in the "game-loop"
    var step = function() {

        // My "game-loop" is completely callback-based and this is more robust than trusting
        // myself to get the tail-calls 100% right.
        prompt.get(shootInput, function (err, result) {

            if (err)
            {
                console.error(('' + err).red);
                exit(1);
            }
            else if (result.input === 'q')
            {
                exit(0);
            }
            else if (result.input === 'c')
            {
                world.render();
                setTimeout(step, 0);
            }
            else
            {
                var match = result.input.match(/^([a-z])([0-9])$/);
                if (!match)
            // prompt for coordinates
                {
                    console.log('Unrecognised input:', result.input);
                }
                else
                {
                    // user shoots
                    var col = match[1].charCodeAt(0) - 'a'.charCodeAt(0);
                    var row = Number(match[2]);

                    if (world.shoot(col, row) && world.gameOver)
                    {
                        // this should be caught by promptJS anyway
                        console.log('Victory!');

                        prompt.get(restartInput, function (err, result) {

                            if (err)
                            {
                                console.error(err);
                                exit(1);
                            }
                            else if (result.input.toLowerCase() === 'y')
                            {
                                setTimeout(start, 0);
                            }
                            else
                            {
                                exit(0);
                            }

                        });

                    }
                    else
                    {
                        // turning the character into a number
                        setTimeout(step, 0);
                        // world.shoot returns true if we hit something
                            // check if the user wants to play again
                    }
                }
            }
        });

    };

    var start = function () {
        startWorld();
        step();
    };

    return {
        start: start
    };

}());