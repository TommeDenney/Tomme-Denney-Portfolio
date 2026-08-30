/* Image fallback chain: tries .jpg, .jpeg, .png */
var IMG_EXTS = ['.jpg', '.jpeg', '.png'];
function imgFallback(el) {
    var src = el.src;
    var base = src.replace(/\.(jpg|jpeg|png)$/i, '');
    if (!el._triedExts) el._triedExts = [];
    var failedExt = src.match(/\.(jpg|jpeg|png)$/i);
    if (failedExt) el._triedExts.push(failedExt[0].toLowerCase());
    var next = null;
    for (var i = 0; i < IMG_EXTS.length; i++) {
        if (el._triedExts.indexOf(IMG_EXTS[i]) === -1) { next = IMG_EXTS[i]; break; }
    }
    if (next) {
        el.onload = function () { this.classList.add('ok'); };
        el.onerror = function () { imgFallback(this); };
        el.src = base + next;
    } else {
        el.style.display = 'none';
    }
}
function smoothTo(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return false;
}
