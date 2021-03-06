class Text extends Entity{
    text;
    font;
    strokeColor;
    fillColor;
    camera;
    textBaseline="middle";
    textAlign="center";
    constructor(x,y,text="",size="1",fillColor=null,strokeColor=null,life=100,camera=true){
        super(x,y,Game.TEXT_CHANNEL);
        this.text=text;
        this.font="bold " + size + "px Arial";
        this.strokeColor=strokeColor;
        this.fillColor=fillColor;
        this.life=life;
        this.camera=camera;
        this.canInteract=false;
        this.ga=0;
        this.canRemoved=false;
    }
    update(){
        this.draw();
        if(this.life>0)this.life--;
        else if(this.life==0) this.canRemoved=true;
        this.move();
    }
    draw(){
        ctx.textBaseline = this.textBaseline;
        ctx.textAlign = this.textAlign;
        ctx.font = this.font;
        const textX=(this.camera ? Camera.getX(this.x) : this.x);
        const textY=(this.camera ? Camera.getY(this.y) : this.y);
        if (this.strokeColor != null) {
            ctx.strokeStyle = this.strokeColor;
            ctx.strokeText(this.text, textX, textY);
        }
        if (this.fillColor != null) {
            ctx.fillStyle = this.fillColor;
            ctx.fillText(this.text, textX, textY);
        }
    }
}