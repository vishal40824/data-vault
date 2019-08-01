app.controller('fileController', function($scope, $http, $route, $location){
    $scope.add = false;
    
    $scope.logo = "add_circle";
    $scope.uploadFile = function(){
        var file = $scope.myDoc;
        var fd = new FormData();
        fd.append('file', file);

        $scope.mess = {
            uploaded: true
        };
        
        $http.post('/api/upload/' + $scope.prod +"/" + $scope.flex +"/" + $scope.ver +"/" + $scope.ed +"/" + $scope.instSelect +"/" + $scope.selectedData + "/" + $scope.myGet, fd , {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(res => {
            $scope.mess = res.data;
            $route.reload();
        });
    }
    
    $scope.addcat = function(){
        $scope.add = $scope.add ? false : true;
        if($scope.logo == "add_circle"){
            $scope.logo = "clear";
        }else{
            $scope.logo = "add_circle";
        }
    }
    
    $scope.catalog = function(cat){
        $http.post('/api/insertCatalog', {cat: cat}).then(res => {
            $route.reload();
        });
    }
    
    $scope.dispCat = function(){
        $http.get('/api/getCatalog').then(res =>{
            $scope.catalogData = res.data;
        });
    }

    $scope.getParam = function(){
        $scope.myGet = $location.search().catname;
    }

    $scope.catname = function(catname){
        window.location.href = "#/specific?catname=" + catname;
    }

    $scope.getSpecificCatData = function(catname){
        $http.get('/api/getSpecificData/' + catname).then(res => {
            $scope.gotSpecificData = res.data;
        });
    }

    $scope.deleteCat = (id) => {
        $http.delete('/api/deleteCat/' + id).then(res => {
            const delVal = res.data;
            $scope.gotSpecificData = $scope.gotSpecificData.filter(item => item._id !== delVal._id);
        });
    }

    $scope.getLoggedUser = () =>{
        $http.get('/api/loggedUser').then(res => {
            $scope.userLogged = res.data;
        });
    }
});