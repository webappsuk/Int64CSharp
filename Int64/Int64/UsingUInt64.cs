using System;
using System.Diagnostics;
using WebApplications.Saltarelle.JasmineTestUtils;

namespace ss
{
    public class UUInt64Spec : TestSuite
    {
        [TestMethod]
        public static void Tests()
        {
            //describe("", () => { });
            //it("", () => { });

            describe("UInt64", () =>
            {
                it("should be defined", () =>
                {
                    UInt64 a = UInt64.Zero;
                    expect(a).toBeDefined();
                });

                describe("Operators", () =>
                {
                    describe("Equality", () =>
                    {
                        it("Zero should equal 0", () =>
                        {
                            UInt64 a = UInt64.Zero;
                            UInt64 b = new UInt64(0, 0, 0);

                            expect(a == b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("One should equal 1", () =>
                        {
                            UInt64 a = UInt64.One;
                            UInt64 b = new UInt64(1, 0, 0);

                            expect(a == b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("Zero should not equal 1", () =>
                        {
                            UInt64 a = UInt64.Zero;
                            UInt64 b = new UInt64(1, 0, 0);

                            expect(a == b).toBe(false);
                            expect(a.Low).not.toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("One should not equal 0", () =>
                        {
                            UInt64 a = UInt64.One;
                            UInt64 b = new UInt64(0, 0, 0);

                            expect(a == b).toBe(false);
                            expect(a.Low).not.toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("MaxValue should equal 18446744073709551615", () =>
                        {
                            UInt64 a = UInt64.MaxValue;
                            UInt64 b = new UInt64(0xffffff, 0xffffff, 0xffff);

                            expect(a == b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("MinValue should not equal 4611686018427387904", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = new UInt64(0, 0, 0x4000);

                            expect(a == b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).not.toEqual(b.High);
                        });

                        it("Low-Mid boundary should equal itself", () =>
                        {
                            UInt64 a = new UInt64(0xffffff, 1, 0);
                            UInt64 b = new UInt64(0xffffff, 1, 0);

                            expect(a == b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("Low-Mid boundary should not equal max Low", () =>
                        {
                            UInt64 a = new UInt64(0xffffff, 1, 0);
                            UInt64 b = new UInt64(0xffffff, 0, 0);

                            expect(a == b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).not.toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("Mid-High boundary should equal itself", () =>
                        {
                            UInt64 a = new UInt64(0xffffff, 0xffffff, 1);
                            UInt64 b = new UInt64(0xffffff, 0xffffff, 1);

                            expect(a == b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("Mid-High boundary should not equal max Mid", () =>
                        {
                            UInt64 a = new UInt64(0xffffff, 0xffffff, 1);
                            UInt64 b = new UInt64(0xffffff, 0xffffff, 0);

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
                            UInt64 a = UInt64.Zero;
                            UInt64 b = new UInt64(0, 0, 0);

                            expect(a != b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("One should equal 1", () =>
                        {
                            UInt64 a = UInt64.One;
                            UInt64 b = new UInt64(1, 0, 0);

                            expect(a != b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("Zero should not equal 1", () =>
                        {
                            UInt64 a = UInt64.Zero;
                            UInt64 b = new UInt64(1, 0, 0);

                            expect(a != b).toBe(true);
                            expect(a.Low).not.toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("One should not equal 0", () =>
                        {
                            UInt64 a = UInt64.One;
                            UInt64 b = new UInt64(0, 0, 0);

                            expect(a != b).toBe(true);
                            expect(a.Low).not.toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("MaxValue should equal 18446744073709551615", () =>
                        {
                            UInt64 a = UInt64.MaxValue;
                            UInt64 b = new UInt64(0xffffff, 0xffffff, 0xffff);

                            expect(a != b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("MinValue should not equal 4611686018427387904", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = new UInt64(0, 0, 0x4000);

                            expect(a != b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).not.toEqual(b.High);
                        });

                        it("Low-Mid boundary should equal itself", () =>
                        {
                            UInt64 a = new UInt64(0xffffff, 1, 0);
                            UInt64 b = new UInt64(0xffffff, 1, 0);

                            expect(a != b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("Low-Mid boundary should not equal max Low", () =>
                        {
                            UInt64 a = new UInt64(0xffffff, 1, 0);
                            UInt64 b = new UInt64(0xffffff, 0, 0);

                            expect(a != b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).not.toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });


                        it("Mid-High boundary should equal itself", () =>
                        {
                            UInt64 a = new UInt64(0xffffff, 0xffffff, 1);
                            UInt64 b = new UInt64(0xffffff, 0xffffff, 1);

                            expect(a != b).toBe(false);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).toEqual(b.High);
                        });

                        it("Mid-High boundary should not equal max Mid", () =>
                        {
                            UInt64 a = new UInt64(0xffffff, 0xffffff, 1);
                            UInt64 b = new UInt64(0xffffff, 0xffffff, 0);

                            expect(a != b).toBe(true);
                            expect(a.Low).toEqual(b.Low);
                            expect(a.Mid).toEqual(b.Mid);
                            expect(a.High).not.toEqual(b.High);
                        });
                    });

                    describe("Greater Than or Equal To", () =>
                    {
                        it("should return UInt64Max is greater than UInt32Max", () =>
                        {
                            UInt64 a = UInt64.MaxValue;
                            UInt64 b = UInt32.MaxValue;

                            expect(a >= b).toBe(true);
                        });

                        it("should return UInt64Max is equal to UInt64Max", () =>
                        {
                            UInt64 a = UInt64.MaxValue;
                            UInt64 b = UInt64.MaxValue;

                            expect(a >= b).toBe(true);
                        });

                        it("should return UInt32Max is not greater than UInt64Max", () =>
                        {
                            UInt64 a = UInt32.MaxValue;
                            UInt64 b = UInt64.MaxValue;

                            expect(a >= b).toBe(false);
                        });

                        it("should return UInt64Max is greater than UInt64Min", () =>
                        {
                            UInt64 a = UInt64.MaxValue;
                            UInt64 b = UInt64.MinValue;

                            expect(a >= b).toBe(true);
                        });

                        it("should return UInt64Min is not greater than UInt64Max ", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = UInt64.MaxValue;

                            expect(a >= b).toBe(false);
                        });

                        it("should return UInt32Min is greater than UInt64Min ", () =>
                        {
                            UInt64 a = UInt32.MinValue;
                            UInt64 b = UInt64.MinValue;

                            expect(a >= b).toBe(true);
                        });

                        it("should return UInt64Min is equal to UInt64Min ", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = UInt64.MinValue;

                            expect(a >= b).toBe(true);
                        });

                        it("should return UInt64Min is equal to UInt32Min ", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = UInt32.MinValue;

                            expect(a >= b).toBe(true);
                        });
                    });

                    describe("Greater Than", () =>
                    {
                        it("should return UInt64Max is greater than UInt32Max", () =>
                        {
                            UInt64 a = UInt64.MaxValue;
                            UInt64 b = UInt32.MaxValue;

                            expect(a > b).toBe(true);
                        });

                        it("should return UInt64Max is not greater than UInt64Max", () =>
                        {
                            UInt64 a = UInt64.MaxValue;
                            UInt64 b = UInt64.MaxValue;

                            expect(a > b).toBe(false);
                        });

                        it("should return UInt32Max is not greater than UInt64Max", () =>
                        {
                            UInt64 a = UInt32.MaxValue;
                            UInt64 b = UInt64.MaxValue;

                            expect(a > b).toBe(false);
                        });

                        it("should return UInt64Max is greater than UInt64Min", () =>
                        {
                            UInt64 a = UInt64.MaxValue;
                            UInt64 b = UInt64.MinValue;

                            expect(a > b).toBe(true);
                        });

                        it("should return UInt64Min is not greater than UInt64Max ", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = UInt64.MaxValue;

                            expect(a > b).toBe(false);
                        });

                        it("should return UInt32Min is not greater than UInt64Min ", () =>
                        {
                            UInt64 a = UInt32.MinValue;
                            UInt64 b = UInt64.MinValue;

                            expect(a > b).toBe(false);
                        });

                        it("should return UInt64Min is not greater than UInt64Min ", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = UInt64.MinValue;

                            expect(a > b).toBe(false);
                        });

                        it("should return UInt64Min is not greater than UInt32Min ", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = UInt32.MinValue;

                            expect(a > b).toBe(false);
                        });
                    });

                    describe("Less Than or Equal To", () =>
                    {
                        it("should return UInt32Max is less than UInt64Max", () =>
                        {
                            UInt64 a = UInt32.MaxValue;
                            UInt64 b = UInt64.MaxValue;

                            expect(a <= b).toBe(true);
                        });

                        it("should return UInt64Max is equal to UInt64Max", () =>
                        {
                            UInt64 a = UInt64.MaxValue;
                            UInt64 b = UInt64.MaxValue;

                            expect(a <= b).toBe(true);
                        });

                        it("should return UInt64Max is not less than UInt32Max", () =>
                        {
                            UInt64 a = UInt64.MaxValue;
                            UInt64 b = UInt32.MaxValue;

                            expect(a <= b).toBe(false);
                        });

                        it("should return UInt64Min is less than UInt64Max", () =>
                        {
                            Debugger.Break();
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = UInt64.MaxValue;

                            expect(a <= b).toBe(true);
                        });
                        
                        it("should return UInt64Min is less than UInt32Min", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = UInt32.MinValue;

                            expect(a <= b).toBe(true);
                        });

                        it("should return UInt64Min is equal to UInt64Min ", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = UInt64.MinValue;

                            expect(a <= b).toBe(true);
                        });

                        it("should return UInt32Min is equal to UInt64Min", () =>
                        {
                            UInt64 a = UInt32.MinValue;
                            UInt64 b = UInt64.MinValue;

                            expect(a <= b).toBe(true);
                        });
                    });

                    describe("Less Than", () =>
                    {
                        it("should return UInt32Max is less than UInt64Max", () =>
                        {
                            UInt64 a = UInt32.MaxValue;
                            UInt64 b = UInt64.MaxValue;

                            expect(a < b).toBe(true);
                        });

                        it("should return UInt64Max is less than UInt64Max", () =>
                        {
                            UInt64 a = UInt64.MaxValue;
                            UInt64 b = UInt64.MaxValue;

                            expect(a < b).toBe(false);
                        });

                        it("should return UInt64Max is not less than UInt32Max", () =>
                        {
                            UInt64 a = UInt64.MaxValue;
                            UInt64 b = UInt32.MaxValue;

                            expect(a < b).toBe(false);
                        });

                        it("should return UInt64Min is less than UInt64Max", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = UInt64.MaxValue;

                            expect(a < b).toBe(true);
                        });

                        it("should return UInt64Max is not less than UInt64Min ", () =>
                        {
                            UInt64 a = UInt64.MaxValue;
                            UInt64 b = UInt64.MinValue;

                            expect(a < b).toBe(false);
                        });

                        it("should return UInt64Min is not less than UInt32Min", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = UInt32.MinValue;

                            expect(a < b).toBe(false);
                        });

                        it("should return UInt64Min is less than UInt64Min ", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = UInt64.MinValue;

                            expect(a < b).toBe(false);
                        });

                        it("should return UInt32Min is not less than UInt64Min", () =>
                        {
                            UInt64 a = UInt32.MinValue;
                            UInt64 b = UInt64.MinValue;

                            expect(a < b).toBe(false);
                        });
                    });

                    describe("Addition", () =>
                    {
                        describe("Zero + Zero", () =>
                        {
                            it("should equal zero", () =>
                            {
                                UInt64 a = UInt64.Zero + UInt64.Zero;

                                expect(a.Equals(UInt64.Zero)).toBe(true);
                            });
                        });

                        describe("One + Zero", () =>
                        {
                            it("should equal one", () =>
                            {
                                UInt64 a = UInt64.One + UInt64.Zero;

                                expect(a.Equals(UInt64.One)).toBe(true);
                            });
                        });

                        describe("One + One", () =>
                        {
                            it("should equal two", () =>
                            {
                                UInt64 a = UInt64.One + UInt64.One;

                                expect(a.Equals(new UInt64(2, 0, 0))).toBe(true);
                            });
                        });

                        describe("UInt32Max + One", () =>
                        {
                            it("should equal 2147483648", () =>
                            {
                                UInt64 a = new UInt64(0xffffff, 0x7f, 0) + UInt64.One;

                                expect(a.Equals(new UInt64(0, 0x80, 0))).toBe(true);
                            });
                        });

                        describe("UInt32Max + UInt32Max", () =>
                        {
                            it("should equal 4294967294", () =>
                            {
                                UInt64 a = new UInt64(0xffffff, 0x7f, 0);
                                UInt64 b = new UInt64(0xffffff, 0x7f, 0);

                                expect(a + b == new UInt64(0xfffffe, 0xff, 0)).toBe(true);
                            });
                        });
                    });

                    describe("Subtraction", () =>
                    {
                        describe("Zero - Zero", () =>
                        {
                            it("should equal zero", () =>
                            {
                                UInt64 a = UInt64.Zero - UInt64.Zero;

                                expect(a.Equals(UInt64.Zero)).toBe(true);
                            });
                        });

                        describe("One - Zero", () =>
                        {
                            it("should equal one", () =>
                            {
                                UInt64 a = UInt64.One - UInt64.Zero;

                                expect(a.Equals(UInt64.One)).toBe(true);
                            });
                        });

                        describe("One - One", () =>
                        {
                            it("should equal Zero", () =>
                            {
                                UInt64 a = UInt64.One - UInt64.One;

                                expect(a == UInt64.Zero).toBe(true);
                            });
                        });

                        describe("UInt32Max - One", () =>
                        {
                            it("should equal 2147483646", () =>
                            {
                                UInt64 a = new UInt64(0xffffff, 0x7f, 0) - UInt64.One;

                                expect(a.Equals(new UInt64(0xfffffe, 0x7f, 0))).toBe(true);
                            });
                        });

                        describe("UInt32Max - UInt32Max", () =>
                        {
                            it("should equal 0", () =>
                            {
                                UInt64 a = new UInt64(0xffffff, 0x7f, 0);
                                UInt64 b = new UInt64(0xffffff, 0x7f, 0);

                                expect(a - b == UInt64.Zero).toBe(true);
                            });
                        });

                        describe("UInt32Min - UInt32Min", () =>
                        {
                            it("should equal 0", () =>
                            {
                                UInt64 a = UInt32.MinValue;

                                expect(a - a == UInt64.Zero).toBe(true);
                            });
                        });
                    });

                    describe("Multiplication", () =>
                    {
                        describe("Zero * Zero", () =>
                        {
                            it("should equal Zero", () =>
                            {
                                UInt64 a = UInt64.Zero;

                                expect(a * a == UInt64.Zero).toBe(true);
                            });
                        });

                        describe("One * Zero", () =>
                        {
                            it("should equal Zero", () =>
                            {
                                UInt64 a = UInt64.One;
                                UInt64 b = UInt64.Zero;

                                expect(a * b == UInt64.Zero).toBe(true);
                            });
                        });

                        describe("One * One", () =>
                        {
                            it("should equal One", () =>
                            {
                                UInt64 a = UInt64.One;

                                expect(a * a == UInt64.One).toBe(true);
                            });
                        });

                        describe("3 * 715827882", () =>
                        {
                            it("should equal 2147483646", () =>
                            {
                                UInt64 a = new UInt64(3, 0, 0);
                                UInt64 b = new UInt64(0xaaaaaa, 0x2a, 0);

                                expect(a * b == new UInt64(0xfffffe, 0x7f, 0)).toBe(true);
                            });
                        });

                        describe("UInt64Max * UInt64Max", () =>
                        {
                            it("should equal 1", () =>
                            {
                                UInt64 a = UInt64.MaxValue;

                                expect(a * a == UInt64.One).toBe(true);
                            });
                        });

                        describe("UInt64Min * UInt64Min", () =>
                        {
                            it("should equal 0", () =>
                            {
                                UInt64 a = UInt64.MinValue;

                                expect(a * a == UInt64.Zero).toBe(true);
                            });
                        });
                    });

                    describe("Division", () =>
                    {
                        describe("Zero / Zero", () =>
                        {
                            it("should throw Divide by zero Exception", () =>
                            {
                                UInt64 a = UInt64.Zero;

                                expect(new Func<UInt64>(() => a / a)).toThrow();
                            });
                        });

                        describe("One / Zero", () =>
                        {
                            it("should throw Divide by zero Exception", () =>
                            {
                                UInt64 a = UInt64.One;
                                UInt64 b = UInt64.Zero;

                                expect(new Func<UInt64>(() => a / b)).toThrow();
                            });
                        });

                        describe("Zero / One", () =>
                        {
                            it("should equal 0", () =>
                            {
                                UInt64 a = UInt64.One;
                                UInt64 b = UInt64.Zero;

                                expect(b / a == UInt64.Zero).toBe(true);
                            });
                        });

                        describe("One / One", () =>
                        {
                            it("should equal One", () =>
                            {
                                UInt64 a = UInt64.One;

                                expect(a / a == UInt64.One).toBe(true);
                            });
                        });

                        describe("18446744073709551615 / 153092023", () =>
                        {
                            it("should equal 120494482418 ", () =>
                            {
                                UInt64 a = UInt64.MaxValue;
                                UInt64 b = new UInt64(0x1fffb7, 0x9, 0);

                                expect(a / b == new Int64(0x07e3f2, 0x001c0e, 0x0000)).toBe(true);
                            });
                        });

                        describe("UInt64Max / UInt64Max", () =>
                        {
                            it("should equal 1", () =>
                            {
                                UInt64 a = UInt64.MaxValue;

                                expect(a / a == UInt64.One).toBe(true);
                            });
                        });

                        describe("1 / UInt64Man", () =>
                        {
                            it("should equal 0", () =>
                            {
                                UInt64 a = UInt64.One;
                                UInt64 b = UInt64.MaxValue;

                                expect(a / b == UInt64.Zero).toBe(true);
                            });
                        });
                        
                        describe("UInt64Min / 1", () =>
                        {
                            it("should equal UInt64Min", () =>
                            {
                                UInt64 a = UInt64.One;
                                UInt64 b = UInt64.MinValue;

                                expect(b / a == UInt64.MinValue).toBe(true);
                            });
                        });
                    });

                    describe("Modulo", () =>
                    {
                        describe("1 % 1", () =>
                        {
                            it("should equal 0", () =>
                            {
                                UInt64 a = UInt64.One;

                                expect(a % a == UInt64.Zero).toBe(true);
                            });
                        });

                        describe("0 % 1", () =>
                        {
                            it("should equal 0", () =>
                            {
                                UInt64 a = UInt64.Zero;
                                UInt64 b = UInt64.One;

                                expect(a % b == UInt64.Zero).toBe(true);
                            });
                        });

                        describe("1 % 0", () =>
                        {
                            it("should throw Divide by zero Exception", () =>
                            {
                                UInt64 a = UInt64.Zero;
                                UInt64 b = UInt64.One;

                                expect(new Func<UInt64>(() => b / a)).toThrow();
                            });
                        });

                        describe("UInt64Max % UInt32Max", () =>
                        {
                            it("should equal 0", () =>
                            {
                                UInt64 a = UInt64.MaxValue;
                                UInt64 b = UInt32.MaxValue;

                                expect(a % b == UInt64.Zero).toBe(true);
                            });
                        });
                    });

                    describe("Increment", () =>
                    {
                        describe("++", () =>
                        {
                            it("should increment the UInt64Min", () =>
                            {
                                UInt64 a = UInt64.MinValue;
                                a++;

                                expect(a == new UInt64(1, 0, 0)).toBe(true);
                            });
                            
                            it("should increment the UInt32Max", () =>
                            {
                                UInt64 a = UInt32.MaxValue;
                                a++;

                                expect(a == new UInt64(0x000000, 0x000100, 0x0000)).toBe(true);
                            });
                        });
                    });

                    describe("Decrement", () =>
                    {
                        describe("--", () =>
                        {
                            it("should decrement the UInt64Max", () =>
                            {
                                UInt64 a = UInt64.MaxValue;
                                a--;

                                expect(a == new UInt64(0xfffffe, 0xffffff, 0xffff)).toBe(true);
                            });

                            it("should decrement the UInt32Max", () =>
                            {
                                UInt64 a = UInt32.MaxValue;
                                a--;

                                expect(a == new UInt64(0xfffffe, 0x0000ff, 0x0000)).toBe(true);
                            });
                        });
                    });
                });

                describe("Bitwise Operators", () =>
                {
                    describe("NOT", () =>
                    {
                        it("UInt64Min should go to UInt64Max", () =>
                        {
                            UInt64 a = UInt64.MinValue;

                            expect(~a == UInt64.MaxValue).toBe(true);
                        });

                        it("UInt64Max should go to UInt64Min", () =>
                        {
                            UInt64 a = UInt64.MaxValue;

                            expect(~a == UInt64.MinValue).toBe(true);
                        });
                    });

                    describe("AND", () =>
                    {
                        it("UInt64Max & UInt64Max", () =>
                        {
                            UInt64 a = UInt64.MaxValue;

                            expect((a & a) == UInt64.MaxValue).toBe(true);
                        });

                        it("UInt64Min & UInt64Min", () =>
                        {
                            UInt64 a = UInt64.MinValue;

                            expect((a & a) == UInt64.MinValue).toBe(true);
                        });

                        it("UInt64Min & UInt64Max", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = UInt64.MaxValue;

                            expect((a & b) == UInt64.Zero).toBe(true);
                        });
                    });

                    #region or
                    describe("OR", () =>
                    {
                        it("UInt64Max | UInt64Max", () =>
                        {
                            UInt64 a = UInt64.MaxValue;

                            expect((a | a) == UInt64.MaxValue).toBe(true);
                        });

                        it("UInt64Min | UInt64Min", () =>
                        {
                            UInt64 a = UInt64.MinValue;

                            expect((a | a) == UInt64.MinValue).toBe(true);
                        });

                        it("UInt64Min | UInt64Max", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = UInt64.MaxValue;

                            expect((a | b) == UInt64.MaxValue).toBe(true);
                        });
                    });

                    #endregion


                    describe("XOR", () =>
                    {
                        it("UInt64Max ^ UInt64Max", () =>
                        {
                            UInt64 a = UInt64.MaxValue;

                            expect((a ^ a) == UInt64.Zero).toBe(true);
                        });

                        it("UInt64Min ^ UInt64Min", () =>
                        {
                            UInt64 a = UInt64.MinValue;

                            expect((a ^ a) == UInt64.Zero).toBe(true);
                        });

                        it("UInt64Min ^ UInt64Max", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            UInt64 b = UInt64.MaxValue;

                            expect((a ^ b) == UInt64.MaxValue).toBe(true);
                        });
                    });

                    describe("Right Bit Shift", () =>
                    {
                        //n=0, n=32, n=33, a is negative
                        it("UInt64Min >> 0 ", () =>
                        {
                            UInt64 a = UInt64.MaxValue;

                            expect((a >> 0) == UInt64.MaxValue).toBe(true);
                        });

                        it("UInt64Min >> 31 ", () =>
                        {
                            UInt64 a = UInt64.MaxValue;

                            expect((a >> 31) == new UInt64(0xffffff, 0x0001ff, 0x0000)).toBe(true);
                        });

                        it("UInt64Min >> 32 ", () =>
                        {
                            UInt64 a = UInt64.MaxValue;

                            expect((a >> 32) == new Int64(0xffffff, 0x0000ff, 0x0000)).toBe(true);
                        });

                        it("UInt64Max >> 33 ", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            Console.WriteLine((a >> 33).ToString());

                            expect((a >> 33) == new UInt64(0xffffff, 0x00007f, 0x0000)).toBe(true);
                        });

                        it("UInt64Max >> 48 ", () =>
                        {
                            UInt64 a = UInt64.MinValue;
                            Console.WriteLine((a >> 48).ToString());

                            expect((a >> 48) == new UInt64(0x00ffff, 0x000000, 0x0000)).toBe(true);
                        });

                        it("UInt32Max >> 0 ", () =>
                        {
                            UInt64 a = UInt32.MaxValue;

                            expect((a >> 0) == UInt32.MaxValue).toBe(true);
                        });

                        it("UInt32Max >> 24", () =>
                        {
                            UInt64 a = UInt32.MaxValue;

                            expect((a >> 24) == new Int64(0x0000ff, 0x000000, 0x0000)).toBe(true);
                        });

                        it("UInt32Max >> 32 ", () =>
                        {
                            UInt64 a = UInt32.MaxValue;

                            expect((a >> 32) == UInt64.Zero).toBe(true);
                        });

                        it("UInt64Min >> 33 ", () =>
                        {
                            UInt64 a = UInt32.MaxValue;

                            expect((a >> 33) == UInt64.Zero).toBe(true);
                        });
                    });

                    describe("Left Bit Shift", () =>
                    {
                        //n=0, n=7, n=8, a is negative
                        it("UInt64Max << 0 ", () =>
                        {
                            UInt64 a = UInt64.MaxValue;

                            expect((a << 0) == UInt64.MaxValue).toBe(true);
                        });

                        it("UInt64Max << 7 ", () =>
                        {
                            UInt64 a = UInt64.MaxValue;

                            expect((a << 7) == new UInt64(0xffff80, 0xffffff, 0xffff)).toBe(true);
                        });

                        it("UInt64Max << 8 ", () =>
                        {
                            UInt64 a = UInt64.MaxValue;

                            expect((a << 8) == new UInt64(0xffff00, 0xffffff, 0xffff)).toBe(true);
                        });

                        it("UInt64Max << 9 ", () =>
                        {
                            UInt64 a = UInt64.MaxValue;

                            expect((a << 9) == new UInt64(0xfffe00, 0xffffff, 0xffff)).toBe(true);
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
                            UInt64 b = a;

                            expect(b == new UInt64(Byte.MinValue, 0, 0)).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            Byte a = 128;
                            UInt64 b = a;

                            expect(b == new UInt64(a, 0, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            Byte a = Byte.MaxValue;
                            UInt64 b = a;

                            expect(b == new UInt64(Byte.MaxValue, 0, 0)).toBe(true);
                        });
                    });

                    describe("SByte", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            SByte a = SByte.MinValue;
                            UInt64 b = (UInt64) a;

                            expect(b == new UInt64(0xffff80, 0xffffff, 0xffff)).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            SByte a = 0;
                            UInt64 b = (UInt64) a;

                            expect(b == new UInt64(a, 0, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            SByte a = SByte.MaxValue;
                            UInt64 b = (UInt64) a;

                            expect(b == new UInt64(a, 0, 0)).toBe(true);
                        });
                    });

                    describe("UInt16", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            UInt16 a = UInt16.MinValue;
                            UInt64 b = a;

                            expect(b == new UInt64(a, 0, 0)).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            UInt16 a = 0;
                            UInt64 b = a;

                            expect(b == new UInt64(a, 0, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            UInt16 a = UInt16.MaxValue;
                            UInt64 b = a;

                            expect(b == new UInt64(a, 0, 0)).toBe(true);
                        });
                    });

                    describe("Int16", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            Int16 a = Int16.MinValue;
                            UInt64 b = (UInt64) a;

                            expect(b == new UInt64(0xff8000, 0xffffff, 0xffff)).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            Int16 a = 0;
                            UInt64 b = (UInt64) a;

                            expect(b == new UInt64(a, 0, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            Int16 a = Int16.MaxValue;
                            UInt64 b = (UInt64) a;

                            expect(b == new UInt64(a, 0, 0)).toBe(true);
                        });
                    });

                    describe("UInt32", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            UInt32 a = UInt32.MinValue;
                            UInt64 b = a;

                            expect(b == new UInt64(0, 0, 0)).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            UInt32 a = 2147483647;
                            UInt64 b = a;

                            expect(b == new UInt64(0xffffff, 0x7f, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            UInt32 a = UInt32.MaxValue;
                            UInt64 b = a;

                            expect(b == new UInt64(0xffffff, 0xff, 0)).toBe(true);
                        });
                    });

                    describe("UInt32", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            UInt32 a = UInt32.MinValue;
                            UInt64 b = a;

                            expect(b == UInt64.Zero).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            UInt32 a = 0;
                            UInt64 b = a;

                            expect(b == new UInt64(0, 0, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            UInt32 a = UInt32.MaxValue;
                            UInt64 b = a;

                            expect(b == new UInt64(0xffffff, 0xff, 0)).toBe(true);
                        });
                    });

                    describe("Double", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            Double a = UInt32.MinValue;
                            UInt64 b = (UInt64)a;

                            expect(b == UInt64.Zero).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            Double a = 0;
                            UInt64 b = (UInt64)a;

                            expect(b == new UInt64(0, 0, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            Double a = UInt32.MaxValue;
                            UInt64 b = (UInt64)a;

                            expect(b == new UInt64(0xffffff, 0xff, 0)).toBe(true);
                        });
                    });

                    describe("Single", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            Single a = UInt32.MinValue;
                            UInt64 b = (UInt64)a;

                            expect(b == UInt64.Zero).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            Single a = 0;
                            UInt64 b = (UInt64)a;

                            expect(b == new UInt64(0, 0, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            Single a = UInt32.MaxValue;
                            UInt64 b = (UInt64)a;

                            expect(b == new UInt64(0xffffff, 0xff, 0)).toBe(true);
                        });
                    });

                    describe("Decimal", () =>
                    {
                        it("should equal the min value", () =>
                        {
                            Decimal a = UInt32.MinValue;//Decimal.MinValue;
                            UInt64 b = (UInt64)a;

                            expect(b == UInt64.Zero).toBe(true);
                        });

                        it("should equal the value", () =>
                        {
                            Decimal a = 0;
                            UInt64 b = (UInt64)a;

                            expect(b == new UInt64(0, 0, 0)).toBe(true);
                        });

                        it("should equal the max value", () =>
                        {
                            Decimal a = UInt32.MaxValue; //Decimal.MaxValue;
                            UInt64 b = (UInt64)a;

                            expect(b == new UInt64(0xffffff, 0xff, 0)).toBe(true);
                        });
                    });
                });
            });
        }
    }
}
