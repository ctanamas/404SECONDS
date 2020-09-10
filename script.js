/*
404 SECONDS: 13 puzzles to solve in 404 seconds
Created by Crystal Tanamas
September 9, 2020
*/

import * as vg from './mv.js';

// Declaring constants
const data = [800, 455, 'k,2a,393,352,216,0,180f,674,314,589,287,605,340f,214,233,198,377,140,337b,175,302,429,157i,183,390,69a,630,392,88,0,180a,582,459,83,0,180i,667,402,56k,1a,350,293,128,0,180a,437,293,128,0,180a,363,288,128,0,180a,423,287,128,0,180a,395,283,128,0,180k,2a,435,285,115,0,180a,354,285,115,0,180a,410,245,81,0,180a,382,245,81,0,180k,1a,258,459,69,0,180a,535,459,69,0,180k,2a,258,459,58,0,180a,535,459,58,0,180k,1b,239,238,9,156b,388,160,10,302b,555,288,10,117a,259,460,50,0,180k,1a,535,460,50,0,180f,192,307,248,229,245,291k,2b,189,292,48,31b,195,278,14,27f,239,284,219,284,239,256k,1i,689,374,15i,689,393,15b,674,370,30,23k,2i,689,374,10i,689,393,10b,679,373,20,21k,1i,695,384,8b,698,423,20,3b,698,424,3,23b,710,406,3,30f,696,426,723,395,720,392f,700,422,722,393,700,427b,716,397,3,28b,698,433,14,3'];
const palette = ['#000', '#4c4c4c', '#fff'];
const cvs = document.getElementById('canvas');
const cnxt = cvs.getContext('2d');
const grey = "#4c4c4c";
const CANVAS = {height: 600, width: 1200, centreY: 495, xMargin: 0}; // ratio of h:w is 3:5 centre is (h * 2.5) / 4
const standardUnit = CANVAS.width / 5;

CANVAS.centreY = CANVAS.height / 2 + (0.25 * standardUnit);
CANVAS.xMargin = standardUnit / 2;

const SHAPE = {rect: 0, circle: 1};
const COIN = {penny: 1, dime: 10, quarter: 25, loonie: 100, toonie: 200};
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const keyCode = {32: ' ', 70: 'f', 79: 'o', 85: 'u', 82: 'r', 90: 'z', 69: 'e', 83: 's'};
const hintCost = 13;
const noMoreHints = ["No hints left.", "To spend 50 seconds for a skip, press 's'"];
const hints = [[],
[["Try clicking the boxes"], ["Try making it 404"]],
[["Treat them like buttons"], ["Click them as if entering 404"], ["Press the 4 then the 0 then the 4"]],
[["Try clicking the boxes to stop them"], ["Try making it 404"]],
[["Look around for a number,", "maybe something that fits in the blank boxes"], ["Take a closer look at the level number"], ["You can drag the level number to the blank boxes"], ["Drag the 4 from the top right corner", "to fill the 2 blank boxes"]],
[["Where did the numbers go?", "Try to keep count in your head."], ["Try pressing each box the correct number of times"]],
[["I can't see! Look around for the numbers you want"], ["Try clicking the correct numbers"], ["Try finding the three digits in 404"]],
[["The buttons must have gotten confused!", "Try to figure out how the buttons work"], ["Try making the boxes display 404"]],
[["Months can also be written as numbers"], ["What date would be to 404 when written?"], ["What is the 4th month of the year"], ["April 4th is 4/04"]],
[["You can also hold the buttons down"], ["Try to keep count in your head"], ["Try to hold it down for longer"], ["The number of seconds you hold it is the number of that box"], ["Hold the first and third box down for 4 seconds each"]],
[["Is that a blinking cursor?"], ["Try typing something"], ["How do you spell out 404?"], ["Try typing \"four zero four\""]],
[["Think SHIFT"], ["Look at your keyboard"], ["Above each number is a symbol"], ["What symbols match to 404?"], ["Press the $ then the ) then the $"]],
[["Dollar amount"], ["What would 404 look like in money?"], ["$4.04"], ["Select 4 dollars and 4 cents of change"]],
[["Look closely at the car,", "you know what to look for ;)"], ["Look for numbers hidden in the picture"], ["Look for a '4', a '0', and another '4'"], ["Click on them once you've found them"], ["Look closely at the back window"], ["What about the headlight?"], ["Pay attention to the front grill"]],
[]];

// Declare game variables
var buttons = [];
var mouse = {};
var cursorShow = true;
var timerID = null, timer = 404;
var help = {width: 0, height: 0, shape: SHAPE.rect, xPos: 0, yPos: 0};
var pressOrder = "";

var hintNumber = -1;
var won = false;
var levelNum = {};
var pickedButtonIndex = -1;
var buttonDropTo = -1;
var levelData = {level: 0, on: null, id: null, totalCents: 0, levelTen: {index: 0, text: "four zero four"}, inBetween: false};

