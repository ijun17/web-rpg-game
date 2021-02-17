class Player extends Entity{
    lv=1;
    mp=40;
    speed=4; 
    magicList=[];
    coolTime=[0,0,0,0];
    isRight=true;
    moveFlag=false;
    canJump=true;
    totalDamage=0;
    damageTick=0;

    constructor(x,y,lv=1,channelLevel=Game.PHYSICS_CHANNEL){
        super(x,y,channelLevel);
        //default
        this.w=30;
        this.h=60;
        this.ga=-0.2;
        this.friction=0.4;
        this.inv_mass=1;
        //magic
        for(let i=0; i<4; i++){this.magicList[i]=(Magic.skillNum[i]>=0?Magic.magicList[Magic.skillNum[i]]:null);}
        //lv
        this.lv=Number(lv);
        this.life=this.lv*10000;
        this.mp=this.lv*20000;
        //ani
        let p=this;
        this.animation = new Animation("resource/player/"+`player.png`,30,60,[1,1],function(){
            if(p.moveFlag)return 1;
            else return 0;
        });
        this.draw=Player.getDraw();
    }

    update() {
        if (this.canDraw) this.draw();
        if (this.canAct) this.act();
        if (this.canInteract) this.interact();
        if(this.canMove)this.move();
        //damage
        if (this.totalDamage > 0) {
            new Text(this.x + this.w / 2, this.y - 50,this.totalDamage,30,"red","black",40);
            this.life -= this.totalDamage;
            this.totalDamage = 0;
            this.damageTick=20;
        }
        if(this.mp<this.lv*20000)this.mp+=this.lv;
        else this.mp=this.lv*20000;
        if(this.damageTick>0)this.damageTick--;
    }
    static getDraw(){
        return function(){
            this.animation.draw(Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h),this.isRight);
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.font="bold 15px Arial";
            ctx.fillStyle="black";
            Camera.fillText("hp:"+(Math.floor(this.life)),this.x+this.w/2,this.y-20);
        }
    }
    
    move(){
        this.x += this.vx;
        this.y -= this.vy;
        this.vy += this.ga;
        if (this.moveFlag) {
            if (this.isRight && this.vx <= this.speed) this.vx++;
            else if (!this.isRight && this.vx >= -this.speed) this.vx--;
        }
    }

    jump(){
        if(this.canJump){
            this.vy=this.speed+1;
            this.canJump=false;
        }
    }

    collisionHandler(e,ct){
        if(ct=='D'&&!this.canJump)this.canJump=true;
        else if(ct==null&&e instanceof MapBlock)this.giveDamage(10000);
    }

    giveDamage(d) {
        if(this.damageTick==0){
            this.totalDamage += Math.floor(d);
            Camera.vibrate((d<4000 ? d/200 : 20)+5);
        }
    }

    castMagic(num){
        //num 0:q 1:w 2:e 3:r
        if(this.magicList[num]!==null&&this.coolTime[num]<Game.time&&this.mp>this.magicList[num][3]){
            let magicEffect = new Particle(5, this.x+this.w/2-this.h/2, this.y);
            magicEffect.w=this.h;
            magicEffect.h=this.h;
            this.magicList[num][1](this);
            this.coolTime[num]=this.magicList[num][2]+Game.time;
            this.mp-=this.magicList[num][3];
        }
    }
}