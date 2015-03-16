(function() {
	'use strict';
	var $asm = {};
	global.WebApplications = global.WebApplications || {};
	global.WebApplications.Saltarelle = global.WebApplications.Saltarelle || {};
	global.WebApplications.Saltarelle.JasmineTestUtils = global.WebApplications.Saltarelle.JasmineTestUtils || {};
	global.WebApplications.Saltarelle.JasmineTestUtils.CustomMatchers = global.WebApplications.Saltarelle.JasmineTestUtils.CustomMatchers || {};
	global.WebApplications.Saltarelle.JasmineTestUtils.CustomMatchers.Registration = global.WebApplications.Saltarelle.JasmineTestUtils.CustomMatchers.Registration || {};
	ss.initAssembly($asm, 'WebApplications.Saltarelle.JasmineTestUtils');
	////////////////////////////////////////////////////////////////////////////////
	// WebApplications.Saltarelle.JasmineTestUtils.CustomMatcherAttribute
	var $WebApplications_Saltarelle_JasmineTestUtils_CustomMatcherAttribute = function(name) {
		this.Name = null;
		this.Name = name;
	};
	$WebApplications_Saltarelle_JasmineTestUtils_CustomMatcherAttribute.__typeName = 'WebApplications.Saltarelle.JasmineTestUtils.CustomMatcherAttribute';
	global.WebApplications.Saltarelle.JasmineTestUtils.CustomMatcherAttribute = $WebApplications_Saltarelle_JasmineTestUtils_CustomMatcherAttribute;
	////////////////////////////////////////////////////////////////////////////////
	// WebApplications.Saltarelle.JasmineTestUtils.TestAssemblyAttribute
	var $WebApplications_Saltarelle_JasmineTestUtils_TestAssemblyAttribute = function() {
	};
	$WebApplications_Saltarelle_JasmineTestUtils_TestAssemblyAttribute.__typeName = 'WebApplications.Saltarelle.JasmineTestUtils.TestAssemblyAttribute';
	global.WebApplications.Saltarelle.JasmineTestUtils.TestAssemblyAttribute = $WebApplications_Saltarelle_JasmineTestUtils_TestAssemblyAttribute;
	////////////////////////////////////////////////////////////////////////////////
	// WebApplications.Saltarelle.JasmineTestUtils.TestMethodAttribute
	var $WebApplications_Saltarelle_JasmineTestUtils_TestMethodAttribute = function() {
	};
	$WebApplications_Saltarelle_JasmineTestUtils_TestMethodAttribute.__typeName = 'WebApplications.Saltarelle.JasmineTestUtils.TestMethodAttribute';
	global.WebApplications.Saltarelle.JasmineTestUtils.TestMethodAttribute = $WebApplications_Saltarelle_JasmineTestUtils_TestMethodAttribute;
	////////////////////////////////////////////////////////////////////////////////
	// WebApplications.Saltarelle.JasmineTestUtils.TestSuite
	var $WebApplications_Saltarelle_JasmineTestUtils_TestSuite = function() {
		ss.shallowCopy({}, this);
	};
	$WebApplications_Saltarelle_JasmineTestUtils_TestSuite.__typeName = 'WebApplications.Saltarelle.JasmineTestUtils.TestSuite';
	$WebApplications_Saltarelle_JasmineTestUtils_TestSuite.TryRegisterCustomMatchers = function(type) {
		var haveMatchers = false;
		var matchers = {};
		var $t1 = ss.getMembers(type, 8, 24);
		for (var $t2 = 0; $t2 < $t1.length; $t2++) {
			var m = $t1[$t2];
			var $t3 = m.attr || [];
			for (var $t4 = 0; $t4 < $t3.length; $t4++) {
				var attr = $t3[$t4];
				var cma = ss.safeCast(attr, $WebApplications_Saltarelle_JasmineTestUtils_CustomMatcherAttribute);
				if (ss.isValue(cma)) {
					var cmc = ss.midel(m, null);
					if (!ss.staticEquals(cmc, null)) {
						matchers[cma.Name] = cmc;
						haveMatchers = true;
					}
				}
			}
		}
		if (haveMatchers) {
			beforeEach(function() {
				(function() {
					var $m = matchers;
					jasmine.addMatchers(Object.keys($m).reduce(function($acc, $key) {
						$acc[$key] = function($u, $c) {
							return {
								compare: function($a, $e) {
									return $m[$key]($u, $c, $a, $e);
								}
							};
						};
						return $acc;
					}, {}));
				})();
			});
		}
	};
	global.WebApplications.Saltarelle.JasmineTestUtils.TestSuite = $WebApplications_Saltarelle_JasmineTestUtils_TestSuite;
	////////////////////////////////////////////////////////////////////////////////
	// WebApplications.Saltarelle.JasmineTestUtils.CustomMatchers.Registration.MatcherResult
	var $WebApplications_Saltarelle_JasmineTestUtils_CustomMatchers_Registration_MatcherResult = function(pass, message) {
		this.pass = false;
		this.message = null;
		this.pass = pass;
		this.message = message;
	};
	$WebApplications_Saltarelle_JasmineTestUtils_CustomMatchers_Registration_MatcherResult.__typeName = 'WebApplications.Saltarelle.JasmineTestUtils.CustomMatchers.Registration.MatcherResult';
	global.WebApplications.Saltarelle.JasmineTestUtils.CustomMatchers.Registration.MatcherResult = $WebApplications_Saltarelle_JasmineTestUtils_CustomMatchers_Registration_MatcherResult;
	ss.initClass($WebApplications_Saltarelle_JasmineTestUtils_CustomMatcherAttribute, $asm, {});
	ss.initClass($WebApplications_Saltarelle_JasmineTestUtils_TestAssemblyAttribute, $asm, {});
	ss.initClass($WebApplications_Saltarelle_JasmineTestUtils_TestMethodAttribute, $asm, {});
	ss.initClass($WebApplications_Saltarelle_JasmineTestUtils_TestSuite, $asm, {
		Run: function() {
			var testMethods = [];
			// Iterate all the types in all loaded 'Test' assemblies
			var testAssemblies = ss.getAssemblies().filter(function(a) {
				try {
					// This throws an exception for mscorlib and assemblies without attributes
					return a.attr.filter(function(a) {
						return ss.isInstanceOfType(a, $WebApplications_Saltarelle_JasmineTestUtils_TestAssemblyAttribute);
					}).length > 0;
				}
				catch ($t1) {
					var ex = ss.Exception.wrap($t1);
					return false;
				}
			});
			for (var $t2 = 0; $t2 < testAssemblies.length; $t2++) {
				var ta = testAssemblies[$t2];
				ss.getAssemblyTypes(ta).forEach(ss.mkdel(this, function(type) {
					$WebApplications_Saltarelle_JasmineTestUtils_TestSuite.TryRegisterCustomMatchers(type);
					this.$ExtractTestMethods(type, testMethods);
				}));
			}
			// AFTER any custom matchers have been registered, invoke our test methods sequentially
			for (var $t3 = 0; $t3 < testMethods.length; $t3++) {
				var testMethod = testMethods[$t3];
				ss.midel(testMethod, null)();
			}
		},
		$ExtractTestMethods: function(type, testMethods) {
			ss.arrayAddRange(testMethods, ss.getMembers(type, 8, 24).filter(function(mi) {
				return (mi.attr || []).filter(function(a) {
					return ss.isInstanceOfType(a, $WebApplications_Saltarelle_JasmineTestUtils_TestMethodAttribute);
				}).length > 0 && mi.params.length === 0;
			}));
		}
	}, Object);
	ss.initClass($WebApplications_Saltarelle_JasmineTestUtils_CustomMatchers_Registration_MatcherResult, $asm, {});
	ss.setMetadata($WebApplications_Saltarelle_JasmineTestUtils_TestSuite, { members: [{ name: '.ctor', type: 1, params: [] }, { name: 'Run', type: 8, sname: 'Run', returnType: Object, params: [] }, { name: 'TryRegisterCustomMatchers', isStatic: true, type: 8, sname: 'TryRegisterCustomMatchers', returnType: Object, params: [Function] }] });
})();
