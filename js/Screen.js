function startFS(element) {
    if(element.requestFullScreen) {
        element.requestFullScreen();
    } else if(element.webkitRequestFullScreen ) {
        element.webkitRequestFullScreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen(); // IE
    }
    canvas.width = screen.width;
    canvas.height = screen.height;
}

class Screen {
    static isMobile = false;
    static selectMagic = null;

    static menuScreen() {
        Game.restartGame();

        let ashSpray = new MapBlock(-100,-100,0,0,"black",Game.BUTTON_CHENNEL);
        ashSpray.canAct=true;
        ashSpray.canMove=false;
        ashSpray.addAction(1,1000000,function(){
            if(Game.time%10==0){
                let r = Math.random()*canvas.width;
                let ash=new Particle(0,r,0);
                ash.life=200;
                ash.vy-=2;
            }
        });

        var startButton = new Button((canvas.width - 300)/2, (canvas.height-100)/2, 300, 100);
        startButton.canAct=true;
        startButton.code = function () { 
            for(let i=0; i<30; i++){
                for(let j=0; j<10; j++){
                    let e = new Particle(2, startButton.x+i*10, startButton.y+j*10);
                    e.ga=0;
                }
            }
            startButton.addAction(50,50,function(){Screen.selectScreen();});
            startButton.drawCode=function(){};
            startFS(canvas);
        };
        startButton.drawOption(null, "black", "START", 80, "black");
    }

    static selectScreen() {
        Game.time = 0;
        Game.restartGame();

        let ashSpray = new MapBlock(-100,-100,0,0,"black",Game.BUTTON_CHENNEL);
        ashSpray.canAct=true;
        ashSpray.canMove=false;
        ashSpray.addAction(1,1000000,function(){
            if(Game.time%10==0){
                let r = Math.random()*canvas.width;
                let ash=new Particle(0,r,0);
                ash.life=200;
                ash.vy-=2;
            }
        });

        let backButton = new Button(0, 0, 80, 80);
        backButton.code = function () { Screen.menuScreen() };
        backButton.drawOption(null, null, "<", 80, "black");

        let mobileButton = new Button(canvas.width - 110, canvas.height - 50, 100, 40);
        if (Screen.isMobile) mobileButton.temp.push("to PC");
        else mobileButton.temp.push("to mobile");
        mobileButton.code = function () {
            if (Screen.isMobile) { Screen.isMobile = false; mobileButton.temp[0] = "to mobile"; }
            else { Screen.isMobile = true; mobileButton.temp[0] = "to PC"; }
        };
        //mobileButton.drawOption(null, "black", mobileButton.temp[0], 30, "black");
        mobileButton.drawCode=function(){
            ctx.fillStyle="black";
            ctx.strokeStyle="black";
            ctx.strokeRect(mobileButton.x, mobileButton.y, mobileButton.w, mobileButton.h);
            ctx.font = "bold 20px Arial";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText(mobileButton.temp[0], mobileButton.x + 50, mobileButton.y + 22);
        }

        let magicButton = new Button(canvas.width - 210, 10, 200, 50)
        magicButton.code = function () { Screen.selectMagicScreen(); };

        new Button((canvas.width - 200) * 0.5, 0, 200, 10);
        for (let i = 1; i <= Level.playerLevel; i++) {
            let levelButton = new Button((canvas.width - 200) * 0.5, 250 + i * 60, 200, 59);
            levelButton.code = function () { Screen.gameScreen(); Level.makeStage(i); };
            levelButton.drawOption("white", "black", "LEVEL" + i, 40, "black");
            levelButton.ga = 0.5;
        }
        magicButton.drawOption(null, "black", "select magic", 30, "black");
    }

