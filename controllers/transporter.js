var app = angular.module("kepya", ["ngRoute"]);


app.config(function ($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider
        .when("/", {
            templateUrl: "home.html"
        }).when("/register", {
            templateUrl: "register.html"

        })
        .when("/login", {
            templateUrl: "login.html"
        })
        .when("/producer", {
            templateUrl: "gentelella/production/index.html"
        })

});


app.controller('producer', function ($scope, $http, $location, $timeout) {
    $scope.base = '/amp/views/';
 $scope.loggedBuyer = {}; // Real producer
    $scope.producerV = {}; // Temporary producer. These datas will be to update
    
    $scope.proposta = {}
    

    $scope.productosProduz = '';
    $http.get('../../../../geodata/products.json').then(function (success) {
        $scope.products = success.data.products;
        //alert($scope.states);
        // alert(JSON.stringify($scope.states));

    }, function (error) {


    })
    $http.get('../../../../geodata/statesAngola.json').then(function (success) {
        $scope.states = success.data.states;
        //alert($scope.states);
        // alert(JSON.stringify($scope.states));

    }, function (error) {


    })




    $scope.buscarFacturas = function (idProdutoc, produtor, totalMultibanco) {

        $http.post("http://kepya.co.ao/api/classes/buscarFacturas.php").then(function (result) {
            //alert(JSON.stringify(result.data));
            $scope.facturas = result.data.facturas

        });



    }
    
    
    
    
        $scope.fazerBid = function () {
            var dados = {
                'idComprador':$scope.proposta.idComprador, 
                'idTransportador':$scope.proposta.idTransportador, 
                'idFactura':$scope.proposta.idFactura, 
                'valorBid':$scope.proposta.valor, 
                'mensagem':$scope.proposta.mensagem,
                'whoTexted':'Transportador'
            }
            
        $http.post("http://kepya.co.ao/api/bid/bidConversation.php", dados).then(function (result) {
            //alert(JSON.stringify(result.data));
           /// $scope.facturas = result.data.facturas
            $scope.msg = "Proposta enviada com sucesso!"
             $scope.buscarBids()
        });



    }
        
        $scope.buscarBids = function(){
            var dados = {
                
                'idTransportador':$scope.proposta.idTransportador, 
                'idFactura':$scope.proposta.idFactura, 
               
            }
            
            
            $http.post("http://kepya.co.ao/api/bid/buscarBids.php", dados).then(function (result) {
                            $scope.bids = result.data.bids

            //alert(JSON.stringify($scope.bids));
            //$scope.msg = "Proposta enviada com sucesso!"
        });
            
            //alert(JSON.stringify(dados))
            
        }
        
        
        
        
        
        $scope.abrirBid = function(idComprador, idFactura){
            $scope.msg = '';
            $scope.proposta.valor = ''
           $scope.proposta.mensagem = ''
            $scope.proposta.idComprador = idComprador;
             $scope.proposta.idTransportador = $scope.user.id;
            $scope.proposta.idFactura = idFactura
            
           // alert(JSON.stringify($scope.proposta))
            $scope.buscarBids()
            $('#bid').modal();
        }
    $scope.fecharBid = function(){
        //alert(JSON.stringify($scope.proposta))
        
        $('#bid').modal('hide');
    }
    
    
    
    
    
    $scope.aceitar = function(id){
         var dados = {
                
                'id':id,
             'statusBid':'1',
             'whoAccepted':'Transportador',
             'idFactura':$scope.proposta.idFactura
             
               
            }
            
            
            $http.post("http://kepya.co.ao/api/bid/aceitarBid.php", dados).then(function (result) {
                     //       $scope.bids = result.data.bids

            ////alert(JSON.stringify($scope.bids));
            $scope.msg = "Bid aceite com sucesso!"
            $scope.buscarBids()
            
        });
            
            //alert(JSON.stringify(dados))
            
       // alert(id)
    }
    
    $scope.rejeitar = function(id){
        
        alert(id)
    }
    
    
   $scope.verifyEmail = function(){
        $http.post("http://kepya.co.ao/api/classes/verifyEmail.php", {'emailCode': $scope.producerV.emailCode, 'userId':$scope.user.id}).then(function(success){
            
            
            $scope.user.statusEmail == 1
            
           // alert(JSON.stringify(success.data))
        }, function(error){
            
        }) 
        
    }
    
    
    
     $scope.verifyTelephone = function(){
        $http.post("http://kepya.co.ao/api/classes/verifyTelephone.php", {'telephoneCode': $scope.producerV.telephoneCode, 'userId':$scope.user.id}).then(function(success){
            //alert(JSON.stringify(success.data))
            
            if (success.data.telephone == 1){
                 $scope.user.statusTelephone = 1

            }else{
                 $scope.user.statusTelephone = 0

            }
            $scope.logout()
        }, function(error){
            
        }) 
        
    } 
    
    
    $scope.logout = function () {

        window.location.href = $scope.base
    }
    $scope.searchText = null;
    $scope.change = function (text) {
        valtosend = $scope.searchText;
        $http.post("http://kepya.co.ao/api/classes/buscarProdutosByProducer.php", {
            'idProducer': valtosend
        }).then(function (result) {
            $scope.entries = result.data;
        });
    }
    $scope.buscarProdutos = function (text) {
        valtosend = $scope.searchText;
        $http.post("http://kepya.co.ao/api/classes/buscarProductosBuyer.php", {
            'idProducer': valtosend
        }).then(function (result) {
            $scope.todosOsProdutos = result.data.productos;
        });
    }
   

    $scope.producer = function () {

        $scope.user = JSON.parse(localStorage.getItem('user'));

        if ($scope.user) {

            if ($scope.user.statusTelephone == 0) { // if the email and telephone are not verified the system has to force for it
                $scope.loggedBuyer.inactive = true

                $('#missingData').modal();

            } else {


                $('#missingData').modal('hide');

            }
        } else {
            window.location.href = $scope.base + "login"
        }
    }

    $scope.$watch("$viewContentLoad", function () {
$scope.producer()
        $scope.buscarFacturas()

    })
});