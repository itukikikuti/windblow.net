for (var image in document.images)
{
    Wrap(image, document.createElement("div"));
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
