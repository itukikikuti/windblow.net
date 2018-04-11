for (var i = 0; i < document.images.length; i++)
{
    var image = document.images[i];
    var a = document.createElement("a");
    a.href = image.src;
    Wrap(image, a);
    var div = document.createElement("div");
    div.className = "modal";
    Wrap(a, div);
    baguetteBox.run(".modal");
}
function Popup(url)
{
    window.open(url, "シェア", "width=500,height=500").focus();
}
function Wrap(element, wrapper)
{
    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);
}
