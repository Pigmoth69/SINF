using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace WebStoreAPI.Controllers
{
    public class WarehouseController : ApiController
    {
        /// <summary>
        /// Returns all existing warehouses
        /// </summary>
        public IEnumerable<Lib_Primavera.Model.Warehouse> Get()
        {
            return Lib_Primavera.PriIntegration.GetWarehouses();
        }
        /// <summary>
        /// Retrieves all the products and its stocks of a certain warehouse
        /// </summary>
        /// <param name="warehouseId">The warehouse code id</param>
        /// <returns>All the products of the warehouse</returns>
        public HttpResponseMessage Get(String warehouseId)
        {
            IEnumerable<Lib_Primavera.Model.SimpleProduct> productsWarehouse = Lib_Primavera.PriIntegration.GetProductWarehouse(warehouseId);
            if (productsWarehouse == null)
            {
                var message = string.Format("No warehouse found with warehouseId = {0} not found", warehouseId);
                HttpError err = new HttpError(message);
                return Request.CreateResponse(HttpStatusCode.NotFound, err);
            }
            else if (productsWarehouse.Count() == 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, "No products on warehouse!");
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, productsWarehouse);
            }
        }
    }
}