    static selectMagicScreen() {
        Game.time = 0;
        Game.restartGame();
        Magic.clearCoolTime();
        let backButton = new Button(0, 0, 80, 80);
        backButton.code = function () { Screen.selectScreen() };
        backButton.drawOption(null, null, "<", 80, "black");



        let key = ['Q', 'W', 'E', 'R'];
        let keyButtons = new Array(4);
        for (let i = 0; i < 4; i++) {
            let temp = new Button(120, 50 + 110 * i, 200, 50);

            let keyButton = new Button(10, 100 + 110 * i, 100, 100)
            keyButton.code = function () {
                if (Screen.selectMagic != null && Screen.selectMagic.temp[1] != i) {
                    if (keyButton.temp[0] != null) { //키버튼에 마법이 있으면
                        keyButton.temp[0].x = 400;
                        keyButton.temp[0].y = 600;
                        (keyButton.temp[0]).temp[1] = null;//마법 기록 삭제
                    }
                    if (Screen.selectMagic.temp[1] != null) { //선택한 마법에 이미 키가 있으면
                        Magic.skillNum[Screen.selectMagic.temp[1]] = 0;
                        keyButtons[Screen.selectMagic.temp[1]].temp[0] = null;//이전 키버튼의 선택 기록 삭제
                    }
                    Screen.selectMagic.x = 120; Screen.selectMagic.y = 100 + 110 * i;
                    Magic.skillNum[i] = Screen.selectMagic.temp[0];
                    Screen.selectMagic.temp[1] = i;
                    keyButton.temp[0] = Screen.selectMagic;
                    Screen.selectMagic = null;
                }
                console.log(Magic.skillNum);
            };
            keyButton.drawOption("rgb(88, 88, 88)", "black", key[i], 80, "black");

            keyButtons[i] = keyButton;
            keyButton.temp.push(null); //temp[0] 은 선택된 마법을 의미
        }
        new Button(400, 0, 200, 100);
        for (let i = 1; i < Magic.basicMagic.length; i++) {
            let magicButton = new Button(400, 100 + 50 * i, 200, 40);
            magicButton.code = function () { Screen.selectMagic = magicButton; new (Magic.basicMagic[i][1]); };
            magicButton.drawOption("rgb(121, 140, 205)", "black", Magic.basicMagic[i][0], 30, "black");
            magicButton.temp.push(i); //temp[0]=Magic.basicMagic
            magicButton.temp.push(null); //temp[1] is keyButton index
            magicButton.ga = 0.5;

            let keyIndex = Magic.skillNum.findIndex(function (e) { return e == i; });
            if (keyIndex >= 0) {
                Screen.selectMagic = magicButton;
                let clickE = new Block(0, 0, 0, 0);
                clickE.life = 1;
                clickE.collisionLevel = -8;
                clickE.canMove = false;
                keyButtons[keyIndex].collisionHandler(clickE);
            }
        }

        let selectMagigButton = new Button(0, 0, 0, 0);
        selectMagigButton.drawCode = function () {
            if (Screen.selectMagic != null) {
                ctx.strokeStyle = "white";
                ctx.strokeRect(Screen.selectMagic.x, Screen.selectMagic.y, Screen.selectMagic.w, Screen.selectMagic.h);
            }
        }

        //simulation
        new MapBlock(700, 400, 500, 200, "rgb(35, 35, 35)");
        Game.p = new Player(720, 0);
        let monster = new Monster(0, 1100, 0);
        monster.life = 100000;
        monster.action = [];

    }

    static gameScreen() {
        Game.time = 0;
        Game.restartGame();
        Magic.clearCoolTime();

        let backButton = new Button(0, 0, 80, 80);
        backButton.code = function () { Screen.selectScreen() };
        backButton.drawOption(null, null, "<", 80, "black");



        new MapBlock(-50, 0, 50, canvas.height); //left
        new MapBlock(canvas.width, 0, 50, canvas.height);//right
        new MapBlock(0, -50, canvas.width, 50);//top
        new MapBlock(-200, canvas.height - 150, canvas.width + 400, 20, "#2B650D");//bottom
        new MapBlock(0, canvas.height - 130, canvas.width, 130, "#54341E");

        if (Screen.isMobile) {
            let leftButton = new Button(10, canvas.height - 110, 100, 100);
            leftButton.code = function () { Game.p.moveFlag = true; Game.p.isRight = false; };
            leftButton.drawOption("rgb(61, 61, 61)", "black", "<", 100, "black");
            let upButton = new Button(120, canvas.height - 110, 100, 100);
            upButton.code = function () { Game.p.jump()};
            upButton.drawOption("rgb(61, 61, 61)", "black", "^", 100, "black");
            let rightButton = new Button(230, canvas.height - 110, 100, 100);
            rightButton.code = function () { Game.p.moveFlag = true; Game.p.isRight = true; };
            rightButton.drawOption("rgb(61, 61, 61)", "black", ">", 100, "black");

            let keys=["Q","W","E","R"];
            for(let i=0; i<4; i++){
                let keyButton = new Button(canvas.width-430+i*110,canvas.height-110,100,100);
                keyButton.code=function(){Magic.doSkill(i);};
                keyButton.drawCode=function(){
                    ctx.fillStyle="rgb(61, 61, 61)";
                    ctx.fillRect(keyButton.x,keyButton.y,keyButton.w,keyButton.h);
                    ctx.strokeStyle="black";
                    ctx.strokeRect(keyButton.x,keyButton.y,keyButton.w,keyButton.h);
                    ctx.fillStyle="black";
                    ctx.font = "bold 80px Arial";
                    ctx.textBaseline = "middle";
                    ctx.textAlign = "center";
                    ctx.fillText(keys[i],keyButton.x+50,keyButton.y+70);
                    ctx.fillStyle="rgb(121, 140, 205)";
                    ctx.font = "bold 20px Arial";
                    ctx.fillText(Magic.basicMagic[Magic.skillNum[i]][0],keyButton.x+50,keyButton.y+15);
                }
            }
        }
        Game.p = new Player(10, canvas.height - 460);

        
    }
}