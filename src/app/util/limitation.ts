export class Bounds {
    lower: number;
    upper: number;
    exceptions: number[];

    constructor(lower: number, upper: number, exceptions: number[] = null) {
        this.lower = lower;
        this.upper = upper;
        this.exceptions = exceptions;
    }

    public isValid(num: number): boolean {
        if (this.lower != null && num < this.lower) {
            return false;
        }
        if (this.upper != null && num > this.upper) {
            return false;
        }
        if (this.exceptions) {
            for (let i = 0; i < this.exceptions.length; i++) {
                if (num === this.exceptions[i]) {
                    return false;
                }
            }
        }
        return true;
    }
}

export interface ItemQuantityBounds {
    itemId: string;
    bounds: Bounds;
};

export interface Limitation {
    itemQuantityBounds: ItemQuantityBounds[];
    itemTypeBounds: Bounds;
    name: string;
};