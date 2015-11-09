var app = angular.module("app", ["firebase"]);
app.controller("AppCtrl", function($scope, $firebaseArray, $firebaseAuth) {
  var ref = new Firebase("https://tagalicious.firebaseio.com");
  $scope.tags = $firebaseArray(ref.child('tags'));
  $scope.styles = $firebaseArray(ref.child('styles'));

  var getStylesFromString = function(str){
    var arr = str.split(',');
    var trimmedArray = [];

    arr.forEach(function(item){
      item.trim();
      trimmedArray.push(item);
    })
    return trimmedArray;
  }

  $scope.selectStyle = function(){
    $scope.selectedStyles = getStylesFromString($scope.inputStyle);
    for (var i = 0; i < $scope.selectedStyles.length; i++){
      var matchFound = false;
      for (var j = 0; j < $scope.styles.length; j++){
        if ($scope.selectedStyles[i] === $scope.styles[j].style){
          //selected style already exists in firebase object - just copy in the rest of the data
          matchFound = true;
          break;
        }
      }

      if (!matchFound){
        $scope.styles.$add({
          style: $scope.selectedStyles[i]
        })
      }
    }
  }

  $scope.applyTag = function(tag){
    for (var i = 0; i < $scope.styles.length; i++){
      if ($scope.selectedStyles.indexOf($scope.styles[i].style) > -1){
        //Style is selected
        if ($scope.styles[i].tags==undefined){
          $scope.styles[i].tags = [tag.tagName];
        } else {
          if ($scope.styles[i].tags.indexOf(tag.tagName) == -1){
            //Save the new tag if it isn't there yet
            $scope.styles[i].tags.push(tag.tagName);
          }
        }
        $scope.styles.$save(i);
      }
    }
  }


  $scope.removeTag = function(tag){

    for (var i = 0; i < $scope.styles.length; i++){
      if ($scope.selectedStyles.indexOf($scope.styles[i].style) > -1){
        //Style is selected
        if ($scope.styles[i].tags==undefined){
          continue;
        } else {
          var tagIndex = $scope.styles[i].tags.indexOf(tag.tagName);
          if (tagIndex > -1){
            $scope.styles[i].tags.splice(tagIndex, 1);
          }
        }
        
        $scope.styles.$save(i);
      }
    }

  }

  $scope.createTag = function(){
    $scope.tags.$add({
      tagName: $scope.newTagName,
      styleCount: 0
    });

    $scope.newTagName = null;
  };

  $scope.selectedTagCount = function(tag){
    if ($scope.selectedStyles == undefined){
      return 0;
    }

    var matches = 0;
    for (var j = 0; j < $scope.styles.length; j++){
        //For each style that exists
        if ($scope.styles[j].tags != undefined 
          && $scope.selectedStyles.indexOf($scope.styles[j].style) >= 0){
          //If the style has tags and is selected
        for (var z = 0; z < $scope.styles[j].tags.length; z++){
            //for each tag on the selected item
            if ($scope.styles[j].tags[z] === tag.tagName){
              //if the tag on the item matches the tagname
              matches += 1;
            }
          }
        }
      }
      return matches;
    }

    $scope.totalTagCount = function(tag){
      if ($scope.styles == undefined){
        return 0;
      }

      var matches = 0;
      for (var j = 0; j < $scope.styles.length; j++){
        //For each style that exists
        if ($scope.styles[j].tags != undefined){
          //If the style has tags
          for (var z = 0; z < $scope.styles[j].tags.length; z++){
            //for each tag on the selected item
            if ($scope.styles[j].tags[z] === tag.tagName){
              //if the tag on the item matches the tagname
              matches += 1;
            }
          }
        }
      }
      return matches;
    }

    $scope.killTag = function(tag){
      for (var i = 0; i < $scope.styles.length; i++){
        if (true){
        //Don't care if Style is selected
        if ($scope.styles[i].tags==undefined){
          continue;
        } else {
          var tagIndex = $scope.styles[i].tags.indexOf(tag.tagName);
          if (tagIndex > -1){
            $scope.styles[i].tags.splice(tagIndex, 1);
          }
        }
        $scope.styles.$save(i);
      }
    }
    $scope.tags.$remove(tag);
  }
  

})