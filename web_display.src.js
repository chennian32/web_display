const Shape = {
    PointShape: 0,
    LineShape: 1,
    HLineShape: 2,
    VLineShape: 3,
    Rect1Shape: 4,
    Rect2Shape: 5,
    CircleShape: 6,
    EllipseShape: 7,
    ArcShape: 8,
    PolygonShape: 9,
    AnyShape: 10,
    PolygonLineShape: 11,
    AnyLineShape: 12,
    Pointshape: 13,
    RegionShape: 14,
    CircleRingShape: 15,
    EllipseRingShape: 16
};
const DrawState = {
    None: 0,
    Draw: 1,
    Modify: 2,
    MoveROI: 3,
    StartMoveROI: 4,
    Measure: 5
};
const ImageMode = {
    FitToWindow: 0,
    FitToWidth: 1,
    FitToHeight: 2,
    FitRatioAuto: 3
};
const AlignMode = {
    CenterAlignMode: 0,
    TopLeftAlignMode: 1
};
class Information {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.imageWidth = w;
        this.imageHeight = h;
    }
}
class Point {
    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }
    x() {
        return this._x;
    }
    y() {
        return this._y;
    }
    setX(x) {
        this._x = x;
    }
    setY(y) {
        this._y = y;
    }
    translate(t) {
        this._x += t.x();
        this._y += t.y();
    }
}
class Size {
    constructor(w = 0, h = 0) {
        this._width = w;
        this._height = h;
    }
    width() {
        return this._width;
    }
    height() {
        return this._height;
    }
    isEmpty() {
        return this._width <= 0 || this._height <= 0;
    }
    setWidth(w) {
        this._width = w;
    }
    setHeight(h) {
        this._height = h;
    }
}
class Line {
    constructor(t = new Point, e = new Point) {
        this.sx = t.x();
        this.sy = t.y();
        this.ex = e.x();
        this.ey = e.y();
    }
    setStartPoint(t) {
        this.sx = t.x();
        this.sy = t.y();
    }
    setEndPoint(t) {
        this.ex = t.x();
        this.ey = t.y();
    }
    startPoint() {
        return new Point(this.sx, this.sy)
    }
    endPoint() {
        return new Point(this.ex, this.ey)
    }
    distance() {
        let t = this.ex - this.sx;
        let e = this.ey - this.sy;
        return Math.sqrt(t * t + e * e);
    }
    offsetX() {
        return Math.abs(this.ex - this.sx);
    }
    offsetY() {
        return Math.abs(this.ey - this.sy);
    }
    isEmpty() {
        return this.offsetX() === 0 && this.offsetY() === 0;
    }
    boundingRect() {
        let t = this.ex > this.sx ? this.sx : this.ex;
        let e = this.ey > this.sy ? this.sy : this.ey;
        let i = Math.abs(this.ex - this.sx);
        let s = Math.abs(this.ey - this.sy);
        return new Rect(t, e, i, s)
    }
}
class Rect {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
    }
    topLeft() {
        return new Point(this._x, this._y)
    }
    bottomRight() {
        return new Point(this._x + this._width, this._y + this._height);
    }
    topRight() {
        return new Point(this._x + this._width, this._y);
    }
    bottomLeft() {
        return new Point(this._x, this._y + this._height);
    }
    setTopLeft(t) {
        let e = t;
        let i = this.bottomRight();
        let s = new Line(e, i);
        let h = s.boundingRect();
        this._x = h.x(); this._y = h.y();
        this._width = h.width();
        this._height = h.height();
    }
    setBottomRight(t) {
        let e = this.topLeft();
        let i = t; let s = new Line(e, i);
        let h = s.boundingRect();
        this._x = h.x();
        this._y = h.y();
        this._width = h.width();
        this._height = h.height();
    }

    setTopRight(t) {
        let e = new Point(this._x, t.y());
        let i = new Point(t.x(), this._y + this._height);
        let s = new Line(e, i);
        let h = s.boundingRect();
        this._x = h.x();
        this._y = h.y();
        this._width = h.width();
        this._height = h.height()
    }
    setBottomLeft(t) {
        let e = new Point(t.x(), this._y);
        let i = new Point(this._x + this._width, t.y());
        let s = new Line(e, i);
        let h = s.boundingRect();
        this._x = h.x();
        this._y = h.y();
        this._width = h.width();
        this._height = h.height();
    }
    size() {
        return new Size(this._width, this._height);
    }
    setSize(w, h) {
        this._width = w;
        this._height = h;
    }
    isEmpty() {
        return this._width <= 0 || this._height <= 0;
    }
    x() {
        return this._x;
    }
    y() {
        return this._y;
    }
    width() {
        return this._width;
    }
    height() {
        return this._height;
    }
    setWidth(w) {
        this._width = w;
    }
    setHeight(h) {
        this._height = h;
    }
    setX(x) {
        this._x = x;
    }
    setY(y) {
        this._y = y;
    }
    center() {
        return new Point(this._x + this._width / 2, this._y + this._height / 2);
    }
    translate(x, y) {
        this._x += x;
        this._y += y;
    }
    contains(t) {
        let e = this._x;
        let i = this._x;
        if (this._width < 0)
            e += this._width;
        else i += this._width;
        if (e == i)
            return false;
        if (t.x() < e || t.x() > i)
            return false;
        let s = this._y;
        let h = this._y;
        if (this._height < 0)
            s += this._height;
        else h += this._height;
        if (s == h)
            return false;
        if (t.y() < s || t.y() > h)
            return false;
        return true;
    }
    intersects(t) {
        let e = this._x;
        let i = this._x;
        if (this._width < 0)
            e += this._width;
        else
            i += this._width;
        if (e == i)
            return false;
        let s = t.x();
        let h = t.x();
        if (t.width() < 0)
            s += t.width();
        else h += t.width();
        if (s == h)
            return false;
        if (e >= h || s >= i)
            return false;
        let a = this._y;
        let n = this._y;
        if (this._height < 0)
            a += this._height;
        else
            n += this._height;
        if (a == n)
            return false;
        let r = t.y();
        let o = t.y();
        if (t.height() < 0)
            r += t.height();
        else o += t.height();
        if (r == o)
            return false;
        if (a >= o || r >= n)
            return false;
        return true;
    }
}
class Matrix {
    constructor(m, n) {
        if (Array.isArray(m)) {
            this.check(m);
            this._arr = m;
        } else {
            if (m >= 1 && n >= 1) {
                this._arr = new Array(m).fill(0).map(() => new Array(n).fill(0));
            } else {
                throw new Error("m & n must le 1");
            }
        }
    }
    static eye(e) {
        const i = new Matrix(e, e);
        for (let t = 0; t < e; t++) {
            i.arr[t][t] = 1
        }
        return i;
    }
    static zero(t) {
        const e = new Matrix(t, t);
        return e;
    }
    get arr() {
        return this._arr;
    }
    get m() {
        return this._arr.length;
    }
    get n() {
        return this._arr[0].length;
    }
    get T() {
        const i = new Array(this.n);
        for (let e = 0; e < this.n; e++) {
            i[e] = new Array(this.m);
            for (let t = 0; t < this.m; t++) {
                i[e][t] = this._arr[t][e];
            }
        }
        return new Matrix(i);
    }
    get determinant() {
        if (this.m !== this.n) {
            throw new Error("determinant must be a square");
        }
        const s = this.m; let t = 0; if (s > 3) {
            for (let i = 0; i < s; i++) {
                const h = new Matrix(s - 1, s - 1);
                for (let e = 0; e < s - 1; e++) {
                    for (let t = 0; t < s - 1; t++) {
                        if (t < i) {
                            h.arr[e][t] = this._arr[e + 1][t];
                        } else {
                            h.arr[e][t] = this._arr[e + 1][t + 1];
                        }
                    }
                }
                t += this._arr[0][i] * Math.pow(-1, 0 + i) * h.determinant;
            }
        }
        else if (s === 3) {
            t = this._arr[0][0] * this._arr[1][1] * this._arr[2][2] + this._arr[0][1] *
                this._arr[1][2] * this._arr[2][0] + this._arr[0][2] * this._arr[1][0] *
                this._arr[2][1] - this._arr[0][2] * this._arr[1][1] * this._arr[2][0]
                - this._arr[0][1] * this._arr[1][0] * this._arr[2][2] - this._arr[0][0]
                * this._arr[1][2] * this._arr[2][1];
        } else if (s === 2) {
            t = this._arr[0][0] * this._arr[1][1] - this._arr[0][1] * this._arr[1][0];
        }
        else if (s === 1) {
            t = this._arr[0][0];
        }
        return t;
    }
    get det() {
        return this.determinant;
    }
    get H() {
        if (this.m !== this.n) {
            throw new Error("determinant must be a square");
        }
        let i = this.arr.length;
        if (i === 1) {
            return new Matrix([[1]]);
        }
        const s = new Matrix(i, i);
        for (let t = 0; t < i; t++) {
            for (let e = 0; e < i; e++) {
                const h = this.clone();
                h.arr.splice(t, 1);
                h.arr.map(t => t.splice(e, 1));
                s.arr[t][e] = Math.pow(-1, t + e) * h.determinant;
            }
        }
        return s.T;
    }
    get I() {
        if (this.m !== this.n) {
            throw new Error("determinant must be a square");
        }
        let i = this.H;
        for (let e = 0; e < this.m; e++) {
            for (let t = 0; t < this.n; t++) {
                i.arr[e][t] /= this.determinant;
            }
        }
        return i;
    }
    check(t) {
        if (!Array.isArray(t)) {
            throw new Error("paramater not an array");
        }
        if (t.length == 0) {
            throw new Error("paramater is an empty array");
        }
        if (!Array.isArray(t[0])) {
            throw new Error("paramater need a two dimensional matrix");
        }
        const e = t[0].length;
        for (const i of t) {
            if (i.length !== e) {
                throw new Error("matrix is invalid");
            }
            for (const s of i) {
                if (isNaN(s)) {
                    throw new Error("matrix value should be number");
                }
            }
        }
    }
    clone() {
        const i = new Array(this.m);
        for (let e = 0; e < this.m; e++) {
            i[e] = new Array(this.n);
            for (let t = 0; t < this.n; t++) {
                i[e][t] = this._arr[e][t];
            }
        }
        return new Matrix(i);
    }
    col(e) {
        const i = [];
        this._arr.forEach(t => { i.push(t[e]); });
        return i;
    }
    row(t) {
        return this._arr[t];
    }
    plus(i) {
        if (this.m !== i.m || this.n !== i.n) {
            throw new Error("two matrixs must be same");
        }
        const s = new Array(this.m);
        for (let e = 0; e < this.m; e++) {
            s[e] = new Array(this.n);
            for (let t = 0; t < this.n; t++) {
                s[e][t] = this._arr[e][t] + i.arr[e][t];
            }
        }
        return new Matrix(s);
    }
    minus(i) {
        if (this.m !== i.m || this.n !== i.n) {
            throw new Error("two matrixs must be same");
        }
        const s = new Array(this.m);
        for (let e = 0; e < this.m; e++) {
            s[e] = new Array(this.n);
            for (let t = 0; t < this.n; t++) {
                s[e][t] = this._arr[e][t] - i.arr[e][t];
            }
        }
        return new Matrix(s);
    }
    multiply(s) {
        if (!isNaN(s)) {
            return new Matrix(this.arr.map(t => t.map(t => t * s)));
        }
        if (this.n !== s.m) {
            throw new Error("this n of matrix must equal to multipy m of matrix");
        }
        const h = new Array(this.m);
        for (let i = 0; i < this.m; i++) {
            h[i] = new Array(s.n);
            for (let e = 0; e < s.n; e++) {
                h[i][e] = 0;
                for (let t = 0; t < this.n; t++) {
                    h[i][e] += this.arr[i][t] * s.arr[t][e];
                }
            }
        }
        return new Matrix(h);
    }
    setValue(r, c, v) {
        this.arr[r][c] = v;
    }
    getValue(r, c) {
        return this.arr[r][c];
    }
}
class Homogeneous2D {
    constructor(m = Matrix.eye(3)) {
        this._matrix = m;
    }
    mat() {
        return this._matrix;
    }
    identity() {
        this._matrix = Matrix.eye(3);
        return new Homogeneous2D(this._matrix.clone());
    }
    invert() {
        this._matrix = this._matrix.I;
        return new Homogeneous2D(this._matrix.clone());
    }
    transpose() {
        this._matrix = this._matrix.T;
        return new Homogeneous2D(this._matrix.clone());
    }
    compose(t) {
        let e = this._matrix.multiply(t.mat());
        return new Homogeneous2D(e);
    }
    _genTranslate(x, y) {
        let i = Matrix.eye(3);
        i.setValue(0, 2, x);
        i.setValue(1, 2, y);
        return i;
    }
    _genRotate(degree) {
        let e = Matrix.zero(3);
        let i = degree * (Math.PI / 180);
        let s = Math.sin(i);
        let h = Math.cos(i);
        e.setValue(0, 0, h);
        e.setValue(1, 0, -s);
        e.setValue(0, 1, s);
        e.setValue(1, 1, h);
        e.setValue(2, 2, 1);
        return e;
    }
    _genScale(sx, sy) {
        let i = Matrix.zero(3);
        i.setValue(0, 0, sx);
        i.setValue(1, 1, sy);
        i.setValue(2, 2, 1);
        return i;
    }
    _genSlant(isX, degree) {
        let i = Matrix.zero(3);
        let s = degree * (Math.PI / 180);
        let h = Math.sin(s);
        let a = Math.cos(s);
        if (isX) {
            i.setValue(0, 0, a);
            i.setValue(1, 0, -h);
            i.setValue(1, 1, 1)
        } else {
            i.setValue(0, 0, 1);
            i.setValue(0, 1, h);
            i.setValue(1, 1, a)
        }
        i.setValue(2, 2, 1);
        return i;
    }
    translate(x, y) {
        let i = this._genTranslate(x, y).multiply(this._matrix);
        return new Homogeneous2D(i);
    }
    translateLocal(x, y) {
        let i = this._matrix.multiply(this._genTranslate(x, y));
        return new Homogeneous2D(i);
    }
    rotate(degree, x, y) {
        let t1 = this._genTranslate(x, y);
        let t2 = this._genTranslate(-x, -y);
        let t3 = this._genRotate(degree);
        let h = t1.multiply(t2);
        let r = t3.multiply(h);
        let o = r.multiply(this._matrix);
        return new Homogeneous2D(o);
    }
    rotateLocal(degree) {
        let e = this._matrix.multiply(this._genRotate(degree));
        return new Homogeneous2D(e);
    }
    scale(sx, sy, x, y) {
        let h = this._genTranslate(x, y);
        let a = this._genTranslate(-x, -y);
        let n = this._genScale(sx, sy);
        let r = h.multiply(n);
        let o = r.multiply(a);
        let l = o.multiply(this._matrix);
        return new Homogeneous2D(l);
    }
    scaleLocal(sx, sy) {
        let i = this._matrix.multiply(this._genScale(sx, sy));
        return new Homogeneous2D(i);
    }
    slant(isX, degree, x, y) {
        let h = this._genTranslate(x, y);
        let a = this._genTranslate(-x, -y);
        let n = this._genSlant(isX, degree);
        let r = h.multiply(n);
        let o = r.multiply(a);
        let l = o.multiply(this._matrix);
        return new Homogeneous2D(l);
    }
    slantLocal(isX, degree) {
        let i = this._matrix.multiply(this._genSlant(isX, degree));
        return new Homogeneous2D(i);
    }
    affinePoint(t) {
        let e = new Matrix(3, 1);
        e.setValue(0, 0, t.x());
        e.setValue(1, 0, t.y());
        e.setValue(2, 0, 1);
        let i = this._matrix.multiply(e);
        return new Point(i.getValue(0, 0), i.getValue(1, 0));
    }
    affinePoints(e) {
        let i = [];
        for (let t of e) {
            i.push(this.affinePoint(t))
        }
        return i;
    }
}
function genTransform(x, y, a, w, h, inv) {
    let n = new Homogeneous2D;
    n = n.translateLocal(x, y);
    n = n.rotateLocal(a);
    if (w != 0 && h != 0)
        n = n.scaleLocal(w / 2, h / 2);
    if (inv)
        return n.invert();
    return n;
}
function getRect2Modify(x, y, a, w, h) {
    let t = new Point(0, 0);
    let n = new Point(-1, -1);
    let r = new Point(0, -1);
    let o = new Point(1, -1);
    let l = new Point(-1, 0);
    let d = new Point(1, 0);
    let e = new Point(-1, 1);
    let c = new Point(0, 1);
    let f = new Point(1, 1);
    let g = new Point(.5, 0);
    let p = [t, n, r, o, l, d, e, c, f, g];
    let z = genTransform(x, y, a, w, h, false);
    let u = z.affinePoints(p);
    return u;
}
function getEllipseModify(x, y, a, w, h) {
    let t = new Point(0, 0);
    let n = new Point(0, -1);
    let r = new Point(-1, 0);
    let o = new Point(1, 0);
    let l = new Point(0, 1);
    let d = new Point(.5, 0);
    let e = [t, n, r, o, l, d];
    let c = genTransform(x, y, a, w, h, false);
    let f = c.affinePoints(e);
    return f;
}
function boundingRectPoints(points) {
    if (points.length < 1)
        return new Rect(0, 0, 0, 0);
    let minX = Number.MAX_VALUE,
        maxX = -Number.MAX_VALUE,
        minY = Number.MAX_VALUE,
        maxY = -Number.MAX_VALUE;
    for (let point of points) {
        if (point.x() < minX)
            minX = point.x();
        if (point.x() > maxX)
            maxX = point.x();
        if (point.y() < minY)
            minY = point.y();
        if (point.y() > maxY)
            maxY = point.y()
    }
    return new Rect(minX, minY, maxX - minX, maxY - minY);
}
class DrawString {
    constructor(x, y, color, str, fontSize, font, isWindowFontSize = false) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.string = str;
        this.font = font;
        this.fontSize = fontSize;
        this.isWindowFontSize = isWindowFontSize;
    }
}
class ROI {
    constructor(shape, color) {
        this.shape = shape;
        this.color = color;
        this.arrowSize = 5;
    }
    setArrowSize(size) {
        this.arrowSize = size;
    }
}
class SinglePointROI extends ROI {
    constructor(x, y, shape, color) {
        super(shape, color);
        this.x = x;
        this.y = y;
    }
    setPoint(t) {
        this.x = t.x();
        this.y = t.y();
    }
    point() {
        return new Point(this.x, this.y);
    }
    translate(t) {
        this.x += t.x();
        this.y += t.y();
    }
}
class PointROI extends SinglePointROI {
    constructor(x, y, color) {
        super(x, y, Shape.PointShape, color);
    }
    clone() {
        return new PointROI(this.x, this.y, this.color);
    }
    boundingRect(t = new Size) {
        return new Rect(this.x - this.arrowSize, this.y - this.arrowSize, this.arrowSize * 2, this.arrowSize * 2)
    }
}
class HLineROI extends SinglePointROI {
    constructor(y, color) {
        super(0, y, Shape.HLineShape, color)
    }
    clone() {
        return new HLineROI(this.y, this.color);
    }
    boundingRect(t = new Size) {
        return new Rect(0, this.y - this.arrowSize, t.width(), this.arrowSize * 2);
    }
}
class VLineROI extends SinglePointROI {
    constructor(x, color) {
        super(x, 0, Shape.VLineShape, color);
    }
    clone() {
        return new VLineROI(this.x, this.color);
    }
    boundingRect(t = new Size) {
        return new Rect(this.x - this.arrowSize, 0, this.arrowSize * 2, t.height());
    }
}
class Rect1ROI extends SinglePointROI {
    constructor(x, y, w, h, color) {
        super(x, y, Shape.Rect1Shape, color);
        this.width = w;
        this.height = h;
    }
    setSize(t) {
        this.width = t.width();
        this.height = t.height();
    }
    size() {
        return new Size(this.width, this.height);
    }
    setRect(t) {
        this.x = t.x();
        this.y = t.y();
        this.width = t.width();
        this.height = t.height();
    }
    setEndPoint(t) {
        let e = this.point();
        this.x = e.x() > t.x() ? t.x() : e.x();
        this.y = e.y() > t.y() ? t.y() : e.y();
        this.width = Math.abs(e.x() - t.x());
        this.height = Math.abs(e.y() - t.y());
    }
    center() {
        return new Point(this.x + this.width / 2, this.y + this.height / 2);
    }
    boundingRect(t = new Size) {
        return new Rect(this.x, this.y, this.width, this.height);
    }
    clone() {
        return new Rect1ROI(this.x, this.y, this.width, this.height, this.color);
    }
}
class LineROI extends SinglePointROI {
    constructor(x, y, ex, ey, color) {
        super(x, y, Shape.LineShape, color);
        this.endX = ex;
        this.endY = ey;
    }
    setStartPoint(t) {
        this.x = t.x();
        this.y = t.y();
    }
    setPoint(t) {
        this.setStartPoint(t);
    }
    setEndPoint(t) {
        this.endX = t.x();
        this.endY = t.y();
    }
    startPoint() {
        return new Point(this.x, this.y);
    }
    point() {
        return this.startPoint();
    }
    endPoint() {
        return new Point(this.endX, this.endY);
    }
    center() {
        return new Point((this.x + this.endX) / 2, (this.y + this.endY) / 2);
    }
    clone() {
        return new LineROI(this.x, this.y, this.endX, this.endY, this.color);
    }
    boundingRect(t = new Size) {
        let e = this.endX > this.x ? this.x : this.endX;
        let i = this.endY > this.y ? this.y : this.endY;
        let s = Math.abs(this.endX - this.x);
        let h = Math.abs(this.endY - this.y);
        return new Rect(e, i, s, h);
    }
    translate(t) {
        this.x += t.x();
        this.y += t.y();
        this.endX += t.x();
        this.endY += t.y();
    }
}
class MultiPointsROI extends ROI {
    constructor(points, shape, color) {
        super(shape, color);
        this.points = points;
    }
    boundingRect(t = new Size) {
        return boundingRectPoints(this.points);
    }
    center() {
        return this.boundingRect().center();
    }
    translate(e) {
        for (let t of this.points) {
            t.translate(e);
        }
    }
}
class PolygonROI extends MultiPointsROI {
    constructor(points, color) {
        super(points, Shape.PolygonShape, color)
    }
    clone() {
        return new PolygonROI(this.points, this.color);
    }
}
class PolygonLineROI extends MultiPointsROI {
    constructor(points, color) {
        super(points, Shape.PolygonLineShape, color);
    }
    clone() {
        return new PolygonLineROI(this.points, this.color);
    }
}
class AnyROI extends MultiPointsROI {
    constructor(points, color) {
        super(points, Shape.AnyShape, color);
    }
    clone() {
        return new AnyROI(this.points, this.color);
    }
}
class AnyLineROI extends MultiPointsROI {
    constructor(points, color) {
        super(points, Shape.AnyLineShape, color);
    }
    clone() {
        return new AnyLineROI(this.points, this.color);
    }
}
class PointsROI extends MultiPointsROI {
    constructor(points, color) {
        super(points, Shape.PointsShape, color);
    }
    clone() {
        return new PointsROI(this.points, this.color);
    }
}
class RegionROI extends MultiPointsROI {
    constructor(points, holes, color) {
        super(points, Shape.RegionShape, color);
        this.holes = holes;
    }
    clone() {
        return new RegionROI(this.points, this.holes, this.color);
    }
}
class RotateROI extends ROI {
    constructor(x, y, a, w, h, shape, color) {
        super(shape, color);
        this.x = x;
        this.y = y;
        this.angle = a;
        this.width = w;
        this.height = h;
    }
    setPoint(t) {
        this.x = t.x();
        this.y = t.y();
    }
    point() {
        return new Point(this.x, this.y);
    }
    setSize(t) {
        this.width = t.width();
        this.height = t.height();
    }
    setWidth(t) {
        this.width = t;
    } setHeight(t) {
        this.height = t;
    }
    setX(t) {
        this.x = t;
    } setY(t) {
        this.y = t;
    }
    size() {
        return new Size(this.width, this.height);
    }
    center() {
        return this.point();
    }
    boundingRect(t = new Size) {
        let e = getRect2Modify(this.x, this.y, this.angle, this.width, this.height);
        return boundingRectPoints(e);
    }
    translate(t) {
        this.x += t.x();
        this.y += t.y();
    }
}
class RingROI extends RotateROI {
    constructor(x, y, a, w, h, sa, ea, d, shape, color) {
        super(x, y, a, w, h, shape, color);
        this.startAngle = sa;
        this.endAngle = ea;
        this.delta = d;
    }
    boundingRect(t = new Size) {
        let e = getRect2Modify(this.x, this.y, this.angle, this.width + this.delta, this.height + this.delta);
        return boundingRectPoints(e)
    }
}
class Rect2ROI extends RotateROI {
    constructor(x, y, a, w, h, color) {
        super(x, y, a, w, h, Shape.Rect2Shape, color);
    }
    clone() {
        return new Rect2ROI(this.x, this.y, this.angle, this.width, this.height, this.color);
    }
}
class CircleROI extends RotateROI {
    constructor(x, y, dia, color) {
        super(x, y, 0, dia, dia, Shape.CircleShape, color);
    }
    clone() {
        return new CircleROI(this.x, this.y, this.width, this.color);
    }
}
class EllipseROI extends RotateROI {
    constructor(x, y, a, w, h, color) {
        super(x, y, a, w, h, Shape.EllipseShape, color);
    }
    clone() {
        return new EllipseROI(this.x, this.y, this.angle, this.width, this.height, this.color);
    }
}
class CircleRingROI extends RingROI {
    constructor(x, y, dia, sa, ea, d, color) {
        super(x, y, 0, dia, dia, sa, ea, d, Shape.CircleRingShape, color);
    }
    clone() {
        return new CircleRingROI(this.x, this.y, this.width, this.startAngle, this.endAngle, this.delta, this.color);
    }
}
class EllipseRingROI extends RingROI {
    constructor(x, y, a, w, h, sa, ea, d, color) {
        super(x, y, a, w, h, sa, ea, d, Shape.EllipseRingShape, color);
    }
    clone() {
        return new EllipseRingROI(this.x, this.y, this.angle, this.width, this.height, this.startAngle, this.endAngle, this.delta, this.color);
    }
}
class Display {
    constructor(canvas, isFill = false, lineWidth = 2, drawState = DrawState.None,
        imageMode = ImageMode.FitRatioAuto, alignMode = AlignMode.CenterAlignMode,
        addEvent = true, canDisplayImage = true, backgroundColor = "#000000") {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.isFill = isFill;
        this.lineWidth = lineWidth;
        this.drawState = drawState;
        this.alignMode = alignMode;
        this.imageMode = imageMode;
        this.mouseImageDown = new Point;
        this.middleButton = false;
        this.displayObjects = [];
        this.objects = [];
        this.displayStrings = [];
        this.strings = [];
        this.canDisplayImage = canDisplayImage;
        this.backgroundColor = backgroundColor;
        this.isResetState = true;
        if (addEvent)
            this._addEvent();
    }
    _addEvent() {
        this.canvas["this_display"] = this;
        this.canvas.onmousedown = function (e) {
            let b = e.buttons;
            if (b & 4) {
                let t = this["this_display"];
                if (t === undefined || t === null)
                    return;
                t.middleButton = true;
                t.mouseImageDown = t._windowToImagePoint(new Point(e.offsetX, e.offsetY));
            }
        };
        this.canvas.onmouseup = function (e) {
            let b = e.buttons;
            let t = this["this_display"];
            if (t === undefined || t === null) return;
            if (t.middleButton) {
                t.mouseImageDown = new Point();
                t.middleButton = false;
            }
        };
        this.canvas.onmousemove = function (e) {
            let b = e.buttons;
            if (b & 4) {
                let t = this["this_display"];
                if (t === undefined || t === null)
                    return;
                let mp = t._windowToImagePoint(new Point(e.offsetX, e.offsetY));
                let x = mp.x() - t.mouseImageDown.x();
                let y = mp.y() - t.mouseImageDown.y();
                t.imagePart.translate(-x, -y);
                t.render();
            }
        };
        this.canvas.onwheel = function (e) {
            let t = this["this_display"];
            if (t === undefined || t === null)
                return;
            let i = e.deltaY;
            let s = 1;
            if (i >= 100)
                s = .9;
            else if (i <= -100)
                s = 1 / .9;
            let h = new Point(e.offsetX, e.offsetY);
            t._zoomImage(s, h);
        }
        this.canvas.ondblclick = function (e) {
            let t = this["this_display"];
            if (t === undefined || t === null) return;
            t.resetImage();
        };
    }
    _zoomImage(t, e) {
        let i = this._windowToImagePoint(e);
        let s = this.imagePart.width();
        let h = this.imagePart.height();
        let a = (i.x() - this.imagePart.x()) / s;
        let n = (i.y() - this.imagePart.y()) / h;
        let r = h < 3 || s < 3;
        if (r) {
            if (t < 1)
                return;
            else
                t = 5
        }
        h = h * t; s = s * t;
        let o = i.x() - s * a;
        let l = i.y() - h * n;
        this.imagePart = new Rect(o, l, s, h);
        this.render()
    }
    resetImage() {
        this.isResetState = true;
        this.render();
    }
    setDisplayImage(t) {
        this.image = t;
    }
    displayImage() {
        return this.image;
    }
    addDisplay(d) {
        if (this.objects === undefined) {
            this.objects = [];
        }
        if (!this.objects.includes(d))
            this.objects.push(d);
    }
    addPointDisplay(x, y, color) {
        let s = new PointROI(x, y, color);
        this.addDisplay(s);
    }
    addHLineDisplay(y, color) {
        let i = new HLineROI(y, color);
        this.addDisplay(i);
    }
    addVLineDisplay(x, color) {
        let i = new VLineROI(x, color);
        this.addDisplay(i);
    }
    addLineDisplay(sx, sy, ex, ey, color) {
        let a = new LineROI(sx, sy, ex, ey, color);
        this.addDisplay(a);
    }
    addRect1Display(x, y, w, h, color) {
        let a = new Rect1ROI(x, y, w, h, color);
        this.addDisplay(a);
    }
    addRect2Display(x, y, a, w, h, color) {
        let n = new Rect2ROI(x, y, a, w, h, color);
        this.addDisplay(n);
    }
    addCircleDisplay(x, y, dia, color) {
        let h = new CircleROI(x, y, dia, color);
        this.addDisplay(h);
    }
    addEllipseDisplay(x, y, a, w, h, color) {
        let n = new EllipseROI(x, y, a, w, h, color);
        this.addDisplay(n)
    }
    addPointsDisplay(points, color) {
        let i = new PointsROI(points, color);
        this.addDisplay(i);
    }
    addPolygonDisplay(points, color) {
        let i = new PolygonROI(points, color);
        this.addDisplay(i);
    }
    addPolygonLineDisplay(points, color) {
        let i = new PolygonLineROI(points, color);
        this.addDisplay(i);
    }
    addRegionDisplay(points, holes, color) {
        let s = new RegionROI(points, holes, color);
        this.addDisplay(s);
    }
    addCircleRingDisplay(x, y, dia, sa, ea, d, color) {
        let r = new CircleRingROI(x, y, dia, sa, ea, d, color);
        this.addDisplay(r);
    }
    addEllipseRingDisplay(x, y, a, w, h, sa, ea, d, color) {
        let l = new EllipseRingROI(x, y, a, w, h, sa, ea, d, color);
        this.addDisplay(l);
    }
    addString(t) {
        if (this.strings === undefined) {
            this.strings = [];
        }
        if (!this.strings.includes(t))
            this.strings.push(t);
    }
    addStringDisplay(x, y, color, str, fontSize, font) {
        let n = new DrawString(x, y, color, str, fontSize, font);
        this.addString(n);
    }
    enableDisplay() {
        this.enableShow = true;
        this.displayObjects = this.objects;
        this.displayStrings = this.strings;
        this.objects = [];
        this.strings = [];
    }
    disableDisplay() {
        this.enableShow = false;
        this.clearDisplay();
    }
    clearDisplay() {
        this.strings = [];
        this.objects = [];
        this.displayObjects = [];
        this.displayStrings = [];
    }
    _beginDraw(t) {
        let e = t.color;
        this.ctx.fillStyle = e;
        this.ctx.strokeStyle = e;
        this.lineCap = "round";
        this.ctx.lineWidth = this.lineWidth;
        return this._imageToWindow(t);
    }
    _getWindowToImageTransform() {
        let t = new Homogeneous2D;
        if (this.imagePart === undefined)
            return t;
        let e = this.imagePart.size();
        let i = this.windowPart.size();
        if (e.isEmpty() || i.isEmpty())
            return t;
        let s = new Size(e.width() / i.width(), e.height() / i.height());
        let h = this.imagePart.topLeft();
        t = t.translateLocal(h.x(), h.y());
        t = t.scaleLocal(s.width(), s.height());
        t = t.translateLocal(-this.windowPart.x(), -this.windowPart.y());
        return t;
    }
    _windowToImagePoint(t) {
        let e = this._getWindowToImageTransform();
        return e.affinePoint(t);
    }
    _windowToImageSize(t) {
        let e = new Size(1, 1);
        let i = this.imagePart.size();
        let s = this.windowPart.size();
        if (i.isEmpty() || s.isEmpty())
            return e;
        e = new Size(i.width() / s.width(), i.height() / s.height());
        return new Size(e.width() * t.width(), e.height() * t.height());
    }
    _imageToWindowSize(t) {
        let e = new Size(1, 1);
        let i = this.imagePart.size();
        let s = this.windowPart.size();
        if (i.isEmpty() || s.isEmpty())
            return e;
        e = new Size(s.width() / i.width(), s.height() / i.height());
        return new Size(e.width() * t.width(), e.height() * t.height())
    }
    _imageToWindowPoint(t) {
        let e = this._getImageToWindowTransform();
        return e.affinePoint(t);
    }
    _imageToWindowRect(r) {
        let p = this._imageToWindowPoint(r.topLeft());
        let s = this._imageToWindowSize(r.size());
        return new Rect(p.x(), p.y(), s.width(), s.height());
    }
    _imageToWindowNumber(s) {
        let so = this._imageToWindowSize(new Size(s, s));
        return so.width();
    }
    _getImageToWindowTransform() {
        let t = new Homogeneous2D;
        if (this.imagePart === undefined)
            return t;
        let e = this.imagePart.size();
        let i = this.windowPart.size();
        if (e.isEmpty() || i.isEmpty())
            return t;
        let s = new Size(i.width() / e.width(), i.height() / e.height());
        let h = this.imagePart.topLeft();
        t = t.translateLocal(this.windowPart.x(), this.windowPart.y());
        t = t.scaleLocal(s.width(), s.height());
        t = t.translateLocal(-h.x(), -h.y());
        return t;
    }
    _imageToWindow(t) {
        let s = t.clone();
        let h = this._getImageToWindowTransform();
        let e = new Size(s.arrowSize, s.arrowSize);
        e = this._imageToWindowSize(e);
        s.arrowSize = e.width();
        if (s instanceof PointROI) {
            let t = h.affinePoint(new Point(s.x, s.y));
            s.x = t.x();
            s.y = t.y();
        } else if (s instanceof HLineROI) {
            let t = h.affinePoint(new Point(0, s.y));
            s.y = t.y();
        } else if (s instanceof VLineROI) {
            let t = h.affinePoint(new Point(s.x, 0));
            s.x = t.x();
        } else if (s instanceof LineROI) {
            let t = h.affinePoint(new Point(s.x, s.y));
            let e = h.affinePoint(new Point(s.endX, s.endY));
            s.x = t.x();
            s.y = t.y();
            s.endX = e.x();
            s.endY = e.y();
        } else if (s instanceof Rect1ROI) {
            let t = h.affinePoint(new Point(s.x, s.y));
            let e = h.affinePoint(new Point(s.x + s.width, s.y + s.height));
            s.x = t.x() > e.x() ? e.x() : t.x();
            s.y = t.y() > e.y() ? e.y() : t.y();
            s.width = Math.abs(e.x() - t.x());
            s.height = Math.abs(e.y() - t.y());
        } else if (s instanceof RotateROI) {
            let t = h.affinePoint(new Point(s.x, s.y));
            let e = new Size(s.width, s.height);
            e = this._imageToWindowSize(e);
            s.x = t.x();
            s.y = t.y();
            s.width = e.width();
            s.height = e.height();
            if (s instanceof RingROI) {
                s.delta = this._imageToWindowNumber(s.delta);
            }
        } else if (s instanceof MultiPointsROI) {
            let t = h.affinePoints(s.points);
            s.points = t;
            if (s instanceof RegionROI) {
                let i = [];
                for (let e of s.holes) {
                    let t = h.affinePoints(e);
                    i.push(t)
                }
                s.holes = i;
            }
        }
        return s;
    }
    _updateWindowSize() {
        let t = this.canvas.width;
        let e = this.canvas.height;
        let i = new Rect(0, 0, t, e);
        if (this.image !== undefined && this.image !== null)
            i = new Rect(0, 0, this.image.width, this.image.height);
        this.windowPart = new Rect(0, 0, t, e);
        this.window = new Rect(0, 0, t, e);
        if (this.imageMode === ImageMode.FitRatioAuto) {
            let t = i.width() * 1 / i.height();
            let e = this.windowPart.width() * 1 / this.windowPart.height();
            if (e > t) this.windowPart.setWidth(this.windowPart.height() * t);
            else this.windowPart.setHeight(this.windowPart.width() / t)
        } else if (this.imageMode === ImageMode.FitToWidth) {
            let t = i.width() * 1 / i.height();
            this.windowPart.setHeight(this.windowPart.width() / t)
        } else if (this.imageMode === ImageMode.FitToHeight) {
            let t = i.width() * 1 / i.height();
            this.windowPart.setWidth(this.windowPart.height() * t)
        } if (this.alignMode == AlignMode.CenterAlignMode) {
            let t = this.windowPart.center();
            let e = this.window.center();
            let i = e.x() - t.x();
            let s = e.y() - t.y();
            this.windowPart.translate(i, s);
        }
    }
    render() {
        if (!this.enableShow)
            return;
        let t = this.canvas.width;
        let e = this.canvas.height;
        if (this.isResetState || this.imagePart === undefined || this.imagePart.isEmpty()) {
            if (this.image === undefined || this.image === null)
                this.imagePart = new Rect(0, 0, this.canvas.width, this.canvas.height);
            else
                this.imagePart = new Rect(0, 0, this.image.width, this.image.height);
            this.isResetState = false;
        }
        this._updateWindowSize();
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, t, e);
        if (this.canDisplayImage) {
            this.ctx.drawImage(this.image, this.imagePart.x(),
                this.imagePart.y(), this.imagePart.width(), this.imagePart.height(),
                this.windowPart.x(), this.windowPart.y(), this.windowPart.width(),
                this.windowPart.height());
        }
        if (this.displayObjects.length > 0)
            this._drawObjects();
        if (this.displayStrings.length > 0)
            this._drawStrings();
    }
    _drawSingleStringW(x, y, color, str, fontSize, font, isWindowFontSize = false) {
        this.ctx.fillStyle = color;
        if (fontSize > 0 && font != "")
            this.ctx.font = fontSize + "px " + font;
        this.ctx.fillText(str, x, y);
    }
    _drawSingleString(x, y, color, str, fontSize, font, isWindowFontSize = false) {
        let t = this._imageToWindowPoint(new Point(x, y));
        if (!isWindowFontSize && fontSize > 0) {
            fontSize = this._imageToWindowNumber(fontSize);
        }
        this.ctx.fillStyle = color;
        if (fontSize > 0 && font != "")
            this.ctx.font = fontSize + "px " + font;
        this.ctx.fillText(str, t.x(), t.y());
    }
    _drawStrings() {
        for (let s of this.displayStrings) {
            this._drawSingleString(s.x, s.y, s.color, s.string, s.fontSize, s.font, s.isWindowFontSize);
        }
    }
    _drawSingleObject(t) {
        switch (t.shape) {
            case Shape.PointShape:
                this.__drawPoint(t);
                break;
            case Shape.HLineShape:
                this.__drawHLine(t);
                break;
            case Shape.VLineShape:
                this.__drawVLine(t);
                break;
            case Shape.LineShape:
                this.__drawLine(t);
                break;
            case Shape.Rect1Shape:
                this.__drawRect1(t);
                break;
            case Shape.Rect2Shape:
                this.__drawRect2(t);
                break;
            case Shape.CircleShape:
                this.__drawCircle(t);
                break;
            case Shape.EllipseShape:
                this.__drawEllipse(t);
                break;
            case Shape.PolygonShape:
                this.__drawPolygon(t);
                break;
            case Shape.PolygonLineShape:
                this.__drawPolygonLine(t);
                break;
            case Shape.AnyShape:
                this.__drawPolygon(t);
                break;
            case Shape.AnyLineShape:
                this.__drawPolygonLine(t);
                break;
            case Shape.Pointshape:
                this.__drawPoints(t);
                break;
            case Shape.RegionShape:
                this.__drawRegion(t);
                break;
            case Shape.CircleRingShape:
                this.__drawCircleRing(t);
                break;
            case Shape.EllipseRingShape:
                this.__drawEllipseRing(t);
                break;
        }
    }
    _drawObjects() {
        for (let e of this.displayObjects) {
            let t = this._beginDraw(e);
            this._drawSingleObject(t);
        }
    }
    _paint() {
        if (this.isFill) {
            this.ctx.fill();
            this.ctx.stroke();
        } else {
            this.ctx.stroke();
        }
    }
    _drawPoint(x, y, size) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x, y + size);
        this.ctx.moveTo(x - size, y);
        this.ctx.lineTo(x + size, y);
        this.ctx.stroke();
    }
    __drawPoint(t) {
        let e = t.arrowSize / 2;
        this._drawPoint(t.x, t.y, e);
    }
    __drawHLine(t) {
        let e = this.canvas.width;
        this.ctx.beginPath();
        this.ctx.moveTo(0, t.y);
        this.ctx.lineTo(e, t.y);
        this.ctx.stroke();
    }
    __drawVLine(t) {
        let e = this.canvas.height;
        this.ctx.beginPath();
        this.ctx.moveTo(t.x, 0);
        this.ctx.lineTo(t.x, e);
        this.ctx.stroke();
    }
    _drawLine(sp, ep) {
        this.ctx.beginPath();
        this.ctx.moveTo(sp.x(), sp.y());
        this.ctx.lineTo(ep.x(), ep.y());
        this.ctx.stroke();
    }
    _drawArrow(sp, ep, size) {
        let s = Math.atan2(ep.y() - sp.y(), ep.x() - sp.x());
        this._drawLine(sp, ep);
        this.ctx.resetTransform();
        this.ctx.translate(ep.x(), ep.y());
        this.ctx.rotate(s);
        this.ctx.beginPath();
        this.ctx.moveTo(-size, -size);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(-size, size);
        this.ctx.stroke();
        this.ctx.resetTransform();
    }
    __drawLine(t) {
        let e = t.startPoint();
        let i = t.endPoint();
        let s = t.arrowSize;
        this._drawArrow(e, i, s);
    }
    __drawRect1(t) {
        if (this.isFill) {
            this.ctx.fillRect(t.x, t.y, t.width, t.height);
            this.ctx.strokeRect(t.x, t.y, t.width, t.height);
        } else
            this.ctx.strokeRect(t.x, t.y, t.width, t.height);
    }
    _getRect2Modify(t) {
        return getRect2Modify(t.x, t.y, t.angle, t.width, t.height);
    }
    _getEllipseModify(t) {
        return getEllipseModify(t.x, t.y, t.angle, t.width, t.height);
    }
    _drawPolygonRegion(points, close = false, clw = false) {
        if (points.length < 2)
            return;
        if (close) {
            let e = points.length - 1;
            this.ctx.moveTo(points[e].x(), points[e].y());
            for (let t = e; t > -1; t--) {
                this.ctx.lineTo(points[t].x(), points[t].y());
            }
            if (clw) {
                this.ctx.lineTo(points[e].x(), points[e].y());
            }
        } else {
            this.ctx.moveTo(points[0].x(), points[0].y());
            for (let t = 1; t < points.length; t++) {
                this.ctx.lineTo(points[t].x(), points[t].y());
            }
            if (clw) {
                this.ctx.lineTo(points[0].x(), points[0].y());
            }
        }
    }
    _drawPolygon(p, close, clw = false) {
        this.ctx.beginPath();
        this._drawPolygonRegion(p, clw);
        if (close)
            this.ctx.closePath();
        this._paint();
    }
    __drawRect2(t) {
        let e = this._getRect2Modify(t);
        let i = [e[1], e[3], e[8], e[6]];
        this._drawPolygon(i, true);
        this._drawPoint(e[0].x(), e[0].y(), t.arrowSize);
        this._drawArrow(e[0], e[5], t.arrowSize);
    }
    static getRad(t) {
        return t * Math.PI / 180;
    }
    static getDegree(t) {
        return t * 180 / Math.PI;
    }
    _arc(x, y, dia, sa, ea, clw = false) {
        this.ctx.arc(x, y, dia / 2, Display.getRad(sa), Display.getRad(ea), clw);
    }
    _drawArc(x, y, dia, sa, ea, clw = false) {
        this.ctx.beginPath();
        this._arc(x, y, dia, sa, ea, clw);
        this.ctx.closePath();
        this._paint();
    }
    __drawCircle(t) {
        this._drawArc(t.x, t.y, t.width, 0, 360);
        this._drawPoint(t.x, t.y, t.arrowSize);
    }
    _ellipse(x, y, a, w, h, sa, ea, clw = false) {
        this.ctx.ellipse(x, y, w / 2, h / 2, Display.getRad(a), Display.getRad(sa), Display.getRad(ea), clw);
    }
    _drawEllipse(x, y, a, w, h, sa, ea, clw = false) {
        this.ctx.beginPath();
        this._ellipse(x, y, a, w, h, sa, ea, clw);
        this.ctx.closePath();
        this._paint();
    }
    __drawEllipse(t) {
        this._drawEllipse(t.x, t.y, -t.angle, t.width, t.height, 0, 360);
        let e = this._getEllipseModify(t);
        this._drawPoint(t.x, t.y, t.arrowSize);
        this._drawArrow(e[0], e[3], t.arrowSize);
    }
    __drawPolygon(t) {
        let e = t.points;
        this._drawPolygon(e, true);
    }
    __drawPolygonLine(t) {
        let e = t.points;
        let i = this.isFill;
        this.isFill = false;
        this._drawPolygon(e, false);
        this.isFill = i;
    }
    __drawPoints(e) {
        let i = e.points;
        for (let t of i) {
            this._drawPoint(t.x, t.y, e.arrowSize);
        }
    }
    __drawRegion(i) {
        if (this.isFill) {
            this.ctx.save();
            this.ctx.beginPath();
            let t = i.points;
            this._drawPolygonRegion(t, false, true);
            let e = i.holes;
            for (let t of e) {
                this._drawPolygonRegion(t, true, true)
            }
            this.ctx.clip();
            this._drawPolygon(t, true);
            this.ctx.restore();
        } else {
            let e = i.holes;
            for (let t of e) {
                this._drawPolygon(t, true);
            }
            let t = i.points;
            this._drawPolygon(t, true);
        }
    }
    __drawCircleRing(e) {
        if (this.isFill) {
            this.isFill = false;
            let lw = this.ctx.lineWidth;
            this.ctx.lineWidth = e.delta / 2.0;
            this._drawArc(e.x, e.y, e.width + e.delta / 2.0, e.startAngle, e.endAngle);
            this.ctx.lineWidth = lw;
            this._drawArc(e.x, e.y, e.width + e.delta, e.startAngle, e.endAngle);
            this.isFill = true;
        } else {
            this._drawArc(e.x, e.y, e.width, e.startAngle, e.endAngle);
            this._drawArc(e.x, e.y, e.width + e.delta, e.startAngle, e.endAngle);
        }
        this._drawPoint(e.x, e.y, e.arrowSize);
    }
    __drawEllipseRing(e) {
        if (this.isFill) {
            this.isFill = false;
            let lw = this.ctx.lineWidth;
            this.ctx.lineWidth = e.delta / 2.0;
            this._drawEllipse(e.x, e.y, -e.angle, e.width + e.delta / 2.0, e.height + e.delta / 2.0, e.startAngle, e.endAngle);
            this.ctx.lineWidth = lw;
            this._drawEllipse(e.x, e.y, -e.angle, e.width + e.delta, e.height + e.delta, e.startAngle, e.endAngle);
            this.isFill = true;
        } else {
            this._drawEllipse(e.x, e.y, -e.angle, e.width, e.height, e.startAngle, e.endAngle);
            this._drawEllipse(e.x, e.y, -e.angle, e.width + e.delta, e.height + e.delta, e.startAngle, e.endAngle);
        }
        this._drawPoint(e.x, e.y, e.arrowSize);
        let t = this._getEllipseModify(e);
        this._drawArrow(t[0], t[3], e.arrowSize);
    }
}
const ModifyFlags = {
    MoveCenter: 0,
    MovePoint: 1,
    Scale: 2,
    Angle: 3
};
class ModifyPoint {
    constructor(t, e) {
        this.flag = t;
        this.x = e.x();
        this.y = e.y();
    }
    point() {
        return new Point(this.x, this.y);
    }
    ModifyFlag() {
        return this.flag;
    }
    setPoint(p) {
        this.x = p.x();
        this.y = p.y();
    }
}
function calcAngle(t, e) {
    let i = t.x() - e.x();
    if (i == 0)
        i = 1e-6;
    let s = t.y() - e.y();
    let h = Math.atan2(-s, i);
    h = h * 180 / Math.PI;
    return h;
}
function calcDistance(t, e) {
    let i = t.x() - e.x();
    if (i == 0)
        i = 1e-6;
    let s = t.y() - e.y();
    let h = Math.sqrt(i * i + s * s);
    return h;
}
class ROIDrawDisplay extends Display {
    constructor(
        canvas,
        isFill = false,
        lineWidth = 2,
        drawState = DrawState.None,
        imageMode = ImageMode.FitRatioAuto,
        alignMode = AlignMode.CenterAlignMode
    ) {
        super(canvas, isFill, lineWidth, drawState, imageMode, alignMode, false);
        this.drawROI = null;
        this.mouseDownPos = new Point();
        this.mouseMovePos = new Point();
        this.lastMovePos = new Point();
        this.mouseUpPos = new Point();
        this.rois = [];
        this.selectROIs = [];
        this.drawTempRect = new Rect();
        this.lastModifyROI = null;
        this.drawLine = new Line();
        this.isLeftDown = false;
        this.isRightDown = false;
        this.isMiddleDown = false;
        this._addEvent();
    }
    setDrawParam(shape, color, arrowSize, controlSize, drawROIIndexSize) {
        this.drawShape = shape;
        this.drawColor = color;
        this.drawArrowSize = arrowSize;
        this.controlSize = controlSize;
        this.drawROIIndexSize = drawROIIndexSize;
    }
    _initDrawROI() {
        if (this.drawROI == null || this.drawROI === undefined) {
            switch (this.drawShape) {
                case Shape.PointShape:
                    this.drawROI = new PointROI(0, 0, this.drawColor);
                    break;
                case Shape.HLineShape:
                    this.drawROI = new HLineROI(0, this.drawColor);
                    break;
                case Shape.VLineShape:
                    this.drawROI = new VLineROI(0, this.drawColor);
                    break;
                case Shape.LineShape:
                    this.drawROI = new LineROI(0, 0, 0, 0, this.drawColor);
                    break;
                case Shape.Rect1Shape:
                    this.drawROI = new Rect1ROI(0, 0, 0, 0, this.drawColor);
                    break;
                case Shape.Rect2Shape:
                    this.drawROI = new Rect2ROI(0, 0, 0, 0, 0, this.drawColor);
                    break;
                case Shape.CircleShape:
                    this.drawROI = new CircleROI(0, 0, 0, this.drawColor);
                    break;
                case Shape.EllipseShape:
                    this.drawROI = new EllipseROI(0, 0, 0, 0, 0, this.drawColor);
                    break;
                case Shape.PolygonShape:
                    this.drawROI = new PolygonROI([], this.drawColor);
                    break;
                case Shape.PolygonLineShape:
                    this.drawROI = new PolygonLineROI([], this.drawColor);
                    break;
                case Shape.AnyShape:
                    this.drawROI = new AnyROI([], this.drawColor);
                    break;
                case Shape.AnyLineShape:
                    this.drawROI = new AnyLineROI([], this.drawColor);
                    break;
                case Shape.Pointshape:
                    this.drawROI = new PointsROI([], this.drawColor);
                    break;
                case Shape.CircleRingShape:
                    this.drawROI = new CircleRingROI(0, 0, 0, 0, 360, 20, this.drawColor);
                    break;
                case Shape.EllipseRingShape:
                    this.drawROI = new EllipseRingROI(
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        360,
                        20,
                        this.drawColor
                    );
                    break;
                default:
                    this.drawROI = new PointROI(0, this.drawColor);
                    break;
            }
        }
        this.drawROI.color = this.drawColor;
        this.drawROI.arrowSize = this.drawArrowSize;
    }
    _exitDrawROI() {
        this.drawROI = null;
        this.drawState = DrawState.None;
    }
    _calcTransformNewSize(t, e) {
        let i = new Size(
            Math.abs((t.x() - e.x()) * 2),
            Math.abs((t.y() - e.y()) * 2)
        );
        return i;
    }
    _drawStart() {
        this._initDrawROI();
        let t = this.drawROI.drawPoints;
        if (t === null || t === undefined) {
            t = [];
            this.drawROI.drawPoints = t;
        }
        let e = t.length;
        let i = this.mouseDownPos;
        let s = this.drawShape;
        if (
            s === Shape.AnyShape ||
            s === Shape.AnyLineShape ||
            s === Shape.PolygonShape ||
            s === Shape.PolygonLineShape
        ) {
            this.drawROI.points.push(i);
        } else if (s === Shape.PointShape) {
            this.drawROI.setPoint(i);
        } else if (s === Shape.VLineShape) {
            this.drawROI.x = i.x();
        } else if (s === Shape.HLineShape) {
            this.drawROI.y = i.y();
        } else if (s === Shape.Rect1Shape) {
            this.drawROI.setPoint(i);
            this.drawROI.setSize(new Size());
        } else if (s === Shape.LineShape) {
            this.drawROI.setStartPoint(i);
            this.drawROI.setEndPoint(i);
        } else if (
            s === Shape.Rect2Shape ||
            s === Shape.EllipseShape ||
            s === Shape.EllipseRingShape
        ) {
            if (e === 1) {
                this.drawROI.angle = calcAngle(i, this.drawROI.point());
            } else {
                this.drawROI.x = i.x();
                this.drawROI.y = i.y();
                this.drawROI.angle = 0;
                let t = this._calcTransformNewSize(i, this.drawROI.point());
                this.drawROI.setSize(t);
                if (e > 1) this.drawROI.drawPoints = [];
            }
        } else if (s === Shape.CircleShape || s === Shape.CircleRingShape) {
            this.drawROI.setPoint(i);
            this.drawROI.angle = 0;
            this.drawROI.setSize(new Size(1, 1));
            this.drawROI.drawPoints = [];
        }
        this.drawROI.drawPoints.push(i);
    }
    _drawMove() {
        let t = this.drawROI.drawPoints;
        if (t === null || t === undefined) return;
        let e = t.length;
        if (e === 0) return;
        let i = this.mouseMovePos;
        let s = this.drawShape;
        if (s === Shape.PolygonShape || s === Shape.PolygonLineShape) {
            this.drawROI.points[e - 1] = i;
        } else if (s === Shape.AnyShape || s === Shape.AnyLineShape) {
            this.drawROI.points.push(i);
        } else if (s === Shape.PointShape) {
            this.drawROI.setPoint(i);
        } else if (s === Shape.VLineShape) {
            this.drawROI.x = i.x();
        } else if (s === Shape.HLineShape) {
            this.drawROI.y = i.y();
        } else if (s === Shape.LineShape || s === Shape.Rect1Shape) {
            this.drawROI.setEndPoint(i);
        } else if (
            s === Shape.Rect2Shape ||
            s === Shape.EllipseShape ||
            s === Shape.EllipseRingShape
        ) {
            if (e === 1) {
                let t = this._calcTransformNewSize(i, this.drawROI.point());
                this.drawROI.setSize(t);
            } else if (e === 2) {
                this.drawROI.angle = calcAngle(i, this.drawROI.point());
            }
        } else if (s === Shape.CircleShape || s === Shape.CircleRingShape) {
            let t = calcDistance(i, this.drawROI.point());
            this.drawROI.setSize(new Size(t * 2, t * 2));
        }
    }
    _endDrawCallback(roi) {
        if (this.endDraw != undefined && this.endDraw != null) {
            this.endDraw(roi);
        }
    }
    _drawEnd() {
        let c = this.drawROI.clone();
        this.addROI(c);
        this._exitDrawROI();
        this._endDrawCallback(c);
    }
    addROI(t) {
        if (this.rois === undefined) {
            this.rois = [];
        }
        if (!this.rois.includes(t)) this.rois.push(t);
    }
    addPointROI(x, y, color) {
        let s = new PointROI(x, y, color);
        this.addROI(s);
    }
    addHLineROIy(y, color) {
        let i = new HLineROI(y, color);
        this.addROI(i);
    }
    addVLineROI(x, color) {
        let i = new VLineROI(x, color);
        this.addROI(i);
    }
    addLineROI(sx, sy, ex, ey, color) {
        let a = new LineROI(sx, sy, ex, ey, color);
        this.addROI(a);
    }
    addRect1ROI(x, y, w, h, color) {
        let a = new Rect1ROI(x, y, w, h, color);
        this.addROI(a);
    }
    addRect2ROI(x, y, a, w, h, color) {
        let n = new Rect2ROI(x, y, a, w, h, color);
        this.addROI(n);
    }
    addCircleROI(x, y, dia, color) {
        let h = new CircleROI(x, y, dia, color);
        this.addROI(h);
    }
    addEllipseROI(x, y, a, w, h, color) {
        let n = new EllipseROI(x, y, a, w, h, color);
        this.addROI(n);
    }
    addPointsROI(points, color) {
        let i = new PointsROI(points, color);
        this.addROI(i);
    }
    addPolygonROI(points, color) {
        let i = new PolygonROI(points, color);
        this.addROI(i);
    }
    addPolygonLineROI(points, color) {
        let i = new PolygonLineROI(points, color);
        this.addROI(i);
    }
    addCircleRingROI(x, y, dia, sa, ea, d, color) {
        let r = new CircleRingROI(x, y, dia, sa, ea, d, color);
        this.addROI(r);
    }
    addEllipseRingROI(x, y, a, w, h, sa, ea, d, color) {
        let l = new EllipseRingROI(x, y, a, w, h, sa, ea, d, color);
        this.addROI(l);
    }
    draw(t) {
        this.drawShape = t;
        this.drawState = DrawState.Draw;
    }
    _moveImage() {
        let t = this.mouseMovePos.x() - this.mouseDownPos.x();
        let e = this.mouseMovePos.y() - this.mouseDownPos.y();
        this.imagePart.translate(-t, -e);
    }
    _getROIModifyPoints(w) {
        w.modifyPoints = [];
        let c = w.modifyPoints;
        switch (w.shape) {
            case Shape.PointShape:
                {
                    let t = new ModifyPoint(ModifyFlags.MoveCenter, w.point());
                    c.push(t);
                }
                break;
            case Shape.HLineShape:
                {
                    let t = new ModifyPoint(
                        ModifyFlags.MoveCenter,
                        new Point(this.imagePart.size().width() / 2, w.y)
                    );
                    c.push(t);
                }
                break;
            case Shape.VLineShape:
                {
                    let t = new ModifyPoint(
                        ModifyFlags.MoveCenter,
                        new Point(w.x, this.imagePart.size().height() / 2)
                    );
                    c.push(t);
                }
                break;
            case Shape.LineShape:
                {
                    let t = new ModifyPoint(ModifyFlags.MoveCenter, w.center());
                    c.push(t);
                    let e = new ModifyPoint(ModifyFlags.MovePoint, w.startPoint());
                    c.push(e);
                    let i = new ModifyPoint(ModifyFlags.MovePoint, w.endPoint());
                    c.push(i);
                }
                break;
            case Shape.Rect1Shape:
                {
                    let t = w.boundingRect();
                    let e = new ModifyPoint(ModifyFlags.MoveCenter, t.center());
                    c.push(e);
                    let i = new ModifyPoint(ModifyFlags.MovePoint, t.topLeft());
                    c.push(i);
                    let s = new ModifyPoint(ModifyFlags.MovePoint, t.topRight());
                    c.push(s);
                    let h = new ModifyPoint(ModifyFlags.MovePoint, t.bottomRight());
                    c.push(h);
                    let a = new ModifyPoint(ModifyFlags.MovePoint, t.bottomLeft());
                    c.push(a);
                }
                break;
            case Shape.CircleShape:
            case Shape.CircleRingShape:
                {
                    let t = this._getEllipseModify(w);
                    let e = new ModifyPoint(ModifyFlags.MoveCenter, w.center());
                    c.push(e);
                    let i = new ModifyPoint(ModifyFlags.Scale, t[1]);
                    c.push(i);
                    let s = new ModifyPoint(ModifyFlags.Scale, t[2]);
                    c.push(s);
                    let h = new ModifyPoint(ModifyFlags.Scale, t[3]);
                    c.push(h);
                    let a = new ModifyPoint(ModifyFlags.Scale, t[4]);
                    c.push(a);
                }
                break;
            case Shape.EllipseShape:
            case Shape.EllipseRingShape:
                {
                    let t = this._getEllipseModify(w);
                    let e = new ModifyPoint(ModifyFlags.MoveCenter, w.center());
                    c.push(e);
                    let i = new ModifyPoint(ModifyFlags.Scale, t[1]);
                    c.push(i);
                    let s = new ModifyPoint(ModifyFlags.Scale, t[2]);
                    c.push(s);
                    let h = new ModifyPoint(ModifyFlags.Scale, t[3]);
                    c.push(h);
                    let a = new ModifyPoint(ModifyFlags.Scale, t[4]);
                    c.push(a);
                    let n = new ModifyPoint(ModifyFlags.Angle, t[5]);
                    c.push(n);
                }
                break;
            case Shape.Rect2Shape:
                {
                    let t = this._getRect2Modify(w);
                    let e = new ModifyPoint(ModifyFlags.MoveCenter, w.center());
                    c.push(e);
                    let i = new ModifyPoint(ModifyFlags.Scale, t[1]);
                    c.push(i);
                    let s = new ModifyPoint(ModifyFlags.Scale, t[2]);
                    c.push(s);
                    let h = new ModifyPoint(ModifyFlags.Scale, t[3]);
                    c.push(h);
                    let a = new ModifyPoint(ModifyFlags.Scale, t[4]);
                    c.push(a);
                    let n = new ModifyPoint(ModifyFlags.Scale, t[5]);
                    c.push(n);
                    let r = new ModifyPoint(ModifyFlags.Scale, t[6]);
                    c.push(r);
                    let o = new ModifyPoint(ModifyFlags.Scale, t[7]);
                    c.push(o);
                    let l = new ModifyPoint(ModifyFlags.Scale, t[8]);
                    c.push(l);
                    let d = new ModifyPoint(ModifyFlags.Angle, t[9]);
                    c.push(d);
                }
                break;
            case Shape.PolygonShape:
            case Shape.PolygonLineShape:
                {
                    let t = w.points;
                    if (w.points.length < 1) return;
                    let e = new ModifyPoint(ModifyFlags.MoveCenter, w.center());
                    c.push(e);
                    for (let e of t) {
                        let t = new ModifyPoint(ModifyFlags.MovePoint, e);
                        c.push(t);
                    }
                }
                break;
            case Shape.AnyShape:
            case Shape.AnyLineShape:
                {
                    if (w.points.length < 1) return;
                    let t = new ModifyPoint(ModifyFlags.MoveCenter, w.center());
                    c.push(t);
                }
                break;
            default:
                break;
        }
    }
    _onChangedSelectROI() {
        if (this.selectROIChanged != null && this.selectROIChanged != undefined) {
            this.selectROIChanged();
        }
    }
    getSelectROI() {
        return this.selectROIs;
    }
    getMainSelectROI() {
        if (this.selectROIs.length < 1) return undefined;
        return this.selectROIs[0];
    }
    clearWindow() {
        this.clearROI();
        this.clearDisplay();
        this.render();
    }
    clearROI() {
        this.rois = [];
        this.selectROIs = [];
        this.drawROI = null;
        this.lastModifyROI = null;
    }
    _selectLastAddROI(t) {
        this._clearSelectedROI();
        let i = this.rois.length;
        let s = i - t;
        if (s < 0) return;
        for (let e = s; e < i; e++) {
            let t = this.rois[e];
            t.selected = true;
            this.selectROIs.push(t);
        }
        this._onChangedSelectROI();
    }
    copyROI() {
        let t = this.selectROIs.length;
        for (let t of this.selectROIs) {
            this.addROI(t.clone());
        }
        this._selectLastAddROI(t);
        this.drawState = DrawState.StartMoveROI;
    }
    moveROI() {
        this.drawState = DrawState.StartMoveROI;
    }
    selectAllROI() {
        this.selectROIs = [];
        for (let t of this.rois) {
            t.selected = true;
            this.selectROIs.push(t);
        }
        this._onChangedSelectROI();
    }
    selectOneROI(index, clear = true) {
        if (index < 0 || index > this.rois.length - 1) return;
        if (clear) {
            this._clearSelectedROI();
        }
        this.rois[index].selected = true;
        this.selectROIs.push(this.rois[index]);
        this._onChangedSelectROI();
    }
    deleteROI() {
        this.selectROIs = [];
        let e = [];
        for (let t of this.rois) {
            if (!t.selected) {
                e.push(t);
            }
        }
        this.rois = e;
        this._onChangedSelectROI();
        this.render();
    }
    _testSelectROI(roi) {
        let e = roi.boundingRect(new Size(this.image.width, this.image.height));
        if (
            this.drawTempRect === null ||
            this.drawTempRect === undefined
        ) {
            return false;
        }
        if (this.drawTempRect.isEmpty()) {
            this.drawTempRect.setSize(1, 1);
        }
        return e.intersects(this.drawTempRect);
    }
    _selectROI(shift) {
        if (!shift) this._clearSelectedROI();
        for (let i of this.rois) {
            let t = false;
            if (i.selected === undefined || i.selected === null) t = false;
            else t = i.selected;
            let e = this._testSelectROI(i);
            if (e) {
                if (shift) i.selected = !t;
                else i.selected = true;
            }
            if (i.selected) this.selectROIs.push(i);
        }
        this._onChangedSelectROI();
    }
    _clearSelectedROI() {
        this.selectROIs = [];
        for (let t of this.rois) {
            t.selected = false;
        }
    }
    _testModify(r) {
        if (this.selectROIs.length === 0) return;
        let t = this._windowToImageSize(
            new Size(this.controlSize, this.controlSize)
        );
        let o = t.width();
        let l = t.height();
        let d = null;
        let w = -1;
        for (let n of this.selectROIs) {
            this._getROIModifyPoints(n);
            let a = 0;
            for (let h of n.modifyPoints) {
                let t = h.point();
                let e = t.x() - o;
                let i = t.y() - l;
                let s = new Rect(e, i, o * 2, l * 2);
                if (s.contains(r)) {
                    w = a;
                    d = n;
                    break;
                }
                a++;
            }
        }
        if (d != null) {
            this._clearSelectedROI();
            d.modifyIndex = w;
            d.selected = true;
            this.selectROIs.push(d);
        }
        return d;
    }
    _getRectByPoints(p1, p2) {
        let i = p1.x() - p2.x();
        let s = i < 0 ? p1.x() : p2.x();
        let h = p1.y() - p2.y();
        let a = h < 0 ? p1.y() : p2.y();
        let n = Math.abs(i);
        let r = Math.abs(h);
        return new Rect(s, a, n, r);
    }
    _getRectTemp(p) {
        this.drawTempRect = this._getRectByPoints(this.mouseDownPos, p);
    }
    _modifyStart() {
        let t = this._testModify(this.mouseDownPos);
        if (t != null) {
            this.lastModifyROI = t;
            this.drawState = DrawState.Modify;
            this._onChangedSelectROI();
        } else {
            this._getRectTemp(this.mouseDownPos);
        }
    }
    _calcMoveDelta() {
        return new Point(
            this.mouseMovePos.x() - this.lastMovePos.x(),
            this.mouseMovePos.y() - this.lastMovePos.y()
        );
    }
    _moveModifyCenter() {
        let t = this._calcMoveDelta();
        this.lastModifyROI.translate(t);
    }
    _moveModifyPoint() {
        let e = this.lastModifyROI.modifyIndex - 1;
        let i = this.mouseMovePos;
        switch (this.lastModifyROI.shape) {
            case Shape.PolygonShape:
            case Shape.PolygonLineShape:
                {
                    if (e > this.lastModifyROI.points.length - 1 || e < 0) return;
                    this.lastModifyROI.points[e] = i;
                }
                break;
            case Shape.LineShape:
                {
                    if (e === 0) {
                        this.lastModifyROI.setStartPoint(i);
                    } else if (e === 1) {
                        this.lastModifyROI.setEndPoint(i);
                    }
                }
                break;
            case Shape.Rect1Shape:
                {
                    let t = this.lastModifyROI.boundingRect();
                    switch (e) {
                        case 0:
                            t.setTopLeft(i);
                            break;
                        case 1:
                            t.setTopRight(i);
                            break;
                        case 2:
                            t.setBottomRight(i);
                            break;
                        default:
                            t.setBottomLeft(i);
                            break;
                    }
                    this.lastModifyROI.setRect(t);
                }
                break;
            default:
                break;
        }
    }
    _moveModifyScale() {
        let a = this.mouseMovePos;
        let e = this.lastModifyROI.center();
        switch (this.lastModifyROI.shape) {
            case Shape.Rect2Shape:
                {
                    let t = this.lastModifyROI.center();
                    let e = this.lastModifyROI.angle;
                    let i = genTransform(t.x(), t.y(), e, 0, 0, true);
                    let s = i.affinePoint(a);
                    s.setX(Math.abs(s.x() * 2));
                    s.setY(Math.abs(s.y() * 2));
                    let h = this.lastModifyROI.modifyIndex;
                    if (h == 4 || h == 5) {
                        this.lastModifyROI.setWidth(s.x());
                    } else if (h == 2 || h == 7) {
                        this.lastModifyROI.setHeight(s.y());
                    } else this.lastModifyROI.setSize(new Size(s.x(), s.y()));
                }
                break;
            case Shape.EllipseShape:
            case Shape.EllipseRingShape:
                {
                    let t = this.lastModifyROI.center();
                    let e = this.lastModifyROI.angle;
                    let i = genTransform(t.x(), t.y(), e, 0, 0, true);
                    let s = i.affinePoint(a);
                    s.setX(Math.abs(s.x() * 2));
                    s.setY(Math.abs(s.y() * 2));
                    let h = this.lastModifyROI.modifyIndex;
                    if (h == 2 || h == 3) {
                        this.lastModifyROI.setWidth(s.x());
                    } else this.lastModifyROI.setHeight(s.y());
                }
                break;
            case Shape.CircleShape:
            case Shape.CircleRingShape:
                {
                    let t = calcDistance(a, e);
                    this.lastModifyROI.setSize(new Size(t * 2, t * 2));
                }
                break;
            default:
                break;
        }
    }
    _moveModifyAngle() {
        let e = this.mouseMovePos;
        switch (this.lastModifyROI.shape) {
            case Shape.Rect2Shape:
            case Shape.EllipseShape:
            case Shape.EllipseRingShape:
                {
                    let t = this.lastModifyROI.center();
                    this.lastModifyROI.angle = calcAngle(e, t);
                }
                break;
            default:
                break;
        }
    }
    _modifyMove() {
        if (this.lastModifyROI === null || this.lastModifyROI === undefined) return;
        let t = this.lastModifyROI.modifyPoints;
        let e = this.lastModifyROI.modifyIndex;
        if (e > t.length - 1 || e < 0) return;
        switch (t[e].flag) {
            case ModifyFlags.MoveCenter:
                this._moveModifyCenter();
                break;
            case ModifyFlags.MovePoint:
                this._moveModifyPoint();
                break;
            case ModifyFlags.Scale:
                this._moveModifyScale();
                break;
            case ModifyFlags.Angle:
                this._moveModifyAngle();
                break;
        }
        this._onChangedSelectROI();
    }
    _modifyEndCallback(roi) {
        if (this.endModify != undefined && this.endModify != null) {
            this.endModify(roi);
        }
    }
    _modifyEnd() {
        this._modifyEndCallback(this.lastModifyROI);
        this.drawState = DrawState.None;
        this.lastModifyROI.modifyIndex = -1;
        this.lastModifyROI = null;
    }
    _moveROI() {
        let e = this._calcMoveDelta();
        for (let t of this.selectROIs) {
            t.translate(e);
        }
    }
    _getInformation() {
        if (this.getInformation != undefined && this.getInformation != null) {
            let t = this.image.width;
            let e = this.image.height;
            let i = this.mouseMovePos.x();
            let s = this.mouseMovePos.y();
            let h = new Information(i, s, t, e);
            this.getInformation(h);
        }
    }
    _genOneRectTemp() {
        this._getRectTemp(this.mouseDownPos);
        this.drawState = DrawState.None;
    }
    _mouseDown() {
        if (this.drawState === DrawState.Draw) this._drawStart();
        else if (this.drawState === DrawState.None) this._modifyStart();
        else if (this.drawState === DrawState.StartMoveROI)
            this.drawState = DrawState.MoveROI;
        else if (this.drawState === DrawState.Measure) {
            this.drawLine.setStartPoint(this.mouseDownPos);
            this.drawLine.setEndPoint(this.mouseDownPos);
        } else {
            this._genOneRectTemp();
        }
        this.isLeftDown = true;
        this.render();
    }
    _mouseMiddleMove() {
        this._moveImage();
        this.render();
    }
    _mouseMove() {
        if (this.drawState === DrawState.Draw) {
            this._drawMove();
        } else if (this.drawState === DrawState.Modify) {
            this._modifyMove();
        } else if (this.drawState === DrawState.MoveROI) {
            this._moveROI();
        } else if (this.drawState === DrawState.Measure) {
            this.drawLine.setStartPoint(this.mouseDownPos);
            this.drawLine.setEndPoint(this.mouseMovePos);
        } else {
            this._getRectTemp(this.mouseMovePos);
        }
        this.render();
    }
    _mouseLeftUp(t) {
        if (this.drawState === DrawState.MoveROI) {
            this.drawState = DrawState.None;
        } else if (this.drawState === DrawState.Modify) {
            this._modifyEnd();
        } else if (this.drawState === DrawState.Measure) {
            this.drawState = DrawState.None;
            this.drawLine = new Line();
        } else {
            this._selectROI(t);
            this.drawTempRect = new Rect();
        }
        this.isLeftDown = false;
        this.render();
    }
    _mouseRightUp() {
        this.isNoMenu = false;
        if (this.drawState === DrawState.Modify) {
            this._modifyEnd();
        } else if (this.drawState === DrawState.Draw) {
            this._drawEnd();
            this.isNoMenu = true;
        } else {
            this.drawTempRect = new Rect();
        }
        this.isRightDown = false;
        this.render();
    }
    _mouseMiddleUp() {
        this.isMiddleDown = false;
        this.render();
    }
    _zoomImageEvent(t) {
        let e = t.deltaY;
        let i = 1;
        if (e >= 100) i = 0.9;
        else if (e <= -100) i = 1 / 0.9;
        let s = new Point(t.offsetX, t.offsetY);
        this._zoomImage(i, s);
    }
    _addEvent() {
        this.canvas["this_display"] = this;
        this.canvas.onmousedown = function (t) {
            let e = t.buttons;
            let i = this["this_display"];
            if (i === undefined || i === null) return;
            i.mouseDownPos = i._windowToImagePoint(new Point(t.offsetX, t.offsetY));
            if (e & 1) {
                i._mouseDown();
            } else if (e & 2) {
                i.isRightDown = true;
            } else if (e & 4) {
                i.isMiddleDown = true;
            }
            i.lastMovePos = i.mouseDownPos;
        };
        this.canvas.onmouseup = function (t) {
            let e = t.buttons;
            let i = this["this_display"];
            if (i === undefined || i === null) return;
            i.mouseUpPos = i._windowToImagePoint(new Point(t.offsetX, t.offsetY));
            if (i.isLeftDown) {
                i._mouseLeftUp(t.shiftKey);
            }
            if (i.isRightDown) {
                i._mouseRightUp();
            }
            if (i.isMiddleDown) {
                i._mouseMiddleUp();
            }
            i.lastMovePos = i.mouseUpPos;
        };
        this.canvas.onmousemove = function (t) {
            let e = t.buttons;
            let i = this["this_display"];
            if (i === undefined || i === null) return;
            i.mouseMovePos = i._windowToImagePoint(new Point(t.offsetX, t.offsetY));
            if (e & 1) {
                i._mouseMove();
            } else if (e & 4) {
                i._mouseMiddleMove();
            }
            i._getInformation();
            i.lastMovePos = i.mouseMovePos;
        };
        this.canvas.onwheel = function (t) {
            let e = this["this_display"];
            if (e === null || e === undefined) return;
            e._zoomImageEvent(t);
        };
        this.canvas.oncontextmenu = function (t) {
            let e = this["this_display"];
            if (e === null || e === undefined) return;
            if (e.isNoMenu) t.preventDefault();
        };
        this.canvas.ondblclick = function (e) {
            let t = this["this_display"];
            if (t === undefined || t === null) return;
            t.resetImage();
        };
    }
    _imageToWindow(t) {
        let e = super._imageToWindow(t);
        if (t.modifyPoints === undefined) return e;
        e.modifyPoints = t.modifyPoints;
        e.modifyIndex = t.modifyIndex;
        e.selected = t.selected;
        for (let t of e.modifyPoints) {
            t.setPoint(this._imageToWindowPoint(t.point()));
        }
        return e;
    }
    _getROIModifyControl(n, r) {
        for (let a of n.modifyPoints) {
            let t = this.controlSize;
            let e = t * 2;
            let i = a.point();
            let s = i.x() - t;
            let h = i.y() - t;
            if (r) this._drawArc(s, h, e, 0, 360);
            else {
                if (
                    n.shape == Shape.Rect2Shape ||
                    n.shape == Shape.EllipseShape ||
                    n.shape == Shape.EllipseRingShape
                ) {
                    this.ctx.resetTransform();
                    this.ctx.translate(i.x(), i.y());
                    this.ctx.rotate(Display.getRad(-n.angle));
                    if (this.isFill) {
                        this.ctx.fillRect(-t, -t, e, e);
                        this.ctx.strokeRect(-t, -t, e, e);
                    } else this.ctx.strokeRect(-t, -t, e, e);
                    this.ctx.resetTransform();
                } else {
                    if (this.isFill) {
                        this.ctx.fillRect(s, h, e, e);
                        this.ctx.strokeRect(s, h, e, e);
                    } else {
                        this.ctx.strokeRect(s, h, e, e);
                    }
                }
            }
        }
    }
    measure() {
        this.drawState = DrawState.Measure;
    }
    _drawMeasureLine() {
        if (this.drawState != DrawState.Measure || this.drawLine.isEmpty()) return;
        let sp = this.drawLine.startPoint();
        let ep = this.drawLine.endPoint();
        let t = new LineROI(sp.x(), sp.y(), ep.x(), ep.y(), this.drawColor);
        let e = this._beginDraw(t);
        this._drawSingleObject(e);
        let d = this.drawLine.distance();
        let dx = this.drawLine.offsetX();
        let dy = this.drawLine.offsetY();
        let show =
            "D=" +
            d.toFixed(2).toString() +
            ",DX=" +
            dx.toString() +
            ",DY=" +
            dy.toString();
        let c = t.center();
        this._drawSingleString(c.x(), c.y(), this.drawColor, show, 0, "");
    }
    _drawTempRect() {
        if (!this.drawTempRect.isEmpty()) {
            let t = new Rect1ROI(
                this.drawTempRect.x(),
                this.drawTempRect.y(),
                this.drawTempRect.width(),
                this.drawTempRect.height(),
                this.drawColor
            );
            let lastFill = this.isFill;
            this.isFill = false;
            let e = this._beginDraw(t);
            this._drawSingleObject(e);
            this.isFill = lastFill;
        }
        if (this.drawROI != null && this.drawROI != undefined) {
            let t = this._beginDraw(this.drawROI);
            this._drawSingleObject(t);
        }
        this._drawMeasureLine();
    }
    _drawROIs() {
        let idx = 0;
        for (let h of this.rois) {
            this._getROIModifyPoints(h);
            let t = this._beginDraw(h);
            if (t.selected != null && t.selected != undefined && t.selected) {
                this._getROIModifyControl(t);
            }
            let e = 0;
            let i = 0;
            this._drawSingleObject(t);
            let s = t.boundingRect(new Size(this.image.width, this.image.height));
            let drs = this._imageToWindowNumber(this.drawROIIndexSize);
            e = s.center().x();
            i = s.bottomRight().y() + drs;
            this.ctx.fillText(idx.toString(), e, i);
            idx++;
        }
    }
    render() {
        super.render();
        if (this.rois.length > 0) this._drawROIs();
        this._drawTempRect();
    }
}
class GUID {
    constructor(uuid = GUID.gen()) {
        this.uuid = uuid;
    }
    static gen() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    guid() {
        return this.uuid;
    }
}
function drawRoundedRect(rect, r, ctx) {
    var ptA = new Point(rect.x() + r, rect.y());
    var ptB = new Point(rect.x() + rect.width(), rect.y());
    var ptC = new Point(rect.x() + rect.width(), rect.y() + rect.height());
    var ptD = new Point(rect.x(), rect.y() + rect.height());
    var ptE = new Point(rect.x(), rect.y());
    ctx.beginPath();
    ctx.moveTo(ptA.x(), ptA.y());
    ctx.arcTo(ptB.x(), ptB.y(), ptC.x(), ptC.y(), r);
    ctx.arcTo(ptC.x(), ptC.y(), ptD.x(), ptD.y(), r);
    ctx.arcTo(ptD.x(), ptD.y(), ptE.x(), ptE.y(), r);
    ctx.arcTo(ptE.x(), ptE.y(), ptA.x(), ptA.y(), r);
}
function measureFont(ctx, fontSize, font, text) {
    if (fontSize > 0 && font != "")
        ctx.font = fontSize + "px " + font;
    return ctx.measureText(text).width;
}
class Port {
    constructor(id, name, color, visible) {
        this.id = id;
        this.color = color;
        this.name = name;
        this.visible = visible;
        this.location = new Point();
        this.node = null;
        this.scale = 1.0;
        idManager.regPort(this);
    }
    remove() {
        idManager.unregPort(this.id);
    }
    _boundingRect(display, textRight) {
        let portRadius = display.scene.portRadius;
        let portFontSize = display.scene.portFontSize;
        let font = display.scene.font;
        let wt = measureFont(display.ctx, portFontSize, font, this.name);
        let dia = portRadius * 2;
        let w = portRadius * 4 + wt;
        let h = portFontSize > dia ? portFontSize : dia;
        let y = this.location.y() - h / 2;
        let x = 0;
        if (textRight)
            x = this.location.x() - portRadius;
        else
            x = this.location.x() - w + portRadius;
        return new Rect(x, y, w, h);
    }
    _drawPort(display, node, idx, textRight) {
        let selected = node.selected;
        let hovered = node.hovered;
        let ctx = display.ctx;
        let scene = display.scene;
        let nodeDistance = scene.nodeDistance;
        let nodeOffset = scene.nodeOffset;
        let fs = scene.fontSize;
        let x = node.rect.x();
        let y = node.rect.y() + nodeOffset + fs + (nodeDistance * idx);
        if (textRight)
            this.location = new Point(x, y);
        else
            this.location = new Point(x + node.rect.width(), y);
        let lineWidth = scene.lineWidth;
        let boundColor = scene.boundColor;
        let selectedColor = scene.selectedColor;
        let hoveredColor = scene.hoveredColor;
        let portRadius = scene.portRadius * this.scale;
        if (selected) {
            ctx.strokeStyle = selectedColor;
        } else if (hovered) {
            ctx.strokeStyle = hoveredColor;
        } else {
            ctx.strokeStyle = boundColor;
        }
        ctx.fillStyle = this.color;
        ctx.lineWidth = lineWidth;
        let a = display._imageToWindowPoint(this.location);
        let b = display._imageToWindowNumber(portRadius);
        ctx.beginPath();
        display._arc(a.x(), a.y(), b * 2, 0, 360);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        let name = this.name;
        let fontColor = display.scene.fontColor;
        let portFontSize = display.scene.portFontSize;
        let font = display.scene.font;
        let fontSize = display._imageToWindowNumber(portFontSize);
        let w = measureFont(ctx, fontSize, font, this.name);
        let wlocation = null;
        if (textRight)
            wlocation = new Point(a.x() + b * 2, a.y());
        else
            wlocation = new Point(a.x() - (w + b * 2), a.y());
        display._drawSingleStringW(wlocation.x(),
            wlocation.y() + fontSize / 3, fontColor, name, fontSize, font);
    }
    test(scene, pos) {
        let portRadius = scene.portRadius * this.scale;
        let distance = calcDistance(this.location, pos);
        if (distance <= portRadius)
            return this;
        return null;
    }
    testRect(scene, rect) {
        let portRadius = scene.portRadius * this.scale;
        let x = this.location.x() - portRadius;
        let y = this.location.y() - portRadius;
        let w = portRadius * 2;
        let h = w;
        let bound = new Rect(x, y, w, h);
        let intersect = bound.intersects(rect);
        if (intersect)
            return this;
        return null;
    }
    _canConnect(p) {
        if (this.canConnect !== undefined
            && this.canConnect !== null) {
            return this.canConnect(p);
        }
        return true;
    }
}
class InPort extends Port {
    constructor(id, name, color, visible) {
        super(id, name, color, visible);
        this.fromConnection = null;
    }
    remove() {
        super.remove();
        if (this.fromConnection !== null) {
            let c = this.fromConnection;
            c.inPort.unconnect(c);
            c.delete();
            this.fromConnection = null;
        }
    }
    from(c) {
        if (c === null) {
            this.fromConnection = null;
            return true;
        }
        if (this.fromConnection === null
            || this.fromConnection === undefined) {
            this.fromConnection = c;
            return true;
        }
        return false;
    }
    boundingRect(display) {
        return this._boundingRect(display, true);
    }
    draw(display, node, idx) {
        this._drawPort(display, node, idx, true);
    }
}
class OutPort extends Port {
    constructor(id, name, color, visible) {
        super(id, name, color, visible);
        this.toConnections = [];
    }
    remove() {
        super.remove();
        for (let c of this.toConnections) {
            c.outPort.fromConnection = null;
            c.delete();
        }
        this.toConnections = [];
    }
    unconnect(c) {
        if (this.toConnections.includes(c))
            return;
        let cs = [];
        for (let conn of this.toConnections) {
            if (c !== conn) {
                cs.push(conn);
            }
        }
        this.toConnections = cs;
    }
    to(c) {
        if (this.toConnections.includes(c))
            return false;
        this.toConnections.push(c);
        return true;
    }
    clear() {
        this.toPorts = [];
    }
    boundingRect(display) {
        return this._boundingRect(display, false);
    }
    draw(display, node, idx) {
        this._drawPort(display, node, idx, false);
    }
}
class IDManager {
    constructor() {
        this.ports = new Map();
        this.nodes = new Map();
    }
    regPort(port) {
        this.ports.set(port.id, port);
    }
    regNode(node) {
        this.nodes.set(node.id, node);
    }
    unregPort(id) {
        this.ports.delete(id);
    }
    unregNode(id) {
        this.nodes.delete(id);
    }
    getPort(id) {
        return this.ports.get(id);
    }
    getNode(id) {
        return this.nodes.get(id);
    }
    hasNode(id) {
        return this.nodes.has(id);
    }
    hasPort(id) {
        return this.ports.has(id);
    }
    clear() {
        this.ports.clear();
        this.nodes.clear();
    }
}
var idManager = new IDManager();
function qMin(v1, v2) {
    return v1 > v2 ? v2 : v1;
}
function qMax(v1, v2) {
    return v1 > v2 ? v1 : v2;
}
function twoOrderBezier(t, p1, cp, p2) {
    //参数分别是t,起始点,控制点和终点
    let x1 = p1.x();
    let y1 = p1.y();
    let cx = cp.x();
    let cy = cp.y();
    let x2 = p2.x();
    let y2 = p2.y();
    let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
    let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
    return new Point(x, y);
}
function threeOrderBezier(t, p1, cp1, cp2, p2) {
    //参数分别为t，起始点，两个控制点和终点
    let x1 = p1.x();
    let y1 = p1.y();
    let cx1 = cp1.x();
    let cy1 = cp1.y();
    let cx2 = cp2.x();
    let cy2 = cp2.y();
    let x2 = p2.x();
    let y2 = p2.y();
    let x =
        x1 * (1 - t) * (1 - t) * (1 - t) +
        3 * cx1 * t * (1 - t) * (1 - t) +
        3 * cx2 * t * t * (1 - t) +
        x2 * t * t * t;
    let y =
        y1 * (1 - t) * (1 - t) * (1 - t) +
        3 * cy1 * t * (1 - t) * (1 - t) +
        3 * cy2 * t * t * (1 - t) +
        y2 * t * t * t;
    return new Point(x, y);
}
function getBezierT(x1, x2, x3, x4, X) {
    const a = -x1 + 3 * x2 - 3 * x3 + x4;
    const b = 3 * x1 - 6 * x2 + 3 * x3;
    const c = -3 * x1 + 3 * x2;
    const d = x1 - X;
    // 盛金公式, 预先需满足, a !== 0
    // 判别式
    const A = Math.pow(b, 2) - 3 * a * c;
    const B = b * c - 9 * a * d;
    const C = Math.pow(c, 2) - 3 * b * d;
    const delta = Math.pow(B, 2) - 4 * A * C;
    let t1 = -100, t2 = -100, t3 = -100;
    // 3个相同实数根
    if (A === B && A === 0) {
        t1 = -b / (3 * a);
        t2 = -c / b;
        t3 = -3 * d / c;
        return [t1, t2, t3];
    }
    // 1个实数根和1对共轭复数根
    if (delta > 0) {
        const v = Math.pow(B, 2) - 4 * A * C;
        const xsv = v < 0 ? -1 : 1;

        const m1 = A * b + 3 * a * (-B + (v * xsv) ** (1 / 2) * xsv) / 2;
        const m2 = A * b + 3 * a * (-B - (v * xsv) ** (1 / 2) * xsv) / 2;

        const xs1 = m1 < 0 ? -1 : 1;
        const xs2 = m2 < 0 ? -1 : 1;

        t1 = (-b - (m1 * xs1) ** (1 / 3) * xs1 - (m2 * xs2) ** (1 / 3) * xs2) / (3 * a);
        // 涉及虚数，可不考虑。i ** 2 = -1
    }
    // 3个实数根
    if (delta === 0) {
        const K = B / A;
        t1 = -b / a + K;
        t2 = t3 = -K / 2;
    }
    // 3个不相等实数根
    if (delta < 0) {
        const xsA = A < 0 ? -1 : 1;
        const T = (2 * A * b - 3 * a * B) / (2 * (A * xsA) ** (3 / 2) * xsA);
        const theta = Math.acos(T);
        if (A > 0 && T < 1 && T > -1) {
            t1 = (-b - 2 * A ** (1 / 2) * Math.cos(theta / 3)) / (3 * a);
            t2 = (-b + A ** (1 / 2) * (Math.cos(theta / 3) + 3 ** (1 / 2) * Math.sin(theta / 3))) / (3 * a);
            t3 = (-b + A ** (1 / 2) * (Math.cos(theta / 3) - 3 ** (1 / 2) * Math.sin(theta / 3))) / (3 * a);
        }
    }
    return [t1, t2, t3]
}
function isAboveLine(offsetX, offsetY, p1, cp1, cp2, p2) {
    // 用 x 求出对应的 t，用 t 求相应位置的 y，再比较得出的 y 与 offsetY 之间的差值
    const tsx = getBezierT(p1.x(), cp1.x(), cp2.x(), p2.x(), offsetX);
    for (let x = 0; x < 3; x++) {
        if (tsx[x] <= 1 && tsx[x] >= 0) {
            const n = threeOrderBezier(tsx[x], p1, cp1, cp2, p2);
            if (Math.abs(n.y() - offsetY) < 8) {
                return true;
            }
        }
    }
    // 如果上述没有结果，则用 y 求出对应的 t，再用 t 求出对应的 x，与 offsetX 进行匹配
    const tsy = getBezierT(p1.y(), cp1.y(), cp2.y(), p2.y(), offsetY)
    for (let y = 0; y < 3; y++) {
        if (tsy[y] <= 1 && tsy[y] >= 0) {
            const n = threeOrderBezier(tsy[y], p1, cp1, cp2, p2);
            if (Math.abs(n.x() - offsetX) < 8) {
                return true;
            }
        }
    }
}
function angleP1P2(p1, p2) {
    let dx = p1.x() - p2.x();
    if (dx == 0.0)
        dx = 0.000001;
    let dy = p1.y() - p2.y();
    let a = Math.atan2(dy, dx);
    let pi = Math.PI;
    a = (a * 180.0) / pi;
    return a;
}
function bezierPointsInRect(rect, p1, cp1, cp2, p2) {
    for (let i = 0; i < 10; i++) {
        let p = threeOrderBezier(i / 10.0, p1, cp1, cp2, p2);
        if (rect.contains(p))
            return true;
    }
    return false;
}
class Connection {
    constructor(scene, inPort, outPort, id = GUID.gen()) {
        this.id = id;
        this.scene = scene;
        this.inPort = inPort;
        this.outPort = outPort;
        this.isValid = this.inPort.to(this);
        if (this.isValid) {
            this.isValid = this.outPort.from(this);
            if (!this.isValid) {
                this.inPort.unconnect(this);
            }
        }
        this.selected = false;
        this.hovered = false;
    }
    delete() {
        this.scene.removeConnection(this);
    }
    remove() {
        this.inPort.unconnect(this);
        this.outPort.from(null);
    }
    _ctrlPoint(p1, p2) {
        const defaultOffset = 200;
        let xDistance = p1.x() - p2.x();
        let horizontalOffset = qMin(defaultOffset, Math.abs(xDistance));
        let verticalOffset = 0;
        let ratioX = 0.5;
        if (xDistance <= 0) {
            let yDistance = p1.y() - p2.y() + 20;
            let vector = yDistance < 0 ? -1.0 : 1.0;
            verticalOffset = qMin(defaultOffset, Math.abs(yDistance)) * vector;
            ratioX = 1.0;
        }
        horizontalOffset *= ratioX;
        let c1 = new Point(p2.x() + horizontalOffset,
            p2.y() + verticalOffset);
        let c2 = new Point(p1.x() - horizontalOffset,
            p1.y() - verticalOffset);
        return new Line(c1, c2);
    }
    _drawCubic(ctx, start, sp, ep, end) {
        ctx.beginPath();
        ctx.moveTo(start.x(), start.y());
        ctx.bezierCurveTo(sp.x(), sp.y(), ep.x(), ep.y(), end.x(), end.y());
        ctx.stroke();
    }
    _basicRect() {
        let iLocation = this.outPort.location;
        let oLocation = this.inPort.location;
        return new Line(iLocation, oLocation).boundingRect();
    }
    _drawArrow(display, p1, cp1, cp2, p2, arrowSize) {
        let p4 = threeOrderBezier(0.4, p1, cp1, cp2, p2);
        let p6 = threeOrderBezier(0.6, p1, cp1, cp2, p2);
        let rect = new Line(p1, p2).boundingRect();
        let a = angleP1P2(p4, p6);
        let center = rect.center();
        let as = display._imageToWindowNumber(arrowSize);
        let as2 = as;
        let h2d = new Homogeneous2D();
        h2d = h2d.translateLocal(center.x(), center.y());
        h2d = h2d.rotateLocal(-a);
        h2d = h2d.translateLocal(-center.x(), -center.y());
        let p1x = new Point(center.x() - as2, center.y());
        let p2x = new Point(center.x(), center.y() - as);
        let p3x = new Point(center.x(), center.y() + as);
        p1x = h2d.affinePoint(p1x);
        p2x = h2d.affinePoint(p2x);
        p3x = h2d.affinePoint(p3x);
        display.ctx.beginPath();
        display._drawPolygonRegion([p1x, p2x, p3x], true);
        display.ctx.fill();
    }
    _drawCircle(display, x, y, dia) {
        display.ctx.beginPath();
        display._arc(x, y, dia, 0, 360, false);
        display.ctx.closePath();
        display.ctx.fill();
    }
    boundingRect() {
        return this._basicRect();
    }
    draw(display, build = false) {
        if (!this.inPort.visible ||
            !this.outPort.visible)
            return;
        let ctx = display.ctx;
        let scene = display.scene;
        let portRadius = scene.portRadius;
        let connectLineWidth = scene.connectLineWidth;
        let connectArrowSize = scene.connectArrowSize;
        let iLocation = this.inPort.location;
        let oLocation = this.outPort.location;
        let line = this._ctrlPoint(oLocation, iLocation);
        let sp = line.startPoint();
        let ep = line.endPoint();
        sp = display._imageToWindowPoint(sp);
        ep = display._imageToWindowPoint(ep);
        iLocation = display._imageToWindowPoint(iLocation);
        oLocation = display._imageToWindowPoint(oLocation);
        let dashLineWidth = display._imageToWindowNumber(scene.dashLineWidth);
        let iColor = this.inPort.color;
        let buildColor = scene.buildColor;
        let selectedColor = scene.selectedColor;
        let hoveredColor = scene.hoveredColor;
        if (build) {
            ctx.fillStyle = buildColor;
            ctx.strokeStyle = buildColor;
            ctx.setLineDash([dashLineWidth]);
        } else if (this.selected) {
            ctx.fillStyle = selectedColor;
            ctx.strokeStyle = selectedColor;
        } else if (this.hovered) {
            ctx.fillStyle = hoveredColor;
            ctx.strokeStyle = hoveredColor;
        } else {
            ctx.fillStyle = iColor;
            ctx.strokeStyle = iColor;
        }
        ctx.lineWidth = display._imageToWindowNumber(connectLineWidth);
        ctx.lineCap = "round";
        this._drawCubic(ctx, iLocation, sp, ep, oLocation);
        this._drawArrow(display, iLocation, sp, ep, oLocation, connectArrowSize);
        if (build)
            this._drawCircle(display, oLocation.x(), oLocation.y(), portRadius * 2);
        ctx.setLineDash([]);
    }
    test(scene, pos) {
        if (!this.inPort.visible ||
            !this.outPort.visible)
            return null;
        let iLocation = this.inPort.location;
        let oLocation = this.outPort.location;
        let line = this._ctrlPoint(oLocation, iLocation);
        let sp = line.startPoint();
        let ep = line.endPoint();
        if (isAboveLine(pos.x(), pos.y(), iLocation, sp, ep, oLocation))
            return this;
        return null;
    }
    testRect(scene, rect) {
        if (!this.inPort.visible ||
            !this.outPort.visible)
            return null;
        let iLocation = this.inPort.location;
        let oLocation = this.outPort.location;
        let line = this._ctrlPoint(oLocation, iLocation);
        let sp = line.startPoint();
        let ep = line.endPoint();
        if (rect.width() < 3 && rect.height() < 3) {
            let pos = rect.topLeft();
            if (isAboveLine(pos.x(), pos.y(), iLocation, sp, ep, oLocation))
                return this;
            return null;
        }
        if (bezierPointsInRect(rect, iLocation, sp, ep, oLocation))
            return this;
        return null;
    }
    selectRect(scene, rect) {
        let n = this.testRect(scene, rect);
        this.selected = n !== null;
    }
}
class SVGLoader{
    constructor(){
        this.res = new Map();
        this.id = [];
    }
    add(svg){
        let image = new Image();
        image.src = svg;
        image.this_loader = this;
        this.id.push(svg);
        image.onload = function(){
            let _this = image.this_loader;
            _this.res.set(svg,image);
            if(_this.onRender!==null&&_this.onRender!==undefined){
                if(_this._needRender()){
                    _this.onRender();
                }
            }
        }
    }
    get(svg){
        return this.res.get(svg);
    }
    _needRender(){
        return this.id.length===this.res.size;
    }
}
class NodeScene {
    constructor(color = "#00ff0080", boundColor = "#000000", selectedColor = "#0000aa",
        hoveredColor = "#0000ff", buildColor = "#44444480", fontColor = "#000000",
        font = "微软雅黑", fontSize = 15, portFontSize = 10, lineWidth = 3,
        dashLineWidth = 10, nodeDistance = 35, nodeOffset = 20, radius = 2,
        portRadius = 5, connectLineWidth = 3, connectArrowSize = 10,
        iconSize = 64, iconIsFill = true, iconColor = "#000000") {
        this.color = color;
        this.boundColor = boundColor;
        this.selectedColor = selectedColor;
        this.hoveredColor = hoveredColor;
        this.buildColor = buildColor;
        this.dashLineWidth = dashLineWidth;
        this.radius = radius;
        this.font = font;
        this.fontSize = fontSize;
        this.fontColor = fontColor;
        this.portFontSize = portFontSize;
        this.lineWidth = lineWidth;
        this.portRadius = portRadius;
        this.connectLineWidth = connectLineWidth;
        this.connectArrowSize = connectArrowSize;
        this.iconSize = iconSize;
        this.iconIsFill = iconIsFill;
        this.iconColor = iconColor;
        this.nodeDistance = nodeDistance;
        this.nodeOffset = nodeOffset;
        this.nodes = new Map();
        this.connections = new Map();
        this.selectNodes = new Map();
        this.selectConnections = new Map();
        this.dragConnection = null;
        this.dragTempInPort = null;
        this.dragTempOutPort = null;
        this.dragPort = null;
        this.dragThatPort = null;
        this.dragState = 0;
        this.grabScalePort = null;
        this.svgLoader = new SVGLoader();
    }
    setRender(display){
        this.svgLoader.onRender = function(){
            display.render();
        };
    }
    dragStart(p, pos) {
        this.dragPort = p;
        let inDrag = p instanceof InPort;
        if (inDrag) {
            if (p.fromConnection === null ||
                p.fromConnection === undefined) {
                this.dragTempOutPort = new OutPort(GUID.gen(), "", "#000000", true);
                this.dragConnection = new Connection(this, this.dragTempOutPort, p);
                this.dragState = 1;
            } else {
                let that = p.fromConnection.inPort;
                this.dragThatPort = that;
                p.fromConnection.delete();
                this.dragTempInPort = new InPort(GUID.gen(), "", "#000000", true);
                this.dragConnection = new Connection(this, that, this.dragTempInPort);
                this.dragState = 2;
            }
        } else {
            this.dragTempInPort = new InPort(GUID.gen(), "", "#000000", true);
            this.dragConnection = new Connection(this, p, this.dragTempInPort);
            this.dragState = 3;
        }
        if (this.dragTempInPort != null
            && this.dragTempInPort != undefined) {
            this.dragTempInPort.location = pos;
        }
        if (this.dragTempOutPort != null
            && this.dragTempOutPort != undefined) {
            this.dragTempOutPort.location = pos;
        }
    }
    dragMove(pos) {
        if (this.grabScalePort !== null && this.grabScalePort !== undefined) {
            this.grabScalePort.scale = 1.0;
        }
        let p = this.test(pos);
        if (this.dragTempInPort != null
            && this.dragTempInPort != undefined) {
            this.dragTempInPort.location = pos;
            let canConn = false;
            if (p instanceof InPort) {
                if (this.dragState === 3)
                    canConn = this.dragPort._canConnect(p);
                else if (this.dragState === 2)
                    canConn = this.dragThatPort._canConnect(p);
                if (canConn) {
                    if (p.fromConnection === null ||
                        p.fromConnection === undefined) {
                        p.scale = 2.0;
                        this.grabScalePort = p;
                    }
                }
                else {
                    p.scale = 1.0;
                }
            }
        }
        if (this.dragTempOutPort != null
            && this.dragTempOutPort != undefined) {
            this.dragTempOutPort.location = pos;
            let canConn = false;
            if (p instanceof OutPort) {
                if (this.dragState === 1)
                    canConn = p._canConnect(this.dragPort);
                if (canConn) {
                    p.scale = 2.0;
                    this.grabScalePort = p;
                }
                else
                    p.scale = 1.0;
            }
        }
    }
    dragEnd(pos) {
        this.dragConnection.remove();
        this.dragConnection = null;
        this.dragTempInPort = null;
        this.dragTempOutPort = null;
        let p = this.test(pos);
        if (this.grabScalePort !== null && this.grabScalePort !== undefined) {
            this.grabScalePort.scale = 1.0;
        }
        if (p instanceof Port) {
            if (this.dragState === 1 && p instanceof OutPort) {
                let conn = new Connection(this, p, this.dragPort);
                if (conn.isValid)
                    this.addConnection(conn);
            } else if (this.dragState === 2 && p instanceof InPort) {
                let conn = new Connection(this, this.dragThatPort, p);
                if (conn.isValid)
                    this.addConnection(conn);
            } else if (this.dragState === 3 && p instanceof InPort) {
                let conn = new Connection(this, this.dragPort, p);
                if (conn.isValid)
                    this.addConnection(conn);
            }
        }
    }
    addNode(node) {
        this.svgLoader.add(node.icon);
        this.nodes.set(node.id,node);
        if (this.onAddNode !== null &&
            this.onAddNode !== undefined) {
            this.onAddNode();
        }
    }
    addConnection(c) {
        this.connections.set(c.id,c);
        if (this.onAddConnection !== null &&
            this.onAddConnection !== undefined) {
            this.onAddConnection();
        }
    }
    createNode(name, x, y, icon = "", id = GUID.gen()) {
        let node = new Node(name, new Point(x, y), icon, id);
        this.addNode(node);
        return node;
    }
    createConnection(ip, op ,id=GUID) {
        let conn = new Connection(this, ip, op);
        this.addConnection(conn);
    }
    removeNode(node) {
        node.remove();
        this.nodes.delete(node.id);
        this.selectNodes.delete(node.id);
        this.nodes = ns;
        if (this.onDeleteNode !== null &&
            this.onDeleteNode !== undefined) {
            this.onDeleteNode();
        }
        this._onSelectChange();
    }
    removeConnection(conn) {
        conn.remove();
        this.connections.delete(conn.id);
        this.selectConnections.delete(conn.id);
        if (this.onDeleteConnection !== null &&
            this.onDeleteConnection !== undefined) {
            this.onDeleteConnection();
        }
    }
    clear() {
        this.nodes.forEach(function (n) {
            n.remove();
        });
        this.connections.forEach(function (c) {
            c.remove();
        });
        this.nodes.clear();
        this.connections.clear();
        this.selectConnections.clear();
        this.selectNodes.clear();
        if (this.onClear !== null &&
            this.onClear !== undefined) {
            this.onClear();
        }
        this._onSelectChange();
    }
    _drawBackgroud(display) {
        if (this.dragBackgroud === null || this.dragBackgroud !== undefined)
            this.dragBackgroud(display);
    }
    _drawDragLine(display) {
        if (this.dragConnection !== null && this.dragConnection !== undefined)
            this.dragConnection.draw(display, true);
    }
    draw(display) {
        this._drawBackgroud(display);
        for (let [k, n] of this.nodes) {
            n.draw(display);
        }
        for (let [k, c] of this.connections) {
            c.draw(display);
        }
        this._drawDragLine(display);
    }
    test(pos) {
        for (let [k, n] of this.nodes) {
            let ret = n.test(this, pos)
            if (ret != null && ret != undefined)
                return ret;
        }
        for (let [k, c] of this.connections) {
            let ret = c.test(this, pos);
            if (ret != null && ret != undefined)
                return ret;
        }
    }
    testRect(rect) {
        for (let [k, n] of this.nodes) {
            let ret = n.testRect(this, rect)
            if (ret != null && ret != undefined)
                return ret;
        }
        for (let [k, c] of this.connections) {
            let ret = c.testRect(this, rect);
            if (ret != null && ret != undefined)
                return ret;
        }
    }
    _onSelectChange(){
        if(this.onSelectChanged===null||
            this.onSelectChanged===undefined||
            typeof this.onSelectChanged!=="function")
            return;
        this.onSelectChanged(this.selectNodes);
    }
    addSelect(node,shift) {
        if (this.selectNodes.size > 0) {
            if (!this.selectNodes.has(node.id)) {
                if(!shift)
                    this._clearSelected();
                node.selected = true;
                this.selectNodes.set(node.id,node);
            }
        } else {
            node.selected = true;
            this.selectNodes.set(node.id,node);
        }
    }
    selectRect(rect,shift) {
        if (!shift)
            this.selectNodes.clear();
        for (let [k, n] of this.nodes) {
            if (!n.selected || !shift) {
                n.selectRect(this, rect);
                if (n.selected) {
                    this.selectNodes.set(k, n); 
                }
            }
        }
        if (!shift)
            this.selectConnections.clear();
        for (let [k, c] of this.connections) {
            if (!c.selected || !shift) {
                c.selectRect(this, rect);
                if (c.selected) {
                    this.selectConnections.set(k, c);
                }
            }
        }
        this._onSelectChange();
    }
    deleteSelected() {
        this.deleteSelectedNodes();
        this.deleteSelectedConnections();
        this._onSelectChange();
        if (this.onDeleteSelectItem !== null &&
            this.onDeleteSelectItem !== undefined) {
            this.onDeleteSelectItem();
        }
    }
    deleteSelectedNodes() {
        for (let [k, n] of this.selectNodes) {
            n.remove();
            this.nodes.delete(k);
        }
        this.selectNodes.clear();
    }
    deleteSelectedConnections() {
        for(let [k,c] of this.connections){
            c.remove();
            this.connections.delete(k);
        }
        this.selectConnections.clear();
    }
    _clearSelected() {
        this.selectNodes.clear();
        for (let [k, n] of this.nodes){
            n.selected = false;
        }
        this.selectConnections.clear();
        for(let [k,c] of this.connections){
            c.selected = false;
        }; 
    }
    clearSelected() {
       this._clearSelected();
       this._onSelectChanged();
    }
    clearHovered() {
        for (let [k, n] of this.nodes){
            n.hovered = false;
        }
        for(let [k,c] of this.connections){
            c.hovered = false;
        }; 
    }
}
class Node {
    constructor(name, location, icon = "", id = GUID.gen()) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.location = location;
        this.selected = false;
        this.hovered = false;
        this.inPorts = [];
        this.outPorts = [];
        this.rect = new Rect();
        idManager.regNode(this);
    }
    remove() {
        for (let i of this.inPorts) {
            i.remove();
        }
        for (let o of this.outPorts) {
            o.remove();
        }
        idManager.unregNode(this.id);
    }
    getInputLength(){
        return this.inPorts.length;
    }
    getInput(idx){
        return this.inPorts[idx];
    }
    getOutputLength(){
        return this.outPorts.length;
    }
    getOutput(idx){
        return this.outPorts[idx];
    }
    _addInput(port) {
        port.node = this;
        this.inPorts.push(port);
    }
    _addOutput(port) {
        port.node = this;
        this.outPorts.push(port);
    }
    addInput(name, color = "#00ffffff", visible = true) {
        let id = GUID.gen();
        let port = new InPort(id, name, color, visible);
        this._addInput(port);
        return port;
    }
    addOutput(name, color = "#ff00ffff", visible = true) {
        let id = GUID.gen();
        let port = new OutPort(id, name, color, visible);
        this._addOutput(port);
        return port;
    }
    translate(p) {
        this.location.setX(this.location.x() + p.x());
        this.location.setY(this.location.y() + p.y());
        if (this.onMove !== null &&
            this.onMove !== undefined)
            this.onMove(this.location);
    }
    boundingRect(display) {
        let nodeDistance = display.scene.nodeDistance;
        let nodeOffset = display.scene.nodeOffset;
        let fontSize = display.scene.fontSize;
        let font = display.scene.font;
        let wt = measureFont(display.ctx, fontSize, font, this.name);
        let iconSize = display.scene.iconSize;
        let maxWidthIn = 0;
        let maxWidthOut = 0;
        let heightIn = nodeOffset;
        let heightOut = nodeOffset;
        for (let ip of this.inPorts) {
            if(!ip.visible)
                continue;
            let r = ip.boundingRect(display);
            if (r.width() > maxWidthIn); {
                maxWidthIn = r.width();
            }
            //heightIn += r.height();
            heightIn += nodeDistance;
        }
        for (let op of this.outPorts) {
            if(!op.visible)
                continue;
            let r = op.boundingRect(display);
            if (r.width() > maxWidthOut); {
                maxWidthOut = r.width();
            }
            //heightOut += r.height();
            heightOut += nodeDistance;
        }
        //heightIn += nodeOffset;
        //heightOut += nodeOffset;
        let heightMax = heightIn > heightOut ? heightIn : heightOut;
        let x = this.location.x();
        let y = this.location.y();
        let w = wt > iconSize ? wt : iconSize;
        let h = fontSize;
        w = w + maxWidthIn + maxWidthOut;
        if(heightMax < iconSize){
            h += iconSize;
        }else{
            h += heightMax;
        }
        return new Rect(x, y, w, h);
    }
    _drawText(display) {
        let rect = this.rect;
        let fontColor = display.scene.fontColor;
        let fontSize = display.scene.fontSize;
        let nodeOffset = display.scene.nodeOffset;
        let font = display.scene.font;
        let wt = measureFont(display.ctx, fontSize, font, this.name);
        let c = rect.center();
        display._drawSingleString(c.x() - wt / 2, rect.y() + nodeOffset, fontColor, this.name, fontSize, font, false);
    }
    _drawIcon(display){
        let rect = this.rect;
        let icon = this.icon;
        let iconSize = display.scene.iconSize;
        let iconSizeHalf =  iconSize / 2;
        let center = rect.center();
        let x = center.x()-iconSizeHalf;
        let y = center.y()-iconSizeHalf;
        let w = iconSize;
        let h = iconSize;
        let r = display._imageToWindowRect(new Rect(x,y,w,h));
        let image = display.scene.svgLoader.get(icon);
        if(image!==undefined&&image!==null)
            display.ctx.drawImage(image,r.x(),r.y(),r.width(),r.height());
    }
    _drawBound(display) {
        let scene = display.scene;
        let ctx = display.ctx;
        this.rect = this.boundingRect(display);
        let r = scene.radius;
        let color = scene.color;
        let boundColor = scene.boundColor;
        let lineWidth = scene.lineWidth;
        let selectedColor = scene.selectedColor;
        let hoveredColor = scene.hoveredColor;
        let nrect = display._imageToWindowRect(this.rect);
        let nr = display._imageToWindowNumber(r);
        if (this.selected) {
            ctx.strokeStyle = selectedColor;
        } else if (this.hovered) {
            ctx.strokeStyle = hoveredColor;
        } else {
            ctx.strokeStyle = boundColor;
        }
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        drawRoundedRect(nrect, nr, ctx);
        ctx.stroke();
        ctx.fill();
        this._drawText(display);
        this._drawIcon(display);
    }
    draw(display) {
        this._drawBound(display);
        let idx = 0;
        for (let ip of this.inPorts) {
            if (ip.visible) {
                ip.draw(display, this, idx);
                idx++;
            }
        }
        idx = 0;
        for (let op of this.outPorts) {
            if (op.visible) {
                op.draw(display, this, idx);
                idx++;
            }
        }
    }
    test(scene, pos) {
        for (let ip of this.inPorts) {
            if (!ip.visible)
                continue;
            let ret = ip.test(scene, pos);
            if (ret !== null)
                return ret;
        }
        for (let op of this.outPorts) {
            if (!op.visible)
                continue;
            let ret = op.test(scene, pos);
            if (ret !== null)
                return ret;
        }
        let rect = this.rect;
        if (rect.contains(pos))
            return this;
        return null;
    }
    testRect(scene, rect) {
        for (let ip of this.inPorts) {
            if (!ip.visible)
                continue;
            let ret = ip.testRect(scene, rect);
            if (ret !== null)
                return ret;
        }
        for (let op of this.outPorts) {
            if (!op.visible)
                continue;
            let ret = op.testRect(scene, rect);
            if (ret !== null)
                return ret;
        }
        let intersect = this.rect.intersects(rect);
        if (intersect)
            return this;
        return null;
    }
    selectRect(scene, rect) {
        this.selected = this.testRect(scene, rect) != null;
    }
}
class NodeDisplay extends Display {
    constructor(canvas, scene) {
        super(canvas, true, 1, DrawState.None, ImageMode.FitRatioAuto, AlignMode.CenterAlignMode, false, false, "#dddddd");
        this.scene = scene;
        this.mouseDownPos = new Point();
        this.mouseMovePos = new Point();
        this.lastMovePos = new Point();
        this.isLeftDown = false;
        this.isRightDown = false;
        this.isMiddleDown = false;
        this.isNoMenu = false;
        this.drawTempRect = new Rect();
        scene.setRender(this);
        this._addEvent();
    }
    _test(pos) {
        return this.scene.test(pos);
    }
    _testRect(rect) {
        return this.scene.testRect(rect);
    }
    _selectRect(rect,shift) {
        this.scene.selectRect(rect,shift);
    }
    _clearHovered() {
        this.scene.clearHovered();
    }
    _selectNodes() {
        return this.scene.selectNodes;
    }
    _addSelect(node,shift){
        this.drawState = DrawState.MoveROI;
        this.scene.addSelect(node,shift);
    }
    _hoverMove() {
        this._clearHovered();
        let p = this._test(this.mouseMovePos);
        if (p === null || p === undefined)
            return;
        if (p instanceof Port)
            p.node.hovered = true;
        else
            p.hovered = true;
    }
    _selectedRect(shift) {
        let rect = this.drawTempRect;
        if (rect.isEmpty())
            rect.setSize(1, 1);
        this._selectRect(rect,shift);
    }
    deleteItems() {
        this.scene.deleteSelected();
    }
    _getRectByPoints(p1, p2) {
        let i = p1.x() - p2.x();
        let s = i < 0 ? p1.x() : p2.x();
        let h = p1.y() - p2.y();
        let a = h < 0 ? p1.y() : p2.y();
        let n = Math.abs(i);
        let r = Math.abs(h);
        return new Rect(s, a, n, r)
    }
    _getRectTemp(p) {
        this.drawTempRect = this._getRectByPoints(this.mouseDownPos, p);
    }
    _drawTempRect() {
        if (!this.drawTempRect.isEmpty()) {
            let t = new Rect1ROI(this.drawTempRect.x(), this.drawTempRect.y(),
                this.drawTempRect.width(), this.drawTempRect.height(), this.scene.selectedColor);
            let lastFill = this.isFill;
            this.isFill = false;
            let e = this._beginDraw(t);
            this._drawSingleObject(e);
            this.isFill = lastFill;
        }
    }
    _moveImage() {
        let t = this.mouseMovePos.x() - this.mouseDownPos.x();
        let e = this.mouseMovePos.y() - this.mouseDownPos.y();
        this.imagePart.translate(-t, -e);
    }
    _calcMoveDelta() {
        return new Point(this.mouseMovePos.x() - this.lastMovePos.x(), this.mouseMovePos.y() - this.lastMovePos.y())
    }
    _moveNode() {
        let sns = this._selectNodes();
        let p = this._calcMoveDelta();
        for (let [k,n] of sns) {
            n.translate(p);
        }
    }
    _dragStart(p) {
        this.drawState = DrawState.Modify;
        this.scene.dragStart(p, this.mouseDownPos);
    }
    _dragMove() {
        this.scene.dragMove(this.mouseMovePos);
    }
    _dragEnd() {
        this.scene.dragEnd(this.mouseUpPos);
        this.drawState = DrawState.None;
    }
    _mouseDown(shift) {
        if (this.drawState === DrawState.None) {
            let p = this._test(this.mouseDownPos);
            if (p instanceof Node) {
                this._getRectTemp(this.mouseDownPos);
                this._addSelect(p,shift);
            } else if (p instanceof Port) {
                this._dragStart(p);
            } else {
                this._getRectTemp(this.mouseDownPos);
                this.drawState = DrawState.None;
            }
        }
        this.isLeftDown = true;
        this.render();
    }
    _mouseMove() {
        if (this.isLeftDown) {
            if (this.drawState === DrawState.MoveROI) {
                this._moveNode();
            } else if (this.drawState === DrawState.Modify) {
                this._dragMove();
            } else {
                this._getRectTemp(this.mouseMovePos);
            }
        } else if (this.isMiddleDown) {
            this._moveImage();
        } else {
            this._hoverMove();
        }
        this.render();
    }
    _updateSelected(shift){
        this._selectedRect(shift);
        this.drawTempRect = new Rect;
    }
    _mouseLeftUp(shift) {
        if (this.drawState === DrawState.Modify) {
            this._dragEnd();
        } else {
            if (this.drawState === DrawState.MoveROI) {
                this.drawState = DrawState.None;
                if(this._selectNodes().size===1)
                    this._updateSelected(shift);
            }else{
                this._updateSelected(shift);
            }
        }
        this.isLeftDown = false;
        this.render();
    }
    _mouseRightUp() {
        this.isRightDown = false;
    }
    _mouseMiddleUp() {
        this.isMiddleDown = false;
    }
    _zoomImageEvent(t) {
        let e = t.deltaY;
        let i = 1;
        if (e >= 100)
            i = .9;
        else if (e <= -100)
            i = 1 / .9;
        let s = new Point(t.offsetX, t.offsetY);
        this._zoomImage(i, s);
    }
    _addEvent() {
        this.canvas["this_display"] = this;
        this.canvas.onmousedown = function (t) {
            let e = t.buttons;
            let i = this["this_display"];
            if (i === undefined || i === null)
                return;
            i.mouseDownPos = i._windowToImagePoint(new Point(t.offsetX, t.offsetY));
            if (e & 1) {
                i._mouseDown(t.shiftKey)
            } else if (e & 2) {
                i.isRightDown = true;
            } else if (e & 4) {
                i.isMiddleDown = true;
            }
            i.lastMovePos = i.mouseDownPos;
        };
        this.canvas.onmouseup = function (t) {
            let e = t.buttons;
            let i = this["this_display"];
            if (i === undefined || i === null)
                return;
            i.mouseUpPos = i._windowToImagePoint(new Point(t.offsetX, t.offsetY));
            if (i.isLeftDown) {
                i._mouseLeftUp(t.shiftKey);
            }
            if (i.isRightDown) {
                i._mouseRightUp();
            }
            if (i.isMiddleDown) {
                i._mouseMiddleUp();
            }
            i.lastMovePos = i.mouseUpPos;
        };
        this.canvas.onmousemove = function (t) {
            let e = t.buttons; let i = this["this_display"];
            if (i === undefined || i === null)
                return;
            i.mouseMovePos = i._windowToImagePoint(new Point(t.offsetX, t.offsetY));
            i._mouseMove();
            i.lastMovePos = i.mouseMovePos
        };
        this.canvas.onwheel = function (t) {
            let e = this["this_display"];
            if (e === null || e === undefined)
                return;
            e._zoomImageEvent(t);
        };
        this.canvas.oncontextmenu = function (t) {
            let e = this["this_display"]; 
            if (e === null || e === undefined)
                return;
            if (e.isNoMenu)
                t.preventDefault();
        }
        // this.canvas.ondblclick = function (e) {
        //   let t = this["this_display"];
        //   if (t === undefined || t === null) return;
        //   t.resetImage();
        // };
    }
    render() {
        super.render();
        this.scene.draw(this);
        this._drawTempRect();
    }
}
class NodeRunner{
    constructor(scene){
        this.scene = scene;
        this.mains = this._getMain();
    }
    _getMain(){
        this._resetCalcState();
        let nodes = this.scene.nodes;
        let mains = [];
        for (let [k, n] of nodes) {
            let isNoInput = true;
            for (let i of n.inPorts) {
                if (i.fromConnection !== undefined
                    && i.fromConnection !== null) {
                    let inode = i.fromConnection.inPort.node;
                    if (inode !== null && inode !== undefined) {
                        isNoInput = false;
                        break;
                    }
                }
            }
            if (isNoInput) {
                mains.push(n);
                n.executeNodes = [];
                n.calced = true;
                this._calcOutputNode(n,n);
            } else {
                delete n.executeNodes;
            }
        }
        return mains;
    }
    _resetCalcState() {
        for (let [k, n] of this.scene.nodes) {
            n.calced = false;
        }
    }
    _calcNode(main, n) {
        n.calced = true;
        this._calcInputNode(main, n);
        main.executeNodes.push(n);
        this._calcOutputNode(main, n);
    }
    _checkCacled(v) {
        return v === null || v === undefined || v.calced;
    }
    _calcInputNode(main, n) {
        for (let i of n.inPorts) {
            if (i.fromConnection !== undefined
                && i.fromConnection !== null) {
                let inode = i.fromConnection.inPort.node;
                if (this._checkCacled(inode))
                    continue;
                this._calcNode(main, inode);
            }
        }
    }
    _calcOutputNode(main, n) {
        for (let o of n.outPorts) {
            if (o.toConnections.length === 0)
                continue;
            for (let toC of o.toConnections) {
                let onode = toC.outPort.node;
                if (this._checkCacled(onode))
                    continue;
                this._calcNode(main,onode);   
            }
        }
    }
    apply(f) {
        if (f !== null && f !== undefined && typeof f === "function") {
            for (let m of this.mains) {
                f(m);
                for (let e of m.executeNodes) {
                    f(e);
                }
            }
        }
    }
}
const PortFlags={
    Normal:0,
    OpenFile:1,
    SaveFile:2,
    Folder:3,
    Color:4,
    Font:5
}
class ParameterBase {
    constructor(name, displayName, description) {
        this.name = name;
        this.displayName = displayName;
        this.description = description;
    }
}
class PortParamater extends ParameterBase {
    constructor(name, displayName, description, value, visible) {
        super(name, displayName, description);
        this.value = value;
        this.visible = visible;
    }
}
class PortStringParamater extends PortParamater {
    constructor(name, displayName, description, value, visible, flag, options = []) {
        super(name, displayName, description, value, visible);
        this.options = options;
        this.flag = flag;
    }
}
class PortDecimalParamater extends PortParamater {
    constructor(name, displayName, description, value, visible,
        min = -Number.MAX_VALUE, max = Number.MAX_VALUE, step = 1, decimal = 6) {
        super(name, displayName, description, value, visible);
        this.max = max;
        this.min = min;
        this.step = step;
        this.decimal = decimal;
    }
}
class PortBooleanParameter extends PortParamater {
    constructor(name, displayName, description, value, visible) {
        super(name, displayName, description, value, visible,);
    }
}
class PortObjectParameter extends PortParamater {
    constructor(name, displayName, description, value, visible) {
        super(name, displayName, description, value, visible);
    }
}
class NodeParameter extends ParameterBase{
    constructor(name,displayName,description,x,y,icon){
        super(name,displayName,description);
        this.icon=icon;
        this.x=x;
        this.y=y;
        this.inputs=new Map();
        this.outputs=new Map();
    }
}
class NodeBuilder {
    constructor(name,x,y,icon,displayName = name, description = name) {
        this.initNode(name,x,y,icon,displayName,description);
    }
    _getTypeColor(param){
        if(param instanceof PortBooleanParameter){
            return "#008000";
        } else if(param instanceof PortDecimalParamater){
            return "#0055cd";
        } else if(param instanceof PortStringParamater){
            return "#ff6347";
        } else if(param instanceof PortObjectParameter){
            return "#9370db";
        }
    }
    initNode(name, x, y, icon, displayName = name, description = name) {
        this.nodeParam = new NodeParameter(name, displayName, description, x, y, icon, [], []);
    }
    addBooleanInput(name, value, visible = true, displayName = name, description = name) {
        let p = new PortBooleanParameter(name, displayName, description, value, visible);
        this.nodeParam.inputs.set(name,p);
    }
    addDecimalInput(name, value, visible = true, min = -Number.MAX_VALUE, max = Number.MAX_VALUE,
        step = 1, decimal = 6, displayName = name, description = name) {
        let p = new PortDecimalParamater(name, displayName, description, value, visible, min, max, step, decimal);
        this.nodeParam.inputs.set(name,p);
    }
    addStringInput(name, value, visible = true,options = [], flag = PortFlags.Normal,  displayName = name, description = name) {
        let p = new PortStringParamater(name, displayName, description, value, visible, flag, options);
        this.nodeParam.inputs.set(name,p);
    }
    addObjectInput(name, value, visible = true, displayName = name, description = name) {
        let p = new PortObjectParameter(name, displayName, description, value, visible);
        this.nodeParam.inputs.set(name,p);
    }
    addBooleanOutput(name, visible = true, displayName = name, description = name) {
        let p = new PortBooleanParameter(name, displayName, description, false, visible);
        this.nodeParam.outputs.set(name,p);
    }
    addDecimalOutput(name, visible = true, displayName = name, description = name) {
        let p = new PortDecimalParamater(name, displayName, description, 0.0, visible);
        this.nodeParam.outputs.set(name,p);
    }
    addStringOutput(name, visible = true, displayName = name, description = name) {
        let p = new PortStringParamater(name, displayName, description, "", visible);
        this.nodeParam.outputs.set(name,p);
    }
    addObjectOutput(name, visible = true, displayName = name, description = name) {
        let p = new PortObjectParameter(name, displayName, description, visible);
        this.nodeParam.outputs.set(name,p);
    }
    save() {
        return JSON.stringify(this.nodeParam);
    }
    restore(str) {
        this.nodeParam = JSON.parse(str);
    }
    buildNode(scene) {
        let nodeParam = this.nodeParam;
        let n = scene.createNode(nodeParam.displayName, nodeParam.x, nodeParam.y, nodeParam.icon);
        n.param = nodeParam;
        for (let [k,i] of nodeParam.inputs) {
            n.addInput(i.displayName, this._getTypeColor(i), i.visible);
        }
        for (let [k,o] of nodeParam.outputs) {
            n.addOutput(o.displayName, this._getTypeColor(o), o.visible);
        }
    }
}
class NodeLoader{
    constructor(node) {
        this.param = node.param;
    }
    getInput(name) {
        let p= this.param.inputs.get(name);
        if(p===undefined||p===null)
            return undefined;
        return p.value;
    }
    getOutput(name) {
        let p= this.param.outputs.get(name);
        if(p===undefined||p===null)
            return undefined;
        return p.value;
    }
    setInput(name){
        let p = this.param.inputs.get(name);
        if(p===null||
            p===undefined)
            return;
        p.value = value;
    }
    setOutput(name, value) {
        let p = this.param.outputs.get(name);
        if(p===null||
            p===undefined)
            return;
        p.value = value;
    }
}