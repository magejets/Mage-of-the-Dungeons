/****************************************
*      COPYRIGHT 2019 MAGE J LEWIS      *
****************************************/



/*
THIS PROGRAM STORES ALL THE DATA FOR THE PLATFORMS IN ALL THE LEVELS OF THE GAME
*/
var canvas = document.getElementById("canvas");


//How tall and wide each level is
var levelDimensions = {
    top: -1620,
    bottom: 360,
    left: 0,
    right: 2000
}

//stores data on all the platforms in the game
var platforms = [];

//Stores all the monster objects for the game
var monsters = [];

/*************************
* Quick Reference for platform types
* 1 = normal ground
* 2 = lava
* 3 = block disabled/enabled by a lever
* 4 = lever
* 5 = key
* 6 = exit
*    Types 3 and 4 and also 5 and 6 must contain a code equal to their counter part in order to work
*
*************************/

//The borders of all the levels
platforms.push({
    x:-500,
    y:levelDimensions.top,
    width:500,
    height:levelDimensions.bottom-levelDimensions.top+500,
    level: 0,
    type: 1
});
platforms.push({
    x:levelDimensions.right-5,
    y:levelDimensions.top,
    width:5,
    height:levelDimensions.bottom-levelDimensions.top,
    level: 0,
    type: 1 
});
platforms.push({
    x:levelDimensions.left,
    y:levelDimensions.top,
    width: levelDimensions.right,
    height:5,
    level: 0,
    type: 1
});
platforms.push({
    x:levelDimensions.left,
    y:355,
    width: levelDimensions.right,
    height:500,
    level: 0,
    type: 1   
});


//Stairs in level 1
platforms.push({
    x:390,
    y:335,
    width:30,
    height:20,
    level: 1,
    type: 1
});
platforms.push({
    x:420,
    y:305,
    width:30,
    height:50,
    level: 1,
    type:1
});
platforms.push({
    x:450,
    y:265,
    width:30,
    height: 90,
    level:1,
    type:1
});

//various random platforms throughout level 1
platforms.push({
    x:0,
    y:100,
    width: 405,
    height: 20,
    level:1,
    type:1
});
platforms.push({
    //lever activated platform
    x:405,
    y:100,
    width:75,
    height: 20,
    level: 1,
    type: 3,
    status: 1,
    code: 'a'
});
platforms.push({
    x:480,
    y:-670,
    width:20,
    height:790,
    level:1,
    type:1
});
platforms.push({
    x:480,
    y:330,
    width:levelDimensions.right-480,
    height:30,
    level:1,
    type:2
});
platforms.push({
    x:560,
    y:265,
    width:320,
    height:20,
    level:1,
    type:1
});
platforms.push({
    x:960,
    y:165,
    width:50,
    height:20,
    level:1,
    type:1
});
platforms.push({
    x:1060,
    y:65,
    width:100,
    height:20,
    level:1,
    type:1
});
platforms.push({
    x:1200,
    y:0,
    width:150,
    height:20,
    level:1,
    type:1
});
platforms.push({
    x:1400,
    y:-30,
    width:levelDimensions.right-1400,
    height:20,
    level:1,
    type:1
});
platforms.push({
    x:1400,
    y:-500,
    width:20,
    height:350,
    level:1,
    type:1
});
//More stairs
for(var i = 0; i < Math.floor(500/30);i++){
    platforms.push({
        x:levelDimensions.right-((20*i)+25),
        y: -500 + (30*i),
        width:20,
        height:-30-(-500 + (30*i)),
        level:1,
        type:1
    });
}
platforms.push({
    x:1420,
    y:-500,
    width:levelDimensions.right-1540,
    height:20,
    level:1,
    type:1
});
platforms.push({
    x:800,
    y:-500,
    width:500,
    height:20,
    level:1,
    type:1
});
platforms.push({
    //lever in level 1
    x:900,
    y:-520,
    width:20,
    height:20,
    level:1,
    type:4,
    active:false,
    code: 'a'
});
platforms.push({
    x:725,
    y:-670,
    width:20,
    height:150,
    level:1,
    type:1
    
});
platforms.push({
    x:825,
    y:-670,
    width:20,
    height:50,
    level:1,
    type:1
    
});
platforms.push({
    x:500,
    y:-670,
    width:225,
    height:20,
    level:1,
    type:1
});
platforms.push({
    x:845,
    y:-670,
    width:400,
    height:20,
    level:1,
    type:1
});
platforms.push({
    x:1350,
    y:-670,
    width:levelDimensions.right-1350,
    height:20,
    level:1,
    type:1
});
for(i = 0; i < 19;++i){
    platforms.push({
        x:levelDimensions.right-((20*i)+45),
        y: (levelDimensions.top+50) + (50*i),
        width:20,
        height:-720-(levelDimensions.top + (50*i)),
        level:1,
        type:1
    });
}
platforms.push({
    x:levelDimensions.right-25,
    y:levelDimensions.top+50,
    width:20,
    height:900,
    level:1,
    type:1
});
platforms.push({
    x:levelDimensions.right-25,
    y:levelDimensions.top+5,
    width:20,
    height:45,
    level:1,
    type:6,
    open:false
});
platforms.push({
    x:100,
    y:85,
    width:20,
    height:10,
    level:1,
    type:5
});
//Level one monsters
/*Monster type guide
* 1-6 weakest to strongest
* 4 can shoot bullets
*/
monsters.push({
    x:1550,
    y:-60,
    width:15,
    height:30,
    level:1,
    type:1,
    lives:1,
    xMin:1400,
    xMax: 1650,
    direction:1
});
monsters.push({
    x:600,
    y:235,
    width:15,
    height:30,
    level:1,
    type:1,
    lives:1,
    xMin:560,
    xMax:860,
    direction:1
});