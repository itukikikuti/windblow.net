for (var i = 0; i < document.images.length; i++)
{
    Wrap(document.images[i], document.createElement("div"));
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