// Setup each level
function setup(levelData)
{
    // Resets variables for each level
    hintNumber = -1;
    levelData.inBetween = false;
    buttons = [];
    help = {width: 0, height: 0, shape: SHAPE.rect, xPos: 0, yPos: 0};
    clearDraw();

    if(levelData.id != null){clearInterval(levelData.id)}

    switch(levelData.level)
    {
        // Start and end screen
        case 0: case 14:
            var welcomeMessage = [];
            if(levelData.level == 0)
            {
                welcomeMessage = ["WELCOME", "13 levels. 404 seconds.", "Every hint costs 13 seconds.", "Good luck!", "Press SPACE to start"];
            }
            else if(won)
            {
                welcomeMessage = ["WELL DONE", "(ノ^_^)ノ", "You have completed 13 puzzles", "in under 404 seconds!", "Press SPACE to play again"];
            }
            else
            {
                welcomeMessage = ["GAME OVER", "¯\\_(ツ)_/¯", "Uh oh! Looks like you ran out of time", "Want to give it another shot?", "Press SPACE to try again"];
            }

            var textSize = standardUnit / 6;
            cnxt.font = textSize + "px Helvetica";
            cnxt.fillStyle = "white";
            cnxt.textBaseline = "bottom";

            var middle = CANVAS.width / 2;
            for(var c = 0; c < welcomeMessage.length; c++)
            {
                if(c == 0)
                {
                    cnxt.font = "bold " + (textSize * 3) + "px Helvetica";
                }
                else
                {
                    cnxt.font = textSize + "px Helvetica";
                }
                cnxt.fillText(welcomeMessage[c], (middle) - (cnxt.measureText(welcomeMessage[c]).width / 2), standardUnit * 1.05 + c * (textSize * 1.4));
            }

            break;

        // Sets up levels with similar three button layout
        case 1: case 3: case 5: case 7: case 9:

            // Sets up timer resets variables
            if(levelData.level == 1)
            {
                pickedButtonIndex = -1;
                buttonDropTo = -1;
                won = false;
                levelData["totalCents"] = 0;

                timer = 404;
                if(timerID != null){clearInterval(timerID);}
                timerID = setInterval(function(){timer--;
                                                drawTimer();
                                                if(timer <= 0)
                                                {
                                                    endGame();
                                                }
                                                }, 1000);
            }

            pressOrder = "";

            // Add three buttons
            for(var c = 0; c <= 2; c++)
            {
                buttons.push({width: standardUnit,
                height: standardUnit,
                yPos: 0,
                xPos: 0,
                shape: SHAPE.rect,
                value: 0});

                buttons[c].yPos = standardUnit;
                buttons[c].xPos = (CANVAS.xMargin) + ((1.5 * buttons[c].width) * c);
                if(levelData.level == 5)
                {
                    buttons[c].value = null;
                }
            }

            // Sets up level three running numbers
            if (levelData.level == 3)
            {
                levelData["on"] = [true, true, true];
                levelData["id"] = setInterval(function(){
                    for(c = 0; c <= buttons.length - 1; c++){

                        if(levelData.on[c])
                        {
                            buttons[c].value = (buttons[c].value + 1) % 10;
                        }

                    }
                    draw();
                }, 100);
            }

            if(levelData.level == 9)
            {
                levelData.on = null;
            }
            break;

        // Sets up similar levels with 7 circle buttons
        case 2: case 11:
            pressOrder = "";

            var values = [];
            if(levelData.level == 11)
            {
                values = [")", "€", "♫", "&", "$", "£", "#"];
            }
            else if(levelData.level == 2)
            {
                values = ["6", "4", "1", "9", "8", "0", "3"];
            }

            var stdRad = standardUnit / 4;
            var yPos = [standardUnit + stdRad, (standardUnit / 2) + standardUnit + stdRad];
            var xPos = [];

            // Populate positions
            for(var a = 0; a <= 1; a++) // for 2 rows
            {
                var distance = (((standardUnit * 4) - (2 * stdRad)) / (3 + a - 1));

                for(var b = 0; b < 3 + a ; b++) // for 3 coins then 4 coins
                {
                    if(a == 1)
                    {
                        xPos.push((CANVAS.xMargin + stdRad) + b * distance);
                    }
                    else
                    {
                        xPos.push((CANVAS.xMargin + stdRad + (distance / 3)) + b * distance / 1.5);
                    }
                }
            }

            // Add to buttons
            var count = 0;
            for(var i = 0; i <= 1; i++)
            {
                for(var j = 0; j < 3 + i; j++, count++)
                {
                    buttons.push({radius: stdRad,
                    yPos: 0,
                    xPos: 0,
                    shape: SHAPE.circle,
                    value: 0});

                    buttons[buttons.length - 1].xPos = xPos[count];
                    buttons[buttons.length - 1].value = values[buttons.length - 1];
                    buttons[buttons.length - 1].yPos = yPos[i];
                }
            }
            break;

        // Sets up level 4
        case 4:

            // Add three buttons
            for(var c = 0; c <= 2; c++)
            {
                buttons.push({width: standardUnit,
                height: standardUnit,
                yPos: 0,
                xPos: 0,
                shape: SHAPE.rect,
                value: 0});
                if(c != 1)
                {
                    buttons[c].value = null;
                }

                buttons[c].yPos = (CANVAS.centreY) - (0.5 * (buttons[c].height));
                buttons[c].xPos = (CANVAS.xMargin) + ((1.5 * buttons[c].width) * c);
            }

            // Add hidden 'buttons' draggable level number
            for(var c = 0; c <= 1; c++)
            {
                buttons.push({width: levelNum["width"],
                height: levelNum["height"],
                yPos: levelNum["yPos"],
                xPos: levelNum["xPos"],
                shape: SHAPE.rect,
                value: 4,
                fit: false});
            }
            break;

        // Sets up level 8
        case 8:
            pressOrder = "";

            buttons.push({width: standardUnit * 2.5,
            height: standardUnit,
            yPos: (CANVAS.centreY) - (0.5 * (standardUnit)),
            xPos: CANVAS.xMargin,
            shape: SHAPE.rect,
            value: 11});

            buttons.push({width: standardUnit,
            height: standardUnit,
            yPos: (CANVAS.centreY) - (0.5 * (standardUnit)),
            xPos: standardUnit * 3.5,
            shape: SHAPE.rect,
            value: 24});
            break;

        // Sets up level 10
        case 10:
            levelData["levelTen"] = {text: "four zero four", index: 0};
            levelData["id"] = setInterval(drawTyping, 500);
            break;

        // Sets up level 13
        case 13:

            var clickArea = [{radius: 45, xPos: 435, yPos: 321, value: 4},
                             {radius: 30, xPos: 889, yPos: 431, value: 0},
                             {radius: 16, xPos: 908, yPos: 468, value: 4}];

            // Add 3 buttons or click areas in the right locations
            for(var c = 0; c <= clickArea.length - 1; c++)
            {
                buttons.push({radius: clickArea[c].radius,
                yPos: clickArea[c].yPos,
                xPos: clickArea[c].xPos,
                shape: SHAPE.circle,
                hidden: true,
                value: clickArea[c].value});
            }

            drawCar();
            break;

        // Sets up level 12
        case 12:
            var stdCoinRad = standardUnit * 4 / 11 / 2;
            var coins = [{type: COIN.penny, quantities: 6, face: "1¢", size: 0.68036},
            {type: COIN.dime, quantities: 2, face:"10¢", size: 0.643929},
            {type: COIN.quarter, quantities: 5, face:"25¢", size: 0.85286},
            {type: COIN.loonie, quantities: 1, face:"$1", size: 0.9464286},
            {type: COIN.toonie, quantities: 2, face:"$2", size: 1}];
            var position = 0;
            var yPos = [];
            var xPos = [];

            // Populate positions
            for(var a = 0; a <= 2; a++) // for 3 rows of coins
            {
                for(var b = 0; b <= 4 + (a % 2); b++) // for 5 coins, 6 coins then 5 coins
                {
                    yPos.push((a * (standardUnit / 3)) + standardUnit + stdCoinRad);
                    if(a == 1)
                    {
                        xPos.push((CANVAS.xMargin + stdCoinRad)+ (b * (4 * stdCoinRad)));
                    }
                    else //if row 0 or 2
                    {
                        xPos.push((CANVAS.xMargin + (stdCoinRad * 3))+ (b * (4 * stdCoinRad)));
                    }
                }
            }

            // Adds the coins to buttons
            for(var c = 0; c <= coins.length - 1; c++)
            {
                for(var coin = 0; coin <= coins[c]["quantities"] - 1; coin++)
                {
                    buttons.push({radius: coins[c]["size"] * (stdCoinRad * (1 / 1.2)), // this is for the select circle for later
                    yPos: 0,
                    xPos: 0,
                    shape: SHAPE.circle,
                    selected: false,
                    type: coins[c]["type"],
                    value: coins[c]["face"]});
                    buttons[buttons.length - 1].yPos = yPos[position];
                    buttons[buttons.length - 1].xPos =  xPos[position];

                    yPos.splice(position, 1);
                    xPos.splice(position, 1);

                    // for random in range min to min, it is min + (random() * max)
                    // So this choses a random position for the next coin to be placed
                    position = Math.floor((yPos.length - 1) * Math.random());

                }
            }

            break;

        // Sets up level 6
        case 6:
            var columns = 11;
            var rows = 3;
            var stdRad = standardUnit * 4 / (columns + (0.5 * (columns - 1))) / 2;
            var value = 0;
            var answerPos = [Math.floor(Math.random() * columns), Math.floor(Math.random() * columns), Math.floor(Math.random() * columns)];

            // Adds buttons
            for(var r = 0; r < rows; r++)
            {
                for(var c = 0; c < columns; c++)
                {
                    if(c == answerPos[r])
                    {
                        value = 4 - ((r % 2) * 4);
                    }
                    else
                    {
                        // Chooses random value that's not 4 or 0
                        value = 0;
                        while(value == 4 || value == 0)
                        {
                            value = Math.floor(Math.random() * 10);
                        }
                    }

                    buttons.push({radius: stdRad,
                    yPos: standardUnit + stdRad  + (r * standardUnit / 3),
                    xPos: CANVAS.xMargin + stdRad + (c * stdRad * 2 * 1.5),
                    shape: SHAPE.circle,
                    hidden: true,
                    value: value});

                }
            }
            break;

        default:
            break;
    }

    // Draw options if not end or start screen
    if(levelData.level != 0 && levelData.level != 14)
    {
        drawOptions();
    }
    draw();
}

