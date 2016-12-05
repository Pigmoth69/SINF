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
    public class UtilsController : ApiController
    {


        [Route("api/utils/countries")]
        public HttpResponseMessage GetCountries()
        {
            List<Lib_Primavera.Model.Country> countries = null;
            countries = Lib_Primavera.PriIntegration.Utils_GetCountries();
            if (countries== null)
            {
                var message = string.Format("Something went wrong with getting countries..");
                HttpError err = new HttpError(message);
                return Request.CreateResponse(HttpStatusCode.NotFound, err);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, countries);
            }
        }
        [Route("api/utils/districts")]
        public HttpResponseMessage GetDistricts()
        {
            List<Lib_Primavera.Model.District> dist = null;
            dist = Lib_Primavera.PriIntegration.Utils_GetDistricts();
            if (dist == null)
            {
                var message = string.Format("Something went wrong with getting districts..");
                HttpError err = new HttpError(message);
                return Request.CreateResponse(HttpStatusCode.NotFound, err);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, dist);
            }
        }

        [Route("api/utils/paymenttypes")]
        public HttpResponseMessage GetPaymentTypes()
        {
            List<Lib_Primavera.Model.PaymentType> payment = null;
            payment = Lib_Primavera.PriIntegration.Utils_GetPaymentTypes();
            if (payment == null)
            {
                var message = string.Format("Something went wrong with getting payment types..");
                HttpError err = new HttpError(message);
                return Request.CreateResponse(HttpStatusCode.NotFound, err);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, payment);
            }
        }
        [Route("api/utils/paymentways")]
        public HttpResponseMessage GetPaymentWays()
        {
            List<Lib_Primavera.Model.PaymentWay> payment = null;
            payment = Lib_Primavera.PriIntegration.Utils_GetPaymentWays();
            if (payment == null)
            {
                var message = string.Format("Something went wrong with getting payment ways..");
                HttpError err = new HttpError(message);
                return Request.CreateResponse(HttpStatusCode.NotFound, err);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, payment);
            }
        }
        [Route("api/utils/expeditionway")]//[ModosExp]
        public HttpResponseMessage GetExpeditionWays()
        {
            List<Lib_Primavera.Model.ExpeditionWay> exp = null;
            exp = Lib_Primavera.PriIntegration.Utils_GetExpeditionWays();
            if (exp == null)
            {
                var message = string.Format("Something went wrong with getting expedition ways..");
                HttpError err = new HttpError(message);
                return Request.CreateResponse(HttpStatusCode.NotFound, err);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, exp);
            }
        }


    }
}
