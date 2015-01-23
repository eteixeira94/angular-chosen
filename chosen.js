/**
* Author: Ednardo Teixeira
* Componente: Angular Chosen
*/
(function () {

    angular.module('angular.chosen', []).directive('chosen', function() {
        var directive = {
            scope: {
                options: '=',
                ngModel: '=',
                ngDisabled: '=',
                action: '='
            },
            link: function (scope, element, attrs) {

                var maxSelection = returnsUndefinedIfInfinityOrIsNaN(parseInt(attrs.maxSelection, 10));
                var searchThreshold = returnsUndefinedIfInfinityOrIsNaN(parseInt(attrs.searchThreshold, 10));

                var otherVal = '';

                element.chosen({
                    width: attrs.width? attrs.width: '100%',
                    max_selected_options: maxSelection,
                    disable_search_threshold: searchThreshold,
                    search_contains: true,
                    no_results_text: attrs.noResultsText? attrs.noResultsText: ''
                });

                element.on('change', function () {
                    element.trigger('chosen:updated');
                });

                scope.$watch('[' + watchCollection.join(',') + ']', function () {
                  otherVal = element.next().children('div').children('.chosen-search').children('input').val();
                  if (otherVal !== '') {
                      angular.forEach(scope.options, function(value, key) {
                          if (value.name === otherVal) {
                              setTimeout(function() {
                                scope.$apply(function() {
                                     scope.ngModel = value;
                                     element.next().children('a').children('span').text(scope.ngModel.name);
                                     var children = element.children();
                                     angular.forEach(children, function(value, key) {
                                          $(value).removeAttr('selected');
                                          if($(value).attr('value') == scope.ngModel[!attrs.searchActiveName?'id':attrs.searchActiveName]){
                                              $(value).attr('selected','selected');
                                          }
                                      });

                                     var elementNext = element.next();
                                     elementNext.removeClass('chosen-with-drop');

                                     elementNext.unbind('click');
                                     elementNext.bind("click", function(){
                                        if (elementNext.hasClass('chosen-with-drop')) {
                                          elementNext.removeClass('chosen-with-drop');
                                        } else {
                                          elementNext.addClass('chosen-with-drop');
                                        }
                                     });
                                });
                              });
                              otherVal = '';
                          }
                      });
                  }

                  element.trigger('chosen:updated');
                }, true);

                EVENTS.forEach(function (event) {
                    var eventNameAlias = Object.keys(event)[0];

                    if (typeof scope[eventNameAlias] === 'function') {
                        var elementCurrent = element.next()
                            .children('.chosen-drop')
                            .children('.chosen-results');

                        element.on(event[eventNameAlias], function (event) {
                            elementCurrent.unbind('click');
                            elementCurrent.bind("click", function(){
                              var resultText = this.children[0].children[0].innerText;

                                scope.$apply(function () {
                                    scope[eventNameAlias](scope.action, resultText);
                                });
                            });
                        });
                    }
                });
            }
        };

        watchCollection = [];
        Object.keys(directive.scope).forEach(function (scopeName) {
            watchCollection.push(scopeName);
        });

        EVENTS = [{
            onChange: 'change'
        }, {
            onReady: 'chosen:ready'
        }, {
            onMaxSelected: 'chosen:maxselected'
        }, {
            onShowDropdown: 'chosen:showing_dropdown'
        }, {
            onHideDropdown: 'chosen:hiding_dropdown'
        }, {
            onNoResult: 'chosen:no_results'
        }];

        EVENTS.forEach(function (event) {
            var eventNameAlias = Object.keys(event)[0];
            directive.scope[eventNameAlias] = '=';
        });

        var returnsUndefinedIfInfinityOrIsNaN = function(val){
            if (isNaN(val) || val === Infinity) {
                return undefined;
            }

            return val;
        }

        return directive;
    });
})();