// Draws level
function draw()
{
    switch(levelData.level)
    {
        case 1: case 3: case 7: case 8: case 2: case 11:
            drawTimer();
            drawShapes();
            drawContent();
            break;

        case 5: case 9:
            drawTimer();
            drawShapes();
            break;

        case 4:
            clearDraw();
            drawOptions();
            drawTimer();
            drawShapes();
            drawContent();
            break;

        case 6:
            drawTimer();
            drawOptions();
            drawShapes();
            drawContent();
            break;

        case 10:
            drawTimer();
            drawTyping();
            break;

        case 12:
            clearMiddle();
            drawTimer();
            drawShapes();
            drawContent();
            break;

        case 13:
            clearMiddle();
            drawTimer();
            drawCar();
            drawShapes();
            drawContent();
            break;

        default:
            break;
    }
}

// Draws the button shape
function drawShapes()
{
    cnxt.fillStyle = "white";

    for(var c = 0; c <= buttons.length - 1; c++)
    {
        if((levelData.level == 4 && c >= 3) || ((levelData.level == 13 || levelData.level == 6) && buttons[c].hidden))
        {
            continue;
        }

        // Draws rectangle button
        if(buttons[c].shape == SHAPE.rect)
        {
            cnxt.clearRect(buttons[c].xPos, buttons[c].yPos, buttons[c].width, buttons[c].height); // just why not instead of drawing white
        }

        // Draws circle button
        else if(buttons[c].shape == SHAPE.circle)
        {
            // Draws an outline circle if needed
            if(levelData.level == 12 && buttons[c].selected)
            {
                cnxt.strokeStyle = "white";
                cnxt.beginPath();
                cnxt.arc(buttons[c].xPos, buttons[c].yPos, buttons[c].radius * 1.2, 0, 2 * Math.PI);
                cnxt.stroke();
            }

            cnxt.beginPath();
            cnxt.arc(buttons[c].xPos, buttons[c].yPos, buttons[c].radius, 0, 2 * Math.PI);
            cnxt.fill();

            // Draws an outline circle if needed
            if(levelData.level == 13)
            {
                cnxt.strokeStyle = grey;
                cnxt.stroke();
            }
        }
    }
}

