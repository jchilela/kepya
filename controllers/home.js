var app = angular.module("kepya", ["ngRoute", "ngMaterial", 'ngMessages']);
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
        .when("/contactos", {
            templateUrl: "contacto.html"
        })
        .when("/producer", {
            templateUrl: "gentelella/production/index.html"
        })

});






app.controller('main', function ($scope, $http) {
    $scope.base = '/amp/views/';
    $scope.registos = {};
    $scope.logins = {};
    $scope.user = {};

    $scope.disable = true; // Says that all the fields are initially disabled, until the user choose some option


    $scope.registerUser = function () {
        $scope.dados = {
            'firstName': $scope.registos.firstName,
            'lastName': $scope.registos.lastName,
            'codProvince': $scope.registos.selectedProduct,
            'codCountry': '',
            'codMunicipality': '',
            'address': '',
            'telephone': $scope.registos.telephone,
            'email': $scope.registos.email,
            'pContact': '',
            'birthDate': '',
            'tipoUser': $scope.registos.userType,
            'username': $scope.registos.email,
            'password': $scope.registos.password,
            'statusConta': 1,
            'lnPreference': 'pt',
            'statusEmail': 1,
            'statusTelephone': 1 // Status email e telefone 0 indica que inicie a conta sem estar activo
        }

        // alert(JSON.stringify($scope.dados))
        $http.post("http://kepya.co.ao/api/register/register.php", $scope.dados).then(function (success) {
//alert(JSON.stringify(success.data))
            if(success.data.response=='1'){
                    $scope.logins.username =  $scope.registos.email;
                    $scope.logins.password = $scope.registos.password;
                    $scope.loginUser()
                
            }
      
        }, function (error) {


        })





    }





    $scope.loginUser = function () {
        $scope.dadosLogin = {
            'username': $scope.logins.username,
            'password': $scope.logins.password
        }
//alert(JSON.stringify($scope.dadosLogin))
        $http.post("http://kepya.co.ao/api/login/login.php", $scope.dadosLogin).then(function (success) {
            // $scope.user = success.data.user
            //alert(JSON.stringify(success.data))

            $scope.user = success.data.dados;
            localStorage.setItem('user', JSON.stringify($scope.user))


            $scope.userTest = JSON.parse(localStorage.getItem('user'));

        




            if ($scope.user) {

                if ($scope.userTest.tipoUser == 1) {
                   
                   window.location.href = "http://localhost:8888/amp/bower_components/entities/buyer/production/index.html?data=" + $scope.user.id + ""; // Comprador 
                    
                  // window.location.href = "http://dev.kepya.co.ao/amp/bower_components/entities/buyer/production/index.html?data=" + $scope.user.id + ""; // Comprador

                }
                if ($scope.userTest.tipoUser == 2) { // tipoUser 0 is the producer.
                    //alert('yes')
                     window.location.href = "http://localhost:8888/amp/bower_components/entities/producer/production/index.html?data=" + $scope.user.id + "";
                    
                   // window.location.href = "http://dev.kepya.co.ao/amp/bower_components/entities/producer/production/index.html?data=" + $scope.user.id + ""; // Produtor

                }
                if ($scope.user.tipoUser == 3) {
                     window.location.href = "http://localhost:8888/amp/bower_components/entities/transporter/production/index.html?data=" + $scope.user.id + ""; // Transportador 

                   // window.location.href = "http://dev.kepya.co.ao/amp/bower_components/entities/transporter/production/index.html?data=" + $scope.user.id + ""; // Transportador 

                }
                if ($scope.user.tipoUser == 4) {
                    window.location.href = "http://dev.kepya.co.ao/amp/bower_components/entities/aggregator/production/index.html?data=" + $scope.user.id + ""; // agregador

                }




            } else {
                $scope.msgError ="Erro no Nome de Usuário ou Password"
            }



        }, function (error) {


        })



    }







    $scope.setDateTime = function () {

        $("#datetimepicker1").datetimepicker().on("dp.change", function (data) {

            $scope.dataNascimento = data.date._d;
            var data = new Date($scope.dataNascimento).toLocaleString();
            data = data.split(',')[0]
            var mes = data.split('/')[0];
            var dia = data.split('/')[1];
            var ano = data.split('/')[2];
            var dataFinal = ano + '-' + mes + '-' + dia;

            $scope.registos.birthDate = dataFinal;


        });
    }

    
    $scope.contactoAccao = function(nome, email, telefone, mensagem){
        
        $http.post("https://kepya.co.ao/api/notifications/contactoEmail.php", {'nome':nome, 'email': email, 'telefone':telefone,'msg':mensagem}).then(
        function(success){
            
            $scope.msgSucessoC = "Obrigado por nos contactar. Responderemos o seu email dentro de 24 horas!"
            $scope.no = "";
            $scope.em ="";
            $scope.tel = "";
            $scope.ms = "";
            
            
        }, function(error){
            
            
        })
        
    }
    


    /*REGISTER */

    $scope.typeUser = function (typeU) { // Detect the type of user who is registering
        // alert(typeU)
        $scope.registos.userType = typeU;

        if (typeU == 1) {
            $scope.disable = false;
        }
        if (typeU == 2) {
            $scope.disable = false;
        }
        if (typeU == 3) {
            $scope.disable = false;
        }
        if (typeU == 4) {
            $scope.disable = false;
        }

    }


    $scope.register = function () { // Redirect the user from the main page to the register pager
        window.location.href = $scope.base + "register"
    }
    $scope.login = function () { // Redirect the user from the main page to the register pager
        window.location.href = $scope.base + "login"
    }
    $scope.contactos = function () { // Redirect the user from the main page to the register pager
        window.location.href = $scope.base + "contactos"
    }

    $http.get('../geodata/countries.json').then(function (success) {
        $scope.countries = success.data.countries;

    }, function (error) {


    })

    $http.get('../geodata/statesAngola.json').then(function (success) {
        $scope.states = success.data.states;

    }, function (error) {


    })


    $http.get('../geodata/citiesAngola.json').then(function (success) {
        $scope.cities = success.data.cities;
    }, function (error) {


    })









    $scope.$on('$viewContentLoaded', function () { // Every time the page loads, this function is called

        //Here your view content is fully loaded !!
    });



})