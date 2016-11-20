using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebStoreAPI.Lib_Primavera.Model;


namespace WebStoreAPI.Controllers
{
    public class ProductsController : ApiController
    {

        /// <summary>
        /// Returns all the products existing in shop
        /// </summary>
        public IEnumerable<Lib_Primavera.Model.Product> Get()
        {
            return Lib_Primavera.PriIntegration.GetProducts();
        }


        // GET api/artigo/5    
        public Product Get(string id)
        {
            Lib_Primavera.Model.Product artigo = Lib_Primavera.PriIntegration.GetArtigo(id);
            if (artigo == null)
            {
                throw new HttpResponseException(
                  Request.CreateResponse(HttpStatusCode.NotFound));
            }
            else
            {
                return artigo;
            }
        }

    }
}

