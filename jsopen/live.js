/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	// by default for auto select, and then for use in the go-back-step logic
	let alreadySelectedRegType = 'individual';
	let alreadySelectedTradePlatform = 'mt5';
	let alreadySelectedAccountType = 'acctype_standard_account';
	let alreadySelectedCurrency = 'USD';
	if(window.location.pathname.includes("au")){
		alreadySelectedCurrency = 'AUD';
	}

	if (window.history.state && window.history.state.step) {
		window.history.replaceState({}, '');
	}

	document.querySelector('html').classList.add('reg-live');

	/*jshint -W069 */
	$(document).ready(function() {
		if (localStorage) {
			const tracking = localStorage.getItem('visitor-tracking');
			if (tracking) {
				$('input[name="tracking_info"]').val(tracking);
			}
		}

		$(document).on('readyToRegisterLive', function(e) {
	        registerLive();
	    });

		// var countryBranch = getDefaultBranchByCountryCode(window['forceCountryFrom'])

	    registerLive();

	    function registerLive () {
	        if (!$('.wp-icm-open-account.live').length) return;
			window['previous_country'] = ''
			window['request_from'] = 'WWW2 Branched live';
			window['personalAreaURL'] = $('.wp-icm-open-account.live a.personal-area-url').attr('href');
			window['currenciesList'] = [];
	        window['serverBranches'] = [];
	        window['allBranches'] = [];
			window['currentBranch'] = $('html').attr('data-branch');
			window['accessCountry'] = window['accessCountry']; // transfered from: res.locals.countryCode
			window['serverCountries'] = [];
			window['allCountries'] = [];
	        window['serverSuitableTraits'] = {};
	        window['landingPage'] = false;
	        window['selectedAccountType'] = null;
	        window['tradePlatforms'] = {};
	        window['accountTypes'] = [];
            window['tradePlatformsIslamic'] = {};
            window['accountTypesIslamic'] = [];
            window['branchCountries'] = null;
	        window['unsupportedCountries'] = [
	            'United States'
	        ];
	        window['disallowedCountries'] = [
	            'New Zealand',
	            'Chatham Island (New Zealand)'
	        ];
			window['trulioo'] = false;
			window['joint_trulioo'] = false;
			window['truliooVerificationFields'] = {}
			window['joint_truliooVerificationFields'] = {}
			window['country_code']=''
			window['joint_country_code']=''
			window['forceRegulator'] = null;
			window['jointAdded']=false
	        window.getSignTokenLive = function () {
	            var $def = $.Deferred();
	            $.get(window['serverURL'] + '~get~sign~token~?nocache=' + Date.now()).done(function (token) {
	                $def.resolve(token);
	            }).fail(function () {
	                $def.resolve(null);
	            });

	            return $def.promise();
	        };

	        // $('.wp-icm-open-account.live .reg_overlay').fadeIn(0);
	        $('.wp-icm-open-account.live a.link-to-personal-area').each(function() {
	            $(this).attr('href', window['personalAreaURL']);
	        });
	        $('.wp-icm-open-account.live a.link-to-personal-area-downloads').each(function() {
	            $(this).attr('href', window['personalAreaURL'] + '/Downloads');
	        });

	        var startTimeout = setTimeout(function() {
	            window['userLocationByIP'] = {
	                countryName: '',
	                countryCode: 'XX'
	            };
	            window['serverCountries'] = [{
	                code: 'XX',
	                id: 888,
	                name: '',
	                tel: '+000'
	            }];
	            startRegistrationLive();
	            $(document).trigger('liveDataLoaded');
	        }, 59000); // for show form if something wrong
	        setTimeout(function() { // for show waiting indicator
                var moveTrueECNToTop = function(branch) {
                    if (!branch) return;
                    window['tradePlatforms'][branch].forEach(function(tp_item) {
                        tp_item['accountTypes'] = tp_item['accountTypes'].sort(function(a, b) {
                            return a.name[0] < b.name[0];
                        });
                    });
                    window['tradePlatformsIslamic'][branch].forEach(function(tp_item) {
                        tp_item['accountTypes'] = tp_item['accountTypes'].sort(function(a, b) {
                            return a.name[0] < b.name[0];
                        });
                    });
                };
				function getDefaultBranchByCountryCode(countryCode) {
					var countries = window['serverCountries'];
					var branch = '3';
					if (countries && countries.length) {
						for (var i in countries) {
							var countryObject = countries[i];
							if (countryObject && countryObject.code === countryCode && countryObject.branching) {
								var branchOptions = countryObject.branching.find(function (item) {
									return item && item.status === "1" && item.default === true;
								});
								if (branchOptions) {
									branch = branchOptions.branch;
								}
								break;
							}
						}
					}
					return branch;
				}
				function initCountriesByRegulatorRules (branchedCountries) {
					var temp_serverCountries = branchedCountries;
					if (temp_serverCountries.length) {
						branchedCountries = temp_serverCountries;
						if ($('html').is('.country-cy.branch-2')) {
							// leave only CySEC countries for Cyprus
							// branchedCountries = temp_serverCountries.filter((c) => (c && c.code == 'XX') || (c && c.branching && c.branching.find(b => b.branch == 2 && b.status == 1)));
						}
					} else {
						console.error('Error DB settings: all branches of all countries has status = 4;');
					}

					if (window['forceRegulator']) { // WEB-1167
						temp_serverCountries = [];
						for (var i in branchedCountries) {
							var c = branchedCountries[i];
							if (c && c.branching) {
								var temp_c = {
									code: c.code,
									id: c.id,
									name: c.name,
									status: c.status,
									tel: c.tel
								};
								var forceBranchOptions = c.branching.find(function (item) {
									return item && item.branch === window['forceRegulator'] && item.status === '1';
								});
								if (forceBranchOptions) {
									temp_c.branching = [{
										'branch': window['forceRegulator'],
										'status': '1',
										'default': true
									}];
									temp_serverCountries.push(temp_c);
								}
							}
						}
						if (temp_serverCountries.length) {
							branchedCountries = temp_serverCountries;
						} else {
							console.error('Error value in REGULATOR url parameter:', window['forceRegulator']);
						}
					}
					if(window['currentBranch'] == '2') {
						//branchedCountries = branchedCountries.filter(c => (c && c.branching && !c.branching.every(b => (b.branch == 1 || b.branch == 3 || b.branch == 4 || b.branch == 5))));
						branchedCountries = branchedCountries.filter(c => (c && c.branching && c.branching.find(b => b.branch == 2 && b.status == 1)));
					} else if(window['currentBranch'] == '6') {
						//branchedCountries = branchedCountries.filter(c => (c && c.branching && !c.branching.every(b => (b.branch == 1 || b.branch == 3 || b.branch == 4 || b.branch == 5))));
						branchedCountries = branchedCountries.filter(c => (c && c.branching && c.branching.find(b => b.branch == 6 && b.status == 1)));
					} else {
						// remove countries where all branches has status 4, but keep separator in the list
						branchedCountries = branchedCountries.filter(c => (c && c.branching && !c.branching.every(b => b.status == 4)));
					}
					branchedCountries.sort((a, b) => a.name.localeCompare(b.name));
					window['serverCountries'] = branchedCountries;
					window['cysecCountriesAsFavourites'] = [];
					let eu_countries_codes = [...new Set(cysecCountriesString.split('__'))];
					let eu_countries = eu_countries_codes.map(c => window['serverCountries'].find(f => f.code.toLowerCase() === c));
					eu_countries.sort((a, b) => a.name.localeCompare(b.name));
					eu_countries.push({
						code: "XX",
						id: 0,
						name: "separator",
						status: 1,
						tel: "-"
					});
					window['cysecCountriesAsFavourites'] = eu_countries;
					window['serverCountries'].map(s => {
						if (s.code === 'GB') return;
						if (!window['cysecCountriesAsFavourites'].find(f => f.code === s.code)) {
							window['cysecCountriesAsFavourites'].push(s);
						}
					});
					allAvailableCountries = temp_serverCountries.filter((c) => (c && c.branching && c.branching.find(b => b.branch == 3 && b.status !== 4)));
					allAvailableCountries.sort((a, b) => a.name.localeCompare(b.name));
					allAvailableCountries.map(s => {
						if (!window['allAvailableCountries'].find(f => f.code === s.code)) {
							window['allAvailableCountries'].push(s);
						}
					});
				}
                var retry_count = 2;
	            var getDataAndContinue = function(ip, retry_count) {
					window['userIP'] = ip;
					window['countryByIP'] = Cookies.get('userCountryByIP');
					if(window['currentBranch'] == '2' || window['currentBranch'] == '3' || window['currentBranch'] == '4' || window['currentBranch'] == '6'){
						var node = document.querySelector('.register_form#step_4')
						node.style.display = 'none';
						var node2 = document.querySelector('.process_line#process_line_step4')
						node2.style.display = 'none';
					}
					// var node3 = document.querySelector('.process_line#process_line_step4_phone')
					// 	node3.style.display = 'none';
					var languageId = window.location.pathname.includes("cn/")?'3':'1'
	                getSignTokenLive().then(function(token) {
	                    $.ajax({
	                        dataType: "json",
	                        url: window['serverURL'] + "?getData&ip=" + ip + '&branchID=' + window['currentBranch'] +'&languageID=' + languageId +'&request_from=' + window['request_from'] + '&sign=' + token,
	                        success: function(data) {
								if (window['forceCountryFrom']) {
									data.locationByIP.countryCode = window['forceCountryFrom'];
								}
								window['userLocationByIP'] = data.locationByIP;
								if (data.locationByIP.query) {
									window['userIP'] = data.locationByIP.query;
									window['countryByIP'] = data.locationByIP.country;
								}
								window['serverBranches'] = data.branches;
								window['allBranches'] = data.branches;
								window['identityCountries'] = data.identityCountries

								initBranchesList();
								initCountriesByRegulatorRules(data.countries);
	                            window['allCountries'] = data.countries;
	                            window['currenciesList'] = data.currenciesList;
	                            window['serverSuitableTraits'] = data.suitableTraits;
                                window['tradePlatforms'] = {};
                                data.tradePlatforms.map(function (branched) {
                                    window['tradePlatforms'][branched.branch] = branched.tradePlatforms;
                               });
                                window['tradePlatformsIslamic'] = {};
                                data.tradePlatformsIslamic.map(function (branched) {
                                    window['tradePlatformsIslamic'][branched.branch] = branched.tradePlatforms;
                                });
								var content = document.querySelector('#step_4').innerHTML
								document.querySelector('#step_4').innerHTML = data.questionList + content;
	                            moveTrueECNToTop();
	                            clearTimeout(startTimeout);
	                            startRegistrationLive();
	                            $(document).trigger('liveDataLoaded');
	                        },
	                        error: function(data) {
								console.error("ERROR getDataAndContinue: incorrect ajax response data", data);
								if (retry_count) return getDataAndContinue(ip, retry_count - 1);
	                            clearTimeout(startTimeout);
	                            startRegistrationLive();
	                            $(document).trigger('liveDataLoaded');
	                        }
	                    });
	                });
	            };
	            var userIP = Cookies.get('userIPAddress');
	            if (userIP) {
	                getDataAndContinue(userIP, retry_count);
	            } else {
	                getSignTokenLive().then(function(token) {
	                    $.ajax({
	                        dataType: "json",
	                        url: window['serverURL'] + '?getIncrement' + '&request_from=' + window['request_from'] + '&sign=' + token,
	                        success: function( data ){
	                            // console.log('counter = ' + data);
	                        },
	                        error: function( data ){
	                            // console.log('counter = ' + data);
	                        }
	                    });
	                });
	                var ipTimeoutReached = false;
	                var ipTimeout = setTimeout(function () {
	                    ipTimeoutReached = true;
						var ip = 'timeout';
						Cookies.set('userCountryByIP', '', { expires: 1 });
	                    getDataAndContinue(ip);
	                }, 55000);
	                $.get("https://pro.ip-api.com/json/?key=xylJvTwPTjbRGfQ").done(function(done) {
	                    // console.log('DONE: https://pro.ip-api.com/json/?key=xylJvTwPTjbRGfQ', done);
	                    if (!ipTimeoutReached) {
	                        clearTimeout(ipTimeout);
	                        var ip = done.query;
	                        if (ip) {
	                            Cookies.set('userIPAddress', ip, { expires: 1 });
	                            Cookies.set('userCountryByIP', done.country, { expires: 1 });
	                            getDataAndContinue(ip, retry_count);
	                        }
	                    }
	                }).fail(function(fail) {
	                    console.log('FAIL: https://pro.ip-api.com/json/?key=xylJvTwPTjbRGfQ', fail);
	                });
	            }
	        }, 300);
	    }

	    $('.show_verification_and_compensation').on('click', function(e) {
	        $('#verification_and_compensation').fadeIn();
	    });
	    $('#verification_and_compensation').on('click', function(e) {
	        $('#verification_and_compensation').fadeOut();
	    });
		//var countryBranch = getDefaultBranchByCountryCode(window['forceCountryFrom'])
		// if(countryBranch == "2" && window['currentBranch'] == "3"){
		// 	// document,getElementById('live-mask').style.display="none"
		// 	// document.getElementsById('popup-group').style.display='none'
		// 	$('body').toggleClass('popup-modal-active-expected-redirect-only', false)
		// }

		$('input#cn_name').on('change', function() {handleChineseNameInput('individual')});
	});

	function setDefaultCurrency ($currencyInput, defaultCurrency) {
		if ($currencyInput.val() !== '') return;
		defaultCurrency = defaultCurrency || 'USD';
		$currencyInput.val(defaultCurrency);
		var branched = window['currenciesList'].find(function (item) {
			return item && item.branch === window['currentBranch'];
		});
		if (!branched) {
			console.error("window['currenciesList'] should not be empty!");
			return;
		}
		var currenciesByBranch = branched.items;
		$currencyInput.attr(
			'data-orig',
			currenciesByBranch.reduce(
				function (item, _) {
					if (_.name === defaultCurrency) item = _;
					return item;
				},
				currenciesByBranch[0]
			).id
		);
		$currencyInput.parent().addClass('has-label');
	}

	function _changeBranch ($branchInput, countryCode, branchID, paypalResponse) {
		// debugger
		var canRedirect = branchID !== null;
        // WEB-1409 for Joint (by any selected country) try to set the same branch like in Main Account
        var step1branch = $('#branch_id').attr('data-orig');
        if ($branchInput.is('#joint_branch_id') && !branchID) {
            branchID = step1branch;
        }
		var defaultBranchByCountry = {};
		var isCurrentBranchAllowedForSelectedCountry = false;
		var isSelectedBranchAllowedForSelectedCountry = false;
		if (countryCode) {
			var countries = paypalResponse ? window['allCountries'] : window['serverCountries'];
			var country = countries.find(function (item) {
				return item && item.code === countryCode;
			});
			if (country && country.branching) {
				var currentBranchForSelectedCountry = country.branching.find(function (item) {
					return item && item.branch === currentBranchID;
				});
				if (currentBranchForSelectedCountry && currentBranchForSelectedCountry.status !== '4') {
					isCurrentBranchAllowedForSelectedCountry = true;
				}

				var selectedBranchForSelectedCountry = country.branching.find(function (item) {
					return item && item.branch === branchID;
				});
				if (selectedBranchForSelectedCountry && selectedBranchForSelectedCountry.status !== '4') {
					isSelectedBranchAllowedForSelectedCountry = true;
				}

				// default with status 1
				// default branch from currentBranchID
				defaultBranchByCountry = country.branching.find(function (item) {
					return item && item.status === '1' /*&& item.default === true*/  && item.branch === currentBranchID && (isItCySECWebSite || item.branch !== '2');
				});
				if (!defaultBranchByCountry) {
					// any allowed status for current branch
					defaultBranchByCountry = country.branching.find(function (item) {
						return item && item.status !== '4' && item.branch === currentBranchID && (isItCySECWebSite || item.branch !== '2');
					});
				}
				if (!defaultBranchByCountry) {
					// status 1 for default by country branch
					defaultBranchByCountry = country.branching.find(function (item) {
						return item && item.status === '1' && item.default === true && (isItCySECWebSite || item.branch !== '2');
					});
				}
				if (!defaultBranchByCountry) {
					// any with status 1
					defaultBranchByCountry = country.branching.find(function (item) {
						return item && item.status === '1';
					});
				}
				if (!defaultBranchByCountry) {
					// any with status 2
					defaultBranchByCountry = country.branching.find(function (item) {
						return item && item.status === '2';
					});
				}
				if (!defaultBranchByCountry) {
					// any with status 3
					defaultBranchByCountry = country.branching.find(function (item) {
						return item && item.status === '3';
					});
				}
			}
		}

		if (isSelectedBranchAllowedForSelectedCountry && branchID) {
			window['currentBranch'] = branchID;
		} else if (isCurrentBranchAllowedForSelectedCountry && branchID) {
			window['currentBranch'] = window['currentBranch'];
		} else if (defaultBranchByCountry.branch) {
			window['currentBranch'] = defaultBranchByCountry.branch;
		} else {
			window['currentBranch'] = Cookies.get('regulator') || branchID || defaultBranchByCountry.branch || window['currentBranch'];
		}

		var defaultBranch = defaultBranchByCountry.branch;
		var branch = defaultBranch;
		var branches = paypalResponse ? window['allBranches'] : window['serverBranches'];
		var branched = branches.find(function (item) {
			return item && item.ID === window['currentBranch'];
		});
		if (branched && branched.ID) {
			var name = $('.cached-translation.reg_form_branch_' + branched.Name.toLowerCase()).text();
			var description = $('.cached-translation.reg_form_branch_' + branched.Name.toLowerCase() + '_description').html();
			$branchInput.val(name);
			$branchInput.attr(
				'data-orig',
				branched.ID
				);
				$branchInput.parent().addClass('has-label');
				branch = branched.ID;
				$('.branch-description').html(description);
			} else {
			$branchInput.attr(
				'data-orig',
				defaultBranch
			);
			$branchInput.parent().removeClass('has-label');
			$('.branch-description').html('');
		}
		toggleAsknowledge(countryCode);
	}

	function setBranch ($branchInput, countryCode, branchID, isForce, paypalResponse) {
		if (!$branchInput || !$branchInput.length) return;
		if (isForce) {
			_changeBranch($branchInput, countryCode, branchID, paypalResponse);
			if ($branchInput.is('#joint_branch_id') && !!branchID) return;
			let selectedCountry_Object = serverCountries.find(c => c.code === countryCode.toUpperCase());
			let branchDefault = null;
			let branchFrom = ICMBranchID;
			let branchTo = currentBranch || currentBranchID;
			let canRegisterInBranchFrom = false;
			let canRegisterInBranchTo = true;
			let selectedCountry = countryCode.toLowerCase();
			let selectedCountry_Name = null;
			let isSupportedCurrentBranchForSelectedCountry = false;
			if (selectedCountry_Object) {
				let branchFromData = selectedCountry_Object.branching.find(b => b.branch === branchFrom)
				if (!branchFromData) {
					branchFromData = {
						branch: branchFrom,
						status: '4',
						default: false
					}
				}
				canRegisterInBranchFrom = branchFromData.status === '1'
				canRegisterInBranchTo = selectedCountry_Object.branching.find(b => b.branch === branchTo).status === '1'
				selectedCountry_Name = selectedCountry_Object.name
				isSupportedCurrentBranchForSelectedCountry = canRegisterInBranchFrom && branchFromData.default;

				let branchDefaultData = selectedCountry_Object.branching.find(b => b.default === true);
				branchDefault = branchDefaultData ? branchDefaultData.branch : null;
			}
			if (cysecCountriesString.includes(selectedCountry) && branchFrom !== '2') {
				isSupportedCurrentBranchForSelectedCountry = false
				branchTo = '2'
			}
			$('.hint-go-eu').hide();
			$('.hint-go-eu-au').hide();
			$('.hint-go-au').hide();

			// display canada states dropdown
			if (selectedCountry === 'ca') {
				collectCanadaStates();

				$('.wp-icm-open-account.live .input-select-state').attr("style", "display: block;");
				$('.wp-icm-open-account.live .hint-canada-state').attr("style", "display: block;");
				$('.wp-icm-open-account.live #registered_state').parent().attr("style", "display: none;");
				$('.wp-icm-open-account.live #business_state').parent().attr("style", "display: none;");
				$('.wp-icm-open-account.live #states').attr('data-parsley-excluded', 'false');
			} else {
				$('.wp-icm-open-account.live .input-select-state').attr("style", "display: none;");
				$('.wp-icm-open-account.live .hint-canada-state').attr("style", "display: none;");
				$('.wp-icm-open-account.live #registered_state').parent().attr("style", "display: block;");
				$('.wp-icm-open-account.live #business_state').parent().attr("style", "display: block;");
				$('.wp-icm-open-account.live #states').attr('data-parsley-excluded', 'true');
			}

			// enable all input fields
			$(".register_form :input:not([name=country]), .register_form :button").prop("disabled", false);
			let branchFrom_Name = serverBranches.find(b => b.ID === branchFrom).Name;
			let branchTo_Name = serverBranches.find(b => b.ID === branchTo).Name;

			if (!selectedCountry_Name) {
				// if we unable to define the country from where user come, then
				// allow for him to select available country from the list without aby popups
			} else {
				if (!isSupportedCurrentBranchForSelectedCountry) {
					let camp = Cookies.get('camp');
					let params = `?reg_force_country=${selectedCountry}${camp && camp.length ? '&camp=' + camp : ''}`;

					if (branchFrom == "1" && selectedCountry == 'gb') {
						// disable all input fields
						$(".register_form :input:not([name=country]), .register_form :button").prop("disabled", true);
						$('body').toggleClass('popup-modal-active-warning-only', true);
						$('.popup-modal.warning-only .content').fadeIn();
						$('.popup-modal.warning-only .current-branch-name').text(branchFrom_Name);
						$('.popup-modal.warning-only .selected-country-name').text(selectedCountry_Name);
						$('.popup-modal.warning-only .content').on('click', '.popup-modal-button', function (e) {
							$('body').toggleClass('popup-modal-active-warning-only', false);
							$('.popup-modal.warning-only .content').fadeOut(300);
						});
					} else if (branchFrom == "4") {
						// disable all input fields
						$(".register_form :input:not([name=country]), .register_form :button").prop("disabled", true);
						$('body').toggleClass('popup-modal-active-expected-redirect-only', true);
						$('.popup-modal.expected-redirect-only .content').fadeIn();
						$('.popup-modal.expected-redirect-only .current-branch-name').text(branchFrom_Name)
						$('.popup-modal.expected-redirect-only .selected-country-name').text(selectedCountry_Name)
						$('.popup-modal.expected-redirect-only .redirect-to-branch-name').text(branchTo_Name)
						$('.popup-modal.expected-redirect-only .content').off('click', '.popup-modal-button');
						$('.popup-modal.expected-redirect-only .content').on('click', '.popup-modal-button', function (e) {
							$('body').toggleClass('popup-modal-active-expected-redirect-only', false);
							$('.popup-modal.expected-redirect-only .content').fadeOut(300);
							Cookies.remove('regulator');
							let protocol = window.location.protocol
							let host = window.location.host
							if (!host.includes('localhost') && !host.includes('icmarkets.com')) {
								host = 'icmarkets.com'
							}
							let prefix = ''
							switch (branchDefault) {
								case '1':
									prefix = '/au/en'
									break;
								case '2':
									prefix = '/eu/en'
									break;
								case '3':
									prefix = '/global/en'
									break;
								case '4':
									prefix = '/intl/en'
									break;
								case '6':
									prefix = '/uk/en'
									break;
								case '8':
									prefix = '/mu/en'
									break;
								case '9':
									prefix = '/ky/en'
									break;
							}
							window.location = protocol + '//' + host + prefix + '/open-trading-account/live/' + params;
						});
					} else if (canRegisterInBranchFrom) {
						// Andrew: do not show this popup as not necessary now!
						// // if (cysecCountriesString.includes(selectedCountry)) {
						// if (['gb', 'es', 'de', 'nl', 'se', 'pt'].includes(selectedCountry)) {
						// 	// show popup for EU clients with 2 options (leave here or redirect)
						// 	$('body').toggleClass('popup-modal-active-eu-proceed-to-com', true);
						// 	$('.popup-modal.eu-proceed-to-com .content').off('click', '.popup-modal-button');
						// 	$('.popup-modal.eu-proceed-to-com .content').on('click', '.popup-modal-button', function (e) {
						// 		$('body').toggleClass('popup-modal-active-eu-proceed-to-com', false);
						// 		var btn = $(this);
						// 		if (btn.is('.accept-button')) {
						// 			// Cookies.set('eu_user_confirm_com', 'confirmed')
						// 		} else { // restore CySEC in selector
						// 			Cookies.remove('regulator');
						// 			window.location = window['cysecRegformURL'] + params;
						// 		}
						// 	});
						// } else {
						// 	console.error('Selected country settings ERROR: please contact us for advice')
						// }

						if (cysecCountriesString.includes(selectedCountry)) {
							branchDefault = '2';
						}

						// Andrew: show 2 options popup for Australia in FSA and SCB!
						// It's should be a common logic solution for any country, which is allowed to register
						// in the current branch, but the default branch is different
						if (branchDefault && ((branchDefault !== branchFrom && selectedCountry === 'au') || (branchDefault !== branchFrom && cysecCountriesString.includes(selectedCountry)))) {
							// In FSA only: hide the 2 option popup, but show the Notice for EU clients
							const forbiddenCountries = ["fr", "pl", "cy" ];
							if (branchFrom == '3' && branchDefault == '2' && cysecCountriesString.includes(selectedCountry)) {
								// Notice for EU country to go CySEC
								if (!forbiddenCountries.includes(selectedCountry)) {
									$('.hint-go-eu-au').show();
								} else {
									$('.hint-go-eu').show();
								}
							} else {
								//if (branchFrom == '2' && branchDefault == '1') return;
								if (cysecCountriesString.includes(selectedCountry) && !forbiddenCountries.includes(selectedCountry) && branchFrom ==='1') return;
								let branchDefault_Name = {
									"1": "International Capital Markets Pty Ltd (Australia)",
									"2": "IC Markets (EU) Ltd",
									"3": "Raw Trading Ltd",
									"4": "IC Markets Ltd",
									"6": "IC Markets (UK) Ltd",
									"8": "Raw Trading (Mauritius) Ltd",
									"9": "IC Markets (KY) Ltd"
								}[branchDefault];
								// show popup with 2 options (leave here or redirect)
								$('body').toggleClass('popup-modal-active-goto-default', true);
								$('.popup-modal.goto-default .redirect-default-branch-name').text(branchDefault_Name)
								$('.popup-modal.goto-default .content').off('click', '.popup-modal-button');
								$('.popup-modal.goto-default .content').on('click', '.popup-modal-button', function (e) {
									$('body').toggleClass('popup-modal-active-goto-default', false);
									var btn = $(this);
									if (btn.is('.accept-button')) {
										Cookies.remove('regulator');
										let protocol = window.location.protocol
										let host = window.location.host
										if (!host.includes('localhost') && !host.includes('icmarkets.com')) {
											host = 'icmarkets.com'
										}
										let prefix = ''
										switch (branchDefault) {
											case '1':
												prefix = '/au/en'
												break;
											case '2':
												prefix = '/eu/en'
												break;
											case '3':
												prefix = '/global/en'
												break;
											case '4':
												prefix = '/intl/en'
												break;
											case '6':
												prefix = '/uk/en'
												break;
											case '8':
												prefix = '/mu/en'
												break;
											case '9':
												prefix = '/ky/en'
												break;
										}
										window.location = protocol + '//' + host + prefix + '/open-trading-account/live/' + params;
									}
								});
							}
						}
					} else if (canRegisterInBranchTo) {
						// show popup with 1 option (expected redirect only)
						// disable all input fields
						$(".register_form :input:not([name=country]), .register_form :button").prop("disabled", true);
						$('body').toggleClass('popup-modal-active-expected-redirect-only', true);
						$('.popup-modal.expected-redirect-only .content').fadeIn();
						$('.popup-modal.expected-redirect-only .current-branch-name').text(branchFrom_Name)
						$('.popup-modal.expected-redirect-only .selected-country-name').text(selectedCountry_Name)
						$('.popup-modal.expected-redirect-only .redirect-to-branch-name').text(branchTo_Name)
						$('.popup-modal.expected-redirect-only .content').off('click', '.popup-modal-button');
						$('.popup-modal.expected-redirect-only .content').on('click', '.popup-modal-button', function (e) {
							$('body').toggleClass('popup-modal-active-expected-redirect-only', false);
							$('.popup-modal.expected-redirect-only .content').fadeOut(300);
							Cookies.remove('regulator');
							let protocol = window.location.protocol
							let host = window.location.host
							if (!host.includes('localhost') && !host.includes('icmarkets.com')) {
								host = 'icmarkets.com'
							}
							let prefix = ''
							switch (branchTo) {
								case '1':
									prefix = '/au/en'
									break;
								case '2':
									prefix = '/eu/en'
									break;
								case '3':
									prefix = '/global/en'
									break;
								case '4':
									prefix = '/intl/en'
									break;
								case '6':
									prefix = '/uk/en'
									break;
								case '8':
									prefix = '/mu/en'
									break;
								case '9':
									prefix = '/ky/en'
									break;
							}
							window.location = protocol + '//' + host + prefix + '/open-trading-account/live/' + params;
						});
					} else {
						console.error('Branching ERROR: please contact us for advice')
					}
				} else {
					// For FSA clients that we recommend them to choose au
					const recommendCountries = ['za'];
					if (branchFrom == '3' && recommendCountries.includes(selectedCountry)) {
						let href = $('.hint-go-au > a').attr('href').split('?');
						href = href[0];
						$('.hint-go-au > a').attr('href', href + '?reg_force_country=' + selectedCountry)
						$('.hint-go-au').show();
					}
				}

				// For South Africa clients on AU site
				const termsAndConditions = $('.declaration_wrap a:contains("Terms and Conditions")');
				if (branchFrom === '1') {
					if (selectedCountry === 'za') {
						termsAndConditions.attr('href', 'https://cdn.icmarkets.com/uploads/ICM-Account-Terms(SA).pdf')
					} else {
						termsAndConditions.attr('href', 'https://cdn.icmarkets.com/uploads/ICM-Account-Terms.pdf')
					}
				}
			}
		} else if (window['isUserFromCySECCountry'] && !window['isItCySECWebSite'] && window['cysecCountriesString'].indexOf(countryCode.toLowerCase()) !== -1) {
			if ($branchInput.is('#joint_branch_id') && !!branchID) return;
			// user from EU country on the .com website selected EU country in the dropdown
			if (branchID === '1') {
				$('body').toggleClass('popup-modal-active-eu-proceed-to-com', true);
				$('.popup-modal.eu-proceed-to-com .content').off('click', '.popup-modal-button');
				$('.popup-modal.eu-proceed-to-com .content').on('click', '.popup-modal-button', function (e) {
					$('body').toggleClass('popup-modal-active-eu-proceed-to-com', false);
					var btn = $(this);
					if (btn.is('.accept-button')) {
						Cookies.set('eu_user_confirm_com', 'confirmed')
					} else { // restore CySEC in selector
						Cookies.remove('regulator');
						window.location = window['cysecRegformURL']
					}
				});
			} else if (branchID === '3') {
				$('body').toggleClass('popup-modal-active-eu-proceed-to-com', true);
				$('.popup-modal.eu-proceed-to-com .content').off('click', '.popup-modal-button');
				$('.popup-modal.eu-proceed-to-com .content').on('click', '.popup-modal-button', function (e) {
					$('body').toggleClass('popup-modal-active-eu-proceed-to-com', false);
					var btn = $(this);
					if (btn.is('.accept-button')) {
						Cookies.set('eu_user_confirm_com', 'confirmed')
					} else { // restore CySEC in selector
						Cookies.remove('regulator');
						window.location = window['cysecRegformURL']
					}
				});
			} else if (branchID === '4') {
				$('body').toggleClass('popup-modal-active-eu-proceed-to-com', true);
				$('.popup-modal.eu-proceed-to-com .content').off('click', '.popup-modal-button');
				$('.popup-modal.eu-proceed-to-com .content').on('click', '.popup-modal-button', function (e) {
					$('body').toggleClass('popup-modal-active-eu-proceed-to-com', false);
					var btn = $(this);
					if (btn.is('.accept-button')) {
						Cookies.set('eu_user_confirm_com', 'confirmed')
					} else { // restore CySEC in selector
						Cookies.remove('regulator');
						window.location = window['cysecRegformURL']
					}
				});
			}
		} else {
			_changeBranch($branchInput, countryCode, branchID, paypalResponse);
		}

		// $('.branch-select').toggleClass('hide-alone', $('.branch-select ul li').length < 2);

		if (window['currentBranchID'] == '4' && window['countryFrom'] == 'au' && countryCode == 'AU') {
			$('body').toggleClass('popup-modal-active-au-continue-with-bs', true);
			$('.popup-modal.au-continue-with-bs .content').off('click', '.popup-modal-button');
			$('.popup-modal.au-continue-with-bs .content').on('click', '.popup-modal-button', function (e) {
				$('body').toggleClass('popup-modal-active-au-continue-with-bs', false);
				var btn = $(this);
				if (btn.is('.accept-button')) {
					Cookies.set('au_continue_with_bs', 'confirmed')
				} else { // go to AU website
					Cookies.remove('au_continue_with_bs');
					window.location = 'https://icmarkets.com/au/en/open-trading-account/live';
				}
			});
		}
	}
	window.setBranch = setBranch;

	function collectCanadaStates() {
		var options_list = $('.wp-icm-open-account.live .input-select-state .searchDropdown .options_list');
		if (!options_list.length) {
			$('.wp-icm-open-account.live .input-select-state .searchDropdown input').after('<ul class="options_list"></ul>');
		}

		var list = $('.input-select-state').find('.options_list');
		var CanadaStates = [
			{
				code: 'AB',
				state_province: 'Alberta'
			},
			{
				code: 'MB',
				state_province: 'Manitoba'
			},
			{
				code: 'NB',
				state_province: 'New Brunswick'
			},
			{
				code: 'NF',
				state_province: 'Newfoundland and Labrador'
			},
			{
				code: 'NT',
				state_province: 'Northwest Territories'
			},
			{
				code: 'NS',
				state_province: 'Nova Scotia'
			},
			{
				code: 'NU',
				state_province: 'Nunavut'
			},
			{
				code: 'PE',
				state_province: 'Prince Edward Island'
			},
			{
				code: 'PQ',
				state_province: 'Quebec'
			},
			{
				code: 'SK',
				state_province: 'Saskatchewan'
			},
			{
				code: 'YT',
				state_province: 'Yukon'
			}
		];

		$.each(CanadaStates, function(value, item) {
			list.append("<li data-sc='" + item.code + "' data-sn='" + item.state_province + "'>" + item.state_province + "</li>");
		});
	}

	function collectUnsupportedAndDisallowedCountriesLive() {
	    window['unsupportedCountries'] = [];
		window['disallowedCountries'] = [];
		var branch = window['currentBranch'];
	    for (var i in window['serverCountries']) {
			var c = window['serverCountries'][i];
			if (c && c.branching) {
				var b = c.branching.find(function (item) {
					return item && item.branch === branch;
				});

				if (b) {
					if (b.status === '2') {
						window['unsupportedCountries'].push(c.name);
					} else if (b.status === '3') {
						window['disallowedCountries'].push(c.name);
					}
				}
			}
		}
	}

	function startRegistrationLive() {
	    $(document).on('localizeParsley', function() {
	        localizeParsleyMessages();
	        updateYearsRange();
	    });

		window.history.pushState({step: 1}, `Step ${1}`);
		window.onpopstate = (e) => {
			if (e && e.state && e.state.step) {
				e.preventDefault();
				goToStep(e.state.step, true);
			} else {
				window.history.go(1)
			}
		}

	    localizeParsleyMessages();
	    updateYearsRange();
		toggleRefferControls();
		toggleAsknowledge();

		$('.wp-icm-open-account').on('click', '.process_line', function(e) {
			if ($(this).is('.complete')) {
				let currentStep = $('.wp-icm-open-account .active_step').data('n')
				let backToStep = $(this).data('n')
				if (backToStep && backToStep < currentStep) {
					goToStep(backToStep, true/*forceBack*/)
				}
			}
		});

	    $('.wp-icm-open-account.live .reg_overlay').fadeOut(0);
	    window.console.log = function() {};
	    (function($) {
	        $.fn.removeClassWild = function(mask) {
	            return this.removeClass(function(index, cls) {
	                var re = mask.replace(/\*/g, '\\S+');
	                return (cls.match(new RegExp('\\b' + re + '', 'g')) || []).join(' ');
	            });
	        };
	    })(jQuery);

	    $(document).on('focusin focusout', '.wp-icm-open-account.live .field-input', function(event) {
	        var $parent = $(event.target).parent();
	        if (event.type == 'focusin') {
	            $parent.addClass('is-focused has-label');
	        } else {
	            if (!$(event.target).val().length) {
	                $parent.removeClass('has-label');
	            }
	            $parent.removeClass('is-focused');
				if ($(event.target).is('.rounded_el')) {
					setTimeout(function () {
						if ($(event.target).is('[data-orig]')) {
							$parent.addClass('has-label');
						}
					}, 300);
				}
			}
	    });

	    // btns

        $(document).on('keydown', function(e) {
			if (e.which == 13) {
				e.preventDefault();
                return false;
			}
        });

	    (function(window) {
	        "use strict";

	        if ("ontouchstart" in window) {
	            document.body.addEventListener("touchstart", show, false);
	        }
	        document.body.addEventListener("mousedown", show, false);

	        function show(e) {
	            var element = null;
	            var target = e.target || e.srcElement;
	            while (target.parentElement !== null) {
	                if (target.classList && target.classList.contains("wave-effect")) {
	                    element = target;
	                    break;
	                }
	                target = target.parentElement;
	            }
	            if (element === null) {
	                return false;
	            }
	            var wave = document.createElement("div");
	            wave.className = "wave";
	            element.appendChild(wave);

	            var position = getRelativeEventPostion(element, e);
	            var radius = getRadius(element, position);
	            var scale = "scale(1)";
	            wave.style.left = (position.x - radius) + "px";
	            wave.style.top = (position.y - radius) + "px";
	            wave.style.width = (radius * 2) + "px";
	            wave.style.height = (radius * 2) + "px";
	            wave.style["-webkit-transform"] = scale;
	            wave.style["-moz-transform"] = scale;
	            wave.style["-ms-transform"] = scale;
	            wave.style["-o-transform"] = scale;
	            wave.style.transform = scale;

	            element.addEventListener("mouseup", hide, false);
	            element.addEventListener("mouseleave", hide, false);
	            if ("ontouchstart" in window) {
	                document.body.addEventListener("touchend", hide, false);
	            }
	        }

	        function hide(e) {
	            var element = this;
	            var wave = null;
	            var waves = element.getElementsByClassName("wave");
	            if (waves.length > 0) {
	                wave = waves[waves.length - 1];
	            } else {
	                return false;
	            }
	            wave.style.opacity = 0;

	            setTimeout(function() {
	                try {
	                    element.removeChild(wave);
	                } catch (e) {
	                    return false;
	                }
	            }, 2000);
	        }

	        function getRelativeEventPostion(element, e) {
	            var offset = {
	                top: element.getBoundingClientRect().top + window.pageYOffset - element.clientTop,
	                left: element.getBoundingClientRect().left + window.pageXOffset - element.clientLeft
	            };
	            return {
	                y: e.pageY - offset.top,
	                x: e.pageX - offset.left
	            };
	        }

	        function getRadius(element, position) {
	            var w = Math.max(position.x, element.clientWidth - position.x);
	            var h = Math.max(position.y, element.clientHeight - position.y);
	            return Math.ceil(Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)));
	        }

	    })(window);

	    $('.wp-icm-open-account.live .field-input').each(function() {
	        if ($(this).val().length)
	            $(this).parent().addClass('has-label');
	    });

	    $('.wp-icm-open-account.live .fields_individual').fadeIn().addClass('firstClick');
	    $('.wp-icm-open-account.live .birthdate input').on('keyup change', function() {
	        var fieldName = $(this).data('fieldName'),
	            field = $('.wp-icm-open-account.live .birthdate input[data-field-name="' + fieldName + '"]'),
	            fieldOrig = $(this).attr('data-orig'),
	            fieldVal = $(this).val();
	        field.val(fieldVal);
	        if (fieldOrig) {
	            field.attr('data-orig', fieldOrig);
	        }
	        if (fieldVal)
	            field.parent().addClass('has-label');
	    });
	    $('.wp-icm-open-account.live .select_btns_group .select_btn').each(function() {
	        var inType;
	        if ($(this).parent().hasClass('single_select')) {
	            inType = 'radio';
	        } else if ($(this).parent().hasClass('multi_select')) {
	            inType = 'checkbox';
	        }
	        $(this).append('<input type="' + inType + '" data-parsley-multiple="' + $(this).data('id') + '" name="' + $(this).data('id') + '" value="' + $(this).data('value') + '" required="">');
	    });

	    $('.wp-icm-open-account.live .australian_test_wrap .radio_btns_group').each(function(i) {
	        $(this).attr('data-name', 'q' + i);
	    });
	    $('.wp-icm-open-account.live .australian_test_wrap label').each(function(i) {
	        var fieldName = $(this).parent().data('name'),
	            fieldValue = $(this).html();
	        $(this).attr('for', 'test_' + i).before('<input type="radio" class="radio au_test" id="test_' + i + '" name="' + fieldName + '" value="q' + i + '">');
	    });
	    $('.wp-icm-open-account.live .australian_test_wrap label:not(:last-child)').after('<br><br>');

	    $('.wp-icm-open-account.live .invitation-guid').hide();
	    $('.wp-icm-open-account.live .info').hide();

		function showIslamicCheckbox () {
			// check from the countries-branching settings is Islamic
			// account opening allowed and show it (or no when restricted)
			var countryObject;
			var $countriesInput = $('.wp-icm-open-account.live #countries');
			if ($countriesInput && $countriesInput.val()) {
				countryObject = getCountryObjectByName($countriesInput.attr('data-orig'));
			}
			var branch = $('.wp-icm-open-account.live input#branch_id').attr('data-orig');
			if (countryObject && branch && countryObject.branching) {
				var allowedIslamic = false;
				if (countryObject.branching.find(function (cb) { return (cb.branch === branch && cb.islamic === true); })) {
					$('.wp-icm-open-account.live .islamic_check').show();
					$('.wp-icm-open-account.live .islamic_check input').removeAttr('required');
					$('.wp-icm-open-account.live .islamic_check input')[0].checked = false;
				} else {
					hideIslamicCheckbox();
				}
			}
		}

		function hideIslamicCheckbox () {
			$('.wp-icm-open-account.live .islamic_check').hide();
			$('.wp-icm-open-account.live .islamic_check input').removeAttr('required');
			$('.wp-icm-open-account.live .islamic_check input')[0].checked = false;
		}

		function addJointSteps(branch) {
            branch = branch || $('.wp-icm-open-account.live input#branch_id').attr('data-orig');
	        $('.wp-icm-open-account.live #step_5 .next_btn button.start-trading-button').html($('.reg_form_live_step3_next').text()).attr('type', 'button');
	        $('.wp-icm-open-account.live .register_process_wrap').addClass('with_joint_steps');
			$('.wp-icm-open-account.live.steps_container .process_line[data-n="6"]').before($('.wp-icm-open-account.live.steps_container .process_line[data-n="1"], .wp-icm-open-account.live.steps_container .process_line[data-n="3"], .wp-icm-open-account.live.steps_container .process_line[data-n="4"], .wp-icm-open-account.live.steps_container .process_line[data-n="5"]').clone().addClass('joint_steps').removeClass('current, complete'));

	        $('.wp-icm-open-account.live:not(.steps_container) .process_line[data-n="6"]').before($('.wp-icm-open-account.live:not(.steps_container) .process_line[data-n="1"], .wp-icm-open-account.live:not(.steps_container) .process_line[data-n="3"], .wp-icm-open-account.live:not(.steps_container) .process_line[data-n="4"], .wp-icm-open-account.live:not(.steps_container) .process_line[data-n="5"]').clone().addClass('joint_steps').removeClass('current, complete'));
			$('.wp-icm-open-account.live .process_animation').before($('.wp-icm-open-account.live .register_form[data-n="1"],.register_form[data-n="3"],.register_form[data-n="4"],.register_form[data-n="5"]').clone().addClass('joint_steps_form'));
	        $('.wp-icm-open-account.live .joint_steps[data-n="1"]').find('.process_line_text').html($('.reg_form_live_joint_personal_details').text());
	        $('.wp-icm-open-account.live .joint_steps[data-n="3"]').find('.process_line_text').html($('.reg_form_live_joint_account_configuration').text());
	        if(window['currentBranch'] === '1'){
				$('.wp-icm-open-account.live .joint_steps[data-n="4"]').find('.process_line_text').html($('.reg_form_live_joint_questions').text());
				$('.wp-icm-open-account.live .joint_steps[data-n="5"]').find('.process_line_text').html($('.reg_form_live_joint_declaration').text());
			}else{
				$('.wp-icm-open-account.live .joint_steps[data-n="5"]').find('.process_line_text').html($('.reg_form_live_joint_declaration').text());
			}

	        $('.wp-icm-open-account.live .joint_steps_form[data-n="1"]').append($('.wp-icm-open-account.live .fields_individual').clone()).append($('.wp-icm-open-account.live .nationality').clone()).append($('.wp-icm-open-account.live .trulioo_fields').clone()).append($('.wp-icm-open-account.live .signatory_tin').clone()).append($('.wp-icm-open-account.live .reffer_check').clone()).append($('.wp-icm-open-account.live .reffer_id').clone());
			$('.wp-icm-open-account.live .joint_steps_form').find('div').each(function() {
				var oldId = $(this).attr('id'),
				    newId = 'joint_' + oldId;
				if (typeof oldId != 'undefined')
	                $(this).attr('id', newId);
			})
			$('.wp-icm-open-account.live .joint_steps_form').find('ul').each(function() {
				var oldId = $(this).attr('id'),
				    newId = 'joint_' + oldId;
				if (typeof oldId != 'undefined')
	                $(this).attr('id', newId);
			})
	        $('.wp-icm-open-account.live .joint_steps_form').find('input').val('').each(function() {
	            var oldName = $(this).attr('name'),
	                newName = 'joint_' + oldName,
	                oldParsleyMultiple = $(this).attr('data-parsley-multiple'),
	                newParsleyMultiple = 'joint_' + oldParsleyMultiple,
	                oldId = $(this).attr('id'),
	                newId = 'joint_' + oldId;
	            if ($(this).parent().attr('data-id')) {
	                $(this).parent().attr('data-id', 'joint_' + $(this).parent().attr('data-id'));
	            }
	            $(this).attr({
	                'name': newName
	            }).prop('checked', false).parsley().reset();
	            $(this).removeAttr('value').parent().removeClass('has-label');
	            if (typeof oldParsleyMultiple != 'undefined')
	                $(this).attr('data-parsley-multiple', newParsleyMultiple);
	            $(this).parent().removeClass('error').removeClass('success');
	            if (typeof oldId != 'undefined')
	                $(this).attr('id', newId);
	            if (newId == 'joint_birth_day' || newId == 'joint_birth_year' || newId == 'joint_city' || newId == 'joint_zip_code')
	                $(this).val('').parent().addClass('ab_fix1');
	            if (newId == 'joint_address' || newId == 'joint_state')
	                $(this).parent().removeClass('ab_fix1');
	            if ($(this).attr('name') == 'joint_news_subscription')
	                $(this).prop('checked', 'checked');
	            if ($(this).hasClass('au_test')) {
	                var val = $(this).next('label').data('value');
	                $(this).val(val);
	            }
	        }).parent().find('label').each(function() {
	            var newFor = 'joint_' + $(this).attr('for');
	            $(this).attr('for', newFor);
	        });
	        $('.wp-icm-open-account.live .joint_steps_form #australian_test_container').attr('id', 'joint_australian_test_container');
	        $('.wp-icm-open-account.live .joint_steps_form .birthdate').removeClass('birthdate').addClass('joint_birthdate');
	        $('.wp-icm-open-account.live .joint_steps_form .reffer_check').removeClass('reffer_check').addClass('joint_reffer_check');
	        $('.wp-icm-open-account.live .joint_steps_form .reffer_id').removeClass('reffer_id').addClass('joint_reffer_id').find('.ab_fix1').removeClass('ab_fix1').addClass('ab_fix2');
	        $('.wp-icm-open-account.live .notSearched .options_list').each(function() {
	            if (!window['landingPage']) {
	                $(this).mCustomScrollbar({
	                    theme: "dark",
	                    autoExpandScrollbar: false,
	                    autoHideScrollbar: false,
	                    scrollButtons: { enable: false },
	                    scrollInertia: 0
	                });
	            }
	        });

			$('.wp-icm-open-account.live.steps_container .process_line').each(function(i) {
				if(i>=5){
					if (i === 5) {
						// $('.steps_container .wp-icm-open-account .live').children('process_line').eq(4).display('none');
					}
					// $('.steps_container .wp-icm-open-account .live > #process_line_step4_phone').display('none');
					$(this).attr('data-n', i).find('.step_icon').html(`${i-1} <div data-edit="${i}" class="modify-step"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z" data-parsley-id="19"></path></svg></div>`);
				}else{
					$(this).attr('data-n', i).find('.step_icon').html(`${i} <div data-edit="${i}" class="modify-step"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z" data-parsley-id="19"></path></svg></div>`);
				}
			});
			$('.wp-icm-open-account.live:not(.steps_container) .process_line').each(function(i) {
				if((window['currentBranch'] === '2'|| window['currentBranch'] === '3'|| window['currentBranch'] === '4') && i>=5){
					$(this).attr('data-n', i).find('.step_icon').html(`${i-1} <div data-edit="${i}" class="modify-step"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z" data-parsley-id="19"></path></svg></div>`);
				}else{
					$(this).attr('data-n', i).find('.step_icon').html(`${i} <div data-edit="${i}" class="modify-step"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z" data-parsley-id="19"></path></svg></div>`);
				}
			});
			$('.wp-icm-open-account.live .process_line[data-n="6"]').removeClass('current');
	        $('.wp-icm-open-account.live .register_form ').each(function(i) {
	            var j = i + 1;
	            $(this).attr({
	                'data-n': j,
	                'id': 'step_' + j
	            });
	        });

	        $('.wp-icm-open-account.live .joint_steps_form .select_btns_group .select_btn input').each(function() {
	            var inVal = $(this).parent().data('value');
	            $(this).val(inVal);
	        });
	        $('.wp-icm-open-account.live .searchDropdown.notSearched input').prop('readonly', 'readonly');
	        $('.wp-icm-open-account.live #step_9 .next_btn button.start-trading-button').html('submit').attr('type', 'submit');
	        $('.wp-icm-open-account.live #step_6 .fields_individual').removeAttr('class style').addClass('new_joint_fields ');
	        $('.wp-icm-open-account.live #step_6 .joint_reffer_id').after($('.wp-icm-open-account.live #step_6 .el_wrap.next_btn'));
	        $('.wp-icm-open-account.live .register_form').each(function(index, section) {
	            $(section).find('input').attr({
	                'data-parsley-group': 'block-' + index,
	                'autocomplete': 'off',
	                'data-parsley-validation-threshold': '0',
	                'data-parsley-trigger': 'keyup change'
	            });
	            $(section).find('input[type="checkbox"]').removeAttr('required');
	            $('.wp-icm-open-account.live .joint_steps_form .australian_test_wrap input').removeAttr('required').each(function(i) {
	                $(this).val('q' + i);
	            });
	            $('.wp-icm-open-account.live #reffer_id, .wp-icm-open-account.live #joint_reffer_id, .wp-icm-open-account.live #invitation_guid, .wp-icm-open-account.live #info, .wp-icm-open-account.live #joint_invitation_guid, .wp-icm-open-account.live #joint_info, .wp-icm-open-account.live #busaddr, .wp-icm-open-account.live #qq_id, .wp-icm-open-account.live #joint_qq_id, .wp-icm-open-account.live #qq_id_corporate').removeAttr('required');
	            $('.wp-icm-open-account.live .fields_corporate input').removeAttr('required');

	        });
	        $('.wp-icm-open-account.live form').parsley({
	            'data-parsley-focus': 'none'
	        });

			$('input#joint_cn_name').on('change', function() {handleChineseNameInput('joint')});

	        $('.wp-icm-open-account.live #step_6 .next_btn').prepend($('<button type="button" data-to="5" class="btn step-back">BACK</button>'));
	        $('.wp-icm-open-account.live #step_7 .next_btn button.step-back').text('BACK').attr('data-to', '6');
	        $('.wp-icm-open-account.live #step_8 .next_btn button.step-back').text('BACK').attr('data-to', '7');
	        $('.wp-icm-open-account.live #step_9 .next_btn button.step-back').text('BACK').attr('data-to', '8');

			window['jointAdded'] = true

			// adding ID's for automation testing WEB-1928
			$('.wp-icm-open-account.live #step_5 .next_btn button.step-back').attr('id','reg_form_live_joint_step5_back');
			$('.wp-icm-open-account.live #step_6 .next_btn button.step-back').attr('id','reg_form_live_joint_step6_back');
			$('.wp-icm-open-account.live #step_7 .next_btn button.step-back').attr('id','reg_form_live_joint_step7_back');
			$('.wp-icm-open-account.live #step_8 .next_btn button.step-back').attr('id','reg_form_live_joint_step8_back');
			$('.wp-icm-open-account.live #step_9 .next_btn button.step-back').attr('id','reg_form_live_joint_step9_back');
			$('.wp-icm-open-account.live #step_5 .next_btn button.start-trading-button').attr('id','reg_form_live_joint_step5_next');
			$('.wp-icm-open-account.live #step_6 .next_btn button.start-trading-button').attr('id','reg_form_live_joint_step6_next');
			$('.wp-icm-open-account.live #step_7 .next_btn button.start-trading-button').attr('id','reg_form_live_joint_step7_next');
			$('.wp-icm-open-account.live #step_8 .next_btn button.start-trading-button').attr('id','reg_form_live_joint_step8_next');
			$('.wp-icm-open-account.live #step_9 .next_btn button.start-trading-button').attr('id','reg_form_live_joint_step9_submit');
	    }

	    function removeJointSteps() {
			$('input#joint_cn_name').off('change');

	        $('.wp-icm-open-account.live .register_process_wrap').removeClass('with_joint_steps');
	        $('.wp-icm-open-account.live .joint_steps, .wp-icm-open-account.live .joint_steps_form').remove();
	        $('.wp-icm-open-account.live #step_5 .next_btn button.start-trading-button').html($('.wp-icm-open-account.live #step_5 .start-trading-button').text()).attr('type', 'submit');
            $('.wp-icm-open-account.live.steps_container .process_line').each(function(i) {
	            $(this).attr('data-n', i).find('.step_icon').html(`${i} <div data-edit="${i}" class="modify-step"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z" data-parsley-id="19"></path></svg></div>`);
            });
            $('.wp-icm-open-account.live:not(.steps_container) .process_line').each(function(i) {
	            $(this).attr('data-n', i).find('.step_icon').html(`${i} <div data-edit="${i}" class="modify-step"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z" data-parsley-id="19"></path></svg></div>`);
            });
            $('.wp-icm-open-account.live .register_form ').each(function(i) {
	            var j = i + 1;
	            $(this).attr({
	                'data-n': j,
	                'id': 'step_' + j
	            });
	        });
	    }

	    $('.wp-icm-open-account.live .registered_address_fields input').on('change keyup', function() {
	        if ($('.wp-icm-open-account.live #busaddr').prop('checked') == true) {
	            var val = $(this).val(),
	                fieldName = $(this).data('fieldName');
	            $('.wp-icm-open-account.live input[name="business_' + fieldName + '"]').val(val).parsley().validate();
	            if (val) {
	                $('.wp-icm-open-account.live input[name="business_' + fieldName + '"]').parent().addClass('has-label');
	            } else {
	                $('.wp-icm-open-account.live input[name="business_' + fieldName + '"]').parent().removeClass('has-label');
	            }
	        }
	    });

	    updateCustomValidators();

	    $('.wp-icm-open-account.live .searchDropdown.searched input').after('<ul class="options_list"></ul>');
	    $('.wp-icm-open-account.live .searchDropdown.notSearched input').prop('readonly', 'readonly');
	    if (!window['landingPage']) {
	        $('.wp-icm-open-account.live .searchDropdown.notSearched .options_list').mCustomScrollbar({
	            theme: "dark",
	            autoExpandScrollbar: false,
	            autoHideScrollbar: false,
	            scrollButtons: { enable: false },
	            scrollInertia: 0
	        });
	    }

	    function countriesLoadedAutocomplete(countries, evType, list, sVal) {
	    	let added = [];
	        $.each(countries, function(value, item) {
				var cName = item.name;
				var cCode = item.code;

	            if (!added.includes(cCode)) {
					added.push(cCode);
					if (evType == 1) {
						list.addClass('newlist');
						if (cCode === 'XX') {
							list.append("<li class='list-separator'>&nbsp;</li>");
						} else {
							list.append("<li id='reg_form_country_"+ cCode.toLowerCase() +"' data-ml='" + 'reg_form_country_' + cCode + "' data-cn='" + cName /*item.name*/ + "' data-cc='" + cCode + "'><span class='flag flag-" + (item.code).toLowerCase() + "' ></span>" + cName /*item.name*/ + "</li>");
						}
					} else {
						list.removeClass('newlist');
						if (cName.toLowerCase().indexOf(sVal.toLowerCase()) >= 0) {
							if (cCode === 'XX') {
								list.append("<li class='list-separator'>&nbsp;</li>");
							} else {
								list.append("<li id='reg_form_country_"+ cCode.toLowerCase() +"'  data-ml='" + 'reg_form_country_' + cCode + "' data-cn='" + cName /*item.name*/ + "' data-cc='" + cCode + "'><span class='flag flag-" + (item.code).toLowerCase() + "' ></span>" + cName /*item.name*/ + "</li>");
							}
						}
					}
				}
	        });
	        if (!window['landingPage']) {
	            setTimeout(function() {
	                list.mCustomScrollbar({
	                    theme: "dark",
	                    autoExpandScrollbar: false,
	                    autoHideScrollbar: false,
	                    scrollButtons: { enable: false },
	                    scrollInertia: 500,
	                    live: "once"
	                });
	            }, 0);
	        }
	    }

		function handleKeyDown (event, $target, $list, action) {
			event.preventDefault();
			event.stopPropagation();
			let $selected = $list.find('li.selected');
			switch (action) {
				case 0:
					// click on selected (if present) item
					if ($selected.length) {
						$selected.click();
						setTimeout(() => {
							$('#first_name').focus();
						}, 200)
					}
					break;
				default:
					// change selected item
					let $arr = $list.find('li');
					let indexNow = $.inArray($selected.length ? $selected[0] : null, $arr);
					let newIndex = indexNow += action;
					if (newIndex > $arr.length - 1) {
						newIndex = $arr.length - 1;
					}
					if (newIndex < 0) {
						newIndex = 0;
					}
					if ($selected.length) {
    					$selected.toggleClass('selected', false);
					}
					let $nextSelected = $($arr.get(newIndex));
					$nextSelected.toggleClass('selected', true);
					if ($nextSelected.is('.list-separator')) {
						handleKeyDown (event, $target, $list, action);
						return;
					}
					try {
						$list.mCustomScrollbar("scrollTo", $nextSelected[0].offsetTop);
					} catch (e) {}
			}
		}

	    $(document).on('input focusin focus keydown', '.wp-icm-open-account.live .searchDropdown input', function(event) {
			var sVal = $(this).val().toLowerCase();
	        var list = $(this).parent().find('.options_list');
			if (event.type == 'keydown') {
				if (event.keyCode == 13/*ENTER*/) {
					handleKeyDown(event, $(this), list, 0);
					return false;
				}
				if (event.keyCode == 38/*ArrowUP*/) {
					handleKeyDown(event, $(this), list, -1);
					return false;
				}
				if (event.keyCode == 40/*ArrowDOWN*/) {
					handleKeyDown(event, $(this), list, 1);
					return false;
				}
			}
	        var evType;
	        if (event.type == 'focus' || event.type == 'focusin') {
	            evType = 1;
	            var save_this = $(this);
	            if (window.selectTimeout) {
	                clearTimeout(window.selectTimeout);
	            }
	            window.selectTimeout = setTimeout(function() {
	                save_this.select();
	            }, 100);
	        }
	        if (list.hasClass('searched'))
	            if (!window['landingPage']) {
	                list.mCustomScrollbar("destroy");
	            }
	        if ($(this).is('.searchDropdown.searched input')) {
	            if (!window['landingPage']) {
	                list.mCustomScrollbar("destroy");
	            }
	            list.find('li').remove();

	            if (window['serverCountries']) {
					if ($(this).is('#nationality') || $(this).is('#joint_nationality')) {
						countriesLoadedAutocomplete(window['allAvailableCountries'], evType, list, sVal);
					} else {
						countriesLoadedAutocomplete(window['serverCountries'], evType, list, sVal);
					}
	            }
	        }
	    });

	    function getAccountType() {
	        var ar = serializeFormToArray();
	        var regType = 'individual';
	        for (var i = 0; i < ar.length; i++) {
	            var fieldName = ar[i].name;
	            var fieldValue = ar[i].value;
	            if (fieldName == 'reg_type' && fieldValue) {
	                regType = fieldValue;
	                break;
	            }
	        }
	        return regType;
	    }
		function getTruliooAnswers(accType){
			var prefix = accType === "individual" ? "" : "joint_";
			var truliooAnswers = {}
			for(const [category, fields ] of Object.entries(window[`${prefix}truliooVerificationFields`])){
				if( category === 'PersonInfo' ){
					truliooAnswers['PersonInfo'] = {
						"DayOfBirth":parseInt($(`.wp-icm-open-account.live input#${prefix}birth_day`).val()),
						"FirstGivenName":$(`.wp-icm-open-account.live input#${prefix}first_name`).attr('data-orig'),
						"FirstSurName":$(`.wp-icm-open-account.live input#${prefix}last_name`).attr('data-orig'),
						"MonthOfBirth":parseInt($(`.wp-icm-open-account.live input#${prefix}birth_month`).attr('data-orig'))+1,
						"YearOfBirth":parseInt($(`.wp-icm-open-account.live input#${prefix}birth_year`).val())
					}
					for(const [key, value] of Object.entries(fields)){
						if( key === 'AdditionalFields'){
							truliooAnswers['PersonInfo'][key] = { }

							switch ($(`#${prefix}countries`).val()) {
								case 'China':
									truliooAnswers['PersonInfo'][key]['FullName'] = $(`.wp-icm-open-account.live input#${prefix}last_name`).attr('data-orig') + $(`.wp-icm-open-account.live input#${prefix}first_name`).attr('data-orig')
									break
								default:
									truliooAnswers['PersonInfo'][key]['FullName'] = $(`.wp-icm-open-account.live input#${prefix}first_name`).attr('data-orig') + ' ' + $(`.wp-icm-open-account.live input#${prefix}last_name`).attr('data-orig')
							}
						}
					}
				}else if( category === 'Location' ){
					truliooAnswers['Location'] = {
						"City": $(`.wp-icm-open-account.live #${prefix}city`).val(),
						"PostalCode": $(`.wp-icm-open-account.live #${prefix}zip_code`).val(),
						"StateProvinceCode": $(`.wp-icm-open-account.live #${prefix}state`).val(),
					}
					for(const [key, value] of Object.entries(fields)){
						// if( key !== 'City' && key !== 'PostalCode' && key !== 'StateProvinceCode' && key !== 'AdditionalFields'){
						// 	truliooAnswers['Location'][key] = window[`${prefix}truliooVerificationFields`]['Location'][key] === 0 ? parseInt($(`.wp-icm-open-account.live input#${prefix}${key}`).val()):$(`.wp-icm-open-account.live input#${prefix}${key}`).val()
						// }
						if( key === 'Suburb'){
							truliooAnswers['Location'][key] = $(`.wp-icm-open-account.live #${prefix}city`).val();
						}
						if( key === 'StreetName'){
							truliooAnswers['Location'][key] = $(`.wp-icm-open-account.live #${prefix}address`).val();
						}
						if( key === 'AdditionalFields'){
							truliooAnswers['Location'][key] = { }
							truliooAnswers['Location'][key]['Address1'] = $(`.wp-icm-open-account.live input#${prefix}address`).val()
						}
					}
				}else if( category  === 'NationalIds' ){
					if($(`.wp-icm-open-account.live #${prefix}identity-wrap #${prefix}nationalId`).val()) {
						truliooAnswers['NationalIds']=[
							{
								 "Number": $(`.wp-icm-open-account.live #${prefix}identity-wrap #${prefix}nationalId`).val(),
								 "Type": fields['Type']
							}
					   ]
					}
				}else if(category  === 'DriverLicence') {
					if($(`.wp-icm-open-account.live #${prefix}identity-wrap #${prefix}driverLicence`).val()) {
						truliooAnswers['DriverLicence']= {
							"Number": $(`.wp-icm-open-account.live #${prefix}identity-wrap #${prefix}driverLicence`).val()
						}
					}
				}else if(category  === 'Passport') {
					if($(`.wp-icm-open-account.live #${prefix}identity-wrap #${prefix}passport`).val()) {
						truliooAnswers['Passport']= {
							"Number": $(`.wp-icm-open-account.live #${prefix}identity-wrap #${prefix}passport`).val()
						}
					}
				}else if(category  === 'CountrySpecific') {
					truliooAnswers[category] = {};
					for (const [k, v] of Object.entries(fields)) {
						if (k === 'AU') {
							truliooAnswers[category][k] = {};
							if($(`.wp-icm-open-account.live #${prefix}identity-wrap #${prefix}driverLicenceState`).val()) {
								truliooAnswers[category][k]['DriverLicenceState'] = $(`.wp-icm-open-account.live #${prefix}identity-wrap #${prefix}driverLicenceState`).val()
							}
							if($(`.wp-icm-open-account.live #${prefix}identity-wrap #${prefix}driverLicenceCardNumber`).val()) {
								truliooAnswers[category][k]['DriverLicenceCardNumber'] = $(`.wp-icm-open-account.live #${prefix}identity-wrap #${prefix}driverLicenceCardNumber`).val()
							}
						}
					}
				}else{
					if (Object.keys(fields).length > 0) {
						truliooAnswers[category] = {};
						for(const [key, value] of Object.entries(fields)){
							truliooAnswers[category][key] = window[`${prefix}truliooVerificationFields`][category][key] === 0 ? parseInt($(`.wp-icm-open-account.live input#${prefix}${key}`).val()):$(`.wp-icm-open-account.live input#${prefix}${key}`).val()
						}
					}
				}
			}

			// If Trulioo requires at least one ID but user supplies none, skip Trulioo verification
			let willUseTrulioo = false;
			if (
				(!window[`${prefix}truliooVerificationFields`]['NationalIds'] && !window[`${prefix}truliooVerificationFields`]['Passport'] && !window[`${prefix}truliooVerificationFields`]['DriverLicence']) ||
				(window[`${prefix}truliooVerificationFields`]['NationalIds'] && truliooAnswers['NationalIds'] && truliooAnswers['NationalIds'][0]['Number']) ||
				(window[`${prefix}truliooVerificationFields`]['Passport'] && truliooAnswers['Passport']) ||
				(window[`${prefix}truliooVerificationFields`]['DriverLicence'] && truliooAnswers['DriverLicence'])
			) {
				willUseTrulioo = true;
			}

			return willUseTrulioo ? truliooAnswers : undefined;
		}
		function getAdditionalAnswers(){
			let additionalAnswers = []
			if (getAccountType()  == 'joint'){
				var a = []
				var b = []

				var radioQuestionsNodes = document.querySelectorAll('div.select_btn_large.selected')
				let tem = []
				radioQuestionsNodes.forEach(x=>{
					var answer = {
						TraitID: x.getAttribute('question-id'),
						TraitValueID:x.getAttribute('answer-id'),
						TraitTextValue:""
					}
					tem.push(answer)
				})
				a = tem.slice(0,tem.length/2)
				b = tem.slice(tem.length/2,tem.length)
				var dropdownQuestionNodes = document.querySelectorAll('input.additional_dd')
				tem = []
				dropdownQuestionNodes.forEach(x=>{
					var answers_obj = JSON.parse(x.getAttribute('answers'))
					var answer = {
						TraitID: x.getAttribute('id').replace('joint_',''),
						TraitValueID: answers_obj[x.value.replace(/>/g,'%').replace(/ /g,'!')],
						TraitTextValue:""
					}
					tem.push(answer)
				})
				a = a.concat(tem.slice(0,tem.length/2))
				b = b.concat(tem.slice(tem.length/2,tem.length))
				var inputQuestionNodes = document.querySelectorAll('input.additional_ip')
				tem = []
				inputQuestionNodes.forEach(x=>{
					var answer = {
						TraitID: x.getAttribute('id').replace('joint_',''),
						TraitValueID:x.getAttribute('answer-id'),
						traitTextValue:x.value
					}
					tem.push(answer)
				})
				a = a.concat(tem.slice(0,tem.length/2))
				b = b.concat(tem.slice(tem.length/2,tem.length))
				additionalAnswers = a.concat(b)
			}else{
				var radioQuestionsNodes = document.querySelectorAll('div.select_btn_large.selected')
				radioQuestionsNodes.forEach(x=>{
					var answer = {
						TraitID: x.getAttribute('question-id'),
						TraitValueID:x.getAttribute('answer-id'),
						TraitTextValue:""
					}
					additionalAnswers.push(answer)
				})
				var dropdownQuestionNodes = document.querySelectorAll('input.additional_dd')
				dropdownQuestionNodes.forEach(x=>{
					var answers_obj = JSON.parse(x.getAttribute('answers'))
					var answer = {
						TraitID: x.getAttribute('id').replace('joint_',''),
						TraitValueID: answers_obj[x.value.replace(/>/g,'%').replace(/ /g,'!')],
						TraitTextValue:""
					}
					additionalAnswers.push(answer)
				})
				var inputQuestionNodes = document.querySelectorAll('input.additional_ip')
				inputQuestionNodes.forEach(x=>{
					var answer = {
						TraitID: x.getAttribute('id'),
						TraitValueID:x.getAttribute('answer-id'),
						traitTextValue:x.value
					}
					additionalAnswers.push(answer)
				})
			}

			return additionalAnswers
		}

		$(document).on('click', '#reg_form_live_account_type_corporate', function(event) {
			var $countries2Input = $('.wp-icm-open-account.live #countries2');
			if ($countries2Input.attr('data-orig') !== 'Canada') {
				$('.wp-icm-open-account.live #states2').attr('data-parsley-excluded', 'true');
			}

			var $countries2Input = $('.wp-icm-open-account.live #registered_countries');
			if ($countries2Input.attr('data-orig') !== 'Canada') {
				$('.wp-icm-open-account.live #registered_states').attr('data-parsley-excluded', 'true');
			}

			var $countries2Input = $('.wp-icm-open-account.live #business_countries');
			if ($countries2Input.attr('data-orig') !== 'Canada') {
				$('.wp-icm-open-account.live #business_states').attr('data-parsley-excluded', 'true');
			}
		});

	    $(document).on('click', '.wp-icm-open-account.live', function(event) {
	        var target = $(event.target);
	        if (target.parent().hasClass('select_btn')) {
	            target = target.parent();
	        }

			let nodeName =  target.children('span').html();
			if (nodeName === 'Joint') {
				var node3 = document.querySelector('.process_line#process_line_step4_phone')
				node3.style.display = 'none';

			}

	        if (target.hasClass('select_btn')) {
	            var step = $('.wp-icm-open-account.live .active_step');
	            if (target.parent().hasClass('trading_exp')) {
	                var ar = serializeFormToArray();
	                function fillQuestionsByAccountType(regType) {
	                    var questions = window['serverSuitableTraits'][regType];
	                    var stepId = $('.wp-icm-open-account.live .active_step').data('n');
	                    var $container = $('#australian_test_container');
	                    if (stepId == 9) {
	                        $container = $('#joint_australian_test_container');
	                    }
	                    $container.html('');
	                    var $skipButton = $('<div class="select_btn rounded_el skip-test-button skip">Complete test later</div>');
	                    var $testContent = $('<div class="test-content"></div>');
	                    $container.append($skipButton);
	                    $container.append($testContent);

	                    $skipButton.on('click', function() {
	                        $skipButton.toggleClass('skip', !$skipButton.hasClass('skip'));
	                        $skipButton.html($skipButton.hasClass('skip') ? "Complete test later" : "Take the test");
	                        if (!$skipButton.hasClass('skip')) {
	                            $testContent.hide();
	                        } else {
	                            $testContent.show();
	                        }
	                    });

	                    var createOneQuestion = function(qData, index) {
	                        var id = "q_" + qData['Id'];
	                        if (stepId == 9) {
	                            id = "joint_q_" + qData['Id'];
	                        }
	                        var q = qData['Name'];
	                        var az = qData['Values'];
	                        if (!az['WDictionary'] || !az['WDictionary'].length) {
	                            return '';
	                        } else {
	                            az = qData['Values']['WDictionary'];
	                        }
	                        if (q && az && az.length) {
	                            var $c = $('<div class="radio_btns_group" data-name="' + id + '"></div>');
	                            var $q = $('<div class="test_ask"><h3>Q' + index + '. ' + q + '</h3></div>');
	                            if (index === 1) {
	                                $q.addClass('first_test_ask');
	                            }
	                            $c.append($q);
	                            for (var i = 0, len = az.length, $a; i < len; i++) {
	                                $a = $('<br /><input type="radio" class="radio au_test" id="test_' + id + '_' + (i + 1) + '" name="' + id + '" value="' + az[i]['ID'] + '"><label for="test_' + id + '_' + (i + 1) + '">' + az[i]['Name'] + '</label><br />');
	                                $c.append($a);
	                            }
	                            return $c;
	                        }
	                        return '';
	                    };
	                    if (questions && questions.length) {
	                        function shuffle(a) {
	                            var j, x, i;
	                            for (i = a.length; i; i--) {
	                                j = Math.floor(Math.random() * i);
	                                x = a[i - 1];
	                                a[i - 1] = a[j];
	                                a[j] = x;
	                            }
	                        }
	                        shuffle(questions);
	                        for (var i = 0, len = questions.length; i < len; i++) {
	                            $testContent.append(createOneQuestion(questions[i], i + 1));
	                            if (i === len - 1) {
	                                $testContent.append('<br /><br /><br />');
	                            }
	                        }
	                        $container.show();
	                    }
	                }
	            }
	            if (!target.hasClass('disabled_select')) {
	                if (target.parent().hasClass('single_select')) {
	                    if (!target.hasClass('selected')) {
	                        target.parent().find('.select_btn').each(function() {
	                            $(this).removeClass('selected');
	                            $(this).find('input').removeAttr('checked');
	                        });
	                    }
	                    if (target.parent().hasClass('acctype') || target.parent().parent().hasClass('acctype')) {
	                        if (!target.hasClass('selected')) {
	                            var val = target.data('value'),
	                                curParlseyGroup = step.data('n') - 1,
	                                fields1step = JSON.parse(Cookies.get('step_1') || '[]');
									alreadySelectedRegType = val;
	                            for (var i = 0; i < fields1step.length; i++) {
	                                var fieldName = fields1step[i].name,
	                                    field = $('.wp-icm-open-account.live .fields_corporate input[name="' + fieldName + '"]'),
	                                    fieldValue = fields1step[i].value;
	                                if (fieldName == 'country') {
										$('#selectAddressInput').removeAttr('required');
										$('.wp-icm-open-account.live #selectAddressInput').removeAttr('required');
										$('.wp-icm-open-account.live #address').removeAttr('required');
										$('.wp-icm-open-account.live #city').removeAttr('required');
										$('.wp-icm-open-account.live #state').removeAttr('required');
										$('.wp-icm-open-account.live #zip_code').removeAttr('required');
										$('#selectAddressInput').removeAttr('required data-parsley-group').parent().removeClass('error');
										$('#selectAddressInput').parsley().reset();

										var $countries2Input = $('.wp-icm-open-account.live #countries2');
										if ($countries2Input.val() === '') {
											var n = getCountryNameByCode(window['userLocationByIP'].countryCode);
											var cName = n.localized;
											var cOrig = n.orig;

											$countries2Input.val(cName);
											$countries2Input.attr('data-orig', cOrig);
											$countries2Input.attr('data-mlkey', n.mlkey);
											fillPhoneCodeLabelByCountryName(cOrig, $('.wp-icm-open-account.live input#phone2'));

											var $nationalityInput = $('.wp-icm-open-account.live #nationality');
											$nationalityInput.val(cName);
											$nationalityInput.attr('data-orig', cOrig);
											$nationalityInput.attr('data-mlkey', n.mlkey);

											var $registeredCountriesInput = $('.wp-icm-open-account.live #registered_countries');
											$registeredCountriesInput.val(cName);
											$registeredCountriesInput.attr('data-orig', cOrig);
											$registeredCountriesInput.attr('data-mlkey', n.mlkey);

											var $businessCountriesInput = $('.wp-icm-open-account.live #business_countries');
											$businessCountriesInput.val(cName);
											$businessCountriesInput.attr('data-orig', cOrig);
											$businessCountriesInput.attr('data-mlkey', n.mlkey);
											$('.wp-icm-open-account.live .cs-dn').focusout();
											fillPhoneCodeLabelByCountryName(cOrig, $('.wp-icm-open-account.live input#fax'));
										}
	                                }
	                                field.val(fieldValue).parent().addClass('has-label');
	                            }

								if (val == 'individual') {
									showIslamicCheckbox();
									document.querySelector('#trulioo_fields').style.display = 'block'
								} else {
									hideIslamicCheckbox();
								}
	                            if (val == 'individual' && $('.wp-icm-open-account.live .fields_individual').hasClass('firstClick')) {
									$('.wp-icm-open-account.live .fields_individual').removeClass('firstClick');
									window['jointAdded']=false
									removeJointSteps();

								} else if (val == 'corporate') {
									window['jointAdded']=false
									removeJointSteps();
									document.querySelector('#trulioo_fields').style.display = 'none'

								} else {
	                                if (target.data('value') == 'joint') {
	                                    val = 'individual';
										if(!window['jointAdded']) addJointSteps();
										document.querySelector('#trulioo_fields').style.display = 'block'

	                                } else {
										window['jointAdded']=false
	                                    removeJointSteps();
									}
								}
								$('.wp-icm-open-account.live .acctype_fields').hide().find('input').each(function() {
									$(this).removeAttr('required data-parsley-group').parent().removeClass('success error');
									$(this).parsley().reset();
								});
								$('.wp-icm-open-account.live .fields_' + val + ' input').attr({
									'data-parsley-group': 'block-' + curParlseyGroup,
									'required': ''
								});

								$('.wp-icm-open-account.live #busaddr').removeAttr('required');
								// $('.wp-icm-open-account.live #selectAddressInput').removeAttr('required');
								// $('.wp-icm-open-account.live #joint_selectAddressInput').removeAttr('required');
								$('.wp-icm-open-account.live #qq_id, .wp-icm-open-account.live #joint_qq_id, .wp-icm-open-account.live #qq_id_corporate').removeAttr('required');
								$('.wp-icm-open-account.live .fields_' + val).show().find('input').each(function() {
									if ($(this).val().length)
										$(this).parsley().validate();
								});
	                            if ($('.wp-icm-open-account.live .fields_individual').hasClass('firstClick')) {
	                                $('.wp-icm-open-account.live .fields_individual').removeClass('firstClick');
	                            }
	                        }
							if(window['trulioo']){
								$(`#zip_code`).removeAttr('required');
								$('#address').removeAttr('required');
								$('#trulioo_fields').find('input').removeAttr('required');
							}
	                    }
	                    target.addClass('selected');
	                    target.find('input').prop('checked', 'checked');
	                } else {
	                    target.toggleClass('selected');
	                    if (target.find('input').attr('checked')) {
	                        target.find('input').removeAttr('checked');
	                    } else {
	                        target.find('input').prop('checked', 'checked');
	                    }
	                }
	                target.parent().removeClass('error').addClass('success').each(function() {
	                    target.find('input').removeAttr('required');
	                });
	            }
	            target.parent().find('input').each(function() {
	                $(this).parsley().validate();
	            });
				if (target.hasClass('select_btn_large')&&target.hasClass('selected')){
					target.parent().removeClass('error').addClass('success').each(function() {
	                    target.find('input').removeAttr('required');
	                });

					if(target[0].getAttribute('id')=='as-301506'||target[0].getAttribute('id')=='as-301607'){
						if($('#as-301506').hasClass('selected')&&$('#as-301607').hasClass('selected')){
							var message = target[0].getAttribute('message').replace(/%/g,'"')
							$errorMessage = $(`<ul class="parsley-errors-list filled aq"  id='er-${target[0].getAttribute('question-id')}' aria-hidden="false">
							<li class="parsley-addtional-question">${message}</li>
						</ul>`)
							$('#as-301607').parent().removeClass('success')
							$('#as-301506').parent().removeClass('success')
							if(!$('#as-301607').find('input').hasClass('parsley-error')){

								$('#as-301607').parent().addClass('error');
								$('#as-301506').parent().addClass('error');
								$('#as-301607').parent().parent().addClass('knockoutError');
								$('#as-301607').parent().append($errorMessage)
								$('#as-301607').find('input').addClass('parsley-error')
							}
						}else{
							if($('#as-301607').find('input').hasClass('parsley-error')){
								$('#as-301607').parent().addClass('success')
								$('#as-301506').parent().addClass('success')
							}
							$('#as-301607').parent().removeClass('error');
							$('#as-301506').parent().removeClass('error');
							$('#as-301607').parent().parent().removeClass('knockoutError');
							$('#as-301607').find('input').removeClass('parsley-error');
							$('#as-301607').parent().find('.aq').remove()
						}
					}else if(!$('#as-301506').hasClass('selected') || !$('#as-301607').hasClass('selected')){
						if(!$('#as-301607').parent().hasClass('success')) $('#as-301607').parent().addClass('success');
						if(!$('#as-301506').parent().hasClass('success')) {
							$('#as-301506').parent().addClass('success');
						}
						$('#as-301607').parent().removeClass('error');
						$('#as-301506').parent().removeClass('error');
						$('#as-301607').parent().parent().removeClass('knockoutError');
						$('#as-301607').find('input').removeClass('parsley-error');
						$('#as-301607').parent().find('.aq').remove()
					}
					if(target[0].getAttribute('id')=='joint_as-301506'||target[0].getAttribute('id')=='joint_as-301607'){
						if($('#joint_as-301506').hasClass('selected')&&$('#joint_as-301607').hasClass('selected')){
							var message = target[0].getAttribute('message').replace(/%/g,'"')
							$errorMessage = $(`<ul class="parsley-errors-list filled aq"  id='er-${target[0].getAttribute('question-id')}' aria-hidden="false">
							<li class="parsley-addtional-question">${message}</li>
						</ul>`)
							$('#joint_as-301607').parent().removeClass('success')
							$('#joint_as-301506').parent().removeClass('success')
							if(!$('#joint_as-301607').find('input').hasClass('parsley-error')){
								$('#joint_as-301607').parent().addClass('error');
								$('#joint_as-301506').parent().addClass('error');
								$('#joint_as-301607').parent().parent().addClass('knockoutError');
								$('#joint_as-301607').parent().append($errorMessage)
								$('#joint_as-301607').find('input').addClass('parsley-error')
							}
						}else{
							if($('#joint_as-301607').find('input').hasClass('parsley-error')){
								$('#joint_as-301607').parent().addClass('success')
								$('#joint_as-301506').parent().addClass('success')
							}
							$('#joint_as-301607').parent().removeClass('error');
							$('#joint_as-301506').parent().removeClass('error');
							$('#joint_as-301607').parent().parent().removeClass('knockoutError');
							$('#joint_as-301607').find('input').removeClass('parsley-error');
							$('#joint_as-301607').parent().find('.aq').remove()
						}
					}else if(!$('#joint_as-301506').hasClass('selected') || !$('#joint_as-301607').hasClass('selected')){
						if(!$('#joint_as-301607').parent().hasClass('success')) $('#joint_as-301607').parent().addClass('success');
						if(!$('#joint_as-301506').parent().hasClass('success')) {
							$('#joint_as-301506').parent().addClass('success');
						}
						$('#joint_as-301607').parent().removeClass('error');
						$('#joint_as-301506').parent().removeClass('error');
						$('#joint_as-301607').parent().parent().removeClass('knockoutError');
						$('#joint_as-301607').find('input').removeClass('parsley-error');
						$('#joint_as-301607').parent().find('.aq').remove()
					}
					if((target[0].getAttribute('id')=='as-301506'||target[0].getAttribute('id')=='as-301607')||(target[0].getAttribute('id')=='joint_as-301506'||target[0].getAttribute('id')=='joint_as-301607')){

					}else if(target[0].getAttribute('flag')=='true'){
						var message = target[0].getAttribute('message').replace(/%/g,'"')
							$errorMessage = $(`<ul class="parsley-errors-list filled aq"  id='er-${target[0].getAttribute('question-id')}' aria-hidden="false">
								<li class="parsley-addtional-question">${message}</li>
							</ul>`)
						if(!target.parent().parent().hasClass('knockoutError')){
							target.parent().removeClass('success')
							target.parent().addClass('error');
							target.parent().parent().addClass('knockoutError');
							target.parent().append($errorMessage)
							target.find('input').addClass('parsley-error')
						}
						//$('.wp-icm-open-account.live .main_register_wrap .next_btn .start-trading-button button ').addClass('valid_wait').attr('disabled', 'disabled')
					}else{
						var node = document.querySelector(`#er-${target[0].getAttribute('question-id')}`)
						if(node){
							node.remove()
							target.parent().removeClass('error')
							target.parent().parent().removeClass('knockoutError')
							target.parent().find('input').removeClass('parsley-error')

						}
					}

					if(target[0].getAttribute('id')=='as-301701'||target[0].getAttribute('id')=='joint_as-301701'){
						var message = `We recommend reviewing our <a id="education_overview_link" target=\"_blank\" href=\"https://www.icmarkets.com/au/en/education/education-overview">training material</a> on our Education page and practice with a demo account`
						$errorMessage = $(`<ul class="parsley-errors-list filled"  id='er-${target[0].getAttribute('question-id')}' aria-hidden="false">
							<li class="parsley-addtional-question">${message}</li>
						</ul>`)
						if(!target.parent().parent().hasClass('knockoutError')){
							target.parent().parent().addClass('knockoutError');
							target.parent().append($errorMessage)
							target.find('input').addClass('parsley-error')
						}
					}else if(target[0].getAttribute('id')=='as-301702'||target[0].getAttribute('id')=='as-301703'||target[0].getAttribute('id')=='joint_as-301702'||target[0].getAttribute('id')=='joint_as-301703'){
						target.parent().find('.parsley-errors-list').remove()
						target.find('input').removeClass('parsley-error')
						target.parent().parent().removeClass('knockoutError');
					}
				}

	        } else { // if target not select btn
	            var $selectInput;
	            if (target.is('.options_list li')) {
	                var curDropdown = target.closest('.searchDropdown');
	                if (curDropdown.hasClass('searched')) {
	                    var cCode = target.data('cc');
	                    var cName = target.data('cn');
	                    $selectInput = $('.wp-icm-open-account.live .active_step .searchDropdown.opened input');
	                    if ($selectInput.is('#birth_month, #signatory_birth_month, #incorporation_birth_month')) {
							$selectInput.attr('data-orig', target.attr('data-id')).attr('data-mlkey', target.attr('data-ml')).val(target.text());
						} else {
	                        $selectInput.attr('data-orig', cName).attr('data-mlkey', target.attr('data-ml')).val(target.text());
	                    }
	                    $('.wp-icm-open-account.live .active_step .searchDropdown').removeClass('opened');

	                    var selectInputId = ($selectInput[0] ? $selectInput[0].id : undefined);
	                    var $phoneInput = null;
						var $branchInput = null;
						var $branchesList = null;
						var $faxInput = null;
	                    switch (selectInputId) {
	                        case "countries":
								$phoneInput = $('.wp-icm-open-account.live input#phone');
								$branchInput = $('.wp-icm-open-account.live input#branch_id');
								$branchesList = $('#branchesList');
								window['country_code'] = cCode;

								var $countriesInput = $('.wp-icm-open-account.live #countries');
								if ($countriesInput.attr('data-orig') === 'Canada') {
									$('.wp-icm-open-account.live .input-select-state').attr("style", "display: block;");
									$('.wp-icm-open-account.live .hint-canada-state').attr("style", "display: block;");
									$('.wp-icm-open-account.live #states').attr('required', true);
								} else {
									$('.wp-icm-open-account.live .input-select-state').attr("style", "display: none;");
									$('.wp-icm-open-account.live .hint-canada-state').attr("style", "display: none;");
									$('.wp-icm-open-account.live #states').removeAttr('required');
								}

								resetTruliooFields('individual')
								if(isTruliooEnabled(cCode) && window['identityCountries'].includes(cCode)){
									window['trulioo'] = true
									window['joint_trulioo'] = true

									getTruliooFieldsAndConsents(cCode, 'individual');
								}else{
									window['trulioo'] = false
									window['joint_trulioo'] = false
								}
	                            break;
	                        case "countries2":
								$phoneInput = $('.wp-icm-open-account.live input#phone2');
	                            $faxInput = $('.wp-icm-open-account.live input#fax');

								var $countries2Input = $('.wp-icm-open-account.live #countries2');
								if ($countries2Input.attr('data-orig') === 'Canada') {
									$('.wp-icm-open-account.live .input-select-state').attr("style", "display: block;");
									$('.wp-icm-open-account.live .hint-canada-state').attr("style", "display: block;");
									$('.wp-icm-open-account.live #states2').attr('required', true);
									$('.wp-icm-open-account.live #states2').attr('data-parsley-excluded', 'false');
								} else {
									$('.wp-icm-open-account.live .input-select-state').attr("style", "display: none;");
									$('.wp-icm-open-account.live .hint-canada-state').attr("style", "display: none;");
									$('.wp-icm-open-account.live #states2').removeAttr('required');
									$('.wp-icm-open-account.live #states2').attr('data-parsley-excluded', 'true');
								}
	                            break;
	                        case "joint_countries":
	                            $phoneInput = $('.wp-icm-open-account.live input#joint_phone');
								$branchInput = $('.wp-icm-open-account.live input#joint_branch_id');
								$branchesList = $('#joint_branchesList');
								window['joint_country_code'] = cCode;

								var $jointCountriesInput = $('.wp-icm-open-account.live #joint_countries');
								if ($jointCountriesInput.attr('data-orig') === 'Canada') {
									$('.wp-icm-open-account.live .input-select-state').attr("style", "display: block;");
									$('.wp-icm-open-account.live .hint-canada-state').attr("style", "display: block;");
									$('.wp-icm-open-account.live #joint_states').attr('required', true);
								} else {
									$('.wp-icm-open-account.live .input-select-state').attr("style", "display: none;");
									$('.wp-icm-open-account.live .hint-canada-state').attr("style", "display: none;");
									$('.wp-icm-open-account.live #joint_states').removeAttr('required');
								}

								resetTruliooFields('joint')
								if(isTruliooEnabled(cCode) && window['identityCountries'].includes(cCode)){
									window['joint_trulioo'] = true

									getTruliooFieldsAndConsents(cCode, 'joint');
								}else{
									window['joint_trulioo'] = false
								}
	                            break;
							case "registered_countries":
								var $registeredCountriesInput = $('.wp-icm-open-account.live #registered_countries');
								if ($registeredCountriesInput.attr('data-orig') === 'Canada') {
									$('.wp-icm-open-account.live #registered_state').parent().attr("style", "display: none;");
									$('.wp-icm-open-account.live .input-select-state').attr("style", "display: block;");
									$('.wp-icm-open-account.live .hint-canada-state').attr("style", "display: block;");
									$('.wp-icm-open-account.live #registered_states').attr('required', true);
									$('.wp-icm-open-account.live #registered_states').attr('data-parsley-excluded', 'false');
								} else {
									$('.wp-icm-open-account.live #registered_state').parent().attr("style", "display: block;");
									$('.wp-icm-open-account.live .input-select-state').attr("style", "display: none;");
									$('.wp-icm-open-account.live .hint-canada-state').attr("style", "display: none;");
									$('.wp-icm-open-account.live #registered_states').removeAttr('required');
									$('.wp-icm-open-account.live #registered_states').attr('data-parsley-excluded', 'true');
								}
								break;
							case "business_countries":
								var $businessCountriesInput = $('.wp-icm-open-account.live #business_countries');
								if ($businessCountriesInput.attr('data-orig') === 'Canada') {
									$('.wp-icm-open-account.live #business_state').parent().attr("style", "display: none;");
									$('.wp-icm-open-account.live .input-select-state').attr("style", "display: block;");
									$('.wp-icm-open-account.live .hint-canada-state').attr("style", "display: block;");
									$('.wp-icm-open-account.live #business_states').attr('required', true);
									$('.wp-icm-open-account.live #business_states').attr('data-parsley-excluded', 'false');
								} else {
									$('.wp-icm-open-account.live #business_state').parent().attr("style", "display: block;");
									$('.wp-icm-open-account.live .input-select-state').attr("style", "display: none;");
									$('.wp-icm-open-account.live .hint-canada-state').attr("style", "display: none;");
									$('.wp-icm-open-account.live #business_states').removeAttr('required');
									$('.wp-icm-open-account.live #business_states').attr('data-parsley-excluded', 'true');
								}
								break;
							case "nationality":
								$('.wp-icm-open-account.live #nationality').attr('data-parsley-excluded', 'true');
								$('.wp-icm-open-account.live .nationality .parsley-errors-list').attr("style", "display: none;");
								break;
							case "joint_nationality":
								$('.wp-icm-open-account.live #joint_nationality').attr('data-parsley-excluded', 'true');
								$('.wp-icm-open-account.live .nationality .parsley-errors-list').attr("style", "display: none;");
								break;
	                    }
	                    if ($phoneInput) {
							fillPhoneCodeLabelByCountryName(cName, $phoneInput);
	                    }

						let countryCode = cCode.toLowerCase();
						toggleRefferControls(countryCode);
						showPopupModalIfNeeded(countryCode);

						$('.wp-icm-open-account.live #states').val('');

						//
						if ($branchInput) {
							var countryObject = getCountryObjectByCode(cCode);
							initBranchesList(countryObject, $branchesList);
							setBranch($branchInput, cCode, null, true);
	                    }
	                    if ($faxInput) {
	                        fillPhoneCodeLabelByCountryName(cName, $faxInput);
	                    }
	                } else {
	                    $selectInput = $('.wp-icm-open-account.live .active_step .searchDropdown.opened input');
	                    if ($selectInput.is('#birth_month, #signatory_birth_month, #incorporation_birth_month')) {
	                        $selectInput.attr('data-orig', target.attr('data-id')).attr('data-mlkey', target.attr('data-ml')).val(target.text()).parsley().validate();
	                        $selectInput.change();
						} else if ($selectInput.is('#branch_id')) {
							var countryObject;
							var $countriesInput = $('.wp-icm-open-account.live #countries');
							if ($countriesInput && $countriesInput.val()) {
								countryObject = getCountryObjectByName($countriesInput.attr('data-orig'));
							}
	                        $selectInput.attr('data-orig', target.attr('data-id')).attr('data-mlkey', target.attr('data-ml')).val(target.text()).parsley().validate();
	                        $selectInput.change();
							if (countryObject) setBranch($selectInput, countryObject.code, target.attr('data-id'));
						} else if ($selectInput.is('#joint_branch_id')) {
							var countryObject;
							var $countriesInput = $('.wp-icm-open-account.live #joint_countries');
							if ($countriesInput && $countriesInput.val()) {
								countryObject = getCountryObjectByName($countriesInput.attr('data-orig'));
							}
	                        $selectInput.attr('data-orig', target.attr('data-id')).attr('data-mlkey', target.attr('data-ml')).val(target.text()).parsley().validate();
	                        $selectInput.change();
							if (countryObject) setBranch($selectInput, countryObject.code, target.attr('data-id'));
						} else if ($selectInput.is('#states')) {
							$selectInput.attr('data-sc', target.attr('data-sc')).attr('data-sn', target.attr('data-sn')).val(target.text()).parsley().validate();
							$('.wp-icm-open-account.live #states').on('change keyup', function() {
								$('.wp-icm-open-account.live #state').val($(this).attr('data-sn'));
							});
							$('.wp-icm-open-account.live #selectAddressInput').removeAttr('required');
							$selectInput.change();
						} else if ($selectInput.is('#joint_states')) {
							$selectInput.attr('data-sc', target.attr('data-sc')).attr('data-sn', target.attr('data-sn')).val(target.text()).parsley().validate();
							$('.wp-icm-open-account.live #joint_states').on('change keyup', function() {
								$('.wp-icm-open-account.live #joint_state').val($(this).attr('data-sn'));
							});
							$('.wp-icm-open-account.live #joint_selectAddressInput').removeAttr('required');
							$selectInput.change();
						} else if ($selectInput.is('#states2')) {
							$selectInput.attr('data-sc', target.attr('data-sc')).attr('data-sn', target.attr('data-sn')).val(target.text()).parsley().validate();
							$selectInput.change();
						} else if ($selectInput.is('#registered_states')) {
							$selectInput.attr('data-sc', target.attr('data-sc')).attr('data-sn', target.attr('data-sn')).val(target.text()).parsley().validate();
							$('.wp-icm-open-account.live #registered_states').on('change keyup', function() {
								$('.wp-icm-open-account.live #registered_state').val($(this).attr('data-sn'));
							});
							$('.wp-icm-open-account.live #registered_state').parent().addClass('has-label');
							$('.wp-icm-open-account.live #registered_state').prop('readonly', true);
							$selectInput.change();
						} else if ($selectInput.is('#business_states')) {
							$selectInput.attr('data-sc', target.attr('data-sc')).attr('data-sn', target.attr('data-sn')).val(target.text()).parsley().validate();
							$('.wp-icm-open-account.live #business_states').on('change keyup', function() {
								$('.wp-icm-open-account.live #business_state').val($(this).attr('data-sn'));
							});
							$('.wp-icm-open-account.live #business_state').parent().addClass('has-label');
							$('.wp-icm-open-account.live #business_state').prop('readonly', true);
							$selectInput.change();
						} else {
							if ($selectInput.is('#currency')) {
								alreadySelectedCurrency = target.text();
							}
	                        $selectInput.attr('data-orig', target.attr('data-id')).attr('data-mlkey', target.attr('data-ml')).val(target.text()).parsley().validate();
	                    }
	                    curDropdown.removeClass('opened');
	                }
	                if (curDropdown.hasClass('error')) {
	                    if (!window['landingPage']) {
	                        curDropdown.removeClass('error').addClass('success').find('.options_list').mCustomScrollbar("destroy");
	                    }
	                    curDropdown.find('input').parsley().validate();
	                }
	            } else if (!target.is('[class*="mCSB"]')) {
	                if (target.hasClass('rounded_el') && target.closest('.searchDropdown').length && !target.closest('.searchDropdown').hasClass('opened')) {
	                    target.closest('.searchDropdown').addClass('opened');
	                } else if (target.hasClass('rounded_el') && target.parent().is('.notSearched.opened')) {
	                    $('.wp-icm-open-account.live .active_step .searchDropdown').removeClass('opened');
	                } else if ($('.wp-icm-open-account.live .active_step .searchDropdown').hasClass('opened') && !$('.wp-icm-open-account.live .active_step .searchDropdown.opened input').is(':focus')) {
	                    var curVal = $('.wp-icm-open-account.live .active_step .searchDropdown.opened input');
	                    if ($('.wp-icm-open-account.live .active_step .searchDropdown.opened').hasClass('searched') && curVal.length && !$('.wp-icm-open-account.live .opened .options_list').hasClass('newlist')) {
	                        var valFromList = $('.wp-icm-open-account.live .opened .options_list li:first').data('cn');
	                        $('.wp-icm-open-account.live .active_step .searchDropdown.opened input').val(valFromList);
	                        $('.wp-icm-open-account.live .active_step .searchDropdown.opened input').parsley().validate();
	                    }
	                    $('.wp-icm-open-account.live .active_step .searchDropdown.opened').removeClass('opened');
	                    if ($('.wp-icm-open-account.live .active_step .searchDropdown.opened').hasClass('searched')) {
	                        if (!window['landingPage']) {
	                            $('.wp-icm-open-account.live .active_step .searchDropdown.searched.opened').find('.options_list').mCustomScrollbar("destroy");
	                        }
	                    }
	                } else if (target.closest('.checkbox_wrap').length) {
	                    var $input = target.closest('.checkbox_wrap').find('input');
	                    $input[0].checked = !$input[0].checked;
	                    $input.trigger('change');
					} else if (target.closest('.acknowledgment_wrap').length) {
						var $input = target.closest('.acknowledgment_wrap').find('input[type="checkbox"]');
						$input[0].checked = !$input[0].checked;
						var $acknowledgment_input = target.closest('.acknowledgment_wrap').find('input[name="eu_client_acknowledgment"]');
						if (!$acknowledgment_input.length) $acknowledgment_input = target.closest('.acknowledgment_wrap').find('input[name="joint_eu_client_acknowledgment"]');
						if ($input[0].checked) {
							$acknowledgment_input.val(encodeURIComponent(target.closest('.acknowledgment_wrap').find('label').text()));
						} else {
							$acknowledgment_input.val(encodeURIComponent('WARNING: Unchecked acknowledgement'));
						}
						$input.trigger('change');
					}
	            }
	        }
	    });

	    $(document).on('localizationChanged', function() {
	        reconstructButtonsAfterLocalization();
	    });

	    $(document).on('change', '.wp-icm-open-account.live .reffer_check input, .wp-icm-open-account.live .joint_reffer_check input', function() {
	        if ($(this).prop('checked') == true) {
	            $('.wp-icm-open-account.live .reffer_id, .wp-icm-open-account.live .joint_reffer_id').fadeIn();
	            $('.wp-icm-open-account.live #reffer_id, .wp-icm-open-account.live #joint_reffer_id').attr('required', '');
	        } else {
	            $(this).removeProp('checked');
	            $('.wp-icm-open-account.live #reffer_id, .wp-icm-open-account.live #joint_reffer_id').removeAttr('required');
	            $('.wp-icm-open-account.live .reffer_id, .wp-icm-open-account.live .joint_reffer_id').fadeOut();
	        }
	    });

	    $('.wp-icm-open-account.live .busaddr_check input').on('change', function() {
	        if ($(this).prop('checked') != true) {
	            $('.wp-icm-open-account.live .busaddr_field').fadeIn();
	            $('.wp-icm-open-account.live .busaddr_field input').attr('required', true);
	        } else {
	            $(this).prop('checked', 'checked');
	            $('.wp-icm-open-account.live .busaddr_field input').removeAttr('required');
	            $('.wp-icm-open-account.live .busaddr_field').fadeOut(function() {
	                $('.wp-icm-open-account.live .registered_address_fields input').each(function() {
	                    var val = $(this).val();
	                    var fieldName = $(this).attr('data-field-name');
	                    var orig = $(this).attr('data-orig');
	                    if (orig) {
	                        $('.wp-icm-open-account.live input[name="business_' + fieldName + '"]').attr('data-orig', orig);
	                    }
	                    if (val) {
	                        $('.wp-icm-open-account.live input[name="business_' + fieldName + '"]').parent().addClass('has-label');
	                    } else {
	                        $('.wp-icm-open-account.live input[name="business_' + fieldName + '"]').parent().removeClass('has-label');
	                    }
	                });
	            });
	        }
	    });
		$('.wp-icm-open-account.live #branch_id').attr('data-parsley-excluded', 'true');
	    $('.wp-icm-open-account.live .register_form_wrap').on('blur', 'input[id*="mail"]', function() {
	        var el = $(this),
	            elP = $(this).parsley(),
	            val = $(this).val();

			if (window.storage && window.storage.paypal && window.storage.paypal.nonce && window.storage.paypal.details && window.storage.paypal.details.billingAddress) {
				var nonce = window.storage.paypal.nonce;
				var payerId = window.storage.paypal.details.payerId;
				var accountCountryCode = window.storage.paypal.details.countryCode;
				var billingCountryCode = window.storage.paypal.details.billingAddress.countryCode;
				var email = window.storage.paypal.details.email;
				var firstName = window.storage.paypal.details.firstName;
				var lastName = window.storage.paypal.details.lastName;

				$('#paypal_nonce').val(nonce);
				$('#paypal_payer_id').val(payerId);
				$('#paypal_account_country').val(accountCountryCode);
				$('#paypal_billing_country').val(billingCountryCode);
				$('#paypal_email').val(email);
				$('#paypal_first_name').val(firstName);
				$('#paypal_last_name').val(lastName);

				$('#first_name').parent().toggleClass('disallowed-changes-by-paypal', true);
				$('#last_name').parent().toggleClass('disallowed-changes-by-paypal', true);
				var pp_container = $('<div class="filled-from-paypal"><img class="paypal-button-logo paypal-button-logo-pp paypal-button-logo-blue" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICAgIDxwYXRoIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNyIgZD0iTSAyMC43MDIgOS40NDYgQyAyMC45ODIgNy4zNDcgMjAuNzAyIDUuOTQ3IDE5LjU3OCA0LjU0OCBDIDE4LjM2MSAzLjE0OCAxNi4yMDggMi41NDggMTMuNDkzIDIuNTQ4IEwgNS41MzYgMi41NDggQyA0Ljk3NCAyLjU0OCA0LjUwNiAyLjk0OCA0LjQxMiAzLjU0OCBMIDEuMTM2IDI1Ljc0IEMgMS4wNDIgMjYuMjM5IDEuMzIzIDI2LjYzOSAxLjc5MSAyNi42MzkgTCA2Ljc1MyAyNi42MzkgTCA2LjM3OCAyOC45MzggQyA2LjI4NSAyOS4yMzggNi42NTkgMjkuNjM4IDYuOTQgMjkuNjM4IEwgMTEuMTUzIDI5LjYzOCBDIDExLjYyMSAyOS42MzggMTEuOTk1IDI5LjIzOCAxMi4wODkgMjguNzM5IEwgMTIuMTgyIDI4LjUzOSBMIDEyLjkzMSAyMy4zNDEgTCAxMy4wMjUgMjMuMDQxIEMgMTMuMTE5IDIyLjQ0MSAxMy40OTMgMjIuMTQxIDEzLjk2MSAyMi4xNDEgTCAxNC42MTYgMjIuMTQxIEMgMTguNjQyIDIyLjE0MSAyMS43MzEgMjAuMzQyIDIyLjY2OCAxNS40NDMgQyAyMy4wNDIgMTMuMzQ0IDIyLjg1NSAxMS41NDUgMjEuODI1IDEwLjM0NSBDIDIxLjQ1MSAxMC4wNDYgMjEuMDc2IDkuNjQ2IDIwLjcwMiA5LjQ0NiBMIDIwLjcwMiA5LjQ0NiI+PC9wYXRoPgogICAgPHBhdGggZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC43IiBkPSJNIDIwLjcwMiA5LjQ0NiBDIDIwLjk4MiA3LjM0NyAyMC43MDIgNS45NDcgMTkuNTc4IDQuNTQ4IEMgMTguMzYxIDMuMTQ4IDE2LjIwOCAyLjU0OCAxMy40OTMgMi41NDggTCA1LjUzNiAyLjU0OCBDIDQuOTc0IDIuNTQ4IDQuNTA2IDIuOTQ4IDQuNDEyIDMuNTQ4IEwgMS4xMzYgMjUuNzQgQyAxLjA0MiAyNi4yMzkgMS4zMjMgMjYuNjM5IDEuNzkxIDI2LjYzOSBMIDYuNzUzIDI2LjYzOSBMIDcuOTcgMTguMzQyIEwgNy44NzYgMTguNjQyIEMgOC4wNjMgMTguMDQzIDguNDM4IDE3LjY0MyA5LjA5MyAxNy42NDMgTCAxMS40MzMgMTcuNjQzIEMgMTYuMDIxIDE3LjY0MyAxOS41NzggMTUuNjQzIDIwLjYwOCA5Ljk0NiBDIDIwLjYwOCA5Ljc0NiAyMC42MDggOS41NDYgMjAuNzAyIDkuNDQ2Ij48L3BhdGg+CiAgICA8cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNIDkuMjggOS40NDYgQyA5LjI4IDkuMTQ2IDkuNDY4IDguODQ2IDkuODQyIDguNjQ2IEMgOS45MzYgOC42NDYgMTAuMTIzIDguNTQ2IDEwLjIxNiA4LjU0NiBMIDE2LjQ4OSA4LjU0NiBDIDE3LjIzOCA4LjU0NiAxNy44OTMgOC42NDYgMTguNTQ4IDguNzQ2IEMgMTguNzM2IDguNzQ2IDE4LjgyOSA4Ljc0NiAxOS4xMSA4Ljg0NiBDIDE5LjIwNCA4Ljk0NiAxOS4zOTEgOC45NDYgMTkuNTc4IDkuMDQ2IEMgMTkuNjcyIDkuMDQ2IDE5LjY3MiA5LjA0NiAxOS44NTkgOS4xNDYgQyAyMC4xNCA5LjI0NiAyMC40MjEgOS4zNDYgMjAuNzAyIDkuNDQ2IEMgMjAuOTgyIDcuMzQ3IDIwLjcwMiA1Ljk0NyAxOS41NzggNC42NDggQyAxOC4zNjEgMy4yNDggMTYuMjA4IDIuNTQ4IDEzLjQ5MyAyLjU0OCBMIDUuNTM2IDIuNTQ4IEMgNC45NzQgMi41NDggNC41MDYgMy4wNDggNC40MTIgMy41NDggTCAxLjEzNiAyNS43NCBDIDEuMDQyIDI2LjIzOSAxLjMyMyAyNi42MzkgMS43OTEgMjYuNjM5IEwgNi43NTMgMjYuNjM5IEwgNy45NyAxOC4zNDIgTCA5LjI4IDkuNDQ2IFoiPjwvcGF0aD4KICAgIDxnIHRyYW5zZm9ybT0ibWF0cml4KDAuNDk3NzM3LCAwLCAwLCAwLjUyNjEyLCAxLjEwMTQ0LCAwLjYzODY1NCkiIG9wYWNpdHk9IjAuMiI+CiAgICAgICAgPHBhdGggZmlsbD0iIzIzMWYyMCIgZD0iTTM5LjMgMTYuN2MwLjkgMC41IDEuNyAxLjEgMi4zIDEuOCAxIDEuMSAxLjYgMi41IDEuOSA0LjEgMC4zLTMuMi0wLjItNS44LTEuOS03LjgtMC42LTAuNy0xLjMtMS4yLTIuMS0xLjdDMzkuNSAxNC4yIDM5LjUgMTUuNCAzOS4zIDE2Ljd6Ij48L3BhdGg+CiAgICAgICAgPHBhdGggZmlsbD0iIzIzMWYyMCIgZD0iTTAuNCA0NS4yTDYuNyA1LjZDNi44IDQuNSA3LjggMy43IDguOSAzLjdoMTZjNS41IDAgOS44IDEuMiAxMi4yIDMuOSAxLjIgMS40IDEuOSAzIDIuMiA0LjggMC40LTMuNi0wLjItNi4xLTIuMi04LjRDMzQuNyAxLjIgMzAuNCAwIDI0LjkgMEg4LjljLTEuMSAwLTIuMSAwLjgtMi4zIDEuOUwwIDQ0LjFDMCA0NC41IDAuMSA0NC45IDAuNCA0NS4yeiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGZpbGw9IiMyMzFmMjAiIGQ9Ik0xMC43IDQ5LjRsLTAuMSAwLjZjLTAuMSAwLjQgMC4xIDAuOCAwLjQgMS4xbDAuMy0xLjdIMTAuN3oiPjwvcGF0aD4KICAgIDwvZz4KPC9zdmc+Cg==" alt="pp" style="visibility: visible;"></div>');
				$('#first_name').parent().append(pp_container.clone());
				$('#last_name').parent().append(pp_container.clone());
			}

	        elP.removeError('emailUsed');
	        elP.reset();
	        if ($(el).val().length) {
	            el.attr({
	                'data-parsley-trigger': 'blur',
	                'data-parsley-excluded': 'true'
	            });
	            elP.validate();
	        }
	        if ($(this).parsley().isValid()) {
	            el.addClass('waiting_validation');
	            getSignTokenLive().then(function(token) {
	                $.ajax({
	                    url: window['serverURL'] + '',
	                    data: { 'data': val, 'branch': window['currentBranchID'], 'getAction': 'check_branched_email', 'ip': window['userIP'], 'request_from': window['request_from'], 'sign': token },
	                    async: true,
	                    success: function(data) {
	                        el.attr({
	                            'data-parsley-excluded': 'false'
	                        }).removeClass('waiting_validation');
	                        el.removeAttr('data-parsley-validation-threshold data-parsley-email').parent().addClass('success').removeClass('error');
	                        elP.reset();
	                        elP.removeError('emailUsed');

	                        if (data == 'used') {
	                            elP.reset();

	                            elP.addError('emailUsed', { message: $('.reg_form_email_already_used').text(), updateClass: true });
	                            el.attr({
	                                'data-parsley-excluded': 'true'
	                            }).parent().addClass('error').removeClass('success');
	                        } else {
	                            function getJoint1Email() {
	                                var ar = serializeFormToArray();
	                                var joint1Email = '';
	                                for (var i = 0; i < ar.length; i++) {
	                                    var fieldName = ar[i].name;
	                                    var fieldValue = ar[i].value;
	                                    if (fieldName == 'email') {
	                                        joint1Email = fieldValue;
	                                        break;
	                                    }
	                                }
	                                return joint1Email;
	                            }
	                            if (val === getJoint1Email() && getAccountType() === 'joint') {
	                                elP.reset();

	                                elP.addError('emailUsed', { message: $('.reg_form_email_already_used_first_joint').text(), updateClass: true });
	                                el.attr({
	                                    'data-parsley-excluded': 'true'
	                                }).parent().addClass('error').removeClass('success');
	                            }
	                        }
	                    }
	                });
	            });
	        }
	    });

	    $('.wp-icm-open-account.live .main_register_wrap').on('click', '.next_btn button', function(e) {
	        e.preventDefault();
	        if ($(e.target).hasClass('valid_wait')) return false;
			if ($(e.target).is('.step-back')) {
				let to = $(e.target).attr('data-to');
				if (to) {
					if(window['currentBranch'] === '2' || window['currentBranch'] === '3' || window['currentBranch'] === '4' || window['currentBranch'] === '6'){
						if(to =='4'){
							to ='3'
						}
						if(to =='8'){
							to ='7'
						}
					}

					goToStep(to, true);
				}
				return false;
			}

	        var curForm = $(this).parent().parent();
	        var prevForm = $(this).parent().parent().prev('.register_form');
	        var nextForm = $(this).parent().parent().next('.register_form');
	        var curFormId = curForm.data('n');
	        var nextFormId = curFormId + 1;

			if(window['currentBranch'] == '2'|| window['currentBranch'] == '3' || window['currentBranch'] == '4' || window['currentBranch'] == '5' || window['currentBranch'] === '6' || window.location.pathname.includes("intl")){
				if(nextFormId == '4'){
					nextFormId = nextFormId + 1
					nextForm = $('.register_form#step_5');
				}
				if(nextFormId == '8'){
					nextFormId = nextFormId + 1
					nextForm = $('.register_form#step_9');
				}
			}
			if(nextFormId == '5' || nextFormId == '9' ){
				var err = document.querySelectorAll('.aq').length
				if( err>0){
					return false
				}
			}
			if (curFormId == '2') {
				const nationality = $('.input_group.input.nationality');
				const country = $('input#countries')
				if (nationality.css('display') == 'none') {
					// nationality.find('input#nationality').attr('data-parsley-excluded', 'true');
					nationality.find('input#nationality').val(country.attr('data-orig'))
				}
			}
	        var block = curFormId - 1;
			if($('#trulioo_fields').find('div').hasClass('error')){
				$('#trulioo_fields').find('input').attr('data-parsley-group','block-1')
			}
			if($('#joint_trulioo_fields').find('div').hasClass('error') ){
				$('#joint_trulioo_fields').find('input').attr('data-parsley-group','block-5')
			}
	        if ($(`.wp-icm-open-account.live #step_${curFormId} input[id*="mail"]`).hasClass('parsley-error')) {
				return false;
			} else if ($('.wp-icm-open-account.live form').parsley().validate({ group: 'block-' + block })) {
				if ($('.wp-icm-open-account.live input[id*="mail"]').hasClass('waiting_validation')) {
	                $(this).addClass('valid_wait');
	                var nextBtn = $(this),
	                    waiValidat = setInterval(function() {
	                        if (!$('.wp-icm-open-account.live input[id*="mail"]').hasClass('waiting_validation')) {
	                            nextBtn.removeClass('valid_wait');
	                            $(nextBtn).click();
	                            clearInterval(waiValidat);
	                        }
	                    }, 100);
					return false;
	            }

	            var $countriesInput = $('.wp-icm-open-account.live #countries');
	            var $joint_countriesInput = $('.wp-icm-open-account.live #joint_countries');
	            // var btn = $(e.target);
				var btn = $('.wp-icm-open-account.live .btn.icm-btn-primary.start-trading-button');
	            btn.addClass('valid_wait').attr('disabled', 'disabled');
	            var _curForm = curForm,
	                _curFormId = curFormId,
	                _nextForm = nextForm,
	                _block = block,
	                _this = this;

				if (curFormId == '1') collectUnsupportedAndDisallowedCountriesLive();
	            if (curFormId == '1' && window['unsupportedCountries'].indexOf($countriesInput.val()) != -1 || curFormId == '5' && window['unsupportedCountries'].indexOf($joint_countriesInput.val()) != -1) {
	                window['selectedAccountType'] = getSelectedAccountType();
	                sendGaData('step' + curFormId, function() {
	                    var form = serializeForm();
	                    if ($('.wp-icm-open-account.live form').parsley().validate({ group: 'block-' + block })) {
	                        getSignTokenLive().then(function(token) {
								form = form + '&ip=' + window['userIP'] + '&ip_country=' + window['countryByIP'] + '&request_from=' + window['request_from'] + '&sign=' + token;
	                            $.ajax({
	                                type: 'POST',
	                                url: window['serverURL'] + '',
	                                dataType: "json",
	                                data: form
	                            }).done(function() {
	                                btn.removeAttr('disabled').removeClass('valid_wait');
	                                var unsupportedCountryName = '';
	                                if (window['unsupportedCountries'].indexOf($countriesInput.val()) != -1) unsupportedCountryName = $countriesInput.val();
	                                if (window['unsupportedCountries'].indexOf($joint_countriesInput.val()) != -1) unsupportedCountryName = $joint_countriesInput.val();
	                                showUnsupportedCountryPopup(unsupportedCountryName, function() {
	                                    continueOk(_curForm, _curFormId, _nextForm, _block, _this);
	                                }, function() {
	                                    clearAllStepsCookies(true);
	                                    return false;
	                                });
	                            }).fail(function() {
	                                btn.removeAttr('disabled').removeClass('valid_wait');
	                                var unsupportedCountryName = '';
	                                if (window['unsupportedCountries'].indexOf($countriesInput.val()) != -1) unsupportedCountryName = $countriesInput.val();
	                                if (window['unsupportedCountries'].indexOf($joint_countriesInput.val()) != -1) unsupportedCountryName = $joint_countriesInput.val();
	                                showUnsupportedCountryPopup(unsupportedCountryName, function() {
	                                    continueOk(_curForm, _curFormId, _nextForm, _block, _this);
	                                }, function() {
	                                    clearAllStepsCookies(true);
	                                    return false;
	                                });
	                            });
	                        });
	                    }
	                });
	            } else if (curFormId == '1' && window['disallowedCountries'].indexOf($countriesInput.val()) != -1 || curFormId == '5' && window['disallowedCountries'].indexOf($joint_countriesInput.val()) != -1) {
	                window['selectedAccountType'] = getSelectedAccountType();
	                sendGaData('step' + curFormId, function() {
	                    var form = serializeForm();
	                    if ($('.wp-icm-open-account.live form').parsley().validate({ group: 'block-' + block })) {
	                        getSignTokenLive().then(function(token) {
	                            form = form + '&ip=' + window['userIP'] + '&ip_country=' + window['countryByIP'] + '&request_from=' + window['request_from'] + '&sign=' + token;
	                            $.ajax({
	                                type: 'POST',
	                                url: window['serverURL'] + '',
	                                dataType: "json",
	                                data: form
	                            }).done(function() {
	                                btn.removeAttr('disabled').removeClass('valid_wait');
	                                var disallowedCountryName = '';
	                                if (window['disallowedCountries'].indexOf($countriesInput.val()) != -1) disallowedCountryName = $countriesInput.val();
	                                if (window['disallowedCountries'].indexOf($joint_countriesInput.val()) != -1) disallowedCountryName = $joint_countriesInput.val();
	                                showDisallowedCountryPopup(disallowedCountryName, function() {
	                                    clearAllStepsCookies(true);
	                                    return false;
	                                }, function() {
	                                    clearAllStepsCookies(true);
	                                    return false;
	                                });
	                            }).fail(function() {
	                                btn.removeAttr('disabled').removeClass('valid_wait');
	                                var disallowedCountryName = '';
	                                if (window['disallowedCountries'].indexOf($countriesInput.val()) != -1) disallowedCountryName = $countriesInput.val();
	                                if (window['disallowedCountries'].indexOf($joint_countriesInput.val()) != -1) disallowedCountryName = $joint_countriesInput.val();
	                                showDisallowedCountryPopup(disallowedCountryName, function() {
	                                    clearAllStepsCookies(true);
	                                    return false;
	                                }, function() {
	                                    clearAllStepsCookies(true);
	                                    return false;
	                                });
	                            });
	                        });
	                    }
	                });
	                return false;
	            } else {
					continueOk(curForm, curFormId, nextForm, block, this);
	            }
				function adformSubmitHandler() {
					window._adftrack = Array.isArray(window._adftrack) ? window._adftrack : (window._adftrack ? [window._adftrack] : []);
					window._adftrack.push({
						HttpHost: 'track.adform.net',
						pm: 2514467,
						divider: encodeURIComponent('|'),
						pagename: encodeURIComponent('ICM_Live_Subscription')
					});
					(function () { var s = document.createElement('script');
					s.type = 'text/javascript'; s.async = true;
					s.src = 'https://s2.adform.net/banners/scripts/st/trackpoint-async.js';
					var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); })();
				}
	            function continueOk(curForm, curFormId, nextForm, block, _this) {
	                // if ($('.open-live-account-page').length) $('.open-live-account-page')[0].scrollIntoView();
	                var curProcLine = $('.wp-icm-open-account.live .process_line[data-n="' + curFormId + '"]');

	                var nextProcLine = $('.wp-icm-open-account.live .process_line[data-n="' + nextFormId + '"]');
	                // var btn;
	                var _that = _this;

					window.history.pushState({step: nextFormId}, `Step ${nextFormId}`);

					if ($(_this).attr('type') == 'submit') {
						if(window['isItCySECWebSite'] || window.location.pathname.includes("global/de") || window.location.host.includes("-zht") ){
							adformSubmitHandler()
						}
	                    var errorFields = preSubmitFormValidation();
	                    if (errorFields.length != 0) {
	                        clearAllStepsCookies(false);
	                        var err = errorFields.toString();
	                        $('.wp-icm-open-account.live .reg_modal_fail .reg_modal_explain').html(err);
	                        $('.wp-icm-open-account.live .reg_modal_fail, .wp-icm-open-account.live .reg_overlay').fadeIn(0);
	                        return false;
	                    }
	                    $('.wp-icm-open-account.live .reg_overlay').fadeIn(0);
	                    window['selectedAccountType'] = getSelectedAccountType();

	                    // sendGaData('submit', function () {
						if (window.location.pathname.includes("eu") || window.location.pathname.includes("au") || window.location.pathname.includes("intl") || window.location.pathname.includes("uk") || window.location.hostname.includes("eu") || window.location.hostname.includes("uk")) {
							$('.wp-icm-open-account .input_group.reffer_id #reffer_id').val('');

							if (Cookies.get('camp')) {
								Cookies.remove('camp');
							}
						} else {
							var camp = getURLParameters()['camp'];
							var reff = $('.wp-icm-open-account.live #reffer_id').val();
							if (camp && !reff) {
								camp = camp.replace(/\D/g, ''); // strip non-digits
								$('.wp-icm-open-account.live #reffer_id').val(camp);
							}
						}

						convertChineseToPinyin();

	                    var form = serializeForm(true);
	                    // btn = $(_that);
						var registered_date = new Date().toLocaleString();
						var registered_type = $('[name=reg_type]').val();
						var registered_email = $('#email').val();

						clearAllStepsCookies(false);

	                    if ($('.wp-icm-open-account.live form').parsley().validate({ group: 'block-' + block })) {
	                        btn.addClass('valid_wait').attr('disabled', 'disabled');
	                        getSignTokenLive().then(function(token) {
								let answers = getAdditionalAnswers()
								let st = ''
								answers.forEach(e=>{
									st += JSON.stringify(e)
								})
								if(getAccountType()  == 'joint'){
									const a = JSON.stringify(answers.slice(0,answers.length/2))
									const b = JSON.stringify(answers.slice(answers.length/2,answers.length))
									form = form + `&additional_answers=${a}&joint_additional_answers=${b}`
								}else{
									const a = JSON.stringify(answers)
									form = form + `&additional_answers=${a}`
								}
								if(window['trulioo']){
									var trulioo_answers = getTruliooAnswers('individual')
									if (trulioo_answers) {
										var trulioo_verify_request = trulioo_answers ? {
											"AcceptTruliooTermsAndConditions": true,
											"ConfigurationName": "Identity Verification",
											"CountryCode": window['country_code'],
											"DataFields": trulioo_answers,
											"ConsentForDataSources": window['truliooConsents']
										}:undefined
										form = form + '&truliooVerificationFields=' + JSON.stringify(trulioo_verify_request)
									} else {
										form = form + '&truliooVerificationFields=' + 'undefined'
									}

								}else{
									form = form + '&truliooVerificationFields=' + 'undefined'
								}

								if(getAccountType()  == 'joint' && window['joint_trulioo']){
									var joint_trulioo_answers = getTruliooAnswers('joint')
									if (joint_trulioo_answers) {
										var joint_trulioo_verify_request = joint_trulioo_answers ? {
											"AcceptTruliooTermsAndConditions": true,
											"ConfigurationName": "Identity Verification",
											"CountryCode": window['joint_country_code'],
											"DataFields": joint_trulioo_answers,
											"ConsentForDataSources": window['joint_truliooConsents']
										} : undefined
										form = form  +'&joint_truliooVerificationFields=' + JSON.stringify(joint_trulioo_verify_request)
									} else {
										form = form + '&joint_truliooVerificationFields=' + 'undefined'
									}
								}else{
									form = form + '&joint_truliooVerificationFields=' + 'undefined'
								}
	                            form = form + '&ip=' + window['userIP'] + '&ip_country=' + window['countryByIP'] + '&request_from=' + window['request_from'] + '&sign=' + token;
								$.ajax({
	                                type: 'POST',
	                                url: window['serverURL'] + '',
	                                dataType: "json",
	                                timeout: 1000*60*5,
	                                data: form
	                            }).done(function(data) {
	                                btn.removeAttr('disabled').removeClass('valid_wait');
	                                if (data && data.status == 'success') {
	                                    //Remove invitation cookie ONLY after success register
	                                    //as referred friend by transferred 'invitation_guid':
	                                    if (data.registeredFriendGuid && data.registeredFriendGuid == Cookies.get('invitation_guid')) {
	                                        sendGaData('refer_a_friend_registered', function() {
	                                            Cookies.remove('invitation_guid');
	                                        });
	                                    }
	                                    var curProcLine = $('.wp-icm-open-account.live .process_line.current');
	                                    var nextProcLine = curProcLine.next();
	                                    curProcLine.toggleClass('current', false);
	                                    nextProcLine.toggleClass('current', true);
	                                    if (data.link && data.link != "" && typeof data.link == 'string' && data.link.length > 16) {
	                                        sendGaData('reg_success', function() {
												if (localStorage) {
													localStorage.setItem('already-client', registered_email);
													localStorage.removeItem('visitor-tracking');
													var new_tracking = [];
													new_tracking.push(`registered before as [${registered_type}] with email [${registered_email}] at [${registered_date}]`);
													localStorage.setItem('visitor-tracking', JSON.stringify(new_tracking));
												}
												setTimeout(function() {
													var domain = window.location.href;
													if (domain.includes('localhost')) {
														domain = 'icmarkets.com';
													} else if (domain.includes('icmarkets')) {
														domain = 'icmarkets' + domain.split('icmarkets')[1];
													}
													domain = domain.split('\.')[0];
	                                                clearAllStepsCookies(false);
	                                                var link = data.link;
	                                                if (link.indexOf('?') === -1) {
	                                                    link += '?regok=regok';
	                                                } else {
	                                                    link += '&regok=regok';
	                                                }
	                                                link = link.replace(/Upload\&regok\=regok/g, 'Upload%2f%3fliveregok');
													var _link = link.split('\.')
													var link_domain = _link[1];
													if (link_domain.includes('icmarkets') && domain != link_domain) {
														_link[1] = domain;
														link = _link.join('\.');
													}
	                                                $('.wp-icm-open-account.live .reg_modal_finish .link-to-personal-area').attr('href', link);
	                                                window.location = link;
	                                            }, 300);
	                                            $('.wp-icm-open-account.live .reg_overlay').fadeIn(0);
	                                        });
	                                    } else {
	                                        sendGaData('reg_success', function() {
	                                            clearAllStepsCookies(false);
												if (data.url && data.url != "error" && typeof data.url == 'string' && data.url.length > 16) {
													if (localStorage) {
														localStorage.setItem('already-client', registered_email);
														localStorage.removeItem('visitor-tracking');
														var new_tracking = [];
														new_tracking.push(`registered before as [${registered_type}] with email [${registered_email}] at [${registered_date}]`);
														localStorage.setItem('visitor-tracking', JSON.stringify(new_tracking));
													}
													$('.wp-icm-open-account.live .reg_modal_finish .link-to-personal-area').attr('href', data.url);
												}
	                                            $('.wp-icm-open-account.live .reg_modal_finish, .wp-icm-open-account.live .reg_overlay').fadeIn(0);
	                                        });
	                                    }
	                                } else if (data && data.status == 'error') {
	                                    sendGaData('reg_failure', function() {
	                                        var err = null;
	                                        var json = {};
	                                        try {
	                                            json = JSON.parse(data.error);
	                                        } catch(e) {
	                                            console.error('ERROR: unable to parse error description', e.message);
	                                        }

	                                        if (json['ErrorMessage']) {
	                                            err = json['ErrorMessage'];
	                                            if (json['Field']) {
	                                                err += ': ' + json['Field'];
	                                            }
	                                            if (json['Code']) {
	                                                err = '(' + json['Code'] + ') ' + err;
	                                            }
	                                        } else if (json.length > 1) {
	                                            err = '';
	                                            var errr = "";
	                                            for (var i = 0; i < json.length; i++) {
	                                                var item = json[i];
	                                                errr = item['ErrorMessage'];
	                                                if (item['Field']) {
	                                                    errr += ': ' + item['Field'];
	                                                }
	                                                if (item['Code']) {
	                                                    errr = '(' + item['Code'] + ') ' + errr;
	                                                }
	                                                err += errr + '<br>';
	                                            }
	                                        }
	                                        if (err) {
	                                            $('.wp-icm-open-account.live .reg_modal_fail .reg_modal_explain').html(err);
	                                        }
	                                        $('.wp-icm-open-account.live .reg_modal_fail, .wp-icm-open-account.live .reg_overlay').fadeIn(0);
											if (localStorage) {
												var pre_tracking = localStorage.getItem('visitor-tracking');
												if (pre_tracking) {
													pre_tracking = JSON.parse(pre_tracking);
												} else {
													pre_tracking = []
												}
												pre_tracking.push(`ERROR registration as [${registered_type}] with email [${registered_email}] at [${registered_date}]`);
												localStorage.setItem('visitor-tracking', JSON.stringify(pre_tracking));
											}
	                                    });
	                                }
	                            }).fail(function(data) {
	                                btn.removeAttr('disabled').removeClass('valid_wait');
	                                sendGaData('reg_failure', function() {
	                                    var resp = {};
	                                    var err = null;
	                                    if (data && data.responseText) {
	                                        try {
	                                            resp = JSON.parse(data.responseText);
	                                            err = resp['error']['ErrorMessage'];
	                                            if (resp['error']['Field']) {
	                                                err += ': ' + resp['error']['Field'];
	                                            }
	                                            if (resp['error']['Code']) {
	                                                err = '(' + resp['error']['Code'] + ') ' + err;
	                                            }
	                                        } catch (e) {
	                                            err = data.responseText;
	                                        }
	                                    } else {
	                                        var json = {};
	                                        try {
	                                            json = JSON.parse(data.error);
	                                        } catch(e) {
	                                            console.error('ERROR: unable to parse error description', e.message);
	                                        }

	                                        if (json['ErrorMessage']) {
	                                            err = json['ErrorMessage'];
	                                            if (json['Field']) {
	                                                err += ': ' + json['Field'];
	                                            }
	                                            if (json['Code']) {
	                                                err = '(' + json['Code'] + ') ' + err;
	                                            }
	                                        } else if (json.length > 1) {
	                                            err = '';
	                                            var errr = "";
	                                            for (var i = 0; i < json.length; i++) {
	                                                var item = json[i];
	                                                errr = item['ErrorMessage'];
	                                                if (item['Field']) {
	                                                    errr += ': ' + item['Field'];
	                                                }
	                                                if (item['Code']) {
	                                                    errr = '(' + item['Code'] + ') ' + errr;
	                                                }
	                                                err += errr + '<br>';
	                                            }
	                                        }
	                                    }
	                                    if (err) {
	                                        $('.wp-icm-open-account.live .reg_modal_fail .reg_modal_explain').html(err);
	                                    }
	                                    $('.wp-icm-open-account.live .reg_modal_fail, .wp-icm-open-account.live .reg_overlay').fadeIn(0);
										if (localStorage) {
											var pre_tracking = localStorage.getItem('visitor-tracking');
											if (pre_tracking) {
												pre_tracking = JSON.parse(pre_tracking);
											} else {
												pre_tracking = []
											}
											pre_tracking.push(`ERROR registration as [${registered_type}] with email [${registered_email}] at [${registered_date}]`);
											localStorage.setItem('visitor-tracking', JSON.stringify(pre_tracking));
										}
	                                });
	                            });
	                        });
	                        return false;
	                    }
	                    // });
	                } else {
	                    window['selectedAccountType'] = getSelectedAccountType();
	                    sendGaData('step' + curFormId, function() {
	                        var formSerialized = serializeFormToArray($(curForm).find('input'));
	                        Cookies.set('step_' + curFormId, JSON.stringify(formSerialized), { expires: 365 });
	                        Cookies.set('lastStep', curFormId, { expires: 365 });
	                        var $jointCountriesInput = $('.wp-icm-open-account.live #joint_countries');
							$('.wp-icm-open-account.live .islamic_check input').removeAttr('required');
							$('.wp-icm-open-account.live #reffer_id, .wp-icm-open-account.live #joint_reffer_id, .wp-icm-open-account.live #invitation_guid, .wp-icm-open-account.live #info, .wp-icm-open-account.live #joint_invitation_guid, .wp-icm-open-account.live #joint_info, .wp-icm-open-account.live #busaddr, .wp-icm-open-account.live #qq_id, .wp-icm-open-account.live #joint_qq_id, .wp-icm-open-account.live #qq_id_corporate').removeAttr('required');
							$('.wp-icm-open-account.live .fields_corporate input').removeAttr('required');

	                        if (curFormId == '2' && (formSerialized[0].value == 'joint' || window['selectedAccountType'] == 'joint')) {
	                            Cookies.set('jointSteps', 1, { expires: 365 });
	                        }
	                        if (curFormId == '2' && formSerialized[0].value == 'corporate') {
								document.querySelector('#trulioo_fields').style.display = 'none'
	                            var $countries2Input = $('.wp-icm-open-account.live #countries2');

								$('.wp-icm-open-account.live #selectAddressInput').removeAttr('required');
								$('.wp-icm-open-account.live #address').removeAttr('required');
								$('.wp-icm-open-account.live #city').removeAttr('required');
								$('.wp-icm-open-account.live #state').removeAttr('required');
								$('.wp-icm-open-account.live #zip_code').removeAttr('required');
								$('#selectAddressInput').removeAttr('required data-parsley-group').parent().removeClass('error');
								$('#selectAddressInput').parsley().reset();
	                            if ($countries2Input.val() === '') {
	                                var n = getCountryNameByCode(window['userLocationByIP'].countryCode);
	                                var cName = n.localized;
	                                var cOrig = n.orig;
	                                $countries2Input.val(cName);
	                                $countries2Input.attr('data-orig', cOrig);
	                                $countries2Input.attr('data-mlkey', n.mlkey);
									$('.wp-icm-open-account.live .cs-dn').focusout();
	                                fillPhoneCodeLabelByCountryName(cOrig, $('.wp-icm-open-account.live input#phone2'));
	                            }
								window['trulioo'] = false
								window['joint_trulioo'] = false
								window['truliooVerificationFields']={}
								document.querySelector('#trulioo_fields').innerHTML = ''
								document.querySelector('#trulioo_fields').style.display = 'none'
	                        }
							if(curFormId == '2' && formSerialized[0].value !== 'corporate'){
								document.querySelector('#trulioo_fields').style.display = 'block'
								$('.wp-icm-open-account.live #address').removeAttr('required');
							}
	                        if (curFormId == '1') {
								$('.compare-entities-wrap').hide();
								$('#container_paypal').hide();
								$('#container_facebook').hide();
								$('#container_google').hide();
								$('#container_apple').hide();
								$('.signup-buttons-header').hide();
								$('#containers-wrap').hide();
								$('.disallowed-changes-by-paypal').toggleClass('disallowed-changes-by-paypal', false);
								$(`#zip_code`).removeAttr('required');
								if(window['trulioo']){
									$(`#address`).removeAttr('required');
									$('#trulioo_fields').find('input').removeAttr('required');
								}
	                        }
	                        if (curFormId == '1') {
								var $countriesInput = $('.wp-icm-open-account.live #countries');
								if ($countriesInput && $countriesInput.val()) {
									var country_orig = $countriesInput.attr('data-orig');
									if (country_orig === 'China') {
										$('.qq-wrap').show();
									} else {
										$('.qq-wrap').hide();
									}

									if(window['previous_country']==="" || window['previous_country'] !== $countriesInput.val()){
										if (country_orig === 'Canada') {
											disableAddressAutoCompletion("individual");
										} else {
											initAddressAutoCompletion("individual");
										}
										window['previous_country'] = $countriesInput.val()
									}else if(document.querySelector('#selectAddressWrapperBox').style.display == 'none'){
										$('#selectAddressInput').removeAttr('required');
										$('#selectAddressInput').parsley().removeError("addressNotSelected");
										$('#selectAddressInput').parent().addClass("success").removeClass("error");
									}
								}
	                        }
	                        if (curFormId == '5') {
								var $countriesInput = $('.wp-icm-open-account.live #countries');
								if ($countriesInput && $countriesInput.val()) {
									var country_orig = $countriesInput.attr('data-orig');
									if (country_orig === 'China') {
										$('.qq-wrap').show();
									} else {
										$('.qq-wrap').hide();
									}
								}
	                        }

	                        if (curFormId == '2') {
	                            var isIslamicChecked = $('.wp-icm-open-account.live .islamic_check input')[0].checked;
								createTradePlatformAndAccountTypeControls(null, $('#step_3 .trade-platforms'), $('#step_3 .account-types'), $('#branch_id').attr('data-orig'), isIslamicChecked);
								createButtonsInputs($('.wp-icm-open-account.live #step_3 .trade-platforms .select_btn, .wp-icm-open-account.live #step_3 .account-types .select_btn'));
								mountBranchedControls($('.wp-icm-open-account.live #step_3'));
								initCurrenciesList(false);
	                            tryHardSelectTradePlatformAndAccountType($('.wp-icm-open-account.live #step_3'));
	                        }
	                        if (curFormId == '5' && ($jointCountriesInput.length || window['selectedAccountType'] == 'joint')) {
	                            btn.removeAttr('disabled').removeClass('valid_wait');
								mountBranchedControls($('.wp-icm-open-account.live #step_6'), true);
	                            if ($jointCountriesInput.val() === '') {
									// WEB-1079 (for branching joint part by default)
									// 1. Set the same country like in step #1
									// 2. Set the same branch like in step #1
									// 3. Disable or hide the Branch Selector
									// 4. Remove from the countries list unsupported items by selected branch
									var step1country_name = $('#countries').val();
                                    var step1country_orig = $('#countries').attr('data-orig');
                                    var step1country_mlkey = $('#countries').attr('data-mlkey');
                                    var step1branch = $('#branch_id').attr('data-orig');

									window['joint_country_code'] = window['country_code'];
                                    $jointCountriesInput.val(step1country_name);
                                    $jointCountriesInput.attr('data-orig', step1country_orig);
                                    $jointCountriesInput.attr('data-mlkey', step1country_mlkey);
                                    $jointCountriesInput.focusout();
                                    fillPhoneCodeLabelByCountryName(step1country_orig, $('.wp-icm-open-account.live input#joint_phone'));
									if (step1country_name) {
										var $jointNationalityInput = $('.wp-icm-open-account.live #joint_nationality');
										$jointNationalityInput.val(step1country_name);
										$jointNationalityInput.attr('data-orig', step1country_orig);
										$jointNationalityInput.attr('data-mlkey', step1country_mlkey);
										$jointNationalityInput.focusout();
									}
                                    var jointCountryObject = null;
                                    if ($jointCountriesInput.val()) {
                                        jointCountryObject = getCountryObjectByName(step1country_orig);
                                    }
                                    if (jointCountryObject) {
                                    	initBranchesList(jointCountryObject, $('#joint_branchesList'));
                                        setBranch($('#joint_branch_id'), jointCountryObject.code, step1branch, true);
                                    } else {
                                        setBranch($('#joint_branch_id'), window['userLocationByIP'].countryCode, null, true);
									}
									$('.input_group.input.branch-select').attr('style', 'pointer-events:none; opacity:0.5; display: none;')
									hideUnsupportedCountriesByBranch($('#joint_countries'), step1branch);
								}

								// Handle navigation among steps - reset Trulioo identity fields as joint_countries is always set to the same as individual countries when navigating
								resetTruliooFields('joint')
								let cCode = window['joint_country_code']
								if(isTruliooEnabled(cCode) && window['identityCountries'].includes(cCode)){
									window['joint_trulioo'] = true

									getTruliooFieldsAndConsents(cCode, 'joint');
								}else{
									window['joint_trulioo'] = false
								}

								$('.compare-entities-wrap').show();
								$('#container_paypal').hide();
								$('#container_facebook').hide();
								$('#container_google').hide();
								$('#container_apple').hide();
								$('.signup-buttons-header').hide();
								$('#containers-wrap').hide();

								if (cCode === 'CA') {
									disableAddressAutoCompletion("joint");
								} else {
									initAddressAutoCompletion("joint");
								}
	                        }

	                        if (curFormId == '6') {
								$('.compare-entities-wrap').hide();
								$('#container_paypal').hide();
								$('#container_facebook').hide();
								$('#container_google').hide();
								$('#container_apple').hide();
								$('.signup-buttons-header').hide();
								$('#containers-wrap').hide();
								createTradePlatformAndAccountTypeControls('joint', $('#step_7 .trade-platforms'), $('#step_7 .account-types'), $('#joint_branch_id').attr('data-orig'));
								createButtonsInputs($('.wp-icm-open-account.live #step_7 .trade-platforms .select_btn, .wp-icm-open-account.live #step_7 .account-types .select_btn'));
								mountBranchedControls($('.wp-icm-open-account.live #step_7'), true);
								// pre-fill from the main and disable joint Currency selector (WEB-1387)
								initCurrenciesList(true);
								$('.wp-icm-open-account.live #joint_currency').closest('.input_group').toggleClass('disallow-to-change', true);
								// pre-fill from the main and disable joint TP & AT controls (WEB-1387)
	                            tryHardSelectTradePlatformAndAccountType($('.wp-icm-open-account.live #step_7'), true);
	                        }

							if (curFormId == '3') {
								var $islamic_declaration_wrap = $('.wp-icm-open-account.live .islamic_declaration_wrap');
								var $islamic_declaration_input = $('.wp-icm-open-account.live .islamic_declaration_wrap input');
								if ($('[name=reg_type]').val() === 'individual' && $('#islamic').length && $('#islamic')[0].checked === true) {
									$islamic_declaration_input.attr('required', 'required');
									$islamic_declaration_input.removeAttr('data-notrequired');
									$islamic_declaration_wrap.show();
								} else {
									$islamic_declaration_input.attr('data-notrequired', 'yes');
									$islamic_declaration_input.removeAttr('required');
									$islamic_declaration_wrap.hide();
								}
							}

							var alreadySavedSimpleBefore = false;

							if (curFormId == '1') collectUnsupportedAndDisallowedCountriesLive();
	                        if ((curFormId == '1' && window['unsupportedCountries'].indexOf($countriesInput.val()) != -1 || curFormId == '5' && window['unsupportedCountries'].indexOf($joint_countriesInput.val()) != -1) || (curFormId == '1' && window['disallowedCountries'].indexOf($countriesInput.val()) != -1 || curFormId == '4' && window['disallowedCountries'].indexOf($joint_countriesInput.val()) != -1)) {
	                            // already saved Simple Customer before Unsupported or Disallowed popup show!
	                            alreadySavedSimpleBefore = true;
	                        }

	                        // save silently SimpleCustomer on first step
	                        if (curFormId == '1' && window['selectedAccountType'] == 'simple' && !alreadySavedSimpleBefore) {
	                            var $info = $('.wp-icm-open-account.live #info');
	                            if (Cookies.get('tracking_referer')) {
	                                $info.val('Come from: IP[' + window['userLocationByIP'] + '] REFERER[' + Cookies.get('tracking_referer') + ']');
	                            }
	                            var form = serializeForm();
	                            // btn = $(_that);
	                            if ($('.wp-icm-open-account.live form').parsley().validate({ group: 'block-' + block })) {
	                                btn.addClass('valid_wait').attr('disabled', 'disabled');
	                                getSignTokenLive().then(function(token) {
	                                    form = form + '&ip=' + window['userIP'] + '&ip_country=' + window['countryByIP'] + '&request_from=' + window['request_from'] + '&sign=' + token;
	                                    $.ajax({
	                                        type: 'POST',
	                                        url: window['serverURL'] + '',
	                                        dataType: "json",
	                                        data: form
	                                    }).done(function(data) {
	                                        btn.removeAttr('disabled').removeClass('valid_wait');
	                                    }).fail(function(data) {
	                                        btn.removeAttr('disabled').removeClass('valid_wait');
	                                    });
	                                });
	                            }
	                        } else if (curFormId != '1' && window['selectedAccountType'] != 'simple') {
	                            // all other steps we can update already stored SimpleCustomer by save some
	                            // info into Comments field (may be important for sales department)
	                            var $info = $('.wp-icm-open-account.live #info');
	                            var details = '';
	                            var accountMode = window['selectedAccountType'].toUpperCase();
	                            var stepsCount = 5;
	                            if (accountMode == 'JOINT') {
	                                stepsCount = 9;
	                            }
	                            switch (curFormId) {
	                                case 2:
	                                    details = 'account mode: ' + accountMode + '; ';
	                                    break;
	                                case 3:
	                                    var tradingPlatform = getTradingPlatformNameById(getFilledFormValueByName('trading_platform'));
	                                    var accountType = getAccountTypeNameById(getFilledFormValueByName('account_type'));
	                                    var currency = getFilledFormValueByName('currency');
	                                    details = 'trading platform: ' + tradingPlatform + '; ';
	                                    details += 'trading account type: ' + accountType + '; ';
	                                    details += 'currency: ' + currency + '; ';
	                                    break;
	                                case 6:
	                                    var email = getFilledFormValueByName('joint_email');
	                                    var first = getFilledFormValueByName('joint_first_name');
	                                    var last = getFilledFormValueByName('joint_last_name');
	                                    var phone = getFilledFormValueByName('joint_phone');
	                                    details = 'joint email: ' + email + '; ';
	                                    details += 'joint first name: ' + first + '; ';
	                                    details += 'joint last name: ' + last + '; ';
	                                    details += 'joint phone: ' + phone + '; ';
	                                    break;
	                                case 7:
	                                    var tradingPlatform = getTradingPlatformNameById(getFilledFormValueByName('joint_trading_platform'));
	                                    var accountType = getAccountTypeNameById(getFilledFormValueByName('joint_account_type'));
	                                    var currency = getFilledFormValueByName('joint_currency');
	                                    details = 'joint trading platform: ' + tradingPlatform + '; ';
	                                    details += 'joint trading account type: ' + accountType + '; ';
	                                    details += 'joint currency: ' + currency + '; ';
	                                    break;
	                            }
	                            details += 'filled step ' + curFormId + ' from ' + stepsCount + '.';
	                            $info.val(details);
	                            var form = serializeForm();
	                            // btn = $(_that);
	                            if ($('.wp-icm-open-account.live form').parsley().validate({ group: 'block-' + block })) {
	                                btn.addClass('valid_wait').attr('disabled', 'disabled');
	                                getSignTokenLive().then(function(token) {
	                                    form = form + '&ip=' + window['userIP'] + '&ip_country=' + window['countryByIP'] + '&request_from=' + window['request_from'] + '&sign=' + token;
	                                    $.ajax({
	                                        type: 'POST',
	                                        url: window['serverURL'] + '',
	                                        dataType: "json",
	                                        data: form
	                                    }).done(function(data) {
	                                        btn.removeAttr('disabled').removeClass('valid_wait');
	                                    }).fail(function(data) {
	                                        btn.removeAttr('disabled').removeClass('valid_wait');
	                                    });
	                                });
	                            }
	                        }
							if(curFormId == '5' && window['trulioo']){
								$(`#joint_zip_code`).removeAttr('required');
								$('#joint_trulioo_fields').find('input').removeAttr('required');
								window['joint_trulioo']=true
							}

	                        $('.wp-icm-open-account.live .register_form').find('input').removeAttr('required');
	                        if (!$('.wp-icm-open-account.live input[id*="mail"]').hasClass('waiting_validation')) {
	                            curForm.fadeOut('fast', function() {
	                                setTimeout(function() {
	                                    curProcLine.removeClass('current');
	                                }, 50);
	                                setTimeout(function() {
	                                    curProcLine.addClass('complete');
	                                }, 150);
									$('.wp-icm-open-account.live input[type="checkbox"]').removeAttr('required');
	                                nextForm.fadeIn('fast', function() {
	                                    $('body,html').animate({
	                                        scrollTop: $('.page-content-container').offset().top - 150
	                                    }, 600);
	                                }).addClass('active_step').find('input').attr('required', '');
									setTimeout(function() {
										$('.wp-icm-open-account.live .australian_test_wrap input').removeAttr('required');
										$('.wp-icm-open-account.live #reffer, .wp-icm-open-account.live #newsletter, .wp-icm-open-account.live #joint_reffer, .wp-icm-open-account.live #joint_newsletter, .wp-icm-open-account.live #reffer_id, .wp-icm-open-account.live #joint_reffer_id, .wp-icm-open-account.live #invitation_guid, .wp-icm-open-account.live #info, .wp-icm-open-account.live #joint_invitation_guid, .wp-icm-open-account.live #joint_info, .wp-icm-open-account.live #busaddr, .wp-icm-open-account.live #qq_id, .wp-icm-open-account.live #joint_qq_id, .wp-icm-open-account.live #qq_id_corporate').removeAttr('required');
										$('.wp-icm-open-account.live .australian_test_wrap input').removeAttr('required');

										if ($('.wp-icm-open-account.live #joint_countries').attr('data-orig') !== 'Canada') {
											$('.wp-icm-open-account.live #joint_states').removeAttr('required');
										}

										var $acknowledgment = $('#acknowledgment');
										var branch = $('body').attr('data-branch') || 1;
										var countryObject = getCountryObjectByName($('#countries').attr('data-orig'));
										if (curFormId == '6') {
											$acknowledgment = $('#joint_acknowledgment');
											countryObject = getCountryObjectByName($('#joint_countries').attr('data-orig'));
										}
										var $acknowledgment_wrap = $acknowledgment.parent();

										var countryCode = countryObject ? countryObject.code : 0;
										if (!(!window['isItCySECWebSite'] && branch != 2 && window['cysecCountriesString'].indexOf(countryCode.toLowerCase()) !== -1)) {
											$acknowledgment_wrap.find('label').html('');
											$acknowledgment.removeAttr('required');
											$acknowledgment_wrap.hide();
										}

										var $islamic_declaration_input = $('.wp-icm-open-account.live .islamic_declaration_wrap input');
										if ($islamic_declaration_input.attr('data-notrequired')) {
											$islamic_declaration_input.removeAttr('required');
										}
										$('.wp-icm-open-account.live .islamic_check input').removeAttr('required');
										$('.wp-icm-open-account.live #reffer_id, .wp-icm-open-account.live #joint_reffer_id, .wp-icm-open-account.live #invitation_guid, .wp-icm-open-account.live #info, .wp-icm-open-account.live #joint_invitation_guid, .wp-icm-open-account.live #joint_info, .wp-icm-open-account.live #busaddr, .wp-icm-open-account.live #qq_id, .wp-icm-open-account.live #joint_qq_id, .wp-icm-open-account.live #qq_id_corporate').removeAttr('required');
										$('.wp-icm-open-account.live .fields_corporate input').removeAttr('required');
										btn.removeAttr('disabled').removeClass('valid_wait');
									}, 50);
									nextProcLine.addClass('current');

									if (curFormId == '1') {
										// $('div[data-value="individual"]').click();
										$(`div[data-value="${alreadySelectedRegType}"]`).click();
										if(document.querySelector('#selectAddressWrapperBox').style.display == 'none'){
											$('#selectAddressInput').removeAttr('required');
											$('#selectAddressInput').parsley().removeError("addressNotSelected");
											$('#selectAddressInput').parent().addClass("success").removeClass("error");
										}
									}
	                            }).removeClass('active_step');
	                        }

							if ($('.wp-icm-open-account.live button.final-submit').is(':visible')) {
								$('.wp-icm-open-account.live #i_agree_with_all_of_above').attr('required', 'required');
							} else {
								$('.wp-icm-open-account.live #i_agree_with_all_of_above').removeAttr('required');
							}
	                    });
	                }
	            }
	        } else {
				if (curFormId == '3') {
					if ($('.account-types').hasClass('error')) {
						$('.account-types .parsley-errors-list').remove();

						var message = 'This value is required';
							$errorMessage = $(`<ul class="parsley-errors-list filled" id="parsley-id-multiple-account_type" aria-hidden="false">
							<li class="parsley-addtional-question">${message}</li>
							</ul>`);
						$('.account-type-button').eq(4).after($errorMessage);
						$('.account-type-button').eq(4).addClass('parsley-error');
					} else {
						$('.account-types .parsley-errors-list').remove();
					}
				} else if (curFormId == '5' || curFormId == '9') {
					$('.trading_exp > .parsley-errors-list').remove();

					var message = 'This value is required';
						$errorMessage = $(`<ul class="parsley-errors-list filled" id="parsley-id-multiple-account_type" aria-hidden="false">
						<li class="parsley-addtional-question">${message}</li>
						</ul>`);

					$('.trading_exp').children('.select_btn').eq(2).after($errorMessage);
					$('.trading_exp').children('.select_btn').eq(2).addClass('parsley-error');

					if (curFormId == '9') {
						$('.trading_exp').children('.select_btn').eq(5).after($errorMessage);
						$('.trading_exp').children('.select_btn').eq(5).addClass('parsley-error');
					}
				}
			}
			if($('#trulioo_fields').find('div').hasClass('error') && $('#trulioo_fields').find('ul').length == 0){
				$('#nationalId').after(`<ul class="parsley-errors-list filled" id="parsley-id-1364" aria-hidden="false"><li class="parsley-pattern">The value seems to be invalid, it should be 11 digits</li></ul>`)
				$('#trulioo_fields').find('input').addClass('parsley-error')
			}
			if($('#joint_trulioo_fields').find('div').hasClass('error') && $('#joint_trulioo_fields').find('ul').length == 0){
				$('#joint_nationalId').after(`<ul class="parsley-errors-list filled" id="parsley-id-1364" aria-hidden="false"><li class="parsley-pattern">The value seems to be invalid, it should be 11 digits</li></ul>`)
				$('#joint_trulioo_fields').find('input').addClass('parsley-error')
			}
	    });

	    $('.wp-icm-open-account.live .reg_lang').addClass('closed').on('click', function() {
	        $('.wp-icm-open-account.live .reg_lang').removeClass('closed').addClass('opened');
	    });
	    $('.wp-icm-open-account.live .register_form').each(function(index, section) {
	        $(section).find('input').attr({
	            'data-parsley-group': 'block-' + index,
	            'autocomplete': 'off',
	            'data-parsley-validation-threshold': '0',
	            'data-parsley-trigger': 'keyup change'
	        });
	    });
	    $('.wp-icm-open-account.live form').parsley({
	        'data-parsley-focus': 'none'
	    });
	    $('.wp-icm-open-account.live .fields_corporate input, .wp-icm-open-account.live .fields_joint input').removeAttr('data-parsley-group');

	    var referFriendGuid = Cookies.get('invitation_guid');
	    var $referFriendGuid = $('.wp-icm-open-account.live #invitation_guid');
	    if (referFriendGuid && $referFriendGuid.length) {
	        $referFriendGuid.val(referFriendGuid);
	    }

		window['selectedAccountType'] = null;
		clearAllStepsCookies(false);
	    goToStep(1);

	    function goToStep(id, forceBack){
	        if (Cookies.get('au_test_block')) {
	            $('.wp-icm-open-account.live .reg_modal_block, .wp-icm-open-account.live .reg_overlay').fadeIn();
	            $('.wp-icm-open-account.live .main_register_wrap').addClass('disabled');
	            return false;
	        }
	        $('.wp-icm-open-account.live .register_form').fadeOut(0).removeClass('active_step').find('input').removeAttr('required');
	        $('.wp-icm-open-account.live .register_form[data-n="' + id + '"]').fadeIn(0)
	            .addClass('active_step')
	            .find('input').each(function() {
	                $(this).attr('required', '');
	            });
	        $('.wp-icm-open-account.live input[type="checkbox"]').removeAttr('required');
	        $('.wp-icm-open-account.live #reffer_id, .wp-icm-open-account.live #joint_reffer_id, .wp-icm-open-account.live #busaddr').removeAttr('required');
	        $('.wp-icm-open-account.live .fields_corporate input').removeAttr('required');
	        $('.wp-icm-open-account.live .australian_test_wrap input').removeAttr('required');
	        $('.wp-icm-open-account.live .process_line').removeClass('complete').removeClass('current');

	        for (var i = 0; i < id; i++) {
	            $('.wp-icm-open-account.live.steps_container .process_line[data-n="' + i + '"]').addClass('complete');
	            $('.wp-icm-open-account.live:not(.steps_container) .process_line[data-n="' + i + '"]').addClass('complete');
	        }
	        $('.wp-icm-open-account.live .process_line:first-child').addClass('complete');
	        $('.wp-icm-open-account.live .process_line[data-n="' + id + '"]').addClass('current');
	        $('.wp-icm-open-account.live #invitation_guid').removeAttr('required');
	        $('.wp-icm-open-account.live #info').removeAttr('required');
	        $('.wp-icm-open-account.live #joint_invitation_guid').removeAttr('required');
	        $('.wp-icm-open-account.live #joint_info').removeAttr('required');
	        // $('body,html').animate({
	        //     scrollTop: $('.page-content-container').offset().top - 50
	        // }, 400);

			$('.wp-icm-open-account.live #qq_id').removeAttr('required');
			$('.wp-icm-open-account.live #joint_qq_id').removeAttr('required');
			$('.wp-icm-open-account.live .islamic_check input').removeAttr('required');
			if ($('.wp-icm-open-account.live button.final-submit').is(':visible')) {
				$('.wp-icm-open-account.live #i_agree_with_all_of_above').attr('required', 'required');
			} else {
				$('.wp-icm-open-account.live #i_agree_with_all_of_above').removeAttr('required');
			}

			$('.wp-icm-open-account.live .cs-dn').focusout();
	        if (id === 1) {
				$('form [name="reg_type"]').each(function () { $(this)[0].checked = false});
				$('form .select_btn[data-id="reg_type"]').toggleClass('selected', false);
				$('form .select_btn[data-id="reg_type"]').parent().toggleClass('success', false);

	            referFriendGuid = Cookies.get('invitation_guid');
	            $referFriendGuid = $('.wp-icm-open-account.live #invitation_guid');
	            if (referFriendGuid && $referFriendGuid.length) {
	                $referFriendGuid.val(referFriendGuid);
	            }

				if (window.location.pathname.includes("eu") || window.location.pathname.includes("au") || window.location.pathname.includes("intl") || window.location.pathname.includes("uk") || window.location.hostname.includes("eu") || window.location.hostname.includes("uk")) {
					$('.wp-icm-open-account .input_group.reffer_id #reffer_id').val('');

					if (Cookies.get('camp')) {
						Cookies.remove('camp');
					}
				} else {
					var camp = Cookies.get('camp');
					var $ref = $('.wp-icm-open-account.live #reffer_id');
					if (camp && $ref.length) {
						camp = camp.replace(/\D/g, ''); // strip non-digits
						$ref.val(camp);
						$ref.parent().toggleClass('has-label', true);
						$('.wp-icm-open-account.live .reffer_check input').prop('checked', true).change();
					}
				}

	            var cName;
	            var $input;
	            var $countriesInput = $('.wp-icm-open-account.live #countries');
	            if ($countriesInput.val() === '' && !($('html').is('.bs-host-1') && window['countryFrom'] == 'au')) {
	            	var cCode = window['userLocationByIP'].countryCode;
					if (window['isSupportedCurrentBranch'] !== '1') {
						// Auto prefill even not allowed countries (ex. Australia on CySEC)
						// cCode = window['suggestedCountry'].toUpperCase();
					}
					if (Cookies.get('reg_force_country')) {
						cCode = Cookies.get('reg_force_country').toUpperCase();
						Cookies.remove('reg_force_country');
					}
					if (cCode) {
						var n = getCountryNameByCode(cCode);
						var cName = n.localized;
						var cOrig = n.orig;
						$countriesInput.val(cName);
						$countriesInput.attr('data-orig', cOrig);
						$countriesInput.attr('data-mlkey', n.mlkey);
						$countriesInput.focusout();
						fillPhoneCodeLabelByCountryName(cOrig);

						var countryObject;
						countryObject = getCountryObjectByName(cOrig);
						initBranchesList(countryObject, $('#branchesList'));
						var sg_branch = null;
						if (Cookies.get('regulator')) {
							sg_branch = Cookies.get('regulator');

							var isSelectedBranchAllowedForSelectedCountry = false;
							var country = window['serverCountries'].find(function (item) {
								return item && item.code === cCode;
							});
							if (country && country.branching) {
								var selectedBranchForSelectedCountry = country.branching.find(function (item) {
									return item && item.branch === sg_branch;
								});
								if (selectedBranchForSelectedCountry && selectedBranchForSelectedCountry.status !== '4') {
									isSelectedBranchAllowedForSelectedCountry = true;
								}
							}
						}
						setBranch($('.wp-icm-open-account.live #branch_id'), cCode, sg_branch, true);
						let countryCode = cCode.toLowerCase();
						window['country_code'] = cCode
						window['joint_country_code'] = cCode
						toggleRefferControls(countryCode);

						resetTruliooFields('individual')
						if(isTruliooEnabled(cCode) && window['identityCountries'].includes(cCode)){
							window['trulioo'] = true
							window['joint_trulioo'] = true

							getTruliooFieldsAndConsents(cCode, 'individual');
						}else{
							window['trulioo'] = false
							window['joint_trulioo'] = false
						}

						showPopupModalIfNeeded(countryCode);
					}
				}
	            if (Cookies.get('sideget_FirstName')) {
	                $input = $('.wp-icm-open-account.live #first_name');
	                $input.val(decodeURIComponent(Cookies.get('sideget_FirstName')));
	                $input.parent().toggleClass('has-label', true);
	                Cookies.remove('sideget_FirstName');
	            }
	            if (Cookies.get('sideget_LastName')) {
	                $input = $('.wp-icm-open-account.live #last_name');
	                $input.val(decodeURIComponent(Cookies.get('sideget_LastName')));
	                $input.parent().toggleClass('has-label', true);
	                Cookies.remove('sideget_LastName');
	            }
	            if (Cookies.get('sideget_Email')) {
	                $input = $('.wp-icm-open-account.live #email');
	                $input.val(decodeURIComponent(Cookies.get('sideget_Email')));
	                $input.parent().toggleClass('has-label', true);
	                Cookies.remove('sideget_Email');
	            }
	            if (Cookies.get('sideget_Country')) {
	                Cookies.remove('sideget_Country');
	            }
	            if (Cookies.get('sideget_Phone1')) {
	                $input = $('.wp-icm-open-account.live #phone');
	                var code = $input.val();
	                var number = decodeURIComponent(Cookies.get('sideget_Phone1'));
	                if (number.indexOf('+') == -1) {
	                    number = code + number;
	                }
	                $input.val(number);
	                $input.parent().toggleClass('has-label', true);
	                Cookies.remove('sideget_Phone1');
	            }
				if (Cookies.get('force_next')) {
					Cookies.remove('force_next');
					$nextButton = $('.wp-icm-open-account.live .main_register_wrap #step_1 .next_btn button');
					setTimeout(function () {
						$nextButton.click();
					}, 500);
				}
	        } else if (id == 2) {
				if(document.querySelector('#selectAddressWrapperBox').style.display == 'none'){
					$('.wp-icm-open-account.live #selectAddressInput').removeAttr('required');
					$('#selectAddressInput').parsley().removeError("addressNotSelected");
					$('#selectAddressInput').parent().addClass("success").removeClass("error");
				}
				if(window['trulioo']){
					$(`#zip_code`).removeAttr('required');
					$('#address').removeAttr('required');
					$('#trulioo_fields').find('input').removeAttr('required');
				}
	            var $countries2Input = $('.wp-icm-open-account.live #countries2');

	            if ($countries2Input.val() === '') {
	                var n = getCountryNameByCode(window['userLocationByIP'].countryCode);
	                var cName = n.localized;
	                var cOrig = n.orig;
	                $countries2Input.val(cName);
	                $countries2Input.attr('data-orig', cOrig);
	                $countries2Input.attr('data-mlkey', n.mlkey);
					$('.wp-icm-open-account.live .cs-dn').focusout();
	                fillPhoneCodeLabelByCountryName(cOrig, $('.wp-icm-open-account.live input#phone2'));
				}

				if (alreadySelectedRegType == 'corporate') {
					$('.wp-icm-open-account.live #selectAddressInput').removeAttr('required');
					$('.wp-icm-open-account.live #address').removeAttr('required');
					$('.wp-icm-open-account.live #city').removeAttr('required');
					$('.wp-icm-open-account.live #state').removeAttr('required');
					$('.wp-icm-open-account.live #zip_code').removeAttr('required');
					$('#selectAddressInput').removeAttr('required data-parsley-group').parent().removeClass('error');
					$('#selectAddressInput').parsley().reset();
				}
				$('.wp-icm-open-account.live .cs-dn').focusout();
				$(`div[data-value="${alreadySelectedRegType}"]`).click();
	        } else if (id === 3) {
	            var $currencyInput = $('.wp-icm-open-account.live #currency');
	            if ($currencyInput.val() === '') {
	                var defaultCurrency = alreadySelectedCurrency; // 'USD'
	                $currencyInput.val(defaultCurrency);
	                $currencyInput.attr('data-orig', defaultCurrency);
	                $currencyInput.parent().addClass('has-label');
	            }
				tryHardSelectTradePlatformAndAccountType($('.wp-icm-open-account.live #step_3'));
			} else if (id === 5) {
				if(window['joint_trulioo']){
					$(`#joint_zip_code`).removeAttr('required');
					$('#joint_trulioo_fields').find('input').removeAttr('required');
				}
				var $islamic_declaration_wrap = $('.wp-icm-open-account.live .islamic_declaration_wrap');
				var $islamic_declaration_input = $('.wp-icm-open-account.live .islamic_declaration_wrap input');
				if ($('[name=reg_type]').val() === 'individual' && $('#islamic').length && $('#islamic')[0].checked === true) {
					$islamic_declaration_input.attr('required', 'required');
					$islamic_declaration_wrap.show();
				} else {
					$islamic_declaration_input.removeAttr('required');
					$islamic_declaration_wrap.hide();
				}
			} else if (id === 6) {
				var $jointCountriesInput = $('.wp-icm-open-account.live #joint_countries');
				var $jointNationalityInput = $('.wp-icm-open-account.live #joint_nationality');

				if ($jointCountriesInput.val() === '') {
					var n = getCountryNameByCode(window['userLocationByIP'].countryCode);
					var cName = n.localized;
					var cOrig = n.orig;
					$jointCountriesInput.val(cName);
					$jointCountriesInput.attr('data-orig', cOrig);
					$jointCountriesInput.attr('data-mlkey', n.mlkey);
					$jointCountriesInput.focusout();
					fillPhoneCodeLabelByCountryName(cOrig, $('.wp-icm-open-account.live input#joint_phone'));

					$jointNationalityInput.val(cName);
					$jointNationalityInput.attr('data-orig', cOrig);
					$jointNationalityInput.attr('data-mlkey', n.mlkey);
					$jointNationalityInput.focusout();

					var jointCountryObject;
					jointCountryObject = getCountryObjectByName(cOrig);
					initBranchesList(jointCountryObject, $('#joint_branchesList'));
					setBranch($('.wp-icm-open-account.live #joint_branch_id'), window['userLocationByIP'].countryCode, null, true);
				}
				$('.wp-icm-open-account.live .cs-dn').focusout();
			} else if (id === 7) {
	            var $currencyInput = $('.wp-icm-open-account.live #joint_currency');
	            if ($currencyInput.val() === '') {
	                var defaultCurrency = alreadySelectedCurrency; // 'USD';
	                $currencyInput.val(defaultCurrency);
	                $currencyInput.attr('data-orig', defaultCurrency);
	                $currencyInput.parent().addClass('has-label');
	            }
				tryHardSelectTradePlatformAndAccountType($('.wp-icm-open-account.live #step_6'));
	        }
	    }

	    function getCountryNameByCode(countryCode, isFromAll) {
	        var countries = isFromAll ? window['allCountries'] : window['serverCountries'];
	        var orig = window['userLocationByIP'].countryName; // default from IP location
	        var localized = orig;
	        var mlkey = 'reg_form_country_';
	        if (countries && countries.length) {
	            for (var i = 0, len = countries.length; i < len; i++) {
	                var countryObject = countries[i];
	                if (countryObject && countryObject.code === countryCode) {
	                    orig = countryObject.name; // from server countries list
	                    localized = orig;
	                    mlkey += countryCode;
	                    break;
	                }
	            }
	        }
	        return {
	            orig: orig,
	            localized: localized,
	            mlkey: mlkey
	        };
	    }
		window.getCountryNameByCode = getCountryNameByCode;

	    $(document).on('click', '.wp-icm-open-account.live .reg_overlay, .wp-icm-open-account.live .reg_modal_close_btn', function() {
	        if (!$('.wp-icm-open-account.live .main_register_wrap').hasClass('disabled')) {
	            $('.wp-icm-open-account.live .reg_modal_continue, .wp-icm-open-account.live .reg_overlay, .wp-icm-open-account.live .reg_modal_test, .wp-icm-open-account.live .reg_modal_fail').fadeOut();
	            if ($('.reg_modal_finish').css('display') !== 'none') {
	                window['selectedAccountType'] = null;
	                clearAllStepsCookies(true);
	            }
	        }
	    }).on('click', '#fail_try_again', function() {
	        window['selectedAccountType'] = null;
	        $('.wp-icm-open-account.live .reg_modal_fail').fadeOut();
	        clearAllStepsCookies(true);
	    });

	    function clearAllStepsCookies(force_reload_page) {
	        if (typeof force_reload_page == 'undefined') {
	            force_reload_page = true;
	        }
	        Cookies.remove('au_test');
	        Cookies.remove('au_test_block');
	        Cookies.remove('lastStep');
	        Cookies.remove('jointSteps');
	        Cookies.remove('step_1');
	        Cookies.remove('step_2');
	        Cookies.remove('step_3');
	        Cookies.remove('step_4');
	        Cookies.remove('step_5');
	        Cookies.remove('step_6');
	        Cookies.remove('step_7');
			Cookies.remove('step_8');
	        Cookies.remove('step_9');
	        if (force_reload_page) {
				$('.wp-icm-open-account.live form').find('input').val('');
				window.location.reload(true); // for initialize form properly
	        }
	    }

	    window.Parsley.on('field:error', function() {
	        if (this.$element.parent().find('li').hasClass('parsley-emailUsed'))
	            this.$element.parent().find('li.parsley-emailUsed').remove();
	        if (this.$element.parent().hasClass('select_btn')) {
	            this.$element.parent().parent().addClass('error').removeClass('success');
	        } else {
	            this.$element.parent().addClass('error').removeClass('success');
	        }
	    });

	    window.Parsley.on('field:success', function() {
	        if (this.$element.parent().hasClass('select_btn')) {
	            this.$element.parent().parent().removeClass('error').addClass('success');
				if ($('.account-types').hasClass('success')) {
					$('.account-types .parsley-errors-list').remove();
				}
	        } else {
	            this.$element.parent().removeClass('error').addClass('success');
	        }
	    });

	    window.Parsley.on('form:error', function() {
	        $('html,body').animate({
	            scrollTop: $('.wp-icm-open-account.live .error:eq(0)').offset().top - 250
	        }, 'fast', function(){
	            $('.wp-icm-open-account.live .error:eq(0) input').focus();
	        });
	    });

	    $(window).on('load', function() {
	        var regexps = {
	                'chrome': [/Chrome\/(\S+)/],
	                'firefox': [/Firefox\/(\S+)/],
	                'msie': [/MSIE (\S+);/],
	                'opera': [
	                    /Opera\/.*?Version\/(\S+)/, /* Opera 10 */
	                    /Opera\/(\S+)/ /* Opera 9 and older */
	                ],
	                'safari': [/Version\/(\S+).*?Safari\//]
	            },
	            re, m, browser;

	        var userAgent = navigator.userAgent;

	        for (browser in regexps)
	            while (re = regexps[browser].shift())
	                if (m = userAgent.match(re)) {
	                    $('.wp-icm-open-account.live .main_register_wrap').addClass(browser);
	                }
	    });


	    function reconstructButtonsAfterLocalization() {
	        createButtonsInputs($('.wp-icm-open-account.live .select_btns_group .select_btn'));
	    }

	    function updateCustomValidators() {
			if (window.Parsley._validatorRegistry.validators && window.Parsley._validatorRegistry.validators['dt']) { window.Parsley.removeValidator('dt'); }
			window.Parsley.addValidator('dt', {
				validateString: function(val, part, tag) {
					// debugger;
					var $input = $(tag.$element);
					var $parent = $input.closest('div[data-dt-group]');
					var $day = $parent.find('input[data-dt-part="D"]');
					var $month = $parent.find('input[data-dt-part="M"]');
					var $year = $parent.find('input[data-dt-part="Y"]');
					var d = $day.val();
					var m = $month.attr('data-orig') || '';
					var y = $year.val();
					var min = $parent.attr('data-dt-min-years') || '';
					if (d.length && m.length && y.length) {
						var dt = new Date();
						dt.setHours(0, 0, 0, 0);
						dt.setDate(+d);
						dt.setMonth(+m);
						dt.setFullYear(+y);
						// double set for sure
						dt.setHours(0, 0, 0, 0);
						dt.setDate(+d);
						dt.setMonth(+m);
						dt.setFullYear(+y);
						// debugger;
						if (window['utcTimestamp']) {
							var now = new Date(parseInt(window['utcTimestamp']));
						} else {
							var now = new Date();
						}
						// do not allow future dates
						if (dt > now) return false;
						// do not allow incorrect DAY (ex. 31 of FEBRUARY etc.)
						if (dt.getDate() != +d) return false;
						// do not allow incorrect MONTH
						if (dt.getMonth() != +m) return false;
						// do not allow yanger than data-dt-min-years
						if (min.length) {
							var diff = now.getTime() - dt.getTime();
							var y1 = 1000*60*60*24*365; // one year in miliseconds
							if (~~(diff / y1) < +min)  return false;
							// do not allow, when happy birthday only tomorrow or later
							// but allow if happy birthday right today
							// and check for prev year first
							if ((~~(diff / y1) == +min) && (now.getFullYear() - dt.getFullYear() == +min)) {
								if (dt.getMonth() > now.getMonth()) return false;
								if (dt.getDate() > now.getDate() && dt.getMonth() == now.getMonth()) return false;
							}
						}
						if (!window.reValidateOnce) {
							window.reValidateOnce = true;
							$day.parsley().validate()
							$month.parsley().validate()
							$year.parsley().validate()
							window.reValidateOnce = false;
						}
					}
					return true;
				},
				messages: {
					en: $('.reg_form_inputs_invalid_date').text()
				}
			});

	        if (window.Parsley._validatorRegistry.validators && window.Parsley._validatorRegistry.validators['phoneprefix']) { window.Parsley.removeValidator('phoneprefix'); }
	        window.Parsley.addValidator('phoneprefix', {
	            validateString: function(val) {
	                function checkPhone(data) {
	                    var check = false;
	                    var country = $('#countries').val();
	                    var tel = getPhoneCodeByCountryName(country);
	                    if (data.length > tel.length && data.length > 6) {
	                        if ((/^\+(\d[\s\-_]?){8,}$/g).test(data)) {
	                            check = true;
	                        }
	                    }
	                    return check;
	                }
	                return checkPhone(val);
	            },
	            messages: {
	                en: $('.reg_form_inputs_phone_number').text()
	            }
	        });


	        if (window.Parsley._validatorRegistry.validators && window.Parsley._validatorRegistry.validators['dropdown']) { window.Parsley.removeValidator('dropdown'); }
	        window.Parsley.addValidator('dropdown', {
	            // requirementType: 'string',
	            validateString: function(val) {
	                function getCountriesCheck(countries) {
	                    var check = false;
	                    $.each(countries, function(value, item) {
	                        if (item.name.toLowerCase() === val.toLowerCase()) {
	                            check = true;
	                        }
	                        var countryCode = item.code;
	                        var localizedName = item.name;
	                        if (localizedName) {
	                            if (localizedName.toLowerCase() === val.toLowerCase()) {
	                                check = true;
	                            }
	                        }
	                    });
	                    return check;
	                }

	                function checkDrop() {
	                    var check = false;
	                    if (window['serverCountries']) {
	                        check = getCountriesCheck(window['serverCountries']);
	                    } else {
	                        check = false;
	                    }
	                    return check;
	                }
	                return checkDrop();
	            },
	            messages: {
	                en: $('.reg_form_inputs_use_letters').text()
	            }
	        });

			if (window.Parsley._validatorRegistry.validators && window.Parsley._validatorRegistry.validators['identitytype']) { window.Parsley.removeValidator('identitytype'); }
			window.Parsley.addValidator('identitytype', {
				validate: function(val) {
					let prefix = $(arguments[2]['element']).parent().attr('id').includes('joint') ? 'joint_' : '';
					$(`#${prefix}identity-wrap .input_group`).hide();
					$(`#${prefix}nationalId`).attr('data-parsley-excluded', 'true');
					$(`#${prefix}driverLicence`).attr('data-parsley-excluded', 'true');
					$(`#${prefix}driverLicenceState`).attr('data-parsley-excluded', 'true');
					$(`#${prefix}driverLicenceCardNumber`).attr('data-parsley-excluded', 'true');
					$(`#${prefix}driverLicenceExpiryDate`).attr('data-parsley-excluded', 'true');
					$(`#${prefix}passport`).attr('data-parsley-excluded', 'true');
					$(`#${prefix}passportExpiryDate`).attr('data-parsley-excluded', 'true');

					switch(val) {
						case 'National ID':
							$(`#${prefix}identity-wrap .input_group.nationalId`).show();
							$(`#${prefix}nationalId`).attr('data-parsley-excluded', 'true');
							break;
						case 'Driver License':
							$(`#${prefix}identity-wrap .input_group.driverLicence`).show();
							$(`#${prefix}driverLicence`).attr('data-parsley-excluded', 'false');
							if (window[`${prefix}country_code`] === 'AU') {
								$(`#${prefix}identity-wrap .input_group.driverLicenceState`).show();
								$(`#${prefix}identity-wrap .input_group.driverLicenceCardNumber`).show();
								$(`#${prefix}identity-wrap .input_group.driverLicenceExpiryDate`).show();
								$(`#${prefix}driverLicenceState`).attr('data-parsley-excluded', 'false');
								$(`#${prefix}driverLicenceCardNumber`).attr('data-parsley-excluded', 'false');
								$(`#${prefix}driverLicenceExpiryDate`).attr('data-parsley-excluded', 'false').attr('data-parsley-pattern', '^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$').attr('data-parsley-must-be-future-date', 'true');
							}
							break;
						case 'Passport':
							$(`#${prefix}identity-wrap .input_group.passport`).show();
							$(`#${prefix}passport`).attr('data-parsley-excluded', 'true');
							$(`#${prefix}identity-wrap .input_group.passportExpiryDate`).show();
							$(`#${prefix}passportExpiryDate`).attr('data-parsley-excluded', 'false').attr('data-parsley-pattern', '^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$').attr('data-parsley-must-be-future-date', 'true');
							break;
						default:
					}

					return true;
				},
				messages: {
					en: ''
				}
			});
	    }

	    function serializeFormToArray(form) {
	        return _serialize(form, true);
	    }

	    function serializeForm() {
	        return _serialize();
	    }

	    function _serialize(form, isArray) {
	        form = form || $('.wp-icm-open-account.live form');

	        // INDIVIDUAL:
	        // change country val to en
	        var $countriesInput = $('.wp-icm-open-account.live input#countries');
	        var cLocalizedValue = $countriesInput.val();
	        $countriesInput.val($countriesInput.attr('data-orig') || cLocalizedValue);
	        // change nationality val to en
	        var $nationalityInput = $('.wp-icm-open-account.live input#nationality');
	        var nationalityValue = $nationalityInput.val();
	        $nationalityInput.val($nationalityInput.attr('data-orig') || nationalityValue);
			//change tin val to en
			var $signatoryTinInput = $('.wp-icm-open-account.live input#signatory_tin');
			var signatoryTinValue = $signatoryTinInput.val();
			$signatoryTinInput.val($signatoryTinInput.attr('data-orig') || signatoryTinValue);
			// change month val to en
	        var $bmInput = $('.wp-icm-open-account.live input#birth_month');
	        var bmLocalizedValue = $bmInput.val();
	        $bmInput.val($bmInput.attr('data-orig') || bmLocalizedValue);
	        // change security question val to en
	        var $sqInput = $('.wp-icm-open-account.live input#security_question');
	        var sqLocalizedValue = $sqInput.val();
	        $sqInput.val($sqInput.attr('data-orig') || sqLocalizedValue);
			// change currency value to id
			var $currenciesInput = $('.wp-icm-open-account.live input#currency');
			var currencyValue = $currenciesInput.val();
			$currenciesInput.val($currenciesInput.attr('data-orig'));
			// change branch value to id
			var $branchInput = $('.wp-icm-open-account.live input#branch_id');
			var branchValue = $branchInput.val();
			$branchInput.val($branchInput.attr('data-orig'));

			// JOINT:
	        // change country val to en
	        var $joint_countriesInput = $('.wp-icm-open-account.live input#joint_countries');
	        var joint_cLocalizedValue = $joint_countriesInput.val();
	        $joint_countriesInput.val($joint_countriesInput.attr('data-orig') || joint_cLocalizedValue);
	        // change nationality val to en
	        var $joint_nationalityInput = $('.wp-icm-open-account.live input#joint_nationality');
	        var joint_nationalityValue = $joint_nationalityInput.val();
	        $joint_nationalityInput.val($joint_nationalityInput.attr('data-orig') || joint_nationalityValue);
			// change tin val to en
			var $joint_signatoryTinInput = $('.wp-icm-open-account.live input#joint_signatory_tin');
			var $joint_signatoryTinValue = $joint_signatoryTinInput.val();
			$joint_signatoryTinInput.val($joint_signatoryTinInput.attr('data-orig') || $joint_signatoryTinValue);
			// change month val to en
	        var $joint_bmInput = $('.wp-icm-open-account.live input#joint_birth_month');
	        var joint_bmLocalizedValue = $joint_bmInput.val();
	        $joint_bmInput.val($joint_bmInput.attr('data-orig') || joint_bmLocalizedValue);
	        // change security question val to en
	        var $joint_sqInput = $('.wp-icm-open-account.live input#joint_security_question');
	        var joint_sqLocalizedValue = $joint_sqInput.val();
	        $joint_sqInput.val($joint_sqInput.attr('data-orig') || joint_sqLocalizedValue);
			// change currency value to id
			var $joint_currenciesInput = $('.wp-icm-open-account.live input#joint_currency');
			var joint_currencyValue = $joint_currenciesInput.val();
			$joint_currenciesInput.val($joint_currenciesInput.attr('data-orig'));
			// change branch value to id
			var $joint_branchInput = $('.wp-icm-open-account.live input#joint_branch_id');
			var joint_branchValue = $joint_branchInput.val();
			$joint_branchInput.val($joint_branchInput.attr('data-orig'));

	        // CORPORATE:
	        // change country val to en
	        var $countries2Input = $('.wp-icm-open-account.live input#countries2');
	        var cLocalized2Value = $countries2Input.val();
	        $countries2Input.val($countries2Input.attr('data-orig') || cLocalized2Value);
	        var $rCountryInput = $('.wp-icm-open-account.live input#registered_countries');
	        var rLocalizedValue = $rCountryInput.val();
	        $rCountryInput.val($rCountryInput.attr('data-orig') || rLocalizedValue);
	        var $bCountryInput = $('.wp-icm-open-account.live input#business_countries');
	        var bLocalizedValue = $bCountryInput.val();
	        $bCountryInput.val($bCountryInput.attr('data-orig') || bLocalizedValue);
	        // change month val to en
	        var $smInput = $('.wp-icm-open-account.live input#signatory_birth_month');
	        var smLocalizedValue = $smInput.val();
	        $smInput.val($smInput.attr('data-orig') || smLocalizedValue);
	        var $imInput = $('.wp-icm-open-account.live input#incorporation_birth_month');
	        var imLocalizedValue = $imInput.val();
	        $imInput.val($imInput.attr('data-orig') || imLocalizedValue);

			// Copy Business Address from Registered Address if client chooses same address
			if ($('#busaddr').is(':checked')) {
				$('.wp-icm-open-account.live input#business_street').val($('.wp-icm-open-account.live input#registered_street').val());
				$('.wp-icm-open-account.live input#business_street_number').val($('.wp-icm-open-account.live input#registered_street_number').val());
				$('.wp-icm-open-account.live input#business_city').val($('.wp-icm-open-account.live input#registered_city').val());
				$('.wp-icm-open-account.live input#business_zip_code').val($('.wp-icm-open-account.live input#business_street').val());
				$('.wp-icm-open-account.live input#business_state').val($('.wp-icm-open-account.live input#registered_state').val());
				$bCountryInput.val($rCountryInput.attr('data-orig') || rLocalizedValue);
			}

	        var serialized = form.serializeArray();
	        if (!isArray) {
	            serialized = form.serialize();
	        }
	        // INDIVIDUAL:
	        // change country val to localize
	        $countriesInput.val(cLocalizedValue);
	        // change nationality val to localize
	        $nationalityInput.val(nationalityValue);
			// change tin val to localize
			$signatoryTinInput.val(signatoryTinValue)
	        // change month val to localize
	        $bmInput.val(bmLocalizedValue);
	        // change security question val to localize
	        $sqInput.val(sqLocalizedValue);
			// change currency val to temp
			$currenciesInput.val(currencyValue);
			// change branch val to temp
			$branchInput.val(branchValue);

	        // JOINT:
	        // change country val to localize
	        $joint_countriesInput.val(joint_cLocalizedValue);
	        // change nationality val to localize
	        $joint_nationalityInput.val(joint_nationalityValue);
			// change tin val to localize
			$joint_signatoryTinInput.val($joint_signatoryTinValue);
	        // change month val to localize
	        $joint_bmInput.val(joint_bmLocalizedValue);
	        // change security question val to localize
	        $joint_sqInput.val(joint_sqLocalizedValue);
			// change currency val to temp
			$joint_currenciesInput.val(joint_currencyValue);
			// change branch val to temp
			$joint_branchInput.val(joint_branchValue);

	        // CORPORATE:
	        // change country val to localize
	        $countries2Input.val(cLocalized2Value);
	        $rCountryInput.val(rLocalizedValue);
	        $bCountryInput.val(bLocalizedValue);
	        // change country val to localize
	        $smInput.val(smLocalizedValue);
	        $imInput.val(imLocalizedValue);

	        return serialized;
	    }

	    function preSubmitFormValidation() {
	        var errorFields = [];
	        var requiredFields = [];
	        var requiredFieldsIndividual = ["first_name", "last_name", "email", "country", "phone", /*"invitation_guid",*/ "reg_type", "birth_day", "birth_month", "birth_year", "address", "city", /*"state",*/ "zip_code", /*"first_name2", "last_name2", "city2", "email2", "country2", "phone2",*/ "signatory_birth_day", "signatory_birth_month", "signatory_birth_year", /*"company_name", "place_incorporation", "incorporation_birth_day", "incorporation_birth_month", "incorporation_birth_year", "fax", "registered_street", "registered_street_number", "registered_city", "registered_state", "registered_zip_code", "registered_country", "business_street", "business_street_number", "business_city", "business_state", "business_zip_code", "business_country", "reffer_id",*/ "trading_platform", "account_type", "currency", /*"news_subscription",*/ "experience", "security_question", "security_answer"];
	        var requiredFieldsJoint = ["first_name", "last_name", "email", "country", "phone", /*"invitation_guid",*/ "reg_type", "birth_day", "birth_month", "birth_year", "address", "city", /*"state",*/ "zip_code", /*"first_name2", "last_name2", "city2", "email2", "country2", "phone2", "signatory_birth_day", "signatory_birth_month", "signatory_birth_year", "company_name", "place_incorporation", "incorporation_birth_day", "incorporation_birth_month", "incorporation_birth_year", "fax", "registered_street", "registered_street_number", "registered_city", "registered_state", "registered_zip_code", "registered_country", "business_street", "business_street_number", "business_city", "business_state", "business_zip_code", "business_country", "reffer_id",*/ "trading_platform", "account_type", "currency", /*"news_subscription",*/ "experience", "security_question", "security_answer", "joint_first_name", "joint_last_name", "joint_email", "joint_country", "joint_phone", /*"joint_invitation_guid",*/ "joint_birth_day", "joint_birth_month", "joint_birth_year", "joint_address", "joint_city", "joint_state", "joint_zip_code", /*"joint_reffer_id",*/ "joint_trading_platform", "joint_account_type", "joint_currency", /*"joint_news_subscription",*/ "joint_experience", "joint_security_question", "joint_security_answer"];
	        var requiredFieldsCorporate = ["first_name", "last_name", "email", "country", "phone", /*"invitation_guid",*/ "reg_type", "birth_day", "birth_month", "birth_year", /*"address", "city", "state", "zip_code",*/ "first_name2", "last_name2", "city2", "email2", "countries2", /*"states2",*/ "phone2", "signatory_birth_day", "signatory_birth_month", "signatory_birth_year", "company_name", "legal_entity_id", "place_incorporation", "incorporation_birth_day", "incorporation_birth_month", "incorporation_birth_year", "fax", "registered_street", "registered_street_number", "registered_city", "registered_state", "registered_zip_code", "registered_country", /*"registered_states", "busaddr",*/ "business_street", "business_street_number", "business_city", "business_state", "business_zip_code", "business_country", /*"reffer_id",*/ "trading_platform", "account_type", "currency", /*"news_subscription",*/ "experience", "security_question", "security_answer"];

			var form = serializeFormToArray();
	        var accountType = getSelectedAccountType(form);
	        if (!accountType) {
	            return ['reg_type'];
	        } else {
	            switch (accountType) {
	                case 'individual':
	                    requiredFields = requiredFieldsIndividual;
	                    break;
	                case 'joint':
	                    requiredFields = requiredFieldsJoint;
	                    break;
	                case 'corporate':
	                    requiredFields = requiredFieldsCorporate;
	                    break;
	            }
	        }
	        var isFieldPresent = function(fields, field_name) {
	            var res = false;
	            var field = null;
	            for (var i in fields) {
	                if (fields.hasOwnProperty(i)) {
	                    field = fields[i];
	                    if (field['name'] == field_name) {
	                        res = true;
	                        break;
	                    }
	                }
	            }
	            return res;
	        };
	        var field = null;
	        var i;
	        for (i in form) {
	            if (form.hasOwnProperty(i)) {
	                field = form[i];
	                if (!field['value'] && requiredFields.indexOf(field['name']) != -1) {
	                    errorFields.push(" " + field['name'] + " (invalid value)");
	                }
	            }
	        }
	        for (i in requiredFields) {
	            if (requiredFields.hasOwnProperty(i)) {
	                var field_name = requiredFields[i];
	                if (!isFieldPresent(form, field_name)) {
	                    errorFields.push(" " + field_name + " (absent property)");
	                }
	            }
	        }
	        return errorFields;
	    }

	    function getSelectedAccountType(formFields) {
	        formFields = formFields || serializeFormToArray();
	        var i;
	        var res = null;
	        var field = null;
	        for (i in formFields) {
	            if (formFields.hasOwnProperty(i)) {
	                field = formFields[i];
	                if (field['name'] == "reg_type") {
	                    res = field['value'];
	                    break;
	                }
	            }
	        }
	        if (res) {
	            for (i in formFields) {
	                if (formFields.hasOwnProperty(i)) {
	                    field = formFields[i];
	                    if (res != 'joint' && field['name'] == "security_answer") {
	                        if (field['value'] == '' || !$(field).is(':visible')) {
	                            res = null;
	                        }
	                        break;
	                    } else if (res == 'joint' && field['name'] == "joint_security_answer") {
	                        if (field['value'] == '' || !$(field).is(':visible')) {
	                            res = null;
	                        }
	                        break;
	                    }
	                }
	            }
	        }
	        if (!res || res == "") {
	            res = 'simple';
	        }
	        return res;
	    }

	    function getFilledFormValueByName(formFieldName) {
	        var formFields = serializeFormToArray();
	        var res = null;
	        var field = null;
	        for (var i in formFields) {
	            if (formFields.hasOwnProperty(i)) {
	                field = formFields[i];
	                if (field['name'] == formFieldName) {
	                    res = field['value'];
	                    break;
	                }
	            }
	        }
	        if (!res || res == "") {
	            res = null;
	        }
	        return res;
	    }

	    function getTradingPlatformNameById(tradingPlatformId, isIslamic) {
	        var tradingPlatforms = isIslamic ? window['tradePlatformsIslamic'] : window['tradePlatforms'];
	        var res = null;
	        var tp = null;
	        for (var i in tradingPlatforms) {
	            if (tradingPlatforms.hasOwnProperty(i)) {
	                tp = tradingPlatforms[i];
	                if (tp['id'] == tradingPlatformId) {
	                    res = tp['name'];
	                    break;
	                }
	            }
	        }
	        if (!res || res == "") {
	            res = '';
	        }
	        return res;
	    }

	    function getAccountTypeNameById(accountTypeId, isIslamic) {
	        var accountTypes = isIslamic ? window['accountTypesIslamic'] : window['accountTypes'];
	        var res = null;
	        var at = null;
	        for (var i in accountTypes) {
	            if (accountTypes.hasOwnProperty(i)) {
	                at = accountTypes[i];
	                if (at['ID'] == accountTypeId) {
	                    res = at['Name'];
	                    break;
	                }
	            }
	        }
	        if (!res || res == "") {
	            res = '';
	        }
	        return res;
	    }

	    function showUnsupportedCountryPopup(countryName, callback_ok, callback_cancel) {
	        $('.wp-icm-open-account.live .reg_modal_unsupported_country .unsupported_country').html(countryName);
	        $('.wp-icm-open-account.live .reg_modal_unsupported_country, .wp-icm-open-account.live .reg_overlay').fadeIn();
	        function cancelHandler(e, callback_cancel) {
	            $('.wp-icm-open-account.live .reg_modal_unsupported_country, .wp-icm-open-account.live .reg_overlay').fadeOut(0);
	            if (callback_cancel) {
	                callback_cancel();
	            }
	        }
	        $('.wp-icm-open-account.live .reg_modal_unsupported_country .unsupported_ok').off('click');
	        $('.wp-icm-open-account.live .reg_modal_unsupported_country .unsupported_cancel').off('click', cancelHandler);
	        $('.wp-icm-open-account.live .reg_modal_unsupported_country .reg_modal_close_btn').off('click', cancelHandler);
	        $('.wp-icm-open-account.live .reg_overlay').off('click', cancelHandler);
	        $('.wp-icm-open-account.live .reg_modal_unsupported_country .unsupported_ok').on('click', function() {
	            $('.wp-icm-open-account.live .reg_modal_unsupported_country, .wp-icm-open-account.live .reg_overlay').fadeOut(0);
	            if (callback_ok) {
	                callback_ok();
	            }
	        });
	        $('.wp-icm-open-account.live .reg_modal_unsupported_country .unsupported_cancel').on('click', function(e) {
	            cancelHandler(e, callback_cancel);
	        });
	        $('.wp-icm-open-account.live .reg_modal_unsupported_country .reg_modal_close_btn').on('click', function(e) {
	            cancelHandler(e, callback_cancel);
	        });
	        $('.wp-icm-open-account.live .reg_overlay').on('click', function(e) {
	            cancelHandler(e, callback_cancel);
	        });
	    }

	    function showDisallowedCountryPopup(countryName, callback_ok) {
	        $('.wp-icm-open-account.live .reg_modal_disallowed_country .disallowed_country').html(countryName);
	        $('.wp-icm-open-account.live .reg_modal_disallowed_country, .wp-icm-open-account.live .reg_overlay').fadeIn(0);

	        function okHandler() {
	            $('.wp-icm-open-account.live .reg_modal_disallowed_country, .wp-icm-open-account.live .reg_overlay').fadeOut(0);
	            if (callback_ok) {
	                callback_ok();
	            }
	        }

	        $('.wp-icm-open-account.live .reg_modal_disallowed_country .disallowed_ok').off('click');
	        $('.wp-icm-open-account.live .reg_modal_disallowed_country .reg_modal_close_btn').off('click', okHandler);
	        $('.wp-icm-open-account.live .reg_overlay').off('click', okHandler);
	        $('.wp-icm-open-account.live .reg_modal_disallowed_country .disallowed_ok').on('click', okHandler);
	        $('.wp-icm-open-account.live .reg_modal_disallowed_country .reg_modal_close_btn').on('click', okHandler);
	        $('.wp-icm-open-account.live .reg_overlay').on('click', okHandler);
	    }

	    function tryHardSelectTradePlatformAndAccountType($step, isJoint) {
			if (!$step || !$step.length) return;
			var $same_main_tp_button = null;
			var $same_main_at_button = null;
			if (isJoint) {
				var $main_step = $('.wp-icm-open-account.live #step_3');
				if (!$main_step || !$main_step.length) return;
				var $main_tp_selected = $main_step.find('div.trade-platform-button.select_btn input[type="radio"]:checked');
				var $main_at_selected = $main_step.find('div.account-type-button.select_btn input[type="radio"]:checked');
				// find and check selected controls at main step for joint:
				if ($main_tp_selected.length && $main_at_selected.length) {
					$same_main_tp_button = $step.find('div.trade-platform-button.select_btn input[type="radio"]').filter(function () {return $(this).val() == $main_tp_selected.val()}).closest('.select_btn');
					$same_main_at_button = $step.find('div.account-type-button.select_btn input[type="radio"]').filter(function () {return $(this).val() == $main_at_selected.val()}).closest('.select_btn');
					if (!$same_main_tp_button.length || !$same_main_at_button.length) {
						$same_main_tp_button = null;
						$same_main_at_button = null;
					} else {
						$same_main_tp_button.closest('.select_btns_group').toggleClass('disallow-to-change', true);
						$same_main_at_button.closest('.select_btns_group').toggleClass('disallow-to-change', true);
					}
				}
			}
			setTimeout(function() {
				if(window['currentBranch'] == '6') {
					alreadySelectedTradePlatform = 'metatrader';
					alreadySelectedAccountType = 'acctype_standart';
				}
				var $tp_button = $same_main_tp_button || $step.find(`div.trade-platform-button.select_btn.${alreadySelectedTradePlatform}:visible`);
				if (!$tp_button.length) $tp_button = $step.find('div.trade-platform-button.select_btn.mt4:visible');
				if ($tp_button.length) {
					$tp_button.click();
					setTimeout(function() {
						var $at_button = $same_main_at_button || $step.find(`div.account-type-button.select_btn.${alreadySelectedAccountType}:visible`);
						if (!$at_button.length) $at_button = $step.find('div.account-type-button.select_btn:visible');
						if ($at_button.length) {
							$at_button.click();
							setTimeout(function() {
								$tp_button.find('input[type="radio"]')[0].checked = true;
								$at_button.find('input[type="radio"]')[0].checked = true;
							}, 500);
						}
					}, 500);
				}
			}, 500);
	    }

	    function sendGaData(data, callback) {
	        if (data && callback) {
	            var _fromLandingPage = (window['landingPage'] ? ' (from Landing Page)' : '');
	            var _selectedAccountType = (window['selectedAccountType'] ? window['selectedAccountType'] + '_' : '');
	            if (window['selectedAccountType'] == 'simple') {
	                _selectedAccountType = '';
	            }
	            var section = 'Register New Live Account' + _fromLandingPage;
	            var event = 'live_' + _selectedAccountType + data;
                var gaFired = false;
	            var gaAvailable = true;
	            var gaTimeout = setTimeout(function () {
	            	if (!gaFired) {
                        gaAvailable = false;
                        callback();
					}
				}, 2000);
				try{
					ga('send', 'event', section, event, {
						hitCallback: function() {
							if (gaAvailable) {
								gaFired = true;
								if (gaTimeout) clearTimeout(gaTimeout);
								callback();
							}
						}
					});
				}catch(error){}

	        } else {
	            console.error('ERROR: function sendGaData (data, callback)', data, callback);
	        }
	    }

	    function updateYearsRange() {
	        var $birth = $('#birth_year');
	        var $joint_birth = $('#joint_birth_year');
	        var $signatory_birth = $('#signatory_birth_year');
	        var $incorporation_birth = $('#incorporation_birth_year');
	        var current = (new Date(Date.now())).getFullYear();

			if(window['currentBranch'] === '1'){
				if ($birth && $birth.length) {
					$birth.attr('data-parsley-range', `[${(current - 90)}, ${(current - 18)}]`);
				}
				if ($joint_birth && $joint_birth.length) {
					$joint_birth.attr('data-parsley-range', `[${(current - 90)}, ${(current - 18)}]`);
				}
				if ($signatory_birth && $signatory_birth.length) {
					$signatory_birth.attr('data-parsley-range', `[${(current - 90)}, ${(current - 18)}]`);
				}
				if ($incorporation_birth && $incorporation_birth.length) {
					$incorporation_birth.attr('data-parsley-range', '[1700, ' + (current) + ']');
				}
			}else{
				if ($birth && $birth.length) {
					$birth.attr('data-parsley-range', `[${(current - 90)}, ${(current - 18)}]`);
				}
				if ($joint_birth && $joint_birth.length) {
					$joint_birth.attr('data-parsley-range', `[${(current - 90)}, ${(current - 18)}]`);
				}
				if ($signatory_birth && $signatory_birth.length) {
					$signatory_birth.attr('data-parsley-range', `[${(current - 90)}, ${(current - 18)}]`);
				}
				if ($incorporation_birth && $incorporation_birth.length) {
					$incorporation_birth.attr('data-parsley-range', '[1700, ' + (current) + ']');
				}
			}
		}

		if (window.location.hash.startsWith("#from-paypal:")) {
			var paypalResponse = window.location.hash.split("#from-paypal:")[1];
			var res = JSON.parse(decodeURIComponent(paypalResponse));

			if (res) {
				$('.wp-icm-open-account.live #first_name').val(res.f).change().parsley().validate();
				$('.wp-icm-open-account.live #first_name').parent().toggleClass('has-label', true);
				$('.wp-icm-open-account.live #last_name').val(res.l).change().parsley().validate();
				$('.wp-icm-open-account.live #last_name').parent().toggleClass('has-label', true);
				$('.wp-icm-open-account.live #email').val(res.e).change().focus().blur().parsley().validate();
				$('.wp-icm-open-account.live #email').val(res.e).parent().toggleClass('has-label', true);
				res.p && res.p.length && $('.wp-icm-open-account.live #phone').val(res.p.split('').filter(function(c) {return '+0123456789'.indexOf(c) !== -1;}).join('')).change().parsley().validate();

				$('#first_name').parent().toggleClass('disallowed-changes-by-paypal', true);
				$('#last_name').parent().toggleClass('disallowed-changes-by-paypal', true);
				var pp_container = $('<div class="filled-from-paypal"><img class="paypal-button-logo paypal-button-logo-pp paypal-button-logo-blue" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICAgIDxwYXRoIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNyIgZD0iTSAyMC43MDIgOS40NDYgQyAyMC45ODIgNy4zNDcgMjAuNzAyIDUuOTQ3IDE5LjU3OCA0LjU0OCBDIDE4LjM2MSAzLjE0OCAxNi4yMDggMi41NDggMTMuNDkzIDIuNTQ4IEwgNS41MzYgMi41NDggQyA0Ljk3NCAyLjU0OCA0LjUwNiAyLjk0OCA0LjQxMiAzLjU0OCBMIDEuMTM2IDI1Ljc0IEMgMS4wNDIgMjYuMjM5IDEuMzIzIDI2LjYzOSAxLjc5MSAyNi42MzkgTCA2Ljc1MyAyNi42MzkgTCA2LjM3OCAyOC45MzggQyA2LjI4NSAyOS4yMzggNi42NTkgMjkuNjM4IDYuOTQgMjkuNjM4IEwgMTEuMTUzIDI5LjYzOCBDIDExLjYyMSAyOS42MzggMTEuOTk1IDI5LjIzOCAxMi4wODkgMjguNzM5IEwgMTIuMTgyIDI4LjUzOSBMIDEyLjkzMSAyMy4zNDEgTCAxMy4wMjUgMjMuMDQxIEMgMTMuMTE5IDIyLjQ0MSAxMy40OTMgMjIuMTQxIDEzLjk2MSAyMi4xNDEgTCAxNC42MTYgMjIuMTQxIEMgMTguNjQyIDIyLjE0MSAyMS43MzEgMjAuMzQyIDIyLjY2OCAxNS40NDMgQyAyMy4wNDIgMTMuMzQ0IDIyLjg1NSAxMS41NDUgMjEuODI1IDEwLjM0NSBDIDIxLjQ1MSAxMC4wNDYgMjEuMDc2IDkuNjQ2IDIwLjcwMiA5LjQ0NiBMIDIwLjcwMiA5LjQ0NiI+PC9wYXRoPgogICAgPHBhdGggZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC43IiBkPSJNIDIwLjcwMiA5LjQ0NiBDIDIwLjk4MiA3LjM0NyAyMC43MDIgNS45NDcgMTkuNTc4IDQuNTQ4IEMgMTguMzYxIDMuMTQ4IDE2LjIwOCAyLjU0OCAxMy40OTMgMi41NDggTCA1LjUzNiAyLjU0OCBDIDQuOTc0IDIuNTQ4IDQuNTA2IDIuOTQ4IDQuNDEyIDMuNTQ4IEwgMS4xMzYgMjUuNzQgQyAxLjA0MiAyNi4yMzkgMS4zMjMgMjYuNjM5IDEuNzkxIDI2LjYzOSBMIDYuNzUzIDI2LjYzOSBMIDcuOTcgMTguMzQyIEwgNy44NzYgMTguNjQyIEMgOC4wNjMgMTguMDQzIDguNDM4IDE3LjY0MyA5LjA5MyAxNy42NDMgTCAxMS40MzMgMTcuNjQzIEMgMTYuMDIxIDE3LjY0MyAxOS41NzggMTUuNjQzIDIwLjYwOCA5Ljk0NiBDIDIwLjYwOCA5Ljc0NiAyMC42MDggOS41NDYgMjAuNzAyIDkuNDQ2Ij48L3BhdGg+CiAgICA8cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNIDkuMjggOS40NDYgQyA5LjI4IDkuMTQ2IDkuNDY4IDguODQ2IDkuODQyIDguNjQ2IEMgOS45MzYgOC42NDYgMTAuMTIzIDguNTQ2IDEwLjIxNiA4LjU0NiBMIDE2LjQ4OSA4LjU0NiBDIDE3LjIzOCA4LjU0NiAxNy44OTMgOC42NDYgMTguNTQ4IDguNzQ2IEMgMTguNzM2IDguNzQ2IDE4LjgyOSA4Ljc0NiAxOS4xMSA4Ljg0NiBDIDE5LjIwNCA4Ljk0NiAxOS4zOTEgOC45NDYgMTkuNTc4IDkuMDQ2IEMgMTkuNjcyIDkuMDQ2IDE5LjY3MiA5LjA0NiAxOS44NTkgOS4xNDYgQyAyMC4xNCA5LjI0NiAyMC40MjEgOS4zNDYgMjAuNzAyIDkuNDQ2IEMgMjAuOTgyIDcuMzQ3IDIwLjcwMiA1Ljk0NyAxOS41NzggNC42NDggQyAxOC4zNjEgMy4yNDggMTYuMjA4IDIuNTQ4IDEzLjQ5MyAyLjU0OCBMIDUuNTM2IDIuNTQ4IEMgNC45NzQgMi41NDggNC41MDYgMy4wNDggNC40MTIgMy41NDggTCAxLjEzNiAyNS43NCBDIDEuMDQyIDI2LjIzOSAxLjMyMyAyNi42MzkgMS43OTEgMjYuNjM5IEwgNi43NTMgMjYuNjM5IEwgNy45NyAxOC4zNDIgTCA5LjI4IDkuNDQ2IFoiPjwvcGF0aD4KICAgIDxnIHRyYW5zZm9ybT0ibWF0cml4KDAuNDk3NzM3LCAwLCAwLCAwLjUyNjEyLCAxLjEwMTQ0LCAwLjYzODY1NCkiIG9wYWNpdHk9IjAuMiI+CiAgICAgICAgPHBhdGggZmlsbD0iIzIzMWYyMCIgZD0iTTM5LjMgMTYuN2MwLjkgMC41IDEuNyAxLjEgMi4zIDEuOCAxIDEuMSAxLjYgMi41IDEuOSA0LjEgMC4zLTMuMi0wLjItNS44LTEuOS03LjgtMC42LTAuNy0xLjMtMS4yLTIuMS0xLjdDMzkuNSAxNC4yIDM5LjUgMTUuNCAzOS4zIDE2Ljd6Ij48L3BhdGg+CiAgICAgICAgPHBhdGggZmlsbD0iIzIzMWYyMCIgZD0iTTAuNCA0NS4yTDYuNyA1LjZDNi44IDQuNSA3LjggMy43IDguOSAzLjdoMTZjNS41IDAgOS44IDEuMiAxMi4yIDMuOSAxLjIgMS40IDEuOSAzIDIuMiA0LjggMC40LTMuNi0wLjItNi4xLTIuMi04LjRDMzQuNyAxLjIgMzAuNCAwIDI0LjkgMEg4LjljLTEuMSAwLTIuMSAwLjgtMi4zIDEuOUwwIDQ0LjFDMCA0NC41IDAuMSA0NC45IDAuNCA0NS4yeiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGZpbGw9IiMyMzFmMjAiIGQ9Ik0xMC43IDQ5LjRsLTAuMSAwLjZjLTAuMSAwLjQgMC4xIDAuOCAwLjQgMS4xbDAuMy0xLjdIMTAuN3oiPjwvcGF0aD4KICAgIDwvZz4KPC9zdmc+Cg==" alt="pp" style="visibility: visible;"></div>');
				$('#first_name').parent().append(pp_container.clone());
				$('#last_name').parent().append(pp_container.clone());

				$('#paypal_nonce').val(res.n);
				$('#paypal_payer_id').val(res.id);
				$('#paypal_account_country').val(res.ac);
				$('#paypal_billing_country').val(res.bc);
				$('#paypal_email').val(res.e);
				$('#paypal_first_name').val(res.f);
				$('#paypal_last_name').val(res.l);
			}

			history.pushState("", document.title, window.location.pathname + window.location.search);
		}
	}

	function initBranchesList (countryObject, $branchesSelect) {
		var branchesList = window['serverBranches'];
		$branchesSelect = $branchesSelect || $('#branchesList');
		var supportedBranches = [];
		if (countryObject) {
			// remove FSA branch from the list on .eu website
			var is_it_eu = $('html').is('.branch-2')
			supportedBranches = countryObject.branching.filter(function (cb) { return is_it_eu ? cb.status != '4' && cb.branch != '1' : cb.status != '4'; });
			if (supportedBranches && supportedBranches.length) {
				supportedBranches = supportedBranches.map(function (sb) { return sb.branch; });
			}
		}
		$branchesSelect.html('');
		if (branchesList && branchesList.length) {
			branchesList.reduce(
				function(parent, item) {
					if (supportedBranches && supportedBranches.length) {
						var isBranchSupported = supportedBranches.indexOf(item.ID) !== -1;
						if (isBranchSupported) {
							var name = $('.cached-translation.reg_form_branch_' + item.Name.toLowerCase()).text();
							return parent.append($('<li data-id="' + item.ID + '" data-orig="' + item.ID + '">' + name + '</li>'));
						}
					}
					return parent;
				},
				$branchesSelect
			);
		}
	}
	window.initBranchesList = initBranchesList;

	function createTradePlatformAndAccountTypeControls(section, $tpContainer, $atContainer, branch, isIslamic) {
		if (!branch) return;
		section = section || 'main';

		// Create TradePlatform and AccountTypes buttons:
		var tp_container = $tpContainer;
		var at_container = $atContainer;

		tp_container.html('');
		at_container.html('');

		var globalVarName = 'tradePlatformsControls_' + section;
		window[globalVarName] = [];

		let expectedOrder = [
			"MT5",
			"MT4",
			"cTrader"
		];

		var tp_data = isIslamic ? window['tradePlatformsIslamic'] : window['tradePlatforms'];
		tp_data[branch] = tp_data[branch].map((i) => {
			let name = i.name;
			let order = '0';
			if (name) {
				order = (expectedOrder.indexOf(name) + 1) + "";
			}
			i.order = order;
			return i;
		});
		let sortingToExpectedOrder = (a, b) => a.order.localeCompare(b.order);
		tp_data[branch].sort(sortingToExpectedOrder);

		tp_data[branch].map(function(tp_item) {
			var tp_control = {};
			tp_control.data = tp_item;
			var type = tp_item.name.toLowerCase().replace(/ /g, '_');
			tp_control.view = $('<div id="reg_form_live_trading_platform_'+type+'" class="trade-platform-button select_btn rounded_el ' + type + '" data-id="' + 'trading_platform" data-value="' + tp_item.id + '" ></div>');
			tp_control.view.tp_control = tp_control;
			tp_control.view.on('click', function(e) {
				var $et = $(e.target);
				if ($et.is('.mt5')) {
					$('.mt4-shares-on-mt5-only').hide();
					alreadySelectedTradePlatform = 'mt5'
				} else {
					if ($et.is('.mt4')) {
						alreadySelectedTradePlatform = 'mt4'
					} else {
						alreadySelectedTradePlatform = 'ctrader'

					}
					$('.mt4-shares-on-mt5-only').show();
				}

				var jointContainerSelector = '';
				if (section == 'joint') {
					jointContainerSelector = '.joint_steps_form';
				}
				var $inputs = $('.wp-icm-open-account.live ' + jointContainerSelector + ' .account-type-button').hide().addClass('disabled_select').removeClass('selected').find('input');
				$inputs.prop('checked', '');
				$inputs.removeAttr('required');
				this.at_controls.forEach(function(at_control) {
					at_control.view.removeClass('disabled_select');
					at_control.view.find('input').attr('required', 'required');
					at_control.view.show();
				});

				if ($('.account-types').hasClass('error')) {
					$('.account-types .parsley-errors-list').remove();

					var message = 'This value is required';
						$errorMessage = $(`<ul class="parsley-errors-list filled" id="parsley-id-multiple-account_type" aria-hidden="false">
						<li class="parsley-addtional-question">${message}</li>
						</ul>`);
					$('.account-type-button').eq(4).after($errorMessage);
					$('.account-type-button').eq(4).addClass('parsley-error');
				}
			}.bind(tp_control));
			tp_control.at_controls = [];

            var at_data = isIslamic ? window['accountTypesIslamic'] : window['accountTypes'];
            tp_item['accountTypes'].forEach(function(at_item) {
				var at_control = {};
				at_control.data = at_item;
				var temp_at = {
					id: at_item.id,
					name: at_item.name
				};
                at_data.push(temp_at);
				let key = at_item.name.toLowerCase().replace(/ /g, '_');
				var text = at_item.name;
				at_control.view = $('<div id="reg_form_live_acctype_'+key+'" class="account-type-button select_btn rounded_el acctype_' + key + '" data-id="' + 'account_type" data-value="' + at_item.id + '">' + text + '</div>');
				at_control.view.on('click', function(e) {
					alreadySelectedAccountType = 'acctype_' + key
					this.at_controls.forEach(function(at_control) {
						at_control.view.find('input').removeAttr('required');
					});
				}.bind(tp_control));
				at_control.view.hide();
				at_container.append(at_control.view);
				tp_control.at_controls.push(at_control);
			});

			window[globalVarName].push(tp_control);
			tp_container.append(tp_control.view);
		});
	}

	function initCurrenciesList (isJoint) {
		var isIslamicChecked = $('.wp-icm-open-account.live .islamic_check input')[0] ? $('.wp-icm-open-account.live .islamic_check input')[0].checked : false;
		var $input = $('#currency');
		var $list = $('#currenciesList');
		default_currency = alreadySelectedCurrency; // 'USD'
		if (isJoint) {
			default_currency = $input.val();
			$input = $('#joint_currency');
			$list = $('#joint_currenciesList');
		}
		if ($input && $input.length && $list && $list.length) {
			const currenciesList = window.currenciesList;
			const branched = currenciesList.find(function(item) {
				return item && item.branch === window['currentBranch'];
			});
			$list.html('');
			if (branched && branched.items) {
				let branched_items = branched.items.filter(x => (isIslamicChecked ? x.islamic : true))
				branched_items.reduce(
					function(parent, item) {
						return parent.append($('<li data-id="' + item.id + '" data-orig="' + item.name + '">' + item.name + '</li>'));
					},
					$list
				);
			}
			$input.val('');
			setDefaultCurrency($input, default_currency);

		} else {
			console.warn('function initCurrenciesList (isJoint) {', '$input and/or $list missed');
		}
	}

	function createButtonsInputs($buttons) {
		$buttons.each(function() {
			var inType;
			if ($(this).parent().hasClass('single_select')) {
				inType = 'radio';
			} else if ($(this).parent().hasClass('multi_select')) {
				inType = 'checkbox';
			}
			var checked = $(this).hasClass('selected');
			if ($(this).hasClass('trade-platform-button') || $(this).hasClass('account-type-button') || (this.hasAttribute('data-ml') && $(this).data('ml') != 'reg_type')) {
				var $input = $('<input type="' + inType + '" data-parsley-multiple="' + $(this).data('id') + '" name="' + $(this).data('id') + '" value="' + $(this).data('value') + '">');
				console.log('button',$buttons)
				let accountTypeBtns = $('.account-type-button');
				console.log('accountTypeBtns',accountTypeBtns)
				$input[0].checked = checked;
				// if (!accountTypeBtns[0].is(':visible')) {
				// 	$input[accountTypeBtns.length - 1].checked = checked;
				// }

				$(this).append($input);
			}
		});

		$('.wp-icm-open-account.live .register_form').each(function(index, section) {
			$(section).find('input').attr({
				'data-parsley-group': 'block-' + index,
				'autocomplete': 'off',
				'data-parsley-validation-threshold': '0',
				'data-parsley-trigger': 'keyup change'
			});
		});
		$('.wp-icm-open-account.live form').parsley({
			'data-parsley-focus': 'none'
		});
	}

	function hideUnsupportedCountriesByBranch($countries, branch) {
		if (!$countries || !$countries.length || !branch) return;
		var list = window['serverCountries'];
		window['branchCountries'] = [];
		for (var i in list) {
			var country = list[i];
			var hide = true;
			if (country && country.branching) {
				var countryBranchSettings = country.branching.find(function (b) { return b.branch == branch; });
				if (countryBranchSettings && countryBranchSettings.status != "4") {
					hide = false;
				}
			}
			if (!hide) {
				window['branchCountries'].push(country);
			}
		}
	}

	function fillPhoneCodeLabelByCountryName (countryName, $input) {
		var tel = getPhoneCodeByCountryName(countryName);
		var branch = window['currentBranch'];
		$input = $input || $('.wp-icm-open-account.live input#phone');
		var form = $('.wp-icm-open-account.live .register_form.active_step');
		var step = form.data('n');
		if (step == '5') {
			$input = $('.wp-icm-open-account.live input#joint_phone');
			$('.wp-icm-open-account.live input#joint_branch_id').val(branch);
		}
		$input.val(tel);
		$input.parent().toggleClass('has-label', true);
	}

	function getPhoneCodeByCountryName(countryName) {
		var countries = window['serverCountries'];
		var tel = '';
		if (countries && countries.length) {
			for (var i = 0, len = countries.length; i < len; i++) {
				var countryObject = countries[i];
				if (countryObject && countryObject.name === countryName) {
					tel = countryObject.tel; // from server countries list
					break;
				}
			}
		}
		tel = tel.replace(/ /g, '');
		return tel;
	}

	function getCountryObjectByCode(countryCode) {
		if (!countryCode) return null;
		return window['serverCountries'].find(function (sc) { return sc.code === countryCode; });
	}

	function getCountryObjectByName(countryName, isFromAll) {
		if (!countryName) return null;
		var countries = isFromAll ? window['allCountries'] : window['serverCountries'];
		return countries.find(function (sc) { return sc.name === countryName; });
	}
	window.getCountryObjectByName = getCountryObjectByName;

	function mountBranchedControls($inputsWrapper, isJoint) {
		if (isJoint) {
			$inputsWrapper.find('input').val('').each(function() {
				var oldName = $(this).attr('name'),
					newName = 'joint_' + oldName,
					oldParsleyMultiple = $(this).attr('data-parsley-multiple'),
					newParsleyMultiple = 'joint_' + oldParsleyMultiple,
					oldId = $(this).attr('id'),
					newId = 'joint_' + oldId;
				if (oldName.indexOf('joint_') === 0) return;
				if ($(this).parent().attr('data-id')) {
					$(this).parent().attr('data-id', 'joint_' + $(this).parent().attr('data-id'));
				}
				$(this).attr({
					'name': newName
				}).prop('checked', false).parsley().reset();
				$(this).removeAttr('value').parent().removeClass('has-label');
				if (typeof oldParsleyMultiple != 'undefined')
					$(this).attr('data-parsley-multiple', newParsleyMultiple);
				$(this).parent().removeClass('error').removeClass('success');
				if (typeof oldId != 'undefined')
					$(this).attr('id', newId);
				if (newId == 'joint_birth_day' || newId == 'joint_birth_year' || newId == 'joint_city' || newId == 'joint_zip_code')
					$(this).val('').parent().addClass('ab_fix1');
				if (newId == 'joint_address' || newId == 'joint_state')
					$(this).parent().removeClass('ab_fix1');
				if ($(this).attr('name') == 'joint_news_subscription')
					$(this).prop('checked', 'checked');
				if ($(this).hasClass('au_test')) {
					var val = $(this).next('label').data('value');
					$(this).val(val);
				}
			}).parent().find('label').each(function() {
				if ($(this).attr('for').indexOf('joint_') === 0) return;
				var newFor = 'joint_' + $(this).attr('for');
				$(this).attr('for', newFor);
			});
			$inputsWrapper.find('.notSearched .options_list').each(function() {
				if (!window['landingPage']) {
					var oldParsleyMultiple = $(this).attr('data-parsley-multiple'),
						newParsleyMultiple = 'joint_' + oldParsleyMultiple,
						oldId = $(this).attr('id'),
						newId = 'joint_' + oldId;
						if (!oldId || oldId.indexOf('joint_') === 0) return;
					if ($(this).parent().attr('data-id')) {
						$(this).parent().attr('data-id', 'joint_' + $(this).parent().attr('data-id'));
					}
					$(this).parsley().reset();
					$(this).removeAttr('value').parent().removeClass('has-label');
					if (typeof oldParsleyMultiple != 'undefined') $(this).attr('data-parsley-multiple', newParsleyMultiple);
					$(this).parent().removeClass('error').removeClass('success');
					if (typeof oldId != 'undefined') $(this).attr('id', newId);

					$(this).mCustomScrollbar({
						theme: "dark",
						autoExpandScrollbar: false,
						autoHideScrollbar: false,
						scrollButtons: { enable: false },
						scrollInertia: 0
					});
				}
			});
			$inputsWrapper.find('.select_btns_group .select_btn input').each(function() {
				var inVal = $(this).parent().data('value');
				$(this).val(inVal);
			});
			$inputsWrapper.find('#selectAddressDropdown').attr('id', 'joint_selectAddressDropdown');
			$inputsWrapper.find('#selectAddressWrapper').attr('id', 'joint_selectAddressWrapper');
		} else {
			$inputsWrapper.find('.field-input').each(function() {
				if ($(this).val().length)
					$(this).parent().addClass('has-label');
			});

			$inputsWrapper.find('.select_btn').each(function() {
				var inType;
				if ($(this).parent().hasClass('single_select')) {
					inType = 'radio';
				} else if ($(this).parent().hasClass('multi_select')) {
					inType = 'checkbox';
				}
				$(this).append('<input type="' + inType + '" data-parsley-multiple="' + $(this).data('id') + '" name="' + $(this).data('id') + '" value="' + $(this).data('value') + '" required="">');
			});
		}
	}

	function getURLParameters() {
		var url = window.location.href;
		var result = {};
		var searchIndex = (typeof url == 'string') ? url.indexOf("?") : -1;
		if (searchIndex == -1) return result;
		var sPageURL = url.substring(searchIndex + 1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=');
			result[sParameterName[0]] = sParameterName[1];
		}
		return result;
	}

		/***/ })
