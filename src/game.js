/*global console: true */
/*global process: true */
/*global require: true */
/*global setTimeout: true */
/*global module: true */

/*module exports Game */


module.exports = (function () {
    'use strict';

    var World = require('./world.js');

    var world;
    var startWorld = function () {

        world = new World(10, 10);

        world.placeShip(4, 'Destroyer #1');
        world.placeShip(4, 'Destroyer #2');
        world.placeShip(5, 'Battleship');

    };


    var prompt = require('prompt').start();

    var shootInput = {
        properties: {
            input: {
                description: 'Enter coordinates to shoot at (eg. \'a2\') or \'q\' to quit (or \'c\' to cheat)',
                type: 'string',
                pattern: /^([a-z][0-9]|q|c)$/,
                message: 'coordinates must be in the form <letter><number>',
                required: true
            }
        }
    };


    var restartInput = {
        properties: {
            input: {
                description: "Wanna play again? (y/n)"
            }
        }
    };

    var exit = function (code) {

        console.log("bye!");
        process.exit(code || 0);

    };


    var step = function() {

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
                {
                    console.log('Unrecognised input:', result.input);
                }
                else
                {
                    var col = match[1].charCodeAt(0) - 'a'.charCodeAt(0);
                    var row = Number(match[2]);

                    if (world.shoot(col, row) && world.gameOver)
                    {
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
                        setTimeout(step, 0);
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
