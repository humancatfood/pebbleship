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

    // A regular expression for capturing user-inputs
    var inputReg = /^(?:([a-j])([1-9]|10)|q|c)$/;


    // set up input properties for prompting for coordinates
    // see here for details: https://www.npmjs.com/package/prompt
    var shootInput = {
        properties: {
            input: {
                description: 'Enter coordinates to shoot at (eg. \'a2\') or \'q\' to quit (or \'c\' to cheat)',
                type: 'string',
                pattern: inputReg,
                message: 'coordinates must be in the form <a-j><1-10>',
                required: true
            }
        }
    };


    // set up input properties for prompting for another round
    var restartInput = {
        properties: {
            input: {
                description: 'Wanna play again? (y/n)'
            }
        }
    };


    // exits the program
    var exit = function (code) {

        console.log('bye!\n\n');
        process.exit(code || 0);

    };


    // a step in the 'game-loop'
    var step = function() {

        // My 'game-loop' is completely callback-based and this is more robust than trusting
        // myself to get the tail-calls 100% right.
        setTimeout(function () {


            // prompt for coordinates
            prompt.get(shootInput, function (err, result) {

                if (err)
                {
                    console.error(('' + err).red);
                    exit(1);
                }
                else if (result.input === 'q')
                {
                    // user quits
                    exit(0);
                }
                else if (result.input === 'c')
                {
                    // user cheats
                    world.render();
                    step();
                }
                else
                {
                    // user shoots
                    var match = result.input.match(inputReg);
                    if (!match)
                    {
                        // this should be caught by promptJS anyway
                        console.error('Unrecognised input:', result.input);
                        step();
                    }
                    else
                    {
                        // world.shoot returns true if we hit something
                        if (world.shoot(match[1], match[2]) && world.gameOver)
                        {
                            console.log('Victory!\n\n');

                            // check if the user wants to play again
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
                            step();
                        }
                    }
                }
            });

        }, 0);

    };

    var start = function () {
        startWorld();
        step();
    };

    return {
        start: start
    };

}());
