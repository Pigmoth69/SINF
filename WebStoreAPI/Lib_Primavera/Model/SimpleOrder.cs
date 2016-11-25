using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebStoreAPI.Lib_Primavera.Model
{
    public class SimpleOrder
    {
        public string id
        {
            get;
            set;
        }

        public string Entidade
        {
            get;
            set;
        }

        public int NumDoc
        {
            get;
            set;
        }

        public DateTime Data
        {
            get;
            set;
        }
    }
}