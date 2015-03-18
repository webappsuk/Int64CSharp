﻿using System;
using System.Diagnostics;
using WebApplications.Saltarelle.JasmineTestUtils;

namespace ss
{
    public class Int64Spec : TestSuite
    {
        [TestMethod]
        public static void Tests()
        {
            //describe("", () => { });
            //it("", () => { });

            describe("Int64", () =>
            {
                it("should be defined", () =>
                {
                    Int64 a = Int64.Zero;
                    expect(a).toBeDefined();
                });

                describe("Operators", () =>
                {
                    describe("Equality", () =>
                    {
                        it("Zero should equal 0", () =>
                        {
                            Int64 a = Int64.Zero;
                            Int64 b = new Int64(0, 0, 0);

                            expect(a == b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("One should equal 1", () =>
                        {
                            Int64 a = Int64.One;
                            Int64 b = new Int64(1, 0, 0);

                            expect(a == b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("Zero should not equal 1", () =>
                        {
                            Int64 a = Int64.Zero;
                            Int64 b = new Int64(1, 0, 0);

                            expect(a == b).toBe(false);
                            expect(a.Low).not.toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("One should not equal 0", () =>
                        {
                            Int64 a = Int64.One;
                            Int64 b = new Int64(0, 0, 0);

                            expect(a == b).toBe(false);
                            expect(a.Low).not.toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("MinValue should equal -9223372036854775808", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = new Int64(0, 0, 0x8000);

                            expect(a == b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("MinValue should not equal -4611686018427387904", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = new Int64(0, 0, 0xC000);

                            expect(a == b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).not.toEqual(b.High);
                        });

                        it("MaxValue should equal 9223372036854775808", () =>
                        {
                            Int64 a = Int64.MaxValue;
                            Int64 b = new Int64(0xffffff, 0xffffff, 0x7fff);

                            expect(a == b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("MinValue should not equal 4611686018427387904", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = new Int64(0, 0, 0x4000);

                            expect(a == b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).not.toEqual(b.High);
                        });

                        it("Low-Mid boundary should equal itself", () =>
                        {
                            Int64 a = new Int64(0xffffff, 1, 0);
                            Int64 b = new Int64(0xffffff, 1, 0);

                            expect(a == b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("Low-Mid boundary should not equal max Low", () =>
                        {
                            Int64 a = new Int64(0xffffff, 1, 0);
                            Int64 b = new Int64(0xffffff, 0, 0);

                            expect(a == b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).not.toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("Mid-High boundary should equal itself", () =>
                        {
                            Int64 a = new Int64(0xffffff, 0xffffff, 1);
                            Int64 b = new Int64(0xffffff, 0xffffff, 1);

                            expect(a == b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("Mid-High boundary should not equal max Mid", () =>
                        {
                            Int64 a = new Int64(0xffffff, 0xffffff, 1);
                            Int64 b = new Int64(0xffffff, 0xffffff, 0);

                            expect(a == b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).not.toEqual(b.High);
                        });
                    });

                    describe("Inequality", () =>
                    {
                        it("Zero should equal 0", () =>
                        {
                            Int64 a = Int64.Zero;
                            Int64 b = new Int64(0, 0, 0);

                            expect(a != b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("One should equal 1", () =>
                        {
                            Int64 a = Int64.One;
                            Int64 b = new Int64(1, 0, 0);

                            expect(a != b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("Zero should not equal 1", () =>
                        {
                            Int64 a = Int64.Zero;
                            Int64 b = new Int64(1, 0, 0);

                            expect(a != b).toBe(true);
                            expect(a.Low).not.toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("One should not equal 0", () =>
                        {
                            Int64 a = Int64.One;
                            Int64 b = new Int64(0, 0, 0);

                            expect(a != b).toBe(true);
                            expect(a.Low).not.toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("MinValue should equal -9223372036854775808", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = new Int64(0, 0, 0x8000);

                            expect(a != b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("MinValue should not equal -4611686018427387904", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = new Int64(0, 0, 0xC000);

                            expect(a != b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).not.toEqual(b.High);
                        });

                        it("MaxValue should equal 9223372036854775808", () =>
                        {
                            Int64 a = Int64.MaxValue;
                            Int64 b = new Int64(0xffffff, 0xffffff, 0x7fff);

                            expect(a != b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("MinValue should not equal 4611686018427387904", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = new Int64(0, 0, 0x4000);

                            expect(a != b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).not.toEqual(b.High);
                        });

                        it("Low-Mid boundary should equal itself", () =>
                        {
                            Int64 a = new Int64(0xffffff, 1, 0);
                            Int64 b = new Int64(0xffffff, 1, 0);

                            expect(a != b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("Low-Mid boundary should not equal max Low", () =>
                        {
                            Int64 a = new Int64(0xffffff, 1, 0);
                            Int64 b = new Int64(0xffffff, 0, 0);

                            expect(a != b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).not.toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });


                        it("Mid-High boundary should equal itself", () =>
                        {
                            Int64 a = new Int64(0xffffff, 0xffffff, 1);
                            Int64 b = new Int64(0xffffff, 0xffffff, 1);

                            expect(a != b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("Mid-High boundary should not equal max Mid", () =>
                        {
                            Int64 a = new Int64(0xffffff, 0xffffff, 1);
                            Int64 b = new Int64(0xffffff, 0xffffff, 0);

                            expect(a != b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).not.toEqual(b.High);
                        });
                    });

                    describe("Greater Than or Equal To", () =>
                    {
                        it("should return Int64Max is greater than Int32Max", () =>
                        {
                            Int64 a = Int64.MaxValue;
                            Int64 b = Int32.MaxValue;

                            expect(a >= b).toBe(true);
                        });

                        it("should return Int64Max is equal to Int64Max", () =>
                        {
                            Int64 a = Int64.MaxValue;
                            Int64 b = Int64.MaxValue;

                            expect(a >= b).toBe(true);
                        });

                        it("should return Int32Max is not greater than Int64Max", () =>
                        {
                            Int64 a = Int32.MaxValue;
                            Int64 b = Int64.MaxValue;

                            expect(a >= b).toBe(false);
                        });

                        it("should return Int64Max is greater than Int64Min", () =>
                        {
                            Int64 a = Int64.MaxValue;
                            Int64 b = Int64.MinValue;

                            expect(a >= b).toBe(true);
                        });

                        it("should return Int64Min is not greater than Int64Max ", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = Int64.MaxValue;

                            expect(a >= b).toBe(false);
                        });

                        it("should return Int32Min is greater than Int64Min ", () =>
                        {
                            Int64 a = Int32.MinValue;
                            Int64 b = Int64.MinValue;

                            expect(a >= b).toBe(true);
                        });

                        it("should return Int64Min is equal to Int64Min ", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = Int64.MinValue;

                            expect(a >= b).toBe(true);
                        });

                        it("should return Int64Min is not greater than Int32Min ", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = Int32.MinValue;

                            expect(a >= b).toBe(false);
                        });
                    });

                    describe("Greater Than", () =>
                    {
                        it("should return Int64Max is greater than Int32Max", () =>
                        {
                            Int64 a = Int64.MaxValue;
                            Int64 b = Int32.MaxValue;

                            expect(a > b).toBe(true);
                        });

                        it("should return Int64Max is not greater than Int64Max", () =>
                        {
                            Int64 a = Int64.MaxValue;
                            Int64 b = Int64.MaxValue;

                            expect(a > b).toBe(false);
                        });

                        it("should return Int32Max is not greater than Int64Max", () =>
                        {
                            Int64 a = Int32.MaxValue;
                            Int64 b = Int64.MaxValue;

                            expect(a > b).toBe(false);
                        });

                        it("should return Int64Max is greater than Int64Min", () =>
                        {
                            Int64 a = Int64.MaxValue;
                            Int64 b = Int64.MinValue;

                            expect(a > b).toBe(true);
                        });

                        it("should return Int64Min is not greater than Int64Max ", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = Int64.MaxValue;

                            expect(a > b).toBe(false);
                        });

                        it("should return Int32Min is greater than Int64Min ", () =>
                        {
                            Int64 a = Int32.MinValue;
                            Int64 b = Int64.MinValue;

                            expect(a > b).toBe(true);
                        });

                        it("should return Int64Min is not greater than Int64Min ", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = Int64.MinValue;

                            expect(a > b).toBe(false);
                        });

                        it("should return Int64Min is not greater than Int32Min ", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = Int32.MinValue;

                            expect(a > b).toBe(false);
                        });
                    });

                    describe("Less Than or Equal To", () =>
                    {
                        it("should return Int32Max is less than Int64Max", () =>
                        {
                            Int64 a = Int32.MaxValue;
                            Int64 b = Int64.MaxValue;

                            expect(a <= b).toBe(true);
                        });

                        it("should return Int64Max is equal to Int64Max", () =>
                        {
                            Int64 a = Int64.MaxValue;
                            Int64 b = Int64.MaxValue;

                            expect(a <= b).toBe(true);
                        });

                        it("should return Int64Max is not less than Int32Max", () =>
                        {
                            Int64 a = Int64.MaxValue;
                            Int64 b = Int32.MaxValue;

                            expect(a <= b).toBe(false);
                        });

                        it("should return Int64Min is less than Int64Max", () =>
                        {
                            Debugger.Break();
                            Int64 a = Int64.MinValue;
                            Int64 b = Int64.MaxValue;

                            expect(a <= b).toBe(true);
                        });

                        it("should return Int64Max is not less than Int64Min ", () =>
                        {
                            Debugger.Break();
                            Int64 a = Int64.MaxValue;
                            Int64 b = Int64.MinValue;

                            expect(a <= b).toBe(false);
                        });

                        it("should return Int64Min is less than Int32Min", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = Int32.MinValue;

                            expect(a <= b).toBe(true);
                        });

                        it("should return Int64Min is equal to Int64Min ", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = Int64.MinValue;

                            expect(a <= b).toBe(true);
                        });

                        it("should return Int32Min is not less than Int64Min", () =>
                        {
                            Int64 a = Int32.MinValue;
                            Int64 b = Int64.MinValue;

                            expect(a <= b).toBe(false);
                        });
                    });

                    describe("Less Than", () =>
                    {
                        it("should return Int32Max is less than Int64Max", () =>
                        {
                            Int64 a = Int32.MaxValue;
                            Int64 b = Int64.MaxValue;

                            expect(a < b).toBe(true);
                        });

                        it("should return Int64Max is less than Int64Max", () =>
                        {
                            Int64 a = Int64.MaxValue;
                            Int64 b = Int64.MaxValue;

                            expect(a < b).toBe(false);
                        });

                        it("should return Int64Max is not less than Int32Max", () =>
                        {
                            Int64 a = Int64.MaxValue;
                            Int64 b = Int32.MaxValue;

                            expect(a < b).toBe(false);
                        });

                        it("should return Int64Min is less than Int64Max", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = Int64.MaxValue;

                            expect(a < b).toBe(true);
                        });

                        it("should return Int64Max is not less than Int64Min ", () =>
                        {
                            Int64 a = Int64.MaxValue;
                            Int64 b = Int64.MinValue;

                            expect(a < b).toBe(false);
                        });

                        it("should return Int64Min is less than Int32Min", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = Int32.MinValue;

                            expect(a < b).toBe(true);
                        });

                        it("should return Int64Min is less than Int64Min ", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = Int64.MinValue;

                            expect(a < b).toBe(false);
                        });

                        it("should return Int32Min is not less than Int64Min", () =>
                        {
                            Int64 a = Int32.MinValue;
                            Int64 b = Int64.MinValue;

                            expect(a < b).toBe(false);
                        });
                    });

                    describe("Addition", () =>
                    {
                        describe("Zero + Zero", () =>
                        {
                            it("should equal zero", () =>
                            {
                                Int64 a = Int64.Zero + Int64.Zero;

                                expect(a.Equals(Int64.Zero)).toBe(true);
                            });
                        });

                        describe("One + Zero", () =>
                        {
                            it("should equal one", () =>
                            {
                                Int64 a = Int64.One + Int64.Zero;

                                expect(a.Equals(Int64.One)).toBe(true);
                            });
                        });

                        describe("One + One", () =>
                        {
                            it("should equal two", () =>
                            {
                                Int64 a = Int64.One + Int64.One;

                                expect(a.Equals(new Int64(2, 0, 0))).toBe(true);
                            });
                        });

                        describe("Int32Max + One", () =>
                        {
                            it("should equal 2147483648", () =>
                            {
                                Int64 a = new Int64(0xffffff, 0x7f, 0) + Int64.One;

                                expect(a.Equals(new Int64(0, 0x80, 0))).toBe(true);
                            });
                        });

                        describe("Int32Max + Int32Max", () =>
                        {
                            it("should equal 4294967294", () =>
                            {
                                Int64 a = new Int64(0xffffff, 0x7f, 0);
                                Int64 b = new Int64(0xffffff, 0x7f, 0);

                                expect(a + b == new Int64(0xfffffe, 0xff, 0)).toBe(true);
                            });
                        });

                        describe("Int32Min + Int32Min", () =>
                        {
                            it("should equal -4294967294", () =>
                            {
                                Int64 a = Int32.MinValue;

                                expect(a + a == new Int64(0, 0xffff00, 0xffff)).toBe(true);
                            });
                        });

                        describe("Int32Min + Int32Max", () =>
                        {
                            it("should equal -1", () =>
                            {
                                Int64 a = Int32.MinValue;
                                Int64 b = Int32.MaxValue;

                                expect(a + b == new Int64(0xffffff, 0xffffff, 0xffff)).toBe(true);
                                expect(b + a == new Int64(0xffffff, 0xffffff, 0xffff)).toBe(true);
                            });
                        });

                        describe("Int64Min + Int64Max", () =>
                        {
                            it("should equal -1", () =>
                            {
                                Int64 a = Int64.MinValue;
                                Int64 b = Int64.MaxValue;

                                expect(a + b == new Int64(0xffffff, 0xffffff, 0xffff)).toBe(true);
                                expect(b + a == new Int64(0xffffff, 0xffffff, 0xffff)).toBe(true);
                            });
                        });

                        describe("Int64Min + Int64Max + Int64Max ", () =>
                        {
                            it("should equal -1", () =>
                            {
                                Int64 a = Int64.MinValue;
                                Int64 b = Int64.MaxValue;

                                expect(a + b + b == new Int64(0xfffffe, 0xffffff, 0x7fff)).toBe(true);
                                expect(b + a + b == new Int64(0xfffffe, 0xffffff, 0x7fff)).toBe(true);
                                expect(b + b + a == new Int64(0xfffffe, 0xffffff, 0x7fff)).toBe(true);
                            });
                        });
                    });

                    describe("Subtraction", () =>
                    {
                        describe("Zero - Zero", () =>
                        {
                            it("should equal zero", () =>
                            {
                                Int64 a = Int64.Zero - Int64.Zero;

                                expect(a.Equals(Int64.Zero)).toBe(true);
                            });
                        });

                        describe("One - Zero", () =>
                        {
                            it("should equal one", () =>
                            {
                                Int64 a = Int64.One - Int64.Zero;

                                expect(a.Equals(Int64.One)).toBe(true);
                            });
                        });

                        describe("One - One", () =>
                        {
                            it("should equal Zero", () =>
                            {
                                Int64 a = Int64.One - Int64.One;

                                expect(a == Int64.Zero).toBe(true);
                            });
                        });

                        describe("Int32Max - One", () =>
                        {
                            it("should equal 2147483646", () =>
                            {
                                Int64 a = new Int64(0xffffff, 0x7f, 0) - Int64.One;

                                expect(a.Equals(new Int64(0xfffffe, 0x7f, 0))).toBe(true);
                            });
                        });

                        describe("Int32Max - Int32Max", () =>
                        {
                            it("should equal 0", () =>
                            {
                                Int64 a = new Int64(0xffffff, 0x7f, 0);
                                Int64 b = new Int64(0xffffff, 0x7f, 0);

                                expect(a - b == Int64.Zero).toBe(true);
                            });
                        });

                        describe("Int32Min - Int32Min", () =>
                        {
                            it("should equal 0", () =>
                            {
                                Int64 a = Int32.MinValue;

                                expect(a - a == Int64.Zero).toBe(true);
                            });
                        });

                        describe("Int32Min - Int32Max", () =>
                        {
                            it("should equal -4294967295", () =>
                            {
                                Int64 a = Int32.MinValue;
                                Int64 b = Int32.MaxValue;

                                expect(a - b == new Int64(1, 0xffff00, 0xffff)).toBe(true);
                            });
                        });

                        describe("- Int64Max - Int64Min", () =>
                        {
                            it("should equal 1", () =>
                            {
                                Int64 a = Int64.MinValue;
                                Int64 b = Int64.MaxValue;

                                expect(-b - a == Int64.One).toBe(true);
                            });
                        });

                        describe("Int64Min + Int64Max - Int64Min ", () =>
                        {
                            it("should equal -9223372036854775807", () =>
                            {
                                Int64 a = Int64.MinValue;
                                Int64 b = Int64.MaxValue;

                                expect(a - b - a == new Int64(1, 0, 0x8000)).toBe(true);
                            });
                        });
                    });

                    describe("Multiplication", () =>
                    {
                        describe("Zero * Zero", () =>
                        {
                            it("should equal Zero", () =>
                            {
                                Int64 a = Int64.Zero;

                                expect(a * a == Int64.Zero).toBe(true);
                            });
                        });

                        describe("One * Zero", () =>
                        {
                            it("should equal Zero", () =>
                            {
                                Int64 a = Int64.One;
                                Int64 b = Int64.Zero;

                                expect(a * b == Int64.Zero).toBe(true);
                            });
                        });

                        describe("One * One", () =>
                        {
                            it("should equal One", () =>
                            {
                                Int64 a = Int64.One;

                                expect(a * a == Int64.One).toBe(true);
                            });
                        });

                        describe("-One * -One", () =>
                        {
                            it("should equal One", () =>
                            {
                                Int64 a = -Int64.One;

                                expect(a * a == Int64.One).toBe(true);
                            });
                        });

                        describe("-One * One", () =>
                        {
                            it("should equal -1", () =>
                            {
                                Int64 a = Int64.One;

                                expect(-a * a == -Int64.One).toBe(true);
                            });
                        });

                        describe("3 * 715827882", () =>
                        {
                            it("should equal 2147483646", () =>
                            {
                                Int64 a = new Int64(3, 0, 0);
                                Int64 b = new Int64(0xaaaaaa, 0x2a, 0);

                                expect(a * b == new Int64(0xfffffe, 0x7f, 0)).toBe(true);
                            });
                        });

                        describe("60247241209 * 153092023", () =>
                        {
                            it("should equal 9223372036854775807", () =>
                            {
                                Int64 a = new Int64(0x03f1f9, 0xe07, 0);
                                Int64 b = new Int64(0x1fffb7, 0x9, 0);

                                expect(a * b == Int64.MaxValue).toBe(true);
                            });
                        });

                        describe("Int64Max * Int64Max", () =>
                        {
                            it("should equal 1", () =>
                            {
                                Int64 a = Int64.MaxValue;

                                expect(a * a == Int64.One).toBe(true);
                            });
                        });

                        describe("34359738368 * -268435456", () =>
                        {
                            it("should equal -9223372036854775808", () =>
                            {
                                Int64 a = new Int64(0x000000, 0x000800, 0x0000);
                                Int64 b = new Int64(0x000000, 0xfffff0, 0xffff);

                                expect(a * b == Int64.MinValue).toBe(true);
                            });
                        });

                        describe("Int64Min * Int64Min", () =>
                        {
                            it("should equal 0", () =>
                            {
                                Int64 a = Int64.MinValue;

                                expect(a * a == Int64.Zero).toBe(true);
                            });
                        });
                    });

                    describe("Division", () =>
                    {
                        describe("Zero / Zero", () =>
                        {
                            it("should throw Divide by zero Exception", () =>
                            {
                                Int64 a = Int64.Zero;

                                expect(new Func<Int64>(() => a / a)).toThrow();
                            });
                        });

                        describe("One / Zero", () =>
                        {
                            it("should throw Divide by zero Exception", () =>
                            {
                                Int64 a = Int64.One;
                                Int64 b = Int64.Zero;

                                expect(new Func<Int64>(() => a / b)).toThrow();
                            });
                        });

                        describe("Zero / One", () =>
                        {
                            it("should equal 0", () =>
                            {
                                Int64 a = Int64.One;
                                Int64 b = Int64.Zero;

                                expect(b / a == Int64.Zero).toBe(true);
                            });
                        });

                        describe("One / One", () =>
                        {
                            it("should equal One", () =>
                            {
                                Int64 a = Int64.One;

                                expect(a / a == Int64.One).toBe(true);
                            });
                        });

                        describe("-One / -One", () =>
                        {
                            it("should equal 1", () =>
                            {
                                Int64 a = -Int64.One;

                                expect(a / a == Int64.One).toBe(true);
                            });
                        });

                        describe("-One / One", () =>
                        {
                            it("should equal -1", () =>
                            {
                                Int64 a = Int64.One;

                                expect(-a / a == -Int64.One).toBe(true);
                            });
                        });

                        describe("One / -One", () =>
                        {
                            it("should equal -1", () =>
                            {
                                Int64 a = Int64.One;

                                expect(a / -a == -Int64.One).toBe(true);
                            });
                        });

                        describe("9223372036854775807 / 153092023", () =>
                        {
                            it("should equal 60247241209 ", () =>
                            {
                                Int64 a = Int64.MaxValue;
                                Int64 b = new Int64(0x1fffb7, 0x9, 0);

                                expect(a / b == new Int64(0x03f1f9, 0xe07, 0)).toBe(true);
                            });
                        });

                        describe("Int64Max / Int64Max", () =>
                        {
                            it("should equal 1", () =>
                            {
                                Int64 a = Int64.MaxValue;

                                expect(a / a == Int64.One).toBe(true);
                            });
                        });

                        describe("1 / Int64Man", () =>
                        {
                            it("should equal 0", () =>
                            {
                                Int64 a = Int64.One;
                                Int64 b = Int64.MaxValue;

                                expect(a / b == Int64.Zero).toBe(true);
                            });
                        });

                        describe("1 / Int64Min", () =>
                        {
                            it("should equal 0", () =>
                            {
                                Int64 a = Int64.One;
                                Int64 b = Int64.MinValue;

                                expect(a / b == Int64.Zero).toBe(true);
                            });
                        });

                        describe("Int64Min / 1", () =>
                        {
                            it("should equal Int64Min", () =>
                            {
                                Int64 a = Int64.One;
                                Int64 b = Int64.MinValue;

                                expect(b / a == Int64.MinValue).toBe(true);
                            });
                        });

                        describe("Int64Min / Int64Min", () =>
                        {
                            it("should equal 1", () =>
                            {
                                Int64 a = Int64.MinValue;

                                expect(a / a == Int64.One).toBe(true);
                            });
                        });
                    });

                    describe("Modulo", () =>
                    {
                        describe("1 % 1", () =>
                        {
                            it("should equal 0", () =>
                            {
                                Int64 a = Int64.One;

                                expect(a % a == Int64.Zero).toBe(true);
                            });
                        });

                        describe("0 % 1", () =>
                        {
                            it("should equal 0", () =>
                            {
                                Int64 a = Int64.Zero;
                                Int64 b = Int64.One;

                                expect(a % b == Int64.Zero).toBe(true);
                            });
                        });

                        describe("1 % 0", () =>
                        {
                            it("should throw Divide by zero Exception", () =>
                            {
                                Int64 a = Int64.Zero;
                                Int64 b = Int64.One;

                                expect(new Func<Int64>(() => b / a)).toThrow();
                            });
                        });

                        describe("Int64Max % Int32Max", () =>
                        {
                            it("should equal 1", () =>
                            {
                                Int64 a = Int64.MaxValue;
                                Int64 b = Int32.MaxValue;

                                expect(a % b == Int64.One).toBe(true);
                            });
                        });

                        describe("Int64Min % Int32Max", () =>
                        {
                            it("should equal -2", () =>
                            {
                                Int64 a = Int64.MinValue;
                                Int64 b = Int32.MaxValue;

                                expect(a % b == new Int64(0xfffffe, 0xffffff, 0xffff)).toBe(true);
                            });
                        });

                        describe("Int64Min % Int32Min", () =>
                        {
                            it("should equal 0", () =>
                            {
                                Int64 a = Int64.MinValue;
                                Int64 b = Int32.MinValue;

                                expect(a % b == Int64.Zero).toBe(true);
                            });
                        });

                        describe("Int32Min % Int64Min", () =>
                        {
                            it("should equal -2147483648", () =>
                            {
                                Int64 a = Int32.MinValue;
                                Int64 b = Int64.MinValue;

                                expect(a % b == new Int64(0x000000, 0xffff80, 0xffff)).toBe(true);
                            });
                        });
                    });

                    describe("Increment", () =>
                    {
                        describe("++", () =>
                        {
                            it("should increment the Int64Min", () =>
                            {
                                Int64 a = Int64.MinValue;
                                a++;

                                expect(a == new Int64(0x000001, 0x000000, 0x8000)).toBe(true);
                            });

                            it("should increment the Int32Min", () =>
                            {
                                Int64 a = Int32.MinValue;
                                a++;

                                expect(a == new Int64(0x000001, 0xffff80, 0xffff)).toBe(true);
                            });

                            it("should increment -1 to 0 then to 1", () =>
                            {
                                Int64 a = -1;
                                a++;

                                expect(a == Int64.Zero).toBe(true);
                                a++;

                                expect(a == Int64.One).toBe(true);
                            });

                            it("should increment the Int32Max", () =>
                            {
                                Int64 a = Int32.MaxValue;
                                a++;

                                expect(a == new Int64(0x000000, 0x000080, 0x0000)).toBe(true);
                            });
                        });
                    });

                    describe("Decrement", () =>
                    {
                        describe("--", () =>
                        {
                            it("should decrement the Int64Max", () =>
                            {
                                Int64 a = Int64.MaxValue;
                                a--;

                                expect(a == new Int64(0xfffffe, 0xffffff, 0x7fff)).toBe(true);
                            });

                            it("should decrement the Int32Max", () =>
                            {
                                Int64 a = Int32.MaxValue;
                                a--;

                                expect(a == new Int64(0xfffffe, 0x00007f, 0x0000)).toBe(true);
                            });

                            it("should decrement -1 to 0 then to 1", () =>
                            {
                                Int64 a = Int64.One;
                                a--;

                                expect(a == Int64.Zero).toBe(true);
                                a--;

                                expect(a == -Int64.One).toBe(true);
                            });

                            it("should decrement the Int32Min", () =>
                            {
                                Int64 a = Int32.MinValue;
                                a--;

                                expect(a == new Int64(0xffffff, 0xffff7f, 0xffff)).toBe(true);
                            });
                        });
                    });
                });

                describe("Bitwise Operators", () =>
                {
                    describe("NOT", () =>
                    {
                        it("Int64Min should go to Int64Max", () =>
                        {
                            Int64 a = Int64.MinValue;

                            expect(~a == Int64.MaxValue).toBe(true);
                        });

                        it("Int64Max should go to Int64Min", () =>
                        {
                            Int64 a = Int64.MaxValue;

                            expect(~a == Int64.MinValue).toBe(true);
                        });
                    });

                    describe("AND", () =>
                    {
                        it("Int64Max & Int64Max", () =>
                        {
                            Int64 a = Int64.MaxValue;

                            expect((a & a) == Int64.MaxValue).toBe(true);
                        });

                        it("Int64Min & Int64Min", () =>
                        {
                            Int64 a = Int64.MinValue;

                            expect((a & a) == Int64.MinValue).toBe(true);
                        });

                        it("Int64Min & Int64Max", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = Int64.MaxValue;

                            expect((a & b) == Int64.Zero).toBe(true);
                        });
                    });

                    describe("OR", () =>
                    {
                        it("Int64Max | Int64Max", () =>
                        {
                            Int64 a = Int64.MaxValue;

                            expect((a | a) == Int64.MaxValue).toBe(true);
                        });

                        it("Int64Min | Int64Min", () =>
                        {
                            Int64 a = Int64.MinValue;

                            expect((a | a) == Int64.MinValue).toBe(true);
                        });

                        it("Int64Min | Int64Max", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = Int64.MaxValue;

                            expect((a | b) == -Int64.One).toBe(true);
                        });
                    });

                    describe("XOR", () =>
                    {
                        it("Int64Max ^ Int64Max", () =>
                        {
                            Int64 a = Int64.MaxValue;

                            expect((a ^ a) == Int64.Zero).toBe(true);
                        });

                        it("Int64Min ^ Int64Min", () =>
                        {
                            Int64 a = Int64.MinValue;

                            expect((a ^ a) == Int64.Zero).toBe(true);
                        });

                        it("Int64Min ^ Int64Max", () =>
                        {
                            Int64 a = Int64.MinValue;
                            Int64 b = Int64.MaxValue;

                            expect((a ^ b) == -Int64.One).toBe(true);
                        });
                    });

                    describe("Right Bit Shift", () =>
                    {
                        //n=0, n=32, n=33, a is negative
                        it("Int64Min >> 0 ", () =>
                        {
                            Int64 a = Int64.MinValue;

                            expect((a >> 0) == Int64.MinValue).toBe(true);
                        });

                        it("Int64Min >> 31 ", () =>
                        {
                            Int64 a = Int64.MinValue;

                            expect((a >> 31) == new Int64(0x000000, 0xffff00, 0xffff)).toBe(true);
                        });

                        it("Int64Min >> 32 ", () =>
                        {
                            Int64 a = Int64.MinValue;
                            expect((a >> 32) == Int32.MinValue).toBe(true);
                        });

                        it("Int64Max >> 33 ", () =>
                        {
                            Int64 a = Int64.MinValue;

                            expect((a >> 33) == new Int64(0x000000, 0xffffc0, 0xffff)).toBe(true);
                        });

                        it("Int64Max >> 48 ", () =>
                        {
                            Int64 a = Int64.MinValue;

                            expect((a >> 48) == new Int64(0xff8000, 0xffffff, 0xffff)).toBe(true);
                        });

                        it("Int32Max >> 0 ", () =>
                        {
                            Int64 a = Int32.MaxValue;

                            expect((a >> 0) == Int32.MaxValue).toBe(true);
                        });

                        it("Int32Max >> 24", () =>
                        {
                            Int64 a = Int32.MaxValue;

                            expect((a >> 24) == new Int64(0x00007f, 0x000000, 0x0000)).toBe(true);
                        });

                        it("Int32Max >> 32 ", () =>
                        {
                            Int64 a = Int32.MaxValue;

                            expect((a >> 32) == -Int64.Zero).toBe(true);
                        });

                        it("Int64Min >> 33 ", () =>
                        {
                            Int64 a = Int32.MaxValue;

                            expect((a >> 33) == -Int64.Zero).toBe(true);
                        });
                    });

                    describe("Left Bit Shift", () =>
                    {
                        //n=0, n=7, n=8, a is negative
                        it("Int64Max << 0 ", () =>
                        {
                            Int64 a = Int64.MaxValue;

                            expect((a << 0) == Int64.MaxValue).toBe(true);
                        });

                        it("Int64Max << 7 ", () =>
                        {
                            Int64 a = Int64.MaxValue;

                            expect((a << 7) == new Int64(0xffff80, 0xffffff, 0xffff)).toBe(true);
                        });

                        it("Int64Max << 8 ", () =>
                        {
                            Int64 a = Int64.MaxValue;

                            expect((a << 8) == new Int64(0xffff00, 0xffffff, 0xffff)).toBe(true);
                        });

                        it("Int64Max << 9 ", () =>
                        {
                            Int64 a = Int64.MaxValue;

                            expect((a << 9) == new Int64(0xfffe00, 0xffffff, 0xffff)).toBe(true);
                        });

                        it("Int32Min << 0 ", () =>
                        {
                            Int64 a = Int32.MinValue;

                            expect((a << 0) == Int32.MinValue).toBe(true);
                        });

                        it("Int32Min << 7", () =>
                        {
                            Int64 a = Int32.MinValue;

                            expect((a << 7) == new Int64(0x000000, 0xffc000, 0xffff)).toBe(true);
                        });

                        it("Int32Min << 8 ", () =>
                        {
                            Int64 a = Int32.MinValue;

                            expect((a << 8) == new Int64(0x000000, 0xff8000, 0xffff)).toBe(true);
                        });

                        it("Int32Min << 9 ", () =>
                        {
                            Int64 a = Int32.MinValue;

                            expect((a << 9) == new Int64(0x000000, 0xff0000, 0xffff)).toBe(true);
                        });
                    });
                });
                
                describe("Casts", () =>
                {
                    describe("Byte", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            Byte a = Byte.MinValue;
                            Int64 b = a;

                            expect(b == new Int64(Byte.MinValue, 0, 0)).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            Byte a = 128;
                            Int64 b = a;

                            expect(b == new Int64(a, 0, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            Byte a = Byte.MaxValue;
                            Int64 b = a;

                            expect(b == new Int64(Byte.MaxValue, 0, 0)).toBe(true);
                        });
                    });

                    describe("SByte", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            SByte a = SByte.MinValue;
                            Int64 b = a;

                            expect(b == new Int64(0xffff80, 0xffffff, 0xffff)).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            SByte a = 0;
                            Int64 b = a;

                            expect(b == new Int64(a, 0, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            SByte a = SByte.MaxValue;
                            Int64 b = a;

                            expect(b == new Int64(a, 0, 0)).toBe(true);
                        });
                    });

                    describe("UInt16", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            UInt16 a = UInt16.MinValue;
                            Int64 b = a;

                            expect(b == new Int64(a, 0, 0)).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            UInt16 a = 0;
                            Int64 b = a;

                            expect(b == new Int64(a, 0, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            UInt16 a = UInt16.MaxValue;
                            Int64 b = a;

                            expect(b == new Int64(a, 0, 0)).toBe(true);
                        });
                    });

                    describe("Int16", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            Int16 a = Int16.MinValue;
                            Int64 b = a;

                            expect(b == new Int64(0xff8000, 0xffffff, 0xffff)).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            Int16 a = 0;
                            Int64 b = a;

                            expect(b == new Int64(a, 0, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            Int16 a = Int16.MaxValue;
                            Int64 b = a;

                            expect(b == new Int64(a, 0, 0)).toBe(true);
                        });
                    });

                    describe("UInt32", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            UInt32 a = UInt32.MinValue;
                            Int64 b = a;

                            expect(b == new Int64(0, 0, 0)).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            UInt32 a = 2147483647;
                            Int64 b = a;

                            expect(b == new Int64(0xffffff, 0x7f, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            UInt32 a = UInt32.MaxValue;
                            Int64 b = a;

                            expect(b == new Int64(0xffffff, 0xff, 0)).toBe(true);
                        });
                    });

                    describe("Int32", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            Int32 a = Int32.MinValue;
                            Int64 b = a;

                            expect(b == new Int64(0, 0xffff80, 0xffff)).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            Int32 a = 0;
                            Int64 b = a;

                            expect(b == new Int64(0, 0, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            Int32 a = Int32.MaxValue;
                            Int64 b = a;

                            expect(b == new Int64(0xffffff, 0x7f, 0)).toBe(true);
                        });
                    });

                    describe("Double", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            Double a = Int32.MinValue;
                            Int64 b = (Int64)a;

                            expect(b == new Int64(0, 0xffff80, 0xffff)).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            Double a = 0;
                            Int64 b = (Int64)a;

                            expect(b == new Int64(0, 0, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            Double a = Int32.MaxValue;
                            Int64 b = (Int64)a;

                            expect(b == new Int64(0xffffff, 0x7f, 0)).toBe(true);
                        });
                    });

                    describe("Single", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            Single a = Int32.MinValue;
                            Int64 b = (Int64)a;

                            expect(b == new Int64(0, 0xffff80, 0xffff)).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            Single a = 0;
                            Int64 b = (Int64)a;

                            expect(b == new Int64(0, 0, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            Single a = Int32.MaxValue;
                            Int64 b = (Int64)a;

                            expect(b == new Int64(0xffffff, 0x7f, 0)).toBe(true);
                        });
                    });

                    describe("Decimal", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            Decimal a = Int32.MinValue;//Decimal.MinValue;
                            Int64 b = Int64.FromDecimal(a);

                            expect(b == new Int64(0, 0xffff80, 0xffff)).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            Decimal a = 0;
                            Int64 b = Int64.FromDecimal(a);

                            expect(b == new Int64(0, 0, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            Decimal a = Int32.MaxValue; //Decimal.MaxValue;
                            Int64 b = Int64.FromDecimal(a);

                            expect(b == new Int64(0xffffff, 0x7f, 0)).toBe(true);
                        });
                    });
                });
            });
        }
    }
}