/******/ ]);

function toggleRefferControls (countryCode) {
	$('.wp-icm-open-account .input_group.reffer_id').hide();

	if (window.location.pathname.includes("eu") || window.location.pathname.includes("au") || window.location.pathname.includes("intl") || window.location.pathname.includes("uk") || window.location.hostname.includes("eu") || window.location.hostname.includes("uk")) {
		$('.wp-icm-open-account .input_group.reffer_check').hide();
		$('.wp-icm-open-account .input_group.reffer_id #reffer_id').val('');

		if (Cookies.get('camp')) {
			Cookies.remove('camp');
		}
    } else {
		$('.wp-icm-open-account .input_group.reffer_check').show();
		if ($('.wp-icm-open-account .input_group.reffer_check').prop('checked') == true) {
			$('.wp-icm-open-account .input_group.reffer_id').show();
		}
	}
}

function disableAddressAutoCompletion(accType) {
	var prefix = accType === "individual" ? "" : "joint_";

	$(".change-to-auto").hide();
	$(".change-to-manual").hide();

	$(`#${prefix}selectAddressInput`).parent().parent().hide();
	$(`#${prefix}address`).parent().parent().show();
	$(`#${prefix}city`).parent().parent().show();
	$(`#${prefix}state`).parent().parent().show();
	$(`#${prefix}state`).parent().addClass('has-label');
	$(`#${prefix}state`).prop('readonly', true);
	$(`#${prefix}zip_code`).parent().parent().show();
	document.querySelector('#'+prefix+'selectAddressDropdown').innerHTML = "";
}

