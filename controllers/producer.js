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
app.filter('withPoint', function () {
    return function(input) {
        return input.replace(/,/g, ".");
    };
});

app.controller('producer', function ($scope, $http, $location) {
$scope.base = '/amp/views/';
    $scope.loggedProducer = {}; // Real producer
    $scope.producerV = {}; // Temporary producer. These datas will be to update
    
    $scope.productosProduz = '';
    
    $scope.producer = function(){
        
        $scope.user = JSON.parse(localStorage.getItem('user'));
        
        if ($scope.user) {

                if ($scope.user.statusTelephone == 0 ) { // if the email and telephone are not verified the system has to force for it
                    $scope.loggedProducer.inactive = true
        
                   $('#missingData').modal();

                }else{
                    
                    
                    $('#missingData').modal('hide');
           
                }
            } else {
                window.location.href = $scope.base + "login"
            }

        


    }
    
    
    $scope.editarOqueProduzo = function(){ // Editar os dados do que eu produzo
        
        $http.get("http://kepya.co.ao/api/classes/buscarProductosRegisto.php", {'get':1}).then(function(success){
           // alert(JSON.stringify(success.data))
            
            $scope.productosProduz = success.data.productos;
            
        }, function(error){
            
        }) 
        
        
        $('#missingData').modal();
        
    }
   
    
      $scope.buscarProdutosByProducer = function(){ // Editar os dados do que eu produzo
        
        $http.post("http://kepya.co.ao/api/classes/buscarProdutosByProducer.php", {'idProducer':$scope.user.id}).then(function(success){
           // alert(JSON.stringify(success.data))
            
            $scope.todosProductos = success.data.productos;
            
        }, function(error){
            
        }) 
        
        
        $('#verProductos').modal();
        
    }
    
    
      
      
      
      
      
       $scope.eliminarProdutos = function(tabela, id){
         
         
         $http.post("http://kepya.co.ao/api/classes/eliminarProdutos.php", {'tabela': tabela, 'id':id, 'idProducer':$scope.user.id}).then(function(success){
            //alert(JSON.stringify(success.data))
           
                $scope.todosProductos = success.data.dados;
            
        }, function(error){
            
        }) 
         
         //alert(tabela + '  -   ' + id)
         
     }
     
       
       
       
       $scope.buscarProdutosByProducer2 = function(){ // Editar os dados do que eu produzo
        
        $http.post("http://kepya.co.ao/api/classes/buscarProdutosByProducer.php", {'idProducer':$scope.user.id}).then(function(success){
           // alert(JSON.stringify(success.data))
            
            $scope.todosProductos = success.data.productos;
            
        }, function(error){
            
        }) 
        
        
      //  $('#verProductos').modal();
        
    }
      
    
    
    
    
    
    
    
    
    
    
    $scope.ajuda = function() {
         $('#ajuda').modal()
    }
    
    
    
    
    
    $scope.resendEmailCode = function(){ // If the user didnt receive his code
        $http.post("http://kepya.co.ao/api/notifications/resendEmailCode.php", {'email': $scope.user.email, 'firstName':$scope.user.firstName}).then(function(success){
           // alert(JSON.stringify(success.data))
        }, function(error){
            
        })
    }
    
    $scope.resendTelephoneCode = function(){
        $http.post("http://kepya.co.ao/api/notifications/resendTelephoneCode.php", {'telephone': $scope.user.telephone, 'firstName':$scope.user.firstName}).then(function(success){
           // alert(JSON.stringify(success.data))
        }, function(error){
            
        }) 
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
    
     
     $scope.logout = function(){
         
         window.location.href = $scope.base
     }
     
     
     
     
     $scope.adicionarProductosRegisto = function(){
         
          $http.post("http://kepya.co.ao/api/classes/adicionarProdutosRegisto.php", {'idUser': $scope.user.id, 'producto':$scope.producerV.producto, 'quantidade': $scope.producerV.quantidade}).then(function(success){
            //alert(JSON.stringify(success.data))
            
            $scope.productosProduz = success.data.productos;
            
        }, function(error){
            
        }) 
         
     }
     
     
     $scope.eliminar = function(tabela, id){
         
         
         $http.post("http://kepya.co.ao/api/classes/eliminar.php", {'tabela': tabela, 'id':id}).then(function(success){
            //alert(JSON.stringify(success.data))
            
            $scope.productosProduz = success.data.dados;
            
        }, function(error){
            
        }) 
         
         //alert(tabela + '  -   ' + id)
         
     }
     
     
     
     
     $scope.concluirRegisto = function(){
         
          $('#missingData').modal('hide');
     }
     
     $scope.concluirAjuda = function(){
         
          $('#ajuda').modal('hide');
     }
     
      $scope.concluirRegistarProdutos = function(){
         
          $('#registarProductos').modal('hide');
     }
     
       $scope.registarProductosModal = function(){
         
          $('#registarProductos').modal();
     }
       
       $scope.concluirEliminarProdutos = function(){
            $('#verProductos').modal('hide');
       }
     
     
     
       
       $scope.cadastrarProdutos = function(){
           var dados = {'nome':$scope.registarProdutos.produto,
                       'descricao': $scope.registarProdutos.descricao,
                        'quantidade':$scope.registarProdutos.quantidade,
                       'preco': $scope.registarProdutos.preco,
                        'dataColheita':$scope.registarProdutos.dataColheita,
                       'idProducer': $scope.registarProdutos.idProducer,
                        'idProvincia': $scope.registarProdutos.idProvincia,
                        'enderecoColheita': $scope.registarProdutos.enderecoColheita,
                        'fotografia': $scope.registarProdutos.fotografia
                       }
           $http.post("",dados).then(function(success){
               
           })
           
       }
       
       
       
     
       
       $scope.verVendas = function () {
        // alert($scope.user.id)
        $http.post("http://kepya.co.ao/api/classes/buscarMinhasVendas.php", {
            'idProdutor': $scope.user.id
        }).then(function (result) {
            $scope.minhasFacturas = result.data.facturas;


            // alert(JSON.stringify(result.data))
        });

        $('#verFacturas').modal();

    }

       
       $scope.fecharVendas = function(){
           $('#verFacturas').modal('hide');
       }
       
       
     
     
     $http.get('../../../../geodata/statesAngola.json').then(function (success) {
        $scope.states = success.data.states;
//alert($scope.states);
        // alert(JSON.stringify($scope.states));
         
    }, function (error) {


    })
     
     
     
     
     $http.get('../../../../geodata/products.json').then(function (success) {
        $scope.products = success.data.products;
//alert($scope.states);
        // alert(JSON.stringify($scope.states));
         
    }, function (error) {


    })
    
     
     $http.get('../../../../geodata/tons_year.json').then(function (success) {
        $scope.tons_year = success.data.tons_year;
//alert($scope.states);
        // alert(JSON.stringify($scope.states));
         
    }, function (error) {


    })
    
    
    
     $scope.$watch("$viewContentLoad", function() {
         $scope.producer()
         
         $scope.buscarProdutosByProducer2()
         
         var paramValue = $location.search().resp; 
         
         if(paramValue==1){
             $scope.registoSucesso = 'Produto registado com sucesso'
           $scope.registarProductosModal()
         }
         
     })
    
    
});







