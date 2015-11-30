'use strict';

/**
 * @ngdoc function
 * @name skywayApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the skywayApp
 */
angular.module('skywayApp')
  .controller('MainCtrl', ["$scope", function ($scope) {

    $scope.message;

    $scope.showList = function () {
        console.log($scope.userMessageList)
    }

    $scope.userMessageList = [];

    $scope.addMessage = function (message) {
        $scope.userMessageList.push(message);
        console.log($scope.userMessageList);

        $("#eom").css('display' , 'inline');
        $("#eom").focus();
        setTimeout(function() { $("#eom").css("display" , 'none') }, 100);
    }

    SpeechRec.on_config(function(conf){
        console.log("config");
        console.log(config);
    });

    console.log("availability")
    console.log(SpeechRec.availability());

    var push = function (message) {
        $scope.userMessageList.push(message);
        $scope.$apply();
    }

    $scope.start = function () {
        SpeechRec.start();
        SpeechRec.on_start(function () {
            console.log("Started"); 

            SpeechRec.on_voice_begin(function(){
                console.log("voice started");// 引数はありません

                  SpeechRec.on_result(function(result){
                    console.log("result is ");// result: 認識結果
                    console.log(result.candidates[0]);
                    var message = result.candidates[0].speech;
                    console.log("message")
                    console.log(message)
                    console.log("I am pushing")
                    console.log(push)
                    push(message)

                    SpeechRec.on_voice_end(function(){
                        console.log("voice ended");// 引数はありません
                    });

                  });
            });


            SpeechRec.on_no_result(function(){
                console.log("認識結果が得られなかった")
            });
        });

    };


    $scope.stop = function () {
        SpeechRec.stop();
    };

  }]);
