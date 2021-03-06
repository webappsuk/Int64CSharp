﻿using System;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using WebApplications.Saltarelle.JasmineTestUtils;

[assembly: TestAssembly]

namespace ss
{
    [ScriptNamespace("ss")]
    [ScriptName("Int64")]
    public struct Int64 : IComparable<Int64>, IEquatable<Int64>, IFormattable
    {
        internal readonly int Low;
        internal readonly int Mid;
        internal readonly int High;

        [InlineCode("{$System.Int64}.Zero")]
        private Int64(DummyTypeUsedToAddAttributeToDefaultValueTypeConstructor _)
        {
            Low = 0;
            Mid = 0;
            High = 0;
        }

        internal Int64(int low, int mid, int high)
        {
            Low = low & 0xffffff;
            Mid = mid & 0xffffff;
            High = high & 0xffff;
        }

        public static readonly Int64 MinValue = new Int64(0, 0, 0x8000);

        public static readonly Int64 Zero = new Int64(0, 0, 0);

        public static readonly Int64 One = new Int64(1, 0, 0);

        public static readonly Int64 MaxValue = new Int64(0xffffff, 0xffffff, 0x7fff);

        private bool IsNegative
        {
            get { return (High & 0x8000) != 0; }
        }

        public Int64 Abs
        {
            get { return IsNegative ? -this : this; }
        }

        public string Format(string format)
        {
            return ToString(format);
        }

        public string LocaleFormat(string format)
        {
            return ToString(format);
        }

        public static Int64 Parse(string text, int radix = 10)
        {
            Int64 result;
            if (!TryParse(text, radix, out result))
                throw new FormatException("Input string was not in a correct format.");

            return result;
        }

        [InlineCode("{$System.Int64}.tryParse({text}, 10, {result})")]
        public static bool TryParse(string text, out Int64 result)
        {
            return TryParse(text, 10, out result);
        }

        public static bool TryParse(string text, int radix, out Int64 result)
        {
            if (radix < 2 || radix > 36)
                throw new ArgumentOutOfRangeException("radix", "radix argument must be between 2 and 36");

            result = Zero;

            //if (style & System.Globalization.NumberStyles.AllowHexSpecifier)
            //    radix = 16;

            Int64 rdx = new Int64(radix, 0, 0);
            bool neg = false;

            for (var i = 0; i < text.Length; i++)
            {
                if (i == 0 && text[i] == '-')
                {
                    neg = true;
                    continue;
                }
                Int32 c = Int32.Parse((string)text[i], radix);
                if (Double.IsNaN(c))
                {
                    result = Zero;
                    return false;
                }
                result = new Int64(c, 0, 0) + (rdx * result);
            }

            if (neg)
                result = -result;

            return true;
        }

        public override string ToString()
        {
            return ToString(null);
        }

        public string ToString(string format)
        {
            return IsNegative
                ? "-" + ((UInt64)(-this)).ToString(format)
                : ((UInt64)this).ToString(format);
        }

        public string ToString(int radix)
        {
            return IsNegative
                ? "-" + ((UInt64)(-this)).ToString(radix)
                : ((UInt64)this).ToString(radix);
        }

        public int CompareTo(Int64 other)
        {
            if (this < other) return -1;
            if (this > other) return 1;
            return 0;
        }

