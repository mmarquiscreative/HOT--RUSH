//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

// DATA CONTROLLER >>>

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

var dataController = (function(){
    
    //// VARIABLES ////
    var gameSettings, gameData, queue;
    
    gameData = {
        gameSettings: {
            taskFreq: 1,
            hotRushFreq: 1,
            customFreq: 0.5,
            misCommFreq: 0,
            currentId: 1,
            interval: 5000,
            howFast: 3000,
            speedToggle: 1,
            speedLimit: 3000,
            dueLimit: 3,
            dueDateInterval: 10000
        },
        score: 0,
        level: 0,
        gameOver: false,
        paused: false
    }
    
    queue = [];
    
    //// FUNCTIONS ////
    
    // JigJob Obj Constructor
    function JigJob(id, name, status, task, due, howComplete, isCustom, type){
        this.id = id;
        this.name = name;
        this.due = due;
        this.status = status;
        this.task = task;
        this.howComplete = howComplete;
        this.isCustom = isCustom;
        this.type = type;
    };
    
    function togglePause(){
        gameData.paused = !gameData.paused;
    };
    
    function toggleGameOver(){
        gameData.gameOver = !gameData.gameOver;
    }
    
    function updateCurrentId(){
        gameData.gameSettings.currentId += 13;
    }
    
    // update property
    function updateDataProperty(property, newValue){
        if(property){
         
        property = newValue;
       } else {
           console.log('No such data object property as: ' + property);
       };
    };
    
    // create random number within a range (0 to x)
    function randomNumGen(rangeTop){
        var randomNum = Math.round(Math.random() * rangeTop);
        return randomNum;
    };
    
    function probabilityBool(prob){
        var randomBool, threshold, rangeTop;
        rangeTop = 100;
        threshold = Math.round(prob * rangeTop);
        randomBool = randomNumGen(rangeTop) < threshold;
        return randomBool;
    }
    
    function newJigJob(id, name, status, task, due, howComplete, isCustom){
        return new JigJob(id, name, status, task, due, howComplete, isCustom);
        
    }
    
    // New random JigJob
    function pushToQueue(obj){
       // add new jigjob to array.
       queue.push(obj);
         
    };
    
    function updateInterval(howMuch){
        gameData.gameSettings.interval = (randomNumGen(howMuch) + gameData.gameSettings.howFast);
    }
    
    return {
        updateDataProperty: updateDataProperty,
        randomNumGen: randomNumGen,
        probabilityBool: probabilityBool,
        queue: queue,
        pushToQueue: pushToQueue,
        updateCurrentId: updateCurrentId,
        newJigJob: newJigJob,
        gameSettings: gameSettings,
        gameData: gameData,
        updateInterval: updateInterval,
        togglePaused: togglePause,
        toggleGameOver: toggleGameOver
    }
})();



//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

// UI CONTROLLER >>>

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

var UIController = (function(){
    
    //// VARIABLES ////
    var gameStrings = {
        status: ['', 'HOT', 'RUSH'],
        task: ['Design First Draft', 'Member Edit', 'Finalize File', 'Post-Final Edits', 'Finalize File 2'],
        jobType: ['DRNP', 'DRNI', 'DRDM', 'DRMAD', 'DROAD', 'COL_BC', 'GR_Flyer', 'DBHTML'],
        member: ['Amdahl', 'Ballard', 'Tudor', 'Hutto', 'Strabbing', 'Young', 'McBride', 'Stewart']
    }
    var htmlStrings = {
        ids: {
            queueBox: '#queueBox',
            gameArea: '#gameArea',
            scoreBox: '#scoreBox',
            score: '#score',
            alertDiv: '#alertDiv',
            pauseButton: '#pauseButton'
            
        },
        classes: {
            jobRow: 'jobRow',
            dueDate: '.dueDate',
            greyOut: 'greyOut'
        },
        innerContent: {
            rushHotAlert: '<div class="scroll-right flashing" id=""><p colspan="3"><strong><em>H O T R U S H ! — — — H O T R U S H ! — — — H O T R U S H !</em></strong></p></div>',
            pausePaused: '<h4>Resume</h4>',
            pauseUnpaused: '<h4>Pause</h4>'
        }
    }
    
    //// FUNCTIONS ////
    
    
    return {
       gameStrings: gameStrings,
        htmlStrings: htmlStrings
    }
})();



//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

// APP CONTROLLER >>>

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

