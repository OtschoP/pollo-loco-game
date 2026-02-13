
class Background {
    img;
    y = 0
    x = 0
    width = 720
    height = 480

    loadImage(path) {
        this.img = new Image(); // this,img = document.getElementById('img') <img id="image" src>
        this.img.src = path;
    }

}