function initAddressAutoCompletion(accType) {
	var hideCountriesFor = ["Canada, Thailand"];
	var prefix = accType === "individual" ? "" : "joint_";
	var country = document.querySelector(`#${prefix}countries`);

	if (!hideCountriesFor.includes(country.value)) {
		$(".change-to-auto").hide();
		$(".change-to-manual").show();
		$(`#${prefix}selectAddressInput`).parent().parent().show();
		$(`#${prefix}address`).parent().parent().hide();
		$(`#${prefix}city`).parent().parent().hide();
		$(`#${prefix}state`).parent().parent().hide();
		$(`#${prefix}zip_code`).parent().parent().hide();
		$(`#${prefix}zip_code`).removeAttr('required');
		document.querySelector('#'+prefix+'selectAddressDropdown').innerHTML = "";

		$(".address-selector").on("click", function() {
			if ($(this).hasClass("change-to-manual")) {
				$(".change-to-auto").show();
				$(".change-to-manual").hide();
				$(`#${prefix}selectAddressInput`).parent().parent().hide();
				$(`#${prefix}address`).parent().parent().show();
				$(`#${prefix}city`).parent().parent().show();
				$(`#${prefix}state`).parent().parent().show();
				$(`#${prefix}zip_code`).parent().parent().show();
				$('#selectAddressInput, #joint_selectAddressInput').removeAttr('required');
			} else {
				$(".change-to-auto").hide();
				$(".change-to-manual").show();
				$(`#${prefix}selectAddressInput`).parent().parent().show();
				$(`#${prefix}address`).parent().parent().hide();
				$(`#${prefix}city`).parent().parent().hide();
				$(`#${prefix}state`).parent().parent().hide();
				$(`#${prefix}zip_code`).parent().parent().hide();
			}
		});

		var selectAddressJElem = $(`#${prefix}selectAddressInput`);
		var selectAddressInput = document.querySelector(`#${prefix}selectAddressInput`);
		var selectAddressDropdown = document.querySelector(`#${prefix}selectAddressDropdown`);
		var selectAddressWrapper = document.querySelector(`#${prefix}selectAddressWrapper`);
		var manualAddressSelector = document.querySelector(".change-to-manual");
		var autoAddressSelector = document.querySelector(".change-to-auto");

		var xhr;
		var selectedAddress = null;

		var addressElem = document.querySelector(`#${prefix}address`);
		var cityElem = document.querySelector(`#${prefix}city`);
		var stateElem = document.querySelector(`#${prefix}state`);
		var zipCodeElem = document.querySelector(`#${prefix}zip_code`);

		function addAddressNotFoundError(){
			selectAddressJElem.parsley().reset();
			selectAddressJElem.parsley().addError("addressNotFound", { message: `Can not find your address? Please enter the address manually`, updateClass: true });
			selectAddressJElem.attr({
					"data-parsley-excluded": "true"
				}).parent().addClass("error").removeClass("success");
		}
		function addAddressNotSelectedError(){
			selectAddressJElem.parsley().reset();
			selectAddressJElem.parsley().addError("addressNotSelected", { message: $('.reg_form_address_not_selected').text(), updateClass: true });
			selectAddressJElem.attr({
					"data-parsley-excluded": "true"
				}).parent().addClass("error").removeClass("success");
		}

		function removeAddressNotSelectedError(){
			selectAddressJElem.parsley().removeError("addressNotSelected");
			selectAddressJElem.attr({
				"data-parsley-excluded": "false"
			}).parent().addClass("success").removeClass("error");
		}
		function removeAddressNotFoundError(){
			selectAddressJElem.parsley().removeError("addressNotFound");
			selectAddressJElem.attr({
				"data-parsley-excluded": "false"
			}).parent().addClass("success").removeClass("error");
		}

		function populateManual(formattedAddress){
			addressElem.value = formattedAddress.address;
			addressElem.parentElement.classList.add("has-label");
			$(addressElem).parsley().validate();

			cityElem.value = formattedAddress.city;
			cityElem.parentElement.classList.add("has-label");
			$(cityElem).parsley().validate();

			stateElem.value = formattedAddress.state;
			stateElem.parentElement.classList.add("has-label");
			$(stateElem).parsley().validate();

			zipCodeElem.value = formattedAddress.zipCode;
			zipCodeElem.parentElement.classList.add("has-label");
			$(zipCodeElem).parsley().validate();
		}

		function emptyManual(){
			addressElem.value = "";
			addressElem.parentElement.classList.remove("has-label");

			cityElem.value = "";
			cityElem.parentElement.classList.remove("has-label");

			stateElem.value = "";
			stateElem.parentElement.classList.remove("has-label");

			zipCodeElem.value = "";
			zipCodeElem.parentElement.classList.remove("has-label");
		}

		selectAddressInput.addEventListener("focus", function(e){
			selectAddressDropdown.style.display = "block";
		});

		selectAddressInput.addEventListener("input", function(e) {
			selectedAddress = null;

			removeAddressNotSelectedError();

			emptyManual();

			var input = e.target.value;
			if(input.length <= 4){
				selectAddressDropdown.innerHTML = "";
				return;
			}
			if(xhr && xhr.readyState != 4){
				xhr.abort();
			}

			xhr = $.get(`https://apigateway.icmarkets${Cookies.get('user_want_language') === 'cn' ? "-zht" : ""}.com/address?country=` + country.value + "&query=" + input + "&token=" + window.jwt).done(function(result) {
				selectAddressDropdown.innerHTML = "";
				removeAddressNotFoundError();

				result.forEach(function(address, index) {
					var element = document.createElement("li");
					element.setAttribute("id", "addressSuggested" + index);
					element.onclick = function(e) {
						$.ajax({
							type: "POST",
							url: `https://apigateway.icmarkets${Cookies.get('user_want_language') === 'cn' ? "-zht" : ""}.com/address/format?token=` + window.jwt,
							dataType: "json",
							data: {url: address.format, country: country.value}
						}).done(function(formattedAddress) {
							selectAddressInput.value = address.text;
							selectAddressDropdown.style.display = "none";

							removeAddressNotSelectedError();
							populateManual(formattedAddress);
							selectedAddress = formattedAddress;
							if(window[`${prefix}trulioo`]){
								$(".change-to-manual").hide();
								$(".change-to-auto").show();
								$(`#${prefix}selectAddressInput`).parent().parent().hide();
								$(`#${prefix}selectAddressInput`).removeAttr('required');
								$(`#${prefix}address`).parent().parent().show();
								$(`#${prefix}city`).parent().parent().show();
								$(`#${prefix}state`).parent().parent().show();
								$(`#${prefix}zip_code`).parent().parent().show();
								$(`#${prefix}zip_code`).removeAttr('required');
								$(`#${prefix}trulioo_fields`).find('input').removeAttr('required');
							}
						});
					};
					element.innerHTML = address.text;
					selectAddressDropdown.appendChild(element);
				})
			}).fail(function(fail) {
				// console.error('fail', fail);
				selectAddressDropdown.innerHTML = "";
				addAddressNotFoundError();
			});
		});

		window.addEventListener("click", function(e) {
			if (!selectAddressWrapper.contains(e.target) ) {
				selectAddressDropdown.style.display = "none";
			}
		  });
		selectAddressInput.addEventListener("blur", function(e){
			if (selectAddressInput.value === '') return;

			if (selectAddressDropdown.children.length === 0) {
				addAddressNotFoundError();
				return;
			}

			if (!selectedAddress) {
				addAddressNotSelectedError();
				return;
			}

			removeAddressNotFoundError()
			removeAddressNotSelectedError();
		});
		$(".change-to-manual").on("click",  function(e){
			removeAddressNotFoundError()
			removeAddressNotSelectedError();

		});
		$('.parsley-addressNotFound').parent().on("click", function(e){
			$(`#${prefix}selectAddressInput`).value = ""
		})
		$(".change-to-auto").on("click", function(e){
			if (!selectedAddress) {
				addAddressNotSelectedError();
			} else {
				populateManual(selectedAddress);
			}
		});
	} else {
		$(".change-to-auto").hide();
		$(".change-to-manual").hide();

		if(window['trulioo']){
			$(`#${prefix}address`).find('input').removeAttr('required');
		}else{
			$(`#${prefix}address`).parent().parent().show();
			$(`#${prefix}address`).attr("required","");
		}

		$(`#${prefix}city`).parent().parent().show();
		$(`#${prefix}state`).parent().parent().show();
		$(`#${prefix}zip_code`).parent().parent().show();
		$(`#${prefix}zip_code`).removeAttr('required');

		var selectAddressJElem = $(`#${prefix}selectAddressInput`);
		selectAddressJElem.removeAttr('required');
		selectAddressJElem.parsley().removeError("addressNotSelected");
		selectAddressJElem.parent().addClass("success").removeClass("error");
		selectAddressJElem.parent().parent().hide();
	}
}