var appController = (function(dataCtrl, UICtrl){
    
    //// VARIABLES ////
    
    
    //// FUNCTIONS ////
    
    function randomNumGen(rangeTop){
        var randomNum = Math.round(Math.random() * rangeTop);
        return randomNum;
    };
    
    function probabilityBool(prob){
        var randomBool, threshold, rangeTop;
        rangeTop = 100;
        threshold = Math.round(prob * rangeTop);
        randomBool = randomNumGen(rangeTop) < threshold;
        return randomBool;
    };
    
    function newJobRow(id, name, task, due){
        document.querySelector(UICtrl.htmlStrings.ids.queueBox).innerHTML += ('<tr class="jobRow" id="' + id + '"><td>' + name + '</td><td>' + task + '</td><td class="dueDate">' + due + '</td></tr>');
    };
    
    function genIdNum(){
        dataCtrl.updateCurrentId();
       return (17000 + dataCtrl.gameData.gameSettings.currentId);
    };
    
    function genTempType(){
       return UICtrl.gameStrings.jobType[dataCtrl.randomNumGen(7)];
    };
    
    function genStatusNum(){
        return UICtrl.gameStrings.status[randomNumGen(2)];
    };
    
    function genDueNum(){
        return randomNumGen(2) + dataCtrl.gameData.gameSettings.dueLimit;
    };
    
    function genMember(){
        return UICtrl.gameStrings.member[dataCtrl.randomNumGen(7)];
    };
    
    function genCustomBool(){
        var testBool;
        
        testBool = probabilityBool(dataCtrl.gameData.gameSettings.customFreq);
        
        if(testBool){
            return '_CUSTOM';
        } else {
            return '';
        };
        
    };
    
    function genJobName(id, type, customString, member){
       return (id + '_' + type + customString + '_' + member);
    };
    
    function evalDueNum(newDueNum){
        console.log('evalDueNum ' + newDueNum);
        if (newDueNum <= 0){
            dataCtrl.toggleGameOver();
            console.log('game over');
            return -1;
        } else if (newDueNum > 0){
            return newDueNum;
        }
    };
    
    function decreaseDueNum(dueNum){
       var tempNum = parseInt(dueNum) - 1;
        var newNum = evalDueNum(tempNum);
       return newNum;
    };
    
    function endGame(){
        
        // grey out box
        document.querySelector(UICtrl.htmlStrings.ids.gameArea).classList.add(UICtrl.htmlStrings.classes.greyOut);
    
        // game over set up
        console.log('endGame runs');
    };
    
    function updateDueDate(){
        console.log('updateDueDate');
        var jobNodes = document.querySelectorAll(UICtrl.htmlStrings.classes.dueDate);
    console.log(jobNodes);
    jobNodes.forEach(function(cur, el){
        
        var newDueDate = decreaseDueNum(cur.textContent);
        
        if (newDueDate === -1){
            cur.textContent = 0;
            
            endGame();
           
        } else {
            cur.textContent = newDueDate;
            if (newDueDate === 2){
                 cur.parentNode.className = 'jobRow twoLeft';
            } else if (newDueDate === 1){
                cur.parentNode.className = 'jobRow oneLeft';
            };
    
    };
    });
    };
    
    function addNewJob(){
        var tempId, tempName, tempType, tempMember, tempStatus, tempIsCustom, tempCustomString;
        if (!dataCtrl.gameData.paused){
        // 1. generate random job id
        tempId = genIdNum();
        
        // 2. generate temptype string
        tempType = genTempType();
        
        // 3. random status num (0 to 2)
        tempStatus = genStatusNum();
        
        // 4. random due
        tempDue = genDueNum();
        
        // 5. random member
        tempMember = genMember();
            
        // 6. random bool for isCustom
        tempIsCustom = genCustomBool();
        
        // 7. create name
        tempName = genJobName(tempId, tempType, tempIsCustom, tempMember);        console.log(tempName);
        
        // 8. random task
        console.log(tempType);
        // why wont tempType integrate into obj    
            
            
        var tempObj = dataCtrl.newJigJob(tempId, tempName, tempStatus, UICtrl.gameStrings.task[0], tempDue, 0, tempIsCustom, toString(tempType));
            
        dataCtrl.pushToQueue(tempObj);
                console.log(tempType);
        };
        
        console.log(dataCtrl.queue);
        // 9. Create new job row.
        newJobRow(tempId, tempName, UICtrl.gameStrings.task[0], tempDue);
        };
        

    
    function dueDateClock(){
        setInterval(updateDueDate, dataCtrl.gameData.gameSettings.dueDateInterval);
    }
    
    // looping function, random intervals between intervals
    function loop(someFunc){
        if (!dataCtrl.gameData.paused){
        var randomNum = ((Math.round(Math.random() * dataCtrl.gameData.gameSettings.howFast) / dataCtrl.gameData.gameSettings.speedToggle) + dataCtrl.gameData.gameSettings.speedLimit);
        
            setTimeout(function(){
            console.log(randomNum);
            someFunc();
            if(!dataCtrl.gameData.gameOver){
                loop(someFunc);
            };
        }, randomNum);
    };
    };
    
    function gameClick(){
        var targetID, targetClass;
        
       targetClass = event.target.parentNode.className;
        console.log(targetClass);

        if (targetClass === UICtrl.htmlStrings.classes.jobRow){
            startJob(event);
        } else {
            return;
        };
    };
    
   function removeJobRow(event){
       // 1. timed overlay for progress
       
       
       // 2. remove html from queuebox
       console.log(event.target.parentNode);
       event.target.parentNode.outerHTML = '';
       
   }
    
    function howFastComplete(someID){
        console.log('howfastcomplete running');
        dataCtrl.queue.forEach(function(object, cur, index){
            console.log(object);
            if (object.id === parseInt(someID)){
                 console.log('cur' + object.JigJob.type);
                
                var whatType = dataCtrl.queue[index].type;
                console.log('what type is ' + whatType);
            } else {
                console.log('couldnt find matching id');
            };
        });
    };
    
    function matchID(someID){
        
         dataCtrl.queue.forEach(function(object, cur, index){
            console.log(parseInt(someID));
             console.log(object.id);
            if (object.id === parseInt(someID)){
                 console.log(dataCtrl.queue);
                dataCtrl.queue.splice(index, 1);
                console.log(dataCtrl.queue);
            } else {
                console.log('couldnt find matching id');
            };
        });
    };
        
    function updateScore(){
        // update score object
        dataCtrl.gameData.score++;
        console.log(dataCtrl.gameData.score);
        
        // update score html
        document.querySelector(UICtrl.htmlStrings.ids.score).textContent = dataCtrl.gameData.score;  
    }   
    
    function startJob(event){
        var targetID, targetClass;
        targetID = event.target.parentNode.id;
        console.log('startJob started ' + targetID);
        howFastComplete(targetID);
        matchID(targetID);
        
        // green complete bar
        
        event.target.parentNode.classList.remove('jobRow');
        event.target.parentNode.classList.add('jobCompleteFast');
        
        setTimeout(function(){
            removeJobRow(event);
            updateScore();
        }, 3000);
        
        
    };
    
    function hotRushAlert(){
       if (document.querySelector(UICtrl.htmlStrings.ids.alertDiv).innerHTML === ''){
           document.querySelector(UICtrl.htmlStrings.ids.alertDiv).innerHTML = UICtrl.htmlStrings.innerContent.rushHotAlert;
    } else {
        document.querySelector(UICtrl.htmlStrings.ids.alertDiv).innerHTML = '';
    };
    };
    
    function pause(){
        console.log('started pause. paused is ' + dataCtrl.gameData.paused);
        if (!dataCtrl.gameData.paused){       
        
        // pause job generation    
        dataCtrl.togglePaused();
        
        // Change button text
        document.querySelector(UICtrl.htmlStrings.ids.pauseButton).innerHTML = UICtrl.htmlStrings.innerContent.pausePaused;
            
        } else if (dataCtrl.gameData.paused){
            
        // resume job generation
        dataCtrl.togglePaused();
            
        // Change button text
        document.querySelector(UICtrl.htmlStrings.ids.pauseButton).innerHTML = UICtrl.htmlStrings.innerContent.pauseUnpaused;
            loop(addNewJob);
        } 
    }
    
    function innit(){
        // add eventlistener
        document.querySelector(UICtrl.htmlStrings.ids.gameArea).addEventListener('click', gameClick);
        
        document.querySelector(UICtrl.htmlStrings.ids.pauseButton).addEventListener('click', pause);
        
        // Generate random interval
        loop(addNewJob);
        
        // start due date clock
        dueDateClock();
        
    };
    
    return {
       innit: innit
    };
})(dataController, UIController);

appController.innit();






//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

// CODE Tools >>>

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////


//// XXXXXXXXXXX ////


// START... //// xxTITLExx xxDescriptionxx //////////////// M.M.

// ...END //// xxTITLExx xxDescriptionxx //////////////// M.M.

