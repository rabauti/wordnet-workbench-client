/**
 * Created by ivar on 1.12.15.
 */

define([
    'angularAMD',
    'service/LexiconService'
], function (angularAMD) {

    angularAMD.controller('main/literalSearchCtrl', ['$scope', '$state', '$log', '$uibModal', '$uibModalInstance', 'wnwbApi', 'service/LexiconService', 'searchType', 'lexiconMode', function ($scope, $state, $log, $uibModal, $uibModalInstance, wnwbApi, lexiconService, searchType, lexiconMode) {

        console.log('main/literalSearchCtrl (searchType: '+searchType+')');

        $scope.searchTerm = '';
        $scope.searchResults = [];
        $scope.selectedLexicalEntry = null;
        $scope.senseList = [];
        $scope.selectedSense = null;
        $scope.searchType = searchType;

        $scope.doSearch = function (searchTerm) {
            if(searchTerm.length) {
                var results = wnwbApi.LexicalEntry.query({prefix: searchTerm, lexid: lexiconService.getWorkingLexicon().id}, function () {
                    $scope.searchResults = results;
                });
            }
        };

        $scope.selectLexicalEntry = function (lexicalEntry) {
            $scope.selectedLexicalEntry = lexicalEntry;
            $scope.selectedSense = null;

            if(!$scope.searchType || $scope.searchType == 'sense') {
                var senseList = wnwbApi.Sense.query({word: lexicalEntry.lemma}, function () {
                    $scope.senseList = senseList;
                });
            }
            if($scope.searchType == 'synset') {
                var senseList = wnwbApi.SynSet.query({word: lexicalEntry.lemma}, function () {
                    $scope.senseList = senseList;
                });
            }
        };

        $scope.selectSenseRow = function (sense) {
            $scope.selectedSense = sense;
        };

        $scope.cancel = function () {
            $uibModalInstance.close(null);
        };

        $scope.goToSense = function () {
            $uibModalInstance.close();
            if($scope.selectedSense) {
                if($scope.selectedSense.synset) {
                    $state.go('synset', {id: $scope.selectedSense.synset});
                } else {
                    $state.go('sense', {id: $scope.selectedSense.id});
                }
            }
        };

        $scope.selectSense = function (sense) {
            $uibModalInstance.close(sense);
        };

        $scope.selectSynSet = function (synset) {
            $uibModalInstance.close(synset);
        };

        $scope.$watch('searchTerm', function (newVal, oldVal) {
            $scope.doSearch(newVal);
        });
    }]);
});