function toggleAsknowledge (countryCode) {
	let branch = window['currentBranch'];
	$('.register_form_wrap').attr('data-branch', branch);
	$('body').attr('data-branch', branch);
	// just uncomment it only when will required!
	if (!window['isItCySECWebSite'] && branch == 2) {
		$('#redirect-country').html($('#countries').val());
		$('#redirect-url').html('<a id="live_registration_link" href="' + window['cysecWebsiteURL'] + '/open-trading-account/live">' + window['cysecWebsiteName'] + '</a>');
		$('body').toggleClass('redirect', true);
	} else {
		$('#redirect-country').html('');
		$('#redirect-url').html('');
		$('body').toggleClass('redirect', false);
	}

	var $acknowledgment = $('#acknowledgment');
	var $acknowledgment_wrap = $acknowledgment.parent();
	if (!window['isItCySECWebSite'] && branch != 2 && window['cysecCountriesString'].indexOf((countryCode || '**').toLowerCase()) !== -1) {
		$acknowledgment_wrap.find('label').html($('.cached-translation.reg_form_eu_clients_acknowledgment_branch' + branch).html());
		$acknowledgment.attr('required', '');
		$acknowledgment_wrap.show();
	} else {
		$acknowledgment_wrap.find('label').html('');
		$acknowledgment.removeAttr('required');
		$acknowledgment_wrap.hide();
	}

	let dataFor = window['cysecCountriesString'].indexOf((countryCode || '').toLowerCase()) !== -1 ? 'for-eu' : 'not-eu'
	$('.register_form_wrap').attr('data-eu', dataFor);
}

