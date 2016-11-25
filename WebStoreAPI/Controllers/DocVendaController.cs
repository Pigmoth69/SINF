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

        public IEnumerable<Lib_Primavera.Model.DocVenda> Get()
        {
            return Lib_Primavera.PriIntegration.Encomendas_List();
        }


        // GET api/DocVenda/{id}-> id do doc   
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




        public HttpResponseMessage Delete(string id)
        {


            Lib_Primavera.Model.ResponseError erro = new Lib_Primavera.Model.ResponseError();

            try
            {

                erro = Lib_Primavera.PriIntegration.DelCliente(id);

                if (erro.Erro == 0)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, erro.Descricao);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound, erro.Descricao);
                }

            }

            catch (Exception exc)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, erro.Descricao);

            }

        }
    }
}
