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

        public static List<Model.SimpleClient> ListaClientes()
        {
            
            StdBELista objList;

            List<Model.SimpleClient> listClientes = new List<Model.SimpleClient>();

                //objList = PriEngine.Engine.Comercial.Clientes.LstClientes();

                objList = PriEngine.Engine.Consulta("SELECT Cliente, Nome, Moeda, NumContrib as NumContribuinte, Fac_Mor AS campo_exemplo FROM  CLIENTES");

                while (!objList.NoFim())
                {
                    listClientes.Add(new Model.SimpleClient
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

        public static Lib_Primavera.Model.Client GetCliente(string codCliente)
        {
            GcpBECliente objCli = new GcpBECliente();
            Model.Client myCli = new Model.Client();

                if (PriEngine.Engine.Comercial.Clientes.Existe(codCliente) == true)
                {
                    
                    objCli = PriEngine.Engine.Comercial.Clientes.Edita(codCliente);
                    myCli.CodClient = objCli.get_Cliente();
                    myCli.NameClient = objCli.get_Nome();
                    myCli.FiscalName = objCli.get_NomeFiscal();
                    myCli.TaxpayNumber = objCli.get_NumContribuinte();
                    myCli.Email = objCli.get_B2BEnderecoMail();
                    myCli.Address = objCli.get_Morada();
                    myCli.Address2 = objCli.get_Morada2();
                    myCli.PostCode = objCli.get_CodigoPostal();
                    myCli.Local = objCli.get_Localidade();
                    myCli.Phone = objCli.get_Telefone();
                    myCli.Phone2 = objCli.get_Telefone2();
                    myCli.Country = objCli.get_Pais();
                    myCli.ClientDiscount = objCli.get_Desconto();
                    myCli.PaymentWay = objCli.get_ModoPag();
                    myCli.PaymentType = objCli.get_CondPag();
                    myCli.ClientType = objCli.get_TipoTerceiro();
                    myCli.Currency = objCli.get_Moeda();
                    myCli.ExpeditionWay = objCli.get_ModoExp();
                    myCli.Disctrict = objCli.get_Distrito();

                    return myCli;
                }
                else
                {
                    return null;
                }
        }

        public static Lib_Primavera.Model.ResponseError UpdCliente(Lib_Primavera.Model.Client cliente)
        {
            Lib_Primavera.Model.ResponseError erro = new Model.ResponseError();
           

            GcpBECliente objCli = new GcpBECliente();

            try
            {
                    if (PriEngine.Engine.Comercial.Clientes.Existe(cliente.CodClient) == false)
                    {
                        erro.Erro = 1;
                        erro.Descricao = "O cliente não existe";
                        return erro;
                    }
                    else
                    {

                        objCli = PriEngine.Engine.Comercial.Clientes.Edita(cliente.CodClient);
                        objCli.set_EmModoEdicao(true);

                        if (!String.IsNullOrEmpty(cliente.Address))
                            objCli.set_Morada(cliente.Address);
                        if (!String.IsNullOrEmpty(cliente.Address2))
                            objCli.set_Morada2(cliente.Address2);
                        if (!String.IsNullOrEmpty(cliente.ClientType))
                            objCli.set_TipoTerceiro(cliente.ClientType);
                        if (!String.IsNullOrEmpty(cliente.Country))
                            objCli.set_Pais(cliente.Country);
                        if (!String.IsNullOrEmpty(cliente.NameClient))
                            objCli.set_Nome(cliente.NameClient);
                        if (!String.IsNullOrEmpty(cliente.TaxpayNumber))
                            objCli.set_NumContribuinte(cliente.TaxpayNumber);
                        if (!String.IsNullOrEmpty(cliente.Currency))
                            objCli.set_Moeda(cliente.Currency);
                        if(!String.IsNullOrEmpty(cliente.Disctrict))
                            objCli.set_Distrito(cliente.Disctrict);
                        if(!String.IsNullOrEmpty(cliente.Email))
                            objCli.set_B2BEnderecoMail(cliente.Email);
                        if(!String.IsNullOrEmpty(cliente.Phone))
                            objCli.set_Telefone(cliente.Phone);
                        if(!String.IsNullOrEmpty(cliente.Phone2))
                            objCli.set_Telefone2(cliente.Phone2);
                        if(!String.IsNullOrEmpty(cliente.PostCode))
                            objCli.set_CodigoPostal(cliente.PostCode);
                        if(!String.IsNullOrEmpty(cliente.FiscalName))
                            objCli.set_NomeFiscal(cliente.FiscalName);
                        if(!String.IsNullOrEmpty(cliente.Local))
                            objCli.set_Localidade(cliente.Local);
                        if(!String.IsNullOrEmpty(cliente.ExpeditionWay))
                            objCli.set_ModoExp(cliente.ExpeditionWay);
                        if(!String.IsNullOrEmpty(cliente.PaymentWay))
                            objCli.set_ModoPag(cliente.PaymentWay);
                        if(!String.IsNullOrEmpty(cliente.PaymentType))
                            objCli.set_CondPag(cliente.PaymentType);
                        
                        PriEngine.Engine.Comercial.Clientes.Actualiza(objCli);

                        erro.Erro = 0;
                        erro.Descricao = "Sucesso";
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

        public static Lib_Primavera.Model.ResponseError DelCliente(string codCliente)
        {

            Lib_Primavera.Model.ResponseError erro = new Model.ResponseError();
            GcpBECliente objCli = new GcpBECliente();

            try
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

            catch (Exception ex)
            {
                erro.Erro = 1;
                erro.Descricao = ex.Message;
                return erro;
            }

        }

        public static Lib_Primavera.Model.ResponseError InsereClienteObj(Model.Client cli)
        {

            Lib_Primavera.Model.ResponseError erro = new Model.ResponseError();
            

            GcpBECliente myCli = new GcpBECliente();

            try
            {
                if (PriEngine.Engine.Comercial.Clientes.Existe(cli.CodClient) == true)
                {
                    erro.Erro = 2;
                    erro.Descricao = "Client with that code already exists!";
                    return erro;
                }

                    myCli.set_Cliente(cli.CodClient);
                    myCli.set_Nome(cli.NameClient);
                    myCli.set_NumContribuinte(cli.TaxpayNumber);
                    myCli.set_Moeda(cli.Currency);
                    myCli.set_Morada(cli.Address);
                    //myCli.set_Morada2(cli.Address2);
                    myCli.set_Desconto(cli.ClientDiscount);
                    myCli.set_TipoTerceiro(cli.ClientType);
                    myCli.set_Pais(cli.Country);
                    myCli.set_Distrito(cli.Disctrict);
                    myCli.set_B2BEnderecoMail(cli.Email);
                    myCli.set_Telefone(cli.Phone);
                    //myCli.set_Telefone2(cli.Phone2);
                    myCli.set_CodigoPostal(cli.PostCode);
                    myCli.set_NomeFiscal(cli.FiscalName);
                    myCli.set_Localidade(cli.Local);
                    //myCli.set_ModoExp(cli.ExpeditionWay);
                    //myCli.set_ModoPag(cli.PaymentWay);
                    //myCli.set_CondPag(cli.PaymentType);

                    PriEngine.Engine.Comercial.Clientes.Actualiza(myCli);
                    erro.Erro = 0;
                    erro.Descricao = "Sucesso";
                    return erro;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex);
                erro.Erro = 1;
                erro.Descricao = ex.Message;
                return erro;
            }
        }

        public static List<Model.ClientType> GetClientTypes()
        {
           StdBELista types = PriEngine.Engine.Consulta("SELECT TipoTerceiro,Descricao FROM TipoTerceiros");
           List<Model.ClientType> res = new List<Model.ClientType>();
           while (!types.NoFim())
           {
               Model.ClientType t = new Model.ClientType();
               t.Code = types.Valor("TipoTerceiro");
               t.Description = types.Valor("Descricao");
               res.Add(t);
               types.Seguinte();
           }

           return res;
        }

        #endregion Cliente;   // -----------------------------  END   CLIENTE    -----------------------

        #region Products

        public static Lib_Primavera.Model.Product GetProduct(string codArtigo)
        {

            GcpBEArtigo objArtigo = new GcpBEArtigo();
            Model.Product myProduct = new Model.Product();

                if (PriEngine.Engine.Comercial.Artigos.Existe(codArtigo) == false)
                {
                    return null;
                }
                else
                {
                    StdBELista l = PriEngine.Engine.Comercial.Artigos.LstArtigos();
                    String s = l.Valor("Artigo");
                    GcpBEArtigo m = PriEngine.Engine.Comercial.Artigos.Edita(s);

                    StdBELista objList1 = PriEngine.Engine.Consulta("SELECT Artigo.Artigo AS Code,Artigo.Descricao AS ArtDesc,Iva,Desconto,Artigo.STKActual AS STKAct,Familias.Descricao AS FamDesc,SubFamilias.Descricao AS SubFamDesc,Marcas.Descricao AS BrandDesc,Artigo.Modelo AS ArtModel,ArtigoMoeda.Moeda AS ArtCurrency,ArtigoMoeda.PVP1 AS ArtPVP1,ArtigoMoeda.PVP2 AS ArtPVP2,ArtigoMoeda.PVP3 AS ArtPVP3,ArtigoMoeda.PVP4 AS ArtPVP4,ArtigoMoeda.PVP5 AS ArtPVP5,ArtigoMoeda.PVP6 AS ArtPVP6,Garantias.Descricao AS Warranty,Artigo.PrazoEntrega AS DelTime FROM Artigo LEFT JOIN Familias ON Artigo.Familia = Familias.Familia LEFT JOIN Marcas ON Artigo.Marca = Marcas.Marca LEFT JOIN SubFamilias ON Artigo.Familia=SubFamilias.Familia AND Artigo.SubFamilia = SubFamilias.SubFamilia LEFT JOIN ArtigoMoeda ON Artigo.Artigo = ArtigoMoeda.Artigo AND Artigo.UnidadeBase = ArtigoMoeda.Unidade LEFT JOIN Garantias on Artigo.Garantia = Garantias.Garantia  WHERE Artigo.Artigo='" + codArtigo + "' AND Familias.Descricao IS NOT NULL ;");
                    List<Model.Product> products = retrieveProducts(objList1);
                    return products.First<Model.Product>();
                }
        }
        /// <summary>
        /// The method that is called by the api/products
        /// </summary>
        /// <returns>List of products</returns>
        public static List<Model.Product> GetProducts()
        {
            StdBELista objList1;
                objList1 = PriEngine.Engine.Consulta("SELECT Artigo.Artigo AS Code,Artigo.Descricao AS ArtDesc,Iva,Desconto,Artigo.STKActual AS STKAct,Familias.Descricao AS FamDesc,SubFamilias.Descricao AS SubFamDesc,Marcas.Descricao AS BrandDesc,Artigo.Modelo AS ArtModel,ArtigoMoeda.Moeda AS ArtCurrency,ArtigoMoeda.PVP1 AS ArtPVP1,ArtigoMoeda.PVP2 AS ArtPVP2,ArtigoMoeda.PVP3 AS ArtPVP3,ArtigoMoeda.PVP4 AS ArtPVP4,ArtigoMoeda.PVP5 AS ArtPVP5,ArtigoMoeda.PVP6 AS ArtPVP6,Garantias.Descricao AS Warranty,Artigo.PrazoEntrega AS DelTime FROM Artigo LEFT JOIN Familias ON Artigo.Familia = Familias.Familia LEFT JOIN Marcas ON Artigo.Marca = Marcas.Marca LEFT JOIN SubFamilias ON Artigo.Familia=SubFamilias.Familia AND Artigo.SubFamilia = SubFamilias.SubFamilia LEFT JOIN ArtigoMoeda ON Artigo.Artigo = ArtigoMoeda.Artigo AND Artigo.UnidadeBase = ArtigoMoeda.Unidade LEFT JOIN Garantias on Artigo.Garantia = Garantias.Garantia  WHERE Familias.Descricao IS NOT NULL AND Familias.Descricao <>'Serviços' ;");
                List<Model.Product> listProducts = new List<Model.Product>();
                listProducts = retrieveProducts(objList1);

                return listProducts;
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

        public static List<string> GetFamilies()
        {
                List<String> familias = new List<String>();
                StdBELista objList;
                objList = PriEngine.Engine.Consulta("SELECT Descricao FROM Familias;");

                while (!objList.NoFim())
                {
                    String f = objList.Valor("Descricao");
                    familias.Add(f);
                    objList.Seguinte();
                }
                return familias;         
        }

        public static List<Model.SimpleProduct> GetWarehouseProductsByFamily(string warehouseId,string familyId)
        {
            StdBELista objList1;
                if (!PriEngine.Engine.Comercial.Armazens.Existe(warehouseId))
                    return null;
                objList1 = PriEngine.Engine.Consulta("SELECT ArtigoArmazem.Artigo,SUM(ArtigoArmazem.StkActual) AS Stock FROM ArtigoArmazem LEFT JOIN Artigo ON Artigo.Artigo = ArtigoArmazem.Artigo LEFT JOIN Familias ON Familias.Familia = Artigo.Familia where ArtigoArmazem.Armazem='"+warehouseId+"' AND Familias.Descricao ='"+familyId+"' GROUP BY ArtigoArmazem.Artigo,Armazem;");
                
                List<Model.SimpleProduct> listProducts = new List<Model.SimpleProduct>();
                listProducts = retrieveSimpleProducts(objList1);
                return listProducts;
        }

        internal static List<Model.SimpleProduct> GetSearchProducts(string query)
        {
            StdBELista objList1;
            objList1 = PriEngine.Engine.Consulta("SELECT ArtigoArmazem.Artigo,SUM(ArtigoArmazem.StkActual) AS Stock FROM ArtigoArmazem LEFT JOIN Artigo ON Artigo.Artigo = ArtigoArmazem.Artigo where Artigo.Descricao LIKE '%" + query + "%' GROUP BY ArtigoArmazem.Artigo,Armazem;");

                List<Model.SimpleProduct> listProducts = new List<Model.SimpleProduct>();
                listProducts = retrieveSimpleProducts(objList1);
                return listProducts;
        }

        public static List<Model.SimpleProduct> GetFamilyProducts(string id)
        {
            StdBELista objList1;

                objList1 = PriEngine.Engine.Consulta("SELECT ArtigoArmazem.Artigo,SUM(ArtigoArmazem.StkActual) AS Stock FROM ArtigoArmazem LEFT JOIN Artigo ON Artigo.Artigo = ArtigoArmazem.Artigo LEFT JOIN Familias ON Familias.Familia = Artigo.Familia where Familias.Descricao ='"+id+"' GROUP BY ArtigoArmazem.Artigo,Armazem;");

                List<Model.SimpleProduct> listProducts = new List<Model.SimpleProduct>();
                listProducts = retrieveSimpleProducts(objList1);
                return listProducts;
        }

        #endregion Products

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

        /// <summary>
        /// Method that searches and retrieves all products that exist in a warehouse
        /// </summary>
        /// <param name="warehouseId">The warehouse code id</param>
        /// <returns>returns the warehouse</returns>
        public static List<Model.SimpleProduct> GetProductWarehouse(string warehouseId)
        {
            StdBELista objList1;
                if (!PriEngine.Engine.Comercial.Armazens.Existe(warehouseId))
                    return null;
                objList1 = PriEngine.Engine.Consulta("SELECT Artigo,SUM(ArtigoArmazem.StkActual) AS Stock FROM ArtigoArmazem where ArtigoArmazem.Armazem='" + warehouseId + "' GROUP BY ArtigoArmazem.Artigo,Armazem;");

                List<Model.SimpleProduct> listProducts = new List<Model.SimpleProduct>();
                listProducts = retrieveSimpleProducts(objList1);
                return listProducts;
        }
        
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
            
            return listdc;
        }

                
        public static Model.ResponseError VGR_New(Model.DocCompra dc)
        {
            Lib_Primavera.Model.ResponseError erro = new Model.ResponseError();
            

            GcpBEDocumentoCompra myGR = new GcpBEDocumentoCompra();
            GcpBELinhaDocumentoCompra myLin = new GcpBELinhaDocumentoCompra();
            GcpBELinhasDocumentoCompra myLinhas = new GcpBELinhasDocumentoCompra();

            PreencheRelacaoCompras rl = new PreencheRelacaoCompras();
            List<Model.LinhaDocCompra> lstlindv = new List<Model.LinhaDocCompra>();

            try
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

        public static Model.ResponseError Encomendas_New(Model.DocVenda dv)
        {
            Lib_Primavera.Model.ResponseError erro = new Model.ResponseError();
            GcpBEDocumentoVenda myEnc = new GcpBEDocumentoVenda();
             
            //GcpBELinhaDocumentoVenda myLin = new GcpBELinhaDocumentoVenda();

            GcpBELinhasDocumentoVenda myLinhas = new GcpBELinhasDocumentoVenda();
             
            PreencheRelacaoVendas rl = new PreencheRelacaoVendas();
            List<Model.LinhaDocVenda> lstlindv = new List<Model.LinhaDocVenda>();
            if (Lib_Primavera.PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
            {
                try
                {
                    // Atribui valores ao cabecalho do doc

                    myEnc.set_DataDoc(dv.Data);
                    myEnc.set_Entidade(dv.Client.CodClient);
                    myEnc.set_Serie(dv.Serie);
                    myEnc.set_Tipodoc("ECL");
                    myEnc.set_TipoEntidade("C");
                    GcpBECliente c = PriEngine.Engine.Comercial.Clientes.Edita(dv.Client.CodClient);
                    
                    // Linhas do documento para a lista de linhas
                    lstlindv = dv.LinhasDoc;
                    //PriEngine.Engine.Comercial.Vendas.PreencheDadosRelacionados(myEnc, rl);
                    PriEngine.Engine.Comercial.Vendas.PreencheDadosRelacionados(myEnc);
                    foreach (Model.LinhaDocVenda lin in lstlindv)
                    {
                        PriEngine.Engine.Comercial.Vendas.AdicionaLinha(myEnc, lin.CodArtigo, lin.Quantidade, lin.Armazem, "", lin.PrecoUnitario, lin.Desconto, "", 0, 0, 0, dv.Client.ClientDiscount);
                    }



                    PriEngine.Engine.IniciaTransaccao();
                    //PriEngine.Engine.Comercial.Vendas.Edita Actualiza(myEnc, "Teste");
                    PriEngine.Engine.Comercial.Vendas.Actualiza(myEnc, "Teste");
                    PriEngine.Engine.TerminaTransaccao();
                    erro.Erro = 0;
                    erro.Descricao = "Sucesso";
                    return erro;

                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    PriEngine.Engine.DesfazTransaccao();
                    erro.Erro = 1;
                    erro.Descricao = ex.Message;
                    return erro;
                }
            }
            else
            {
                try {
                    PriEngine.Engine.DesfazTransaccao();
                }
                catch (Exception e)
                {
                    erro.Erro = 1;
                    erro.Descricao = e.Message;
                    return erro;
                }
                
                erro.Erro = 1;
                erro.Descricao = "ERROR INITIALIZING DATABASE!";
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

                objListCab = PriEngine.Engine.Consulta("SELECT id, Entidade, Data, NumDoc, TotalMerc, Serie From CabecDoc where TipoDoc='ECL'");
                while (!objListCab.NoFim())
                {
                    dv = new Model.DocVenda();
             
                    dv.id = objListCab.Valor("id");
                    dv.Client = GetCliente(objListCab.Valor("Entidade"));
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
            return listdv;
        }

        public static Model.DocVenda Encomenda_Get(string numdoc)
        {
            
            
            StdBELista objListCab;
            StdBELista objListLin;
            Model.DocVenda dv = new Model.DocVenda();
            Model.LinhaDocVenda lindv = new Model.LinhaDocVenda();
            List<Model.LinhaDocVenda> listlindv = new List<Model.LinhaDocVenda>();

                double TotalMercReal = 0;
                string st = "SELECT id, Entidade, Data, NumDoc, TotalMerc, Serie From CabecDoc where TipoDoc='ECL' and NumDoc='" + numdoc + "'";
                objListCab = PriEngine.Engine.Consulta(st);
                dv = new Model.DocVenda();
                dv.id = objListCab.Valor("id");
                dv.Client = GetCliente(objListCab.Valor("Entidade"));
                dv.NumDoc = objListCab.Valor("NumDoc");
                dv.Data = objListCab.Valor("Data");
                dv.TotalMerc = objListCab.Valor("TotalMerc");
                dv.Serie = objListCab.Valor("Serie");
                objListLin = PriEngine.Engine.Consulta("SELECT idCabecDoc, Artigo, Descricao, Quantidade, Unidade, PrecUnit, Desconto1, TotalILiquido, PrecoLiquido, TotalDC, TotalDA, TotalIva from LinhasDoc where IdCabecDoc='" + dv.id + "' order By NumLinha");
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
                    lindv.TotalDescArtigo = objListLin.Valor("TotalDA");
                    lindv.TotalDescontoCliente = objListLin.Valor("TotalDC");
                    lindv.IvaTotal = objListLin.Valor("TotalIva");
                    lindv.TotalPrecoArtigo = lindv.TotalLiquido + lindv.IvaTotal;
                    TotalMercReal += lindv.TotalLiquido + lindv.IvaTotal;
                    listlindv.Add(lindv);
                    objListLin.Seguinte();
                }

                dv.TotalRealMerc = TotalMercReal;
                dv.LinhasDoc = listlindv;
                return dv;
            
        }

        public static int Encomenda_GetClientsOrdersTotal(string client)
        {
            StdBELista total;
            total = PriEngine.Engine.Consulta("SELECT Count(*) as Total From CabecDoc where TipoDoc='ECL' and Entidade='"+client+"';");
            try
            {
                return total.Valor("Total");
            }catch{
                return -1;
            }
        }

        public static List<Model.DocVenda> Encomenda_GetClientsOrders(string client)
        {
            StdBELista objListCab;
            StdBELista objListLin;
            Model.DocVenda dv = new Model.DocVenda();
            Model.LinhaDocVenda lindv = new Model.LinhaDocVenda();
            List<Model.LinhaDocVenda> listlindv = new List<Model.LinhaDocVenda>();
            List<Model.DocVenda> listDocVend = new List<Model.DocVenda>();

                if (!PriEngine.Engine.Comercial.Clientes.Existe(client))
                {
                    System.Diagnostics.Debug.WriteLine("Client does not exists!!");
                    return null;
                }
                    

                //PriEngine.Engine.Comercial.Vendas.

                string st = "SELECT id, Entidade, Data, NumDoc, TotalMerc, Serie From CabecDoc where TipoDoc='ECL' and Entidade='" + client + "'";
                objListCab = PriEngine.Engine.Consulta(st);

                while (!objListCab.NoFim())
                {
                    dv = new Model.DocVenda();
                    double TotalMercReal = 0;
                    dv.id = objListCab.Valor("id");
                    dv.Client = GetCliente(objListCab.Valor("Entidade"));
                    dv.NumDoc = objListCab.Valor("NumDoc");
                    dv.Data = objListCab.Valor("Data");
                    dv.TotalMerc = objListCab.Valor("TotalMerc");
                    dv.Serie = objListCab.Valor("Serie");
                    objListLin = PriEngine.Engine.Consulta("SELECT idCabecDoc, Artigo, Descricao, Quantidade, Unidade, PrecUnit, Desconto1, TotalILiquido, PrecoLiquido, TotalDC, TotalDA, TotalIva from LinhasDoc where IdCabecDoc='" + dv.id + "' order By NumLinha");
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
                        lindv.TotalDescArtigo = objListLin.Valor("TotalDA");
                        lindv.TotalDescontoCliente = objListLin.Valor("TotalDC");
                        lindv.IvaTotal = objListLin.Valor("TotalIva");
                        lindv.TotalPrecoArtigo = lindv.TotalLiquido + lindv.IvaTotal;
                        TotalMercReal += lindv.TotalLiquido + lindv.IvaTotal;
                        listlindv.Add(lindv);
                        objListLin.Seguinte();
                    }

                    dv.LinhasDoc = listlindv;
                    listDocVend.Add(dv);
                    objListCab.Seguinte();
                }
                return listDocVend;
        }

        public static Model.DocVenda Encomenda_GetClientOrder(string client,string orderId)
        {
            StdBELista objListCab;
            StdBELista objListLin;
            Model.DocVenda dv = new Model.DocVenda();
            Model.LinhaDocVenda lindv = new Model.LinhaDocVenda();
            List<Model.LinhaDocVenda> listlindv = new List<Model.LinhaDocVenda>();
            List<Model.DocVenda> listDocVend = new List<Model.DocVenda>();


            if (!PriEngine.Engine.Comercial.Clientes.Existe(client))
            {
                System.Diagnostics.Debug.WriteLine("Client does not exists!!");
                return null;
            }


            //PriEngine.Engine.Comercial.Vendas.

            string st = "SELECT id, Entidade, Data, NumDoc, TotalMerc, Serie From CabecDoc where TipoDoc='ECL' and Entidade='" + client + "' AND id ='"+orderId+"';";
            objListCab = PriEngine.Engine.Consulta(st);
            double TotalMercReal = 0;

                dv = new Model.DocVenda();

                dv.id = objListCab.Valor("id");
                dv.Client = GetCliente(objListCab.Valor("Entidade"));
                dv.NumDoc = objListCab.Valor("NumDoc");
                dv.Data = objListCab.Valor("Data");
                dv.TotalMerc = objListCab.Valor("TotalMerc");
                dv.Serie = objListCab.Valor("Serie");
                objListLin = PriEngine.Engine.Consulta("SELECT idCabecDoc, Artigo, Descricao, Quantidade, Unidade, PrecUnit, Desconto1, TotalILiquido, PrecoLiquido, TotalDC, TotalDA, TotalIva from LinhasDoc where IdCabecDoc='" + dv.id + "' order By NumLinha");
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
                    lindv.TotalDescArtigo = objListLin.Valor("TotalDA");
                    lindv.TotalDescontoCliente = objListLin.Valor("TotalDC");
                    lindv.IvaTotal = objListLin.Valor("TotalIva");
                    lindv.TotalPrecoArtigo = lindv.TotalLiquido + lindv.IvaTotal;
                    TotalMercReal += lindv.TotalLiquido + lindv.IvaTotal;
                    listlindv.Add(lindv);
                    objListLin.Seguinte();
                }

                dv.LinhasDoc = listlindv;

            return dv;
        }

        public static List<Model.DocVenda> Encomenda_GetClientsOrdersByPage(string client, int page, int numperpage)
        {
            StdBELista objListCab;
            StdBELista objListLin;
            Model.DocVenda dv = new Model.DocVenda();
            Model.LinhaDocVenda lindv = new Model.LinhaDocVenda();
            List<Model.LinhaDocVenda> listlindv = new List<Model.LinhaDocVenda>();
            List<Model.DocVenda> listDocVend = new List<Model.DocVenda>();

            if (!PriEngine.Engine.Comercial.Clientes.Existe(client))
            {
                System.Diagnostics.Debug.WriteLine("ERROR!");
                return null;
            }


            string st = "WITH Orders AS (SELECT ROW_NUMBER() OVER (ORDER BY id) AS RowNum,id,Entidade,Data,NumDoc,TotalMerc,Serie FROM CabecDoc where TipoDoc='ECL' and Entidade='" + client + "') SELECT * FROM Orders WHERE  RowNum >= (" + (page-1) + ") * "+numperpage+"  AND RowNum <= ("+page+") * "+numperpage+";";
            objListCab = PriEngine.Engine.Consulta(st);

            while (!objListCab.NoFim())
            {
                dv = new Model.DocVenda();

                dv.id = objListCab.Valor("id");
                dv.Client = GetCliente(objListCab.Valor("Entidade"));
                dv.NumDoc = objListCab.Valor("NumDoc");
                dv.Data = objListCab.Valor("Data");
                dv.TotalMerc = objListCab.Valor("TotalMerc");
                dv.Serie = objListCab.Valor("Serie");
                objListLin = PriEngine.Engine.Consulta("SELECT idCabecDoc, Artigo, Descricao, Quantidade, Unidade, PrecUnit, Desconto1, TotalILiquido, PrecoLiquido,Data from LinhasDoc where IdCabecDoc='" + dv.id + "' order By Data");
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
                listDocVend.Add(dv);
                objListCab.Seguinte();
            }
            return listDocVend;
        }

        #endregion DocsVenda

        #region Utils

        public static List<Model.Country> Utils_GetCountries()
        {
            StdBELista countriesInfo =  PriEngine.Engine.Consulta("SELECT Pais,Descricao FROM Paises");
            List<Model.Country> countries = new List<Model.Country>();
            while (!countriesInfo.NoFim())
            {
                Model.Country c = new Model.Country();
                c.Initials = countriesInfo.Valor("Pais");
                c.Name = countriesInfo.Valor("Descricao");
                countries.Add(c);
                countriesInfo.Seguinte();
            }
            return countries;
        }

        public static List<Model.District> Utils_GetDistricts()
        {
            List<Model.District> dists = new List<Model.District>();
            StdBELista list = PriEngine.Engine.Consulta("SELECT Distrito,Descricao FROM Distritos");
            while (!list.NoFim())
            {
                Model.District d = new Model.District();
                d.DistrictCode = list.Valor("Distrito");
                d.Description = list.Valor("Descricao");
                dists.Add(d);
                list.Seguinte();
            }
            return dists;
        }

        public static List<Model.PaymentType> Utils_GetPaymentTypes()
        {
            List<Model.PaymentType> types = new List<Model.PaymentType>();
            StdBELista list = PriEngine.Engine.Consulta("SELECT CondPag,Descricao FROM CondPag;");
            while (!list.NoFim())
            {
                Model.PaymentType p = new Model.PaymentType();
                p.PaymentTypeCode = list.Valor("CondPag");
                p.PaymentTypeDescription = list.Valor("Descricao");
                types.Add(p);
                list.Seguinte();
            }
            return types;
        }

        public static List<Model.PaymentWay> Utils_GetPaymentWays()
        {
            //ModoPag
            List<Model.PaymentWay> payments = new List<Model.PaymentWay>();
            StdBELista list = PriEngine.Engine.Consulta("SELECT Movim,Descricao FROM DocumentosBancos;");
            while (!list.NoFim())
            {
                Model.PaymentWay w = new Model.PaymentWay();
                w.PaymentWayCode = list.Valor("Movim");
                w.PaymentWayDescription = list.Valor("Descricao");
                payments.Add(w);
                list.Seguinte();
            }
            return payments;
        }

        public static List<Model.ExpeditionWay> Utils_GetExpeditionWays()
        {
            List<Model.ExpeditionWay> ways = new List<Model.ExpeditionWay>();
            StdBELista list = PriEngine.Engine.Consulta("SELECT ModoExp,Descricao FROM ModosExp;");
            while (!list.NoFim())
            {
                Model.ExpeditionWay expway = new Model.ExpeditionWay();
                expway.ExpeditionCode = list.Valor("ModoExp");
                expway.ExpeditionDescription = list.Valor("Descricao");
                ways.Add(expway);
                list.Seguinte();
            }
            return ways;
        }

        #endregion Utils

        #region Tests
        
        public static List<string> GetTestes(string id)
        {
            
            List<string> testes = new List<string>();
                //double d = PriEngine.Engine.Comercial.ArtigosArmazens.DaStockArtigo(id);
                GcpBEArtigoArmazens objList = PriEngine.Engine.Comercial.ArtigosArmazens.ListaArtigosArmazens(id);
                PriEngine.Engine.Comercial.ArtigosArmazens.ListaInventario(true,false,false,id);

                foreach (GcpBEArtigoArmazem obj in objList)
                {
                    testes.Add("Artigo: " + obj.get_Armazem() + " Armazem: " + obj.get_Armazem()+ " Quant: "+obj.get_StkActual());
                    //obj.Conteudo
                }

                return testes;
                /*objList.
                objList = PriEngine.Engine.Comercial.ArtigosArmazens.ListaInventario(true, false, false, id);
                while (!objList.NoFim())
                {
                    testes.Add(objList.Valor("Artigo"));
                    objList.Seguinte();
                }
                return testes;*/
        }

        public static string makeTest(string cliente)
        {
            string res = "peido";
            Lib_Primavera.Model.ResponseError erro = new Model.ResponseError();
            GcpBECliente objCli = new GcpBECliente();

            try
            {
                if (PriEngine.Engine.Comercial.Clientes.Existe(cliente) == false)
                {
                    erro.Erro = 1;
                    erro.Descricao = "O cliente não existe";
                    return erro.Descricao;
                }
                else
                {

                    objCli = PriEngine.Engine.Comercial.Clientes.Edita(cliente);
                    System.Diagnostics.Debug.WriteLine("CARALHO");
                    System.Diagnostics.Debug.WriteLine("Modo-> "+objCli.get_ModoPag());
                    objCli.set_EmModoEdicao(true);
                    objCli.set_ModoPag("MB");
                    PriEngine.Engine.Comercial.Clientes.Actualiza(objCli);

                    erro.Erro = 0;
                    erro.Descricao = "Sucesso";
                    return erro.Descricao;
                }

            }

            catch (Exception ex)
            {
                erro.Erro = 1;
                erro.Descricao = ex.Message;
                return erro.Descricao;
            }


            return res;
        }

        #endregion Tests




        
    }
}