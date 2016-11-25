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
    public class DocVendaController : ApiController
    {
        //
        // GET: /Clientes/
        /// <summary>
        /// All Orders existing in the database
        /// </summary>
        /// <returns>List of orders</returns>
        public IEnumerable<Lib_Primavera.Model.DocVenda> Get()
        {
            return Lib_Primavera.PriIntegration.Encomendas_List();
        }


        /// <summary>
        /// Retrieves an Order by the id
        /// </summary>
        /// <param name="id">The document id</param>
        /// <returns>Document selected by the id</returns>
  
        public Lib_Primavera.Model.DocVenda Get(string id)
        {
            Lib_Primavera.Model.DocVenda docvenda = Lib_Primavera.PriIntegration.Encomenda_Get(id);
            if (docvenda == null)
            {
                throw new HttpResponseException(
                        Request.CreateResponse(HttpStatusCode.NotFound));

            }
            else
            {
                return docvenda;
            }
        }
        /// <summary>
        /// All orders of a client
        /// </summary>
        /// <param name="client">Client code</param>
        /// <returns>All order documents of a client</returns>
        [Route("api/orders/")]
        public HttpResponseMessage GetClientOrder(string client)
        {
            List<Lib_Primavera.Model.DocVenda> docvendas = Lib_Primavera.PriIntegration.Encomenda_GetClientsOrders(client);

            if (docvendas == null)
            {
                var message = string.Format("Document with id = {0} not found", client);
                HttpError err = new HttpError(message);
                return Request.CreateResponse(HttpStatusCode.NotFound, err);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, docvendas);
            }
        }
        /// <summary>
        /// Retrieves an order of a client by its id
        /// </summary>
        /// <param name="client">Client id</param>
        /// <param name="orderId">Order id</param>
        /// <returns>The order of the client</returns>
        [Route("api/orders/{client}")]
        public HttpResponseMessage GetClientOrder(string client,string orderId)
        {
            Lib_Primavera.Model.DocVenda docvendas = Lib_Primavera.PriIntegration.Encomenda_GetClientOrder(client,orderId);

            if (docvendas == null)
            {
                var message = string.Format("Document with id = {0} not found", client);
                HttpError err = new HttpError(message);
                return Request.CreateResponse(HttpStatusCode.NotFound, err);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, docvendas);
            }
        }
        /// <summary>
        /// Total number of orders of a client
        /// </summary>
        /// <param name="client">Client code</param>
        /// <returns>An integer with total number of orders of a client</returns>
        [Route("api/orders/{client}/total")]
        public HttpResponseMessage GetClientOrdersTotal(string client)
        {
            int total = Lib_Primavera.PriIntegration.Encomenda_GetClientsOrdersTotal(client);
            if(total == -1)
            {
                var message = string.Format("Client with client = {0} not found", client);
                HttpError err = new HttpError(message);
                return Request.CreateResponse(HttpStatusCode.NotFound, err);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, total);       
            }     
        }
        /// <summary>
        /// Orders of a client based on the number of pages and orders per page
        /// </summary>
        /// <param name="client">Client code</param>
        /// <param name="page">Page to see</param>
        /// <param name="numperpage">Number of orders per page</param>
        /// <returns></returns>
        [Route("api/orders/{client}")]
        public HttpResponseMessage GetClientOrdersByPage(string client, int page, int numperpage)
        {
            List<Lib_Primavera.Model.DocVenda> orders = Lib_Primavera.PriIntegration.Encomenda_GetClientsOrdersByPage(client,page,numperpage);

            if (orders == null)
            {
                var message = string.Format("Query with client = {0} and page = {0} and numperpage = {0} not found", client,page,numperpage);
                HttpError err = new HttpError(message);
                return Request.CreateResponse(HttpStatusCode.NotFound, err);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, orders);
            }
        }
        /// <summary>
        /// Creates an order
        /// </summary>
        /// <param name="dv">Order to create</param>
        /// <returns>Returns the id of the order created</returns>
        public HttpResponseMessage Post(Lib_Primavera.Model.DocVenda dv)
        {
            Lib_Primavera.Model.ResponseError erro = new Lib_Primavera.Model.ResponseError();
            erro = Lib_Primavera.PriIntegration.Encomendas_New(dv);

            if (erro.Erro == 0)
            {
                var response = Request.CreateResponse(
                   HttpStatusCode.Created, dv.id);
                string uri = Url.Link("DefaultApi", new {DocId = dv.id });
                response.Headers.Location = new Uri(uri);
                return response;
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

        }
    }
}