function isTruliooEnabled(countryCode) {
	if (!countryCode) return false;

	let country = window['allCountries'].find(country =>
		country.code == countryCode
	);

	if (!country) return false;

	let branch = country.branching.find(branch => branch.branch == window['currentBranch']);

	return branch ? branch.isTrulioo : false;
}

function generateTruliooFields(data, type) {
	let prefix = type === 'joint' ? 'joint_' : '';

	//Initialize the Trulioo fields
	let insert_inner_html = ''

	for (const [category, categoryFields] of Object.entries(data.data.properties)) {
		var obj = {}

		if( category === 'PersonInfo' ){
			for(const [key, values] of Object.entries(categoryFields['properties'])){
				// if(categoryFields['required'].includes(key)){
					// type: string / int
					if( values['type'] === 'string'){
						obj[key] = ''
					}else if( values['type'] === 'int' ){
						obj[key] = 0
					}
					if (key === 'AdditionalFields') {
						obj['AdditionalFields'] = {}
					}
				// }
			}
		}else if( category === 'Location' ){
			for(const [key, values] of Object.entries(categoryFields['properties'])){
				// if(categoryFields['required'].includes(key)){
					if( values['type'] === 'string'){
						obj[key] = ''
					}else if( values['type'] === 'int' ){
						obj[key] = 0
					}
					if( key === 'AdditionalFields'){
						obj['AdditionalFields'] = {}
					}
				// }
			}
		}else if( category === 'CountrySpecific' ){
			for(const [key, values] of Object.entries(categoryFields['properties'])){
				if( values['type'] === 'object'){
					obj[key] = {}

					for(const el of values['required']){
						obj[key][el] = '';
					}

					if (key === 'AU') {
						obj[key]['DriverLicenceCardNumber'] = '';
					}
				}
			}
		}else if( categoryFields['required'] != undefined && categoryFields['required'].length > 0 ){

			if(category === "NationalIds"){
				obj['Number'] = '';
				obj['Type'] = categoryFields['properties']['Type']['value'];
				let label = categoryFields['properties']['Number']['label'];

				// var nationalIdPattern= window[prefix + 'country_code'] === 'BR' ? "^[0-9]{11}$" :".*"
				// var nationalIdPatternMessage = window[prefix + 'country_code'] === 'BR' ? "The value seems to be invalid, it should be 11 digits" : "";

				// No label provided by Trulioo for Australia Medicare Card so have to hardcode
				if (window[prefix + 'country_code'] === 'AU' && obj['Type'] === 'health') {
					label = 'Medicare Card Number'
				}

				$(`#${prefix}identity-wrap .options_list.identityType`).append(`<li data-id="NationalId">National ID</li>`)
				// $(`#${prefix}identity-wrap .input_group.nationalId #${prefix}nationalId`).attr('data-parsley-pattern', nationalIdPattern).attr('data-parsley-pattern-message', nationalIdPatternMessage)
				if (label) $(`#${prefix}identity-wrap .input_group.nationalId label.field-label`).text(label);

			} else if (category === 'DriverLicence') {
				obj['Number'] = '';
				$(`#${prefix}identity-wrap .options_list.identityType`).append(`<li data-id="DriverLicence">Driver License</li>`)

			} else if (category === 'Passport') {
				obj['Number'] = '';
				$(`#${prefix}identity-wrap .options_list.identityType`).append(`<li data-id="Passport">Passport</li>`)

			} else {
				for(const [key, values] of Object.entries(categoryFields['properties'])){
					if(categoryFields['required'].includes(key)){
						// type: string / int
						if( values['type'] === 'string'){
							obj[key] = ''
						}else if( values['type'] === 'int' ){
							obj[key] = 0
						}
						insert_inner_html += `<div class="input_group input ${key}">
							<div class="field el_wrap">
								<label for="${key}" class="field-label" >${values.label}</label>
								<input autocomplete="off" type="text" id=${key} name="${key}"  class="field-input " required=false data-field-name="${key}">
							</div>
						</div>
						`
					}
				}
			}
		}

		if(obj && Object.keys(obj).length > 0) {
			window[prefix + 'truliooVerificationFields'][category] = obj
		}
	}

	// Show identity container if 1 or more ID is requested
	if ($(`#${prefix}identity-wrap .options_list.identityType > li`).length > 0) {
		$(`#${prefix}identity-wrap`).show()
	} else {
		$(`#${prefix}identity-wrap`).hide()
	}

	if(insert_inner_html !== ''){
		document.querySelector(`#${prefix}trulioo_fields`).innerHTML = insert_inner_html
		document.querySelector(`#${prefix}trulioo_fields`).style.display = 'block'
		$(`#${prefix}trulioo_fields`).find('input').removeAttr('required')
	}

	switch ($(`#${prefix}countries`).val()) {
		case 'China':
			$(`#${prefix}hint-cn-name`).show();
			$(`#${prefix}first_name`).attr('data-parsley-pattern', '.*').attr('data-parsley-must-be-chinese', 'true');
			$(`#${prefix}last_name`).attr('data-parsley-pattern', '.*').attr('data-parsley-must-be-chinese', 'true');
			$(`#${prefix}reg_form_live_identity_type input`).attr('data-parsley-excluded', 'false');
			$(`#${prefix}identity-wrap .searchDropdown .field-label span`).hide();
			$(`#${prefix}nationalId`).attr('data-parsley-pattern', '^([1-6][1-9]|50)[0-9]{4}(18|19|20)[0-9]{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)[0-9]{3}[0-9Xx]$');
			break
		// case 'Brazil':
		// 	$(`#${prefix}nationalId`).attr('data-parsley-pattern', '^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$');
		// 	break;
		default:
	}
}

