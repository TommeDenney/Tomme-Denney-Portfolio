/**
 * The still that follows the pointer across an index row.
 *
 * Shared by / and /work. Pure decoration, so it is skipped entirely where
 * there is no pointer to follow — on touch the row renders its own thumbnail.
 */
(function () {
    var peek = document.getElementById('peek');
    if (!peek || !window.matchMedia('(hover: hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var img = peek.querySelector('img');
    var raf = null;
    var x = 0;
    var y = 0;

    function move() {
        raf = null;
        // left/top rather than transform: the transform is carrying the
        // scale-in transition and overwriting it here would kill the animation.
        peek.style.left = x + 'px';
        peek.style.top = y + 'px';
    }

    document.querySelectorAll('.index-link[data-peek]').forEach(function (link) {
        var src = link.dataset.peek;
        if (!src) return;

        link.addEventListener('mouseenter', function () {
            img.src = src;
            peek.classList.add('on');
        });
        link.addEventListener('mouseleave', function () {
            peek.classList.remove('on');
        });
        link.addEventListener('mousemove', function (e) {
            x = e.clientX + 40;
            y = e.clientY;
            if (!raf) raf = requestAnimationFrame(move);
        });
    });
})();
