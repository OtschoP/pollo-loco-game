class MoveableObject {
    x = 100;
    y = 250;
    img;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image(); // this,img = document.getElementById('img') <img id="image" src>
        this.img.src = path;
    }

    moveRight() {
        console.log('Moving right');
    }

    moveLeft(){
        
    }
}