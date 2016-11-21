using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Interop.ErpBS900;
using Interop.StdPlatBS900;
using Interop.StdBE900;
using Interop.GcpBE900;
using ADODB;

namespace WebStoreAPI.Lib_Primavera
{
    public class PriIntegration
    {
        

        # region Cliente

        public static List<Model.Cliente> ListaClientes()
        {
            
            
            StdBELista objList;

            List<Model.Cliente> listClientes = new List<Model.Cliente>();

            if (PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
            {

                //objList = PriEngine.Engine.Comercial.Clientes.LstClientes();

                objList = PriEngine.Engine.Consulta("SELECT Cliente, Nome, Moeda, NumContrib as NumContribuinte, Fac_Mor AS campo_exemplo FROM  CLIENTES");

                
                while (!objList.NoFim())
                {
                    listClientes.Add(new Model.Cliente
                    {
                        CodCliente = objList.Valor("Cliente"),
                        NomeCliente = objList.Valor("Nome"),
                        Moeda = objList.Valor("Moeda"),
                        NumContribuinte = objList.Valor("NumContribuinte"),
                        Morada = objList.Valor("campo_exemplo")
                    });
                    objList.Seguinte();

                }

                return listClientes;
            }
            else
                return null;
        }

        public static Lib_Primavera.Model.Cliente GetCliente(string codCliente)
        {
            

            GcpBECliente objCli = new GcpBECliente();


            Model.Cliente myCli = new Model.Cliente();

            if (PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
            {

                if (PriEngine.Engine.Comercial.Clientes.Existe(codCliente) == true)
                {
                    objCli = PriEngine.Engine.Comercial.Clientes.Edita(codCliente);
                    myCli.CodCliente = objCli.get_Cliente();
                    myCli.NomeCliente = objCli.get_Nome();
                    myCli.Moeda = objCli.get_Moeda();
                    myCli.NumContribuinte = objCli.get_NumContribuinte();
                    myCli.Morada = objCli.get_Morada();
                    return myCli;
                }
                else
                {
                    return null;
                }
            }
            else
                return null;
        }

        public static Lib_Primavera.Model.RespostaErro UpdCliente(Lib_Primavera.Model.Cliente cliente)
        {
            Lib_Primavera.Model.RespostaErro erro = new Model.RespostaErro();
           

            GcpBECliente objCli = new GcpBECliente();

            try
            {

                if (PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
                {

                    if (PriEngine.Engine.Comercial.Clientes.Existe(cliente.CodCliente) == false)
                    {
                        erro.Erro = 1;
                        erro.Descricao = "O cliente não existe";
                        return erro;
                    }
                    else
                    {

                        objCli = PriEngine.Engine.Comercial.Clientes.Edita(cliente.CodCliente);
                        objCli.set_EmModoEdicao(true);

                        objCli.set_Nome(cliente.NomeCliente);
                        objCli.set_NumContribuinte(cliente.NumContribuinte);
                        objCli.set_Moeda(cliente.Moeda);
                        objCli.set_Morada(cliente.Morada);

                        PriEngine.Engine.Comercial.Clientes.Actualiza(objCli);

                        erro.Erro = 0;
                        erro.Descricao = "Sucesso";
                        return erro;
                    }
                }
                else
                {
                    erro.Erro = 1;
                    erro.Descricao = "Erro ao abrir a empresa";
                    return erro;

                }

            }

            catch (Exception ex)
            {
                erro.Erro = 1;
                erro.Descricao = ex.Message;
                return erro;
            }

        }


        public static Lib_Primavera.Model.RespostaErro DelCliente(string codCliente)
        {

            Lib_Primavera.Model.RespostaErro erro = new Model.RespostaErro();
            GcpBECliente objCli = new GcpBECliente();


            try
            {

                if (PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
                {
                    if (PriEngine.Engine.Comercial.Clientes.Existe(codCliente) == false)
                    {
                        erro.Erro = 1;
                        erro.Descricao = "O cliente não existe";
                        return erro;
                    }
                    else
                    {

                        PriEngine.Engine.Comercial.Clientes.Remove(codCliente);
                        erro.Erro = 0;
                        erro.Descricao = "Sucesso";
                        return erro;
                    }
                }

                else
                {
                    erro.Erro = 1;
                    erro.Descricao = "Erro ao abrir a empresa";
                    return erro;
                }
            }

            catch (Exception ex)
            {
                erro.Erro = 1;
                erro.Descricao = ex.Message;
                return erro;
            }

        }



        public static Lib_Primavera.Model.RespostaErro InsereClienteObj(Model.Cliente cli)
        {

            Lib_Primavera.Model.RespostaErro erro = new Model.RespostaErro();
            

            GcpBECliente myCli = new GcpBECliente();

            try
            {
                if (PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
                {

                    myCli.set_Cliente(cli.CodCliente);
                    myCli.set_Nome(cli.NomeCliente);
                    myCli.set_NumContribuinte(cli.NumContribuinte);
                    myCli.set_Moeda(cli.Moeda);
                    myCli.set_Morada(cli.Morada);

                    PriEngine.Engine.Comercial.Clientes.Actualiza(myCli);

                    erro.Erro = 0;
                    erro.Descricao = "Sucesso";
                    return erro;
                }
                else
                {
                    erro.Erro = 1;
                    erro.Descricao = "Erro ao abrir empresa";
                    return erro;
                }
            }

            catch (Exception ex)
            {
                erro.Erro = 1;
                erro.Descricao = ex.Message;
                return erro;
            }


        }

       

        #endregion Cliente;   // -----------------------------  END   CLIENTE    -----------------------


        #region Artigo

        public static Lib_Primavera.Model.Product GetProduct(string codArtigo)
        {

            GcpBEArtigo objArtigo = new GcpBEArtigo();
            Model.Product myProduct = new Model.Product();

            if (PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
            {
                if (PriEngine.Engine.Comercial.Artigos.Existe(codArtigo) == false)
                {
                    return null;
                }
                else
                {
                    StdBELista objList1 = PriEngine.Engine.Consulta("SELECT Artigo.Artigo AS Code,Artigo.Descricao AS ArtDesc,Iva,Desconto,Artigo.STKActual AS STKAct,Familias.Descricao AS FamDesc,SubFamilias.Descricao AS SubFamDesc,Marcas.Descricao AS BrandDesc,Artigo.Modelo AS ArtModel,ArtigoMoeda.Moeda AS ArtCurrency,ArtigoMoeda.PVP1 AS ArtPVP1,ArtigoMoeda.PVP2 AS ArtPVP2,ArtigoMoeda.PVP3 AS ArtPVP3,ArtigoMoeda.PVP4 AS ArtPVP4,ArtigoMoeda.PVP5 AS ArtPVP5,ArtigoMoeda.PVP6 AS ArtPVP6,Garantias.Descricao AS Warranty,Artigo.PrazoEntrega AS DelTime FROM Artigo LEFT JOIN Familias ON Artigo.Familia = Familias.Familia LEFT JOIN Marcas ON Artigo.Marca = Marcas.Marca LEFT JOIN SubFamilias ON Artigo.Familia=SubFamilias.Familia AND Artigo.SubFamilia = SubFamilias.SubFamilia LEFT JOIN ArtigoMoeda ON Artigo.Artigo = ArtigoMoeda.Artigo AND Artigo.UnidadeBase = ArtigoMoeda.Unidade LEFT JOIN Garantias on Artigo.Garantia = Garantias.Garantia  WHERE Artigo.Artigo='" + codArtigo + "' AND Familias.Descricao IS NOT NULL AND Familias.Descricao <>'Serviços' ;");
                    List<Model.Product> products = retrieveProducts(objList1);
                    return products.First<Model.Product>();
                }

            }
            else
            {
                return null;
            }

        }
        /// <summary>
        /// The method that is called by the api/products
        /// </summary>
        /// <returns>List of products</returns>
        public static List<Model.Product> GetProducts()
        {

            StdBELista objList1;

            if (PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
            {

                objList1 = PriEngine.Engine.Consulta("SELECT Artigo.Artigo AS Code,Artigo.Descricao AS ArtDesc,Iva,Desconto,Artigo.STKActual AS STKAct,Familias.Descricao AS FamDesc,SubFamilias.Descricao AS SubFamDesc,Marcas.Descricao AS BrandDesc,Artigo.Modelo AS ArtModel,ArtigoMoeda.Moeda AS ArtCurrency,ArtigoMoeda.PVP1 AS ArtPVP1,ArtigoMoeda.PVP2 AS ArtPVP2,ArtigoMoeda.PVP3 AS ArtPVP3,ArtigoMoeda.PVP4 AS ArtPVP4,ArtigoMoeda.PVP5 AS ArtPVP5,ArtigoMoeda.PVP6 AS ArtPVP6,Garantias.Descricao AS Warranty,Artigo.PrazoEntrega AS DelTime FROM Artigo LEFT JOIN Familias ON Artigo.Familia = Familias.Familia LEFT JOIN Marcas ON Artigo.Marca = Marcas.Marca LEFT JOIN SubFamilias ON Artigo.Familia=SubFamilias.Familia AND Artigo.SubFamilia = SubFamilias.SubFamilia LEFT JOIN ArtigoMoeda ON Artigo.Artigo = ArtigoMoeda.Artigo AND Artigo.UnidadeBase = ArtigoMoeda.Unidade LEFT JOIN Garantias on Artigo.Garantia = Garantias.Garantia  WHERE Familias.Descricao IS NOT NULL AND Familias.Descricao <>'Serviços' ;");
                List<Model.Product> listProducts = new List<Model.Product>();
                listProducts = retrieveProducts(objList1);

                return listProducts;

            }
            else
            {
                return null;

            }

        }
        /// <summary>
        /// Retrieves all the products existing in the StdBELista
        /// </summary>
        /// <param name="objList1"> The object containing all the products</param>
        /// <returns>Returns the list of products that belong to the objList1 query</returns>
        public static List<Model.Product> retrieveProducts(StdBELista objList1)
        {
            List<Model.Product> listProducts = new List<Model.Product>();

            while (!objList1.NoFim())
            {
                Model.Product prod = new Model.Product();
                prod.Prices = new Model.Price();

                prod.Code = objList1.Valor("Code");
                prod.Description = objList1.Valor("ArtDesc");
                prod.Family = objList1.Valor("FamDesc");
                if (prod.Family == String.Empty || prod.Family == null)
                    prod.Family = "No Family";
                prod.SubFamily = objList1.Valor("SubFamDesc");
                if (prod.SubFamily == String.Empty)
                    prod.SubFamily = "No SubFamily";
                prod.Brand = objList1.Valor("BrandDesc").ToString();
                if (prod.Brand == String.Empty)
                    prod.Brand = "No Brand";
                prod.Model = objList1.Valor("ArtModel").ToString();
                if (prod.Model == String.Empty)
                    prod.Model = "No Model";
                prod.Currency = objList1.Valor("ArtCurrency");
                prod.Discount = objList1.Valor("Desconto");
                prod.IVA = objList1.Valor("Iva");
                prod.STKActual = objList1.Valor("STKAct");
                prod.DeliveryTime = objList1.Valor("DelTime");
                prod.Warranty = objList1.Valor("Warranty").ToString();
                //System.Diagnostics.Debug.WriteLine(c);
                if (prod.Warranty == String.Empty)
                    prod.Warranty = "No Warranty";


                prod.Prices.PVP1 = objList1.Valor("ArtPVP1");
                prod.Prices.PVP2 = objList1.Valor("ArtPVP2");
                prod.Prices.PVP3 = objList1.Valor("ArtPVP3");
                prod.Prices.PVP4 = objList1.Valor("ArtPVP4");
                prod.Prices.PVP5 = objList1.Valor("ArtPVP5");
                prod.Prices.PVP6 = objList1.Valor("ArtPVP6");
                prod.Prices = prod.Prices;
                StdBELista objList2 = PriEngine.Engine.Consulta("SELECT Armazem,SUM(StkActual) AS Total FROM ArtigoArmazem where Artigo= '" + prod.Code + "' GROUP BY Armazem;");
                prod.Warehouses = new List<Model.SimpleWarehouse>();
                Model.SimpleWarehouse warehouse = new Model.SimpleWarehouse();
                while (!objList2.NoFim())
                {
                    warehouse = new Model.SimpleWarehouse();
                    warehouse.Code = objList2.Valor("Armazem");
                    warehouse.Stock = objList2.Valor("Total");
                    prod.Warehouses.Add(warehouse);
                    objList2.Seguinte();
                }
                if (prod.Warehouses.Count == 0)
                    prod.Warehouses = null;


                listProducts.Add(prod);
                objList1.Seguinte();
            }

            return listProducts;
        }

        #endregion Artigo


        #region Warehouses

        /// <summary>
        /// Retrieves a list of all the warehouses existing in the database
        /// </summary>
        /// <returns>List of all warehouses</returns>
        public static IEnumerable<Model.Warehouse> GetWarehouses()
        {
            List<Model.Warehouse> warehouses = new List<Model.Warehouse>();
            StdBELista objList;
            List<Model.Warehouse> listWarehouses = new List<Model.Warehouse>();


            if (PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
            {

                objList = PriEngine.Engine.Consulta("SELECT Armazem,Morada,Descricao,Telefone,Cp,CpLocalidade FROM Armazens");
                Model.Warehouse warehouse = new Model.Warehouse();

                while (!objList.NoFim())
                {
                    warehouse = new Model.Warehouse();
                    warehouse.Code = objList.Valor("Armazem");
                    warehouse.Adress = objList.Valor("Morada").ToString();
                    if (warehouse.Adress == String.Empty)
                        warehouse.Adress = "No Adress";
                    warehouse.Description = objList.Valor("Descricao");
                    warehouse.Phone = objList.Valor("Telefone").ToString();
                    if (warehouse.Phone == String.Empty)
                        warehouse.Phone = "No Phone";
                    warehouse.PostalCode = objList.Valor("Cp").ToString();
                    if (warehouse.PostalCode == String.Empty)
                        warehouse.PostalCode = "No PostalCode";
                    warehouse.PostalCodeLocal = objList.Valor("CpLocalidade").ToString();
                    if (warehouse.PostalCodeLocal == String.Empty)
                        warehouse.PostalCodeLocal = "No PostalCodeLocal";

                    listWarehouses.Add(warehouse);
                    objList.Seguinte();
                }

                return listWarehouses;

            }
            else
            {
                return null;

            }
        }

        /// <summary>
        /// Method that searches and retrieves all products that exist in a warehouse
        /// </summary>
        /// <param name="warehouseId">The warehouse code id</param>
        /// <returns>returns the warehouse</returns>
        public static List<Model.SimpleProduct> GetProductWarehouse(string warehouseId)
        {
            StdBELista objList1;

            if (PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
            {
                if (!PriEngine.Engine.Comercial.Armazens.Existe(warehouseId))
                    return null;
                objList1 = PriEngine.Engine.Consulta("SELECT Artigo,SUM(ArtigoArmazem.StkActual) AS Stock FROM ArtigoArmazem where ArtigoArmazem.Armazem='" + warehouseId + "' GROUP BY ArtigoArmazem.Artigo,Armazem;");

                List<Model.SimpleProduct> listProducts = new List<Model.SimpleProduct>();
                listProducts = retrieveSimpleProducts(objList1);
                return listProducts;

            }
            else
            {
                return null;

            }
        }
        //ARRANJAR ISTO
        private static List<Model.SimpleProduct> retrieveSimpleProducts(StdBELista objList1)
        {
            List<Model.SimpleProduct> products = new List<Model.SimpleProduct>();
            Model.SimpleProduct product;
            StdBELista prices;
            Model.Price price = new Model.Price();

            while (!objList1.NoFim())
            {
                product = new Model.SimpleProduct();
                price = new Model.Price();
                product.Code = objList1.Valor("Artigo");
                product.StkActual = objList1.Valor("Stock");


                GcpBEArtigo prod = PriEngine.Engine.Comercial.Artigos.Edita(product.Code);
                product.Description = prod.get_Descricao();
                product.Discount = prod.get_Desconto();
                product.IVA = prod.get_IVA();

                prices = PriEngine.Engine.Consulta("SELECT Artigo,PVP1,PVP2,PVP3,PVP4,PVP5,PVP6 FROM ArtigoMoeda WHERE Artigo ='" + product.Code + "';");
                price.PVP1 = prices.Valor("PVP1");
                price.PVP2 = prices.Valor("PVP2");
                price.PVP3 = prices.Valor("PVP3");
                price.PVP4 = prices.Valor("PVP4");
                price.PVP5 = prices.Valor("PVP5");
                price.PVP6 = prices.Valor("PVP6");
                product.Prices = price;
                products.Add(product);
                objList1.Seguinte();
            }
            return products;
        }

        #endregion Warehouses


        #region DocCompra
        

        public static List<Model.DocCompra> VGR_List()
        {
                
            StdBELista objListCab;
            StdBELista objListLin;
            Model.DocCompra dc = new Model.DocCompra();
            List<Model.DocCompra> listdc = new List<Model.DocCompra>();
            Model.LinhaDocCompra lindc = new Model.LinhaDocCompra();
            List<Model.LinhaDocCompra> listlindc = new List<Model.LinhaDocCompra>();

            if (PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
            {
                objListCab = PriEngine.Engine.Consulta("SELECT id, NumDocExterno, Entidade, DataDoc, NumDoc, TotalMerc, Serie From CabecCompras where TipoDoc='VGR'");
                while (!objListCab.NoFim())
                {
                    dc = new Model.DocCompra();
                    dc.id = objListCab.Valor("id");
                    dc.NumDocExterno = objListCab.Valor("NumDocExterno");
                    dc.Entidade = objListCab.Valor("Entidade");
                    dc.NumDoc = objListCab.Valor("NumDoc");
                    dc.Data = objListCab.Valor("DataDoc");
                    dc.TotalMerc = objListCab.Valor("TotalMerc");
                    dc.Serie = objListCab.Valor("Serie");
                    objListLin = PriEngine.Engine.Consulta("SELECT idCabecCompras, Artigo, Descricao, Quantidade, Unidade, PrecUnit, Desconto1, TotalILiquido, PrecoLiquido, Armazem, Lote from LinhasCompras where IdCabecCompras='" + dc.id + "' order By NumLinha");
                    listlindc = new List<Model.LinhaDocCompra>();

                    while (!objListLin.NoFim())
                    {
                        lindc = new Model.LinhaDocCompra();
                        lindc.IdCabecDoc = objListLin.Valor("idCabecCompras");
                        lindc.CodArtigo = objListLin.Valor("Artigo");
                        lindc.DescArtigo = objListLin.Valor("Descricao");
                        lindc.Quantidade = objListLin.Valor("Quantidade");
                        lindc.Unidade = objListLin.Valor("Unidade");
                        lindc.Desconto = objListLin.Valor("Desconto1");
                        lindc.PrecoUnitario = objListLin.Valor("PrecUnit");
                        lindc.TotalILiquido = objListLin.Valor("TotalILiquido");
                        lindc.TotalLiquido = objListLin.Valor("PrecoLiquido");
                        lindc.Armazem = objListLin.Valor("Armazem");
                        lindc.Lote = objListLin.Valor("Lote");

                        listlindc.Add(lindc);
                        objListLin.Seguinte();
                    }

                    dc.LinhasDoc = listlindc;
                    
                    listdc.Add(dc);
                    objListCab.Seguinte();
                }
            }
            return listdc;
        }

                
        public static Model.RespostaErro VGR_New(Model.DocCompra dc)
        {
            Lib_Primavera.Model.RespostaErro erro = new Model.RespostaErro();
            

            GcpBEDocumentoCompra myGR = new GcpBEDocumentoCompra();
            GcpBELinhaDocumentoCompra myLin = new GcpBELinhaDocumentoCompra();
            GcpBELinhasDocumentoCompra myLinhas = new GcpBELinhasDocumentoCompra();

            PreencheRelacaoCompras rl = new PreencheRelacaoCompras();
            List<Model.LinhaDocCompra> lstlindv = new List<Model.LinhaDocCompra>();

            try
            {
                if (PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
                {
                    // Atribui valores ao cabecalho do doc
                    //myEnc.set_DataDoc(dv.Data);
                    myGR.set_Entidade(dc.Entidade);
                    myGR.set_NumDocExterno(dc.NumDocExterno);
                    myGR.set_Serie(dc.Serie);
                    myGR.set_Tipodoc("VGR");
                    myGR.set_TipoEntidade("F");
                    // Linhas do documento para a lista de linhas
                    lstlindv = dc.LinhasDoc;
                    //PriEngine.Engine.Comercial.Compras.PreencheDadosRelacionados(myGR,rl);
                    PriEngine.Engine.Comercial.Compras.PreencheDadosRelacionados(myGR);
                    foreach (Model.LinhaDocCompra lin in lstlindv)
                    {
                        PriEngine.Engine.Comercial.Compras.AdicionaLinha(myGR, lin.CodArtigo, lin.Quantidade, lin.Armazem, "", lin.PrecoUnitario, lin.Desconto);
                    }


                    PriEngine.Engine.IniciaTransaccao();
                    PriEngine.Engine.Comercial.Compras.Actualiza(myGR, "Teste");
                    PriEngine.Engine.TerminaTransaccao();
                    erro.Erro = 0;
                    erro.Descricao = "Sucesso";
                    return erro;
                }
                else
                {
                    erro.Erro = 1;
                    erro.Descricao = "Erro ao abrir empresa";
                    return erro;

                }

            }
            catch (Exception ex)
            {
                PriEngine.Engine.DesfazTransaccao();
                erro.Erro = 1;
                erro.Descricao = ex.Message;
                return erro;
            }
        }


        #endregion DocCompra


        #region DocsVenda

        public static Model.RespostaErro Encomendas_New(Model.DocVenda dv)
        {
            Lib_Primavera.Model.RespostaErro erro = new Model.RespostaErro();
            GcpBEDocumentoVenda myEnc = new GcpBEDocumentoVenda();
             
            GcpBELinhaDocumentoVenda myLin = new GcpBELinhaDocumentoVenda();

            GcpBELinhasDocumentoVenda myLinhas = new GcpBELinhasDocumentoVenda();
             
            PreencheRelacaoVendas rl = new PreencheRelacaoVendas();
            List<Model.LinhaDocVenda> lstlindv = new List<Model.LinhaDocVenda>();
            
            try
            {
                if (PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
                {
                    // Atribui valores ao cabecalho do doc
                    //myEnc.set_DataDoc(dv.Data);
                    myEnc.set_Entidade(dv.Entidade);
                    myEnc.set_Serie(dv.Serie);
                    myEnc.set_Tipodoc("ECL");
                    myEnc.set_TipoEntidade("C");
                    // Linhas do documento para a lista de linhas
                    lstlindv = dv.LinhasDoc;
                    //PriEngine.Engine.Comercial.Vendas.PreencheDadosRelacionados(myEnc, rl);
                    PriEngine.Engine.Comercial.Vendas.PreencheDadosRelacionados(myEnc);
                    foreach (Model.LinhaDocVenda lin in lstlindv)
                    {
                        PriEngine.Engine.Comercial.Vendas.AdicionaLinha(myEnc, lin.CodArtigo, lin.Quantidade, "", "", lin.PrecoUnitario, lin.Desconto);
                    }


                   // PriEngine.Engine.Comercial.Compras.TransformaDocumento(

                    PriEngine.Engine.IniciaTransaccao();
                    //PriEngine.Engine.Comercial.Vendas.Edita Actualiza(myEnc, "Teste");
                    PriEngine.Engine.Comercial.Vendas.Actualiza(myEnc, "Teste");
                    PriEngine.Engine.TerminaTransaccao();
                    erro.Erro = 0;
                    erro.Descricao = "Sucesso";
                    return erro;
                }
                else
                {
                    erro.Erro = 1;
                    erro.Descricao = "Erro ao abrir empresa";
                    return erro;

                }

            }
            catch (Exception ex)
            {
                PriEngine.Engine.DesfazTransaccao();
                erro.Erro = 1;
                erro.Descricao = ex.Message;
                return erro;
            }
        }

     

        public static List<Model.DocVenda> Encomendas_List()
        {
            
            StdBELista objListCab;
            StdBELista objListLin;
            Model.DocVenda dv = new Model.DocVenda();
            List<Model.DocVenda> listdv = new List<Model.DocVenda>();
            Model.LinhaDocVenda lindv = new Model.LinhaDocVenda();
            List<Model.LinhaDocVenda> listlindv = new
            List<Model.LinhaDocVenda>();

            if (PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
            {
                objListCab = PriEngine.Engine.Consulta("SELECT id, Entidade, Data, NumDoc, TotalMerc, Serie From CabecDoc where TipoDoc='ECL'");
                while (!objListCab.NoFim())
                {
                    dv = new Model.DocVenda();
                    dv.id = objListCab.Valor("id");
                    dv.Entidade = objListCab.Valor("Entidade");
                    dv.NumDoc = objListCab.Valor("NumDoc");
                    dv.Data = objListCab.Valor("Data");
                    dv.TotalMerc = objListCab.Valor("TotalMerc");
                    dv.Serie = objListCab.Valor("Serie");
                    objListLin = PriEngine.Engine.Consulta("SELECT idCabecDoc, Artigo, Descricao, Quantidade, Unidade, PrecUnit, Desconto1, TotalILiquido, PrecoLiquido from LinhasDoc where IdCabecDoc='" + dv.id + "' order By NumLinha");
                    listlindv = new List<Model.LinhaDocVenda>();

                    while (!objListLin.NoFim())
                    {
                        lindv = new Model.LinhaDocVenda();
                        lindv.IdCabecDoc = objListLin.Valor("idCabecDoc");
                        lindv.CodArtigo = objListLin.Valor("Artigo");
                        lindv.DescArtigo = objListLin.Valor("Descricao");
                        lindv.Quantidade = objListLin.Valor("Quantidade");
                        lindv.Unidade = objListLin.Valor("Unidade");
                        lindv.Desconto = objListLin.Valor("Desconto1");
                        lindv.PrecoUnitario = objListLin.Valor("PrecUnit");
                        lindv.TotalILiquido = objListLin.Valor("TotalILiquido");
                        lindv.TotalLiquido = objListLin.Valor("PrecoLiquido");

                        listlindv.Add(lindv);
                        objListLin.Seguinte();
                    }

                    dv.LinhasDoc = listlindv;
                    listdv.Add(dv);
                    objListCab.Seguinte();
                }
            }
            return listdv;
        }


       

        public static Model.DocVenda Encomenda_Get(string numdoc)
        {
            
            
            StdBELista objListCab;
            StdBELista objListLin;
            Model.DocVenda dv = new Model.DocVenda();
            Model.LinhaDocVenda lindv = new Model.LinhaDocVenda();
            List<Model.LinhaDocVenda> listlindv = new List<Model.LinhaDocVenda>();

            if (PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
            {
                

                string st = "SELECT id, Entidade, Data, NumDoc, TotalMerc, Serie From CabecDoc where TipoDoc='ECL' and NumDoc='" + numdoc + "'";
                objListCab = PriEngine.Engine.Consulta(st);
                dv = new Model.DocVenda();
                dv.id = objListCab.Valor("id");
                dv.Entidade = objListCab.Valor("Entidade");
                dv.NumDoc = objListCab.Valor("NumDoc");
                dv.Data = objListCab.Valor("Data");
                dv.TotalMerc = objListCab.Valor("TotalMerc");
                dv.Serie = objListCab.Valor("Serie");
                objListLin = PriEngine.Engine.Consulta("SELECT idCabecDoc, Artigo, Descricao, Quantidade, Unidade, PrecUnit, Desconto1, TotalILiquido, PrecoLiquido from LinhasDoc where IdCabecDoc='" + dv.id + "' order By NumLinha");
                listlindv = new List<Model.LinhaDocVenda>();

                while (!objListLin.NoFim())
                {
                    lindv = new Model.LinhaDocVenda();
                    lindv.IdCabecDoc = objListLin.Valor("idCabecDoc");
                    lindv.CodArtigo = objListLin.Valor("Artigo");
                    lindv.DescArtigo = objListLin.Valor("Descricao");
                    lindv.Quantidade = objListLin.Valor("Quantidade");
                    lindv.Unidade = objListLin.Valor("Unidade");
                    lindv.Desconto = objListLin.Valor("Desconto1");
                    lindv.PrecoUnitario = objListLin.Valor("PrecUnit");
                    lindv.TotalILiquido = objListLin.Valor("TotalILiquido");
                    lindv.TotalLiquido = objListLin.Valor("PrecoLiquido");
                    listlindv.Add(lindv);
                    objListLin.Seguinte();
                }

                dv.LinhasDoc = listlindv;
                return dv;
            }
            return null;
        }

        #endregion DocsVenda
    }
}