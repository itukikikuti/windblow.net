for (var i = 0; i < document.images.length; i++)
{
    document.images[i].class = "modal";
    baguetteBox.run(".modal");
}
function Popup(url)
{
    window.open(url, "シェア", "width=500,height=500").focus();
}
