const EPS = 1e-1;

function isEq(a, b) {
    if (Math.abs(a - b) < EPS) {
        return true;
    }
    return false;
}

function isGr(a, b) {
    if (a - b > EPS) {
        return true;
    }
    return false;
}

function isLe(a, b) {
    if (isGr(b, a)) {
        return true;
    }
    return false;
}

function diffAngle(ax, ay, bx, by) {
    let ang = atan2(ax * by - ay * bx, ax * bx + ay * by);
    return ang;
}