        public bool Equals(Int64 other)
        {
            return Low == other.Low && Mid == other.Mid && High == other.High;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            return obj is Int64 && Equals((Int64)obj);
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
        public static Int64 operator +(Int64 a, Int64 b)
        {
            int cLow = a.Low + b.Low;
            int rLow = (cLow & Mask) >> 24;
            int cMid = rLow + a.Mid + b.Mid;
            int rMid = (cMid & Mask) >> 24;
            int cHigh = rMid + a.High + b.High;

            return new Int64(cLow, cMid, cHigh);
        }

        public static Int64 operator -(Int64 a, Int64 b)
        {
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

            return new Int64(cLow, cMid, cHigh);
        }

        public static Int64 operator *(Int64 a, Int64 b)
        {
            if (a.Equals(Zero) || b.Equals(Zero))
                return Zero;

            if ((UInt64)a > (UInt64)b)
                return b * a;

            Int64 c = Zero;

            if ((a.Low & 1) == 1)
            {
                c = b;
            }

            UInt64 au = (UInt64)a;

            while (au != UInt64.One)
            {
                au >>= 1;
                b <<= 1;

                if ((au.Low & 1) == 1)
                    c += b;
            }

            return c;
        }

        public static Int64 operator /(Int64 a, Int64 b)
        {
            Debugger.Break();
            if (b.Equals(Zero))
                throw new DivideByZeroException();

            if (a.Equals(Zero))
                return Zero;

            if (a.Equals(b))
                return One;

            bool negate = a.IsNegative != b.IsNegative;

            UInt64 c = ((UInt64)a.Abs / (UInt64)b.Abs);

            return negate ? -c : (Int64)c;
        }

        public static Int64 operator %(Int64 a, Int64 b)
        {
            if (b.Equals(Zero))
                throw new DivideByZeroException();

            if (a.Equals(Zero))
                return Zero;

            if (a.Equals(b))
                return Zero;

            bool negate = a.IsNegative;

            UInt64 c = ((UInt64)a.Abs % (UInt64)b.Abs);

            return negate ? -c : (Int64)c;
        }

        public static Int64 operator &(Int64 a, Int64 b)
        {
            return new Int64(a.Low & b.Low, a.Mid & b.Mid, a.High & b.High);
        }

        public static Int64 operator |(Int64 a, Int64 b)
        {
            return new Int64(a.Low | b.Low, a.Mid | b.Mid, a.High | b.High);
        }

        public static Int64 operator ^(Int64 a, Int64 b)
        {
            return new Int64(a.Low ^ b.Low, a.Mid ^ b.Mid, a.High ^ b.High);
        }

        public static Int64 operator <<(Int64 a, int b)
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

            return new Int64(cLow, cMid, cHigh);
        }

        public static Int64 operator >>(Int64 a, int b)
        {
            // Int64 (signed) uses arithmetic shift, UIn64 (unsigned) uses logical shift
            b = b & 63;
            if (b == 0) return a;

            int aHigh = a.IsNegative ? unchecked((int)0xffff0000) | a.High : a.High;
            int cLow, cMid, cHigh;

            if (b <= 24)
            {
                cLow = (a.Mid << (24 - b)) | (a.Low >> b);
                cMid = (aHigh << (24 - b)) | (a.Mid >> b);
                cHigh = (aHigh >> b);
            }
            else if (b <= 48)
            {
                cLow = (aHigh << (48 - b)) | (a.Mid >> (b - 24));
                cMid = (aHigh >> (b - 24));
                cHigh = a.IsNegative ? 0xffff : 0;
            }
            else
            {
                cLow = (aHigh >> (b - 48));
                cMid = a.IsNegative ? 0xffffff : 0;
                cHigh = a.IsNegative ? 0xffff : 0;
            }

            return new Int64(cLow, cMid, cHigh);
        }

        public static bool operator ==(Int64 a, Int64 b)
        {
            return a.Equals(b);
        }

        public static bool operator !=(Int64 a, Int64 b)
        {
            return !a.Equals(b);
        }

        public static bool operator <=(Int64 a, Int64 b)
        {
            return a.IsNegative == b.IsNegative ? (UInt64)a <= (UInt64)b : a.IsNegative;
        }

        public static bool operator >=(Int64 a, Int64 b)
        {
            return a.IsNegative == b.IsNegative ? (UInt64)a >= (UInt64)b : b.IsNegative;
        }

        public static bool operator <(Int64 a, Int64 b)
        {
            return a.IsNegative == b.IsNegative ? (UInt64)a < (UInt64)b : a.IsNegative;
        }

