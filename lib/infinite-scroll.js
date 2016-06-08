(function() {
    'use strict';

    angular
        .module('infinite-scroll')
        .directive('infiniteScroll', ['$rootScope', '$window', '$interval',
            function($rootScope, $window, $interval) {
                return {
                    scope: {
                        infiniteScroll: '&',
                        infiniteScrollContainer: '=',
                        infiniteScrollDistance: '=',
                        infiniteScrollDisabled: '=',
                        infiniteScrollUseDocumentBottom: '=',
                        infiniteScrollListenForEvent: '@'
                    },
                    link: function(scope, elem, attrs) {

                        var _windowElement = angular.element($window);
                        var _container = null;
                        var _scrollDistance = 0;
                        var _scrollEnabled = false;
                        var _checkWhenEnabled = false;
                        var _useDocumentBottom = false;
                        var _checkInterval = null;
                        var _unregisterEventListener = null;

                        // infinite-scroll specifies a function to call when the window,
                        // or some other container specified by infinite-scroll-container,
                        // is scrolled within a certain range from the bottom of the
                        // document. It is recommended to use infinite-scroll-disabled
                        // with a boolean that is set to true when the function is
                        // called in order to throttle the function call.
                        function handler() {

                            function height(elem) {
                                elem = elem[0] || elem;
                                if (isNaN(elem.offsetHeight)) {
                                    return elem.document.documentElement.clientHeight;
                                } else {
                                    return elem.offsetHeight;
                                }
                            }

                            function pageYOffset(elem) {
                                elem = elem[0] || elem;
                                if (isNaN(window.pageYOffset)) {
                                    return elem.document.documentElement.scrollTop;
                                } else {
                                    return elem.ownerDocument.defaultView.pageYOffset;
                                }
                            }

                            function offsetTop(elem) {
                                if (!elem[0].getBoundingClientRect || elem.css('none')) {
                                    return;
                                }
                                return elem[0].getBoundingClientRect().top + pageYOffset(elem);
                            }

                            if (!_checkInterval) {
                                _checkInterval = $interval(function() {
                                    $interval.cancel(_checkInterval);
                                    _checkInterval = null;

                                    _checkWhenEnabled = false;

                                    var containerBottom, elementBottom;
                                    if (_container === _windowElement) {
                                        containerBottom = height(_container) + pageYOffset(_container[0].document.documentElement);
                                        elementBottom = offsetTop(elem) + height(elem);
                                    } else {
                                        containerBottom = height(_container);
                                        var containerTopOffset = 0;
                                        if (offsetTop(_container) !== void 0) {
                                            containerTopOffset = offsetTop(_container);
                                        }
                                        elementBottom = offsetTop(elem) - containerTopOffset + height(elem);
                                    }

                                    if (_useDocumentBottom) {
                                        elementBottom = height((elem[0].ownerDocument || elem[0].document).documentElement);
                                    }

                                    var remaining = elementBottom - containerBottom;
                                    var shouldScroll = remaining <= height(_container) * _scrollDistance + 1;
                                    if (shouldScroll) {
                                        if (_scrollEnabled) {
                                            if (scope.$$phase || $rootScope.$$phase) {
                                                return scope.infiniteScroll();
                                            } else {
                                                return scope.$apply(scope.infiniteScroll);
                                            }
                                        } else {
                                            _checkWhenEnabled = true;
                                        }
                                    }
                                }, 100);
                            }
                        }

                        scope.$on('$destroy', function scopeDestroy() {
                            if (_container) {
                                _container.removeEventListener('scroll', handler, false);
                            }

                            if (_checkInterval) {
                                $interval.cancel(_checkInterval);
                                _checkInterval = null;
                            }

                            if (_unregisterEventListener !== null) {
                                _unregisterEventListener();
                                _unregisterEventListener = null;
                            }
                        });

                        // infinite-scroll-distance specifies how close to the bottom of the page
                        // the window is allowed to be before we trigger a new scroll. The value
                        // provided is multiplied by the container height; for example, to load
                        // more when the bottom of the page is less than 3 container heights away,
                        // specify a value of 3. Defaults to 0.
                        function handleInfiniteScrollDistance(v) {
                            _scrollDistance = parseFloat(v) || 0;
                        }
                        scope.$watch('infiniteScrollDistance', handleInfiniteScrollDistance);
                        handleInfiniteScrollDistance(scope.infiniteScrollDistance);

                        // infinite-scroll-disabled specifies a boolean that will keep the
                        // infnite scroll function from being called; this is useful for
                        // debouncing or throttling the function call. If an infinite
                        // scroll is triggered but this value evaluates to true, then
                        // once it switches back to false the infinite scroll function
                        // will be triggered again.
                        function handleInfiniteScrollDisabled(v) {
                            _scrollEnabled = !v;
                            if (_scrollEnabled && _checkWhenEnabled) {
                                _checkWhenEnabled = false;
                                handler();
                            }
                        }
                        scope.$watch('infiniteScrollDisabled', handleInfiniteScrollDisabled);
                        // If I don't explicitly call the handler here, tests fail. Don't know why yet.
                        handleInfiniteScrollDisabled(scope.infiniteScrollDisabled);

                        // use the bottom of the document instead of the element's bottom.
                        // This useful when the element does not have a height due to its
                        // children being absolute positioned.
                        function handleInfiniteScrollUseDocumentBottom(v) {
                            _useDocumentBottom = v;
                        }
                        scope.$watch('infiniteScrollUseDocumentBottom', handleInfiniteScrollUseDocumentBottom);
                        handleInfiniteScrollUseDocumentBottom(scope.infiniteScrollUseDocumentBottom);

                        // infinite-scroll-container sets the container which we want to be
                        // infinte scrolled, instead of the whole window. Must be an
                        // Angular or jQuery element, or, if jQuery is loaded,
                        // a jQuery selector as a string.
                        function changeContainer(newContainer) {
                            if (_container !== null) {
                                _container.removeEventListener('scroll', handler, false);
                            }

                            _container = newContainer;

                            if (_container !== null) {
                                _container.addEventListener('scroll', handler, false);
                            }
                        }
                        changeContainer(_windowElement);
                        
                        if (scope.infiniteScrollListenForEvent) {
                            _unregisterEventListener = $rootScope.$on(scope.infiniteScrollListenForEvent, handler);
                        }

                        function handleInfiniteScrollContainer(newContainer) {
                            // TODO: For some reason newContainer is sometimes null instead
                            // of the empty array, which Angular is supposed to pass when the
                            // element is not defined
                            // (https://github.com/sroze/ngInfiniteScroll/pull/7#commitcomment-5748431).
                            // So I leave both checks.
                            if ((newContainer === null) || newContainer.length === 0) {
                                return;
                            }

                            if (newContainer instanceof HTMLElement) {
                                newContainer = angular.element(newContainer);
                            } else if (typeof newContainer.append === 'function') {
                                newContainer = angular.element(newContainer[newContainer.length - 1]);
                            } else if (typeof newContainer === 'string') {
                                newContainer = angular.element(document.querySelector(newContainer));
                            }

                            if (newContainer === null) {
                                throw new Error('invalid infinite-scroll-container attribute.');
                            }

                            changeContainer(newContainer);
                        }
                        scope.$watch('infiniteScrollContainer', handleInfiniteScrollContainer);
                        handleInfiniteScrollContainer(scope.infiniteScrollContainer || []);

                        // infinite-scroll-parent establishes this element's parent as the
                        // container infinitely scrolled instead of the whole window.
                        if (attrs.infiniteScrollParent !== null) {
                            changeContainer(angular.element(elem.parent()));
                        }

                        // infinte-scoll-immediate-check sets whether or not run the
                        // expression passed on infinite-scroll for the first time when the
                        // directive first loads, before any actual scroll.
                        if (attrs.infiniteScrollImmediateCheck !== null) {
                            var immediateCheck = scope.$eval(attrs.infiniteScrollImmediateCheck);
                            if (immediateCheck) {
                                handler();
                            }
                        }
                    }
                };
            }
        ]);
})();