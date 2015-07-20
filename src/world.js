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


    // world

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
            grid[i] = 0;
        }

        console.log('World created: ', width + 'x' + height);

        return this;

    }

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

    World.prototype.placeShip = function (shipSize, shipName) {

        if (shipSize > this.width && shipSize > this.height)
        {
            throw new Error('a ship of size ' + shipSize + ' is too big for a ' + this.width + 'x' + this.height + ' playing field');
        }

        var minX = 0;
        var maxX = this.width - shipSize;
        var minY = 0;
        var maxY = this.height - shipSize;

        var possiblePositions = [];
        var horizontalPossible, verticalPossible;

        var x, y, i;

        for (y = minY; y < maxY; y += 1)
        {
            for (x = minX; x < maxX; x += 1)
            {
                horizontalPossible = true;
                verticalPossible = true;

                for (i = 0; i < shipSize; i += 1)
                {
                    if (this.getField(x + i, y) !== 0)
                    {
                        horizontalPossible = false;
                    }
                    if (this.getField(x, y + i) !== 0)
                    {
                        verticalPossible = false;
                    }
                }

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

        if (!possiblePositions.length)
        {
            throw new Error('No more space left for a ship of size ' + shipSize);
        }

        var rnd = rndInt(0, possiblePositions.length / 3) * 3;

        x = possiblePositions[rnd];
        y = possiblePositions[rnd + 1];
        var horizontal = possiblePositions[rnd + 2];

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

    World.prototype.shoot = function (x, y) {

        var shipID = this.getField(x, y);

        if (!shipID)
        {
            console.log("miss!");
            return false;
        }
        else
        {
            this.setField(x, y, 0);
            console.log("hit!");

            if (this.shipSunk(shipID))
            {
                console.log("you sunk:", this.ships[shipID - 1]);

                if (this.allSunk())
                {
                    console.log("All ships sunk ");
                    this.gameOver = true;
                }
            }

            return true;

        }

    };


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


    World.prototype.render = function () {

        for (var y = 0; y < this.height; y += 1)
        {
            console.log(this.grid.slice(y*this.width, (y + 1) * this.width).join('  '));
        }

    };
    return World;

}());


