﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebStoreAPI.Lib_Primavera.Model;


namespace WebStoreAPI.Controllers
{
    public class ProductsController : ApiController
    {

        [Route("api/products")]
        [HttpGet]
        public IEnumerable<Lib_Primavera.Model.Product> Get()
        {
            return Lib_Primavera.PriIntegration.GetProducts();
        }


        [Route("api/products")]
        [HttpGet]
        public HttpResponseMessage GetProductId(string id)
        {
            Lib_Primavera.Model.Product products = Lib_Primavera.PriIntegration.GetProduct(id);
            if (products == null)
            {
                var message = string.Format("Product with id = {0} not found", id);
                HttpError err = new HttpError(message);
                return Request.CreateResponse(HttpStatusCode.NotFound, err);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, products);
            }
        }

        [Route("api/products/family")]
        [HttpGet]
        public List<String> GetFamilies()
        {
            List<String> families = Lib_Primavera.PriIntegration.GetFamilies();
            return families;
        }
        [Route("api/products/family/{id}")]
        [HttpGet]
        public List<Lib_Primavera.Model.SimpleProduct> GetFamilyProducts(string id)
        {
            List<Lib_Primavera.Model.SimpleProduct>  products = Lib_Primavera.PriIntegration.GetFamilyProducts(id);
            return products;
        }

        [Route("api/products/")]
        [HttpGet]
        public List<Lib_Primavera.Model.SimpleProduct> GetFamilyProducts(string warehouseId, string familyId)
        {
            List<Lib_Primavera.Model.SimpleProduct> products = Lib_Primavera.PriIntegration.GetWarehouseProductsByFamily(warehouseId,familyId);
            return products;
        }

        /*[Route("api/products/teste")]
        [HttpGet]
        public List<String> GetTeste(string id)
        {
            List<String> teste = Lib_Primavera.PriIntegration.GetTestes(id);
            return teste;
        }*/

        [Route("api/products/test/")]
        [HttpGet]
        public string makeTest(string cliente)
        {
            string teste = Lib_Primavera.PriIntegration.makeTest(cliente);
            return teste;
        }


        [Route("api/products/search/{query}")]
        [HttpGet]
        public List<Lib_Primavera.Model.SimpleProduct> GetSearchProducts(string query)
        {
            List<Lib_Primavera.Model.SimpleProduct> products = new List<Lib_Primavera.Model.SimpleProduct>();
            products = Lib_Primavera.PriIntegration.GetSearchProducts(query);
            return products;
        }
    }
}

