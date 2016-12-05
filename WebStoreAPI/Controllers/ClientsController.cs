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
    public class ClientsController : ApiController
    {
        //
        // GET: /Clientes/

        /*public IEnumerable<Lib_Primavera.Model.SimpleClient> Get()
        {
                return Lib_Primavera.PriIntegration.ListaClientes();
        }

        [Route("api/clientes/{id}/cenas")]
        [HttpGet]
        public HttpResponseMessage GetCenas()
        {
            return Request.CreateResponse(HttpStatusCode.OK,"CARALHOOO");
        }
        */

        // GET api/cliente/5    
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
            else if (erro.Erro == 2)
            {
                var response = Request.CreateResponse(HttpStatusCode.Conflict, cliente);
                string uri = Url.Link("DefaultApi", new { CodCliente = cliente.CodClient });
                response.Headers.Location = new Uri(uri);
                return response;
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

        }


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

        [Route("api/clients/types")]
        public HttpResponseMessage GetClientTypes()
        {
            List<Lib_Primavera.Model.ClientType> types = null;
            types = Lib_Primavera.PriIntegration.GetClientTypes();
            if (types == null)
            {
                var message = string.Format("Something went wrong with getting types..");
                HttpError err = new HttpError(message);
                return Request.CreateResponse(HttpStatusCode.NotFound, err);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, types);
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
