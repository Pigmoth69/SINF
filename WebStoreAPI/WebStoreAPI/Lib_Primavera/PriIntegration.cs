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

        public static Lib_Primavera.Model.ResponseError UpdCliente(Lib_Primavera.Model.Cliente cliente)
        {
            Lib_Primavera.Model.ResponseError erro = new Model.ResponseError();
           

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


        public static Lib_Primavera.Model.ResponseError DelCliente(string codCliente)
        {

            Lib_Primavera.Model.ResponseError erro = new Model.ResponseError();
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



        public static Lib_Primavera.Model.ResponseError InsereClienteObj(Model.Cliente cli)
        {

            Lib_Primavera.Model.ResponseError erro = new Model.ResponseError();
            

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

        public static Lib_Primavera.Model.Product GetArtigo(string codArtigo)
        {
            
            GcpBEArtigo objArtigo = new GcpBEArtigo();
            Model.Product myArt = new Model.Product();

            if (PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
            {

                if (PriEngine.Engine.Comercial.Artigos.Existe(codArtigo) == false)
                {
                    return null;
                }
                else
                {
                    objArtigo = PriEngine.Engine.Comercial.Artigos.Edita(codArtigo);
                    myArt.Code = objArtigo.get_Artigo();
                   // myArt.DescArtigo = objArtigo.get_Descricao();

                    return myArt;
                }
                
            }
            else
            {
                return null;
            }

        }

        public static List<Model.Product> GetProducts()
        {
                        

            Model.Product prod = new Model.Product();
            Model.SimpleWarehouse warehouse = new Model.SimpleWarehouse(); 

            List<Model.Product> listProducts = new List<Model.Product>();
            List<Model.SimpleWarehouse> listWarehouses = new List<Model.SimpleWarehouse>();
            List<Model.Price> listPrices = new List<Model.Price>();

            StdBELista objList1;
            StdBELista objList2;


            if (PriEngine.InitializeCompany(WebStoreAPI.Properties.Settings.Default.Company.Trim(), WebStoreAPI.Properties.Settings.Default.User.Trim(), WebStoreAPI.Properties.Settings.Default.Password.Trim()) == true)
            {

                objList1 = PriEngine.Engine.Consulta("SELECT Artigo.Artigo AS Code,Artigo.Descricao AS ArtDesc,Iva,Desconto,Artigo.STKActual AS STKAct,Familias.Descricao AS FamDesc,SubFamilias.Descricao AS SubFamDesc,Marcas.Descricao AS BrandDesc,Artigo.Modelo AS ArtModel,ArtigoMoeda.Moeda AS ArtCurrency,ArtigoMoeda.PVP1 AS ArtPVP1,ArtigoMoeda.PVP2 AS ArtPVP2,ArtigoMoeda.PVP3 AS ArtPVP3,ArtigoMoeda.PVP4 AS ArtPVP4,ArtigoMoeda.PVP5 AS ArtPVP5,ArtigoMoeda.PVP6 AS ArtPVP6,Garantias.Descricao AS Warranty,Artigo.PrazoEntrega AS DelTime FROM Artigo LEFT JOIN Familias ON Artigo.Familia = Familias.Familia LEFT JOIN Marcas ON Artigo.Marca = Marcas.Marca LEFT JOIN SubFamilias ON Artigo.Familia=SubFamilias.Familia AND Artigo.SubFamilia = SubFamilias.SubFamilia LEFT JOIN ArtigoMoeda ON Artigo.Artigo = ArtigoMoeda.Artigo AND Artigo.UnidadeBase = ArtigoMoeda.Unidade LEFT JOIN Garantias on Artigo.Garantia = Garantias.Garantia  WHERE Familias.Descricao IS NOT NULL AND Familias.Descricao <>'Serviços' ;");
                
                

                while (!objList1.NoFim())
                {
                    prod = new Model.Product();
                    prod.Prices = new Model.Price();

                    prod.Code = objList1.Valor("Code");
                    prod.Description = objList1.Valor("ArtDesc");
                    prod.Family = objList1.Valor("FamDesc");
                    prod.SubFamily = objList1.Valor("SubFamDesc").ToString();
                    prod.Brand = objList1.Valor("BrandDesc").ToString();
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
                    objList2 = PriEngine.Engine.Consulta("SELECT Armazem,SUM(StkActual) AS Total FROM ArtigoArmazem where Artigo= '"+prod.Code+"' GROUP BY Armazem;");
                    prod.Warehouses = new List<Model.SimpleWarehouse>();

                    while(!objList2.NoFim())
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
            else
            {
                return null;

            }

        }

        #endregion Artigo

    }
}