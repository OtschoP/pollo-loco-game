class World {
    character = new Character();
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken
    ];
    clouds = [
        new Cloud()
    ]

    air = new Air();

    layerone = new Layerone();
    layertwo = new Layertwo();


    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


        this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.width, this.character.height);

        this.ctx.drawImage(this.air.img, this.air.x, this.air.y, this.air.width, this.air.height);
        this.ctx.drawImage(this.layerone.img, this.layerone.x, this.layerone.y, this.layerone.width, this.layerone.height);
        this.ctx.drawImage(this.layertwo.img, this.layertwo.x, this.layertwo.y, this.layertwo.width, this.layertwo.height);


        this.enemies.forEach(enemy => {
            this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
        });
        this.clouds.forEach(cloud => {
            this.ctx.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height);
        });


        // draw wird immer wieder aufgerufen
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }
}