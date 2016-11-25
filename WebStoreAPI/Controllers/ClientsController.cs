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
    public class ClientsController : ApiController
    {
        //
        // GET: /Clientes/
        /// <summary>
        /// All clients existent in the ERP
        /// </summary>
        /// <returns>List of clients</returns>
        public IEnumerable<Lib_Primavera.Model.SimpleClient> Get()
        {
                return Lib_Primavera.PriIntegration.ListaClientes();
        }
        /// <summary>
        /// JUST TEST! DO NOT USE
        /// </summary>
        /// <returns></returns>
        [Route("api/clientes/{id}/cenas")]
        [HttpGet]
        public HttpResponseMessage GetCenas()
        {
            return Request.CreateResponse(HttpStatusCode.OK,"TEST");
        }

        
        // GET api/cliente/5    
        /// <summary>
        /// Retrieves a client with a certain code
        /// </summary>
        /// <param name="id">Code of the client</param>
        /// <returns>The client information</returns>
        public Client Get(string id)
        {
            Lib_Primavera.Model.Client cliente = Lib_Primavera.PriIntegration.GetCliente(id);


            if (cliente == null)
            {
                throw new HttpResponseException(
                        Request.CreateResponse(HttpStatusCode.NotFound));

            }
            else
            {
                return cliente;
            }
        }

        /// <summary>
        /// Creates a new Client
        /// </summary>
        /// <param name="cliente">Client body an information</param>
        /// <returns>Code of the client if success!</returns>
        public HttpResponseMessage Post(Lib_Primavera.Model.Client cliente)
        {
            Lib_Primavera.Model.ResponseError erro = new Lib_Primavera.Model.ResponseError();
            erro = Lib_Primavera.PriIntegration.InsereClienteObj(cliente);

            if (erro.Erro == 0)
            {
                var response = Request.CreateResponse(
                   HttpStatusCode.Created, cliente);
                string uri = Url.Link("DefaultApi", new { CodCliente = cliente.CodClient });
                response.Headers.Location = new Uri(uri);
                return response;
            }

            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

        }

        /// <summary>
        /// Updates a client information
        /// </summary>
        /// <param name="id">Client code</param>
        /// <param name="cliente">Client information to update</param>
        /// <returns>Returns OK or error with its information</returns>
        public HttpResponseMessage Put(string id, Lib_Primavera.Model.Client cliente)
        {

            Lib_Primavera.Model.ResponseError erro = new Lib_Primavera.Model.ResponseError();

            try
            {
                erro = Lib_Primavera.PriIntegration.UpdCliente(cliente);
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


        /// <summary>
        /// Delete a client with its id
        /// </summary>
        /// <param name="id">code of the client</param>
        /// <returns>OK if success, Error with information if failed</returns>
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
