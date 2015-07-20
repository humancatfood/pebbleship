/*global console: true */
/*global module: true */

/*module exports World */



module.exports = (function () {
    'use strict';

    // utils
    function rndInt(from, to)
    {
        return Math.floor(from + Math.random() * (to - from));
    }


    // the world-class
    // takes a width and height between 1x1 and 10x10 (totally arbitrary limit..)
    function World(width, height)
    {
        if (width < 1 || width > 10 || height < 1 || height > 10)
        {
            throw new Error('World size must be between 0x0 and 10x10');
        }

        this.width = width;
        this.height = height;
        this.ships = [];
        var grid = this.grid = [];

        for (var i = 0; i < width * height; i += 1)
        {
            grid[i] = 0;        // 0 means water
        }

        console.log('World created: ', width + 'x' + height);

        return this;

    }


    // get the contents of field (x,y)
    // 0 means water, any other number is the id of a ship
    World.prototype.getField = function (x, y) {

        if (y < 0 || y > this.height ||
            x < 0 || x > this.width)
        {
            throw new Error('coordinates out of bounds');
        }
        else
        {
            return this.grid[y * this.width + x];
        }

    };


    // set the contents (id) of field (x,y)
    // 0 means water, any other number is the id of a ship
    World.prototype.setField = function (x, y, id) {

        if (y < 0 || y > this.height ||
            x < 0 || x > this.width)
        {
            throw new Error('coordinates out of bounds');
        }
        else
        {
            this.grid[y * this.width + x] = id;
        }

    };


    // Randomly places a ship in the world.
    //
    // This is not a packing-algorithm, so after a number of ships this might fail.
    World.prototype.placeShip = function (shipSize, shipName) {

        if (shipSize > this.width && shipSize > this.height)
        {
            throw new Error('a ship of size ' + shipSize + ' is too big for a ' + this.width + 'x' + this.height + ' playing field');
        }

        // Ships have a start-point (x,y) and an orientation (horizontal, !horizontal). The start-point
        // needs to be chosen so that the ship doesn't poke out of the world anywhere.
        //
        // One approach would be to just randomly choose a position and orientation, check if it fits and
        // repeat if necessary, but the number of tries would have to be limited or it could potentially run
        // for ages. However if the limit is too low and all attempts just happen to hit occupied fields, it could
        // look like there's no space when there's in fact plenty.
        //
        // I don't like the implied uncertainty, so here's a slightly more elaborate approach:

        var minX = 0;
        var maxX = this.width - shipSize;
        var minY = 0;
        var maxY = this.height - shipSize;

        var possiblePositions = [];

        var horizontalPossible, verticalPossible;

        // Iterate over all fields ..
        var x, y, i;
        for (y = minY; y < maxY; y += 1)
        {
            for (x = minX; x < maxX; x += 1)
            {
                horizontalPossible = true;
                verticalPossible = true;

                // .. and try to place the ship ..
                for (i = 0; i < shipSize; i += 1)
                {
                    // .. horizontally ..
                    if (this.getField(x + i, y) !== 0)
                    {
                        horizontalPossible = false;
                    }
                    // .. and not horizontally ..
                    if (this.getField(x, y + i) !== 0)
                    {
                        verticalPossible = false;
                    }
                }

                // .. and if that works, store this as a possible start field and orientation.
                if (horizontalPossible)
                {
                    possiblePositions.push(x, y, true);
                }
                if (verticalPossible)
                {
                    possiblePositions.push(x, y, false);
                }
            }
        }

        // Throw an error if there's no space.
        if (!possiblePositions.length)
        {
            throw new Error('No more space left for a ship of size ' + shipSize);
        }

        // Then choose a position at random ..
        var rnd = rndInt(0, possiblePositions.length / 3) * 3;

        x = possiblePositions[rnd];
        y = possiblePositions[rnd + 1];
        var horizontal = possiblePositions[rnd + 2];

        // .. and put the ship in it
        var id = this.ships.push(shipName);
        for (i = 0; i < shipSize; i += 1)
        {
            this.setField(
                x + (horizontal ? i : 0),
                y + (horizontal ? 0 : i),
                id
            );
        }

        console.log('Ship added:', shipSize);
        return this;

    };


    // Shoot at a field (x,y)
    World.prototype.shoot = function (x, y) {

        // If there's a ship there ..
        var shipID = this.getField(x, y);

        if (!shipID)
        {
            console.log('miss!');
            return false;
        }
        else
        {
            // .. destroy that part ..
            this.setField(x, y, 0);
            console.log('hit!');

            // .. and check if there's anything of that ship left.
            if (this.shipSunk(shipID))
            {
                console.log('you sunk:', this.ships[shipID - 1]);

                // If not, check if there's anything left at all
                if (this.allSunk())
                {
                    console.log('All ships sunk ');
                    this.gameOver = true;
                }
            }

            return true;

        }

    };


    // Check if any fields are still occupied by a ship with id shipID
    World.prototype.shipSunk = function (shipID) {

        var grid = this.grid;
        for (var i = 0, l = grid.length; i < l; i += 1)
        {
            if (grid[i] === shipID)
            {
                return false;
            }
        }
        return true;

    };


    // Check if any fields are still occupied
    World.prototype.allSunk = function () {

        var grid = this.grid;
        for (var i = 0, l = grid.length; i < l; i += 1)
        {
            if (grid[i] > 0)
            {
                return false;
            }
        }
        return true;

    };


    // Print the world (for debugging and cheating)
    World.prototype.render = function () {

        for (var y = 0; y < this.height; y += 1)
        {
            console.log(this.grid.slice(y*this.width, (y + 1) * this.width).join('  '));
        }

    };
    return World;

}());