function resetTruliooFields(type) {
	let prefix = '';

	if (type === 'joint') {
		prefix = 'joint_';
		window['joint_truliooVerificationFields'] = {};
	} else {
		window['truliooVerificationFields'] = {};
		window['joint_truliooVerificationFields'] = {};
	}

	$(`#${prefix}identity-wrap .options_list.identityType`).html('');
	$(`#${prefix}reg_form_live_identity_type > input`).val('');
	$(`#${prefix}identity-wrap .input_group input`).val('');
	$(`#${prefix}identity-wrap .input_group.nationalId .field-label`).text('National ID Number');
	$(`#${prefix}identity-wrap .input_group`).hide();
	$(`#${prefix}identity-wrap`).hide();

	$(`#${prefix}hint-cn-name`).hide();
	$(`#${prefix}first_name`).attr('data-parsley-pattern', '[A-Za-z \-]+').removeAttr('data-parsley-must-be-chinese');
	$(`#${prefix}last_name`).attr('data-parsley-pattern', '[A-Za-z \-]+').removeAttr('data-parsley-must-be-chinese');
	$(`#${prefix}reg_form_live_identity_type input`).attr('data-parsley-excluded', 'true');
	$(`#${prefix}identity-wrap .searchDropdown .field-label span`).show();
	$(`#${prefix}nationalId`).attr('data-parsley-pattern', "^([A-Za-z0-9\-\ \xD6\xF6\xC4\xE4\xFC\xDC\xDF\xC7\xE7\''\u4e00-\u9fa5]{1,100})$");
	$(`#${prefix}nationalId`).attr('data-parsley-excluded', 'true');

	document.querySelector(`#${prefix}trulioo_fields`).innerHTML = '';
	document.querySelector(`#${prefix}trulioo_fields`).style.display = 'none';
}