        public static bool operator >(Int64 a, Int64 b)
        {
            return a.IsNegative == b.IsNegative ? (UInt64)a > (UInt64)b : b.IsNegative;
        }

        [InlineCode("{a}")]
        public static Int64 operator +(Int64 a)
        {
            return a;
        }

        public static Int64 operator -(Int64 a)
        {
            return ~a + One;
        }

        public static Int64 operator ~(Int64 a)
        {
            return new Int64(~a.Low, ~a.Mid, ~a.High);
        }

        public static Int64 operator ++(Int64 a)
        {
            int cLow = a.Low + 1;
            int rLow = (cLow & Mask) >> 24;
            int cMid = rLow + a.Mid;
            int rMid = (cMid & Mask) >> 24;
            int cHigh = rMid + a.High;

            return new Int64(cLow, cMid, cHigh);
        }

        public static Int64 operator --(Int64 a)
        {
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

            return new Int64(cLow, cMid, cHigh);
        }

        //TODO Casts
        public static explicit operator Int64(UInt64 a)
        {
            return new Int64(a.Low, a.Mid, a.High);
        }

        public static implicit operator Int64(Byte a)
        {
            return new Int64(a, 0, 0);
        }

        public static implicit operator Int64(SByte a)
        {
            return new Int64(a, a < 0 ? 0xffffff : 0, a < 0 ? 0xffff : 0);
        }

        public static implicit operator Int64(UInt16 a)
        {
            return new Int64(a, 0, 0);
        }

        public static implicit operator Int64(Int16 a)
        {
            return new Int64(a, a < 0 ? 0xffffff : 0, a < 0 ? 0xffff : 0);
        }

        public static implicit operator Int64(UInt32 a)
        {
            return new Int64((Int32)a, (Int32)(a >> 24), 0);
        }

        public static implicit operator Int64(Int32 a)
        {
            return new Int64(a, a >> 24, a < 0 ? 0xffff : 0);
        }

        public static explicit operator Int64(Double a)
        {
            Int64 r = (Int64)(UInt64)Math.Abs(a);
            return a < 0 ? -r : r;
        }

        public static explicit operator Int64(Single a)
        {
            Int64 r = (Int64)(UInt64)Math.Abs(a);
            return a < 0 ? -r : r;
        }

        public static Int64 FromDecimal(Decimal a)
        {
            Int64 r = (Int64)(UInt64.FromDecimal(Math.Abs(a)));
            return a < 0 ? -r : r;
        }

        public static explicit operator Byte(Int64 a)
        {
            return (Byte)(a.Low & Byte.MaxValue);
        }

        public static explicit operator SByte(Int64 a)
        {
            return (SByte)(a.Low & Byte.MaxValue);
        }

        public static explicit operator UInt16(Int64 a)
        {
            return (UInt16)(a.Low & UInt16.MaxValue);
        }

        public static explicit operator Int16(Int64 a)
        {
            return (Int16)(a.Low & UInt16.MaxValue);
        }

        public static explicit operator UInt32(Int64 a)
        {
            //return (UInt32)((a.Low | a.Mid << 24) & UInt32.MaxValue);
            // return (a.$low | a.$mid << 24) & 4294967295;
            throw new NotImplementedException();
        }

        public static explicit operator Int32(Int64 a)
        {
            //return (Int32)((a.Low | a.Mid << 24) & UInt32.MaxValue);
            // return (a.$low | a.$mid << 24) & 4294967295;
            throw new NotImplementedException();
        }

        public static explicit operator Double(Int64 a)
        {
            return a.IsNegative
                ? -(Double)(UInt64)(-a)
                : (Double)(UInt64)a;
        }

        public static explicit operator Single(Int64 a)
        {
            return a.IsNegative
                ? -(Single)(UInt64)(-a)
                : (Single)(UInt64)a;
        }

        public static Decimal ToDecimal(Int64 a)
        {
            return a.IsNegative
                ? -UInt64.ToDecimal((UInt64)(-a))
                : UInt64.ToDecimal((UInt64)a);
        }
    }
}
