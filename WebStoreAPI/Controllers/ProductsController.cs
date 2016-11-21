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

        [Route("api/products")]
        [HttpGet]
        public IEnumerable<Lib_Primavera.Model.Product> Get()
        {
            return Lib_Primavera.PriIntegration.GetProducts();
        }


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

        [Route("api/products/families")]
        [HttpGet]
        public List<String> GetFamilies()
        {
            List<String> families = Lib_Primavera.PriIntegration.GetFamilies();
            return families;
        }

    }
}

