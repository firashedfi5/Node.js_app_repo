let img = document.querySelector(".up");

window.onscroll = function () {
    console.log(this.scrollY);
    if (this.scrollY >= 500) {
        img.classList.add("show");
    } else {
        img.classList.remove("show");
    }
};

img.onclick = function () {
    window.scrollTo({
        top : 0,
        behavior : "smooth",
    });
};