// Clears then fills the middle section of the canvas
function clearMiddle()
{
    cnxt.clearRect(CANVAS.xMargin / 2, standardUnit * 0.75, CANVAS.width - CANVAS.xMargin, CANVAS.height - standardUnit );
    cnxt.fillStyle = grey;
    cnxt.fillRect(CANVAS.xMargin / 2, standardUnit * 0.75, CANVAS.width - CANVAS.xMargin, CANVAS.height - standardUnit );
}

// Draws text for level ten
function drawTyping()
{
    cursorShow = !cursorShow;
    clearMiddle();

    cnxt.textBaseline = "hanging";
    cnxt.fillStyle = "white";
    cnxt.font = 0.67 * (standardUnit) + "px Helvetica";

    // Draws up to not indlucing "index"
    var text = levelData.levelTen["text"].substring(0, levelData.levelTen["index"]);
    if(cursorShow)
    {
        text += "│";
    }

    cnxt.fillText(text, CANVAS.xMargin, (CANVAS.centreY) - (CANVAS.width / 20));
}

// Draws content of all buttons
function drawContent()
{
    cnxt.textBaseline = "hanging";
    cnxt.fillStyle = grey;

    for(var c = 0; c <= buttons.length - 1; c++)
    {
        if(buttons[c].value == null || (levelData.level == 13 && buttons[c].hidden))
        {
            continue;
        }

        var size, height;
        if(buttons[c].shape == SHAPE.rect)
        {
            size = buttons[c].width;
            height = buttons[c].height;
        }
        else if(buttons[c].shape == SHAPE.circle)
        {
            size = buttons[c].radius * 2;
            height = buttons[c].radius;
        }

        var value = buttons[c].value;
        var textSize = size / value.toString().length;

        // Properly formats according to level
        if(levelData.level == 4 && c >= 3 && buttons[c].fit == false)// protected because only 3 and 4 have fit vaules
        {
            cnxt.fillStyle = "white";
        }
        else if(levelData.level == 8)
        {
            if(c == 0)
            {
                value = months[value];
                textSize = size / 6;
            }
            else if(c == 1)
            {
                value += 1; // to account for index num
                if(value < 10)
                {
                    value = "0" + value;
                }
                textSize = size * 5 / 12;
            }
        }
        else if(levelData.level == 13)
        {
            textSize *= 1.1;
        }
        else if(levelData.level == 11)//value == ')') // maybe contains [), g, j, p, q, y]
        {
            textSize *= 0.80;
        }
        if(value == ')')
        {
            textSize *= 0.85;
        }

        // Draws the content of the button in the correct location depending on the shape
        cnxt.font = textSize + "px Helvetica";
        var txtWidth = cnxt.measureText(value).width;

        if(buttons[c].shape == SHAPE.rect)
        {
            cnxt.fillText(value.toString(), buttons[c].xPos + ((0.5 * size) - (0.5 * txtWidth)), (height / 2) + buttons[c].yPos - (textSize * 3 / 8));
        }
        else if(buttons[c].shape == SHAPE.circle)
        {
            cnxt.fillText(value.toString(), buttons[c].xPos - (txtWidth / 2), buttons[c].yPos - (textSize / 2.6));
        }
    }
}

