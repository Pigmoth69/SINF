using System;
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
        /// <summary>
        /// Returns all products existent in the ERP
        /// </summary>
        /// <returns>A list of products</returns>
        [Route("api/products")]
        [HttpGet]
        public IEnumerable<Lib_Primavera.Model.Product> Get()
        {
            return Lib_Primavera.PriIntegration.GetProducts();
        }

        /// <summary>
        /// Function to get a more detailed information of a product
        /// </summary>
        /// <param name="id">Code of the product</param>
        /// <returns>Returns a detailed product information</returns>
        [Route("api/products/{id}")]
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
        /// <summary>
        /// Retrieve all families of the ERP
        /// </summary>
        /// <returns>List of all families</returns>
        [Route("api/products/family")]
        [HttpGet]
        public List<String> GetFamilies()
        {
            List<String> families = Lib_Primavera.PriIntegration.GetFamilies();
            return families;
        }
        /// <summary>
        /// All products of a family
        /// </summary>
        /// <param name="id">Family name</param>
        /// <returns>All products of a certain family! Returns a SimpleProduct</returns>
        [Route("api/products/family/{id}")]
        [HttpGet]
        public List<Lib_Primavera.Model.SimpleProduct> GetFamilyProducts(string id)
        {
            List<Lib_Primavera.Model.SimpleProduct>  products = Lib_Primavera.PriIntegration.GetFamilyProducts(id);
            return products;
        }
        /// <summary>
        /// All products of a certain warehouse from a choosen family
        /// </summary>
        /// <param name="warehouseId">Warehouse code</param>
        /// <param name="familyId">Family name</param>
        /// <returns>All products! Returns SimpleProduct</returns>
        [Route("api/products/")]
        [HttpGet]
        public List<Lib_Primavera.Model.SimpleProduct> GetFamilyProducts(string warehouseId, string familyId)
        {
            List<Lib_Primavera.Model.SimpleProduct> products = Lib_Primavera.PriIntegration.GetWarehouseProductsByFamily(warehouseId,familyId);
            return products;
        }
        /// <summary>
        /// TEST FUNCTION DO NOT USE
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Route("api/products/teste")]
        [HttpGet]
        public List<String> GetTeste(string id)
        {
            List<String> teste = Lib_Primavera.PriIntegration.GetTestes(id);
            return teste;
        }
        /// <summary>
        /// Makes a search based on the product description.
        /// </summary>
        /// <param name="query">The query to search</param>
        /// <returns>Products that match the query</returns>
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

