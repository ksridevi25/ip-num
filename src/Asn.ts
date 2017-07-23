'use strict';

import {Validator} from "./Validator"
import {InetNumber} from "./interface/InetNumber"
import {decimalNumberToBinaryString} from "./BinaryUtils";
import * as bigInt from "big-integer"

/**
 * Represents an Autonomous System Number. Which is a number that is used to identify
 * a group of IP addresses with a common, clearly defined routing policy.
 *
 * For more see https://en.wikipedia.org/wiki/Autonomous_system_(Internet)
 */
export class Asn implements InetNumber {
    readonly value:bigInt.BigInteger;
    private static AS_PREFIX = "AS";

    static of(rawValue:string | number):Asn {
        return new Asn(rawValue);
    };

    constructor(rawValue:string | number) {
        if (typeof rawValue === 'string') {
            if (Asn.startWithASprefix(rawValue)) {
                this.value = bigInt(parseInt(rawValue.substring(2)));
            } else if(rawValue.indexOf(".") != -1) {
                this.value = bigInt(this.parseFromDotNotation(rawValue));
            } else {
                this.value = bigInt(parseInt(rawValue));
            }
        }
        if (typeof rawValue === 'number') {
            if (!Validator.isValidAsnNumber(rawValue)) {
                throw Error(Validator.invalidAsnRangeMessage);
            }
            this.value = bigInt(rawValue);
        }
    }

    public getValue():bigInt.BigInteger {
        return this.value;
    }

    toString():string {
        let stringValue = this.value.toString();
        return `${Asn.AS_PREFIX}${stringValue}`;
    }

    toASPlain():string {
        return this.value.toString();
    }

    toASDot():string {
        if (this.value.valueOf() >= 65536) {
            return this.toASDotPlus();
        }
        return this.toASPlain();
    }

    toASDotPlus():string {
        let high = Math.floor(this.value.valueOf() / 65535);
        let low = (this.value.valueOf() % 65535) - high;
        return `${high}.${low}`;
    }

    toBinaryString():string {
        return decimalNumberToBinaryString(this.value.valueOf());
    }

    is16Bit():boolean {
        return Validator.isWithinRange(this.value.valueOf(), 0, Validator.SIXTEEN_BIT_SIZE);
    }

    is32Bit():boolean {
        return !this.is16Bit();
    }

    isEquals(anotherAsn:Asn):boolean {
        return this.value.equals(anotherAsn.value);
    }

    isGreaterThan(anotherAsn:Asn):boolean {
        return this.value.greater(anotherAsn.value);
    }

    isLessThan(anotherAsn:Asn):boolean {
        return this.value.lesser(anotherAsn.value);
    }

    isGreaterThanOrEquals(anotherAsn:Asn):boolean {
        return this.value.greaterOrEquals(anotherAsn.value);
    }

    isLessThanOrEquals(anotherAsn:Asn):boolean {
        return this.value.lesserOrEquals(anotherAsn.value);
    }

    next():Asn {
        return new Asn(this.value.valueOf() + 1);
    }

    previous():Asn {
        return new Asn(this.value.valueOf() - 1)
    }

    hasNext():boolean {
        return this.value.valueOf() < Validator.THIRTY_TWO_BIT_SIZE;
    }

    hasPrevious():boolean {
        return this.value.valueOf() > 0;
    }

    private static startWithASprefix(word:string):boolean {
        return word.indexOf(Asn.AS_PREFIX) === 0;
    }

    private parseFromDotNotation(rawValue: string): number {
        let dotPosition = rawValue.indexOf(".");
        let high = parseInt(rawValue.substring(0, dotPosition));
        let low = parseInt(rawValue.substring(dotPosition + 1));
        return (high * 65535) + (low + high);
    }
}