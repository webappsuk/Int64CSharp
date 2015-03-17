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
		var negate = a.get_$isNegative() !== b.get_$isNegative();
		var c = $ss_UInt64.op_Division($ss_UInt64.op_Explicit$6(a.get_abs()), $ss_UInt64.op_Explicit$6(b.get_abs()));
		return (negate ? $ss_UInt64.op_UnaryNegation(c) : $ss_Int64.op_Explicit$b(c));
	};
	$ss_Int64.op_Modulus = function(a, b) {
		if (b.equalsT($ss_Int64.zero)) {
			throw new ss.DivideByZeroException();
		}
		if (a.equalsT($ss_Int64.zero)) {
			return $ss_Int64.zero;
		}
		if (a.equalsT(b)) {
			return $ss_Int64.zero;
		}
		var negate = a.get_$isNegative();
		var c = $ss_UInt64.op_Modulus($ss_UInt64.op_Explicit$6(a.get_abs()), $ss_UInt64.op_Explicit$6(b.get_abs()));
		return (negate ? $ss_UInt64.op_UnaryNegation(c) : $ss_Int64.op_Explicit$b(c));
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
		if (b === 0) {
			return a;
		}
		var cLow, cMid, cHigh;
		if (b <= 24) {
			cLow = a.$low << b;
			cMid = a.$low >> 24 - b | a.$mid << b;
			cHigh = a.$mid >> 24 - b | a.$high << b;
		}
		else if (b <= 48) {
			cLow = 0;
			cMid = a.$low << b - 24;
			cHigh = a.$low >> 48 - b | a.$mid << b - 24;
		}
		else {
			cLow = 0;
			cMid = 0;
			cHigh = a.$low << b - 48;
		}
		return new $ss_Int64(cLow, cMid, cHigh);
	};
	$ss_Int64.op_RightShift = function(a, b) {
		// Int64 (signed) uses arithmetic shift, UIn64 (unsigned) uses logical shift
		b = b & 63;
		if (b === 0) {
			return a;
		}
		var aHigh = (a.get_$isNegative() ? (-65536 | a.$high) : a.$high);
		var cLow, cMid, cHigh;
		if (b <= 24) {
			cLow = a.$mid << 24 - b | a.$low >> b;
			cMid = aHigh << 24 - b | a.$mid >> b;
			cHigh = aHigh >> b;
		}
		else if (b <= 48) {
			cLow = aHigh << 48 - b | a.$mid >> b - 24;
			cMid = aHigh >> b - 24;
			cHigh = (a.get_$isNegative() ? 65535 : 0);
		}
		else {
			cLow = aHigh >> b - 48;
			cMid = (a.get_$isNegative() ? 16777215 : 0);
			cHigh = (a.get_$isNegative() ? 65535 : 0);
		}
		return new $ss_Int64(cLow, cMid, cHigh);
	};
	$ss_Int64.op_Equality = function(a, b) {
		return a.equalsT(b);
	};
	$ss_Int64.op_Inequality = function(a, b) {
		return !a.equalsT(b);
	};
	$ss_Int64.op_LessThanOrEqual = function(a, b) {
		return ((a.get_$isNegative() === b.get_$isNegative()) ? $ss_UInt64.op_LessThanOrEqual($ss_UInt64.op_Explicit$6(a), $ss_UInt64.op_Explicit$6(b)) : a.get_$isNegative());
	};
	$ss_Int64.op_GreaterThanOrEqual = function(a, b) {
		return ((a.get_$isNegative() === b.get_$isNegative()) ? $ss_UInt64.op_GreaterThanOrEqual($ss_UInt64.op_Explicit$6(a), $ss_UInt64.op_Explicit$6(b)) : b.get_$isNegative());
	};
	$ss_Int64.op_LessThan = function(a, b) {
		return ((a.get_$isNegative() === b.get_$isNegative()) ? $ss_UInt64.op_LessThan($ss_UInt64.op_Explicit$6(a), $ss_UInt64.op_Explicit$6(b)) : a.get_$isNegative());
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
				describe('Greater Than or Equal To', function() {
					it('should return Int64Max is greater than Int32Max', function() {
						var a25 = $ss_Int64.maxValue;
						var b24 = $ss_Int64.op_Implicit$2(2147483647);
						expect($ss_Int64.op_GreaterThanOrEqual(a25, b24)).toBe(true);
					});
					it('should return Int64Max is equal to Int64Max', function() {
						var a26 = $ss_Int64.maxValue;
						var b25 = $ss_Int64.maxValue;
						expect($ss_Int64.op_GreaterThanOrEqual(a26, b25)).toBe(true);
					});
					it('should return Int32Max is not greater than Int64Max', function() {
						var a27 = $ss_Int64.op_Implicit$2(2147483647);
						var b26 = $ss_Int64.maxValue;
						expect($ss_Int64.op_GreaterThanOrEqual(a27, b26)).toBe(false);
					});
					it('should return Int64Max is greater than Int64Min', function() {
						var a28 = $ss_Int64.maxValue;
						var b27 = $ss_Int64.minValue;
						expect($ss_Int64.op_GreaterThanOrEqual(a28, b27)).toBe(true);
					});
					it('should return Int64Min is not greater than Int64Max ', function() {
						var a29 = $ss_Int64.minValue;
						var b28 = $ss_Int64.maxValue;
						expect($ss_Int64.op_GreaterThanOrEqual(a29, b28)).toBe(false);
					});
					it('should return Int32Min is greater than Int64Min ', function() {
						var a30 = $ss_Int64.op_Implicit$2(-2147483648);
						var b29 = $ss_Int64.minValue;
						expect($ss_Int64.op_GreaterThanOrEqual(a30, b29)).toBe(true);
					});
					it('should return Int64Min is equal to Int64Min ', function() {
						var a31 = $ss_Int64.minValue;
						var b30 = $ss_Int64.minValue;
						expect($ss_Int64.op_GreaterThanOrEqual(a31, b30)).toBe(true);
					});
					it('should return Int64Min is not greater than Int32Min ', function() {
						var a32 = $ss_Int64.minValue;
						var b31 = $ss_Int64.op_Implicit$2(-2147483648);
						expect($ss_Int64.op_GreaterThanOrEqual(a32, b31)).toBe(false);
					});
				});
				describe('Greater Than', function() {
					it('should return Int64Max is greater than Int32Max', function() {
						var a33 = $ss_Int64.maxValue;
						var b32 = $ss_Int64.op_Implicit$2(2147483647);
						expect($ss_Int64.op_GreaterThan(a33, b32)).toBe(true);
					});
					it('should return Int64Max is not greater than Int64Max', function() {
						var a34 = $ss_Int64.maxValue;
						var b33 = $ss_Int64.maxValue;
						expect($ss_Int64.op_GreaterThan(a34, b33)).toBe(false);
					});
					it('should return Int32Max is not greater than Int64Max', function() {
						var a35 = $ss_Int64.op_Implicit$2(2147483647);
						var b34 = $ss_Int64.maxValue;
						expect($ss_Int64.op_GreaterThan(a35, b34)).toBe(false);
					});
					it('should return Int64Max is greater than Int64Min', function() {
						var a36 = $ss_Int64.maxValue;
						var b35 = $ss_Int64.minValue;
						expect($ss_Int64.op_GreaterThan(a36, b35)).toBe(true);
					});
					it('should return Int64Min is not greater than Int64Max ', function() {
						var a37 = $ss_Int64.minValue;
						var b36 = $ss_Int64.maxValue;
						expect($ss_Int64.op_GreaterThan(a37, b36)).toBe(false);
					});
					it('should return Int32Min is greater than Int64Min ', function() {
						var a38 = $ss_Int64.op_Implicit$2(-2147483648);
						var b37 = $ss_Int64.minValue;
						expect($ss_Int64.op_GreaterThan(a38, b37)).toBe(true);
					});
					it('should return Int64Min is not greater than Int64Min ', function() {
						var a39 = $ss_Int64.minValue;
						var b38 = $ss_Int64.minValue;
						expect($ss_Int64.op_GreaterThan(a39, b38)).toBe(false);
					});
					it('should return Int64Min is not greater than Int32Min ', function() {
						var a40 = $ss_Int64.minValue;
						var b39 = $ss_Int64.op_Implicit$2(-2147483648);
						expect($ss_Int64.op_GreaterThan(a40, b39)).toBe(false);
					});
				});
				describe('Less Than or Equal To', function() {
					it('should return Int32Max is less than Int64Max', function() {
						var a41 = $ss_Int64.op_Implicit$2(2147483647);
						var b40 = $ss_Int64.maxValue;
						expect($ss_Int64.op_LessThanOrEqual(a41, b40)).toBe(true);
					});
					it('should return Int64Max is equal to Int64Max', function() {
						var a42 = $ss_Int64.maxValue;
						var b41 = $ss_Int64.maxValue;
						expect($ss_Int64.op_LessThanOrEqual(a42, b41)).toBe(true);
					});
					it('should return Int64Max is not less than Int32Max', function() {
						var a43 = $ss_Int64.maxValue;
						var b42 = $ss_Int64.op_Implicit$2(2147483647);
						expect($ss_Int64.op_LessThanOrEqual(a43, b42)).toBe(false);
					});
					it('should return Int64Min is less than Int64Max', function() {
						debugger;
						var a44 = $ss_Int64.minValue;
						var b43 = $ss_Int64.maxValue;
						expect($ss_Int64.op_LessThanOrEqual(a44, b43)).toBe(true);
					});
					it('should return Int64Max is not less than Int64Min ', function() {
						debugger;
						var a45 = $ss_Int64.maxValue;
						var b44 = $ss_Int64.minValue;
						expect($ss_Int64.op_LessThanOrEqual(a45, b44)).toBe(false);
					});
					it('should return Int64Min is less than Int32Min', function() {
						var a46 = $ss_Int64.minValue;
						var b45 = $ss_Int64.op_Implicit$2(-2147483648);
						expect($ss_Int64.op_LessThanOrEqual(a46, b45)).toBe(true);
					});
					it('should return Int64Min is equal to Int64Min ', function() {
						var a47 = $ss_Int64.minValue;
						var b46 = $ss_Int64.minValue;
						expect($ss_Int64.op_LessThanOrEqual(a47, b46)).toBe(true);
					});
					it('should return Int32Min is not less than Int64Min', function() {
						var a48 = $ss_Int64.op_Implicit$2(-2147483648);
						var b47 = $ss_Int64.minValue;
						expect($ss_Int64.op_LessThanOrEqual(a48, b47)).toBe(false);
					});
				});
				describe('Less Than', function() {
					it('should return Int32Max is less than Int64Max', function() {
						var a49 = $ss_Int64.op_Implicit$2(2147483647);
						var b48 = $ss_Int64.maxValue;
						expect($ss_Int64.op_LessThan(a49, b48)).toBe(true);
					});
					it('should return Int64Max is less than Int64Max', function() {
						var a50 = $ss_Int64.maxValue;
						var b49 = $ss_Int64.maxValue;
						expect($ss_Int64.op_LessThan(a50, b49)).toBe(false);
					});
					it('should return Int64Max is not less than Int32Max', function() {
						var a51 = $ss_Int64.maxValue;
						var b50 = $ss_Int64.op_Implicit$2(2147483647);
						expect($ss_Int64.op_LessThan(a51, b50)).toBe(false);
					});
					it('should return Int64Min is less than Int64Max', function() {
						var a52 = $ss_Int64.minValue;
						var b51 = $ss_Int64.maxValue;
						expect($ss_Int64.op_LessThan(a52, b51)).toBe(true);
					});
					it('should return Int64Max is not less than Int64Min ', function() {
						var a53 = $ss_Int64.maxValue;
						var b52 = $ss_Int64.minValue;
						expect($ss_Int64.op_LessThan(a53, b52)).toBe(false);
					});
					it('should return Int64Min is less than Int32Min', function() {
						var a54 = $ss_Int64.minValue;
						var b53 = $ss_Int64.op_Implicit$2(-2147483648);
						expect($ss_Int64.op_LessThan(a54, b53)).toBe(true);
					});
					it('should return Int64Min is less than Int64Min ', function() {
						var a55 = $ss_Int64.minValue;
						var b54 = $ss_Int64.minValue;
						expect($ss_Int64.op_LessThan(a55, b54)).toBe(false);
					});
					it('should return Int32Min is not less than Int64Min', function() {
						var a56 = $ss_Int64.op_Implicit$2(-2147483648);
						var b55 = $ss_Int64.minValue;
						expect($ss_Int64.op_LessThan(a56, b55)).toBe(false);
					});
				});
				describe('Addition', function() {
					describe('Zero + Zero', function() {
						it('should equal zero', function() {
							var a57 = $ss_Int64.op_Addition($ss_Int64.zero, $ss_Int64.zero);
							expect(a57.equalsT($ss_Int64.zero)).toBe(true);
						});
					});
					describe('One + Zero', function() {
						it('should equal one', function() {
							var a58 = $ss_Int64.op_Addition($ss_Int64.one, $ss_Int64.zero);
							expect(a58.equalsT($ss_Int64.one)).toBe(true);
						});
					});
					describe('One + One', function() {
						it('should equal two', function() {
							var a59 = $ss_Int64.op_Addition($ss_Int64.one, $ss_Int64.one);
							expect(a59.equalsT(new $ss_Int64(2, 0, 0))).toBe(true);
						});
					});
					describe('Int32Max + One', function() {
						it('should equal 2147483648', function() {
							var a60 = $ss_Int64.op_Addition(new $ss_Int64(16777215, 127, 0), $ss_Int64.one);
							expect(a60.equalsT(new $ss_Int64(0, 128, 0))).toBe(true);
						});
					});
					describe('Int32Max + Int32Max', function() {
						it('should equal 4294967294', function() {
							var a61 = new $ss_Int64(16777215, 127, 0);
							var b56 = new $ss_Int64(16777215, 127, 0);
							expect($ss_Int64.op_Equality($ss_Int64.op_Addition(a61, b56), new $ss_Int64(16777214, 255, 0))).toBe(true);
						});
					});
					describe('Int32Min + Int32Min', function() {
						it('should equal -4294967294', function() {
							var a62 = $ss_Int64.op_Implicit$2(-2147483648);
							expect($ss_Int64.op_Equality($ss_Int64.op_Addition(a62, a62), new $ss_Int64(0, 16776960, 65535))).toBe(true);
						});
					});
					describe('Int32Min + Int32Max', function() {
						it('should equal -1', function() {
							var a63 = $ss_Int64.op_Implicit$2(-2147483648);
							var b57 = $ss_Int64.op_Implicit$2(2147483647);
							expect($ss_Int64.op_Equality($ss_Int64.op_Addition(a63, b57), new $ss_Int64(16777215, 16777215, 65535))).toBe(true);
							expect($ss_Int64.op_Equality($ss_Int64.op_Addition(b57, a63), new $ss_Int64(16777215, 16777215, 65535))).toBe(true);
						});
					});
					describe('Int64Min + Int64Max', function() {
						it('should equal -1', function() {
							var a64 = $ss_Int64.minValue;
							var b58 = $ss_Int64.maxValue;
							expect($ss_Int64.op_Equality($ss_Int64.op_Addition(a64, b58), new $ss_Int64(16777215, 16777215, 65535))).toBe(true);
							expect($ss_Int64.op_Equality($ss_Int64.op_Addition(b58, a64), new $ss_Int64(16777215, 16777215, 65535))).toBe(true);
						});
					});
					describe('Int64Min + Int64Max + Int64Max ', function() {
						it('should equal -1', function() {
							var a65 = $ss_Int64.minValue;
							var b59 = $ss_Int64.maxValue;
							expect($ss_Int64.op_Equality($ss_Int64.op_Addition($ss_Int64.op_Addition(a65, b59), b59), new $ss_Int64(16777214, 16777215, 32767))).toBe(true);
							expect($ss_Int64.op_Equality($ss_Int64.op_Addition($ss_Int64.op_Addition(b59, a65), b59), new $ss_Int64(16777214, 16777215, 32767))).toBe(true);
							expect($ss_Int64.op_Equality($ss_Int64.op_Addition($ss_Int64.op_Addition(b59, b59), a65), new $ss_Int64(16777214, 16777215, 32767))).toBe(true);
						});
					});
				});
				describe('Subtraction', function() {
					describe('Zero - Zero', function() {
						it('should equal zero', function() {
							var a66 = $ss_Int64.op_Subtraction($ss_Int64.zero, $ss_Int64.zero);
							expect(a66.equalsT($ss_Int64.zero)).toBe(true);
						});
					});
					describe('One - Zero', function() {
						it('should equal one', function() {
							var a67 = $ss_Int64.op_Subtraction($ss_Int64.one, $ss_Int64.zero);
							expect(a67.equalsT($ss_Int64.one)).toBe(true);
						});
					});
					describe('One - One', function() {
						it('should equal Zero', function() {
							var a68 = $ss_Int64.op_Subtraction($ss_Int64.one, $ss_Int64.one);
							expect($ss_Int64.op_Equality(a68, $ss_Int64.zero)).toBe(true);
						});
					});
					describe('Int32Max - One', function() {
						it('should equal 2147483646', function() {
							var a69 = $ss_Int64.op_Subtraction(new $ss_Int64(16777215, 127, 0), $ss_Int64.one);
							expect(a69.equalsT(new $ss_Int64(16777214, 127, 0))).toBe(true);
						});
					});
					describe('Int32Max - Int32Max', function() {
						it('should equal 0', function() {
							var a70 = new $ss_Int64(16777215, 127, 0);
							var b60 = new $ss_Int64(16777215, 127, 0);
							expect($ss_Int64.op_Equality($ss_Int64.op_Subtraction(a70, b60), $ss_Int64.zero)).toBe(true);
						});
					});
					describe('Int32Min - Int32Min', function() {
						it('should equal 0', function() {
							var a71 = $ss_Int64.op_Implicit$2(-2147483648);
							expect($ss_Int64.op_Equality($ss_Int64.op_Subtraction(a71, a71), $ss_Int64.zero)).toBe(true);
						});
					});
					describe('Int32Min - Int32Max', function() {
						it('should equal -4294967295', function() {
							var a72 = $ss_Int64.op_Implicit$2(-2147483648);
							var b61 = $ss_Int64.op_Implicit$2(2147483647);
							expect($ss_Int64.op_Equality($ss_Int64.op_Subtraction(a72, b61), new $ss_Int64(1, 16776960, 65535))).toBe(true);
						});
					});
					describe('- Int64Max - Int64Min', function() {
						it('should equal 1', function() {
							var a73 = $ss_Int64.minValue;
							var b62 = $ss_Int64.maxValue;
							expect($ss_Int64.op_Equality($ss_Int64.op_Subtraction($ss_Int64.op_UnaryNegation(b62), a73), $ss_Int64.one)).toBe(true);
						});
					});
					describe('Int64Min + Int64Max - Int64Min ', function() {
						it('should equal -9223372036854775807', function() {
							var a74 = $ss_Int64.minValue;
							var b63 = $ss_Int64.maxValue;
							expect($ss_Int64.op_Equality($ss_Int64.op_Subtraction($ss_Int64.op_Subtraction(a74, b63), a74), new $ss_Int64(1, 0, 32768))).toBe(true);
						});
					});
				});
				describe('Multiplication', function() {
					describe('Zero * Zero', function() {
						it('should equal Zero', function() {
							var a75 = $ss_Int64.zero;
							expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a75, a75), $ss_Int64.zero)).toBe(true);
						});
					});
					describe('One * Zero', function() {
						it('should equal Zero', function() {
							var a76 = $ss_Int64.one;
							var b64 = $ss_Int64.zero;
							expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a76, b64), $ss_Int64.zero)).toBe(true);
						});
					});
					describe('One * One', function() {
						it('should equal One', function() {
							var a77 = $ss_Int64.one;
							expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a77, a77), $ss_Int64.one)).toBe(true);
						});
					});
					describe('-One * -One', function() {
						it('should equal One', function() {
							var a78 = $ss_Int64.op_UnaryNegation($ss_Int64.one);
							expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a78, a78), $ss_Int64.one)).toBe(true);
						});
					});
					describe('-One * One', function() {
						it('should equal -1', function() {
							var a79 = $ss_Int64.one;
							expect($ss_Int64.op_Equality($ss_Int64.op_Multiply($ss_Int64.op_UnaryNegation(a79), a79), $ss_Int64.op_UnaryNegation($ss_Int64.one))).toBe(true);
						});
					});
					describe('3 * 715827882', function() {
						it('should equal 2147483646', function() {
							var a80 = new $ss_Int64(3, 0, 0);
							var b65 = new $ss_Int64(11184810, 42, 0);
							expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a80, b65), new $ss_Int64(16777214, 127, 0))).toBe(true);
						});
					});
					describe('60247241209 * 153092023', function() {
						it('should equal 9223372036854775807', function() {
							var a81 = new $ss_Int64(258553, 3591, 0);
							var b66 = new $ss_Int64(2097079, 9, 0);
							expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a81, b66), $ss_Int64.maxValue)).toBe(true);
						});
					});
					describe('Int64Max * Int64Max', function() {
						it('should equal 1', function() {
							var a82 = $ss_Int64.maxValue;
							expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a82, a82), $ss_Int64.one)).toBe(true);
						});
					});
					describe('34359738368 * -268435456', function() {
						it('should equal -9223372036854775808', function() {
							var a83 = new $ss_Int64(0, 2048, 0);
							var b67 = new $ss_Int64(0, 16777200, 65535);
							expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a83, b67), $ss_Int64.minValue)).toBe(true);
						});
					});
					describe('Int64Min * Int64Min', function() {
						it('should equal 0', function() {
							var a84 = $ss_Int64.minValue;
							expect($ss_Int64.op_Equality($ss_Int64.op_Multiply(a84, a84), $ss_Int64.zero)).toBe(true);
						});
					});
				});
				describe('Division', function() {
					describe('Zero / Zero', function() {
						it('should throw Divide by zero Exception', function() {
							var a85 = $ss_Int64.zero;
							expect(function() {
								return $ss_Int64.op_Division(a85, a85);
							}).toThrow();
						});
					});
					describe('One / Zero', function() {
						it('should throw Divide by zero Exception', function() {
							var a86 = $ss_Int64.one;
							var b68 = $ss_Int64.zero;
							expect(function() {
								return $ss_Int64.op_Division(a86, b68);
							}).toThrow();
						});
					});
					describe('Zero / One', function() {
						it('should equal 0', function() {
							var a87 = $ss_Int64.one;
							var b69 = $ss_Int64.zero;
							expect($ss_Int64.op_Equality($ss_Int64.op_Division(b69, a87), $ss_Int64.zero)).toBe(true);
						});
					});
					describe('One / One', function() {
						it('should equal One', function() {
							var a88 = $ss_Int64.one;
							expect($ss_Int64.op_Equality($ss_Int64.op_Division(a88, a88), $ss_Int64.one)).toBe(true);
						});
					});
					describe('-One / -One', function() {
						it('should equal 1', function() {
							var a89 = $ss_Int64.op_UnaryNegation($ss_Int64.one);
							expect($ss_Int64.op_Equality($ss_Int64.op_Division(a89, a89), $ss_Int64.one)).toBe(true);
						});
					});
					describe('-One / One', function() {
						it('should equal -1', function() {
							var a90 = $ss_Int64.one;
							expect($ss_Int64.op_Equality($ss_Int64.op_Division($ss_Int64.op_UnaryNegation(a90), a90), $ss_Int64.op_UnaryNegation($ss_Int64.one))).toBe(true);
						});
					});
					describe('One / -One', function() {
						it('should equal -1', function() {
							var a91 = $ss_Int64.one;
							expect($ss_Int64.op_Equality($ss_Int64.op_Division(a91, $ss_Int64.op_UnaryNegation(a91)), $ss_Int64.op_UnaryNegation($ss_Int64.one))).toBe(true);
						});
					});
					describe('9223372036854775807 / 153092023', function() {
						it('should equal 60247241209 ', function() {
							var a92 = $ss_Int64.maxValue;
							var b70 = new $ss_Int64(2097079, 9, 0);
							expect($ss_Int64.op_Equality($ss_Int64.op_Division(a92, b70), new $ss_Int64(258553, 3591, 0))).toBe(true);
						});
					});
					describe('Int64Max / Int64Max', function() {
						it('should equal 1', function() {
							var a93 = $ss_Int64.maxValue;
							expect($ss_Int64.op_Equality($ss_Int64.op_Division(a93, a93), $ss_Int64.one)).toBe(true);
						});
					});
					describe('1 / Int64Man', function() {
						it('should equal 0', function() {
							var a94 = $ss_Int64.one;
							var b71 = $ss_Int64.maxValue;
							expect($ss_Int64.op_Equality($ss_Int64.op_Division(a94, b71), $ss_Int64.zero)).toBe(true);
						});
					});
					describe('1 / Int64Min', function() {
						it('should equal 0', function() {
							var a95 = $ss_Int64.one;
							var b72 = $ss_Int64.minValue;
							expect($ss_Int64.op_Equality($ss_Int64.op_Division(a95, b72), $ss_Int64.zero)).toBe(true);
						});
					});
					describe('Int64Min / 1', function() {
						it('should equal Int64Min', function() {
							var a96 = $ss_Int64.one;
							var b73 = $ss_Int64.minValue;
							expect($ss_Int64.op_Equality($ss_Int64.op_Division(b73, a96), $ss_Int64.minValue)).toBe(true);
						});
					});
					describe('Int64Min / Int64Min', function() {
						it('should equal 1', function() {
							var a97 = $ss_Int64.minValue;
							expect($ss_Int64.op_Equality($ss_Int64.op_Division(a97, a97), $ss_Int64.one)).toBe(true);
						});
					});
				});
				describe('Modulo', function() {
					describe('1 % 1', function() {
						it('should equal 0', function() {
							var a98 = $ss_Int64.one;
							expect($ss_Int64.op_Equality($ss_Int64.op_Modulus(a98, a98), $ss_Int64.zero)).toBe(true);
						});
					});
					describe('0 % 1', function() {
						it('should equal 0', function() {
							var a99 = $ss_Int64.zero;
							var b74 = $ss_Int64.one;
							expect($ss_Int64.op_Equality($ss_Int64.op_Modulus(a99, b74), $ss_Int64.zero)).toBe(true);
						});
					});
					describe('1 % 0', function() {
						it('should throw Divide by zero Exception', function() {
							var a100 = $ss_Int64.zero;
							var b75 = $ss_Int64.one;
							expect(function() {
								return $ss_Int64.op_Division(b75, a100);
							}).toThrow();
						});
					});
					describe('Int64Max % Int32Max', function() {
						it('should equal 1', function() {
							var a101 = $ss_Int64.maxValue;
							var b76 = $ss_Int64.op_Implicit$2(2147483647);
							expect($ss_Int64.op_Equality($ss_Int64.op_Modulus(a101, b76), $ss_Int64.one)).toBe(true);
						});
					});
					describe('Int64Min % Int32Max', function() {
						it('should equal -2', function() {
							var a102 = $ss_Int64.minValue;
							var b77 = $ss_Int64.op_Implicit$2(2147483647);
							expect($ss_Int64.op_Equality($ss_Int64.op_Modulus(a102, b77), new $ss_Int64(16777214, 16777215, 65535))).toBe(true);
						});
					});
					describe('Int64Min % Int32Min', function() {
						it('should equal 0', function() {
							var a103 = $ss_Int64.minValue;
							var b78 = $ss_Int64.op_Implicit$2(-2147483648);
							expect($ss_Int64.op_Equality($ss_Int64.op_Modulus(a103, b78), $ss_Int64.zero)).toBe(true);
						});
					});
					describe('Int32Min % Int64Min', function() {
						it('should equal -2147483648', function() {
							var a104 = $ss_Int64.op_Implicit$2(-2147483648);
							var b79 = $ss_Int64.minValue;
							expect($ss_Int64.op_Equality($ss_Int64.op_Modulus(a104, b79), new $ss_Int64(0, 16777088, 65535))).toBe(true);
						});
					});
				});
				describe('Increment', function() {
					describe('++', function() {
						it('should increment the Int64Min', function() {
							var a105 = $ss_Int64.minValue;
							a105 = $ss_Int64.op_Increment(a105);
							expect($ss_Int64.op_Equality(a105, new $ss_Int64(1, 0, 32768))).toBe(true);
						});
						it('should increment the Int32Min', function() {
							var a106 = $ss_Int64.op_Implicit$2(-2147483648);
							a106 = $ss_Int64.op_Increment(a106);
							expect($ss_Int64.op_Equality(a106, new $ss_Int64(1, 16777088, 65535))).toBe(true);
						});
						it('should increment -1 to 0 then to 1', function() {
							var a107 = $ss_Int64.op_Implicit$2(-1);
							a107 = $ss_Int64.op_Increment(a107);
							expect($ss_Int64.op_Equality(a107, $ss_Int64.zero)).toBe(true);
							a107 = $ss_Int64.op_Increment(a107);
							expect($ss_Int64.op_Equality(a107, $ss_Int64.one)).toBe(true);
						});
						it('should increment the Int32Max', function() {
							var a108 = $ss_Int64.op_Implicit$2(2147483647);
							a108 = $ss_Int64.op_Increment(a108);
							expect($ss_Int64.op_Equality(a108, new $ss_Int64(0, 128, 0))).toBe(true);
						});
					});
				});
				describe('Decrement', function() {
					describe('--', function() {
						it('should decrement the Int64Max', function() {
							var a109 = $ss_Int64.maxValue;
							a109 = $ss_Int64.op_Decrement(a109);
							expect($ss_Int64.op_Equality(a109, new $ss_Int64(16777214, 16777215, 32767))).toBe(true);
						});
						it('should decrement the Int32Max', function() {
							var a110 = $ss_Int64.op_Implicit$2(2147483647);
							a110 = $ss_Int64.op_Decrement(a110);
							expect($ss_Int64.op_Equality(a110, new $ss_Int64(16777214, 127, 0))).toBe(true);
						});
						it('should decrement -1 to 0 then to 1', function() {
							var a111 = $ss_Int64.one;
							a111 = $ss_Int64.op_Decrement(a111);
							expect($ss_Int64.op_Equality(a111, $ss_Int64.zero)).toBe(true);
							a111 = $ss_Int64.op_Decrement(a111);
							expect($ss_Int64.op_Equality(a111, $ss_Int64.op_UnaryNegation($ss_Int64.one))).toBe(true);
						});
						it('should decrement the Int32Min', function() {
							var a112 = $ss_Int64.op_Implicit$2(-2147483648);
							a112 = $ss_Int64.op_Decrement(a112);
							expect($ss_Int64.op_Equality(a112, new $ss_Int64(16777215, 16777087, 65535))).toBe(true);
						});
					});
				});
			});
			describe('Bitwise Operators', function() {
				describe('NOT', function() {
					it('Int64Min should go to Int64Max', function() {
						var a113 = $ss_Int64.minValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_OnesComplement(a113), $ss_Int64.maxValue)).toBe(true);
					});
					it('Int64Max should go to Int64Min', function() {
						var a114 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_OnesComplement(a114), $ss_Int64.minValue)).toBe(true);
					});
				});
				describe('AND', function() {
					it('Int64Max & Int64Max', function() {
						var a115 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_BitwiseAnd(a115, a115), $ss_Int64.maxValue)).toBe(true);
					});
					it('Int64Min & Int64Min', function() {
						var a116 = $ss_Int64.minValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_BitwiseAnd(a116, a116), $ss_Int64.minValue)).toBe(true);
					});
					it('Int64Min & Int64Max', function() {
						var a117 = $ss_Int64.minValue;
						var b80 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_BitwiseAnd(a117, b80), $ss_Int64.zero)).toBe(true);
					});
				});
				describe('OR', function() {
					it('Int64Max | Int64Max', function() {
						var a118 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_BitwiseOr(a118, a118), $ss_Int64.maxValue)).toBe(true);
					});
					it('Int64Min | Int64Min', function() {
						var a119 = $ss_Int64.minValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_BitwiseOr(a119, a119), $ss_Int64.minValue)).toBe(true);
					});
					it('Int64Min | Int64Max', function() {
						var a120 = $ss_Int64.minValue;
						var b81 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_BitwiseOr(a120, b81), $ss_Int64.op_UnaryNegation($ss_Int64.one))).toBe(true);
					});
				});
				describe('XOR', function() {
					it('Int64Max ^ Int64Max', function() {
						var a121 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_ExclusiveOr(a121, a121), $ss_Int64.zero)).toBe(true);
					});
					it('Int64Min ^ Int64Min', function() {
						var a122 = $ss_Int64.minValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_ExclusiveOr(a122, a122), $ss_Int64.zero)).toBe(true);
					});
					it('Int64Min ^ Int64Max', function() {
						var a123 = $ss_Int64.minValue;
						var b82 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_ExclusiveOr(a123, b82), $ss_Int64.op_UnaryNegation($ss_Int64.one))).toBe(true);
					});
				});
				describe('Right Bit Shift', function() {
					//n=0, n=32, n=33, a is negative
					it('Int64Min >> 0 ', function() {
						var a124 = $ss_Int64.minValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_RightShift(a124, 0), $ss_Int64.minValue)).toBe(true);
					});
					it('Int64Min >> 31 ', function() {
						var a125 = $ss_Int64.minValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_RightShift(a125, 31), new $ss_Int64(0, 16776960, 65535))).toBe(true);
					});
					it('Int64Min >> 32 ', function() {
						var a126 = $ss_Int64.minValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_RightShift(a126, 32), $ss_Int64.op_Implicit$2(-2147483648))).toBe(true);
					});
					it('Int64Max >> 33 ', function() {
						var a127 = $ss_Int64.minValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_RightShift(a127, 33), new $ss_Int64(0, 16777152, 65535))).toBe(true);
					});
					it('Int64Max >> 48 ', function() {
						var a128 = $ss_Int64.minValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_RightShift(a128, 48), new $ss_Int64(16744448, 16777215, 65535))).toBe(true);
					});
					it('Int32Max >> 0 ', function() {
						var a129 = $ss_Int64.op_Implicit$2(2147483647);
						expect($ss_Int64.op_Equality($ss_Int64.op_RightShift(a129, 0), $ss_Int64.op_Implicit$2(2147483647))).toBe(true);
					});
					it('Int32Max >> 24', function() {
						var a130 = $ss_Int64.op_Implicit$2(2147483647);
						expect($ss_Int64.op_Equality($ss_Int64.op_RightShift(a130, 24), new $ss_Int64(127, 0, 0))).toBe(true);
					});
					it('Int32Max >> 32 ', function() {
						var a131 = $ss_Int64.op_Implicit$2(2147483647);
						expect($ss_Int64.op_Equality($ss_Int64.op_RightShift(a131, 32), $ss_Int64.op_UnaryNegation($ss_Int64.zero))).toBe(true);
					});
					it('Int64Min >> 33 ', function() {
						var a132 = $ss_Int64.op_Implicit$2(2147483647);
						expect($ss_Int64.op_Equality($ss_Int64.op_RightShift(a132, 33), $ss_Int64.op_UnaryNegation($ss_Int64.zero))).toBe(true);
					});
				});
				describe('Left Bit Shift', function() {
					//n=0, n=7, n=8, a is negative
					it('Int64Max << 0 ', function() {
						var a133 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_LeftShift(a133, 0), $ss_Int64.maxValue)).toBe(true);
					});
					it('Int64Max << 7 ', function() {
						var a134 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_LeftShift(a134, 7), new $ss_Int64(16777088, 16777215, 65535))).toBe(true);
					});
					it('Int64Max << 8 ', function() {
						var a135 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_LeftShift(a135, 8), new $ss_Int64(16776960, 16777215, 65535))).toBe(true);
					});
					it('Int64Max << 9 ', function() {
						var a136 = $ss_Int64.maxValue;
						expect($ss_Int64.op_Equality($ss_Int64.op_LeftShift(a136, 9), new $ss_Int64(16776704, 16777215, 65535))).toBe(true);
					});
					it('Int32Min << 0 ', function() {
						var a137 = $ss_Int64.op_Implicit$2(-2147483648);
						expect($ss_Int64.op_Equality($ss_Int64.op_LeftShift(a137, 0), $ss_Int64.op_Implicit$2(-2147483648))).toBe(true);
					});
					it('Int32Min << 7', function() {
						var a138 = $ss_Int64.op_Implicit$2(-2147483648);
						expect($ss_Int64.op_Equality($ss_Int64.op_LeftShift(a138, 7), new $ss_Int64(0, 16760832, 65535))).toBe(true);
					});
					it('Int32Min << 8 ', function() {
						var a139 = $ss_Int64.op_Implicit$2(-2147483648);
						expect($ss_Int64.op_Equality($ss_Int64.op_LeftShift(a139, 8), new $ss_Int64(0, 16744448, 65535))).toBe(true);
					});
					it('Int32Min << 9 ', function() {
						var a140 = $ss_Int64.op_Implicit$2(-2147483648);
						expect($ss_Int64.op_Equality($ss_Int64.op_LeftShift(a140, 9), new $ss_Int64(0, 16711680, 65535))).toBe(true);
					});
				});
			});
			describe('Casts', function() {
				describe('Byte', function() {
					it('should equal the min value', function() {
						var a141 = 0;
						var b83 = $ss_Int64.op_Implicit(a141);
						expect($ss_Int64.op_Equality(b83, new $ss_Int64(0, 0, 0))).toBe(true);
					});
					it('should equal the value', function() {
						var a142 = 128;
						var b84 = $ss_Int64.op_Implicit(a142);
						expect($ss_Int64.op_Equality(b84, new $ss_Int64(a142, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a143 = 255;
						var b85 = $ss_Int64.op_Implicit(a143);
						expect($ss_Int64.op_Equality(b85, new $ss_Int64(255, 0, 0))).toBe(true);
					});
				});
				describe('SByte', function() {
					it('should equal the min value', function() {
						var a144 = -128;
						var b86 = $ss_Int64.op_Implicit$3(a144);
						expect($ss_Int64.op_Equality(b86, new $ss_Int64(16777088, 16777215, 65535))).toBe(true);
					});
					it('should equal the value', function() {
						var a145 = 0;
						var b87 = $ss_Int64.op_Implicit$3(a145);
						expect($ss_Int64.op_Equality(b87, new $ss_Int64(a145, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a146 = 127;
						var b88 = $ss_Int64.op_Implicit$3(a146);
						expect($ss_Int64.op_Equality(b88, new $ss_Int64(a146, 0, 0))).toBe(true);
					});
				});
				describe('UInt16', function() {
					it('should equal the min value', function() {
						var a147 = 0;
						var b89 = $ss_Int64.op_Implicit$4(a147);
						expect($ss_Int64.op_Equality(b89, new $ss_Int64(a147, 0, 0))).toBe(true);
					});
					it('should equal the value', function() {
						var a148 = 0;
						var b90 = $ss_Int64.op_Implicit$4(a148);
						expect($ss_Int64.op_Equality(b90, new $ss_Int64(a148, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a149 = 65535;
						var b91 = $ss_Int64.op_Implicit$4(a149);
						expect($ss_Int64.op_Equality(b91, new $ss_Int64(a149, 0, 0))).toBe(true);
					});
				});
				describe('Int16', function() {
					it('should equal the min value', function() {
						var a150 = -32768;
						var b92 = $ss_Int64.op_Implicit$1(a150);
						expect($ss_Int64.op_Equality(b92, new $ss_Int64(16744448, 16777215, 65535))).toBe(true);
					});
					it('should equal the value', function() {
						var a151 = 0;
						var b93 = $ss_Int64.op_Implicit$1(a151);
						expect($ss_Int64.op_Equality(b93, new $ss_Int64(a151, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a152 = 32767;
						var b94 = $ss_Int64.op_Implicit$1(a152);
						expect($ss_Int64.op_Equality(b94, new $ss_Int64(a152, 0, 0))).toBe(true);
					});
				});
				describe('UInt32', function() {
					it('should equal the min value', function() {
						var a153 = 0;
						var b95 = $ss_Int64.op_Implicit$5(a153);
						expect($ss_Int64.op_Equality(b95, new $ss_Int64(0, 0, 0))).toBe(true);
					});
					it('should equal the value', function() {
						var a154 = 2147483647;
						var b96 = $ss_Int64.op_Implicit$5(a154);
						expect($ss_Int64.op_Equality(b96, new $ss_Int64(16777215, 127, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a155 = 4294967295;
						var b97 = $ss_Int64.op_Implicit$5(a155);
						expect($ss_Int64.op_Equality(b97, new $ss_Int64(16777215, 255, 0))).toBe(true);
					});
				});
				describe('Int32', function() {
					it('should equal the min value', function() {
						var a156 = -2147483648;
						var b98 = $ss_Int64.op_Implicit$2(a156);
						expect($ss_Int64.op_Equality(b98, new $ss_Int64(0, 16777088, 65535))).toBe(true);
					});
					it('should equal the value', function() {
						var a157 = 0;
						var b99 = $ss_Int64.op_Implicit$2(a157);
						expect($ss_Int64.op_Equality(b99, new $ss_Int64(0, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a158 = 2147483647;
						var b100 = $ss_Int64.op_Implicit$2(a158);
						expect($ss_Int64.op_Equality(b100, new $ss_Int64(16777215, 127, 0))).toBe(true);
					});
				});
				describe('Double', function() {
					it('should equal the min value', function() {
						var a159 = -2147483648;
						var b101 = $ss_Int64.op_Explicit$1(a159);
						expect($ss_Int64.op_Equality(b101, new $ss_Int64(0, 16777088, 65535))).toBe(true);
					});
					it('should equal the value', function() {
						var a160 = 0;
						var b102 = $ss_Int64.op_Explicit$1(a160);
						expect($ss_Int64.op_Equality(b102, new $ss_Int64(0, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a161 = 2147483647;
						var b103 = $ss_Int64.op_Explicit$1(a161);
						expect($ss_Int64.op_Equality(b103, new $ss_Int64(16777215, 127, 0))).toBe(true);
					});
				});
				describe('Single', function() {
					it('should equal the min value', function() {
						var a162 = -2147483648;
						var b104 = $ss_Int64.op_Explicit$2(a162);
						expect($ss_Int64.op_Equality(b104, new $ss_Int64(0, 16777088, 65535))).toBe(true);
					});
					it('should equal the value', function() {
						var a163 = 0;
						var b105 = $ss_Int64.op_Explicit$2(a163);
						expect($ss_Int64.op_Equality(b105, new $ss_Int64(0, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a164 = 2147483647;
						var b106 = $ss_Int64.op_Explicit$2(a164);
						expect($ss_Int64.op_Equality(b106, new $ss_Int64(16777215, 127, 0))).toBe(true);
					});
				});
				describe('Decimal', function() {
					it('should equal the min value', function() {
						var a165 = -2147483648;
						//Decimal.MinValue;
						var b107 = $ss_Int64.op_Explicit(a165);
						expect($ss_Int64.op_Equality(b107, new $ss_Int64(0, 16777088, 65535))).toBe(true);
					});
					it('should equal the value', function() {
						var a166 = 0;
						var b108 = $ss_Int64.op_Explicit(a166);
						expect($ss_Int64.op_Equality(b108, new $ss_Int64(0, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a167 = 2147483647;
						//Decimal.MaxValue;
						var b109 = $ss_Int64.op_Explicit(a167);
						expect($ss_Int64.op_Equality(b109, new $ss_Int64(16777215, 127, 0))).toBe(true);
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
		b = b & 63;
		if (b === 0) {
			return a;
		}
		var cLow, cMid, cHigh;
		if (b <= 24) {
			cLow = a.$low << b;
			cMid = a.$low >> 24 - b | a.$mid << b;
			cHigh = a.$mid >> 24 - b | a.$high << b;
		}
		else if (b <= 48) {
			cLow = 0;
			cMid = a.$low << b - 24;
			cHigh = a.$low >> 48 - b | a.$mid << b - 24;
		}
		else {
			cLow = 0;
			cMid = 0;
			cHigh = a.$low << b - 48;
		}
		return new $ss_UInt64(cLow, cMid, cHigh);
	};
	$ss_UInt64.op_RightShift = function(a, b) {
		b = b & 63;
		if (b === 0) {
			return a;
		}
		var cLow, cMid, cHigh;
		if (b <= 24) {
			cLow = a.$mid << 24 - b | a.$low >> b;
			cMid = a.$high << 24 - b | a.$mid >> b;
			cHigh = a.$high >> b;
		}
		else if (b <= 48) {
			cLow = a.$high << 48 - b | a.$mid >> b - 24;
			cMid = a.$high >> b - 24;
			cHigh = 0;
		}
		else {
			cLow = a.$high >> b - 48;
			cMid = 0;
			cHigh = 0;
		}
		return new $ss_UInt64(cLow, cMid, cHigh);
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
	////////////////////////////////////////////////////////////////////////////////
	// ss.UUInt64Spec
	var $ss_UUInt64Spec = function() {
		WebApplications.Saltarelle.JasmineTestUtils.TestSuite.call(this);
	};
	$ss_UUInt64Spec.__typeName = 'ss.UUInt64Spec';
	$ss_UUInt64Spec.tests = function() {
		//describe("", () => { });
		//it("", () => { });
		describe('UInt64', function() {
			it('should be defined', function() {
				var a = $ss_UInt64.zero;
				expect(a).toBeDefined();
			});
			describe('Operators', function() {
				describe('Equality', function() {
					it('Zero should equal 0', function() {
						var a1 = $ss_UInt64.zero;
						var b = new $ss_UInt64(0, 0, 0);
						expect($ss_UInt64.op_Equality(a1, b)).toBe(true);
						expect(a1.$low).toEqual(b.$low);
						expect(a1.$mid).toEqual(b.$mid);
						expect(a1.$high).toEqual(b.$high);
					});
					it('One should equal 1', function() {
						var a2 = $ss_UInt64.one;
						var b1 = new $ss_UInt64(1, 0, 0);
						expect($ss_UInt64.op_Equality(a2, b1)).toBe(true);
						expect(a2.$low).toEqual(b1.$low);
						expect(a2.$mid).toEqual(b1.$mid);
						expect(a2.$high).toEqual(b1.$high);
					});
					it('Zero should not equal 1', function() {
						var a3 = $ss_UInt64.zero;
						var b2 = new $ss_UInt64(1, 0, 0);
						expect($ss_UInt64.op_Equality(a3, b2)).toBe(false);
						expect(a3.$low).not.toEqual(b2.$low);
						expect(a3.$mid).toEqual(b2.$mid);
						expect(a3.$high).toEqual(b2.$high);
					});
					it('One should not equal 0', function() {
						var a4 = $ss_UInt64.one;
						var b3 = new $ss_UInt64(0, 0, 0);
						expect($ss_UInt64.op_Equality(a4, b3)).toBe(false);
						expect(a4.$low).not.toEqual(b3.$low);
						expect(a4.$mid).toEqual(b3.$mid);
						expect(a4.$high).toEqual(b3.$high);
					});
					it('MaxValue should equal 18446744073709551615', function() {
						var a5 = $ss_UInt64.maxValue;
						var b4 = new $ss_UInt64(16777215, 16777215, 65535);
						expect($ss_UInt64.op_Equality(a5, b4)).toBe(true);
						expect(a5.$low).toEqual(b4.$low);
						expect(a5.$mid).toEqual(b4.$mid);
						expect(a5.$high).toEqual(b4.$high);
					});
					it('MinValue should not equal 4611686018427387904', function() {
						var a6 = $ss_UInt64.minValue;
						var b5 = new $ss_UInt64(0, 0, 16384);
						expect($ss_UInt64.op_Equality(a6, b5)).toBe(false);
						expect(a6.$low).toEqual(b5.$low);
						expect(a6.$mid).toEqual(b5.$mid);
						expect(a6.$high).not.toEqual(b5.$high);
					});
					it('Low-Mid boundary should equal itself', function() {
						var a7 = new $ss_UInt64(16777215, 1, 0);
						var b6 = new $ss_UInt64(16777215, 1, 0);
						expect($ss_UInt64.op_Equality(a7, b6)).toBe(true);
						expect(a7.$low).toEqual(b6.$low);
						expect(a7.$mid).toEqual(b6.$mid);
						expect(a7.$high).toEqual(b6.$high);
					});
					it('Low-Mid boundary should not equal max Low', function() {
						var a8 = new $ss_UInt64(16777215, 1, 0);
						var b7 = new $ss_UInt64(16777215, 0, 0);
						expect($ss_UInt64.op_Equality(a8, b7)).toBe(false);
						expect(a8.$low).toEqual(b7.$low);
						expect(a8.$mid).not.toEqual(b7.$mid);
						expect(a8.$high).toEqual(b7.$high);
					});
					it('Mid-High boundary should equal itself', function() {
						var a9 = new $ss_UInt64(16777215, 16777215, 1);
						var b8 = new $ss_UInt64(16777215, 16777215, 1);
						expect($ss_UInt64.op_Equality(a9, b8)).toBe(true);
						expect(a9.$low).toEqual(b8.$low);
						expect(a9.$mid).toEqual(b8.$mid);
						expect(a9.$high).toEqual(b8.$high);
					});
					it('Mid-High boundary should not equal max Mid', function() {
						var a10 = new $ss_UInt64(16777215, 16777215, 1);
						var b9 = new $ss_UInt64(16777215, 16777215, 0);
						expect($ss_UInt64.op_Equality(a10, b9)).toBe(false);
						expect(a10.$low).toEqual(b9.$low);
						expect(a10.$mid).toEqual(b9.$mid);
						expect(a10.$high).not.toEqual(b9.$high);
					});
				});
				describe('Inequality', function() {
					it('Zero should equal 0', function() {
						var a11 = $ss_UInt64.zero;
						var b10 = new $ss_UInt64(0, 0, 0);
						expect($ss_UInt64.op_Inequality(a11, b10)).toBe(false);
						expect(a11.$low).toEqual(b10.$low);
						expect(a11.$mid).toEqual(b10.$mid);
						expect(a11.$high).toEqual(b10.$high);
					});
					it('One should equal 1', function() {
						var a12 = $ss_UInt64.one;
						var b11 = new $ss_UInt64(1, 0, 0);
						expect($ss_UInt64.op_Inequality(a12, b11)).toBe(false);
						expect(a12.$low).toEqual(b11.$low);
						expect(a12.$mid).toEqual(b11.$mid);
						expect(a12.$high).toEqual(b11.$high);
					});
					it('Zero should not equal 1', function() {
						var a13 = $ss_UInt64.zero;
						var b12 = new $ss_UInt64(1, 0, 0);
						expect($ss_UInt64.op_Inequality(a13, b12)).toBe(true);
						expect(a13.$low).not.toEqual(b12.$low);
						expect(a13.$mid).toEqual(b12.$mid);
						expect(a13.$high).toEqual(b12.$high);
					});
					it('One should not equal 0', function() {
						var a14 = $ss_UInt64.one;
						var b13 = new $ss_UInt64(0, 0, 0);
						expect($ss_UInt64.op_Inequality(a14, b13)).toBe(true);
						expect(a14.$low).not.toEqual(b13.$low);
						expect(a14.$mid).toEqual(b13.$mid);
						expect(a14.$high).toEqual(b13.$high);
					});
					it('MaxValue should equal 18446744073709551615', function() {
						var a15 = $ss_UInt64.maxValue;
						var b14 = new $ss_UInt64(16777215, 16777215, 65535);
						expect($ss_UInt64.op_Inequality(a15, b14)).toBe(false);
						expect(a15.$low).toEqual(b14.$low);
						expect(a15.$mid).toEqual(b14.$mid);
						expect(a15.$high).toEqual(b14.$high);
					});
					it('MinValue should not equal 4611686018427387904', function() {
						var a16 = $ss_UInt64.minValue;
						var b15 = new $ss_UInt64(0, 0, 16384);
						expect($ss_UInt64.op_Inequality(a16, b15)).toBe(true);
						expect(a16.$low).toEqual(b15.$low);
						expect(a16.$mid).toEqual(b15.$mid);
						expect(a16.$high).not.toEqual(b15.$high);
					});
					it('Low-Mid boundary should equal itself', function() {
						var a17 = new $ss_UInt64(16777215, 1, 0);
						var b16 = new $ss_UInt64(16777215, 1, 0);
						expect($ss_UInt64.op_Inequality(a17, b16)).toBe(false);
						expect(a17.$low).toEqual(b16.$low);
						expect(a17.$mid).toEqual(b16.$mid);
						expect(a17.$high).toEqual(b16.$high);
					});
					it('Low-Mid boundary should not equal max Low', function() {
						var a18 = new $ss_UInt64(16777215, 1, 0);
						var b17 = new $ss_UInt64(16777215, 0, 0);
						expect($ss_UInt64.op_Inequality(a18, b17)).toBe(true);
						expect(a18.$low).toEqual(b17.$low);
						expect(a18.$mid).not.toEqual(b17.$mid);
						expect(a18.$high).toEqual(b17.$high);
					});
					it('Mid-High boundary should equal itself', function() {
						var a19 = new $ss_UInt64(16777215, 16777215, 1);
						var b18 = new $ss_UInt64(16777215, 16777215, 1);
						expect($ss_UInt64.op_Inequality(a19, b18)).toBe(false);
						expect(a19.$low).toEqual(b18.$low);
						expect(a19.$mid).toEqual(b18.$mid);
						expect(a19.$high).toEqual(b18.$high);
					});
					it('Mid-High boundary should not equal max Mid', function() {
						var a20 = new $ss_UInt64(16777215, 16777215, 1);
						var b19 = new $ss_UInt64(16777215, 16777215, 0);
						expect($ss_UInt64.op_Inequality(a20, b19)).toBe(true);
						expect(a20.$low).toEqual(b19.$low);
						expect(a20.$mid).toEqual(b19.$mid);
						expect(a20.$high).not.toEqual(b19.$high);
					});
				});
				describe('Greater Than or Equal To', function() {
					it('should return UInt64Max is greater than UInt32Max', function() {
						var a21 = $ss_UInt64.maxValue;
						var b20 = $ss_UInt64.op_Implicit$2(4294967295);
						expect($ss_UInt64.op_GreaterThanOrEqual(a21, b20)).toBe(true);
					});
					it('should return UInt64Max is equal to UInt64Max', function() {
						var a22 = $ss_UInt64.maxValue;
						var b21 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_GreaterThanOrEqual(a22, b21)).toBe(true);
					});
					it('should return UInt32Max is not greater than UInt64Max', function() {
						var a23 = $ss_UInt64.op_Implicit$2(4294967295);
						var b22 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_GreaterThanOrEqual(a23, b22)).toBe(false);
					});
					it('should return UInt64Max is greater than UInt64Min', function() {
						var a24 = $ss_UInt64.maxValue;
						var b23 = $ss_UInt64.minValue;
						expect($ss_UInt64.op_GreaterThanOrEqual(a24, b23)).toBe(true);
					});
					it('should return UInt64Min is not greater than UInt64Max ', function() {
						var a25 = $ss_UInt64.minValue;
						var b24 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_GreaterThanOrEqual(a25, b24)).toBe(false);
					});
					it('should return UInt32Min is greater than UInt64Min ', function() {
						var a26 = $ss_UInt64.op_Implicit$2(0);
						var b25 = $ss_UInt64.minValue;
						expect($ss_UInt64.op_GreaterThanOrEqual(a26, b25)).toBe(true);
					});
					it('should return UInt64Min is equal to UInt64Min ', function() {
						var a27 = $ss_UInt64.minValue;
						var b26 = $ss_UInt64.minValue;
						expect($ss_UInt64.op_GreaterThanOrEqual(a27, b26)).toBe(true);
					});
					it('should return UInt64Min is equal to UInt32Min ', function() {
						var a28 = $ss_UInt64.minValue;
						var b27 = $ss_UInt64.op_Implicit$2(0);
						expect($ss_UInt64.op_GreaterThanOrEqual(a28, b27)).toBe(true);
					});
				});
				describe('Greater Than', function() {
					it('should return UInt64Max is greater than UInt32Max', function() {
						var a29 = $ss_UInt64.maxValue;
						var b28 = $ss_UInt64.op_Implicit$2(4294967295);
						expect($ss_UInt64.op_GreaterThan(a29, b28)).toBe(true);
					});
					it('should return UInt64Max is not greater than UInt64Max', function() {
						var a30 = $ss_UInt64.maxValue;
						var b29 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_GreaterThan(a30, b29)).toBe(false);
					});
					it('should return UInt32Max is not greater than UInt64Max', function() {
						var a31 = $ss_UInt64.op_Implicit$2(4294967295);
						var b30 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_GreaterThan(a31, b30)).toBe(false);
					});
					it('should return UInt64Max is greater than UInt64Min', function() {
						var a32 = $ss_UInt64.maxValue;
						var b31 = $ss_UInt64.minValue;
						expect($ss_UInt64.op_GreaterThan(a32, b31)).toBe(true);
					});
					it('should return UInt64Min is not greater than UInt64Max ', function() {
						var a33 = $ss_UInt64.minValue;
						var b32 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_GreaterThan(a33, b32)).toBe(false);
					});
					it('should return UInt32Min is not greater than UInt64Min ', function() {
						var a34 = $ss_UInt64.op_Implicit$2(0);
						var b33 = $ss_UInt64.minValue;
						expect($ss_UInt64.op_GreaterThan(a34, b33)).toBe(false);
					});
					it('should return UInt64Min is not greater than UInt64Min ', function() {
						var a35 = $ss_UInt64.minValue;
						var b34 = $ss_UInt64.minValue;
						expect($ss_UInt64.op_GreaterThan(a35, b34)).toBe(false);
					});
					it('should return UInt64Min is not greater than UInt32Min ', function() {
						var a36 = $ss_UInt64.minValue;
						var b35 = $ss_UInt64.op_Implicit$2(0);
						expect($ss_UInt64.op_GreaterThan(a36, b35)).toBe(false);
					});
				});
				describe('Less Than or Equal To', function() {
					it('should return UInt32Max is less than UInt64Max', function() {
						var a37 = $ss_UInt64.op_Implicit$2(4294967295);
						var b36 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_LessThanOrEqual(a37, b36)).toBe(true);
					});
					it('should return UInt64Max is equal to UInt64Max', function() {
						var a38 = $ss_UInt64.maxValue;
						var b37 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_LessThanOrEqual(a38, b37)).toBe(true);
					});
					it('should return UInt64Max is not less than UInt32Max', function() {
						var a39 = $ss_UInt64.maxValue;
						var b38 = $ss_UInt64.op_Implicit$2(4294967295);
						expect($ss_UInt64.op_LessThanOrEqual(a39, b38)).toBe(false);
					});
					it('should return UInt64Min is less than UInt64Max', function() {
						debugger;
						var a40 = $ss_UInt64.minValue;
						var b39 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_LessThanOrEqual(a40, b39)).toBe(true);
					});
					it('should return UInt64Min is less than UInt32Min', function() {
						var a41 = $ss_UInt64.minValue;
						var b40 = $ss_UInt64.op_Implicit$2(0);
						expect($ss_UInt64.op_LessThanOrEqual(a41, b40)).toBe(true);
					});
					it('should return UInt64Min is equal to UInt64Min ', function() {
						var a42 = $ss_UInt64.minValue;
						var b41 = $ss_UInt64.minValue;
						expect($ss_UInt64.op_LessThanOrEqual(a42, b41)).toBe(true);
					});
					it('should return UInt32Min is equal to UInt64Min', function() {
						var a43 = $ss_UInt64.op_Implicit$2(0);
						var b42 = $ss_UInt64.minValue;
						expect($ss_UInt64.op_LessThanOrEqual(a43, b42)).toBe(true);
					});
				});
				describe('Less Than', function() {
					it('should return UInt32Max is less than UInt64Max', function() {
						var a44 = $ss_UInt64.op_Implicit$2(4294967295);
						var b43 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_LessThan(a44, b43)).toBe(true);
					});
					it('should return UInt64Max is less than UInt64Max', function() {
						var a45 = $ss_UInt64.maxValue;
						var b44 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_LessThan(a45, b44)).toBe(false);
					});
					it('should return UInt64Max is not less than UInt32Max', function() {
						var a46 = $ss_UInt64.maxValue;
						var b45 = $ss_UInt64.op_Implicit$2(4294967295);
						expect($ss_UInt64.op_LessThan(a46, b45)).toBe(false);
					});
					it('should return UInt64Min is less than UInt64Max', function() {
						var a47 = $ss_UInt64.minValue;
						var b46 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_LessThan(a47, b46)).toBe(true);
					});
					it('should return UInt64Max is not less than UInt64Min ', function() {
						var a48 = $ss_UInt64.maxValue;
						var b47 = $ss_UInt64.minValue;
						expect($ss_UInt64.op_LessThan(a48, b47)).toBe(false);
					});
					it('should return UInt64Min is not less than UInt32Min', function() {
						var a49 = $ss_UInt64.minValue;
						var b48 = $ss_UInt64.op_Implicit$2(0);
						expect($ss_UInt64.op_LessThan(a49, b48)).toBe(false);
					});
					it('should return UInt64Min is less than UInt64Min ', function() {
						var a50 = $ss_UInt64.minValue;
						var b49 = $ss_UInt64.minValue;
						expect($ss_UInt64.op_LessThan(a50, b49)).toBe(false);
					});
					it('should return UInt32Min is not less than UInt64Min', function() {
						var a51 = $ss_UInt64.op_Implicit$2(0);
						var b50 = $ss_UInt64.minValue;
						expect($ss_UInt64.op_LessThan(a51, b50)).toBe(false);
					});
				});
				describe('Addition', function() {
					describe('Zero + Zero', function() {
						it('should equal zero', function() {
							var a52 = $ss_UInt64.op_Addition($ss_UInt64.zero, $ss_UInt64.zero);
							expect(a52.equalsT($ss_UInt64.zero)).toBe(true);
						});
					});
					describe('One + Zero', function() {
						it('should equal one', function() {
							var a53 = $ss_UInt64.op_Addition($ss_UInt64.one, $ss_UInt64.zero);
							expect(a53.equalsT($ss_UInt64.one)).toBe(true);
						});
					});
					describe('One + One', function() {
						it('should equal two', function() {
							var a54 = $ss_UInt64.op_Addition($ss_UInt64.one, $ss_UInt64.one);
							expect(a54.equalsT(new $ss_UInt64(2, 0, 0))).toBe(true);
						});
					});
					describe('UInt32Max + One', function() {
						it('should equal 2147483648', function() {
							var a55 = $ss_UInt64.op_Addition(new $ss_UInt64(16777215, 127, 0), $ss_UInt64.one);
							expect(a55.equalsT(new $ss_UInt64(0, 128, 0))).toBe(true);
						});
					});
					describe('UInt32Max + UInt32Max', function() {
						it('should equal 4294967294', function() {
							var a56 = new $ss_UInt64(16777215, 127, 0);
							var b51 = new $ss_UInt64(16777215, 127, 0);
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Addition(a56, b51), new $ss_UInt64(16777214, 255, 0))).toBe(true);
						});
					});
				});
				describe('Subtraction', function() {
					describe('Zero - Zero', function() {
						it('should equal zero', function() {
							var a57 = $ss_UInt64.op_Subtraction($ss_UInt64.zero, $ss_UInt64.zero);
							expect(a57.equalsT($ss_UInt64.zero)).toBe(true);
						});
					});
					describe('One - Zero', function() {
						it('should equal one', function() {
							var a58 = $ss_UInt64.op_Subtraction($ss_UInt64.one, $ss_UInt64.zero);
							expect(a58.equalsT($ss_UInt64.one)).toBe(true);
						});
					});
					describe('One - One', function() {
						it('should equal Zero', function() {
							var a59 = $ss_UInt64.op_Subtraction($ss_UInt64.one, $ss_UInt64.one);
							expect($ss_UInt64.op_Equality(a59, $ss_UInt64.zero)).toBe(true);
						});
					});
					describe('UInt32Max - One', function() {
						it('should equal 2147483646', function() {
							var a60 = $ss_UInt64.op_Subtraction(new $ss_UInt64(16777215, 127, 0), $ss_UInt64.one);
							expect(a60.equalsT(new $ss_UInt64(16777214, 127, 0))).toBe(true);
						});
					});
					describe('UInt32Max - UInt32Max', function() {
						it('should equal 0', function() {
							var a61 = new $ss_UInt64(16777215, 127, 0);
							var b52 = new $ss_UInt64(16777215, 127, 0);
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Subtraction(a61, b52), $ss_UInt64.zero)).toBe(true);
						});
					});
					describe('UInt32Min - UInt32Min', function() {
						it('should equal 0', function() {
							var a62 = $ss_UInt64.op_Implicit$2(0);
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Subtraction(a62, a62), $ss_UInt64.zero)).toBe(true);
						});
					});
				});
				describe('Multiplication', function() {
					describe('Zero * Zero', function() {
						it('should equal Zero', function() {
							var a63 = $ss_UInt64.zero;
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Multiply(a63, a63), $ss_UInt64.zero)).toBe(true);
						});
					});
					describe('One * Zero', function() {
						it('should equal Zero', function() {
							var a64 = $ss_UInt64.one;
							var b53 = $ss_UInt64.zero;
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Multiply(a64, b53), $ss_UInt64.zero)).toBe(true);
						});
					});
					describe('One * One', function() {
						it('should equal One', function() {
							var a65 = $ss_UInt64.one;
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Multiply(a65, a65), $ss_UInt64.one)).toBe(true);
						});
					});
					describe('3 * 715827882', function() {
						it('should equal 2147483646', function() {
							var a66 = new $ss_UInt64(3, 0, 0);
							var b54 = new $ss_UInt64(11184810, 42, 0);
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Multiply(a66, b54), new $ss_UInt64(16777214, 127, 0))).toBe(true);
						});
					});
					describe('UInt64Max * UInt64Max', function() {
						it('should equal 1', function() {
							var a67 = $ss_UInt64.maxValue;
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Multiply(a67, a67), $ss_UInt64.one)).toBe(true);
						});
					});
					describe('UInt64Min * UInt64Min', function() {
						it('should equal 0', function() {
							var a68 = $ss_UInt64.minValue;
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Multiply(a68, a68), $ss_UInt64.zero)).toBe(true);
						});
					});
				});
				describe('Division', function() {
					describe('Zero / Zero', function() {
						it('should throw Divide by zero Exception', function() {
							var a69 = $ss_UInt64.zero;
							expect(function() {
								return $ss_UInt64.op_Division(a69, a69);
							}).toThrow();
						});
					});
					describe('One / Zero', function() {
						it('should throw Divide by zero Exception', function() {
							var a70 = $ss_UInt64.one;
							var b55 = $ss_UInt64.zero;
							expect(function() {
								return $ss_UInt64.op_Division(a70, b55);
							}).toThrow();
						});
					});
					describe('Zero / One', function() {
						it('should equal 0', function() {
							var a71 = $ss_UInt64.one;
							var b56 = $ss_UInt64.zero;
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Division(b56, a71), $ss_UInt64.zero)).toBe(true);
						});
					});
					describe('One / One', function() {
						it('should equal One', function() {
							var a72 = $ss_UInt64.one;
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Division(a72, a72), $ss_UInt64.one)).toBe(true);
						});
					});
					describe('18446744073709551615 / 153092023', function() {
						it('should equal 120494482418 ', function() {
							var a73 = $ss_UInt64.maxValue;
							var b57 = new $ss_UInt64(2097079, 9, 0);
							expect($ss_UInt64.op_Implicit$3($ss_UInt64.op_Division(a73, b57)) === $ss_Int64.op_Implicit$6(new $ss_Int64(517106, 7182, 0))).toBe(true);
						});
					});
					describe('UInt64Max / UInt64Max', function() {
						it('should equal 1', function() {
							var a74 = $ss_UInt64.maxValue;
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Division(a74, a74), $ss_UInt64.one)).toBe(true);
						});
					});
					describe('1 / UInt64Man', function() {
						it('should equal 0', function() {
							var a75 = $ss_UInt64.one;
							var b58 = $ss_UInt64.maxValue;
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Division(a75, b58), $ss_UInt64.zero)).toBe(true);
						});
					});
					describe('UInt64Min / 1', function() {
						it('should equal UInt64Min', function() {
							var a76 = $ss_UInt64.one;
							var b59 = $ss_UInt64.minValue;
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Division(b59, a76), $ss_UInt64.minValue)).toBe(true);
						});
					});
				});
				describe('Modulo', function() {
					describe('1 % 1', function() {
						it('should equal 0', function() {
							var a77 = $ss_UInt64.one;
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Modulus(a77, a77), $ss_UInt64.zero)).toBe(true);
						});
					});
					describe('0 % 1', function() {
						it('should equal 0', function() {
							var a78 = $ss_UInt64.zero;
							var b60 = $ss_UInt64.one;
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Modulus(a78, b60), $ss_UInt64.zero)).toBe(true);
						});
					});
					describe('1 % 0', function() {
						it('should throw Divide by zero Exception', function() {
							var a79 = $ss_UInt64.zero;
							var b61 = $ss_UInt64.one;
							expect(function() {
								return $ss_UInt64.op_Division(b61, a79);
							}).toThrow();
						});
					});
					describe('UInt64Max % UInt32Max', function() {
						it('should equal 0', function() {
							var a80 = $ss_UInt64.maxValue;
							var b62 = $ss_UInt64.op_Implicit$2(4294967295);
							expect($ss_UInt64.op_Equality($ss_UInt64.op_Modulus(a80, b62), $ss_UInt64.zero)).toBe(true);
						});
					});
				});
				describe('Increment', function() {
					describe('++', function() {
						it('should increment the UInt64Min', function() {
							var a81 = $ss_UInt64.minValue;
							a81 = $ss_UInt64.op_Increment(a81);
							expect($ss_UInt64.op_Equality(a81, new $ss_UInt64(1, 0, 0))).toBe(true);
						});
						it('should increment the UInt32Max', function() {
							var a82 = $ss_UInt64.op_Implicit$2(4294967295);
							a82 = $ss_UInt64.op_Increment(a82);
							expect($ss_UInt64.op_Equality(a82, new $ss_UInt64(0, 256, 0))).toBe(true);
						});
					});
				});
				describe('Decrement', function() {
					describe('--', function() {
						it('should decrement the UInt64Max', function() {
							var a83 = $ss_UInt64.maxValue;
							a83 = $ss_UInt64.op_Decrement(a83);
							expect($ss_UInt64.op_Equality(a83, new $ss_UInt64(16777214, 16777215, 65535))).toBe(true);
						});
						it('should decrement the UInt32Max', function() {
							var a84 = $ss_UInt64.op_Implicit$2(4294967295);
							a84 = $ss_UInt64.op_Decrement(a84);
							expect($ss_UInt64.op_Equality(a84, new $ss_UInt64(16777214, 255, 0))).toBe(true);
						});
					});
				});
			});
			describe('Bitwise Operators', function() {
				describe('NOT', function() {
					it('UInt64Min should go to UInt64Max', function() {
						var a85 = $ss_UInt64.minValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_OnesComplement(a85), $ss_UInt64.maxValue)).toBe(true);
					});
					it('UInt64Max should go to UInt64Min', function() {
						var a86 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_OnesComplement(a86), $ss_UInt64.minValue)).toBe(true);
					});
				});
				describe('AND', function() {
					it('UInt64Max & UInt64Max', function() {
						var a87 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_BitwiseAnd(a87, a87), $ss_UInt64.maxValue)).toBe(true);
					});
					it('UInt64Min & UInt64Min', function() {
						var a88 = $ss_UInt64.minValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_BitwiseAnd(a88, a88), $ss_UInt64.minValue)).toBe(true);
					});
					it('UInt64Min & UInt64Max', function() {
						var a89 = $ss_UInt64.minValue;
						var b63 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_BitwiseAnd(a89, b63), $ss_UInt64.zero)).toBe(true);
					});
				});
				describe('OR', function() {
					it('UInt64Max | UInt64Max', function() {
						var a90 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_BitwiseOr(a90, a90), $ss_UInt64.maxValue)).toBe(true);
					});
					it('UInt64Min | UInt64Min', function() {
						var a91 = $ss_UInt64.minValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_BitwiseOr(a91, a91), $ss_UInt64.minValue)).toBe(true);
					});
					it('UInt64Min | UInt64Max', function() {
						var a92 = $ss_UInt64.minValue;
						var b64 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_BitwiseOr(a92, b64), $ss_UInt64.maxValue)).toBe(true);
					});
				});
				describe('XOR', function() {
					it('UInt64Max ^ UInt64Max', function() {
						var a93 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_ExclusiveOr(a93, a93), $ss_UInt64.zero)).toBe(true);
					});
					it('UInt64Min ^ UInt64Min', function() {
						var a94 = $ss_UInt64.minValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_ExclusiveOr(a94, a94), $ss_UInt64.zero)).toBe(true);
					});
					it('UInt64Min ^ UInt64Max', function() {
						var a95 = $ss_UInt64.minValue;
						var b65 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_ExclusiveOr(a95, b65), $ss_UInt64.maxValue)).toBe(true);
					});
				});
				describe('Right Bit Shift', function() {
					//n=0, n=32, n=33, a is negative
					it('UInt64Min >> 0 ', function() {
						var a96 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_RightShift(a96, 0), $ss_UInt64.maxValue)).toBe(true);
					});
					it('UInt64Min >> 31 ', function() {
						var a97 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_RightShift(a97, 31), new $ss_UInt64(16777215, 511, 0))).toBe(true);
					});
					it('UInt64Min >> 32 ', function() {
						var a98 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_Implicit$3($ss_UInt64.op_RightShift(a98, 32)) === $ss_Int64.op_Implicit$6(new $ss_Int64(16777215, 255, 0))).toBe(true);
					});
					it('UInt64Max >> 33 ', function() {
						var a99 = $ss_UInt64.minValue;
						console.log($ss_UInt64.op_RightShift(a99, 33).toString());
						expect($ss_UInt64.op_Equality($ss_UInt64.op_RightShift(a99, 33), new $ss_UInt64(16777215, 127, 0))).toBe(true);
					});
					it('UInt64Max >> 48 ', function() {
						var a100 = $ss_UInt64.minValue;
						console.log($ss_UInt64.op_RightShift(a100, 48).toString());
						expect($ss_UInt64.op_Equality($ss_UInt64.op_RightShift(a100, 48), new $ss_UInt64(65535, 0, 0))).toBe(true);
					});
					it('UInt32Max >> 0 ', function() {
						var a101 = $ss_UInt64.op_Implicit$2(4294967295);
						expect($ss_UInt64.op_Equality($ss_UInt64.op_RightShift(a101, 0), $ss_UInt64.op_Implicit$2(4294967295))).toBe(true);
					});
					it('UInt32Max >> 24', function() {
						var a102 = $ss_UInt64.op_Implicit$2(4294967295);
						expect($ss_UInt64.op_Implicit$3($ss_UInt64.op_RightShift(a102, 24)) === $ss_Int64.op_Implicit$6(new $ss_Int64(255, 0, 0))).toBe(true);
					});
					it('UInt32Max >> 32 ', function() {
						var a103 = $ss_UInt64.op_Implicit$2(4294967295);
						expect($ss_UInt64.op_Equality($ss_UInt64.op_RightShift(a103, 32), $ss_UInt64.zero)).toBe(true);
					});
					it('UInt64Min >> 33 ', function() {
						var a104 = $ss_UInt64.op_Implicit$2(4294967295);
						expect($ss_UInt64.op_Equality($ss_UInt64.op_RightShift(a104, 33), $ss_UInt64.zero)).toBe(true);
					});
				});
				describe('Left Bit Shift', function() {
					//n=0, n=7, n=8, a is negative
					it('UInt64Max << 0 ', function() {
						var a105 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_LeftShift(a105, 0), $ss_UInt64.maxValue)).toBe(true);
					});
					it('UInt64Max << 7 ', function() {
						var a106 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_LeftShift(a106, 7), new $ss_UInt64(16777088, 16777215, 65535))).toBe(true);
					});
					it('UInt64Max << 8 ', function() {
						var a107 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_LeftShift(a107, 8), new $ss_UInt64(16776960, 16777215, 65535))).toBe(true);
					});
					it('UInt64Max << 9 ', function() {
						var a108 = $ss_UInt64.maxValue;
						expect($ss_UInt64.op_Equality($ss_UInt64.op_LeftShift(a108, 9), new $ss_UInt64(16776704, 16777215, 65535))).toBe(true);
					});
				});
			});
			describe('Casts', function() {
				describe('Byte', function() {
					it('should equal the min value', function() {
						var a109 = 0;
						var b66 = $ss_UInt64.op_Implicit(a109);
						expect($ss_UInt64.op_Equality(b66, new $ss_UInt64(0, 0, 0))).toBe(true);
					});
					it('should equal the value', function() {
						var a110 = 128;
						var b67 = $ss_UInt64.op_Implicit(a110);
						expect($ss_UInt64.op_Equality(b67, new $ss_UInt64(a110, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a111 = 255;
						var b68 = $ss_UInt64.op_Implicit(a111);
						expect($ss_UInt64.op_Equality(b68, new $ss_UInt64(255, 0, 0))).toBe(true);
					});
				});
				describe('SByte', function() {
					it('should equal the min value', function() {
						var a112 = -128;
						var b69 = $ss_UInt64.op_Explicit$4(a112);
						expect($ss_UInt64.op_Equality(b69, new $ss_UInt64(16777088, 16777215, 65535))).toBe(true);
					});
					it('should equal the value', function() {
						var a113 = 0;
						var b70 = $ss_UInt64.op_Explicit$4(a113);
						expect($ss_UInt64.op_Equality(b70, new $ss_UInt64(a113, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a114 = 127;
						var b71 = $ss_UInt64.op_Explicit$4(a114);
						expect($ss_UInt64.op_Equality(b71, new $ss_UInt64(a114, 0, 0))).toBe(true);
					});
				});
				describe('UInt16', function() {
					it('should equal the min value', function() {
						var a115 = 0;
						var b72 = $ss_UInt64.op_Implicit$1(a115);
						expect($ss_UInt64.op_Equality(b72, new $ss_UInt64(a115, 0, 0))).toBe(true);
					});
					it('should equal the value', function() {
						var a116 = 0;
						var b73 = $ss_UInt64.op_Implicit$1(a116);
						expect($ss_UInt64.op_Equality(b73, new $ss_UInt64(a116, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a117 = 65535;
						var b74 = $ss_UInt64.op_Implicit$1(a117);
						expect($ss_UInt64.op_Equality(b74, new $ss_UInt64(a117, 0, 0))).toBe(true);
					});
				});
				describe('Int16', function() {
					it('should equal the min value', function() {
						var a118 = -32768;
						var b75 = $ss_UInt64.op_Explicit$2(a118);
						expect($ss_UInt64.op_Equality(b75, new $ss_UInt64(16744448, 16777215, 65535))).toBe(true);
					});
					it('should equal the value', function() {
						var a119 = 0;
						var b76 = $ss_UInt64.op_Explicit$2(a119);
						expect($ss_UInt64.op_Equality(b76, new $ss_UInt64(a119, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a120 = 32767;
						var b77 = $ss_UInt64.op_Explicit$2(a120);
						expect($ss_UInt64.op_Equality(b77, new $ss_UInt64(a120, 0, 0))).toBe(true);
					});
				});
				describe('UInt32', function() {
					it('should equal the min value', function() {
						var a121 = 0;
						var b78 = $ss_UInt64.op_Implicit$2(a121);
						expect($ss_UInt64.op_Equality(b78, new $ss_UInt64(0, 0, 0))).toBe(true);
					});
					it('should equal the value', function() {
						var a122 = 2147483647;
						var b79 = $ss_UInt64.op_Implicit$2(a122);
						expect($ss_UInt64.op_Equality(b79, new $ss_UInt64(16777215, 127, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a123 = 4294967295;
						var b80 = $ss_UInt64.op_Implicit$2(a123);
						expect($ss_UInt64.op_Equality(b80, new $ss_UInt64(16777215, 255, 0))).toBe(true);
					});
				});
				describe('UInt32', function() {
					it('should equal the min value', function() {
						var a124 = 0;
						var b81 = $ss_UInt64.op_Implicit$2(a124);
						expect($ss_UInt64.op_Equality(b81, $ss_UInt64.zero)).toBe(true);
					});
					it('should equal the value', function() {
						var a125 = 0;
						var b82 = $ss_UInt64.op_Implicit$2(a125);
						expect($ss_UInt64.op_Equality(b82, new $ss_UInt64(0, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a126 = 4294967295;
						var b83 = $ss_UInt64.op_Implicit$2(a126);
						expect($ss_UInt64.op_Equality(b83, new $ss_UInt64(16777215, 255, 0))).toBe(true);
					});
				});
				describe('Double', function() {
					it('should equal the min value', function() {
						var a127 = 0;
						var b84 = $ss_UInt64.op_Explicit$1(a127);
						expect($ss_UInt64.op_Equality(b84, $ss_UInt64.zero)).toBe(true);
					});
					it('should equal the value', function() {
						var a128 = 0;
						var b85 = $ss_UInt64.op_Explicit$1(a128);
						expect($ss_UInt64.op_Equality(b85, new $ss_UInt64(0, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a129 = 4294967295;
						var b86 = $ss_UInt64.op_Explicit$1(a129);
						expect($ss_UInt64.op_Equality(b86, new $ss_UInt64(16777215, 255, 0))).toBe(true);
					});
				});
				describe('Single', function() {
					it('should equal the min value', function() {
						var a130 = 0;
						var b87 = $ss_UInt64.op_Explicit$5(a130);
						expect($ss_UInt64.op_Equality(b87, $ss_UInt64.zero)).toBe(true);
					});
					it('should equal the value', function() {
						var a131 = 0;
						var b88 = $ss_UInt64.op_Explicit$5(a131);
						expect($ss_UInt64.op_Equality(b88, new $ss_UInt64(0, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a132 = 4294967295;
						var b89 = $ss_UInt64.op_Explicit$5(a132);
						expect($ss_UInt64.op_Equality(b89, new $ss_UInt64(16777215, 255, 0))).toBe(true);
					});
				});
				describe('Decimal', function() {
					it('should equal the min value', function() {
						var a133 = 0;
						//Decimal.MinValue;
						var b90 = $ss_UInt64.op_Explicit(a133);
						expect($ss_UInt64.op_Equality(b90, $ss_UInt64.zero)).toBe(true);
					});
					it('should equal the value', function() {
						var a134 = 0;
						var b91 = $ss_UInt64.op_Explicit(a134);
						expect($ss_UInt64.op_Equality(b91, new $ss_UInt64(0, 0, 0))).toBe(true);
					});
					it('should equal the max value', function() {
						var a135 = 4294967295;
						//Decimal.MaxValue;
						var b92 = $ss_UInt64.op_Explicit(a135);
						expect($ss_UInt64.op_Equality(b92, new $ss_UInt64(16777215, 255, 0))).toBe(true);
					});
				});
			});
		});
	};
	global.ss.UUInt64Spec = $ss_UUInt64Spec;
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
	ss.initClass($ss_UUInt64Spec, $asm, {}, WebApplications.Saltarelle.JasmineTestUtils.TestSuite);
	ss.setMetadata($ss_Int64Spec, { members: [{ attr: [new WebApplications.Saltarelle.JasmineTestUtils.TestMethodAttribute()], name: 'Tests', isStatic: true, type: 8, sname: 'tests', returnType: Object, params: [] }] });
	ss.setMetadata($ss_UUInt64Spec, { members: [{ attr: [new WebApplications.Saltarelle.JasmineTestUtils.TestMethodAttribute()], name: 'Tests', isStatic: true, type: 8, sname: 'tests', returnType: Object, params: [] }] });
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
		$ss_UInt64.maxValue = new $ss_UInt64(16777215, 16777215, 65535);
		$ss_UInt64.$mask = -16777216;
	})();
})();
