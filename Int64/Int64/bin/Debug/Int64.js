(function() {
	'use strict';
	var $asm = {};
	global.ss = global.ss || {};
	ss.initAssembly($asm, 'Int64');
	////////////////////////////////////////////////////////////////////////////////
	// ss.Int64
	var $ss_Int64 = function(low, mid, high) {
		this.$low = 0;
		this.$mid = 0;
		this.$high = 0;
		this.$low = low & 16777215;
		this.$mid = mid & 16777215;
		this.$high = high & 65535;
	};
	$ss_Int64.__typeName = 'ss.Int64';
	$ss_Int64.createInstance = function() {
		return ss.Int32.Zero;
	};
	$ss_Int64.getDefaultValue = $ss_Int64.createInstance;
	$ss_Int64.parse = function(text) {
		var result = {};
		if (!$ss_Int64.tryParse(text, result)) {
			throw new ss.FormatException('Input string was not in a correct format.');
		}
		return result.$;
	};
	$ss_Int64.tryParse = function(text, result) {
		var radix = 10;
		result.$ = $ss_Int64.zero;
		//if (style & System.Globalization.NumberStyles.AllowHexSpecifier)
		//    radix = 16;
		var rdx = new $ss_Int64(radix, 0, 0);
		var neg = false;
		for (var i = 0; i < text.length; i++) {
			if (i === 0 && text.charCodeAt(i) === 45) {
				neg = true;
				continue;
			}
			var c = parseInt(String.fromCharCode(text.charCodeAt(i)), radix);
			if (isNaN(c)) {
				result.$ = $ss_Int64.zero;
				return false;
			}
			result.$ = $ss_Int64.op_Addition(new $ss_Int64(c, 0, 0), $ss_Int64.op_Multiply(rdx, result.$));
		}
		if (neg) {
			result.$ = $ss_Int64.op_UnaryNegation(result.$);
		}
		return true;
	};
	$ss_Int64.op_Addition = function(a, b) {
		var cLow = a.$low + b.$low;
		var rLow = (cLow & $ss_Int64.$mask) >> 24;
		var cMid = rLow + a.$mid + b.$mid;
		var rMid = (cMid & $ss_Int64.$mask) >> 24;
		var cHigh = rMid + a.$high + b.$high;
		return new $ss_Int64(cLow, cMid, cHigh);
	};
	$ss_Int64.op_Subtraction = function(a, b) {
		var cLow = a.$low - b.$low | 0;
		var rLow = 0;
		if (cLow < 0) {
			cLow = 16777216 + cLow;
			rLow = -1;
		}
		var cMid = rLow + (a.$mid - b.$mid | 0) | 0;
		var rMid = 0;
		if (cMid < 0) {
			cMid = 16777216 + cMid;
			rMid = -1;
		}
		var cHigh = rMid + (a.$high - b.$high | 0) | 0;
		if (cHigh < 0) {
			cHigh = 65536 + cHigh;
		}
		return new $ss_Int64(cLow, cMid, cHigh);
	};
	$ss_Int64.op_Multiply = function(a, b) {
		if (a.equalsT($ss_Int64.zero) || b.equalsT($ss_Int64.zero)) {
			return $ss_Int64.zero;
		}
		if ($ss_UInt64.op_GreaterThan($ss_UInt64.op_Explicit$6(a), $ss_UInt64.op_Explicit$6(b))) {
			return $ss_Int64.op_Multiply(b, a);
		}
		var c = $ss_Int64.zero;
		if ((a.$low & 1) === 1) {
			c = b;
		}
		var au = $ss_UInt64.op_Explicit$6(a);
		while ($ss_UInt64.op_Inequality(au, $ss_UInt64.one)) {
			au = $ss_UInt64.op_RightShift(au, 1);
			b = $ss_Int64.op_LeftShift(b, 1);
			if ((au.$low & 1) === 1) {
				c = $ss_Int64.op_Addition(c, b);
			}
		}
		return c;
	};
	$ss_Int64.op_Division = function(a, b) {
		debugger;
		if (b.equalsT($ss_Int64.zero)) {
			throw new ss.DivideByZeroException();
		}
		if (a.equalsT($ss_Int64.zero)) {
			return $ss_Int64.zero;
		}
		if (a.equalsT(b)) {
			return $ss_Int64.one;
		}
		if (b.equalsT($ss_Int64.minValue)) {
			return $ss_Int64.zero;
		}
		if (b.get_$isNegative()) {
			return $ss_Int64.op_Division($ss_Int64.op_UnaryNegation(a), $ss_Int64.op_UnaryNegation(b));
		}
		if (a.get_$isNegative()) {
			return $ss_UInt64.op_UnaryNegation($ss_UInt64.op_Division($ss_UInt64.op_Explicit$6($ss_Int64.op_UnaryNegation(a)), $ss_UInt64.op_Explicit$6(b)));
		}
		return $ss_Int64.op_Explicit$b($ss_UInt64.op_Division($ss_UInt64.op_Explicit$6(a), $ss_UInt64.op_Explicit$6(b)));
	};
	$ss_Int64.op_Modulus = function(a, b) {
		if (b.equalsT($ss_Int64.zero)) {
			throw new ss.DivideByZeroException();
		}
		if (a.equalsT($ss_Int64.zero)) {
			return $ss_Int64.zero;
		}
		if (b.get_$isNegative()) {
			return $ss_Int64.op_Modulus($ss_Int64.op_UnaryNegation(a), $ss_Int64.op_UnaryNegation(b));
		}
		if (a.get_$isNegative()) {
			return $ss_Int64.op_UnaryNegation($ss_Int64.op_Modulus($ss_Int64.op_UnaryNegation(a), b));
		}
		return $ss_Int64.op_Explicit$b($ss_UInt64.op_Modulus($ss_UInt64.op_Explicit$6(a), $ss_UInt64.op_Explicit$6(b)));
	};
	$ss_Int64.op_BitwiseAnd = function(a, b) {
		return new $ss_Int64(a.$low & b.$low, a.$mid & b.$mid, a.$high & b.$high);
	};
	$ss_Int64.op_BitwiseOr = function(a, b) {
		return new $ss_Int64(a.$low | b.$low, a.$mid | b.$mid, a.$high | b.$high);
	};
	$ss_Int64.op_ExclusiveOr = function(a, b) {
		return new $ss_Int64(a.$low ^ b.$low, a.$mid ^ b.$mid, a.$high ^ b.$high);
	};
	$ss_Int64.op_LeftShift = function(a, b) {
		b = b & 63;
		var maxShift = 8;
		if (b > 8) {
			return $ss_Int64.op_LeftShift($ss_Int64.op_LeftShift(a, maxShift), b - maxShift);
		}
		var cLowT = a.$low << b;
		var cLow = cLowT & 16777215;
		var rLow = cLowT >>> 24 & 16777215;
		var cMidT = a.$mid << b | rLow;
		var cMid = cMidT & 16777215;
		var rMid = cMidT >>> 24 & 65535;
		var cHighT = a.$high << b;
		var cHigh = cHighT & 65535 | rMid;
		return new $ss_Int64(cLow, cMid, cHigh);
	};
	$ss_Int64.op_RightShift = function(a, b) {
		// Int64 (signed) uses arithmetic shift, UIn64 (unsigned) uses logical shift
		if (b === 0) {
			return a;
		}
		if (b > 32) {
			return $ss_Int64.op_RightShift($ss_Int64.op_RightShift(a, 32), b - 32);
		}
		return (a.get_$isNegative() ? $ss_Int64.op_Explicit$b($ss_UInt64.op_BitwiseOr($ss_UInt64.op_RightShift($ss_UInt64.op_Explicit$6(a), b), $ss_UInt64.op_LeftShift($ss_UInt64.op_RightShift($ss_UInt64.maxValue, b), 64 - b))) : $ss_Int64.op_Explicit$b($ss_UInt64.op_RightShift($ss_UInt64.op_Explicit$6(a), b)));
	};
	$ss_Int64.op_Equality = function(a, b) {
		return a.equalsT(b);
	};
	$ss_Int64.op_Inequality = function(a, b) {
		return !a.equalsT(b);
	};
	$ss_Int64.op_LessThanOrEqual = function(a, b) {
		return ((a.get_$isNegative() === b.get_$isNegative()) ? $ss_UInt64.op_LessThanOrEqual($ss_UInt64.op_Explicit$6(a), $ss_UInt64.op_Explicit$6(b)) : b.get_$isNegative());
	};
	$ss_Int64.op_GreaterThanOrEqual = function(a, b) {
		return ((a.get_$isNegative() === b.get_$isNegative()) ? $ss_UInt64.op_GreaterThanOrEqual($ss_UInt64.op_Explicit$6(a), $ss_UInt64.op_Explicit$6(b)) : b.get_$isNegative());
	};
	$ss_Int64.op_LessThan = function(a, b) {
		return ((a.get_$isNegative() === b.get_$isNegative()) ? $ss_UInt64.op_LessThan($ss_UInt64.op_Explicit$6(a), $ss_UInt64.op_Explicit$6(b)) : b.get_$isNegative());
	};
	$ss_Int64.op_GreaterThan = function(a, b) {
		return ((a.get_$isNegative() === b.get_$isNegative()) ? $ss_UInt64.op_GreaterThan($ss_UInt64.op_Explicit$6(a), $ss_UInt64.op_Explicit$6(b)) : b.get_$isNegative());
	};
	$ss_Int64.op_UnaryNegation = function(a) {
		return $ss_Int64.op_Addition($ss_Int64.op_OnesComplement(a), $ss_Int64.one);
	};
	$ss_Int64.op_OnesComplement = function(a) {
		return new $ss_Int64(~a.$low, ~a.$mid, ~a.$high);
	};
	$ss_Int64.op_Increment = function(a) {
		var cLow = a.$low + 1;
		var rLow = (cLow & $ss_Int64.$mask) >> 24;
		var cMid = rLow + a.$mid;
		var rMid = (cMid & $ss_Int64.$mask) >> 24;
		var cHigh = rMid + a.$high;
		return new $ss_Int64(cLow, cMid, cHigh);
	};
	$ss_Int64.op_Decrement = function(a) {
		var cLow = a.$low - 1 | 0;
		var rLow = 0;
		if (cLow < 0) {
			cLow = 16777216 + cLow;
			rLow = -1;
		}
		var cMid = rLow + a.$mid | 0;
		var rMid = 0;
		if (cMid < 0) {
			cMid = 16777216 + cMid;
			rMid = -1;
		}
		var cHigh = rMid + a.$high | 0;
		if (cHigh < 0) {
			cHigh = 65536 + cHigh;
		}
		return new $ss_Int64(cLow, cMid, cHigh);
	};
	$ss_Int64.op_Explicit$b = function(a) {
		return new $ss_Int64(a.$low, a.$mid, a.$high);
	};
	$ss_Int64.op_Implicit = function(a) {
		return new $ss_Int64(a, 0, 0);
	};
	$ss_Int64.op_Implicit$3 = function(a) {
		return new $ss_Int64(a, ((a < 0) ? 16777215 : 0), ((a < 0) ? 65535 : 0));
	};
	$ss_Int64.op_Implicit$4 = function(a) {
		return new $ss_Int64(a, 0, 0);
	};
	$ss_Int64.op_Implicit$1 = function(a) {
		return new $ss_Int64(a, ((a < 0) ? 16777215 : 0), ((a < 0) ? 65535 : 0));
	};
	$ss_Int64.op_Implicit$5 = function(a) {
		return new $ss_Int64(a, a >>> 24, 0);
	};
	$ss_Int64.op_Implicit$2 = function(a) {
		return new $ss_Int64(a, a >> 24, ((a < 0) ? 65535 : 0));
	};
	$ss_Int64.op_Explicit$1 = function(a) {
		var r = $ss_Int64.op_Explicit$b($ss_UInt64.op_Explicit$1(Math.abs(a)));
		return ((a < 0) ? $ss_Int64.op_UnaryNegation(r) : r);
	};
	$ss_Int64.op_Explicit$2 = function(a) {
		var r = $ss_Int64.op_Explicit$b($ss_UInt64.op_Explicit$5(Math.abs(a)));
		return ((a < 0) ? $ss_Int64.op_UnaryNegation(r) : r);
	};
	$ss_Int64.op_Explicit = function(a) {
		var r = $ss_Int64.op_Explicit$b($ss_UInt64.op_Explicit(Math.abs(a)));
		return ((a < 0) ? $ss_Int64.op_UnaryNegation(r) : r);
	};
	$ss_Int64.op_Explicit$3 = function(a) {
		return a.$low & 255;
	};
	$ss_Int64.op_Explicit$7 = function(a) {
		return a.$low & 255;
	};
	$ss_Int64.op_Explicit$9 = function(a) {
		return a.$low & 65535;
	};
	$ss_Int64.op_Explicit$5 = function(a) {
		return a.$low & 65535;
	};
	$ss_Int64.op_Explicit$a = function(a) {
		//return (UInt32)((a.Low | a.Mid << 24) & UInt32.MaxValue);
		// return (a.$low | a.$mid << 24) & 4294967295;
		throw new ss.NotImplementedException();
	};
	$ss_Int64.op_Explicit$6 = function(a) {
		//return (Int32)((a.Low | a.Mid << 24) & UInt32.MaxValue);
		// return (a.$low | a.$mid << 24) & 4294967295;
		throw new ss.NotImplementedException();
	};
	$ss_Int64.op_Explicit$4 = function(a) {
		return (a.get_$isNegative() ? -$ss_UInt64.op_Explicit$8($ss_UInt64.op_Explicit$6($ss_Int64.op_UnaryNegation(a))) : $ss_UInt64.op_Explicit$8($ss_UInt64.op_Explicit$6(a)));
	};
	$ss_Int64.op_Explicit$8 = function(a) {
		return (a.get_$isNegative() ? -$ss_UInt64.op_Explicit$c($ss_UInt64.op_Explicit$6($ss_Int64.op_UnaryNegation(a))) : $ss_UInt64.op_Explicit$c($ss_UInt64.op_Explicit$6(a)));
	};
	$ss_Int64.op_Implicit$6 = function(a) {
		return (a.get_$isNegative() ? -$ss_UInt64.op_Implicit$3($ss_UInt64.op_Explicit$6($ss_Int64.op_UnaryNegation(a))) : $ss_UInt64.op_Implicit$3($ss_UInt64.op_Explicit$6(a)));
	};
	global.ss.Int64 = $ss_Int64;
	////////////////////////////////////////////////////////////////////////////////
	// ss.Int64Spec
	var $ss_Int64Spec = function() {
		WebApplications.Saltarelle.JasmineTestUtils.TestSuite.call(this);
	};
	$ss_Int64Spec.__typeName = 'ss.Int64Spec';
	$ss_Int64Spec.tests = function() {
		//describe("", () => { });
		//it("", () => { });
		describe('Int64', function() {
			it('should be defined', function() {
				var a = $ss_Int64.zero;
				expect(a).toBeDefined();
			});
			describe('Operators', function() {
				describe('Equality', function() {
					it('Zero should equal 0', function() {
						var a1 = $ss_Int64.zero;
						var b = new $ss_Int64(0, 0, 0);
						expect($ss_Int64.op_Equality(a1, b)).toBe(true);
						expect(a1.$low).toEqual(b.$low);
						expect(a1.$mid).toEqual(b.$mid);
						expect(a1.$high).toEqual(b.$high);
					});
					it('One should equal 1', function() {
						var a2 = $ss_Int64.one;
						var b1 = new $ss_Int64(1, 0, 0);
						expect($ss_Int64.op_Equality(a2, b1)).toBe(true);
						expect(a2.$low).toEqual(b1.$low);
						expect(a2.$mid).toEqual(b1.$mid);
						expect(a2.$high).toEqual(b1.$high);
					});
					it('Zero should not equal 1', function() {
						var a3 = $ss_Int64.zero;
						var b2 = new $ss_Int64(1, 0, 0);
						expect($ss_Int64.op_Equality(a3, b2)).toBe(false);
						expect(a3.$low).not.toEqual(b2.$low);
						expect(a3.$mid).toEqual(b2.$mid);
						expect(a3.$high).toEqual(b2.$high);
					});
					it('One should not equal 0', function() {
						var a4 = $ss_Int64.one;
						var b3 = new $ss_Int64(0, 0, 0);
						expect($ss_Int64.op_Equality(a4, b3)).toBe(false);
						expect(a4.$low).not.toEqual(b3.$low);
						expect(a4.$mid).toEqual(b3.$mid);
						expect(a4.$high).toEqual(b3.$high);
					});
					it('MinValue should equal -9223372036854775808', function() {
						var a5 = $ss_Int64.minValue;
						var b4 = new $ss_Int64(0, 0, 32768);
						expect($ss_Int64.op_Equality(a5, b4)).toBe(true);
						expect(a5.$low).toEqual(b4.$low);
						expect(a5.$mid).toEqual(b4.$mid);
						expect(a5.$high).toEqual(b4.$high);
					});
					it('MinValue should not equal -4611686018427387904', function() {
						var a6 = $ss_Int64.minValue;
						var b5 = new $ss_Int64(0, 0, 49152);
						expect($ss_Int64.op_Equality(a6, b5)).toBe(false);
						expect(a6.$low).toEqual(b5.$low);
						expect(a6.$mid).toEqual(b5.$mid);
						expect(a6.$high).not.toEqual(b5.$high);
					});
					it('MaxValue should equal 9223372036854775808', function() {
						var a7 = $ss_Int64.maxValue;
						var b6 = new $ss_Int64(16777215, 16777215, 32767);
						expect($ss_Int64.op_Equality(a7, b6)).toBe(true);
						expect(a7.$low).toEqual(b6.$low);
						expect(a7.$mid).toEqual(b6.$mid);
						expect(a7.$high).toEqual(b6.$high);
					});
					it('MinValue should not equal 4611686018427387904', function() {
						var a8 = $ss_Int64.minValue;
						var b7 = new $ss_Int64(0, 0, 16384);
						expect($ss_Int64.op_Equality(a8, b7)).toBe(false);
						expect(a8.$low).toEqual(b7.$low);
						expect(a8.$mid).toEqual(b7.$mid);
						expect(a8.$high).not.toEqual(b7.$high);
					});
					it('Low-Mid boundary should equal itself', function() {
						var a9 = new $ss_Int64(16777215, 1, 0);
						var b8 = new $ss_Int64(16777215, 1, 0);
						expect($ss_Int64.op_Equality(a9, b8)).toBe(true);
						expect(a9.$low).toEqual(b8.$low);
						expect(a9.$mid).toEqual(b8.$mid);
						expect(a9.$high).toEqual(b8.$high);
					});
					it('Low-Mid boundary should not equal max Low', function() {
						var a10 = new $ss_Int64(16777215, 1, 0);
						var b9 = new $ss_Int64(16777215, 0, 0);
						expect($ss_Int64.op_Equality(a10, b9)).toBe(false);
						expect(a10.$low).toEqual(b9.$low);
						expect(a10.$mid).not.toEqual(b9.$mid);
						expect(a10.$high).toEqual(b9.$high);
					});
					it('Mid-High boundary should equal itself', function() {
						var a11 = new $ss_Int64(16777215, 16777215, 1);
						var b10 = new $ss_Int64(16777215, 16777215, 1);
						expect($ss_Int64.op_Equality(a11, b10)).toBe(true);
						expect(a11.$low).toEqual(b10.$low);
						expect(a11.$mid).toEqual(b10.$mid);
						expect(a11.$high).toEqual(b10.$high);
					});
					it('Mid-High boundary should not equal max Mid', function() {
						var a12 = new $ss_Int64(16777215, 16777215, 1);
						var b11 = new $ss_Int64(16777215, 16777215, 0);
						expect($ss_Int64.op_Equality(a12, b11)).toBe(false);
						expect(a12.$low).toEqual(b11.$low);
						expect(a12.$mid).toEqual(b11.$mid);
						expect(a12.$high).not.toEqual(b11.$high);
					});
				});
				describe('Inequality', function() {
					it('Zero should equal 0', function() {
						var a13 = $ss_Int64.zero;
						var b12 = new $ss_Int64(0, 0, 0);
						expect($ss_Int64.op_Inequality(a13, b12)).toBe(false);
						expect(a13.$low).toEqual(b12.$low);
						expect(a13.$mid).toEqual(b12.$mid);
						expect(a13.$high).toEqual(b12.$high);
					});
					it('One should equal 1', function() {
						var a14 = $ss_Int64.one;
						var b13 = new $ss_Int64(1, 0, 0);
						expect($ss_Int64.op_Inequality(a14, b13)).toBe(false);
						expect(a14.$low).toEqual(b13.$low);
						expect(a14.$mid).toEqual(b13.$mid);
						expect(a14.$high).toEqual(b13.$high);
					});
					it('Zero should not equal 1', function() {
						var a15 = $ss_Int64.zero;
						var b14 = new $ss_Int64(1, 0, 0);
						expect($ss_Int64.op_Inequality(a15, b14)).toBe(true);
						expect(a15.$low).not.toEqual(b14.$low);
						expect(a15.$mid).toEqual(b14.$mid);
						expect(a15.$high).toEqual(b14.$high);
					});
					it('One should not equal 0', function() {
						var a16 = $ss_Int64.one;
						var b15 = new $ss_Int64(0, 0, 0);
						expect($ss_Int64.op_Inequality(a16, b15)).toBe(true);
						expect(a16.$low).not.toEqual(b15.$low);
						expect(a16.$mid).toEqual(b15.$mid);
						expect(a16.$high).toEqual(b15.$high);
					});
					it('MinValue should equal -9223372036854775808', function() {
						var a17 = $ss_Int64.minValue;
						var b16 = new $ss_Int64(0, 0, 32768);
						expect($ss_Int64.op_Inequality(a17, b16)).toBe(false);
						expect(a17.$low).toEqual(b16.$low);
						expect(a17.$mid).toEqual(b16.$mid);
						expect(a17.$high).toEqual(b16.$high);
					});
					it('MinValue should not equal -4611686018427387904', function() {
						var a18 = $ss_Int64.minValue;
						var b17 = new $ss_Int64(0, 0, 49152);
						expect($ss_Int64.op_Inequality(a18, b17)).toBe(true);
						expect(a18.$low).toEqual(b17.$low);
						expect(a18.$mid).toEqual(b17.$mid);
						expect(a18.$high).not.toEqual(b17.$high);
					});
					it('MaxValue should equal 9223372036854775808', function() {
						var a19 = $ss_Int64.maxValue;
						var b18 = new $ss_Int64(16777215, 16777215, 32767);
						expect($ss_Int64.op_Inequality(a19, b18)).toBe(false);
						expect(a19.$low).toEqual(b18.$low);
						expect(a19.$mid).toEqual(b18.$mid);
						expect(a19.$high).toEqual(b18.$high);
					});
					it('MinValue should not equal 4611686018427387904', function() {
						var a20 = $ss_Int64.minValue;
						var b19 = new $ss_Int64(0, 0, 16384);
						expect($ss_Int64.op_Inequality(a20, b19)).toBe(true);
						expect(a20.$low).toEqual(b19.$low);
						expect(a20.$mid).toEqual(b19.$mid);
						expect(a20.$high).not.toEqual(b19.$high);
					});
					it('Low-Mid boundary should equal itself', function() {
						var a21 = new $ss_Int64(16777215, 1, 0);
						var b20 = new $ss_Int64(16777215, 1, 0);
						expect($ss_Int64.op_Inequality(a21, b20)).toBe(false);
						expect(a21.$low).toEqual(b20.$low);
						expect(a21.$mid).toEqual(b20.$mid);
						expect(a21.$high).toEqual(b20.$high);
					});
					it('Low-Mid boundary should not equal max Low', function() {
						var a22 = new $ss_Int64(16777215, 1, 0);
						var b21 = new $ss_Int64(16777215, 0, 0);
						expect($ss_Int64.op_Inequality(a22, b21)).toBe(true);
						expect(a22.$low).toEqual(b21.$low);
						expect(a22.$mid).not.toEqual(b21.$mid);
						expect(a22.$high).toEqual(b21.$high);
					});
					it('Mid-High boundary should equal itself', function() {
						var a23 = new $ss_Int64(16777215, 16777215, 1);
						var b22 = new $ss_Int64(16777215, 16777215, 1);
						expect($ss_Int64.op_Inequality(a23, b22)).toBe(false);
						expect(a23.$low).toEqual(b22.$low);
						expect(a23.$mid).toEqual(b22.$mid);
						expect(a23.$high).toEqual(b22.$high);
					});
					it('Mid-High boundary should not equal max Mid', function() {
						var a24 = new $ss_Int64(16777215, 16777215, 1);
						var b23 = new $ss_Int64(16777215, 16777215, 0);
						expect($ss_Int64.op_Inequality(a24, b23)).toBe(true);
						expect(a24.$low).toEqual(b23.$low);
						expect(a24.$mid).toEqual(b23.$mid);
						expect(a24.$high).not.toEqual(b23.$high);
					});
				});
			});
			describe('Addition', function() {
				describe('Zero + Zero', function() {
					it('should equal zero', function() {
						var a25 = $ss_Int64.op_Addition($ss_Int64.zero, $ss_Int64.zero);
						expect(a25.equalsT($ss_Int64.zero)).toBe(true);
					});
				});
				describe('One + Zero', function() {
					it('should equal one', function() {
						var a26 = $ss_Int64.op_Addition($ss_Int64.one, $ss_Int64.zero);
						expect(a26.equalsT($ss_Int64.one)).toBe(true);
					});
				});
				describe('One + One', function() {
					it('should equal two', function() {
						var a27 = $ss_Int64.op_Addition($ss_Int64.one, $ss_Int64.one);
						expect(a27.equalsT(new $ss_Int64(2, 0, 0))).toBe(true);
					});
				});
				describe('IntMax + One', function() {
					it('should equal 2147483648', function() {
						var a28 = $ss_Int64.op_Addition(new $ss_Int64(16777215, 127, 0), $ss_Int64.one);
						expect(a28.equalsT(new $ss_Int64(0, 128, 0))).toBe(true);
					});
				});
				describe('IntMax + IntMax', function() {
					it('should equal 4294967294', function() {
						var a29 = new $ss_Int64(16777215, 127, 0);
						var b24 = new $ss_Int64(16777215, 127, 0);
						expect($ss_Int64.op_Equality($ss_Int64.op_Addition(a29, b24), new $ss_Int64(16777214, 255, 0))).toBe(true);
					});
				});
				describe('IntMin + IntMin', function() {
					it('should equal -4294967294', function() {
						var a30 = $ss_Int64.op_Implicit$2(-2147483648);
						expect($ss_Int64.op_Equality($ss_Int64.op_Addition(a30, a30), new $ss_Int64(0, 16776960, 65535))).toBe(true);
					});
				});
				describe('IntMin + IntMax', function() {
					it('should equal -1', function() {
						var a31 = $ss_Int64.op_Implicit$2(-2147483648);
						var b25 = $ss_Int64.op_Implicit$2(2147483647);
						expect($ss_Int64.op_Equality($ss_Int64.op_Addition(a31, b25), new $ss_Int64(16777215, 16777215, 65535))).toBe(true);
						expect($ss_Int64.op_Equality($ss_Int64.op_Addition(b25, a31), new $ss_Int64(16777215, 16777215, 65535))).toBe(true);
					});
				});
				describe('Int64Min + Int64Max', function() {
					it('should equal -1', function() {
						var a32 = $ss_Int64.minValue;
						var b26 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_Addition(a32, b26), new $ss_Int64(16777215, 16777215, 65535))).toBe(true);
						expect($ss_Int64.op_Equality($ss_Int64.op_Addition(b26, a32), new $ss_Int64(16777215, 16777215, 65535))).toBe(true);
					});
				});
				describe('Int64Min + Int64Max + Int64Max ', function() {
					it('should equal -1', function() {
						var a33 = $ss_Int64.minValue;
						var b27 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_Addition($ss_Int64.op_Addition(a33, b27), b27), new $ss_Int64(16777214, 16777215, 32767))).toBe(true);
						expect($ss_Int64.op_Equality($ss_Int64.op_Addition($ss_Int64.op_Addition(b27, a33), b27), new $ss_Int64(16777214, 16777215, 32767))).toBe(true);
						expect($ss_Int64.op_Equality($ss_Int64.op_Addition($ss_Int64.op_Addition(b27, b27), a33), new $ss_Int64(16777214, 16777215, 32767))).toBe(true);
					});
				});
			});
			describe('Subtraction', function() {
				describe('Zero - Zero', function() {
					it('should equal zero', function() {
						var a34 = $ss_Int64.op_Subtraction($ss_Int64.zero, $ss_Int64.zero);
						expect(a34.equalsT($ss_Int64.zero)).toBe(true);
					});
				});
				describe('One - Zero', function() {
					it('should equal one', function() {
						var a35 = $ss_Int64.op_Subtraction($ss_Int64.one, $ss_Int64.zero);
						expect(a35.equalsT($ss_Int64.one)).toBe(true);
					});
				});
				describe('One - One', function() {
					it('should equal Zero', function() {
						var a36 = $ss_Int64.op_Subtraction($ss_Int64.one, $ss_Int64.one);
						expect($ss_Int64.op_Equality(a36, $ss_Int64.zero)).toBe(true);
					});
				});
				describe('IntMax - One', function() {
					it('should equal 2147483646', function() {
						var a37 = $ss_Int64.op_Subtraction(new $ss_Int64(16777215, 127, 0), $ss_Int64.one);
						expect(a37.equalsT(new $ss_Int64(16777214, 127, 0))).toBe(true);
					});
				});
				describe('IntMax - IntMax', function() {
					it('should equal 0', function() {
						var a38 = new $ss_Int64(16777215, 127, 0);
						var b28 = new $ss_Int64(16777215, 127, 0);
						expect($ss_Int64.op_Equality($ss_Int64.op_Subtraction(a38, b28), $ss_Int64.zero)).toBe(true);
					});
				});
				describe('IntMin - IntMin', function() {
					it('should equal 0', function() {
						var a39 = $ss_Int64.op_Implicit$2(-2147483648);
						expect($ss_Int64.op_Equality($ss_Int64.op_Subtraction(a39, a39), $ss_Int64.zero)).toBe(true);
					});
				});
				describe('IntMin - IntMax', function() {
					it('should equal -4294967295', function() {
						var a40 = $ss_Int64.op_Implicit$2(-2147483648);
						var b29 = $ss_Int64.op_Implicit$2(2147483647);
						expect($ss_Int64.op_Equality($ss_Int64.op_Subtraction(a40, b29), new $ss_Int64(1, 16776960, 65535))).toBe(true);
					});
				});
				describe('- Int64Max - Int64Min', function() {
					it('should equal 1', function() {
						var a41 = $ss_Int64.minValue;
						var b30 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_Subtraction($ss_Int64.op_UnaryNegation(b30), a41), $ss_Int64.one)).toBe(true);
					});
				});
				describe('Int64Min + Int64Max - Int64Min ', function() {
					it('should equal -9223372036854775807', function() {
						var a42 = $ss_Int64.minValue;
						var b31 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_Subtraction($ss_Int64.op_Subtraction(a42, b31), a42), new $ss_Int64(1, 0, 32768))).toBe(true);
					});
				});
			});
			describe('Multiplication', function() {
				describe('Zero * Zero', function() {
					it('should equal Zero', function() {
						var a43 = $ss_Int64.zero;
						expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a43, a43), $ss_Int64.zero)).toBe(true);
					});
				});
				describe('One * Zero', function() {
					it('should equal Zero', function() {
						var a44 = $ss_Int64.one;
						var b32 = $ss_Int64.zero;
						expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a44, b32), $ss_Int64.zero)).toBe(true);
					});
				});
				describe('One * One', function() {
					it('should equal One', function() {
						var a45 = $ss_Int64.one;
						expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a45, a45), $ss_Int64.one)).toBe(true);
					});
				});
				describe('-One * -One', function() {
					it('should equal One', function() {
						var a46 = $ss_Int64.op_UnaryNegation($ss_Int64.one);
						expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a46, a46), $ss_Int64.one)).toBe(true);
					});
				});
				describe('-One * One', function() {
					it('should equal -1', function() {
						var a47 = $ss_Int64.one;
						expect($ss_Int64.op_Equality($ss_Int64.op_Multiply($ss_Int64.op_UnaryNegation(a47), a47), $ss_Int64.op_UnaryNegation($ss_Int64.one))).toBe(true);
					});
				});
				describe('3 * 715827882', function() {
					it('should equal 2147483646', function() {
						var a48 = new $ss_Int64(3, 0, 0);
						var b33 = new $ss_Int64(11184810, 42, 0);
						expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a48, b33), new $ss_Int64(16777214, 127, 0))).toBe(true);
					});
				});
				describe('60247241209 * 153092023', function() {
					it('should equal 9223372036854775807', function() {
						var a49 = new $ss_Int64(258553, 3591, 0);
						var b34 = new $ss_Int64(2097079, 9, 0);
						expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a49, b34), $ss_Int64.maxValue)).toBe(true);
					});
				});
				describe('Int64Max * Int64Max', function() {
					it('should equal 1', function() {
						var a50 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a50, a50), $ss_Int64.one)).toBe(true);
					});
				});
				describe('34359738368 * -268435456', function() {
					it('should equal -9223372036854775808', function() {
						var a51 = new $ss_Int64(0, 2048, 0);
						var b35 = new $ss_Int64(0, 16777200, 65535);
						expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a51, b35), $ss_Int64.minValue)).toBe(true);
					});
				});
				describe('Int64Min * Int64Min', function() {
					it('should equal 0', function() {
						var a52 = $ss_Int64.minValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a52, a52), $ss_Int64.zero)).toBe(true);
					});
				});
			});
			describe('Division', function() {
				describe('Zero / Zero', function() {
					it('should thow Divide by zero Exception', function() {
						var a53 = $ss_Int64.zero;
						expect(function() {
							return $ss_Int64.op_Division(a53, a53);
						}).toThrow();
					});
				});
				describe('One / Zero', function() {
					it('should thow Divide by zero Exception', function() {
						var a54 = $ss_Int64.one;
						var b36 = $ss_Int64.zero;
						expect(function() {
							return $ss_Int64.op_Division(a54, b36);
						}).toThrow();
					});
				});
				describe('Zero / One', function() {
					it('should equal 0', function() {
						var a55 = $ss_Int64.one;
						var b37 = $ss_Int64.zero;
						expect($ss_Int64.op_Equality($ss_Int64.op_Division(b37, a55), $ss_Int64.zero)).toBe(true);
					});
				});
				describe('One / One', function() {
					it('should equal One', function() {
						var a56 = $ss_Int64.one;
						expect($ss_Int64.op_Equality($ss_Int64.op_Division(a56, a56), $ss_Int64.one)).toBe(true);
					});
				});
				describe('-One / -One', function() {
					it('should equal 1', function() {
						var a57 = $ss_Int64.op_UnaryNegation($ss_Int64.one);
						expect($ss_Int64.op_Equality($ss_Int64.op_Division(a57, a57), $ss_Int64.one)).toBe(true);
					});
				});
				describe('-One / One', function() {
					it('should equal -1', function() {
						var a58 = $ss_Int64.one;
						expect($ss_Int64.op_Equality($ss_Int64.op_Division($ss_Int64.op_UnaryNegation(a58), a58), $ss_Int64.op_UnaryNegation($ss_Int64.one))).toBe(true);
					});
				});
				describe('One / -One', function() {
					it('should equal -1', function() {
						var a59 = $ss_Int64.one;
						expect($ss_Int64.op_Equality($ss_Int64.op_Division(a59, $ss_Int64.op_UnaryNegation(a59)), $ss_Int64.op_UnaryNegation($ss_Int64.one))).toBe(true);
					});
				});
				describe('9223372036854775807 / 153092023', function() {
					it('should equal 60247241209 ', function() {
						var a60 = $ss_Int64.maxValue;
						var b38 = new $ss_Int64(2097079, 9, 0);
						expect($ss_Int64.op_Equality($ss_Int64.op_Division(a60, b38), new $ss_Int64(258553, 3591, 0))).toBe(true);
					});
				});
				describe('Int64Max / Int64Max', function() {
					it('should equal 1', function() {
						var a61 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_Division(a61, a61), $ss_Int64.one)).toBe(true);
					});
				});
				describe('1 / Int64Man', function() {
					it('should equal 0', function() {
						var a62 = $ss_Int64.one;
						var b39 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_Division(a62, b39), $ss_Int64.zero)).toBe(true);
					});
				});
				describe('1 / Int64Min', function() {
					it('should equal 0', function() {
						var a63 = $ss_Int64.one;
						var b40 = $ss_Int64.minValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_Division(a63, b40), $ss_Int64.zero)).toBe(true);
					});
				});
				describe('Int64Min / 1', function() {
					it('should equal Int64Min', function() {
						var a64 = $ss_Int64.one;
						var b41 = $ss_Int64.minValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_Division(b41, a64), $ss_Int64.minValue)).toBe(true);
					});
				});
				describe('Int64Min / Int64Min', function() {
					it('should equal 1', function() {
						var a65 = $ss_Int64.minValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_Division(a65, a65), $ss_Int64.one)).toBe(true);
					});
				});
			});
			describe('Casts', function() {
				describe('Byte', function() {
					it('should equal the min value', function() {
						var a66 = 0;
						var b42 = $ss_Int64.op_Implicit(a66);
						expect($ss_Int64.op_Equality(b42, new $ss_Int64(0, 0, 0))).toBe(true);
					});
					it('should equal the value', function() {
						var a67 = 128;
						var b43 = $ss_Int64.op_Implicit(a67);
						expect($ss_Int64.op_Equality(b43, new $ss_Int64(a67, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a68 = 255;
						var b44 = $ss_Int64.op_Implicit(a68);
						expect($ss_Int64.op_Equality(b44, new $ss_Int64(255, 0, 0))).toBe(true);
					});
				});
				describe('SByte', function() {
					it('should equal the min value', function() {
						var a69 = -128;
						var b45 = $ss_Int64.op_Implicit$3(a69);
						expect($ss_Int64.op_Equality(b45, new $ss_Int64(16777088, 16777215, 65535))).toBe(true);
					});
					it('should equal the value', function() {
						var a70 = 0;
						var b46 = $ss_Int64.op_Implicit$3(a70);
						expect($ss_Int64.op_Equality(b46, new $ss_Int64(a70, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a71 = 127;
						var b47 = $ss_Int64.op_Implicit$3(a71);
						expect($ss_Int64.op_Equality(b47, new $ss_Int64(a71, 0, 0))).toBe(true);
					});
				});
				describe('UInt16', function() {
					it('should equal the min value', function() {
						var a72 = 0;
						var b48 = $ss_Int64.op_Implicit$4(a72);
						expect($ss_Int64.op_Equality(b48, new $ss_Int64(a72, 0, 0))).toBe(true);
					});
					it('should equal the value', function() {
						var a73 = 0;
						var b49 = $ss_Int64.op_Implicit$4(a73);
						expect($ss_Int64.op_Equality(b49, new $ss_Int64(a73, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a74 = 65535;
						var b50 = $ss_Int64.op_Implicit$4(a74);
						expect($ss_Int64.op_Equality(b50, new $ss_Int64(a74, 0, 0))).toBe(true);
					});
				});
				describe('Int16', function() {
					it('should equal the min value', function() {
						var a75 = -32768;
						var b51 = $ss_Int64.op_Implicit$1(a75);
						expect($ss_Int64.op_Equality(b51, new $ss_Int64(16744448, 16777215, 65535))).toBe(true);
					});
					it('should equal the value', function() {
						var a76 = 0;
						var b52 = $ss_Int64.op_Implicit$1(a76);
						expect($ss_Int64.op_Equality(b52, new $ss_Int64(a76, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a77 = 32767;
						var b53 = $ss_Int64.op_Implicit$1(a77);
						expect($ss_Int64.op_Equality(b53, new $ss_Int64(a77, 0, 0))).toBe(true);
					});
				});
				describe('UInt32', function() {
					it('should equal the min value', function() {
						var a78 = 0;
						var b54 = $ss_Int64.op_Implicit$5(a78);
						expect($ss_Int64.op_Equality(b54, new $ss_Int64(0, 0, 0))).toBe(true);
					});
					it('should equal the value', function() {
						var a79 = 2147483647;
						var b55 = $ss_Int64.op_Implicit$5(a79);
						expect($ss_Int64.op_Equality(b55, new $ss_Int64(16777215, 127, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a80 = 4294967295;
						var b56 = $ss_Int64.op_Implicit$5(a80);
						expect($ss_Int64.op_Equality(b56, new $ss_Int64(16777215, 255, 0))).toBe(true);
					});
				});
				describe('Int32', function() {
					it('should equal the min value', function() {
						var a81 = -2147483648;
						var b57 = $ss_Int64.op_Implicit$2(a81);
						expect($ss_Int64.op_Equality(b57, new $ss_Int64(0, 16777088, 65535))).toBe(true);
					});
					it('should equal the value', function() {
						var a82 = 0;
						var b58 = $ss_Int64.op_Implicit$2(a82);
						expect($ss_Int64.op_Equality(b58, new $ss_Int64(0, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a83 = 2147483647;
						var b59 = $ss_Int64.op_Implicit$2(a83);
						expect($ss_Int64.op_Equality(b59, new $ss_Int64(16777215, 127, 0))).toBe(true);
					});
				});
				describe('Double', function() {
					it('should equal the min value', function() {
						var a84 = -2147483648;
						var b60 = $ss_Int64.op_Explicit$1(a84);
						expect($ss_Int64.op_Equality(b60, new $ss_Int64(0, 16777088, 65535))).toBe(true);
					});
					it('should equal the value', function() {
						var a85 = 0;
						var b61 = $ss_Int64.op_Explicit$1(a85);
						expect($ss_Int64.op_Equality(b61, new $ss_Int64(0, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a86 = 2147483647;
						var b62 = $ss_Int64.op_Explicit$1(a86);
						expect($ss_Int64.op_Equality(b62, new $ss_Int64(16777215, 127, 0))).toBe(true);
					});
				});
				describe('Single', function() {
					it('should equal the min value', function() {
						var a87 = -2147483648;
						var b63 = $ss_Int64.op_Explicit$2(a87);
						expect($ss_Int64.op_Equality(b63, new $ss_Int64(0, 16777088, 65535))).toBe(true);
					});
					it('should equal the value', function() {
						var a88 = 0;
						var b64 = $ss_Int64.op_Explicit$2(a88);
						expect($ss_Int64.op_Equality(b64, new $ss_Int64(0, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a89 = 2147483647;
						var b65 = $ss_Int64.op_Explicit$2(a89);
						expect($ss_Int64.op_Equality(b65, new $ss_Int64(16777215, 127, 0))).toBe(true);
					});
				});
				describe('Decimal', function() {
					it('should equal the min value', function() {
						var a90 = -2147483648;
						//Decimal.MinValue;
						var b66 = $ss_Int64.op_Explicit(a90);
						expect($ss_Int64.op_Equality(b66, new $ss_Int64(0, 16777088, 65535))).toBe(true);
					});
					it('should equal the value', function() {
						var a91 = 0;
						var b67 = $ss_Int64.op_Explicit(a91);
						expect($ss_Int64.op_Equality(b67, new $ss_Int64(0, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a92 = 2147483647;
						//Decimal.MaxValue;
						var b68 = $ss_Int64.op_Explicit(a92);
						expect($ss_Int64.op_Equality(b68, new $ss_Int64(16777215, 127, 0))).toBe(true);
					});
				});
			});
		});
	};
	global.ss.Int64Spec = $ss_Int64Spec;
	////////////////////////////////////////////////////////////////////////////////
	// ss.UInt64
	var $ss_UInt64 = function(low, mid, high) {
		this.$low = 0;
		this.$mid = 0;
		this.$high = 0;
		this.$low = low & 16777215;
		this.$mid = mid & 16777215;
		this.$high = high & 65535;
	};
	$ss_UInt64.__typeName = 'ss.UInt64';
	$ss_UInt64.createInstance = function() {
		return ss.Int32.Zero;
	};
	$ss_UInt64.getDefaultValue = $ss_UInt64.createInstance;
	$ss_UInt64.parse = function(text) {
		var result = {};
		if (!$ss_UInt64.tryParse(text, result)) {
			throw new ss.FormatException('Input string was not in a correct format.');
		}
		return result.$;
	};
	$ss_UInt64.tryParse = function(text, result) {
		var radix = 10;
		result.$ = $ss_UInt64.zero;
		//if (style & System.Globalization.NumberStyles.AllowHexSpecifier)
		//    radix = 16;
		var rdx = new $ss_UInt64(radix, 0, 0);
		for (var i = 0; i < text.length; i++) {
			if (i === 0 && text.charCodeAt(i) === 45) {
				result.$ = $ss_UInt64.zero;
				return false;
			}
			var c = parseInt(String.fromCharCode(text.charCodeAt(i)), radix);
			if (isNaN(c)) {
				result.$ = $ss_UInt64.zero;
				return false;
			}
			result.$ = $ss_UInt64.op_Addition(new $ss_UInt64(c, 0, 0), $ss_UInt64.op_Multiply(rdx, result.$));
		}
		return true;
	};
	$ss_UInt64.op_Addition = function(a, b) {
		//same as Int64
		var cLow = a.$low + b.$low;
		var rLow = (cLow & $ss_UInt64.$mask) >> 24;
		var cMid = rLow + a.$mid + b.$mid;
		var rMid = (cMid & $ss_UInt64.$mask) >> 24;
		var cHigh = rMid + a.$high + b.$high;
		return new $ss_UInt64(cLow, cMid, cHigh);
	};
	$ss_UInt64.op_Subtraction = function(a, b) {
		//same as Int64
		var cLow = a.$low - b.$low | 0;
		var rLow = 0;
		if (cLow < 0) {
			cLow = 16777216 + cLow;
			rLow = -1;
		}
		var cMid = rLow + (a.$mid - b.$mid | 0) | 0;
		var rMid = 0;
		if (cMid < 0) {
			cMid = 16777216 + cMid;
			rMid = -1;
		}
		var cHigh = rMid + (a.$high - b.$high | 0) | 0;
		if (cHigh < 0) {
			cHigh = 65536 + cHigh;
		}
		return new $ss_UInt64(cLow, cMid, cHigh);
	};
	$ss_UInt64.op_Multiply = function(a, b) {
		if (a.equalsT($ss_UInt64.zero) || b.equalsT($ss_UInt64.zero)) {
			return $ss_UInt64.zero;
		}
		if ($ss_UInt64.op_GreaterThan(a, b)) {
			return $ss_UInt64.op_Multiply(b, a);
		}
		var c = $ss_UInt64.zero;
		if ((a.$low & 1) === 1) {
			c = b;
		}
		while ($ss_UInt64.op_Inequality(a, $ss_UInt64.one)) {
			a = $ss_UInt64.op_RightShift(a, 1);
			b = $ss_UInt64.op_LeftShift(b, 1);
			if ((a.$low & 1) === 1) {
				c = $ss_UInt64.op_Addition(c, b);
			}
		}
		return c;
	};
	$ss_UInt64.op_Division = function(a, b) {
		debugger;
		if (b.equalsT($ss_UInt64.minValue)) {
			throw new ss.DivideByZeroException();
		}
		var q = $ss_UInt64.zero;
		var r = $ss_UInt64.zero;
		for (var i = 63; i >= 0; i--) {
			r = $ss_UInt64.op_LeftShift(r, 1);
			var x;
			var s;
			if (i < 24) {
				x = a.$low;
				s = i;
			}
			else if (i < 48) {
				x = a.$mid;
				s = i - 24;
			}
			else {
				x = a.$high;
				s = i - 48;
			}
			r = new $ss_UInt64(r.$low | (x & 1 << s) >> s, r.$mid, r.$high);
			if ($ss_UInt64.op_LessThan(r, b)) {
				continue;
			}
			r = $ss_UInt64.op_Subtraction(r, b);
			if (i < 24) {
				q = new $ss_UInt64(q.$low | 1 << s, q.$mid, q.$high);
			}
			else if (i < 48) {
				q = new $ss_UInt64(q.$low, q.$mid | 1 << s, q.$high);
			}
			else {
				q = new $ss_UInt64(q.$low, q.$mid, q.$high | 1 << s);
			}
		}
		return q;
	};
	$ss_UInt64.op_Modulus = function(a, b) {
		if (b.equalsT($ss_UInt64.minValue)) {
			throw new ss.DivideByZeroException();
		}
		var r = $ss_UInt64.zero;
		for (var i = 63; i >= 0; i--) {
			r = $ss_UInt64.op_LeftShift(r, 1);
			var x;
			var s;
			if (i < 24) {
				x = a.$low;
				s = i;
			}
			else if (i < 48) {
				x = a.$mid;
				s = i - 24;
			}
			else {
				x = a.$high;
				s = i - 48;
			}
			r = new $ss_UInt64(r.$low | (x & 1 << s) >> s, r.$mid, r.$high);
			if ($ss_UInt64.op_GreaterThanOrEqual(r, b)) {
				r = $ss_UInt64.op_Subtraction(r, b);
			}
		}
		return r;
	};
	$ss_UInt64.op_BitwiseAnd = function(a, b) {
		//same as Int64
		return new $ss_UInt64(a.$low & b.$low, a.$mid & b.$mid, a.$high & b.$high);
	};
	$ss_UInt64.op_BitwiseOr = function(a, b) {
		//same as Int64
		return new $ss_UInt64(a.$low | b.$low, a.$mid | b.$mid, a.$high | b.$high);
	};
	$ss_UInt64.op_ExclusiveOr = function(a, b) {
		//same as Int64
		return new $ss_UInt64(a.$low ^ b.$low, a.$mid ^ b.$mid, a.$high ^ b.$high);
	};
	$ss_UInt64.op_LeftShift = function(a, b) {
		//same as Int64
		b = b & 63;
		var maxShift = 8;
		if (b > 8) {
			return $ss_UInt64.op_LeftShift($ss_UInt64.op_LeftShift(a, maxShift), b - maxShift);
		}
		var cLowT = a.$low << b;
		var cLow = cLowT & 16777215;
		var rLow = cLowT >>> 24 & 16777215;
		var cMidT = a.$mid << b | rLow;
		var cMid = cMidT & 16777215;
		var rMid = cMidT >>> 24 & 65535;
		var cHighT = a.$high << b;
		var cHigh = cHighT & 65535 | rMid;
		return new $ss_UInt64(cLow, cMid, cHigh);
	};
	$ss_UInt64.op_RightShift = function(a, b) {
		b = b & 63;
		if (b > 24) {
			return $ss_UInt64.op_RightShift($ss_UInt64.op_RightShift(a, 24), b - 24);
		}
		var m = (1 << b) - 1;
		var rHigh = (a.$high & m) << 24 - b;
		var cHighT = a.$high >> b;
		var rMid = (a.$mid & m) << 24 - b;
		var cMidT = a.$mid >> b;
		var cLowT = a.$low >> b;
		return new $ss_UInt64(cLowT | rMid, cMidT | rHigh, cHighT);
	};
	$ss_UInt64.op_Equality = function(a, b) {
		//same as Int64
		return a.$low === b.$low && a.$mid === b.$mid && a.$high === b.$high;
	};
	$ss_UInt64.op_Inequality = function(a, b) {
		//same as Int64
		return a.$low !== b.$low || a.$mid !== b.$mid || a.$high !== b.$high;
	};
	$ss_UInt64.op_LessThanOrEqual = function(a, b) {
		var adiff = a.$high - b.$high;
		if (adiff < 0) {
			return true;
		}
		if (adiff > 0) {
			return false;
		}
		var bdiff = a.$mid - b.$mid;
		if (bdiff < 0) {
			return true;
		}
		if (bdiff > 0) {
			return false;
		}
		return a.$low <= b.$low;
	};
	$ss_UInt64.op_GreaterThanOrEqual = function(a, b) {
		var adiff = a.$high - b.$high;
		if (adiff > 0) {
			return true;
		}
		if (adiff < 0) {
			return false;
		}
		var bdiff = a.$mid - b.$mid;
		if (bdiff > 0) {
			return true;
		}
		if (bdiff < 0) {
			return false;
		}
		return a.$low >= b.$low;
	};
	$ss_UInt64.op_LessThan = function(a, b) {
		var adiff = a.$high - b.$high;
		if (adiff < 0) {
			return true;
		}
		if (adiff > 0) {
			return false;
		}
		var bdiff = a.$mid - b.$mid;
		if (bdiff < 0) {
			return true;
		}
		if (bdiff > 0) {
			return false;
		}
		return a.$low < b.$low;
	};
	$ss_UInt64.op_GreaterThan = function(a, b) {
		var adiff = a.$high - b.$high;
		if (adiff > 0) {
			return true;
		}
		if (adiff < 0) {
			return false;
		}
		var bdiff = a.$mid - b.$mid;
		if (bdiff > 0) {
			return true;
		}
		if (bdiff < 0) {
			return false;
		}
		return a.$low > b.$low;
	};
	$ss_UInt64.op_UnaryNegation = function(a) {
		return $ss_Int64.op_Addition($ss_Int64.op_Explicit$b($ss_UInt64.op_OnesComplement(a)), $ss_Int64.one);
	};
	$ss_UInt64.op_OnesComplement = function(a) {
		return new $ss_UInt64(~a.$low, ~a.$mid, ~a.$high);
	};
	$ss_UInt64.op_Increment = function(a) {
		//same as Int64
		var cLow = a.$low + 1;
		var rLow = (cLow & $ss_UInt64.$mask) >> 24;
		var cMid = rLow + a.$mid;
		var rMid = (cMid & $ss_UInt64.$mask) >> 24;
		var cHigh = rMid + a.$high;
		return new $ss_UInt64(cLow, cMid, cHigh);
	};
	$ss_UInt64.op_Decrement = function(a) {
		//same as Int64
		var cLow = a.$low - 1 | 0;
		var rLow = 0;
		if (cLow < 0) {
			cLow = 16777216 + cLow;
			rLow = -1;
		}
		var cMid = rLow + a.$mid | 0;
		var rMid = 0;
		if (cMid < 0) {
			cMid = 16777216 + cMid;
			rMid = -1;
		}
		var cHigh = rMid + a.$high | 0;
		if (cHigh < 0) {
			cHigh = 65536 + cHigh;
		}
		return new $ss_UInt64(cLow, cMid, cHigh);
	};
	$ss_UInt64.op_Explicit$6 = function(a) {
		return new $ss_UInt64(a.$low, a.$mid, a.$high);
	};
	$ss_UInt64.op_Implicit = function(a) {
		return new $ss_UInt64(a, 0, 0);
	};
	$ss_UInt64.op_Explicit$4 = function(a) {
		return new $ss_UInt64(a, ((a < 0) ? 16777215 : 0), ((a < 0) ? 65535 : 0));
	};
	$ss_UInt64.op_Implicit$1 = function(a) {
		return new $ss_UInt64(a, 0, 0);
	};
	$ss_UInt64.op_Explicit$2 = function(a) {
		return new $ss_UInt64(a, ((a < 0) ? 16777215 : 0), ((a < 0) ? 65535 : 0));
	};
	$ss_UInt64.op_Implicit$2 = function(a) {
		return new $ss_UInt64(a, a >>> 24, 0);
	};
	$ss_UInt64.op_Explicit$3 = function(a) {
		return new $ss_UInt64(a, a >> 24, ((a < 0) ? 65535 : 0));
	};
	$ss_UInt64.op_Explicit$1 = function(a) {
		if (a < 0) {
			throw new ss.ArgumentOutOfRangeException();
		}
		var floorN = Math.floor(a);
		var n0 = ss.Int32.trunc(floorN) | 0;
		var n1 = ss.Int32.trunc(floorN / 16777216) | 0;
		var n2 = ss.Int32.trunc(floorN / 281474976710656) | 0;
		return new $ss_UInt64(n0, n1, n2);
	};
	$ss_UInt64.op_Explicit$5 = function(a) {
		return $ss_UInt64.op_Explicit$1(a);
	};
	$ss_UInt64.op_Explicit = function(a) {
		return $ss_UInt64.op_Explicit$1(a);
	};
	$ss_UInt64.op_Explicit$7 = function(a) {
		return a.$low & 255;
	};
	$ss_UInt64.op_Explicit$b = function(a) {
		return a.$low & 255;
	};
	$ss_UInt64.op_Explicit$d = function(a) {
		return a.$low & 65535;
	};
	$ss_UInt64.op_Explicit$9 = function(a) {
		return a.$low & 65535;
	};
	$ss_UInt64.op_Explicit$e = function(a) {
		//return (UInt32)((a.Low | a.Mid << 24) & UInt32.MaxValue);
		// return (a.$low | a.$mid << 24) & 4294967295;
		throw new ss.NotImplementedException();
	};
	$ss_UInt64.op_Explicit$a = function(a) {
		//return (UInt32)((a.Low | a.Mid << 24) & UInt32.MaxValue);
		// return (a.$low | a.$mid << 24) & 4294967295;
		throw new ss.NotImplementedException();
	};
	$ss_UInt64.op_Explicit$8 = function(a) {
		return 16777216 * (16777216 * a.$high + a.$mid) + a.$low;
	};
	$ss_UInt64.op_Explicit$c = function(a) {
		return 16777216 * (16777216 * a.$high + a.$mid) + a.$low;
	};
	$ss_UInt64.op_Implicit$3 = function(a) {
		return 16777216 * (16777216 * a.$high + a.$mid) + a.$low;
	};
	global.ss.UInt64 = $ss_UInt64;
	ss.initClass($ss_Int64, $asm, {
		get_$isNegative: function() {
			return (this.$high & 32768) !== 0;
		},
		get_abs: function() {
			return (this.get_$isNegative() ? $ss_Int64.op_UnaryNegation(this) : this);
		},
		format$1: function(format) {
			return this.format(format);
		},
		localeFormat: function(format) {
			return this.format(format);
		},
		toString: function() {
			return this.format(null);
		},
		format: function(format) {
			return (this.get_$isNegative() ? ('-' + $ss_UInt64.op_Explicit$6($ss_Int64.op_UnaryNegation(this)).format(format)) : $ss_UInt64.op_Explicit$6(this).format(format));
		},
		compareTo: function(other) {
			if ($ss_Int64.op_LessThan(this, other)) {
				return -1;
			}
			if ($ss_Int64.op_GreaterThan(this, other)) {
				return 1;
			}
			return 0;
		},
		equalsT: function(other) {
			return this.$low === other.$low && this.$mid === other.$mid && this.$high === other.$high;
		},
		equals: function(obj) {
			if (ss.referenceEquals(null, obj)) {
				return false;
			}
			return ss.isInstanceOfType(obj, $ss_Int64) && this.equalsT(ss.unbox(ss.cast(obj, $ss_Int64)));
		},
		getHashCode: function() {
			var hashCode = this.$low;
			hashCode = hashCode * 397 ^ this.$mid;
			hashCode = hashCode * 397 ^ this.$high;
			return hashCode;
		}
	}, null, [ss.IComparable, ss.IEquatable, ss.IFormattable]);
	$ss_Int64.__class = false;
	ss.initClass($ss_Int64Spec, $asm, {}, WebApplications.Saltarelle.JasmineTestUtils.TestSuite);
	ss.initClass($ss_UInt64, $asm, {
		format$1: function(format) {
			return this.format(format);
		},
		localeFormat: function(format) {
			return this.format(format);
		},
		toString: function() {
			return this.format(null);
		},
		format: function(format) {
			var ten = new $ss_UInt64(10, 0, 0);
			var a = this;
			var s = '';
			do {
				var r = $ss_UInt64.op_Modulus(a, ten);
				s = r.$low.toString() + s;
				a = $ss_UInt64.op_Division(a, ten);
			} while ($ss_UInt64.op_GreaterThan(a, $ss_UInt64.zero));
			return s;
		},
		compareTo: function(other) {
			if ($ss_UInt64.op_LessThan(this, other)) {
				return -1;
			}
			return ($ss_UInt64.op_GreaterThan(this, other) ? 1 : 0);
		},
		equalsT: function(other) {
			return this.$low === other.$low && this.$mid === other.$mid && this.$high === other.$high;
		},
		equals: function(obj) {
			if (ss.referenceEquals(null, obj)) {
				return false;
			}
			return ss.isInstanceOfType(obj, $ss_UInt64) && this.equalsT(ss.unbox(ss.cast(obj, $ss_UInt64)));
		},
		getHashCode: function() {
			var hashCode = this.$low;
			hashCode = hashCode * 397 ^ this.$mid;
			hashCode = hashCode * 397 ^ this.$high;
			return hashCode;
		}
	}, null, [ss.IComparable, ss.IEquatable, ss.IFormattable]);
	$ss_UInt64.__class = false;
	ss.setMetadata($ss_Int64Spec, { members: [{ attr: [new WebApplications.Saltarelle.JasmineTestUtils.TestMethodAttribute()], name: 'Tests', isStatic: true, type: 8, sname: 'tests', returnType: Object, params: [] }] });
	$asm.attr = [new WebApplications.Saltarelle.JasmineTestUtils.TestAssemblyAttribute()];
	(function() {
		$ss_Int64.minValue = new $ss_Int64(0, 0, 32768);
		$ss_Int64.zero = new $ss_Int64(0, 0, 0);
		$ss_Int64.one = new $ss_Int64(1, 0, 0);
		$ss_Int64.maxValue = new $ss_Int64(16777215, 16777215, 32767);
		$ss_Int64.$mask = -16777216;
	})();
	(function() {
		$ss_UInt64.minValue = new $ss_UInt64(0, 0, 0);
		$ss_UInt64.zero = new $ss_UInt64(0, 0, 0);
		$ss_UInt64.one = new $ss_UInt64(1, 0, 0);
		$ss_UInt64.maxValue = new $ss_UInt64(16777215, 16777215, 32767);
		$ss_UInt64.$mask = -16777216;
	})();
})();
