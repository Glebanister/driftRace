class Layer {
    constructor(numberOfNodes, prevLayer=undefined) {
        this.nodes = [];
        for (let i = 0; i < numberOfNodes; i += 1) {
            this.nodes.push(new Node());
        }
        this.prevLayer = prevLayer;
        this.nextLayer = undefined;
        if (this.prevLayer) {
            this.tie(prevLayer);
        }
    }

    summary() {
        if (this.prevLayer) {
            this.prevLayer.summary();
        }
        console.log("Layer");
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].summary();
        }
    }

    tie(prevLayer) {
        for (let i = 0; i < prevLayer.nodes.length; i += 1) {
            for (let j = 0; j < this.nodes.length; j += 1) {
                prevLayer.nodes[i].newConn(this.nodes[j]);
            }
        }
        this.prevLayer = prevLayer;
        prevLayer.nextLayer = this;
    }

    processInput() {
        if (this.prevLayer != undefined) {
            this.prevLayer.processInput();
        }
        /*
        if (this.nextLayer) {
            console.log("Before: ");
            for (let i = 0; i < this.nextLayer.nodes.length; i += 1) {
                console.log(this.nextLayer.nodes[i].total);
            }
        }
        */
        for (let i = 0; i < this.nodes.length; i += 1) {
            this.nodes[i].push();
        }
        /*
        if (this.nextLayer) {
            console.log("After: ");
            for (let i = 0; i < this.nextLayer.nodes.length; i += 1) {
                console.log(this.nextLayer.nodes[i].total);
            }
        }
        */
    }

    setInput(input) {
        for (let i = 0; i < input.length; i++) {
            this.nodes[i].total = input[i];
        }
    }

    getOutput() {
        let out = [];
        for (let i = 0; i < this.nodes.length; i += 1) {
            out.push(this.nodes[i].predict());
        }
        return out;
    }

    reset() {
        if (this.prevLayer) {
            this.prevLayer.reset();
        }
        for (let i = 0; i < this.nodes.length; i += 1) {
            this.nodes[i].reset();
        }
    }

    inherit(parentLayer) {
        for (let i = 0; i < this.nodes.length; i += 1) {
            this.nodes[i].inherit(parentLayer.nodes[i]);
        }
    }

    rand() {
        for (let i = 0; i < this.nodes.length; i += 1) {
            this.nodes[i].rand();
        }
    }
}