// Draws a white circle around the mouse for level 6
function drawMouse(mouse)
{
    cnxt.fillStyle = "white";
    var radius = standardUnit / 6;
    var xPos = mouse.xPos;
    var yPos = mouse.yPos;
    cnxt.beginPath();
    cnxt.arc(xPos, yPos, radius, 0, 2 * Math.PI);
    cnxt.fill();
}

// Clears then fills the whole canvas
function clearDraw()
{
    cnxt.clearRect(0, 0, CANVAS.width, CANVAS.height);
    cnxt.fillStyle = grey;
    cnxt.fillRect(0, 0, CANVAS.width, CANVAS.height);
}

// Draws the car for level 13
// Credit to madmarcel who created the js13k-mini-svg-editor
function drawCar()
{
    var createCanvas = (w,h) => {
        var bf = document.createElement('canvas');
        bf.width = w;
        bf.height = h;
        var bc = bf.getContext('2d');

        // we need both. We draw our stuff on the 2d context for this canvas,
        // and in turn we pass the canvas element when we want to draw our stuff on another canvas
        return [bc, bf];
    };

    var images = [];

    // set the pavar te
    vg.setPalette(palette);

    // loop over data and generate a canvas element for each item
    var d = data;

    // var inc = 100.0 / (d.length / 3);
    for(var i = 0; i < d.length; i += 3) {
        var w = d[i];
        var h = d[i + 1];
        var r = d[i + 2];

        var [img, cv] = createCanvas(w,h);
        vg.vgrender(img, r); // we render the image on the 2d context
        images.push(cv); // we only need the canvas element after this
    }

    var index = 0;
    cnxt.drawImage(images[index], 200, 50); // hardcoded
}

// Draws the options at the top of the screen
function drawOptions()
{
    var textSize = standardUnit / 6;
    var padding = 1.1;
    var origin = {xPos: CANVAS.xMargin, yPos: (standardUnit * 0.5) - (textSize / 2)};
    cnxt.font = textSize + "px Helvetica";

    var levelStr = "Level " + levelData.level.toString();
    if(levelData.level == 10) {levelStr = "Level ten "}

    var textLength = cnxt.measureText(levelStr).width * padding;

    // Sets help button "?" properties, then draws the box for the help button
    help = {width: textSize * padding, height: textSize * padding, shape: SHAPE.rect, xPos: origin.xPos + (textLength ), yPos: origin.yPos};
    cnxt.fillStyle = 'white';
    cnxt.fillRect(help.xPos, help.yPos, help.width, help.width);

    cnxt.textBaseline = "hanging";

    if(levelData.level == 6)
    {
        cnxt.fillStyle = grey;
    }

    // Find location for level 4 hidden buttons
    if(levelData.level == 4 - 1) // because 3 is the same location as 4
    {
        levelNum["yPos"] = origin.yPos + (0.12 * textSize);
        levelNum["xPos"] = textLength + origin.xPos - (textSize  * 1.1);

        levelNum["height"] = textSize; // because only one char nomeasure text
        levelNum["width"] = levelNum.height;
    }

    // Draw "Level x" text
    cnxt.fillText(levelStr, origin.xPos, origin.yPos + (textSize * 0.25));

    // Draws ? on help button
    cnxt.fillStyle = grey;
    cnxt.fillText("?", help.xPos * 1.03, help.yPos + (textSize * 0.20));

    // Draws current hint message if any
    if(hintNumber > -1)
    {
        if(hintNumber <= hints[levelData.level].length - 1)
        {
            drawHint(hints[levelData.level][hintNumber], textSize * 0.5);
        }
        else
        {
            drawHint(noMoreHints, standardUnit / 12);
        }
    }

    // Draws timer
    if(levelData.level != 6 && levelData.level != 4)
    {
        drawTimer();
    }
}