function getTruliooFieldsAndConsents(cCode, type = 'individual') {
	let prefix = '';

	if (type === 'joint') {
		prefix = 'joint_';
	}

	getSignTokenLive().then(function(token) {
		$.ajax({
			dataType: "json",
			url: window['serverURL'] + "?identityGetFields&countryCode=" + cCode + '&sign=' + token,
			success: function(data) {
				generateTruliooFields(data, type)

				$.ajax({
					dataType: "json",
					url: window['serverURL'] + "?identityGetConsents&countryCode=" + cCode + '&sign=' + token,
					success: function(data) {
						window[`${prefix}truliooConsents`] = data.data;
					},
					error: function(data) {
						console.error("ERROR identityGetConsents: incorrect ajax response data", data);
					}
				})
			},
			error: function(data) {
				console.error("ERROR identityGetFields: incorrect ajax response data", data);
			}
		});
	});
}

function convertChineseToPinyin() {
	// change individual Chinese name to pinyin
	var $firstNameInput = $('.wp-icm-open-account.live input#first_name');
	$firstNameInput.attr('data-orig', $firstNameInput.val());
	if ($firstNameInput.val() && $firstNameInput.val().match(/[\u4e00-\u9fa5]/g)) {
		$firstNameInput.val($firstNameInput.toPinyin().replace(/\s/g, ''));
	}
	var $lastNameInput = $('.wp-icm-open-account.live input#last_name');
	$lastNameInput.attr('data-orig', $lastNameInput.val());
	if ($lastNameInput.val()&& $lastNameInput.val().match(/[\u4e00-\u9fa5]/g)) {
		$lastNameInput.val($lastNameInput.toPinyin().replace(/\s/g, ''));
	}
	// change joint Chinese name to pinyin
	var $joint_firstNameInput = $('.wp-icm-open-account.live input#joint_first_name');
	$joint_firstNameInput.attr('data-orig', $joint_firstNameInput.val());
	if ($joint_firstNameInput.val() && $joint_firstNameInput.val().match(/[\u4e00-\u9fa5]/g)) {
		$joint_firstNameInput.val($joint_firstNameInput.toPinyin().replace(/\s/g, ''));
	}
	var $joint_lastNameInput = $('.wp-icm-open-account.live input#joint_last_name');
	$joint_lastNameInput.attr('data-orig', $joint_lastNameInput.val());
	if ($joint_lastNameInput.val() && $joint_lastNameInput.val().match(/[\u4e00-\u9fa5]/g)) {
		$joint_lastNameInput.val($joint_lastNameInput.toPinyin().replace(/\s/g, ''));
	}
}

function handleChineseNameInput(type = 'individual') {
	let prefix = '';

	if (type === 'joint') {
		prefix = 'joint_';
	}

	if ($(`input#${prefix}cn_name`).is(':checked')) {
		resetTruliooFields(type);
		window[`${prefix}trulioo`] = false;
		$(`input#${prefix}cn_name`).prop('checked', false)
	}
}