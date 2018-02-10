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
app.filter('num', function() {
    return function(input) {
      return parseInt(input, 10);
    };
});

app.controller('producer', function ($scope, $http, $location, $timeout) {
    $scope.desactivarBotaoComprar = false;
    $scope.base = '/amp/views/';
    
    $scope.proposta = {}

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



    var productosNovos = [];


    $scope.produc = {
        items: []
    }



    $scope.carrinho = {
        items: []
    }



    $scope.adicionarAoCarrinho = function (idProducto, product, descricao, preco, produtor, provincia, foto, dataColheita) {
        $scope.carrinho = {
            items: []
        }

        $scope.carrinho.items.push({
            idProducto: idProducto,
            producto: product,
            description: descricao,
            preco: preco,
            produtor: produtor,
            provincia: provincia,
            fotografia: foto,
            dataColheita: dataColheita
        });

        localStorage.setItem("carrinho", JSON.stringify($scope.carrinho));

        $('#checkout').modal();

    }



    $scope.abrirMulticaixaInfo = function(total,numeroFactura){
        $scope.multibancoTotal = total;
        $scope.numeroFacturaTotal = numeroFactura;
        $('#multicaixaP').modal()
    }
    
    $scope.concluirmulticaixaP = function(){
        $('#multicaixaP').modal('hide')
    }
    
    
    $scope.fecharcheckout = function () {
        $scope.successoFactura = false;
        $scope.desactivarBotaoComprar = false
        $scope.multibanco = 0
        $('#checkout').modal('hide');


    }
    
    $scope.editarPerfil = function(){
        $('#editarPerfil').modal();
        
    }
    $scope.fecharEditarPerfil = function(){
        $('#editarPerfil').modal('hide');
    }
    
    
    
    $scope.confirmarPagamento = function(pagoCom, numeroFactura, totalPagoComTransporte){
        
        var dados = {'pagoCom': pagoCom,
                    'numeroFactura': numeroFactura,
                    'totalPagoComTransporte': totalPagoComTransporte}
        
        
        
        //alert(JSON.stringify(dados));
        
         $http.post("https://kepya.co.ao/api/classes/pagamentoFinal.php", dados).then(function (result) {
            //alert(JSON.stringify(result.data));
             
             if(pagoCom=='M'){
                  $scope.successoPagamento = 'A sua reserva foi feita com sucesso. Aguardamos pelo talão de confirmação do pagamento'
            //$scope.desactivarBotaoComprar = true;
             }else{
                  $scope.successoPagamento = 'O seu pagamento foi efectuado com sucesso. O Kepya fará o seu produto chegar o mais breve.'
            //$scope.desactivarBotaoComprar = true;
             }
           
            

        });

        
    }
    
    
$scope.verifyEmail = function(){
        $http.post("https://kepya.co.ao/api/classes/verifyEmail.php", {'emailCode': $scope.producerV.emailCode, 'userId':$scope.user.id}).then(function(success){
            
            
            $scope.user.statusEmail == 1
            
           // alert(JSON.stringify(success.data))
        }, function(error){
            
        }) 
        
    }
    
    
    
     $scope.verifyTelephone = function(){
        $http.post("https://kepya.co.ao/api/classes/verifyTelephone.php", {'telephoneCode': $scope.producerV.telephoneCode, 'userId':$scope.user.id}).then(function(success){
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

    $scope.pagamentoCartao = function (totalPagar, numeroFacturaTotal) {

        
        $scope.numeroFacturaTotal = numeroFacturaTotal;
        $scope.totalP = totalPagar;
        
        //alert(totalPagar);


        var handler = StripeCheckout.configure({
            key: 'pk_test_PRmIgCzfSSa4pqFSRY5fsP0z',
            locale: 'auto',
            token: function (token) {
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.

                var myData = {
                    'token': token.id,
                    'email': $scope.user.email,
                    'amount': totalPagar * 100,
                    'message': "Pagamento Stripe",
                    'cliente': $scope.user.id + "-Parcelado-" + $scope.pgtoT,

                };
               // alert(JSON.stringify(myData))

                
                $http.post("https://kepya.co.ao/api/stripe/charge.php", myData).then(function (sucesso) {

                    //$scope.respostaPag = sucesso.data.status; // Verificar se o login foi bem sucessedido
                   // alert(JSON.stringify(sucesso.data))

                    

                         $scope.confirmarPagamento('C',  $scope.numeroFacturaTotal, $scope.totalP)

                       // $window.location.href = '#dashboard';



                   

                }, function (erro) {


                    console.log(erro)



                })


            }

        })
        // Open Checkout with further options:
        handler.open({
            name: 'Kepya',
            email: $scope.user.email,
            zipCode: false,
            currency: 'aoa',
            amount: totalPagar * 100
        });
        
        e.preventDefault();


        // Close Checkout on page navigation:
        window.addEventListener('popstate', function () {
            handler.close();
        });






    }


    $scope.definirTotalPagar = function (totalPagar) {
        $scope.totalPagarPaypal = totalPagar;
    }




    $scope.multibancoDef = function (total, quantidade) {
        $scope.totalMultibanco = total
        $scope.multibanco = 1
        $scope.quantidadeDoComprador = quantidade
        
        checkout
        
        
        
    }


    $scope.$watch('multibanco', function () {
        //alert('hey, myVar has changed!');
    });



    $scope.gravarFactura = function (idProdutoc, produtor, totalMultibanco,quantidade, provincia,endereco) {
        
     
        $scope.dados = {

            'idProduto': idProdutoc,
            'idComprador': $scope.user.id,
            'cEmail': $scope.user.email,
            'idProdutor': produtor,
            'quantidade': quantidade,
            'formaPagamento': '',
            'idTransportador': '',
            'totalPago': totalMultibanco,
            'enderecoEntrega':provincia + ', ' + endereco


        }

        $http.post("https://kepya.co.ao/api/classes/gerarFactura.php", $scope.dados).then(function (result) {
           
            $scope.successoFactura = 'A sua reserva foi feita com sucesso. Aguarde por propostas de transporte'
            $scope.desactivarBotaoComprar = true;
            

        });



    }




    $scope.pagamentoPaypal = function (totalPagarPaypal,numeroFactura) {







        var total = totalPagarPaypal;

        var precoFinal = parseFloat(totalPagarPaypal).toFixed(2);


        if ($scope.pgtoT === 'sim') { // O cliente irá pagar apenas 20%
            precoFinal = precoFinal / 2;

            // alert(precoFinal)
        } else {
            if ($scope.coupon) {


                var total = $scope.total().toFixed(2);

                var precoFinal = parseFloat(total).toFixed(2);

                var tota = precoFinal - (precoFinal * parseInt($scope.coupon.percentagem) / 100);
                $scope.ValorAposCoupon = Math.round(tota * 100) / 100


                //var tot = parseInt($scope.coupon.percentagem) * precoFinal / 100
                // alert(tot  + 'Percentagem' + parseFloat($scope.coupon.percentagem) + 'Total' + totalPAgar);
                precoFinal = $scope.ValorAposCoupon;
            }

        }

        localStorage.setItem('precoFinal', precoFinal);

        localStorage.setItem('pagoCom', 'PayPal');
        localStorage.setItem('ln', $scope.ln);
        console.log(total);


        paypal.Button.render({

            // Pass the client ids to use to create your transaction on sandbox and production environments


            client: {
                sandbox: 'access_token$sandbox$484bpbbgj2p9cjkh$9bac7641389b2de3ac85715a80991624', // from https://developer.paypal.com/developer/applications/
                production: 'access_token$production$tbj55ymj5g96gch5$2255143c65c0fb24c3eda9ac5985fc22' // from https://developer.paypal.com/developer/applications/
            },

            // Pass the payment details for your transaction
            // See https://developer.paypal.com/docs/api/payments/#payment_create for the expected json parameters

            payment: function (data, actions) {
                return actions.payment.create({
                    transactions: [
                        {
                            amount: {
                                total: precoFinal,
                                currency: 'EUR'
                            }
                    }
                ]
                });
            },

            // Display a "Pay Now" button rather than a "Continue" button

            commit: true,

            // Pass a function to be called when the customer completes the payment

            onAuthorize: function (data, actions) {
                return actions.payment.execute().then(function (response) {
                    //console.log('The payment was completed!');

                     $scope.confirmarPagamento = ('paypal', numeroFactura, totalPagarPaypal)
                     
                     
                     
                    $window.location.href = '#dashboard';


                    //$scope.modalWaitingAjax();

                });
            },

            // Pass a function to be called when the customer cancels the payment

            onCancel: function (data) {
                //console.log('The payment was cancelled!');

                //$window.location.href = '#dashboard';

            }

        }, '#paypalPagamento');


    }









    $scope.checarOEstado = function (valor) {

       /* $scope.pgtoT = valor;
        $("#paypalPagamento").remove();


        var mydiv = document.getElementById("paypalPagamentoDiv");
        var aTag = document.createElement('a');
        aTag.setAttribute('href', "");
        aTag.innerHTML = "";
        aTag.setAttribute('id', 'paypalPagamento');
        
        try{
                  mydiv.appendChild(aTag);
  
        }catch(x){
            
        }





        $scope.pagamentoPaypal()
        //alert($scope.pgtoT)*/
    }



    $scope.pusharProduto = function (idProducto, product, descricao, preco, produtor, provincia, foto, dataColheita) {



        if (product) {

            $scope.produc.items.push({
                idProducto: idProducto,
                producto: product,
                description: descricao,
                preco: preco,
                produtor: produtor,
                provincia: provincia,
                fotografia: foto,
                dataColheita: dataColheita
            });

        }




        //productosNovos.push($scope.produc.items);

    }




    $scope.logout = function () {

        window.location.href = $scope.base
    }






    $scope.chamar = function () {
        //alert(JSON.stringify($scope.produc.items));
        //alert(JSON.stringify($scope.produc.items))

    }



    $scope.searchText = null;
    $scope.change = function (text) {
        valtosend = $scope.searchText;
        $http.post("https://kepya.co.ao/api/classes/buscarProdutosByProducer.php", {
            'idProducer': valtosend
        }).then(function (result) {
            $scope.entries = result.data;
        });
    }


    $scope.buscarProdutos = function (text) {
        valtosend = $scope.searchText;
        $http.post("https://kepya.co.ao/api/classes/buscarProductosBuyer.php", {
            'idProducer': valtosend
        }).then(function (result) {
            $scope.todosOsProdutos = result.data.productos;
        });
    }



    /*  
    $scope.change = function(text) {
            valtosend = $scope.searchText;
            $http.post("http://kepya.co.ao/api/classes/buscarProdutosByProducer.php", {'idProducer':valtosend}).then(function(result){
            $scope.entries = result.data;
            });
            $http.post("http://kepya.co.ao/api/classes/buscarProdutosByProducer.php", {'idProducer':valtosend}).then(function(result){
            $scope.persons = result.data;
            });


 }
    */


    $scope.loggedBuyer = {}; // Real producer
    $scope.producerV = {}; // Temporary producer. These datas will be to update
$scope.registosEd = {};
    $scope.productosProduz = '';

    $scope.buyer = function () {

        $scope.user = JSON.parse(localStorage.getItem('user'));
    
       
        
        
        $scope.registosEd.firstName = $scope.user.firstName;
        $scope.registosEd.lastName = $scope.user.lastName;
        $scope.registosEd.selectedProduct = $scope.user.codProvince;
        $scope.registosEd.telephone = Number($scope.user.telephone);
        $scope.registosEd.email = $scope.user.email;
        
        
        
        
        
        
        
        
        
        
        
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
    
    
    
    $scope.editarUser = function(){
        
        var dados = {'dados': $scope.registosEd, 'userID': $scope.user.id };
        
                $http.post("https://kepya.co.ao/api/buyer/editarPerfil.php", dados).then(function (result) {
                     $('#editarPerfil').modal('hide');
                      $scope.user.firstName = $scope.registosEd.firstName 
                      $scope.user.lastName = $scope.registosEd.lastName 
                      $scope.user.codProvince = $scope.registosEd.selectedProduct
                      $scope.user.telephone = $scope.registosEd.telephone 
                      $scope.user.email = $scope.registosEd.email
                    
                    localStorage.setItem('user', JSON.stringify($scope.user))
                    
                    
                   swal('Edição de Perfil','Dados editados com sucesso','success')
                });

    }
    




    $scope.buscarMinhasCompras = function () {
        // alert($scope.user.id)
        $http.post("https://kepya.co.ao/api/buyer/buscarMinhasCompras.php", {
            'idComprador': $scope.user.id
        }).then(function (result) {
            $scope.minhasFacturas = result.data.facturas;


             //alert(JSON.stringify(result.data))
        });

        $('#verFacturas').modal();

    }

    $scope.fecharMinhasCompras = function () {
        $('#verFacturas').modal('hide')
    }









    $scope.buscarBids = function () {
        var dados = {

            'idComprador': $scope.proposta.idTransportador,
            'idFactura': $scope.proposta.idFactura,

        }


        $http.post("https://kepya.co.ao/api/buyer/buscarMeusBids.php", dados).then(function (result) {
            $scope.bids = result.data.facturas

            //alert(JSON.stringify($scope.bids));
            //$scope.msg = "Proposta enviada com sucesso!"
        });

       // alert(JSON.stringify(dados))

    }

    
    
       $scope.aceitar = function(id){
         var dados = {
                
                'id':id,
             'statusBid':'1',
             'whoAccepted':'Transportador',
             'idFactura':$scope.proposta.idFactura
             
               
            }
            
            
            $http.post("https://kepya.co.ao/api/bid/aceitarBid.php", dados).then(function (result) {
                     //       $scope.bids = result.data.bids

            ////alert(JSON.stringify($scope.bids));
            $scope.msg = "Proposta aceite com sucesso!"
            $scope.buscarBids()
            
        });
            
            //alert(JSON.stringify(dados))
            
       // alert(id)
    }




    $scope.abrirBid = function (idFactura) {
        $('#verFacturas').modal('hide');
        
        $scope.proposta.idComprador = $scope.user.id;
        $scope.proposta.idTransportador = $scope.user.id;
        $scope.proposta.idFactura = idFactura

        // alert(JSON.stringify($scope.proposta))
        $scope.buscarBids()
        $('#bid').modal();
    }
    $scope.fecharBid = function () {
        //alert(JSON.stringify($scope.proposta))
        $scope.esconderBotao = false;
        $('#bid').modal('hide');
    }
    
    
    
    
    $scope.buscarFacturaByID = function(numeroFactura){
        
        var dados = {'numeroFactura':numeroFactura}
        
        $http.post("https://kepya.co.ao/api/classes/buscarFacturasByID.php", dados).then(function (result) {
                            $scope.facturaServer = result.data.Factura

            //alert(JSON.stringify($scope.facturaServer));
            //$scope.msg = "Bid aceite com sucesso!"
           
            
        });
    }
    
    
    
    
    $scope.efectuarPagamento = function(numeroFactura, valorBid){
        
        $scope.buscarFacturaByID(numeroFactura);
        $scope.valorBid = valorBid;
        
         $('#bid').modal('hide');
        
         $('#efectuarPagamento').modal();
        
        
    }
    
    $scope.concluirEfectuarPagamento = function(){
        $('#efectuarPagamento').modal('hide');
    }



$scope.swee = function(){
    swal("Here's a message!")
}
    
    
    //Cancelar reserva
    
    $scope.cancelarReserva = function(idReserva){
        
        $('#verFacturas').modal('hide')
        
        
                    swal({
                      title: "Tem certeza?",
                      text: "Não poderá recuperar a reserva eliminada!",
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonClass: "btn-danger",
                      confirmButtonText: "Sim, Elimine!",
                      cancelButtonText: "Não, Não Elimine!",
                      closeOnConfirm: true,
                      closeOnCancel: true
                    },
                    function(isConfirm) {
                      if (isConfirm) {
                          
                         var dados = {'idReserva': idReserva}
        
                            $http.post("https://kepya.co.ao/api/classes/cancelarReserva.php",dados).then(function(success){

                                $scope.resposta = success.data.response
                                $scope.reservaCancelada = true;
                                $scope.buscarMinhasCompras()

                            })
                          
                            swal("Eliminado!", "A reserva foi eliminada.", "success");
            
            
                          
                          
                      } else {
                          
                          
                                $('#verFacturas').modal()
                      }
                    });

        
        

        
       
        
        
    }
    
    $scope.fecharComprasPagas = function(){
        $('#verComprasPagas').modal('hide')
    }
    
    
       $scope.buscarComprasPagas = function(){
        // alert($scope.user.id)
        $http.post("https://kepya.co.ao/api/buyer/buscarComprasPagas.php", {
            'idComprador': $scope.user.id
        }).then(function (result) {
            $scope.comprasPagas = result.data.facturas;


            // alert(JSON.stringify(result.data))
        });

        $('#verComprasPagas').modal();

    }
       
       
       $scope.esconderBotaoPagar = function(){
           $scope.esconderBotao = true;
           
       }
    
    





    $scope.$watch("$viewContentLoad", function () {
        
        $scope.buyer()
        $scope.multibanco = 0
        // $scope.buscarProdutosByProducer2()
        $scope.buscarProdutos()
        $scope.checarOEstado('sim')



    })





});