// Draws hint text
function drawHint(str, textSize)
{
    cnxt.font = textSize + "px Helvetica";
    cnxt.fillStyle = "white";
    cnxt.textBaseline = "hanging";
    var middle = CANVAS.width / 2;

    if(str.length > 1)
    {
        // multiline text
        cnxt.fillText(str[0], (middle) - (cnxt.measureText(str[0]).width / 2), help.yPos);
        cnxt.fillText(str[1], (middle) - (cnxt.measureText(str[1]).width / 2), help.yPos + (textSize * 1.5));
    }
    else
    {
        cnxt.fillText(str[0], (middle) - (cnxt.measureText(str[0]).width / 2), help.yPos + (textSize * 0.75));
    }
}

// Handles mouse down events for each level
function handleMouseDown()
{
    if(levelData.inBetween)
    {
        return;
    }

    // Help hint button displays next hint
    if(checkCollision(help))
    {
        confirmHint();
        return;
    }

    // Go through the list of buttons to see if any colide
    var buttonClicked = buttons.findIndex(checkCollision);

    if(buttonClicked >= 0)
    {
        switch(levelData.level)
        {
            // For level one, increment buttons by one
            case 1:
                buttons[buttonClicked].value = (buttons[buttonClicked].value + 1) % 10;

                if(buttons[0].value == 4 && buttons[1].value == 0 && buttons[2].value == 4)
                {
                    nextLevel();
                }
                else
                {
                    draw();
                }
                break;
            // For level 3, start/stop running numbers
            case 3:
                levelData.on[buttonClicked] = !levelData.on[buttonClicked];

                if(!levelData.on.includes(true) && (buttons[0].value == 4 && buttons[1].value == 0 && buttons[2].value == 4))
                {
                    clearInterval(levelData.id);
                    nextLevel();
                }
                else
                {
                    draw();
                }
                break;

            // For level 5, flash boxes
            case 5:
                pressOrder += "" + buttonClicked;

                flash(buttons[buttonClicked]);

                if(pressOrder.length > 8)
                {
                    pressOrder = pressOrder.substring(1, 9);
                }

                if(pressOrder.length == 8 && (pressOrder == "00002222" || pressOrder == "22220000")) // change to .equals for good habits
                {
                    nextLevel();
                }
                break;

            // For level 7, increment neighbouring button by 2
            case 7:
                buttons[(buttonClicked + 1) % 3].value = (buttons[(buttonClicked + 1) % 3].value + 2) % 10;

                if(buttons[0].value == 4 && buttons[1].value == 0 && buttons[2].value == 4)
                {
                    nextLevel();
                }
                else
                {
                    draw();
                }
                break;

            // For level 9, increment button if held
            case 9:
                levelData.on = buttonClicked;
                buttons[buttonClicked].value = 0; // needs to reset so that it doesn't accumulate from different holds

                levelData["id"] = setInterval(function(){

                buttons[buttonClicked].value = (buttons[buttonClicked].value + 1) % 10;
                flash(buttons[buttonClicked]);
                }, 750);
                break;

            // For level 11, keep track of buttons clicked
            case 11:
                pressOrder += "" + buttonClicked;

                if(pressOrder.length > 3)
                {
                    pressOrder = pressOrder.substring(1, 4);
                }

                if(pressOrder.length == 3 && (pressOrder == "404"))
                {
                    nextLevel();
                }
                else
                {
                    draw();
                }
                break;

            // For level 2, keep track of buttons pressed
            case 2:
                pressOrder += "" + buttonClicked;

                if(pressOrder.length > 3)
                {
                    pressOrder = pressOrder.substring(1, 4);
                }

                if(pressOrder.length == 3 && (pressOrder == "151")) // change to .equals for good habits
                {
                    nextLevel();
                }
                else
                {
                    draw();
                }
                break;

            // For level 8, increment month/day by one
            case 8:
                if(buttonClicked == 0)
                {
                    buttons[0].value = (buttons[0].value + 1) % 12;
                    buttons[1].value = 0;
                }
                else if(buttonClicked == 1)
                {
                    if(buttons[0].value == 1) // February
                    {
                        buttons[1].value = (buttons[1].value + 1) % 28; // always % __ which is one more than the max num (then in content we add 1)
                    }
                    else if([3, 5, 8, 10].includes(buttons[0].value))
                    {
                        buttons[1].value = (buttons[1].value + 1) % 30;
                    }
                    else
                    {
                        buttons[1].value = (buttons[1].value + 1) % 31;
                    }
                }

                if(buttons[0].value == 4 - 1 && buttons[1].value == 4 - 1)
                {
                    nextLevel();
                }
                else
                {
                    draw();
                }
                break;

            // For level 4, select hidden button, or increment middle button
            case 4:
                if(buttonClicked == 1)
                {
                    buttons[buttonClicked].value = (buttons[buttonClicked].value + 1) % 10;
                    if((buttons[0].value == 4 && buttons[1].value == 0 && buttons[2].value == 4)) // change to .equals
                    {
                        nextLevel();
                    }
                    else
                    {
                        draw();
                    }
                }
                else if(buttonClicked >= 3) // buttons 3 or 4
                {
                    pickedButtonIndex = buttonClicked;
                }
                break;

            // For level 12, select/unselect coins clicked
            case 12:
                    if(buttons[buttonClicked].selected == false)
                    {
                        levelData.totalCents += buttons[buttonClicked].type;
                    }
                    else
                    {
                        levelData.totalCents -= buttons[buttonClicked].type;
                    }

                    buttons[buttonClicked].selected = !buttons[buttonClicked].selected;

                    // if total = 404
                    if(levelData.totalCents == 404)
                    {
                        nextLevel();
                    }
                    else
                    {
                        draw();
                    }
                    break;

            // For level 13, reveal the hidden number
            case 13:
                buttons[buttonClicked].hidden = false;

                var allFound = true;
                for(var i = 0; i <= buttons.length - 1; i++)
                {
                    if(buttons[i].hidden)
                    {
                        allFound = false;
                    }
                }

                if(allFound)
                {
                    won = true;
                    clearInterval(timerID);
                    nextLevel();
                }
                else
                {
                    draw();
                }
                break;

            // For level 6, reveal only if correct buttons
            case 6:
                if(buttons[buttonClicked].value == 4 || buttons[buttonClicked].value == 0)
                {
                    buttons[buttonClicked].hidden = false;

                    var found = 0;
                    for(var c = 0; c < buttons.length; c++)
                    {
                        if(!buttons[c].hidden)
                        {
                            found++;
                        }
                    }

                    if(found == 3)
                    {
                        nextLevel();
                    }
                    else
                    {
                        draw();
                    }
                }
                else
                {
                    // make everything hidden again
                    for(var c = 0; c < buttons.length; c++)
                    {
                        buttons[c].hidden = true;
                    }
                    draw();
                }
                break;

            default:
                break;
        }
    }
    else
    {
        // make everything hidden again, if clicking elsewhere
        if(levelData.level == 13)
        {
            for(var i = 0; i <= buttons.length - 1; i++)
            {
                buttons[i].hidden = true;
            }
            draw();
        }
    }
}

