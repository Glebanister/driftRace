class Node {
    constructor() {
        this.total = 0.0;
        this.conn = [];
    }

    summary() {
        console.log(this.conn);
    }

    push() {
        for (let i = 0; i < this.conn.length; i += 1) {
            this.conn[i][0].total += this.conn[i][1] * Math.sign(this.total);
        }
    }

    reset() {
        this.total = 0.0;
    }

    newConn(node, weight=Math.random()) {
        this.conn.push([node, weight]);
    }

    predict() {
        return this.total > 0.0;
    }

    inherit(parentNode) {
        for (let i = 0; i < this.conn.length; i += 1) {
            this.conn[i][1] = parentNode.conn[i][1] + (Math.random() * 2 - 1) * PACE;
        }
    }

    rand() {
        for (let i = 0; i < this.conn.length; i += 1) {
            this.conn[i][1] = Math.random() - 0.5;
        }
    }
}