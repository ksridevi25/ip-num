import {IPv4, IPv4CidrRange, IPv4Prefix, IPv6, IPv6CidrRange, IPv6Prefix, Range} from "../src";

describe('Range: ', () => {

    it("test for of", () => {
        let range = new Range(new IPv4("0.0.0.254"), new IPv4("0.0.1.2"));
        let index = 0;
        let expected = ["0.0.0.254","0.0.0.255", "0.0.1.0", "0.0.1.1", "0.0.1.2"];
        for (let ip of range) {
            expect(ip.toString()).toBe(expected[index]);
            index++;
        }
    });

    it('take without count', () => {
        let range = new Range(new IPv4("0.0.0.254"), new IPv4("0.0.1.2"));
        let index = 0;
        let expected = ["0.0.0.254","0.0.0.255", "0.0.1.0", "0.0.1.1", "0.0.1.2"];
        for (let ip of range.take()) {
            expect(ip.toString()).toBe(expected[index]);
            index++;
        }
    });

    it('take with count', () => {
        let range = new Range(new IPv4("0.0.0.0"), new IPv4("255.255.255.255"));
        let index = 0;
        let expected = ["0.0.0.0","0.0.0.1", "0.0.0.2", "0.0.0.3", "0.0.0.4"];
        for (let ip of range.take(5)) {
            expect(ip.toString()).toBe(expected[index]);
            index++;
        }
    });

    it("fromCidr static constructor for IPv4", () => {
        let range = Range
            .fromCidrRange(
                new IPv4CidrRange(IPv4.fromDecimalDottedString("127.0.0.0"), IPv4Prefix.fromNumber(24))
            );
        expect(range.getFirst().toString()).toBe("127.0.0.0");
        expect(range.getLast().toString()).toBe("127.0.0.255");
    });

    it("fromCidr static constructor for IPv6", () => {
        let ipv6CidrRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(48));
        let range = Range
            .fromCidrRange(ipv6CidrRange);

        expect(range.getFirst().toString()).toEqual("2001:db8:0:0:0:0:0:0");
        expect(range.getLast().toString()).toEqual("2001:db8:0:ffff:ffff:ffff:ffff:ffff");
    });
});