// Handles mouse up events
function handleMouseUp()
{
    if(levelData.inBetween)
    {
        return;
    }

    switch(levelData.level)
    {
        // For level 9, stops the interval of the held button
        case 9:
            var buttonClicked = levelData.on;

            clearInterval(levelData.id);
            levelData.on = null;

            if(buttonClicked != null)
            {
                pressOrder += "" + buttonClicked;
            }

            if(pressOrder.length > 2)
            {
                pressOrder = pressOrder.substring(1, 3);
            }

            if((buttons[0].value == 4 && buttons[2].value == 4) && (pressOrder == "02" || pressOrder == "20")) // change to .equals
            {
                nextLevel();
            }
            break;

            // For level 4, drops a dragged hidden button if any
            case 4:
                if(pickedButtonIndex == -1)
                {
                    return;
                }

                // Drops the hidden 4 if in box, otherwise make it back to the original spot
                if(buttons[pickedButtonIndex].fit == true)
                {
                    buttons[buttonDropTo].value = 4;

                    // Deletes the found "hidden" button when it successfully "merges" into the main
                    buttons.splice(pickedButtonIndex, 1);
                }
                else
                {
                    // Puts the hidden button back to the original position
                    buttons[pickedButtonIndex].yPos = levelNum["yPos"];
                    buttons[pickedButtonIndex].xPos = levelNum["xPos"];
                }
                pickedButtonIndex = -1;

                // Check if the level is complete
                if((buttons[0].value == 4 && buttons[1].value == 0 && buttons[2].value == 4)) // change to .equals
                {
                    nextLevel();
                }
                else
                {
                    draw();
                }
                break;

            default:
                break;
    }
}

// Handels mouse move events
function handleMouseMove()
{
    if(levelData.inBetween)
    {
        return;
    }

    switch(levelData.level)
    {
        // Fpr level 4, redraw the canvas if the player has seleced a hidden moveable button
        case 4:
            if(pickedButtonIndex == -1)
            {
                return;
            }

            // Adjusts the picked button to the mouse position
            mouse = getMousePos(cvs, event);
            buttons[pickedButtonIndex].xPos = mouse.xPos - 0.5 * buttons[pickedButtonIndex].width;
            buttons[pickedButtonIndex].yPos = mouse.yPos - 0.5 * buttons[pickedButtonIndex].height;

            // Check and update if it's over the correct box (only the ones where the value is null)
            for(var c = 0; c <= 2; c += 2)
            {
                if(buttons[c].value == null && checkCollision(buttons[c]))
                {
                    buttons[pickedButtonIndex].fit = true;
                    buttonDropTo = c;
                    break;
                }
                else
                {
                    buttons[pickedButtonIndex].fit = false;
                    buttonDropTo = -1;
                }
            }

            draw();
            break;

        // For level 6, redraw the canvas with the new mouse position
        case 6:
            clearDraw();
            mouse = getMousePos(cvs, event);
            drawTimer();
            drawMouse(mouse);
            drawOptions();
            drawShapes();
            drawContent();
            break;

        default:
            break;
    }
}

