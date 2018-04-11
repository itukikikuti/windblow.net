for (var i = 0; i < document.images.length; i++)
{
    var image = document.images[i];
    var div = document.createElement("div");
    Wrap(image, div);
    div.width = image.width;
    div.height = image.height;
}
function Popup(url)
{
    window.open(url, "シェア", "width=500,height=500").focus();
}
function Wrap(element, wrapper)
{
    element.parentNode.before(wrapper);
    wrapper.appendChild(element);
}
