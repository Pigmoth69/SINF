using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebStoreAPI.Lib_Primavera.Model
{
    public class DocVenda
    {

        public string id
        {
            get;
            set;
        }

        public Model.Client Client
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

        public double TotalMerc
        {
            get;
            set;
        }

        public string Serie
        {
            get;
            set;
        }

        public List<Model.LinhaDocVenda> LinhasDoc
        {
            get;
            set;
        }
 

    }
}