// Handles key down events
function handleKeyDown()
{
    if(levelData.inBetween)
    {
        return;
    }

    var key = keyCode[event.keyCode];

    // Press SPACE functionality
    if((levelData.level == 0 || levelData.level == 14) && key == ' ')
    {
        nextLevel();
        return;
    }

    // Skip functionality
    if((hintNumber >= hints[levelData.level].length) && key == 's')
    {
        timer -= 50;
        if(levelData.level == 13 && timer >= 0)
        {
            won = true;
            clearInterval(timerID);
        }
        nextLevel();
        return;

    }

    // For level 10, the typing level, update what the user typed
    if(levelData.level == 10)
    {
        if(key == levelData.levelTen["text"].charAt(levelData.levelTen["index"]))
        {
            levelData.levelTen.index += 1;

            if(levelData.levelTen.text[levelData.levelTen.index] == " ")
            {
                levelData.levelTen.index += 1;
            }

            if(levelData.levelTen["index"] >= levelData.levelTen["text"].length)
            {
                nextLevel();
            }

            draw();
        }
        return;
    }
}

// Checks if the mouse has collided with a given button
function checkCollision(button)
{
    mouse = getMousePos(cvs, event);
    return isInside(mouse, button);
}

// Gets the current mouse position
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        xPos: event.clientX - rect.left,
        yPos: event.clientY - rect.top
    };
}

// Ends the game with a loss
function endGame()
{
    won = false;
    levelData.level = 14;
    clearInterval(timerID);
    setup(levelData);
}

// Changes hint if appropriate
function confirmHint()
{
    // If there is still an unrevealed hint, reveal the next and update timer
    if(hintNumber <= hints[levelData.level].length - 1)
    {
        timer -= hintCost;
        hintNumber++;
        cnxt.clearRect(0, 0, CANVAS.width - standardUnit, standardUnit * 0.75);
        cnxt.fillStyle = grey;
        cnxt.fillRect(0, 0, CANVAS.width - standardUnit, standardUnit * 0.75);
        drawOptions();
    }

    // Otherwise display the no more hints message
    else
    {
        cnxt.clearRect(0, 0, CANVAS.width - standardUnit, standardUnit * 0.75);
        cnxt.fillStyle = grey;
        cnxt.fillRect(0, 0, CANVAS.width - standardUnit, standardUnit * 0.75);
        hintNumber++;
        drawOptions();
    }
}

// Draws the timer in the top right corner
function drawTimer()
{
    cnxt.clearRect(CANVAS.width - standardUnit, 0, standardUnit, standardUnit * 0.75);
    cnxt.fillStyle = grey;
    cnxt.fillRect(CANVAS.width - standardUnit, 0, standardUnit, standardUnit * 0.75);
    cnxt.font = standardUnit / 5 + "px Helvetica";
    cnxt.fillStyle = "white";
    cnxt.textBaseline = "hanging";
    cnxt.fillText(timer, CANVAS.width - standardUnit / 2 - cnxt.measureText(timer.toString()).width, help.yPos);
}

//Function to check whether a point is inside a button
function isInside(mouse, button)
{
    if(button.shape == SHAPE.rect)
    {
        return mouse.xPos > button.xPos && mouse.xPos < button.xPos + button.width && mouse.yPos < button.yPos + button.height && mouse.yPos > button.yPos;
    }
    else if(button.shape == SHAPE.circle)
    {
        return Math.sqrt((mouse.xPos - button.xPos) * (mouse.xPos - button.xPos) + (mouse.yPos - button.yPos) * (mouse.yPos - button.yPos)) < button.radius;
    }
}

// Changes level, sets up next level
function nextLevel()
{
    draw();
    levelData.inBetween = true;
    levelData.level = (levelData.level % 14) + 1;
    setTimeout(function(){setup(levelData);}, 250);
    return;
}

// Quickly enlarge and unenlarge a given rectangle
function flash(rect)
{
    var increase = 1.1;

    // instead of white
    cnxt.clearRect(rect.xPos - (rect.width * (increase - 1) / 2), rect.yPos - (rect.height * (increase - 1) / 2), rect.width * increase, rect.height * increase);

    setTimeout(function() {
        cnxt.fillStyle = grey;
        cnxt.fillRect(rect.xPos - (rect.width * (increase - 1) / 2), rect.yPos - (rect.height * (increase - 1) / 2), rect.width * increase, rect.height * increase);
        cnxt.fillStyle = "white";
        cnxt.fillRect(rect.xPos, rect.yPos, rect.width, rect.height);
        }, 80);
}

// Add event listeners to canvas of document
cvs.addEventListener('mousedown', handleMouseDown);
cvs.addEventListener('mouseup', handleMouseUp);
cvs.addEventListener('mousemove', handleMouseMove);
document.addEventListener('keydown', handleKeyDown);

// Initial setup to start the game
setup(levelData);