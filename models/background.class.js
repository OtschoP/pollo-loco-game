
class Background {
    img;
    y = 130
    x = 10
    width = 700
    height = 350

    loadImage(path) {
        this.img = new Image(); // this,img = document.getElementById('img') <img id="image" src>
        this.img.src = path;
    }

}