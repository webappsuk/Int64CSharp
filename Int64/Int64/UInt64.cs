﻿using System;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace ss
{
    [ScriptNamespace("ss")]
    [ScriptName("UInt64")]
    public struct UInt64 : IComparable<UInt64>, IEquatable<UInt64>, IFormattable
    {
        internal readonly int Low;
        internal readonly int Mid;
        internal readonly int High;

        [InlineCode("{$System.UInt64}.Zero")]
        private UInt64(DummyTypeUsedToAddAttributeToDefaultValueTypeConstructor _)
        {
            Low = 0;
            Mid = 0;
            High = 0;
        }

        internal UInt64(int low, int mid, int high)
        {
            Low = low & 0xffffff;
            Mid = mid & 0xffffff;
            High = high & 0xffff;
        }

        public static readonly UInt64 MinValue = new UInt64(0, 0, 0);

        public static readonly UInt64 Zero = new UInt64(0, 0, 0);

        public static readonly UInt64 One = new UInt64(1, 0, 0);

        public static readonly UInt64 MaxValue = new UInt64(0xffffff, 0xffffff, 0xffff);

        public string Format(string format)
        {
            return ToString(format);
        }

        public string LocaleFormat(string format)
        {
            return ToString(format);
        }

        public static UInt64 Parse(string text, int radix = 10)
        {
            UInt64 result;
            if (!TryParse(text, radix, out result))
                throw new FormatException("Input string was not in a correct format.");

            return result;
        }

        [InlineCode("{$System.UInt64}.tryParse({text}, 10, {result})")]
        public static bool TryParse(string text, out UInt64 result)
        {
            return TryParse(text, 10, out result);
        }

        public static bool TryParse(string text, int radix, out UInt64 result)
        {
            if (radix < 2 || radix > 36)
                throw new ArgumentOutOfRangeException("radix", "radix argument must be between 2 and 36");
            
            result = Zero;

            //if (style & System.Globalization.NumberStyles.AllowHexSpecifier)
            //    radix = 16;

            UInt64 rdx = new UInt64(radix, 0, 0);

            for (var i = 0; i < text.Length; i++)
            {
                if (i == 0 && text[i] == '-')
                {
                    result = Zero;
                    return false;
                }
                Int32 c = Int32.Parse((string)text[i], radix);
                if (Double.IsNaN(c))
                {
                    result = Zero;
                    return false;
                }
                result = new UInt64(c, 0, 0) + (rdx * result);
            }

            return true;
        }

        public override string ToString()
        {
            return ToString(null);
        }

        public string ToString(string format)
        {
            UInt64 ten = new UInt64(10, 0, 0);
            UInt64 a = this;

            string s = "";

            do
            {
                UInt64 r = a % ten;
                s = r.Low.ToString() + s;
                a = a / ten;
            } while (a > Zero);

            return s;
        }

        public string ToString(int radix)
        {
            if (radix < 2 || radix > 36)
                throw new ArgumentOutOfRangeException("radix", "radix argument must be between 2 and 36");
            UInt64 rad = new UInt64(radix, 0 ,0);
            UInt64 a = this;

            string s = "";

            do
            {
                UInt64 r = a % rad;
                s = r.Low.ToString(radix) + s;
                a = a / rad;
            } while (a > Zero);

            return s;
        }

        public int CompareTo(UInt64 other)
        {
            if (this < other) return -1;
            return this > other ? 1 : 0;
        }

        public bool Equals(UInt64 other)
        {
            return Low == other.Low && Mid == other.Mid && High == other.High;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            return obj is UInt64 && Equals((UInt64)obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                int hashCode = Low;
                hashCode = (hashCode * 397) ^ Mid;
                hashCode = (hashCode * 397) ^ High;
                return hashCode;
            }
        }

        private const int Mask = unchecked((int)0xffffff000000);
        public static UInt64 operator +(UInt64 a, UInt64 b)
        {
            //same as Int64
            int cLow = a.Low + b.Low;
            int rLow = (cLow & Mask) >> 24;
            int cMid = rLow + a.Mid + b.Mid;
            int rMid = (cMid & Mask) >> 24;
            int cHigh = rMid + a.High + b.High;

            return new UInt64(cLow, cMid, cHigh);
        }

        public static UInt64 operator -(UInt64 a, UInt64 b)
        {
            //same as Int64
            int cLow = (a.Low - b.Low) | 0;
            int rLow = 0;
            if (cLow < 0)
            {
                cLow = 0x1000000 + cLow;
                rLow = -1;
            }
            int cMid = (rLow + ((a.Mid - b.Mid) | 0)) | 0;
            int rMid = 0;
            if (cMid < 0)
            {
                cMid = 0x1000000 + cMid;
                rMid = -1;
            }
            int cHigh = (rMid + ((a.High - b.High) | 0)) | 0;
            if (cHigh < 0)
            {
                cHigh = 0x10000 + cHigh;
            }

            return new UInt64(cLow, cMid, cHigh);
        }

        public static UInt64 operator *(UInt64 a, UInt64 b)
        {
            if (a.Equals(Zero) || b.Equals(Zero))
                return Zero;

            if (a > b)
                return b * a;

            UInt64 c = Zero;

            if ((a.Low & 1) == 1)
            {
                c = b;
            }

            while (a != One)
            {
                a >>= 1;
                b <<= 1;

                if ((a.Low & 1) == 1)
                    c += b;
            }

            return c;
        }

        public static UInt64 operator /(UInt64 a, UInt64 b)
        {
            if (b.Equals(MinValue))
                throw new DivideByZeroException();

            UInt64 q = Zero;
            UInt64 r = Zero;

            for (int i = 63; i >= 0; i--)
            {
                r <<= 1;
                int x;
                int s;
                if (i < 24)
                {
                    x = a.Low;
                    s = i;
                }
                else if (i < 48)
                {
                    x = a.Mid;
                    s = i - 24;
                }
                else
                {
                    x = a.High;
                    s = i - 48;
                }

                r = new UInt64(r.Low | ((x & (1 << s)) >> s), r.Mid, r.High);

                if (r < b) continue;

                r -= b;

                if (i < 24)
                    q = new UInt64(q.Low | (1 << s), q.Mid, q.High);
                else if (i < 48)
                    q = new UInt64(q.Low, q.Mid | (1 << s), q.High);
                else
                    q = new UInt64(q.Low, q.Mid, q.High | (1 << s));
            }

            return q;
        }

        public static UInt64 operator %(UInt64 a, UInt64 b)
        {
            if (b.Equals(MinValue))
                throw new DivideByZeroException();

            UInt64 r = Zero;

            for (int i = 63; i >= 0; i--)
            {
                r <<= 1;
                int x;
                int s;
                if (i < 24)
                {
                    x = a.Low;
                    s = i;
                }
                else if (i < 48)
                {
                    x = a.Mid;
                    s = i - 24;
                }
                else
                {
                    x = a.High;
                    s = i - 48;
                }

                r = new UInt64(r.Low | ((x & (1 << s)) >> s), r.Mid, r.High);

                if (r >= b)
                    r -= b;
            }

            return r;
        }

        public static UInt64 operator &(UInt64 a, UInt64 b)
        {
            //same as Int64
            return new UInt64(a.Low & b.Low, a.Mid & b.Mid, a.High & b.High);
        }

        public static UInt64 operator |(UInt64 a, UInt64 b)
        {
            //same as Int64
            return new UInt64(a.Low | b.Low, a.Mid | b.Mid, a.High | b.High);
        }

        public static UInt64 operator ^(UInt64 a, UInt64 b)
        {
            //same as Int64
            return new UInt64(a.Low ^ b.Low, a.Mid ^ b.Mid, a.High ^ b.High);
        }

        public static UInt64 operator <<(UInt64 a, int b)
        {
            b = b & 63;
            if (b == 0) return a;

            int cLow, cMid, cHigh;

            if (b <= 24)
            {
                cLow = (a.Low << b);
                cMid = (a.Low >> (24 - b)) | (a.Mid << b);
                cHigh = (a.Mid >> (24 - b)) | (a.High << b);
            }
            else if (b <= 48)
            {
                cLow = 0;
                cMid = (a.Low << (b - 24));
                cHigh = (a.Low >> (48 - b)) | (a.Mid << (b - 24));
            }
            else
            {
                cLow = 0;
                cMid = 0;
                cHigh = (a.Low << (b - 48));
            }

            return new UInt64(cLow, cMid, cHigh);
        }

        public static UInt64 operator >>(UInt64 a, int b)
        {
            b = b & 63;
            if (b == 0) return a;

            int cLow, cMid, cHigh;

            if (b <= 24)
            {
                cLow = (a.Mid << (24 - b)) | (a.Low >> b);
                cMid = (a.High << (24 - b)) | (a.Mid >> b);
                cHigh = (a.High >> b);
            }
            else if (b <= 48)
            {
                cLow = (a.High << (48 - b)) | (a.Mid >> (b - 24));
                cMid = (a.High >> (b - 24));
                cHigh = 0;
            }
            else
            {
                cLow = (a.High >> (b - 48));
                cMid = 0;
                cHigh = 0;
            }

            return new UInt64(cLow, cMid, cHigh);
        }

        public static bool operator ==(UInt64 a, UInt64 b)
        {
            //same as Int64
            return a.Low == b.Low && a.Mid == b.Mid && a.High == b.High;
        }

        public static bool operator !=(UInt64 a, UInt64 b)
        {
            //same as Int64
            return a.Low != b.Low || a.Mid != b.Mid || a.High != b.High;
        }

        public static bool operator <=(UInt64 a, UInt64 b)
        {
            int adiff = a.High - b.High;
            if (adiff < 0)
                return true;

            if (adiff > 0)
                return false;

            int bdiff = a.Mid - b.Mid;
            if (bdiff < 0)
                return true;

            if (bdiff > 0)
                return false;

            return a.Low <= b.Low;
        }

        public static bool operator >=(UInt64 a, UInt64 b)
        {
            int adiff = a.High - b.High;
            if (adiff > 0)
                return true;

            if (adiff < 0)
                return false;

            int bdiff = a.Mid - b.Mid;
            if (bdiff > 0)
                return true;

            if (bdiff < 0)
                return false;

            return a.Low >= b.Low;
        }

        public static bool operator <(UInt64 a, UInt64 b)
        {
            int adiff = a.High - b.High;
            if (adiff < 0)
                return true;

            if (adiff > 0)
                return false;

            int bdiff = a.Mid - b.Mid;
            if (bdiff < 0)
                return true;

            if (bdiff > 0)
                return false;

            return a.Low < b.Low;
        }

        public static bool operator >(UInt64 a, UInt64 b)
        {
            int adiff = a.High - b.High;
            if (adiff > 0)
                return true;

            if (adiff < 0)
                return false;

            int bdiff = a.Mid - b.Mid;
            if (bdiff > 0)
                return true;

            if (bdiff < 0)
                return false;

            return a.Low > b.Low;
        }

        [InlineCode("{a}")]
        public static UInt64 operator +(UInt64 a)
        {
            return a;
        }

        public static Int64 operator -(UInt64 a)
        {
            return (Int64)~a + Int64.One;
        }

        public static UInt64 operator ~(UInt64 a)
        {
            return new UInt64(~a.Low, ~a.Mid, ~a.High);
        }

        public static UInt64 operator ++(UInt64 a)
        {
            //same as Int64
            int cLow = a.Low + 1;
            int rLow = (cLow & Mask) >> 24;
            int cMid = rLow + a.Mid;
            int rMid = (cMid & Mask) >> 24;
            int cHigh = rMid + a.High;

            return new UInt64(cLow, cMid, cHigh);
        }

        public static UInt64 operator --(UInt64 a)
        {
            //same as Int64
            int cLow = (a.Low - 1) | 0;
            int rLow = 0;
            if (cLow < 0)
            {
                cLow = 0x1000000 + cLow;
                rLow = -1;
            }
            int cMid = (rLow + a.Mid) | 0;
            int rMid = 0;
            if (cMid < 0)
            {
                cMid = 0x1000000 + cMid;
                rMid = -1;
            }
            int cHigh = (rMid + a.High) | 0;
            if (cHigh < 0)
            {
                cHigh = 0x10000 + cHigh;
            }

            return new UInt64(cLow, cMid, cHigh);
        }

        //TODO Casts
        public static explicit operator UInt64(Int64 a)
        {
            return new UInt64(a.Low, a.Mid, a.High);
        }

        public static implicit operator UInt64(Byte a)
        {
            return new UInt64(a, 0, 0);
        }

        public static explicit operator UInt64(SByte a)
        {
            return new UInt64(a, a < 0 ? 0xffffff : 0, a < 0 ? 0xffff : 0);
        }

        public static implicit operator UInt64(UInt16 a)
        {
            return new UInt64(a, 0, 0);
        }

        public static explicit operator UInt64(Int16 a)
        {
            return new UInt64(a, a < 0 ? 0xffffff : 0, a < 0 ? 0xffff : 0);
        }

        public static implicit operator UInt64(UInt32 a)
        {
            return new UInt64((Int32)a, (Int32)(a >> 24), 0);
        }

        public static explicit operator UInt64(Int32 a)
        {
            return new UInt64(a, a >> 24, a < 0 ? 0xffff : 0);
        }

        public static explicit operator UInt64(Double a)
        {
            if (a < 0)
                throw new ArgumentOutOfRangeException();

            double floorN = Math.Floor(a);
            int n0 = (int)floorN | 0;
            int n1 = (int)(floorN / 0x1000000) | 0;
            int n2 = (int)(floorN / 281474976710656.0) | 0;

            return new UInt64(n0, n1, n2);
        }

        public static explicit operator UInt64(Single a)
        {
            return (UInt64)(double)a;
        }

        public static UInt64 FromDecimal(Decimal a)
        {
            return (UInt64)(double)a;
        }

        public static explicit operator Byte(UInt64 a)
        {
            return (Byte)(a.Low & Byte.MaxValue);
        }

        public static explicit operator SByte(UInt64 a)
        {
            return (SByte)(a.Low & Byte.MaxValue);
        }

        public static explicit operator UInt16(UInt64 a)
        {
            return (UInt16)(a.Low & UInt16.MaxValue);
        }

        public static explicit operator Int16(UInt64 a)
        {
            return (Int16)(a.Low & UInt16.MaxValue);
        }

        public static explicit operator UInt32(UInt64 a)
        {
            //return (UInt32)((a.Low | a.Mid << 24) & UInt32.MaxValue);
            // return (a.$low | a.$mid << 24) & 4294967295;
            throw new NotImplementedException();
        }

        public static explicit operator Int32(UInt64 a)
        {
            //return (UInt32)((a.Low | a.Mid << 24) & UInt32.MaxValue);
            // return (a.$low | a.$mid << 24) & 4294967295;
            throw new NotImplementedException();
        }

        public static explicit operator Double(UInt64 a)
        {
            return 16777216.0 * ((16777216.0 * a.High) + a.Mid) + a.Low;
        }

        public static explicit operator Single(UInt64 a)
        {
            return 16777216f * ((16777216f * a.High) + a.Mid) + a.Low;
        }

        public static Decimal ToDecimal(UInt64 a)
        {
            return 16777216m * ((16777216m * a.High) + a.Mid) + a.Low;
        }
    }
}
